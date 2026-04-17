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
    const crop = completedCrop;

    if (!image || !crop) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Use natural pixels of the crop area for the final output dimensions
    // This ensures no quality loss from resampling.
    const finalWidth = Math.round(crop.width * scaleX * zoom);
    const finalHeight = Math.round(crop.height * scaleY * zoom);

    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

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

    // Determine MIME type based on selected format
    const mimeType =
      outputFormat === "jpeg"
        ? "image/jpeg"
        : outputFormat === "webp"
          ? "image/webp"
          : "image/png";

    // Convert quality from 0-100 to 0-1
    const quality = imageQuality / 100;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        mimeType,
        quality,
      );
    });
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
            handleUploadSuccess(url);
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
            <Label className="text-[13px] font-semibold text-foreground/90 tracking-tight">
              {label}
            </Label>
            {!hideRecommendedSize && !currentImage && (
              <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/50">
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
          <div className="relative group/preview overflow-hidden rounded-2xl border bg-secondary/20 transition-all duration-300 hover:border-primary/30 shadow-sm">
            <div
              className={cn(
                "relative aspect-video flex items-center justify-center p-6 bg-dots-grid",
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
                  "relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover/preview:scale-105",
                  circularCrop && "rounded-full shadow-2xl",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 z-20 flex items-end justify-between p-4 px-5">
                <div className="flex gap-2 w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 h-9 bg-white/95 hover:bg-white text-black border-0 shadow-lg font-bold text-xs"
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
                    className="h-9 w-9 p-0 bg-red-500/90 hover:bg-red-500 border-0 shadow-lg shrink-0"
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
              <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 animate-in fade-in duration-300">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <span className="text-[11px] font-bold text-primary tracking-wider uppercase">Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center min-h-[160px] p-8 border-2 border-dashed border-border/60 rounded-2xl transition-all duration-300",
              "group/drop flex flex-col items-center text-center",
              enableDragDrop && "cursor-pointer",
              !uploading &&
                enableDragDrop &&
                "hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-inner",
              uploading && "opacity-60 cursor-not-allowed",
              isDragging && "border-primary bg-primary/[0.04] scale-[1.01] shadow-xl",
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
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center border-2 border-border/50 bg-secondary/30 transition-all duration-300 group-hover/drop:scale-110 group-hover/drop:rotate-3 group-hover/drop:bg-primary/5 group-hover/drop:border-primary/20",
                isDragging && "scale-110 rotate-3 bg-primary/10 border-primary/30 shadow-lg shadow-primary/10"
              )}>
                <ImageIcon
                  className={cn(
                    "h-7 w-7 transition-colors duration-300",
                    isDragging || uploading ? "text-primary" : "text-muted-foreground group-hover/drop:text-primary",
                  )}
                />
              </div>
              {uploading && (
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 px-4">
              <p className={cn(
                "text-[13px] font-bold tracking-tight transition-colors duration-300",
                isDragging ? "text-primary" : "text-foreground group-hover/drop:text-primary",
              )}>
                {isDragging
                  ? `Drop to upload ${label.toLowerCase()}`
                  : uploadButtonText || `Upload ${label}`}
              </p>
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed max-w-[200px] mx-auto">
                {customDescription || (
                  <>
                    {enableDragDrop ? "Drag and drop or " : ""}
                    <span className="text-primary/80 font-semibold group-hover/drop:text-primary underline-offset-4 decoration-primary/30">click to browse</span>
                  </>
                )}
              </p>
            </div>

            {/* Hint icons/text */}
            {!hideRecommendedSize && !customDescription && (
              <div className="mt-6 pt-4 border-t border-border/50 w-full flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest bg-secondary/40 px-3 py-1 rounded-full border border-border/40">
                   {maxFileSize}MB MAX
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
        <DialogContent className="max-w-[1000px] p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-[#F8FAFC]">
          <div className="flex h-[750px] max-h-[90vh]">
            {/* Left Sidebar - Controls */}
            <div className="w-[320px] shrink-0 border-r bg-white p-8 flex flex-col h-full overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">
                  Studio <span className="text-primary">Editor</span>
                </h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Fine-tune your visual asset
                </p>
              </div>

              <Tabs defaultValue="basic" className="flex-1 flex flex-col gap-8">
                <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="basic" className="rounded-lg text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Basic</TabsTrigger>
                  <TabsTrigger value="advanced" className="rounded-lg text-[11px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-10 mt-0">
                  {/* Aspect Ratio Presets */}
                  {showAspectRatioPresets && (
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aspect Ratio</Label>
                      <div className="grid grid-cols-1 gap-2">
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
                              "relative flex items-center justify-between px-4 h-11 rounded-xl border-slate-200 text-slate-600 transition-all duration-300",
                              selectedAspectRatio === preset.value && "border-primary bg-primary/[0.02] text-primary shadow-sm"
                            )}
                          >
                            <span className="text-xs font-bold">{preset.label}</span>
                            {preset.icon || (preset.value && <Square className="h-4 w-4 opacity-40" />)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dimension Controls */}
                  {showDimensions && (
                    <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Resolution</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Input
                            id="width"
                            type="number"
                            className="h-10 bg-white border-slate-200 rounded-lg font-mono text-[13px] font-bold"
                            value={customWidth}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= minWidth && value <= maxWidth) {
                                setCustomWidth(value);
                              }
                            }}
                          />
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center">Width</p>
                        </div>
                        <div className="space-y-2">
                          <Input
                            id="height"
                            type="number"
                            className="h-10 bg-white border-slate-200 rounded-lg font-mono text-[13px] font-bold"
                            value={customHeight}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= minHeight && value <= maxHeight) {
                                setCustomHeight(value);
                              }
                            }}
                          />
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center">Height</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center gap-1.5 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                          <p className="text-[10px] font-bold text-blue-600/80 tracking-tight">
                            PREV: {recommendedWidth}x{recommendedHeight}px
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {circularCrop && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                        <Circle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-[11px] font-bold text-emerald-700 leading-tight">
                        Circular mask enabled. Output will be contained in a circle.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="advanced" className="space-y-8 mt-0">
                  {/* Quality Slider */}
                  {showQualitySlider && (
                    <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality</Label>
                        <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {imageQuality}%
                        </span>
                      </div>
                      <Slider
                        id="quality"
                        min={1}
                        max={100}
                        step={1}
                        value={[imageQuality]}
                        onValueChange={(value) => setImageQuality(value[0])}
                        className="py-2"
                      />
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                        Balance between fidelity and load speed.
                      </p>
                    </div>
                  )}

                  {/* Format Selector */}
                  {showFormatSelector && (
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Format</Label>
                      <Select
                        value={outputFormat}
                        onValueChange={(value: OutputFormat) =>
                          setOutputFormat(value)
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold text-xs bg-white">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          <SelectItem value="png" className="text-xs font-bold">PNG <span className="text-[10px] font-normal text-slate-400 ml-2">Lossless</span></SelectItem>
                          <SelectItem value="jpeg" className="text-xs font-bold">JPEG <span className="text-[10px] font-normal text-slate-400 ml-2">Web Optimized</span></SelectItem>
                          <SelectItem value="webp" className="text-xs font-bold">WebP <span className="text-[10px] font-normal text-slate-400 ml-2">Next Gen</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Zoom Slider */}
                  {enableZoom && (
                    <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scaling</Label>
                        <span className="text-[11px] font-black text-slate-600 bg-white shadow-sm border px-2 py-0.5 rounded">
                          {(zoom * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        id="zoom"
                        min={0.5}
                        max={3}
                        step={0.1}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Zoom the output image. Final size:{" "}
                    {Math.round(customWidth * zoom)}x
                    {Math.round(customHeight * zoom)}px
                  </p>
                </div>
              )}

              {/* File Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h4 className="text-sm font-medium">File Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Format:</span>{" "}
                    {outputFormat.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">Quality:</span> {imageQuality}
                    %
                  </div>
                  <div>
                    <span className="font-medium">Dimensions:</span>{" "}
                    {Math.round(customWidth * zoom)}x
                    {Math.round(customHeight * zoom)}px
                  </div>
                  <div>
                    <span className="font-medium">Aspect:</span>{" "}
                    {selectedAspectRatio
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                        className="py-2"
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-auto pt-8 border-t flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50"
                >
                  {cancelButtonText}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={uploading}
                  className="flex-[2] h-12 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-primary/20"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    saveButtonText || "Apply Changes"
                  )}
                </Button>
              </div>
            </div>

            {/* Right Side - Canvas Area */}
            <div className="flex-1 bg-[#F1F5F9] relative flex items-center justify-center p-12 overflow-hidden bg-dots-grid">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {imgSrc && (
                  <div className="relative group/canvas max-w-full max-h-full">
                    {/* Floating Canvas Meta */}
                    <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2 animate-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm">
                           Live Preview
                         </span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm">
                           {customWidth} × {customHeight} PX
                         </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/40">
                      <div className="relative overflow-hidden rounded-2xl">
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => {
                            setCompletedCrop(c);
                            if (imgRef.current) {
                              const scaleX =
                                imgRef.current.naturalWidth / imgRef.current.width;
                              const scaleY =
                                imgRef.current.naturalHeight /
                                imgRef.current.height;
                              setCustomWidth(Math.round(c.width * scaleX));
                              setCustomHeight(Math.round(c.height * scaleY));
                            }
                          }}
                          aspect={selectedAspectRatio}
                          circularCrop={circularCrop}
                          className="react-crop-studio"
                        >
                          <img
                            ref={imgRef}
                            alt="Crop preview"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            className="max-w-full max-h-[500px] object-contain transition-transform duration-500 ease-out"
                            style={{
                              transform: `scale(${zoom})`,
                              transformOrigin: "center",
                            }}
                          />
                        </ReactCrop>
                      </div>
                    </div>
                    
                    {/* Shadow Decor */}
                    <div className="absolute -inset-10 bg-primary/5 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
