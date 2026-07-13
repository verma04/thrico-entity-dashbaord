"use client";

import React, { useState, useRef } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Circle,
  Square,
  Maximize2,
  CheckCircle2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  Sun,
  Contrast,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useUploadImage } from "@/graphql/actions";
import { useToast } from "@/hooks/use-toast";

type OutputFormat = "png" | "jpeg" | "webp";

interface AspectRatioPreset {
  label: string;
  value: number | undefined;
  icon?: React.ReactNode;
}

interface ImageUploadWithCropProps {
  currentImage?: string;
  onImageUpdate: (cdnUrl: string, url: string) => void;
  label?: string;
  recommendedWidth?: number;
  recommendedHeight?: number;
  aspectRatio?: number;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  showDimensions?: boolean;
  className?: string;
  // New customization props
  enableDragDrop?: boolean;
  circularCrop?: boolean;
  showQualitySlider?: boolean;
  showFormatSelector?: boolean;
  showAspectRatioPresets?: boolean;
  aspectRatioPresets?: AspectRatioPreset[];
  uploadButtonText?: string;
  changeButtonText?: string;
  removeButtonText?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  previewClassName?: string;
  dropzoneClassName?: string;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  enableZoom?: boolean;
  defaultQuality?: number; // 0-100
  defaultFormat?: OutputFormat;
  hideRecommendedSize?: boolean;
  showRotation?: boolean;
  showFlip?: boolean;
  showAdjustments?: boolean;
  customDescription?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  disablePreview?: boolean;
  customUploadHandler?: (file: File) => Promise<string>;
  returnKeyOnly?: boolean;
  returnFileOnly?: boolean;
  onFileChange?: (file: File) => void;
  enforceExactDimensions?: boolean;
  children?: React.ReactNode;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const DEFAULT_ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { label: "Free", value: undefined, icon: <Maximize2 className="h-4 w-4" /> },
  { label: "Square (1:1)", value: 1, icon: <Square className="h-4 w-4" /> },
  { label: "Portrait (3:4)", value: 3 / 4 },
  { label: "Landscape (16:9)", value: 16 / 9 },
  { label: "Landscape (4:3)", value: 4 / 3 },
];

