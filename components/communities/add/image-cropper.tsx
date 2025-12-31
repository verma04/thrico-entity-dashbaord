"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Check, X } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: any, croppedUrl: string) => void;
  onCancel: () => void;
  cropModalVisible: boolean;
}

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  cropModalVisible,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteCallback = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleDone = async () => {
    console.log(image);
    const croppedUrl = await getCroppedImg(image, croppedAreaPixels);
    const blob = await base64ToWebpBlob(croppedUrl);
    const croppedImage = new File([blob], "image.webp", { type: "image/webp" });

    if (croppedUrl) {
      onCropComplete(croppedImage, croppedUrl);
    }
  };

  return (
    <Dialog open={cropModalVisible} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        <div className="mt-4">
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleDone} className="gap-2">
            <Check className="h-4 w-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas context not found");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = reject;
  });
};

function base64ToWebpBlob(base64: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error");

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject("Conversion to webp failed");
        }
      }, "image/webp");
    };

    img.onerror = (err) => reject(err);
  });
}
