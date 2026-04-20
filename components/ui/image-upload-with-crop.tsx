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

    const finalWidth = Math.round(crop.width * scaleX * zoom);
    const finalHeight = Math.round(crop.height * scaleY * zoom);

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
      <div className={cn("group space-y-3", className)}>
        {label && (
          <div className="flex items-center justify-between px-0.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              {label}
            </Label>
            {!hideRecommendedSize && !currentImage && (
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {recommendedWidth} × {recommendedHeight}px
              </span>
            )}
          </div>
        )}

        {children ? (
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-100"
          >
            {children}
          </div>
        ) : currentImage && !disablePreview ? (
          <div className="relative group/preview overflow-hidden rounded-2xl border border-border shadow-sm bg-zinc-50/50">
            <div
              className={cn(
                "relative aspect-video flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
                previewClassName,
              )}
            >
              <img
                src={
                  currentImage?.startsWith("https://cdn.thrico.network/")
                    ? currentImage
                    : `https://cdn.thrico.network/${currentImage}`
                }
                alt={label}
                className={cn(
                  "relative z-10 max-h-full max-w-full object-contain shadow-2xl transition-transform duration-500 group-hover/preview:scale-[1.02]",
                  circularCrop && "rounded-full",
                )}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 z-20 backdrop-blur-[2px] flex items-center justify-center p-4">
                <div className="flex gap-2 w-full max-w-[240px] translate-y-2 group-hover/preview:translate-y-0 transition-transform duration-300">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 h-10 bg-white hover:bg-zinc-50 text-foreground border-none shadow-xl font-bold text-xs rounded-xl"
                    disabled={uploading}
                  >
                    <Upload className="h-3.5 w-3.5 mr-2" />
                    {changeButtonText}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="h-10 w-10 p-0 bg-white/10 hover:bg-rose-500 hover:text-white backdrop-blur-md border-none shadow-xl shrink-0 rounded-xl text-white transition-colors"
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
              <div className="absolute inset-0 z-30 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase">
                  Uploading Asset...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center min-h-[180px] p-8 border-2 border-dashed border-border rounded-2xl transition-all duration-300",
              "group/drop bg-zinc-50/50 hover:bg-zinc-50",
              enableDragDrop && "cursor-pointer",
              !uploading &&
                enableDragDrop &&
                "hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/5",
              uploading && "opacity-60 cursor-not-allowed",
              isDragging && "border-indigo-500 bg-indigo-50/30 scale-[1.01]",
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
            <div className="relative mb-5">
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center border border-border bg-white shadow-sm transition-all duration-500 group-hover/drop:scale-110 group-hover/drop:rotate-3 group-hover/drop:border-indigo-200 group-hover/drop:shadow-indigo-100 group-hover/drop:shadow-xl",
                  isDragging &&
                    "scale-110 rotate-3 border-indigo-300 shadow-xl shadow-indigo-100 bg-indigo-50",
                )}
              >
                <Upload
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    isDragging || uploading
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover/drop:text-indigo-600",
                  )}
                />
              </div>
              {uploading && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-border">
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center">
              <p
                className={cn(
                  "text-sm font-bold tracking-tight transition-colors duration-300",
                  isDragging
                    ? "text-indigo-600"
                    : "text-slate-900 group-hover/drop:text-indigo-600",
                )}
              >
                {isDragging
                  ? `Drop to finish upload`
                  : uploadButtonText || `Upload ${label}`}
              </p>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">
                {customDescription || (
                  <>
                    Drag and drop your file or{" "}
                    <span className="text-indigo-600 font-bold underline underline-offset-2">
                      browse
                    </span>
                  </>
                )}
              </p>
            </div>

            {!hideRecommendedSize && !customDescription && (
              <div className="mt-6 pt-6 border-t border-slate-200/60 w-full flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-border/60">
                  MAX {maxFileSize}MB
                </div>
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

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white">
          <div className="flex flex-col md:flex-row h-[600px] md:h-[700px]">
            {/* Main Preview Area */}
            <div className="flex-1 bg-zinc-50/50 relative overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Aesthetic Studio
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Visual Asset Refinement
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-zinc-100 border border-border flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight font-mono">
                      {Math.round(customWidth)} × {Math.round(customHeight)} PX
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
                <div className="relative shadow-2xl rounded-xl overflow-hidden bg-white">
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

                {/* Visual Indicators Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-border shadow-xl z-30">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRotation((r) => (r - 90) % 360)}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                    title="Rotate Left"
                  >
                    <RotateCcw className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                    title="Rotate Right"
                  >
                    <RotateCw className="h-4 w-4 text-slate-600" />
                  </Button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      flipHorizontal
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-slate-100 text-slate-600",
                    )}
                    title="Flip Horizontal"
                  >
                    <FlipHorizontal className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFlipVertical(!flipVertical)}
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      flipVertical
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-slate-100 text-slate-600",
                    )}
                    title="Flip Vertical"
                  >
                    <FlipVertical className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                    title="Reset All"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Controls Panel */}
            <div className="w-full md:w-[340px] border-l border-border bg-white p-8 flex flex-col gap-8 overflow-y-auto">
              <div className="space-y-6">
                <Tabs defaultValue="dimensions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger
                      value="dimensions"
                      className="rounded-lg text-[10px] font-black uppercase tracking-wider"
                    >
                      Layout
                    </TabsTrigger>
                    <TabsTrigger
                      value="adjust"
                      className="rounded-lg text-[10px] font-black uppercase tracking-wider"
                    >
                      Adjust
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dimensions" className="space-y-6">
                    <div>
                      <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4 block">
                        Dimensions & Presets
                      </Label>

                      {showAspectRatioPresets && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
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
                                "h-10 rounded-xl border-border font-bold text-[11px] uppercase transition-all",
                                selectedAspectRatio === preset.value
                                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                                  : "hover:bg-zinc-50",
                              )}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      )}

                      {showDimensions && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Input
                              type="number"
                              className="h-10 rounded-xl border-border bg-zinc-50/50 font-mono text-xs font-bold focus-visible:ring-indigo-500"
                              value={customWidth}
                              onChange={(e) =>
                                setCustomWidth(Number(e.target.value))
                              }
                            />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase text-center block">
                              Width
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <Input
                              type="number"
                              className="h-10 rounded-xl border-border bg-zinc-50/50 font-mono text-xs font-bold focus-visible:ring-indigo-500"
                              value={customHeight}
                              onChange={(e) =>
                                setCustomHeight(Number(e.target.value))
                              }
                            />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase text-center block">
                              Height
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-zinc-100" />

                    <div className="space-y-5">
                      {enableZoom && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              Scaling
                            </Label>
                            <span className="text-[10px] font-bold text-indigo-600">
                              {(zoom * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Slider
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={[zoom]}
                            onValueChange={(v) => setZoom(v[0])}
                            className="py-2"
                          />
                        </div>
                      )}

                      {showQualitySlider && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                              Quality
                            </Label>
                            <span className="text-[10px] font-bold text-indigo-600">
                              {imageQuality}%
                            </span>
                          </div>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            value={[imageQuality]}
                            onValueChange={(v) => setImageQuality(v[0])}
                            className="py-2"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="adjust" className="space-y-8">
                    {showAdjustments && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sun className="h-3.5 w-3.5 text-slate-400" />
                              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                Brightness
                              </Label>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600">
                              {brightness}%
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={200}
                            step={1}
                            value={[brightness]}
                            onValueChange={(v) => setBrightness(v[0])}
                            className="py-2"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Contrast className="h-3.5 w-3.5 text-slate-400" />
                              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                Contrast
                              </Label>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600">
                              {contrast}%
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={200}
                            step={1}
                            value={[contrast]}
                            onValueChange={(v) => setContrast(v[0])}
                            className="py-2"
                          />
                        </div>
                      </div>
                    )}

                    {showFormatSelector && (
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          Export Format
                        </Label>
                        <Select
                          value={outputFormat}
                          onValueChange={(v: OutputFormat) =>
                            setOutputFormat(v)
                          }
                        >
                          <SelectTrigger className="h-11 rounded-xl border-border bg-zinc-50/50 font-bold text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl p-1 shadow-2xl">
                            <SelectItem
                              value="png"
                              className="rounded-lg font-bold text-xs py-2"
                            >
                              PNG / Lossless
                            </SelectItem>
                            <SelectItem
                              value="jpeg"
                              className="rounded-lg font-bold text-xs py-2"
                            >
                              JPEG / Optimized
                            </SelectItem>
                            <SelectItem
                              value="webp"
                              className="rounded-lg font-bold text-xs py-2"
                            >
                              WebP / Modern
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="mt-auto pt-8 border-t border-border flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-xs uppercase text-muted-foreground hover:bg-zinc-50"
                >
                  {cancelButtonText}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={uploading}
                  className="flex-[1.5] h-12 rounded-xl font-bold text-xs uppercase bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 gap-2"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {saveButtonText || "Save Asset"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
