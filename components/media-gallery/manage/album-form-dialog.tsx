"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AlbumFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingAlbum: any | null;
  albumCount: number;
  onCreate: (input: any) => Promise<void>;
  onUpdate: (id: string, input: any) => Promise<void>;
}

export function AlbumFormDialog({
  open,
  onClose,
  editingAlbum,
  albumCount,
  onCreate,
  onUpdate,
}: AlbumFormDialogProps) {
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
          ? editingAlbum.coverImage.startsWith("http")
            ? editingAlbum.coverImage
            : `https://cdn.thrico.network/${editingAlbum.coverImage}`
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
        toast.success("Album updated successfully");
      } else {
        await onCreate({
          title,
          description,
          isFeatured,
          order: albumCount,
          coverImageUpload: coverFile || undefined,
        });
        toast.success("Album created successfully");
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
      <DialogContent className="sm:max-w-md p-6 border-border">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ImageIcon className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {editingAlbum ? "Edit Album Details" : "Create Media Album"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {editingAlbum
              ? "Update the album metadata, cover photography, and featured status."
              : "Organize photos, event highlights, and community media into an album."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Cover Image Upload Box */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Album Cover Image (Optional)
            </Label>
            <div
              className="relative h-36 rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-muted/20 cursor-pointer overflow-hidden transition-all group flex items-center justify-center"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <span className="px-3 py-1 rounded-full bg-white text-zinc-900 text-xs font-bold shadow-md">
                      Change Cover
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Click to select cover image
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    PNG, JPG, WEBP (16:9 or 4:3 recommended)
                  </span>
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

          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="album-title"
              className="text-xs font-semibold text-foreground"
            >
              Album Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="album-title"
              placeholder="e.g., Annual Summit 2026 Highlights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 bg-card border-border text-xs font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="album-description"
              className="text-xs font-semibold text-foreground"
            >
              Description & Context
            </Label>
            <Textarea
              id="album-description"
              placeholder="Describe event context, photographer credits, or album themes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="min-h-[80px] bg-card border-border text-xs font-medium resize-none shadow-none"
            />
          </div>

          {/* Featured Toggle Card */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
            <div className="space-y-0.5">
              <Label
                htmlFor="album-featured"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5",
                    isFeatured
                      ? "text-amber-500 fill-amber-500"
                      : "text-muted-foreground",
                  )}
                />
                Featured Album
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Highlight this album prominently in the gallery collection.
              </p>
            </div>
            <Switch
              id="album-featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="h-8 text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-8 text-xs font-medium"
          >
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

export default AlbumFormDialog;
