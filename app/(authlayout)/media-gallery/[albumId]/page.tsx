"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Trash2,
  Loader2,
  Video as VideoIcon,
  Upload,
  CheckSquare,
  XSquare,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
  useGetMediaGalleryAlbum,
  useDeleteMediaGalleryImage,
  useReorderMediaGalleryImages,
} from "@/graphql/actions/mediaGallery";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CommentsPanel } from "@/components/media-gallery/comments-panel";
import {
  SortableImageCard,
  type MediaGalleryImageItem,
} from "@/components/media-gallery/sortable-image-card";
import { UploadZone } from "@/components/media-gallery/upload-zone";
import { VideoUploadDialog } from "@/components/media-gallery/video-upload-dialog";
import { CaptionDialog } from "@/components/media-gallery/caption-dialog";
import { MultiGalleryUploadDialog } from "@/components/media-gallery/multi-gallery-upload-dialog";
import { LinkUploadDialog } from "@/components/media-gallery/link-upload-dialog";

export default function AlbumDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const albumId = params.albumId as string;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          p.delete(key);
        } else {
          p.set(key, value);
        }
      }
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, loading, refetch } = useGetMediaGalleryAlbum(albumId);
  const [deleteImage] = useDeleteMediaGalleryImage(albumId);
  const [reorderImages] = useReorderMediaGalleryImages();

  const [images, setImages] = useState<MediaGalleryImageItem[]>([]);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [commentImageId, setCommentImageId] = useState<string | null>(null);
  const [captionImage, setCaptionImage] =
    useState<MediaGalleryImageItem | null>(null);

  // Bulk Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set(),
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [showLinkUploadModal, setShowLinkUploadModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const album = data?.getMediaGalleryAlbum;

  useEffect(() => {
    if (album?.images) {
      setImages([...album.images]);
    }
  }, [album]);

  const filteredImages = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return images;
    return images.filter(
      (img) =>
        img.caption?.toLowerCase().includes(q) ||
        img.fileName?.toLowerCase().includes(q) ||
        img.url?.toLowerCase().includes(q),
    );
  }, [images, debouncedSearch]);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (isSelectionMode) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    setImages(reordered);

    try {
      await reorderImages({
        variables: {
          albumId,
          input: reordered.map((img, idx) => ({ id: img.id, order: idx })),
        },
      });
      toast.success("Image order saved");
    } catch {
      toast.error("Failed to save order");
      refetch();
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId) return;
    setIsDeletingSingle(true);
    try {
      await deleteImage({ variables: { id: deleteImageId } });
      toast.success("Image deleted");
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to delete image");
    } finally {
      setIsDeletingSingle(false);
      setDeleteImageId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImageIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedImageIds).map((id) =>
          deleteImage({ variables: { id } }),
        ),
      );
      toast.success(`${selectedImageIds.size} images deleted`);
      clearSelection();
      setIsSelectionMode(false);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to delete some images");
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedImageIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedImageIds(new Set(images.map((i) => i.id)));
  };

  const clearSelection = () => {
    setSelectedImageIds(new Set());
  };

  return (
    <EcosystemWrapper>
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search images in album…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {!loading && images.length > 0 && (
            <>
              {isSelectionMode ? (
                <>
                  <EcosystemActionBar.Item>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {selectedImageIds.size} selected
                    </span>
                  </EcosystemActionBar.Item>
                  <EcosystemActionBar.Item>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-medium border-[#d2d5d9] dark:border-zinc-700"
                      onClick={
                        selectedImageIds.size === images.length
                          ? clearSelection
                          : selectAll
                      }
                    >
                      {selectedImageIds.size === images.length ? (
                        <XSquare className="w-3.5 h-3.5 mr-1.5" />
                      ) : (
                        <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {selectedImageIds.size === images.length
                        ? "Clear"
                        : "Select All"}
                    </Button>
                  </EcosystemActionBar.Item>
                  <EcosystemActionBar.Item>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs font-medium shadow-2xs"
                      onClick={() => setShowBulkDeleteDialog(true)}
                      disabled={selectedImageIds.size === 0}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete Selected
                    </Button>
                  </EcosystemActionBar.Item>
                  <EcosystemActionBar.Item>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-medium"
                      onClick={() => {
                        setIsSelectionMode(false);
                        clearSelection();
                      }}
                    >
                      Cancel
                    </Button>
                  </EcosystemActionBar.Item>
                </>
              ) : (
                <EcosystemActionBar.Item>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium border-[#d2d5d9] dark:border-zinc-700"
                    onClick={() => setIsSelectionMode(true)}
                  >
                    <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                    Select
                  </Button>
                </EcosystemActionBar.Item>
              )}
            </>
          )}
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Item>
          <CtaButton
            size="sm"
            variant="outline"
            onClick={() => setShowPhotoUploadModal(true)}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            Upload Photos
          </CtaButton>
        </EcosystemActionBar.Item>
        <EcosystemActionBar.Item>
          <CtaButton
            size="sm"
            variant="outline"
            onClick={() => setShowVideoUploadModal(true)}
          >
            <VideoIcon className="w-3.5 h-3.5 text-indigo-500" />
            Upload Video
          </CtaButton>
        </EcosystemActionBar.Item>
        <EcosystemActionBar.Item>
          <CtaButton
            size="sm"
            onClick={() => setShowLinkUploadModal(true)}
          >
            <Link2 className="w-3.5 h-3.5" />
            Add Link
          </CtaButton>
        </EcosystemActionBar.Item>
        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredImages.length > 0}>
            Showing {filteredImages.length} of {images.length} Media
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4 space-y-6">
          {/* Image Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="aspect-square rounded-[10px] bg-muted/60"
                />
              ))}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredImages.map((i) => i.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredImages.map((image) => (
                    <SortableImageCard
                      key={image.id}
                      image={image}
                      onDelete={(id) => setDeleteImageId(id)}
                      onViewComments={(id) => setCommentImageId(id)}
                      onEditCaption={(img) => setCaptionImage(img)}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedImageIds.has(image.id)}
                      onToggleSelect={() => toggleSelection(image.id)}
                    />
                  ))}

                  {/* Upload Zone */}
                  {!isSelectionMode && (
                    <UploadZone
                      albumId={albumId}
                      imageCount={images.length}
                      onUploaded={refetch}
                    />
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Delete Single Image Alert Dialog (Pattern C: Modal Dialog) */}
          <AlertDialog
            open={!!deleteImageId}
            onOpenChange={() => setDeleteImageId(null)}
          >
            <AlertDialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
              <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/40">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <AlertDialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                      Delete Media Item?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                      Permanently remove this photo and its comments
                    </AlertDialogDescription>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#616161] dark:text-zinc-400 leading-relaxed">
                  This action cannot be undone. The media file will be removed from S3 storage and detached from this album.
                </p>
              </div>
              <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
                <AlertDialogCancel
                  disabled={isDeletingSingle}
                  className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 m-0"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteImage();
                  }}
                  disabled={isDeletingSingle}
                  className="h-8.5 px-4 text-xs font-medium bg-red-600 hover:bg-red-700 text-white shadow-2xs m-0"
                >
                  {isDeletingSingle && (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  )}
                  {isDeletingSingle ? "Deleting..." : "Delete Media"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Bulk Delete Alert Dialog (Pattern C: Modal Dialog) */}
          <AlertDialog
            open={showBulkDeleteDialog}
            onOpenChange={(open) => {
              if (!open && !isBulkDeleting) setShowBulkDeleteDialog(false);
            }}
          >
            <AlertDialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
              <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/40">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <AlertDialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                      Delete {selectedImageIds.size} Media Items?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                      Bulk remove selected media files from this album
                    </AlertDialogDescription>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#616161] dark:text-zinc-400 leading-relaxed">
                  This action will permanently delete {selectedImageIds.size} media file(s) and all their associated comments. This cannot be undone.
                </p>
              </div>
              <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
                <AlertDialogCancel
                  disabled={isBulkDeleting}
                  className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 m-0"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleBulkDelete();
                  }}
                  disabled={isBulkDeleting}
                  className="h-8.5 px-4 text-xs font-medium bg-red-600 hover:bg-red-700 text-white shadow-2xs m-0"
                >
                  {isBulkDeleting && (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  )}
                  {isBulkDeleting ? "Deleting..." : "Delete Media Items"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Caption Edit Dialog */}
          {captionImage && (
            <CaptionDialog
              open={!!captionImage}
              image={captionImage}
              albumId={albumId}
              onClose={() => setCaptionImage(null)}
              onSaved={refetch}
            />
          )}

          {/* Comments Panel */}
          <CommentsPanel
            imageId={commentImageId}
            open={!!commentImageId}
            onClose={() => setCommentImageId(null)}
          />
        </div>
      </EcosystemContainer>

      <VideoUploadDialog
        open={showVideoUploadModal}
        onOpenChange={setShowVideoUploadModal}
        albumId={albumId}
        currentCount={images.length}
        onUploaded={refetch}
      />

      <MultiGalleryUploadDialog
        open={showPhotoUploadModal}
        onOpenChange={setShowPhotoUploadModal}
        currentAlbumId={albumId}
        onUploaded={() => refetch()}
      />

      <LinkUploadDialog
        open={showLinkUploadModal}
        onOpenChange={setShowLinkUploadModal}
        currentAlbumId={albumId}
        onUploaded={() => refetch()}
      />
    </EcosystemWrapper>
  );
}
