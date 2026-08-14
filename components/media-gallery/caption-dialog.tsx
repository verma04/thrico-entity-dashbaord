"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquareText } from "lucide-react";
import { useUpdateMediaGalleryImage } from "@/graphql/actions/mediaGallery";

export function CaptionDialog({
  open,
  image,
  albumId,
  onClose,
  onSaved,
}: {
  open: boolean;
  image: any;
  albumId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [caption, setCaption] = useState("");
  const [updateImage] = useUpdateMediaGalleryImage(albumId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCaption(image?.caption ?? "");
  }, [image]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateImage({ variables: { id: image.id, input: { caption } } });
      toast.success("Caption updated successfully");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save caption");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-6 border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
              <MessageSquareText className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Edit Photo Caption
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            Add context or credits displayed below this image in the lightbox.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="caption-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Caption Text
          </Label>
          <Input
            id="caption-input"
            placeholder="Add descriptive caption or credits…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="h-9 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-9 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            {saving ? "Saving…" : "Save Caption"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
