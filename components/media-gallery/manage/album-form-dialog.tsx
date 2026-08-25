"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
      <DialogContent className="sm:max-w-md p-5 border border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 shadow-lg">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-7 w-7 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 flex items-center justify-center border border-[#d2d5d9] dark:border-zinc-700">
              <ImageIcon className="h-3.5 w-3.5" />
            </div>
            <DialogTitle className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100">
              {editingAlbum ? "Edit Album Details" : "Create Media Album"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[12px] text-[#616161] dark:text-zinc-400">
            {editingAlbum
              ? "Update album metadata, cover photography, and featured highlight status."
              : "Organize photos, event highlights, and community media into an album."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* Cover Image Upload Box */}
          <div className="space-y-1.5">
            <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
              Album Cover Image{" "}
              <span className="text-[#616161] font-normal">(Optional)</span>
            </label>
            <div
              className="relative h-32 rounded-[8px] border-2 border-dashed border-[#d2d5d9] hover:border-[#aeb4b9] bg-[#f6f6f7]/60 dark:bg-zinc-800/40 cursor-pointer overflow-hidden transition-all group flex items-center justify-center"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <>
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2.5 py-1 rounded-[4px] bg-white text-[#303030] text-[11.5px] font-bold shadow-xs">
                      Change Cover
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-1 text-[#616161]">
                  <div className="h-7 w-7 rounded-[4px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] flex items-center justify-center">
                    <ImageIcon className="w-3.5 h-3.5 text-[#616161]" />
                  </div>
                  <span className="text-[12px] font-medium text-[#303030] dark:text-zinc-200">
                    Click to select cover image
                  </span>
                  <span className="text-[10.5px] text-[#8c9196]">
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
            <label
              htmlFor="album-title"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
            >
              Album Title <span className="text-[#d72c0d] ml-0.5">*</span>
            </label>
            <Input
              id="album-title"
              placeholder="e.g., Annual Summit 2026 Highlights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="album-description"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
            >
              Description & Context
            </label>
            <Textarea
              id="album-description"
              placeholder="Describe event context, photographer credits, or album themes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="min-h-[70px] p-3 text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] resize-none"
            />
          </div>

          {/* Featured Toggle Card */}
          <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
            <div className="space-y-0.5">
              <label
                htmlFor="album-featured"
                className="text-[13px] font-semibold text-[#303030] dark:text-zinc-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5",
                    isFeatured
                      ? "text-amber-500 fill-amber-500"
                      : "text-[#8c9196]",
                  )}
                />
                Featured Album
              </label>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
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

        <DialogFooter className="gap-2 sm:gap-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="h-8 px-3 text-[12px] font-semibold rounded-[6px] border-[#d2d5d9] text-[#303030] bg-white hover:bg-[#f6f6f7]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-8 px-3.5 text-[12px] font-semibold rounded-[6px] bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
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
