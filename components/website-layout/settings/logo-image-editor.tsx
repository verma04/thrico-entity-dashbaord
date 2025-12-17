"use client";

import React, { useState, useRef } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Crop as CropIcon, Check, Image as ImageIcon, Loader2 } from "lucide-react";
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

interface LogoImageEditorProps {
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
  recommendedWidth?: number;
  recommendedHeight?: number;
  aspectRatio?: number;
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

export const LogoImageEditor = ({
  currentImage,
  onImageUpdate,
  recommendedWidth = 150,
  recommendedHeight = 50,
  aspectRatio,
}: LogoImageEditorProps) => {
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
          description: "Logo uploaded successfully!",
        });
        setIsEditorOpen(false);
        setImgSrc("");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        const file = new File([croppedBlob], "logo.png", {
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
      <div className="space-y-2">
        <Label>Logo Image</Label>
        
        {currentImage ? (
          <div className="space-y-3">
            <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
              <img
                src={currentImage}
                alt="Logo"
                className="max-h-20 object-contain"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
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
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              "hover:border-primary/50 hover:bg-primary/5"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-primary">Upload Logo</p>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: {recommendedWidth}x{recommendedHeight}px
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl z-[9999]">
          <DialogHeader>
            <DialogTitle>Edit Logo Image</DialogTitle>
            <DialogDescription>
              Crop and resize your logo to the desired dimensions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Dimension Controls */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  min={10}
                  max={1000}
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
                  max={1000}
                />
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">
                  Recommended: {recommendedWidth}x{recommendedHeight}px
                </p>
              </div>
            </div>

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
              {uploading ? "Uploading..." : "Save Logo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

