"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
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

interface LogoUploadProps {
  imageUrl?: string;
  setImageUrl: (url: string) => void;
  setCover: (file: File) => void;
  buttonText?: string;
  aspectRatio?: number;
}

type OutputFormat = "png" | "jpeg" | "webp";

interface AspectRatioPreset {
  label: string;
  value: number | undefined;
}

const DEFAULT_ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { label: "Free", value: undefined },
  { label: "Square (1:1)", value: 1 },
  { label: "Portrait (3:4)", value: 3 / 4 },
  { label: "Landscape (16:9)", value: 16 / 9 },
  { label: "Landscape (4:3)", value: 4 / 3 },
];

const LogoUpload: React.FC<LogoUploadProps> = ({
  imageUrl,
  setImageUrl,
  setCover,
  buttonText = "Upload Logo",
  aspectRatio = 1,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [customWidth, setCustomWidth] = useState(512);
  const [customHeight, setCustomHeight] = useState(512);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | undefined>(aspectRatio);
  const [imageQuality, setImageQuality] = useState(90);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const centerAspectCrop = useCallback((
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) => {
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
  }, []);

  const validateFile = (file: File): boolean => {
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    
    if (!allowedFormats.includes(file.type)) {
      alert("Please upload JPG, PNG, or WebP files only");
      return false;
    }

    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > 2) {
      alert("Image must be smaller than 2MB");
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
    const aspect = selectedAspectRatio || aspectRatio || (width / height);
    const initialCrop = centerAspectCrop(width, height, aspect);
    setCrop(initialCrop);
    
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
    const cropData = completedCrop;

    if (!image || !cropData) {
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

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      customWidth,
      customHeight
    );

    const mimeType = outputFormat === "jpeg" ? "image/jpeg" : 
                     outputFormat === "webp" ? "image/webp" : 
                     "image/png";
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
      setProcessing(true);
      const croppedBlob = await getCroppedImg();
      if (croppedBlob) {
        const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;
        const mimeType = outputFormat === "jpeg" ? "image/jpeg" : 
                         outputFormat === "webp" ? "image/webp" : 
                         "image/png";
        const file = new File(
          [croppedBlob], 
          `logo.${extension}`, 
          { type: mimeType }
        );
        
        // Set the file for parent component
        setCover(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result as string);
          setIsEditorOpen(false);
          setImgSrc("");
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Upload Logo</Label>
      
      {imageUrl ? (
        <div className="space-y-3">
          <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Logo preview"
              className={cn(
                "max-h-32 max-w-full object-contain",
                aspectRatio === 1 && "rounded-full"
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
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Logo
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
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium text-primary">{buttonText}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended: 512x512px
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Max size: 2MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Crop Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crop Logo</DialogTitle>
            <DialogDescription>
              Customize your logo with crop and quality controls
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              {/* Aspect Ratio Presets */}
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_ASPECT_RATIO_PRESETS.map((preset) => (
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
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dimension Controls */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={256}
                    max={2048}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={256}
                    max={2048}
                  />
                </div>
              </div>

              {/* Crop Area */}
              <div className="space-y-2">
                <Label>Crop Area</Label>
                <div className="border rounded-lg bg-muted/30 flex items-center justify-center p-4">
                  {imgSrc && (
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={selectedAspectRatio}
                      circularCrop={aspectRatio === 1}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop preview"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-w-full max-h-96"
                      />
                    </ReactCrop>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              {/* Quality Slider */}
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
                />
                <p className="text-xs text-muted-foreground">
                  Higher quality = larger file size
                </p>
              </div>

              {/* Format Selector */}
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
                    <SelectItem value="png">PNG (Lossless)</SelectItem>
                    <SelectItem value="jpeg">JPEG (Smaller)</SelectItem>
                    <SelectItem value="webp">WebP (Modern)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditorOpen(false);
                setImgSrc("");
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!completedCrop || processing}>
              {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {processing ? "Processing..." : "Save Logo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogoUpload;
