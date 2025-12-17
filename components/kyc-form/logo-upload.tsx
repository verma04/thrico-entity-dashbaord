"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Loader2,
  LayoutList as PlusOutlined,
  Crop,
  Check,
  X,
} from "lucide-react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop as CropType,
  PixelCrop,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "react-image-crop/dist/ReactCrop.css";

interface LogoUploadProps {
  imageUrl?: string;
  setImageUrl: (url: string) => void;
  setCover: (file: File) => void;
  buttonText?: string;
  aspectRatio?: number; // Optional aspect ratio for crop (width/height)
}

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

const beforeUpload = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    alert("You can only upload JPG, PNG, or WEBP files!");
    return false;
  }

  if (file.size / 1024 / 1024 > 2) {
    alert("Image must be smaller than 2MB!");
    return false;
  }

  return true;
};

// Helper function to create a cropped image
const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Canvas is empty");
        }
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      },
      "image/jpeg",
      0.9
    );
  });
};

const LogoUpload: React.FC<LogoUploadProps> = ({
  imageUrl,
  setImageUrl,
  setCover,
  buttonText = "Upload Logo",
  aspectRatio = 1, // Default to square crop
}) => {
  const [loading, setLoading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 80,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!beforeUpload(file)) return;

    setLoading(true);
    try {
      setOriginalFile(file);
      const preview = await getBase64(file);
      setOriginalImage(preview);
      setShowCropModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !originalFile) return;

    setLoading(true);
    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        originalFile.name
      );

      setCover(croppedFile);
      const preview = await getBase64(croppedFile);
      setImageUrl(preview);
      setShowCropModal(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setOriginalImage("");
    setOriginalFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Logo</label>

        <label className="cursor-pointer block">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            disabled={loading}
          />

          <div className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent transition-colors">
            {imageUrl ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="logo"
                  className="w-full h-24 object-contain"
                />
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Crop className="h-3 w-3" />
                  Cropped
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <PlusOutlined className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="text-sm font-medium">{buttonText}</div>
                <div className="text-xs text-muted-foreground">
                  You&apos;ll be able to crop after upload
                </div>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crop Your Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {originalImage && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  className="max-h-96"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={originalImage}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-h-96 object-contain"
                  />
                </ReactCrop>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCropCancel}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleCropComplete}
                disabled={loading || !completedCrop}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Apply Crop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoUpload;
