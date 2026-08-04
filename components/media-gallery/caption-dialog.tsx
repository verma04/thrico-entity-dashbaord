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
} from "@/components/ui/dialog";
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
      toast.success("Caption saved");
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Caption</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="caption-input">Caption</Label>
          <Input
            id="caption-input"
            placeholder="Add a caption for this image…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Caption"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
