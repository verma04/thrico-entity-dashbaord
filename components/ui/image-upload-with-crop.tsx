/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
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
  Crop as CropIcon,
  Maximize2,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Square,
  SlidersHorizontal,
  Loader2,
  ArrowUpRight,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

type DimensionMode = "free" | "recommended" | "preset";

type FreeSubMode = "original" | "freeform";

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
  // Customization props
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
  onUploadComplete?: (cdnUrl: string, url?: string) => void;
  onUploadError?: (error: Error) => void;
  disablePreview?: boolean;
  customUploadHandler?: (file: File) => Promise<string>;
  returnKeyOnly?: boolean;
  returnFileOnly?: boolean;
  onFileChange?: (file: File) => void;
  enforceExactDimensions?: boolean;
  allowFreeDimensions?: boolean;
  defaultDimensionMode?: DimensionMode;
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
  { label: "Free Dimensions", value: undefined, icon: <Maximize2 className="h-3.5 w-3.5" /> },
  { label: "1:1 Square", value: 1, icon: <Square className="h-3.5 w-3.5" /> },
  { label: "16:9 Banner", value: 16 / 9 },
  { label: "4:3 Standard", value: 4 / 3 },
  { label: "3:4 Portrait", value: 3 / 4 },
  { label: "2:1 Wide", value: 2 / 1 },
];

/* ── Polaris UI Subcomponents (Linear / Marketing UTM Design Language) ── */

