"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { Upload, Camera, Store, Loader2 } from "lucide-react";
import BillingAddress from "./billing-address";
import { useGetEntity, useUploadEntityLogo } from "@/graphql/actions";

export default function GeneralSettings() {
  const { toast } = useToast();
  const { data: entityData, loading: entityLoading } = useGetEntity();

  const [uploadLogo, { loading: uploadingLogo }] = useUploadEntityLogo({
    onCompleted: (data: any) => {
      if (data.uploadEntityLogo.success) {
        toast({
          title: "Success",
          description:
            data.uploadEntityLogo.message || "Logo uploaded successfully!",
        });
        setCommunityImage(data.uploadEntityLogo.logo);
      } else {
        toast({
          title: "Error",
          description: data.uploadEntityLogo.message || "Failed to upload logo",
          variant: "destructive",
        });
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

  const [updateProfile, { loading: updatingProfile }] = useUploadEntityLogo({
    onCompleted: (data: any) => {
      if (data.updateEntityProfile.success) {
        toast({
          title: "Success",
          description:
            data.updateEntityProfile.message || "Profile updated successfully!",
        });
        setCommunityName(data.updateEntityProfile.name);
      } else {
        toast({
          title: "Error",
          description:
            data.updateEntityProfile.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [communityName, setCommunityName] = useState(
    entityData?.getEntity?.name || "My Page"
  );
  const [tempName, setTempName] = useState(communityName);
  const [communityImage, setCommunityImage] = useState<string | null>(
    entityData?.getEntity?.logo || null
  );
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const [imageToProcess, setImageToProcess] = useState<string | null>(null);
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayImageSize, setDisplayImageSize] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityName(entityData.getEntity.name || "My Page");
      setTempName(entityData.getEntity.name || "My Page");
      setCommunityImage(
        `https://cdn.thrico.network/${entityData.getEntity.logo}` || null
      );
    }
  }, [entityData]);

  const handleNameEdit = () => {
    setTempName(communityName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== communityName) {
      updateProfile({
        variables: {
          input: {
            name: tempName.trim(),
          },
        },
      });
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(communityName);
    setIsEditingName(false);
  };

  const handleImageUpload = (info: ChangeEvent<HTMLInputElement>) => {
    const file = info.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setOriginalImageSize({ width: img.width, height: img.height });
        const size = Math.min(img.width, img.height) * 0.8;
        setCropArea({
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          width: size,
          height: size,
        });
      };
      img.src = e.target?.result as string;
      setImageToProcess(e.target?.result as string);
      setIsImageModalVisible(false);
      setIsCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const cropImageManually = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const size = Math.min(cropArea.width, cropArea.height);
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          size,
          size,
          0,
          0,
          size,
          size
        );
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = imageSrc;
    });
  };

  const getMousePosition = (e: ReactMouseEvent | MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const imageRect = imageRef.current.getBoundingClientRect();
    const scaleX = originalImageSize.width / imageRect.width;
    const scaleY = originalImageSize.height / imageRect.height;
    return {
      x: Math.max(
        0,
        Math.min((e.clientX - imageRect.left) * scaleX, originalImageSize.width)
      ),
      y: Math.max(
        0,
        Math.min((e.clientY - imageRect.top) * scaleY, originalImageSize.height)
      ),
    };
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    const pos = getMousePosition(e);
    setDragStart(pos);
    setIsDragging(true);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const currentPos = getMousePosition(e);
      const width = Math.abs(currentPos.x - dragStart.x);
      const height = Math.abs(currentPos.y - dragStart.y);
      const size = Math.max(20, Math.min(width, height));
      const x = Math.min(dragStart.x, currentPos.x);
      const y = Math.min(dragStart.y, currentPos.y);
      const maxX = Math.max(0, Math.min(x, originalImageSize.width - size));
      const maxY = Math.max(0, Math.min(y, originalImageSize.height - size));
      setCropArea({ x: maxX, y: maxY, width: size, height: size });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleCropAreaMove = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startPos = getMousePosition(e);
    const startCropArea = { ...cropArea };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const currentPos = getMousePosition(e);
      const deltaX = currentPos.x - startPos.x;
      const deltaY = currentPos.y - startPos.y;
      const newX = Math.max(
        0,
        Math.min(
          startCropArea.x + deltaX,
          originalImageSize.width - cropArea.width
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          startCropArea.y + deltaY,
          originalImageSize.height - cropArea.height
        )
      );
      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
    };

    const handleGlobalMouseUp = () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleCropSave = async () => {
    if (imageToProcess) {
      try {
        const croppedImageDataUrl = await cropImageManually(imageToProcess);
        const response = await fetch(croppedImageDataUrl);
        const blob = await response.blob();
        const file = new File([blob], "community-logo.jpg", {
          type: "image/jpeg",
        });
        uploadLogo({ variables: { file } });
        setIsCropModalVisible(false);
        setImageToProcess(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropModalVisible(false);
    setImageToProcess(null);
    setIsImageModalVisible(true);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      toast({
        title: "Invalid file type",
        description: "You can only upload JPG/PNG files!",
        variant: "destructive",
      });
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 2MB!",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Entity Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <Card className="border-0 bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={communityImage || ""} alt="Entity" />
                    <AvatarFallback>
                      <Store className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full p-0 bg-transparent"
                    onClick={() => setIsImageModalVisible(true)}
                    disabled={uploadingLogo}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="font-semibold"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleNameSave}
                      disabled={updatingProfile}
                    >
                      {updatingProfile && (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      )}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNameCancel}
                      disabled={updatingProfile}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{communityName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Entity name and image
                    </p>
                  </div>
                )}
              </div>

              {!isEditingName && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNameEdit}
                  disabled={updatingProfile}
                >
                  Edit
                </Button>
              )}
            </div>
          </Card>

          <Separator />

          {/* Billing Address */}
          <BillingAddress />
        </CardContent>
      </Card>

      {/* Image Upload Modal */}
      <Dialog open={isImageModalVisible} onOpenChange={setIsImageModalVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Entity Image</DialogTitle>
            <DialogDescription>
              Choose a square image for best results
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={communityImage || ""} alt="Entity" />
              <AvatarFallback>
                <Store className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>

            <div className="w-full">
              <label htmlFor="image-upload" className="w-full">
                <Button
                  type="button"
                  asChild
                  className="w-full"
                  disabled={uploadingLogo}
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingLogo ? "Processing..." : "Upload New Image"}
                  </span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && beforeUpload(file)) {
                    handleImageUpload(e as any);
                  }
                }}
                disabled={uploadingLogo}
              />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Recommended: Square image, max 2MB (JPG, PNG)
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      <Dialog open={isCropModalVisible} onOpenChange={setIsCropModalVisible}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Image to Square</DialogTitle>
            <DialogDescription>
              Drag to select the area you want to keep
            </DialogDescription>
          </DialogHeader>

          {imageToProcess && (
            <div className="space-y-4 py-4">
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const size =
                      Math.min(
                        originalImageSize.width,
                        originalImageSize.height
                      ) * 0.8;
                    setCropArea({
                      x: (originalImageSize.width - size) / 2,
                      y: (originalImageSize.height - size) / 2,
                      width: size,
                      height: size,
                    });
                  }}
                >
                  Center
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newSize = Math.max(50, cropArea.width * 0.8);
                    setCropArea((prev) => ({
                      ...prev,
                      width: newSize,
                      height: newSize,
                    }));
                  }}
                >
                  Smaller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const maxSize = Math.min(
                      originalImageSize.width,
                      originalImageSize.height
                    );
                    const newSize = Math.min(maxSize, cropArea.width * 1.2);
                    setCropArea((prev) => ({
                      ...prev,
                      width: newSize,
                      height: newSize,
                    }));
                  }}
                >
                  Larger
                </Button>
              </div>

              <div
                ref={cropContainerRef}
                className="relative inline-block border-2 border-border rounded-lg overflow-hidden mx-auto cursor-crosshair select-none"
                onMouseDown={handleMouseDown}
              >
                <img
                  ref={imageRef}
                  src={imageToProcess || "/placeholder.svg"}
                  alt="Crop"
                  className="max-w-md max-h-96 block select-none"
                  draggable={false}
                  onLoad={() => {
                    if (imageRef.current) {
                      const rect = imageRef.current.getBoundingClientRect();
                      setDisplayImageSize({
                        width: rect.width,
                        height: rect.height,
                      });
                    }
                  }}
                />

                {/* Crop Overlay */}
                <div
                  className="absolute border-2 border-primary bg-primary/10 cursor-move"
                  style={{
                    left: `${(cropArea.x / originalImageSize.width) * 100}%`,
                    top: `${(cropArea.y / originalImageSize.height) * 100}%`,
                    width: `${
                      (cropArea.width / originalImageSize.width) * 100
                    }%`,
                    height: `${
                      (cropArea.height / originalImageSize.height) * 100
                    }%`,
                    boxSizing: "border-box",
                  }}
                  onMouseDown={handleCropAreaMove}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCropCancel}
              disabled={uploadingLogo}
            >
              Back
            </Button>
            <Button onClick={handleCropSave} disabled={uploadingLogo}>
              {uploadingLogo && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              Save Cropped Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
