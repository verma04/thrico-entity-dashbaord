"use client";

import React, { useState, useRef } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUploadImage } from "@/graphql/actions";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadWithCropProps {
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
  label?: string;
  recommendedWidth?: number;
  recommendedHeight?: number;
  aspectRatio?: number;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  showDimensions?: boolean;
  className?: string;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const ImageUploadWithCrop = ({
  currentImage,
  onImageUpdate,
  label = "Image",
  recommendedWidth = 150,
  recommendedHeight = 150,
  aspectRatio,
  maxFileSize = 5,
  allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  showDimensions = true,
  className,
}: ImageUploadWithCropProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [customWidth, setCustomWidth] = useState(recommendedWidth);
  const [customHeight, setCustomHeight] = useState(recommendedHeight);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [uploadImage, { loading: uploading }] = useUploadImage({
    onCompleted: (data: any) => {
      if (data?.uploadImage) {
        const cdnUrl = `https://cdn.thrico.network/${data.uploadImage}`;
        onImageUpdate(cdnUrl);
        toast({
          title: "Success",
          description: `${label} uploaded successfully!`,
        });
        setIsEditorOpen(false);
        setImgSrc("");
        // Reset file input to allow uploading new images
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to upload ${label.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedFormats.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload ${allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} files only`,
        variant: "destructive",
      });
      return false;
    }

    // Check file size
    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > maxFileSize) {
      toast({
        title: "File too large",
        description: `Image must be smaller than ${maxFileSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setIsEditorOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = aspectRatio || width / height;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const getCroppedImg = async (): Promise<Blob | null> => {
    const image = imgRef.current;
    const crop = completedCrop;

    if (!image || !crop) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = customWidth;
    canvas.height = customHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      customWidth,
      customHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg();
      if (croppedBlob) {
        const file = new File([croppedBlob], `${label.toLowerCase().replace(/\s+/g, '-')}.png`, {
          type: "image/png",
        });
        await uploadImage({ variables: { file } });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    onImageUpdate("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label}</Label>}
        
        {currentImage ? (
          <div className="space-y-3">
            <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
              <img
                src={currentImage}
                alt={label}
                className="max-h-32 max-w-full object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              "hover:border-primary/50 hover:bg-primary/5",
              uploading && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-primary">Upload {label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: {recommendedWidth}x{recommendedHeight}px
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Max size: {maxFileSize}MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl z-[9999]">
          <DialogHeader>
            <DialogTitle>Edit {label}</DialogTitle>
            <DialogDescription>
              Crop and resize your image to the desired dimensions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Dimension Controls */}
            {showDimensions && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={10}
                    max={2000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={10}
                    max={2000}
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Recommended: {recommendedWidth}x{recommendedHeight}px
                  </p>
                </div>
              </div>
            )}

            {/* Crop Area */}
            <div className="max-h-[400px] overflow-auto border rounded-lg bg-muted/30 flex items-center justify-center p-4">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-w-full"
                  />
                </ReactCrop>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditorOpen(false);
                setImgSrc("");
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!completedCrop || uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {uploading ? "Uploading..." : `Save ${label}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
