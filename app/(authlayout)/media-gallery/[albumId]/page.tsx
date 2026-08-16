"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Pencil,
  MessageCircle,
  X,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  useGetMediaGalleryAlbum,
  useDeleteMediaGalleryImage,
  useReorderMediaGalleryImages,
} from "@/graphql/actions/mediaGallery";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckSquare, XSquare } from "lucide-react";

import { CommentsPanel } from "@/components/media-gallery/comments-panel";
import { SortableImageCard } from "@/components/media-gallery/sortable-image-card";
import { UploadZone } from "@/components/media-gallery/upload-zone";
import { CaptionDialog } from "@/components/media-gallery/caption-dialog";
import { cn } from "@/lib/utils";

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

  const [images, setImages] = useState<any[]>([]);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [commentImageId, setCommentImageId] = useState<string | null>(null);
  const [captionImage, setCaptionImage] = useState<any | null>(null);

  // Bulk Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set(),
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

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
    } catch (err: any) {
      toast.error(err.message || "Failed to delete image");
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
    } catch (err: any) {
      toast.error(err.message || "Failed to delete some images");
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
      <EcosystemHeader
        title={loading ? "Loading…" : (album?.title ?? "Album")}
        description={album?.description ?? `${images.length} images`}
        badgeText="Album"
        icon={ImageIcon}
        breadcrumbs={[
          { label: "Media Gallery", href: "/media-gallery" },
          { label: loading ? "Loading..." : (album?.title ?? "Album") }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
          </div>
        }
      />
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
                      className="h-8 text-xs font-semibold"
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
                      className="h-8 text-xs font-semibold"
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
                      className="h-8 text-xs font-semibold"
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
                    className="h-8 text-xs font-semibold"
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
            <Skeleton key={i} className="aspect-square rounded-xl" />
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
                  albumId={albumId}
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

      {/* Delete Single Image Alert */}
      <AlertDialog
        open={!!deleteImageId}
        onOpenChange={() => setDeleteImageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSingle}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteImage();
              }}
              disabled={isDeletingSingle}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingSingle ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isDeletingSingle ? "Deleting..." : "Delete Image"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={(open) => {
          if (!open && !isBulkDeleting) setShowBulkDeleteDialog(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedImageIds.size} Images?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedImageIds.size} image(s) and
              all their comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
              }}
              disabled={isBulkDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isBulkDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isBulkDeleting ? "Deleting..." : "Delete Images"}
            </AlertDialogAction>
          </AlertDialogFooter>
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
    </EcosystemWrapper>
  );
}
