"use client";

import React from "react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

import { resolveCdnUrl } from "@/lib/shop-utils";

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  returnKeyOnly?: boolean;
  recommendedWidth?: number;
  recommendedHeight?: number;
}

export function MultiImageUpload({
  images = [],
  onImagesChange,
  maxImages = 5,
  returnKeyOnly = false,
  recommendedWidth = 2048,
  recommendedHeight = 2048,
}: MultiImageUploadProps) {
  const handleAddImage = (url: string) => {
    onImagesChange([...images, url]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-lg overflow-hidden border bg-background"
          >
            <img
              src={resolveCdnUrl(url)}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="aspect-square">
            <ImageUploadWithCrop
              currentImage=""
              onImageUpdate={handleAddImage}
              label=""
              uploadButtonText="Add Image"
              aspectRatio={1}
              className="h-full"
              dropzoneClassName="h-full flex flex-col items-center justify-center border-dashed"
              showDimensions={false}
              hideRecommendedSize
              returnKeyOnly={returnKeyOnly}
              recommendedWidth={recommendedWidth}
              recommendedHeight={recommendedHeight}
            />
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Maximum {maxImages} images.
      </p>
    </div>
  );
}