function PolarisEditorCard({
  icon: Icon,
  title,
  description,
  badge,
  badgeVariant = "outline",
  children,
  className,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "indigo";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3.5 transition-all duration-150",
        className,
      )}
    >
      <div className="mb-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 shrink-0" />
            )}
            <h4 className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-[18px]">
              {title}
            </h4>
          </div>
          {badge && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.2 rounded-[4px]",
                badgeVariant === "indigo"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                  : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700",
              )}
            >
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function PolarisModeTile({
  label,
  description,
  badge,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  badge?: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-start gap-2.5 p-2.5 rounded-[6px] border text-left transition-all cursor-pointer w-full",
        selected
          ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
      )}
    >
      <div
        className={cn(
          "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
          selected
            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 block">
            {label}
          </span>
          {badge && (
            <Badge
              variant="outline"
              className="text-[9px] px-1 py-0 font-mono border-border/80 text-muted-foreground"
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-[10.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[14px]">
          {description}
        </p>
      </div>
    </button>
  );
}

function PolarisSummaryRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 text-xs",
        !isLast && "border-b border-[#e1e3e5]/60 dark:border-zinc-800/60",
      )}
    >
      <span className="text-[11px] text-[#616161] dark:text-zinc-400">{label}</span>
      <span className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function PolarisQuickChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-[10.5px] px-2.5 py-1 rounded-md border transition-all cursor-pointer font-medium",
        active
          ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs"
          : "border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 hover:border-[#aeb4b9] dark:hover:border-zinc-500 hover:text-[#303030] dark:hover:text-zinc-200 bg-white dark:bg-zinc-900",
      )}
    >
      {label}
    </button>
  );
}

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
  enableDragDrop = true,
  circularCrop = false,
  showQualitySlider = true,
  showFormatSelector = true,
  showAspectRatioPresets = true,
  aspectRatioPresets = DEFAULT_ASPECT_RATIO_PRESETS,
  uploadButtonText,
  changeButtonText = "Change Image",
  removeButtonText,
  saveButtonText,
  cancelButtonText = "Cancel",
  previewClassName,
  dropzoneClassName,
  maxWidth,
  maxHeight,
  minWidth = 10,
  minHeight = 10,
  enableZoom = true,
  defaultQuality = 100,
  defaultFormat = "png",
  hideRecommendedSize = false,
  showRotation = true,
  showFlip = true,
  showAdjustments = true,
  customDescription,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  disablePreview = false,
  customUploadHandler,
  returnKeyOnly = false,
  returnFileOnly = false,
  onFileChange,
  enforceExactDimensions = false,
  allowFreeDimensions = true,
  defaultDimensionMode,
  children,
}: ImageUploadWithCropProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: recommendedWidth, height: recommendedHeight });

  // Dimension Modes
  const initialMode: DimensionMode =
    defaultDimensionMode ||
    (aspectRatio || (enforceExactDimensions && recommendedWidth && recommendedHeight)
      ? "recommended"
      : "free");

  const [dimensionMode, setDimensionMode] = useState<DimensionMode>(initialMode);
  const [freeSubMode, setFreeSubMode] = useState<FreeSubMode>("original");
  const [isLockedRatio, setIsLockedRatio] = useState(false);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [customWidth, setCustomWidth] = useState(recommendedWidth);
  const [customHeight, setCustomHeight] = useState(recommendedHeight);

  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    number | undefined
  >(initialMode === "free" ? undefined : (aspectRatio ?? recommendedWidth / recommendedHeight));

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
    onCompleted: (data: { uploadImage?: string } | null | undefined) => {
      if (data?.uploadImage) {
        const result = returnKeyOnly
          ? data.uploadImage
          : `https://cdn.thrico.network/${data.uploadImage}`;
        handleUploadSuccess(result, data.uploadImage);
      }
    },
    onError: (error: Error) => {
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
    setOriginalFile(null);
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

  const handleUploadError = (error: unknown) => {
    const err =
      error instanceof Error
        ? error
        : new Error(
            typeof error === "string"
              ? error
              : `Failed to upload ${label.toLowerCase()}`,
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

    setOriginalFile(file);

    // Auto-detect format from file
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      setOutputFormat("jpeg");
    } else if (file.type === "image/webp") {
      setOutputFormat("webp");
    } else if (file.type === "image/png") {
      setOutputFormat("png");
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

  // Setup initial crop when image renders
  const applyCropMode = useCallback(
    (
      mode: DimensionMode,
      imgWidth: number,
      imgHeight: number,
      natWidth: number,
      natHeight: number,
      presetAspect?: number,
    ) => {
      if (mode === "free") {
        setSelectedAspectRatio(undefined);
        if (freeSubMode === "original") {
          // Select 100% full image
          const fullCrop: Crop = {
            unit: "%",
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          };
          setCrop(fullCrop);
          setCompletedCrop({
            unit: "px",
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
          setCustomWidth(natWidth);
          setCustomHeight(natHeight);
        } else {
          // Freeform centered box
          const freeCrop: Crop = {
            unit: "%",
            x: 10,
            y: 10,
            width: 80,
            height: 80,
          };
          setCrop(freeCrop);
          setCompletedCrop({
            unit: "px",
            x: 0.1 * imgWidth,
            y: 0.1 * imgHeight,
            width: 0.8 * imgWidth,
            height: 0.8 * imgHeight,
          });
          setCustomWidth(Math.round(natWidth * 0.8));
          setCustomHeight(Math.round(natHeight * 0.8));
        }
      } else if (mode === "recommended") {
        const aspect =
          aspectRatio ||
          (recommendedWidth && recommendedHeight
            ? recommendedWidth / recommendedHeight
            : natWidth / natHeight);
        setSelectedAspectRatio(aspect);
        const recCrop = centerAspectCrop(imgWidth, imgHeight, aspect);
        setCrop(recCrop);
        const pixelW = Math.round((recCrop.width / 100) * imgWidth);
        const pixelH = Math.round((recCrop.height / 100) * imgHeight);
        setCompletedCrop({
          unit: "px",
          x: (recCrop.x / 100) * imgWidth,
          y: (recCrop.y / 100) * imgHeight,
          width: pixelW,
          height: pixelH,
        });
        setCustomWidth(
          enforceExactDimensions && recommendedWidth
            ? recommendedWidth
            : Math.round((recCrop.width / 100) * natWidth),
        );
        setCustomHeight(
          enforceExactDimensions && recommendedHeight
            ? recommendedHeight
            : Math.round((recCrop.height / 100) * natHeight),
        );
      } else if (mode === "preset") {
        const aspect = presetAspect || 1;
        setSelectedAspectRatio(aspect);
        const pCrop = centerAspectCrop(imgWidth, imgHeight, aspect);
        setCrop(pCrop);
        setCompletedCrop({
          unit: "px",
          x: (pCrop.x / 100) * imgWidth,
          y: (pCrop.y / 100) * imgHeight,
          width: (pCrop.width / 100) * imgWidth,
          height: (pCrop.height / 100) * imgHeight,
        });
        setCustomWidth(Math.round((pCrop.width / 100) * natWidth));
        setCustomHeight(Math.round((pCrop.height / 100) * natHeight));
      }
    },
    [
      aspectRatio,
      recommendedWidth,
      recommendedHeight,
      enforceExactDimensions,
      freeSubMode,
    ],
  );

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalDimensions({ width: naturalWidth, height: naturalHeight });
    applyCropMode(dimensionMode, width, height, naturalWidth, naturalHeight);
  };

  const handleSelectDimensionMode = (newMode: DimensionMode) => {
    setDimensionMode(newMode);
    if (!imgRef.current) return;
    const { width, height } = imgRef.current;
    applyCropMode(
      newMode,
      width,
      height,
      naturalDimensions.width,
      naturalDimensions.height,
    );
  };

  const handleSelectFreeSubMode = (subMode: FreeSubMode) => {
    setFreeSubMode(subMode);
    if (!imgRef.current) return;
    const { width, height } = imgRef.current;
    if (subMode === "original") {
      const fullCrop: Crop = {
        unit: "%",
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };
      setCrop(fullCrop);
      setCompletedCrop({
        unit: "px",
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
      setCustomWidth(naturalDimensions.width);
      setCustomHeight(naturalDimensions.height);
    } else {
      const freeCrop: Crop = {
        unit: "%",
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      };
      setCrop(freeCrop);
      setCompletedCrop({
        unit: "px",
        x: 0.1 * width,
        y: 0.1 * height,
        width: 0.8 * width,
        height: 0.8 * height,
      });
      setCustomWidth(Math.round(naturalDimensions.width * 0.8));
      setCustomHeight(Math.round(naturalDimensions.height * 0.8));
    }
  };

  const handleSelectPresetRatio = (aspect: number | undefined) => {
    if (aspect === undefined) {
      handleSelectDimensionMode("free");
      return;
    }
    setDimensionMode("preset");
    setSelectedAspectRatio(aspect);
    if (!imgRef.current) return;
    const { width, height } = imgRef.current;
    applyCropMode(
      "preset",
      width,
      height,
      naturalDimensions.width,
      naturalDimensions.height,
      aspect,
    );
  };

  // Full image selection helper
  const handleFitFullImage = () => {
    setDimensionMode("free");
    setFreeSubMode("original");
    setSelectedAspectRatio(undefined);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
      setCompletedCrop({
        unit: "px",
        x: 0,
        y: 0,
        width,
        height,
      });
      setCustomWidth(naturalDimensions.width);
      setCustomHeight(naturalDimensions.height);
    }
  };

  // Numeric Dimension Handlers
  const handleWidthInputChange = (val: number) => {
    const w = Math.max(1, val);
    setCustomWidth(w);
    if (isLockedRatio && customWidth > 0 && customHeight > 0) {
      const ratio = customHeight / customWidth;
      setCustomHeight(Math.round(w * ratio));
    }
  };

  const handleHeightInputChange = (val: number) => {
    const h = Math.max(1, val);
    setCustomHeight(h);
    if (isLockedRatio && customWidth > 0 && customHeight > 0) {
      const ratio = customWidth / customHeight;
      setCustomWidth(Math.round(h * ratio));
    }
  };

  // Live aspect ratio string computation
  const ratioDisplay = useMemo(() => {
    if (dimensionMode === "free") return "Freeform";
    if (customWidth && customHeight && customHeight > 0) {
      const r = customWidth / customHeight;
      if (Math.abs(r - 1) < 0.04) return "1:1";
      if (Math.abs(r - 16 / 9) < 0.04) return "16:9";
      if (Math.abs(r - 4 / 3) < 0.04) return "4:3";
      if (Math.abs(r - 3 / 4) < 0.04) return "3:4";
      if (Math.abs(r - 2) < 0.04) return "2:1";
      return `${r.toFixed(2)}:1`;
    }
    return "Custom";
  }, [dimensionMode, customWidth, customHeight]);

  const getCroppedImg = async (forceOriginalDimensions = false): Promise<Blob | null> => {
    const image = imgRef.current;
    if (!image) return null;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const isFullFrame =
      forceOriginalDimensions ||
      (dimensionMode === "free" && freeSubMode === "original");

    const effectiveCropX = isFullFrame
      ? 0
      : completedCrop
        ? completedCrop.x * scaleX
        : 0;
    const effectiveCropY = isFullFrame
      ? 0
      : completedCrop
        ? completedCrop.y * scaleY
        : 0;
    const effectiveCropW = isFullFrame
      ? image.naturalWidth
      : completedCrop
        ? completedCrop.width * scaleX
        : image.naturalWidth;
    const effectiveCropH = isFullFrame
      ? image.naturalHeight
      : completedCrop
        ? completedCrop.height * scaleY
        : image.naturalHeight;

    // Sizing policy:
    // When dimensionMode is "free", never force dimensions to allow completely free uploads.
    let finalWidth = Math.round(effectiveCropW * zoom);
    let finalHeight = Math.round(effectiveCropH * zoom);

    if (
      dimensionMode !== "free" &&
      enforceExactDimensions &&
      recommendedWidth &&
      recommendedHeight
    ) {
      finalWidth = recommendedWidth;
      finalHeight = recommendedHeight;
    }

    canvas.width = Math.max(1, finalWidth);
    canvas.height = Math.max(1, finalHeight);
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Center canvas transforms
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      effectiveCropX,
      effectiveCropY,
      effectiveCropW,
      effectiveCropH,
      0,
      0,
      canvas.width,
      canvas.height,
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
      applyCropMode(
        dimensionMode,
        width,
        height,
        naturalDimensions.width,
        naturalDimensions.height,
      );
    }
  };

  const handleSave = async (forceFreeOriginal = false) => {
    try {
      onUploadStart?.();

      const isOriginalFree =
        forceFreeOriginal ||
        (dimensionMode === "free" &&
          freeSubMode === "original" &&
          rotation === 0 &&
          !flipHorizontal &&
          !flipVertical &&
          brightness === 100 &&
          contrast === 100 &&
          zoom === 1);

      let fileToUpload: File | null = null;

      // When uploading original free dimensions without any filters/rotations,
      // upload pristine original file directly for best fidelity
      if (
        isOriginalFree &&
        originalFile &&
        (originalFile.type === `image/${outputFormat}` ||
          (outputFormat === "png" && originalFile.type === "image/png"))
      ) {
        fileToUpload = originalFile;
      } else {
        const croppedBlob = await getCroppedImg(forceFreeOriginal);
        if (croppedBlob) {
          const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;
          const mimeType =
            outputFormat === "jpeg"
              ? "image/jpeg"
              : outputFormat === "webp"
                ? "image/webp"
                : "image/png";

          const fileName = `${label.toLowerCase().replace(/\s+/g, "-")}-${
            dimensionMode === "free" || forceFreeOriginal ? "free-dim" : "cropped"
          }.${extension}`;
          fileToUpload = new File([croppedBlob], fileName, { type: mimeType });
        }
      }

      if (fileToUpload) {
        if (returnFileOnly) {
          onFileChange?.(fileToUpload);
          const localUrl = URL.createObjectURL(fileToUpload);
          onImageUpdate(localUrl, localUrl);
          setIsEditorOpen(false);
          setImgSrc("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        if (customUploadHandler) {
          setIsCustomUploading(true);
          try {
            const url = await customUploadHandler(fileToUpload);
            handleUploadSuccess(url, url);
          } catch (error) {
            handleUploadError(error);
          }
        } else {
          await uploadImage({ variables: { file: fileToUpload } });
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

  // Sync custom width/height when crop completed
  const handleCropComplete = (pixelCrop: PixelCrop) => {
    setCompletedCrop(pixelCrop);
    if (imgRef.current && pixelCrop.width && pixelCrop.height) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      setCustomWidth(Math.round(pixelCrop.width * scaleX));
      setCustomHeight(Math.round(pixelCrop.height * scaleY));
    }
  };


  return (
    <>
      <div className={cn("group space-y-2.5", className)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
              {label}
            </Label>
            {!hideRecommendedSize && !currentImage && (
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[10px] font-mono px-1.5 py-0.2 rounded-[4px]"
                >
                  {recommendedWidth} × {recommendedHeight}px
                </Badge>
                {allowFreeDimensions && (
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-[10px] font-medium px-1.5 py-0.2 rounded-[4px]"
                  >
                    Free Dimensions
                  </Badge>
                )}
              </div>
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
          <div className="relative group/preview overflow-hidden rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
            <div
              className={cn(
                "relative aspect-video flex items-center justify-center p-4 bg-[#f9fafb] dark:bg-zinc-950/50",
                previewClassName,
              )}
            >
              <img
                src={
                  currentImage?.startsWith("http") ||
                  currentImage?.startsWith("blob:") ||
                  currentImage?.startsWith("data:")
                    ? currentImage
                    : `https://cdn.thrico.network/${currentImage}`
                }
                alt={label}
                className={cn(
                  "relative z-10 max-h-full max-w-full object-contain transition-transform duration-300 group-hover/preview:scale-[1.01]",
                  circularCrop && "rounded-full",
                )}
              />

              {/* Hover overlay with Polaris styling */}
              <div className="absolute inset-0 bg-[#303030]/60 dark:bg-zinc-950/70 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 z-20 backdrop-blur-xs flex items-center justify-center">
                <div className="flex gap-2 translate-y-1 group-hover/preview:translate-y-0 transition-transform duration-200">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8.5 bg-white hover:bg-zinc-100 text-[#303030] dark:bg-zinc-100 dark:text-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 shadow-2xs font-medium text-xs rounded-md gap-1.5 cursor-pointer"
                    disabled={uploading}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {changeButtonText}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleRemove}
                    className="h-8.5 w-8.5 p-0 bg-red-600 hover:bg-red-700 text-white shadow-2xs shrink-0 rounded-md transition-colors cursor-pointer"
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
              <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
                <div className="h-9 w-9 rounded-lg bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center shadow-2xs">
                  <Loader2 className="h-4 w-4 text-[#303030] dark:text-zinc-100 animate-spin" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Uploading...
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Dropzone with Polaris / Linear aesthetics */
          <div
            className={cn(
              "relative flex flex-col items-center justify-center min-h-[160px] p-6 rounded-[10px] border border-dashed transition-all duration-200",
              "border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-900/70 hover:border-[#aeb4b9]",
              enableDragDrop && "cursor-pointer",
              uploading && "opacity-60 cursor-not-allowed",
              isDragging &&
                "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800/80 scale-[1.005] ring-1 ring-[#303030] dark:ring-zinc-100",
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
            <div className="relative mb-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200",
                  isDragging &&
                    "border-[#303030] dark:border-zinc-100 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md",
                )}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Upload
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isDragging
                        ? "text-white dark:text-zinc-900"
                        : "text-[#616161] dark:text-zinc-400",
                    )}
                  />
                )}
              </div>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                {isDragging ? `Drop to upload` : uploadButtonText || `Upload ${label}`}
              </p>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                {customDescription || (
                  <>
                    Drag & drop or{" "}
                    <span className="text-[#303030] dark:text-zinc-200 font-semibold underline underline-offset-2">
                      browse
                    </span>{" "}
                    • Crop or upload in free dimensions
                  </>
                )}
              </p>
            </div>

            {!hideRecommendedSize && !customDescription && (
              <div className="mt-3.5 pt-2.5 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80 w-full flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Max {maxFileSize}MB
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG, WebP
                </span>
                {allowFreeDimensions && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Free Dimensions
                    </span>
                  </>
                )}
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

      {/* ── Image Editor Dialog (Marketing / UTM / Polaris Design System) ── */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Editor</DialogTitle>
            <DialogDescription>
              Crop, rotate, and adjust your image or upload in original free dimensions.
            </DialogDescription>
          </DialogHeader>

          {/* Dialog Top Navigation Bar */}
          <div className="px-5 py-3.5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                <CropIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
                    Image Editor
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.2 rounded-[4px]",
                      dimensionMode === "free"
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    {dimensionMode === "free" ? "Free Dimensions" : "Proportional Crop"}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
                  Crop to exact dimensions or upload unconstrained in native resolution
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10.5px] font-mono font-medium text-[#303030] dark:text-zinc-200">
                  {Math.round(customWidth)} × {Math.round(customHeight)} px
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditorOpen(false)}
                className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-[580px] md:h-[640px]">
            {/* ── Left Area: Main Canvas & Interactive Controls ── */}
            <div className="flex-1 bg-[#f8f9fa] dark:bg-zinc-950 relative overflow-hidden flex flex-col border-b md:border-b-0 md:border-r border-[#d2d5d9] dark:border-zinc-800">
              {/* Notice Banner when Free Dimensions is Active */}
              {dimensionMode === "free" && (
                <div className="px-4 py-2 bg-indigo-50/70 dark:bg-indigo-950/30 border-b border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-[11px] text-indigo-800 dark:text-indigo-300 truncate">
                      Free Dimension Mode: Image unconstrained • Full natural resolution preserved
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFitFullImage}
                    className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 hover:underline shrink-0 cursor-pointer"
                  >
                    Fit 100% Full Image
                  </button>
                </div>
              )}

              {/* Canvas viewport */}
              <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden select-none">
                <div className="relative rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-md border border-[#d2d5d9] dark:border-zinc-800">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={handleCropComplete}
                    aspect={dimensionMode === "free" ? undefined : selectedAspectRatio}
                    circularCrop={circularCrop}
                    className="max-h-[46vh]"
                    minWidth={minWidth}
                    minHeight={minHeight}
                    maxWidth={maxWidth}
                    maxHeight={maxHeight}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop target"
                      src={imgSrc}
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        transition: "transform 0.15s ease-out, filter 0.15s ease-out",
                      }}
                      onLoad={onImageLoad}
                      className="max-w-full h-auto origin-center block"
                    />
                  </ReactCrop>
                </div>

                {/* Floating Polaris Toolbar */}
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2 py-1.5 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 shadow-md z-30">
                  {showRotation && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setRotation((r) => (r - 90) % 360)}
                        className="h-7 w-7 rounded-md hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#616161] dark:text-zinc-400 cursor-pointer"
                        title="Rotate Left 90°"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="h-7 w-7 rounded-md hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#616161] dark:text-zinc-400 cursor-pointer"
                        title="Rotate Right 90°"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </Button>
                      <div className="w-px h-3.5 bg-border mx-0.5" />
                    </>
                  )}

                  {showFlip && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFlipHorizontal(!flipHorizontal)}
                        className={cn(
                          "h-7 w-7 rounded-md cursor-pointer",
                          flipHorizontal
                            ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#616161] dark:text-zinc-400",
                        )}
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFlipVertical(!flipVertical)}
                        className={cn(
                          "h-7 w-7 rounded-md cursor-pointer",
                          flipVertical
                            ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#616161] dark:text-zinc-400",
                        )}
                        title="Flip Vertical"
                      >
                        <FlipVertical className="h-3.5 w-3.5" />
                      </Button>
                      <div className="w-px h-3.5 bg-border mx-0.5" />
                    </>
                  )}

                  {/* Fit Full Image Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleFitFullImage}
                    className="h-7 px-2 text-[11px] rounded-md hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#616161] dark:text-zinc-400 gap-1 cursor-pointer"
                    title="Fit 100% Full Image (Free Dimensions)"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Full Frame</span>
                  </Button>

                  <div className="w-px h-3.5 bg-border mx-0.5" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-7 w-7 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    title="Reset All Adjustments"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Right Area: Control & Dimension Settings Panel ── */}
            <div className="w-full md:w-[350px] bg-white dark:bg-zinc-900 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Tabs defaultValue="dimensions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-8 p-0.5 bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 rounded-lg mb-4">
                    <TabsTrigger
                      value="dimensions"
                      className="rounded-md text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-[#303030] dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-2xs py-1"
                    >
                      Dimensions & Sizing
                    </TabsTrigger>
                    <TabsTrigger
                      value="adjust"
                      className="rounded-md text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-[#303030] dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-2xs py-1"
                    >
                      Enhance & Output
                    </TabsTrigger>
                  </TabsList>

                  {/* ── Tab 1: Dimensions, Mode & Presets ── */}
                  <TabsContent value="dimensions" className="space-y-3.5 mt-0">
                    {/* Dimension Mode Card */}
                    <PolarisEditorCard
                      icon={CropIcon}
                      title="Dimension Mode"
                      description="Select upload format policy or upload free of dimensions"
                      badge={dimensionMode === "free" ? "Free Active" : "Proportional"}
                      badgeVariant={dimensionMode === "free" ? "indigo" : "outline"}
                    >
                      <div className="space-y-2">
                        {allowFreeDimensions && (
                          <PolarisModeTile
                            label="Free Dimensions"
                            description="Upload full original resolution or crop freeform without fixed aspect locks"
                            badge="No Constraints"
                            icon={Maximize2}
                            selected={dimensionMode === "free"}
                            onClick={() => handleSelectDimensionMode("free")}
                          />
                        )}

                        <PolarisModeTile
                          label="Recommended Proportions"
                          description={`Optimized for ${recommendedWidth} × ${recommendedHeight}px containers`}
                          badge={`${(recommendedWidth / recommendedHeight).toFixed(2)}:1`}
                          icon={Square}
                          selected={dimensionMode === "recommended"}
                          onClick={() => handleSelectDimensionMode("recommended")}
                        />

                        {showAspectRatioPresets && (
                          <PolarisModeTile
                            label="Standard Ratio Presets"
                            description="Select 1:1 Square, 16:9 Banner, 4:3, or 3:4 Mobile ratios"
                            badge="Standard Ratios"
                            icon={Sparkles}
                            selected={dimensionMode === "preset"}
                            onClick={() => handleSelectDimensionMode("preset")}
                          />
                        )}
                      </div>

                      {/* Free Dimension Sub-actions */}
                      {dimensionMode === "free" && (
                        <div className="pt-2 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200">
                              Free Crop Mode:
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {naturalDimensions.width} × {naturalDimensions.height} px
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <PolarisQuickChip
                              label="100% Full Image"
                              active={freeSubMode === "original"}
                              onClick={() => handleSelectFreeSubMode("original")}
                            />
                            <PolarisQuickChip
                              label="Freeform Crop"
                              active={freeSubMode === "freeform"}
                              onClick={() => handleSelectFreeSubMode("freeform")}
                            />
                          </div>

                          {/* Dedicated Free Dimension Instant Upload Button */}
                          <Button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={uploading}
                            className="w-full h-8 text-[11px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs gap-1.5 cursor-pointer"
                          >
                            {uploading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            Upload Free Dimensions Directly
                          </Button>
                        </div>
                      )}

                      {/* Aspect Ratio Presets Chips */}
                      {(dimensionMode === "preset" || showAspectRatioPresets) &&
                        dimensionMode !== "free" && (
                          <div className="pt-2 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80 space-y-2">
                            <span className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200 block">
                              Select Ratio:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {aspectRatioPresets.map((preset) => (
                                <PolarisQuickChip
                                  key={preset.label}
                                  label={preset.label}
                                  active={selectedAspectRatio === preset.value}
                                  onClick={() => handleSelectPresetRatio(preset.value)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </PolarisEditorCard>

                    {/* Specifications & Live Dimensions Card */}
                    {showDimensions && (
                      <PolarisEditorCard
                        icon={SlidersHorizontal}
                        title="Specifications & Live Dimensions"
                        description="View or manually fine-tune exact pixel output"
                      >
                        {/* Numeric Inputs */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#303030] dark:text-zinc-200">
                                Width
                              </span>
                              <span className="text-[9px] text-muted-foreground font-mono">
                                PX
                              </span>
                            </div>
                            <Input
                              type="number"
                              className="h-8 rounded-md border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs focus-visible:ring-1 focus-visible:ring-[#303030] dark:focus-visible:ring-zinc-100"
                              value={Math.round(customWidth) || ""}
                              onChange={(e) =>
                                handleWidthInputChange(Number(e.target.value))
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#303030] dark:text-zinc-200">
                                Height
                              </span>
                              <span className="text-[9px] text-muted-foreground font-mono">
                                PX
                              </span>
                            </div>
                            <Input
                              type="number"
                              className="h-8 rounded-md border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs focus-visible:ring-1 focus-visible:ring-[#303030] dark:focus-visible:ring-zinc-100"
                              value={Math.round(customHeight) || ""}
                              onChange={(e) =>
                                handleHeightInputChange(Number(e.target.value))
                              }
                            />
                          </div>
                        </div>

                        {/* Lock Ratio Toggle Button */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => setIsLockedRatio(!isLockedRatio)}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-[10.5px] px-2 py-0.5 rounded-md border transition-all cursor-pointer font-medium",
                              isLockedRatio
                                ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300"
                                : "border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 hover:bg-[#f6f6f7]",
                            )}
                          >
                            {isLockedRatio ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Unlock className="h-3 w-3" />
                            )}
                            {isLockedRatio ? "Ratio Locked" : "Freeform Dimensions"}
                          </button>

                          <Badge
                            variant="outline"
                            className="text-[9.5px] font-mono border-border"
                          >
                            Ratio: {ratioDisplay}
                          </Badge>
                        </div>

                        {/* Summary Metadata Rows */}
                        <div className="space-y-1 pt-2 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80">
                          <PolarisSummaryRow
                            label="Original Source"
                            value={
                              <span className="font-mono text-[11px]">
                                {naturalDimensions.width} × {naturalDimensions.height} px
                              </span>
                            }
                          />
                          <PolarisSummaryRow
                            label="Cropped Output"
                            value={
                              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                                {Math.round(customWidth)} × {Math.round(customHeight)} px
                              </span>
                            }
                          />
                          <PolarisSummaryRow
                            label="Dimension Mode"
                            value={
                              dimensionMode === "free" ? (
                                <Badge
                                  variant="outline"
                                  className="text-[9.5px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                >
                                  Free of Dimensions
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200"
                                >
                                  Proportional
                                </Badge>
                              )
                            }
                            isLast
                          />
                        </div>
                      </PolarisEditorCard>
                    )}
                  </TabsContent>

                  {/* ── Tab 2: Enhancements & Output Quality ── */}
                  <TabsContent value="adjust" className="space-y-3.5 mt-0">
                    {/* Visual Adjustments */}
                    {showAdjustments && (
                      <PolarisEditorCard
                        icon={Sun}
                        title="Visual Adjustments"
                        description="Fine-tune brightness, contrast, and scale"
                      >
                        {/* Brightness */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Sun className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />
                              <span className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200">
                                Brightness
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {brightness}%
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={200}
                            step={1}
                            value={[brightness]}
                            onValueChange={(v) => setBrightness(v[0])}
                            className="py-1 cursor-pointer"
                          />
                        </div>

                        {/* Contrast */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Contrast className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />
                              <span className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200">
                                Contrast
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {contrast}%
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={200}
                            step={1}
                            value={[contrast]}
                            onValueChange={(v) => setContrast(v[0])}
                            className="py-1 cursor-pointer"
                          />
                        </div>

                        {/* Zoom Scale */}
                        {enableZoom && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <ZoomIn className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />
                                <span className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200">
                                  Zoom Scale
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {(zoom * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Slider
                              min={0.5}
                              max={3}
                              step={0.1}
                              value={[zoom]}
                              onValueChange={(v) => setZoom(v[0])}
                              className="py-1 cursor-pointer"
                            />
                          </div>
                        )}
                      </PolarisEditorCard>
                    )}

                    {/* Output Quality & Format Card */}
                    <PolarisEditorCard
                      icon={SlidersHorizontal}
                      title="Export Output Settings"
                      description="Choose target format and compression balance"
                    >
                      {/* Format Selector */}
                      {showFormatSelector && (
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200">
                            Export Format
                          </Label>
                          <Select
                            value={outputFormat}
                            onValueChange={(v: OutputFormat) => setOutputFormat(v)}
                          >
                            <SelectTrigger className="h-8.5 rounded-md border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-md shadow-lg border-[#d2d5d9] dark:border-zinc-700">
                              <SelectItem value="png" className="text-xs py-1.5">
                                PNG — Lossless Fidelity
                              </SelectItem>
                              <SelectItem value="jpeg" className="text-xs py-1.5">
                                JPEG — Fast & Optimized
                              </SelectItem>
                              <SelectItem value="webp" className="text-xs py-1.5">
                                WebP — Modern High Compression
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Quality Slider */}
                      {showQualitySlider && (
                        <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80">
                          <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-semibold text-[#303030] dark:text-zinc-200">
                              Image Quality
                            </Label>
                            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                              {imageQuality}%
                            </span>
                          </div>
                          <Slider
                            min={10}
                            max={100}
                            step={1}
                            value={[imageQuality]}
                            onValueChange={(v) => setImageQuality(v[0])}
                            className="py-1 cursor-pointer"
                          />
                        </div>
                      )}
                    </PolarisEditorCard>
                  </TabsContent>
                </Tabs>
              </div>

              {/* ── Sticky Dialog Footer (Linear / Marketing UTM Style) ── */}
              <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="h-8.5 px-3 rounded-md text-xs font-medium border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 shadow-2xs cursor-pointer"
                >
                  Reset
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditorOpen(false)}
                    className="h-8.5 px-3 rounded-md text-xs font-medium text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    {cancelButtonText}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={uploading}
                    className="h-8.5 px-4 rounded-md text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs gap-1.5 cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    {dimensionMode === "free"
                      ? "Upload Free Dimensions"
                      : saveButtonText || "Save & Upload"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
