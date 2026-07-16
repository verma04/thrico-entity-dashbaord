"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Images,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Image as ImageIcon,
  LayoutGrid,
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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useGetMediaGalleryAlbums,
  useCreateMediaGalleryAlbum,
  useUpdateMediaGalleryAlbum,
  useDeleteMediaGalleryAlbum,
  useReorderMediaGalleryAlbums,
} from "@/graphql/actions/mediaGallery";

// ─── Sortable Album Card ────────────────────────────────────────────────────────
function SortableAlbumCard({
  album,
  onEdit,
  onDelete,
  onClick,
}: {
  album: any;
  onEdit: (album: any) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-200 bg-white">
        {/* Cover Image / Placeholder */}
        <div
          className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer overflow-hidden"
          onClick={() => onClick(album?.id)}
        >
          {album?.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://cdn.thrico.network/${album?.coverImage}`}
              alt={album?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
              <ImageIcon className="w-12 h-12" />
              <span className="text-xs text-gray-400">No images yet</span>
            </div>
          )}
          {/* Image count badge */}
          <div className="absolute bottom-2 right-2">
            <Badge
              variant="secondary"
              className="bg-black/60 text-white border-0 text-xs"
            >
              <LayoutGrid className="w-3 h-3 mr-1" />
              {album?.imageCount ?? 0}
            </Badge>
          </div>
          {album?.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 text-white border-0 text-xs">
                <Star className="w-3 h-3 mr-1 fill-white" />
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-gray-900 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => onClick(album?.id)}
              >
                {album?.title}
              </h3>
              {album?.description && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  {album?.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Drag handle */}
              <button
                {...attributes}
                {...listeners}
                className="p-1.5 rounded-md text-gray-300 hover:text-gray-600 hover:bg-gray-100 cursor-grab transition-colors"
              >
                <GripVertical className="w-4 h-4" />
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                onClick={() => onEdit(album)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(album?.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Album Form Dialog ─────────────────────────────────────────────────────────
function AlbumFormDialog({
  open,
  onClose,
  editingAlbum,
  albumCount,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  editingAlbum: any | null;
  albumCount: number;
  onCreate: (input: any) => Promise<void>;
  onUpdate: (id: string, input: any) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(editingAlbum?.title ?? "");
      setDescription(editingAlbum?.description ?? "");
      setIsFeatured(editingAlbum?.isFeatured ?? false);
      setCoverFile(null);
      setCoverPreview(
        editingAlbum?.coverImage
          ? `https://cdn.thrico.network/${editingAlbum.coverImage}`
          : null,
      );
    }
  }, [open, editingAlbum]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Album title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingAlbum) {
        await onUpdate(editingAlbum?.id, {
          title,
          description,
          isFeatured,
          coverImageUpload: coverFile || undefined,
        });
        toast.success("Album updated");
      } else {
        await onCreate({
          title,
          description,
          isFeatured,
          order: albumCount,
          coverImageUpload: coverFile || undefined,
        });
        toast.success("Album created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save album");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAlbum ? "Edit Album" : "Create New Album"}
          </DialogTitle>
          <DialogDescription>
            {editingAlbum
              ? "Update the album details below."
              : "Create a new photo album for your media gallery."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Cover Image Upload */}
          <div className="space-y-1.5">
            <Label>Cover Image</Label>
            <div
              className="relative h-36 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 bg-gray-50 cursor-pointer overflow-hidden transition-colors"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Change Cover
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1.5 text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs">Click to upload cover image</span>
                </div>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="album-title">Title *</Label>
            <Input
              id="album-title"
              placeholder="e.g., Annual Conference 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="album-description">Description</Label>
            <Textarea
              id="album-description"
              placeholder="Describe what this album is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 p-3">
            <div>
              <Label
                htmlFor="album-featured"
                className="text-sm font-medium text-amber-800"
              >
                Featured Album
              </Label>
              <p className="text-xs text-amber-600 mt-0.5">
                Featured albums are highlighted to users
              </p>
            </div>
            <Switch
              id="album-featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving
              ? "Saving…"
              : editingAlbum
                ? "Save Changes"
                : "Create Album"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MediaGalleryPage() {
  const router = useRouter();
  const { data, loading, refetch } = useGetMediaGalleryAlbums();
  const [createAlbum] = useCreateMediaGalleryAlbum();
  const [updateAlbum] = useUpdateMediaGalleryAlbum();
  const [deleteAlbum] = useDeleteMediaGalleryAlbum();
  const [reorderAlbums] = useReorderMediaGalleryAlbums();

  const [albums, setAlbums] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (data?.getMediaGalleryAlbums) {
      setAlbums([...data.getMediaGalleryAlbums]);
    }
  }, [data]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = albums.findIndex((a) => a.id === active.id);
    const newIndex = albums.findIndex((a) => a.id === over.id);
    const newAlbums = arrayMove(albums, oldIndex, newIndex);
    setAlbums(newAlbums);

    try {
      await reorderAlbums({
        variables: {
          input: newAlbums.map((a, i) => ({ id: a.id, order: i })),
        },
      });
      toast.success("Album order saved");
    } catch {
      toast.error("Failed to save order");
      refetch();
    }
  };

  const handleCreate = async (input: any) => {
    await createAlbum({ variables: { input } });
    refetch();
  };

  const handleUpdate = async (id: string, input: any) => {
    await updateAlbum({ variables: { id, input } });
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAlbum({ variables: { id: deleteId } });
      toast.success("Album deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete album");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          icon={Images}
          title="Media Gallery"
          description="Manage photo albums, upload images, and control the gallery experience"
        />
        <Button
          onClick={() => {
            setEditingAlbum(null);
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Album
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
          <Images className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No albums yet</h3>
          <p className="mt-1 text-sm text-gray-400 max-w-xs">
            Create your first photo album to start building your media gallery.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setEditingAlbum(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={albums.map((a) => a.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {albums.map((album) => (
                <SortableAlbumCard
                  key={album?.id}
                  album={album}
                  onClick={(id) => router.push(`/media-gallery/${id}`)}
                  onEdit={(a) => {
                    setEditingAlbum(a);
                    setIsFormOpen(true);
                  }}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create / Edit Form */}
      <AlbumFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingAlbum={editingAlbum}
        albumCount={albums.length}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the album and all its images and
              comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Album
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
