"use client";

import React, { useState, useRef } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Image as ImageIcon, Loader2, Circle, Square, Maximize2 } from "lucide-react";
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
  onImageUpdate: (imageUrl: string) => void;
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
  recommendedWidth = 150,
  recommendedHeight = 150,
  aspectRatio,
  maxFileSize = 5,
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
  defaultQuality = 90,
  defaultFormat = "png",
  hideRecommendedSize = false,
  customDescription,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  disablePreview = false,
}: ImageUploadWithCropProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [customWidth, setCustomWidth] = useState(recommendedWidth);
  const [customHeight, setCustomHeight] = useState(recommendedHeight);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | undefined>(aspectRatio);
  const [imageQuality, setImageQuality] = useState(defaultQuality);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(defaultFormat);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [uploadImage, { loading: uploading }] = useUploadImage({
    onCompleted: (data: any) => {
      if (data?.uploadImage) {
        const cdnUrl = `https://cdn.thrico.network/${data.uploadImage}`;
        onImageUpdate(cdnUrl);
        onUploadComplete?.(cdnUrl);
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
      const err = new Error(error.message || `Failed to upload ${label.toLowerCase()}`);
      onUploadError?.(err);
      toast({
        title: "Error",
        description: err.message,
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
    const { width, height } = e.currentTarget;
    const aspect = selectedAspectRatio || (aspectRatio ?? (width / height));
    const initialCrop = centerAspectCrop(width, height, aspect);
    setCrop(initialCrop);
    
    // Also set completedCrop so the image can be saved even without manual interaction
    setCompletedCrop({
      unit: 'px',
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

    // Apply zoom to dimensions
    const finalWidth = Math.round(customWidth * zoom);
    const finalHeight = Math.round(customHeight * zoom);

    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      finalWidth,
      finalHeight
    );

    // Determine MIME type based on selected format
    const mimeType = outputFormat === "jpeg" ? "image/jpeg" : 
                     outputFormat === "webp" ? "image/webp" : 
                     "image/png";

    // Convert quality from 0-100 to 0-1
    const quality = imageQuality / 100;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        mimeType,
        quality
      );
    });
  };

  const handleSave = async () => {
    try {
      onUploadStart?.();
      const croppedBlob = await getCroppedImg();
      if (croppedBlob) {
        const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;
        const mimeType = outputFormat === "jpeg" ? "image/jpeg" : 
                         outputFormat === "webp" ? "image/webp" : 
                         "image/png";
        const file = new File(
          [croppedBlob], 
          `${label.toLowerCase().replace(/\s+/g, '-')}.${extension}`, 
          { type: mimeType }
        );
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
        
        {currentImage && !disablePreview ? (
          <div className="space-y-3">
            <div className={cn(
              "border rounded-lg p-4 bg-muted/30 flex items-center justify-center",
              previewClassName
            )}>
              <img
                src={currentImage}
                alt={label}
                className={cn(
                  "max-h-32 max-w-full object-contain",
                  circularCrop && "rounded-full"
                )}
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
                aria-label={changeButtonText}
              >
                <Upload className="h-4 w-4 mr-2" />
                {changeButtonText}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive"
                disabled={uploading}
                aria-label={removeButtonText || "Remove image"}
              >
                <X className="h-4 w-4" />
                {removeButtonText && <span className="ml-2">{removeButtonText}</span>}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200",
              enableDragDrop && "cursor-pointer",
              !uploading && enableDragDrop && "hover:border-primary/50 hover:bg-primary/5",
              uploading && "opacity-50 cursor-not-allowed",
              isDragging && "border-primary bg-primary/10 scale-[1.02]",
              dropzoneClassName
            )}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            aria-label={uploadButtonText || `Upload ${label}`}
            tabIndex={uploading ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !uploading) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <ImageIcon className={cn(
              "h-8 w-8 mx-auto mb-2 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
            <p className={cn(
              "text-sm font-medium transition-colors",
              isDragging ? "text-primary" : "text-foreground"
            )}>
              {isDragging 
                ? `Drop ${label} here` 
                : uploadButtonText || `Upload ${label}`
              }
            </p>
            {customDescription ? (
              <p className="text-xs text-muted-foreground mt-2">{customDescription}</p>
            ) : (
              <>
                {!hideRecommendedSize && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: {recommendedWidth}x{recommendedHeight}px
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {enableDragDrop ? "Click or drag & drop •" : ""} Max size: {maxFileSize}MB
                </p>
              </>
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

      {/* Image Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
          <DialogHeader>
            <DialogTitle>Edit {label}</DialogTitle>
            <DialogDescription>
              Crop and customize your image with advanced controls
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              {/* Aspect Ratio Presets */}
              {showAspectRatioPresets && (
                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {aspectRatioPresets.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant={selectedAspectRatio === preset.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedAspectRatio(preset.value);
                          if (imgRef.current) {
                            const { width, height } = imgRef.current;
                            const aspect = preset.value || width / height;
                            const newCrop = centerAspectCrop(width, height, aspect);
                            setCrop(newCrop);
                            setCompletedCrop({
                              unit: 'px',
                              x: (newCrop.x / 100) * width,
                              y: (newCrop.y / 100) * height,
                              width: (newCrop.width / 100) * width,
                              height: (newCrop.height / 100) * height,
                            });
                          }
                        }}
                        className="flex items-center gap-2 justify-center"
                      >
                        {preset.icon}
                        <span className="text-xs">{preset.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimension Controls */}
              {showDimensions && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={customWidth}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= minWidth && value <= maxWidth) {
                          setCustomWidth(value);
                        }
                      }}
                      min={minWidth}
                      max={maxWidth}
                    />
                    <p className="text-xs text-muted-foreground">
                      Range: {minWidth}-{maxWidth}px
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={customHeight}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= minHeight && value <= maxHeight) {
                          setCustomHeight(value);
                        }
                      }}
                      min={minHeight}
                      max={maxHeight}
                    />
                    <p className="text-xs text-muted-foreground">
                      Range: {minHeight}-{maxHeight}px
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">
                      💡 Recommended: {recommendedWidth}x{recommendedHeight}px
                      {enableZoom && zoom !== 1 && ` • Final: ${Math.round(customWidth * zoom)}x${Math.round(customHeight * zoom)}px`}
                    </p>
                  </div>
                </div>
              )}

              {/* Crop Area */}
              <div className="space-y-2">
                <Label>Crop Area</Label>
                <div className="max-h-[400px] overflow-auto border rounded-lg bg-muted/30 flex items-center justify-center p-4">
                  {imgSrc && (
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={selectedAspectRatio}
                      circularCrop={circularCrop}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop preview"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-w-full"
                        style={{
                          transform: `scale(${zoom})`,
                          transformOrigin: 'center',
                          transition: 'transform 0.2s ease-out'
                        }}
                      />
                    </ReactCrop>
                  )}
                </div>
                {circularCrop && (
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Circle className="h-3 w-3" />
                    Circular crop enabled - preview will be rounded
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              {/* Quality Slider */}
              {showQualitySlider && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality">Image Quality</Label>
                    <span className="text-sm font-medium text-muted-foreground">
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
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher quality = larger file size. Recommended: 80-95% for web.
                  </p>
                </div>
              )}

              {/* Format Selector */}
              {showFormatSelector && (
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select
                    value={outputFormat}
                    onValueChange={(value: OutputFormat) => setOutputFormat(value)}
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Lossless, larger file)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Lossy, smaller file)</SelectItem>
                      <SelectItem value="webp">WebP (Modern, best compression)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Zoom Slider */}
              {enableZoom && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zoom">Zoom Level</Label>
                    <span className="text-sm font-medium text-muted-foreground">
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
                    Zoom the output image. Final size: {Math.round(customWidth * zoom)}x{Math.round(customHeight * zoom)}px
                  </p>
                </div>
              )}

              {/* File Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h4 className="text-sm font-medium">File Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Format:</span> {outputFormat.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">Quality:</span> {imageQuality}%
                  </div>
                  <div>
                    <span className="font-medium">Dimensions:</span> {Math.round(customWidth * zoom)}x{Math.round(customHeight * zoom)}px
                  </div>
                  <div>
                    <span className="font-medium">Aspect:</span>{" "}
                    {selectedAspectRatio 
                      ? aspectRatioPresets.find(p => p.value === selectedAspectRatio)?.label || "Custom"
                      : "Free"
                    }
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditorOpen(false);
                setImgSrc("");
                setZoom(1); // Reset zoom
              }}
              disabled={uploading}
            >
              {cancelButtonText}
            </Button>
            <Button onClick={handleSave} disabled={!completedCrop || uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {uploading ? "Uploading..." : (saveButtonText || `Save ${label}`)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
