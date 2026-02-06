"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ProductPicker } from "@/components/shop/product-picker";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BannerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    image: string;
    linkedProductId?: string | null;
  }) => Promise<void>;
  isLoading: boolean;
}

export function BannerDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}: BannerDialogProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const handleAddBanner = async () => {
    if (!newTitle || !newImage) {
      toast.error("Please add an image and a title.");
      return;
    }

    try {
      await onSubmit({
        title: newTitle,
        image: newImage,
        linkedProductId: selectedProductId || null,
      });
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      // Error handled by parent usually, but just in case
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewImage("");
    setSelectedProductId("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Banner</DialogTitle>
          <DialogDescription>
            Upload an image and link it to a product. Minimum 1536x1024px
            recommended (3:2 ratio).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Banner Image{" "}
              <span className="text-destructive font-bold text-lg leading-none">
                *
              </span>
            </Label>
            <ImageUploadWithCrop
              currentImage={newImage}
              onImageUpdate={setNewImage}
              aspectRatio={3 / 2}
              recommendedWidth={1536}
              recommendedHeight={1024}
              label=""
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1.5">
              Headline{" "}
              <span className="text-destructive font-bold text-lg leading-none">
                *
              </span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Summer Sale 50% Off"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Product Link */}
          <div className="space-y-2">
            <Label>Link to Product (Optional)</Label>
            <ProductPicker
              value={selectedProductId}
              onSelect={(id) => {
                setSelectedProductId(id);
              }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAddBanner} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Banner"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