export const ImageUploadWithCrop = ({
  currentImage,
  onImageUpdate,
  label = "Image",
  recommendedWidth = 2048,
  recommendedHeight = 2048,
  aspectRatio,
  maxFileSize = 20,
  allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  showDimensions = true,
  className,
  // New props with defaults
  enableDragDrop = true,
  circularCrop = false,
  showQualitySlider = false,
  showFormatSelector = false,
  showAspectRatioPresets = false,
  aspectRatioPresets = DEFAULT_ASPECT_RATIO_PRESETS,
  uploadButtonText,
  changeButtonText = "Change Image",
  removeButtonText,
  saveButtonText,
  cancelButtonText = "Cancel",
  previewClassName,
  dropzoneClassName,
  maxWidth = 2000,
  maxHeight = 2000,
  minWidth = 10,
  minHeight = 10,
  enableZoom = false,
  defaultQuality = 100,
  defaultFormat = "png",
  hideRecommendedSize = false,
  customDescription,
  showRotation = true,
  showFlip = true,
  showAdjustments = true,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  disablePreview = false,
  customUploadHandler,
  returnKeyOnly = false,
  returnFileOnly = false,
  onFileChange,
  enforceExactDimensions = false,
  children,
}: ImageUploadWithCropProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [customWidth, setCustomWidth] = useState(recommendedWidth);
  const [customHeight, setCustomHeight] = useState(recommendedHeight);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    number | undefined
  >(aspectRatio);
  const [imageQuality, setImageQuality] = useState(defaultQuality);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(defaultFormat);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isCustomUploading, setIsCustomUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [uploadImage, { loading: defaultUploading }] = useUploadImage({
    onCompleted: (data: any) => {
      if (data?.uploadImage) {
        const result = returnKeyOnly
          ? data.uploadImage
          : `https://cdn.thrico.network/${data.uploadImage}`;
        handleUploadSuccess(result, data.uploadImage);
      }
    },
    onError: (error: any) => {
      handleUploadError(error);
    },
  });

  const uploading = defaultUploading || isCustomUploading;

  const handleUploadSuccess = (cdnUrl: string, url: string) => {
    onImageUpdate(cdnUrl, url);
    onUploadComplete?.(cdnUrl, url);
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
    // Reset editor states
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setBrightness(100);
    setContrast(100);
    setZoom(1);
  };

  const handleUploadError = (error: any) => {
    const err = new Error(
      error.message || `Failed to upload ${label.toLowerCase()}`,
    );
    onUploadError?.(err);
    toast({
      title: "Error",
      description: err.message,
      variant: "destructive",
    });
    setIsCustomUploading(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedFormats.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload ${allowedFormats
          .map((f) => f.split("/")[1].toUpperCase())
          .join(", ")} files only`,
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

  const processFile = (file: File) => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (enableDragDrop && !uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!enableDragDrop || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    const aspect = selectedAspectRatio || (aspectRatio ?? width / height);
    const initialCrop = centerAspectCrop(width, height, aspect);
    setCrop(initialCrop);

    // Set custom dimensions to natural crop size initially to preserve quality
    const pixelWidth = Math.round((initialCrop.width / 100) * naturalWidth);
    const pixelHeight = Math.round((initialCrop.height / 100) * naturalHeight);
    setCustomWidth(pixelWidth);
    setCustomHeight(pixelHeight);

    // Also set completedCrop so the image can be saved even without manual interaction
    setCompletedCrop({
      unit: "px",
      x: (initialCrop.x / 100) * width,
      y: (initialCrop.y / 100) * height,
      width: (initialCrop.width / 100) * width,
      height: (initialCrop.height / 100) * height,
    });
  };

  const getCroppedImg = async (): Promise<Blob | null> => {
    const image = imgRef.current;
    if (!image || !completedCrop) return null;

    const canvas = document.createElement("canvas");
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const finalWidth = enforceExactDimensions && recommendedWidth 
      ? recommendedWidth 
      : Math.round(crop.width * scaleX * zoom);
      
    const finalHeight = enforceExactDimensions && recommendedHeight 
      ? recommendedHeight 
      : Math.round(crop.height * scaleY * zoom);

    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Move to the center to apply transforms
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      finalWidth,
      finalHeight,
    );

    const mimeType =
      outputFormat === "jpeg"
        ? "image/jpeg"
        : outputFormat === "webp"
          ? "image/webp"
          : "image/png";
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), mimeType, imageQuality / 100);
    });
  };

  const handleReset = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setBrightness(100);
    setContrast(100);
    setZoom(1);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const aspect = selectedAspectRatio || (aspectRatio ?? width / height);
      const initialCrop = centerAspectCrop(width, height, aspect);
      setCrop(initialCrop);
    }
  };

  const handleSave = async () => {
    try {
      onUploadStart?.();
      const croppedBlob = await getCroppedImg();
      if (croppedBlob) {
        const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;
        const mimeType =
          outputFormat === "jpeg"
            ? "image/jpeg"
            : outputFormat === "webp"
              ? "image/webp"
              : "image/png";

        const fileName = `${label.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
        const file = new File([croppedBlob], fileName, { type: mimeType });

        console.log(
          `[ImageUpload] Uploading: ${fileName}`,
          `Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          `Type: ${mimeType}`,
          `Dimensions: ${customWidth}x${customHeight}`,
        );

        if (returnFileOnly) {
          onFileChange?.(file);
          const localUrl = URL.createObjectURL(file);
          onImageUpdate(localUrl, localUrl);
          setIsEditorOpen(false);
          setImgSrc("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        if (customUploadHandler) {
          setIsCustomUploading(true);
          try {
            const url = await customUploadHandler(file);
            handleUploadSuccess(url, url);
          } catch (error) {
            handleUploadError(error);
          }
        } else {
          await uploadImage({ variables: { file } });
        }
      }
    } catch (error) {
      handleUploadError(error);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpdate("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={cn("group space-y-2.5", className)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              {label}
            </Label>
            {!hideRecommendedSize && !currentImage && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                {recommendedWidth} × {recommendedHeight}px
              </span>
            )}
          </div>
        )}

        {children ? (
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
          >
            {children}
          </div>
        ) : currentImage && !disablePreview ? (
          <div className="relative group/preview overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div
              className={cn(
                "relative aspect-video flex items-center justify-center p-4 bg-muted/30",
                previewClassName,
              )}
            >
              <img
                src={
                  currentImage?.startsWith("http") || currentImage?.startsWith("blob:") || currentImage?.startsWith("data:")
                    ? currentImage
                    : `https://cdn.thrico.network/${currentImage}`
                }
                alt={label}
                className={cn(
                  "relative z-10 max-h-full max-w-full object-contain transition-transform duration-300 group-hover/preview:scale-[1.02]",
                  circularCrop && "rounded-full",
                )}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 z-20 backdrop-blur-sm flex items-center justify-center">
                <div className="flex gap-2 translate-y-1 group-hover/preview:translate-y-0 transition-transform duration-200">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 bg-background hover:bg-background/90 text-foreground border-none shadow-lg font-medium text-xs rounded-lg gap-1.5"
                    disabled={uploading}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {changeButtonText}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="h-9 w-9 p-0 bg-background/20 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm border-none shadow-lg shrink-0 rounded-lg text-background transition-colors"
                    disabled={uploading}
                    aria-label={removeButtonText || "Remove image"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading Overlay */}
            {uploading && (
              <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-foreground animate-spin" />
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Uploading...
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Dropzone */
          <div
            className={cn(
              "relative flex flex-col items-center justify-center min-h-[160px] p-6 border border-dashed border-border rounded-xl transition-all duration-200",
              "bg-muted/20 hover:bg-muted/40",
              enableDragDrop && "cursor-pointer",
              !uploading &&
                enableDragDrop &&
                "hover:border-primary/40",
              uploading && "opacity-60 cursor-not-allowed",
              isDragging && "border-primary bg-primary/5 scale-[1.005]",
              dropzoneClassName,
            )}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            aria-label={uploadButtonText || `Upload ${label}`}
            tabIndex={uploading ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !uploading) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="relative mb-4">
              <div
                className={cn(
                  "h-11 w-11 rounded-xl flex items-center justify-center border border-border bg-background shadow-sm transition-all duration-200",
                  isDragging && "border-primary/50 shadow-md bg-primary/5",
                  !isDragging && !uploading && "group-hover:border-primary/30",
                )}
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Upload
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isDragging
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isDragging
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {isDragging
                  ? `Drop to upload`
                  : uploadButtonText || `Upload ${label}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {customDescription || (
                  <>
                    Drag & drop or{" "}
                    <span className="text-primary font-medium">
                      browse
                    </span>
                  </>
                )}
              </p>
            </div>

            {!hideRecommendedSize && !customDescription && (
              <div className="mt-4 pt-3 border-t border-border/40 w-full flex items-center justify-center">
                <span className="text-[10px] font-medium text-muted-foreground/70">
                  Max {maxFileSize}MB
                </span>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
          aria-label={`File input for ${label}`}
        />
      </div>

      {/* Crop Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden border border-border shadow-2xl rounded-2xl bg-background">
          <div className="flex flex-col md:flex-row h-[600px] md:h-[680px]">
            {/* Main Canvas Area */}
            <div className="flex-1 bg-muted/30 relative overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Image Editor
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Crop, rotate & adjust your image
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-muted-foreground font-mono">
                      {Math.round(customWidth)} × {Math.round(customHeight)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
                <div className="relative rounded-lg overflow-hidden bg-background shadow-lg border border-border/50">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={selectedAspectRatio}
                    circularCrop={circularCrop}
                    className="max-h-[50vh]"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        transition:
                          "transform 0.2s ease-out, filter 0.2s ease-out",
                      }}
                      onLoad={onImageLoad}
                      className="max-w-full h-auto origin-center"
                    />
                  </ReactCrop>
                </div>

                {/* Floating Toolbar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/95 backdrop-blur-md px-2 py-1.5 rounded-lg border border-border shadow-lg z-30">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRotation((r) => (r - 90) % 360)}
                    className="h-8 w-8 rounded-md hover:bg-muted"
                    title="Rotate Left"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="h-8 w-8 rounded-md hover:bg-muted"
                    title="Rotate Right"
                  >
                    <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>

                  <div className="w-px h-4 bg-border mx-0.5" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={cn(
                      "h-8 w-8 rounded-md",
                      flipHorizontal
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFlipVertical(!flipVertical)}
                    className={cn(
                      "h-8 w-8 rounded-md",
                      flipVertical
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                    title="Flip Vertical"
                  >
                    <FlipVertical className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-border mx-0.5" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-8 w-8 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
                    title="Reset All"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-[320px] border-l border-border bg-background flex flex-col">
              <div className="flex-1 overflow-y-auto p-5">
                <Tabs defaultValue="dimensions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-9 bg-muted p-1 rounded-lg mb-5">
                    <TabsTrigger
                      value="dimensions"
                      className="rounded-md text-xs font-medium data-[state=active]:shadow-sm"
                    >
                      Layout
                    </TabsTrigger>
                    <TabsTrigger
                      value="adjust"
                      className="rounded-md text-xs font-medium data-[state=active]:shadow-sm"
                    >
                      Adjust
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dimensions" className="space-y-5 mt-0">
                    {/* Aspect Ratio Presets */}
                    {showAspectRatioPresets && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                          Aspect Ratio
                        </Label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {aspectRatioPresets.map((preset) => (
                            <Button
                              key={preset.label}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAspectRatio(preset.value);
                                if (imgRef.current) {
                                  const { width, height } = imgRef.current;
                                  const aspect = preset.value || width / height;
                                  const newCrop = centerAspectCrop(
                                    width,
                                    height,
                                    aspect,
                                  );
                                  setCrop(newCrop);
                                  setCompletedCrop({
                                    unit: "px",
                                    x: (newCrop.x / 100) * width,
                                    y: (newCrop.y / 100) * height,
                                    width: (newCrop.width / 100) * width,
                                    height: (newCrop.height / 100) * height,
                                  });
                                }
                              }}
                              className={cn(
                                "h-9 rounded-lg text-xs font-medium transition-all",
                                selectedAspectRatio === preset.value
                                  ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                                  : "hover:bg-muted/80",
                              )}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dimensions */}
                    {showDimensions && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                          Dimensions
                        </Label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <Input
                              type="number"
                              className="h-9 rounded-lg border-border bg-muted/30 font-mono text-xs focus-visible:ring-primary/30"
                              value={customWidth}
                              onChange={(e) =>
                                setCustomWidth(Number(e.target.value))
                              }
                            />
                            <span className="text-[10px] text-muted-foreground text-center block">
                              Width
                            </span>
                          </div>
                          <div className="space-y-1">
                            <Input
                              type="number"
                              className="h-9 rounded-lg border-border bg-muted/30 font-mono text-xs focus-visible:ring-primary/30"
                              value={customHeight}
                              onChange={(e) =>
                                setCustomHeight(Number(e.target.value))
                              }
                            />
                            <span className="text-[10px] text-muted-foreground text-center block">
                              Height
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="h-px bg-border/60" />

                    {/* Zoom Slider */}
                    {enableZoom && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Scale
                          </Label>
                          <span className="text-[10px] font-medium text-primary">
                            {(zoom * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Slider
                          min={0.5}
                          max={3}
                          step={0.1}
                          value={[zoom]}
                          onValueChange={(v) => setZoom(v[0])}
                          className="py-1.5"
                        />
                      </div>
                    )}

                    {/* Quality Slider */}
                    {showQualitySlider && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Quality
                          </Label>
                          <span className="text-[10px] font-medium text-primary">
                            {imageQuality}%
                          </span>
                        </div>
                        <Slider
                          min={1}
                          max={100}
                          step={1}
                          value={[imageQuality]}
                          onValueChange={(v) => setImageQuality(v[0])}
                          className="py-1.5"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="adjust" className="space-y-5 mt-0">
                    {/* Brightness & Contrast */}
                    {showAdjustments && (
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                              <Label className="text-xs font-medium text-muted-foreground">
                                Brightness
                              </Label>
                            </div>
                            <span className="text-[10px] font-medium text-primary">
                              {brightness}%
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={200}
                            step={1}
                            value={[brightness]}
                            onValueChange={(v) => setBrightness(v[0])}
                            className="py-1.5"
                          />
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Contrast className="h-3.5 w-3.5 text-muted-foreground" />
                              <Label className="text-xs font-medium text-muted-foreground">
                                Contrast
                              </Label>
                            </div>
                            <span className="text-[10px] font-medium text-primary">
                              {contrast}%
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={200}
                            step={1}
                            value={[contrast]}
                            onValueChange={(v) => setContrast(v[0])}
                            className="py-1.5"
                          />
                        </div>
                      </div>
                    )}

                    {/* Format Selector */}
                    {showFormatSelector && (
                      <div className="space-y-2.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Export Format
                        </Label>
                        <Select
                          value={outputFormat}
                          onValueChange={(v: OutputFormat) =>
                            setOutputFormat(v)
                          }
                        >
                          <SelectTrigger className="h-9 rounded-lg border-border bg-muted/30 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-lg">
                            <SelectItem
                              value="png"
                              className="rounded-md text-xs py-2"
                            >
                              PNG — Lossless
                            </SelectItem>
                            <SelectItem
                              value="jpeg"
                              className="rounded-md text-xs py-2"
                            >
                              JPEG — Optimized
                            </SelectItem>
                            <SelectItem
                              value="webp"
                              className="rounded-md text-xs py-2"
                            >
                              WebP — Modern
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-border flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 h-10 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  {cancelButtonText}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={uploading}
                  className="flex-[1.5] h-10 rounded-lg text-xs font-medium gap-1.5 shadow-sm"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {saveButtonText || "Save & Upload"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
