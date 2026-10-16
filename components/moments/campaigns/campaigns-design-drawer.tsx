"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  Palette,
  Loader2,
  Check,
  Sparkles,
  Camera,
  Trash2,
  Layers,
  Smartphone,
  Monitor,
  Wifi,
  ChevronLeft,
  Search,
} from "lucide-react";
import {
  useGetMomentsCampaignsDesignSettings,
  useUpdateMomentsCampaignsDesignSettings,
  useGenerateCampaignAssetUploadUrl,
} from "@/graphql/actions/moments/campaigns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CampaignsDesignDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const validationSchema = Yup.object().shape({
  pageTitle: Yup.string()
    .max(100, "Title must be 100 characters or less")
    .nullable(),
  pageSubtitle: Yup.string()
    .max(250, "Subtitle must be 250 characters or less")
    .nullable(),
  pageBgColor: Yup.string()
    .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code")
    .nullable(),
  pageBgUrl: Yup.string().nullable(),
  defaultCtaColor: Yup.string()
    .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code")
    .nullable(),
  defaultCtaTextColor: Yup.string()
    .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code")
    .nullable(),
});

const PRESET_BG_THEMES = [
  { name: "Default Dark", hex: "#09090B", text: "#FFFFFF" },
  { name: "Deep Indigo", hex: "#0F172A", text: "#FFFFFF" },
  { name: "Midnight Purple", hex: "#1E112A", text: "#FFFFFF" },
  { name: "Royal Festive", hex: "#2A0E1A", text: "#FFFFFF" },
  { name: "Warm Amber", hex: "#1C1408", text: "#FFFFFF" },
  { name: "Clean Minimal", hex: "#F8FAFC", text: "#0F172A" },
];

const PRESET_CTA_COLORS = [
  { name: "Indigo", bg: "#4F46E5", text: "#FFFFFF" },
  { name: "Crimson", bg: "#E11D48", text: "#FFFFFF" },
  { name: "Festive Gold", bg: "#D97706", text: "#FFFFFF" },
  { name: "Emerald", bg: "#059669", text: "#FFFFFF" },
  { name: "Purple", bg: "#7C3AED", text: "#FFFFFF" },
  { name: "Dark Zinc", bg: "#18181B", text: "#FFFFFF" },
];

export function CampaignsDesignDrawer({
  open,
  onOpenChange,
}: CampaignsDesignDrawerProps) {
  const { data, loading: loadingSettings } = useGetMomentsCampaignsDesignSettings();
  const [updateSettings, { loading: updating }] = useUpdateMomentsCampaignsDesignSettings();
  const [generateUploadUrl] = useGenerateCampaignAssetUploadUrl();
  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  const initialSettings = data?.getMomentsCampaignsDesignSettings;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pageTitle: initialSettings?.pageTitle ?? "Moment Challenges & Campaigns",
      pageSubtitle:
        initialSettings?.pageSubtitle ??
        "Record branded video reels with exclusive interactive frames, celebratory themes, and effects.",
      pageBgColor: initialSettings?.pageBgColor ?? "#09090B",
      pageBgUrl: initialSettings?.pageBgUrl ?? "",
      defaultCtaColor: initialSettings?.defaultCtaColor ?? "#4F46E5",
      defaultCtaTextColor: initialSettings?.defaultCtaTextColor ?? "#FFFFFF",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateSettings({
          variables: {
            input: {
              pageTitle: values.pageTitle?.trim() || null,
              pageSubtitle: values.pageSubtitle?.trim() || null,
              pageBgColor: values.pageBgColor?.trim() || null,
              pageBgUrl: values.pageBgUrl?.trim() || null,
              defaultCtaColor: values.defaultCtaColor?.trim() || null,
              defaultCtaTextColor: values.defaultCtaTextColor?.trim() || null,
            },
          },
        });
        toast.success("Campaign catalog design settings updated!");
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to update design settings.");
      }
    },
  });

  const uploadToS3 = (url: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "image/webp");
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 upload failed with status ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error during image upload."));
      xhr.send(file);
    });
  };

  const handleBgCustomUpload = async (file: File): Promise<string> => {
    setIsUploadingBg(true);
    try {
      const { data: urlData } = await generateUploadUrl({
        variables: {
          input: {
            fileName: file.name || "campaigns-catalog-bg.webp",
            fileType: file.type || "image/webp",
            type: "BANNER",
          },
        },
      });

      if (!urlData?.generateCampaignAssetUploadUrl?.uploadUrl) {
        throw new Error("Failed to get asset upload URL.");
      }

      const { uploadUrl, fileUrl } = urlData.generateCampaignAssetUploadUrl;
      await uploadToS3(uploadUrl, file);
      toast.success("Background wallpaper uploaded successfully!");
      return fileUrl;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to upload background image.");
      throw err;
    } finally {
      setIsUploadingBg(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-2xl w-full p-0 flex flex-col h-full bg-background border-l border-border/60 z-50"
      >
        {/* Tier 1: Sticky Header */}
        <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-sm font-bold text-foreground">
                  Member Campaigns Design Settings
                </SheetTitle>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-semibold px-2 py-0.5 rounded-full">
                  9:16 Mobile First
                </span>
              </div>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Customize branding, 9:16 portrait wallpapers, color themes, and CTA styling for members.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Tier 2: Scrollable Body */}
        {loadingSettings ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-2">Loading design configuration...</p>
          </div>
        ) : (
          <form
            id="campaigns-design-form"
            onSubmit={formik.handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Step 1: Catalog Header & Copy */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Catalog Hero Header & Copy
                </h3>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pageTitle" className="text-xs font-semibold text-foreground">
                  Catalog Page Title
                </Label>
                <Input
                  id="pageTitle"
                  name="pageTitle"
                  placeholder="e.g. Moment Challenges & Campaigns"
                  value={formik.values.pageTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-9 text-xs"
                />
                {formik.touched.pageTitle && formik.errors.pageTitle && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.pageTitle}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pageSubtitle" className="text-xs font-semibold text-foreground">
                  Catalog Subtitle / Instructions
                </Label>
                <Textarea
                  id="pageSubtitle"
                  name="pageSubtitle"
                  rows={2}
                  placeholder="e.g. Record branded video reels with exclusive interactive frames, celebratory themes, and effects."
                  value={formik.values.pageSubtitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-xs resize-none"
                />
                {formik.touched.pageSubtitle && formik.errors.pageSubtitle && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.pageSubtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: Page Background & Wallpaper */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  2
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  9:16 Mobile Atmosphere & Wallpaper
                </h3>
              </div>

              {/* Theme Color presets */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Background Base Color
                </Label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {PRESET_BG_THEMES.map((theme) => {
                    const isSelected =
                      formik.values.pageBgColor?.toUpperCase() === theme.hex.toUpperCase();
                    return (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => formik.setFieldValue("pageBgColor", theme.hex)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer",
                          isSelected
                            ? "border-primary ring-2 ring-primary/30 font-semibold bg-muted/40"
                            : "border-border/60 hover:border-foreground/30"
                        )}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: theme.hex }}
                        />
                        <span className="text-[11px] truncate text-foreground">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hex Color */}
              <div className="space-y-1 pt-1">
                <Label htmlFor="pageBgColor" className="text-[11px] font-medium text-muted-foreground">
                  Custom Base Hex Color
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="pageBgColorPicker"
                    aria-label="Background Base Color"
                    value={formik.values.pageBgColor || "#09090B"}
                    onChange={(e) => formik.setFieldValue("pageBgColor", e.target.value)}
                    className="h-9 w-9 rounded-lg border border-border/70 cursor-pointer p-0.5 bg-background shrink-0"
                  />
                  <Input
                    id="pageBgColor"
                    name="pageBgColor"
                    placeholder="#09090B"
                    value={formik.values.pageBgColor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              {/* Optional Custom Background Image with 9:16 mobile crop */}
              <div className="space-y-2 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    Custom 9:16 Mobile Wallpaper / Graphic
                  </Label>
                  {formik.values.pageBgUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => formik.setFieldValue("pageBgUrl", "")}
                      className="h-6 px-2 text-[10px] text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Upload a 9:16 portrait graphic or ambient wallpaper optimized for mobile smartphone displays.
                </p>

                <ImageUploadWithCrop
                  currentImage={formik.values.pageBgUrl || undefined}
                  onImageUpdate={(_cdnUrl: string, url: string) => {
                    formik.setFieldValue("pageBgUrl", url || "");
                  }}
                  customUploadHandler={handleBgCustomUpload}
                  label="9:16 Mobile Wallpaper"
                  aspectRatio={9 / 16}
                  recommendedWidth={1080}
                  recommendedHeight={1920}
                  allowedFormats={["image/jpeg", "image/png", "image/webp"]}
                  defaultFormat="webp"
                  showFormatSelector={false}
                  allowFreeDimensions={true}
                  showAspectRatioPresets={true}
                  aspectRatioPresets={[
                    { label: "9:16 Mobile Screen (Recommended)", value: 9 / 16 },
                    { label: "16:9 Desktop Banner", value: 16 / 9 },
                    { label: "Free Dimensions", value: undefined },
                  ]}
                  customDescription="1080x1920 portrait wallpaper or festive graphic."
                />
                {isUploadingBg && (
                  <p className="text-[11px] text-indigo-500 animate-pulse flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading background image...
                  </p>
                )}
              </div>
            </div>

            {/* Step 3: Default Call-to-Action Color & Style */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  3
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Default Button Styling
                </h3>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Fallback styling for challenge CTA buttons when a specific campaign has not specified its own color overrides.
              </p>

              {/* Preset Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Preset Color Themes
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_CTA_COLORS.map((preset) => {
                    const isSelected =
                      formik.values.defaultCtaColor?.toUpperCase() === preset.bg.toUpperCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("defaultCtaColor", preset.bg);
                          formik.setFieldValue("defaultCtaTextColor", preset.text);
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer",
                          isSelected
                            ? "border-primary ring-2 ring-primary/30 font-semibold"
                            : "border-border/60 hover:border-foreground/30"
                        )}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: preset.bg }}
                        />
                        <span className="text-[11px] text-foreground">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="defaultCtaColor" className="text-[11px] font-medium text-muted-foreground">
                    Button Background (HEX)
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="defaultCtaColorPicker"
                      aria-label="Default Button Background Color"
                      value={formik.values.defaultCtaColor || "#4F46E5"}
                      onChange={(e) => formik.setFieldValue("defaultCtaColor", e.target.value)}
                      className="h-9 w-9 rounded-lg border border-border/70 cursor-pointer p-0.5 bg-background shrink-0"
                    />
                    <Input
                      id="defaultCtaColor"
                      name="defaultCtaColor"
                      placeholder="#4F46E5"
                      value={formik.values.defaultCtaColor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-9 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="defaultCtaTextColor" className="text-[11px] font-medium text-muted-foreground">
                    Text & Icon (HEX)
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="defaultCtaTextColorPicker"
                      aria-label="Default Button Text Color"
                      value={formik.values.defaultCtaTextColor || "#FFFFFF"}
                      onChange={(e) => formik.setFieldValue("defaultCtaTextColor", e.target.value)}
                      className="h-9 w-9 rounded-lg border border-border/70 cursor-pointer p-0.5 bg-background shrink-0"
                    />
                    <Input
                      id="defaultCtaTextColor"
                      name="defaultCtaTextColor"
                      placeholder="#FFFFFF"
                      value={formik.values.defaultCtaTextColor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-9 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: 9:16 Mobile Design Simulator & Live Preview */}
            <div className="rounded-xl border border-border/70 p-4 bg-muted/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    4
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
                    9:16 Mobile Simulator Preview
                  </h3>
                </div>

                {/* Mode toggle */}
                <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer",
                      previewMode === "mobile"
                        ? "bg-indigo-600 text-white shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Smartphone className="h-3 w-3" />
                    9:16 Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer",
                      previewMode === "desktop"
                        ? "bg-indigo-600 text-white shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Monitor className="h-3 w-3" />
                    Banner
                  </button>
                </div>
              </div>

              {previewMode === "mobile" ? (
                /* 9:16 Mobile Device Frame Simulator */
                <div className="py-2 flex justify-center">
                  <div className="w-[280px] h-[500px] rounded-[38px] p-2.5 bg-zinc-950 border-[3.5px] border-zinc-700 shadow-2xl relative flex flex-col shrink-0">
                    {/* Dynamic Island / Notch */}
                    <div className="w-20 h-4 bg-black rounded-full mx-auto absolute top-3.5 left-1/2 -translate-x-1/2 z-30 shadow-xs flex items-center justify-end px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                    </div>

                    {/* Mobile Screen */}
                    <div
                      className="overflow-hidden rounded-[28px] h-full flex flex-col relative transition-all"
                      style={{
                        backgroundColor: formik.values.pageBgColor || "#09090B",
                        backgroundImage: formik.values.pageBgUrl
                          ? `url(${formik.values.pageBgUrl})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Screen Status Bar */}
                      <div className="relative z-20 flex items-center justify-between px-4 pt-2.5 text-[10px] font-semibold text-white/90">
                        <span>9:41</span>
                        <div className="flex items-center gap-1.5 text-white/80">
                          <Wifi className="h-3 w-3" />
                          <div className="w-4 h-2 rounded-xs border border-white/80 flex items-center p-0.5">
                            <div className="w-full h-full bg-white/90 rounded-2xs" />
                          </div>
                        </div>
                      </div>

                      {/* Mobile App Header */}
                      <div className="relative z-20 flex items-center justify-between px-3 pt-3 pb-1 text-white">
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          <ChevronLeft className="h-4 w-4" />
                          <span>Challenges</span>
                        </div>
                        <Search className="h-3.5 w-3.5 text-white/70" />
                      </div>

                      {/* Mobile Catalog Body */}
                      <div className="relative z-20 flex-1 overflow-y-auto px-3 py-2 space-y-2.5 scrollbar-none">
                        {/* Catalog Header */}
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-tight leading-tight">
                            {formik.values.pageTitle || "Moment Challenges"}
                          </h4>
                          <p className="text-[9px] text-zinc-300 mt-0.5 line-clamp-2 leading-snug">
                            {formik.values.pageSubtitle || "Record branded reels with interactive frames."}
                          </p>
                        </div>

                        {/* Card 1: Festive Challenge */}
                        <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-2.5 space-y-2 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="h-2 w-2" />
                              Active Challenge
                            </span>
                            <span className="text-[8px] text-white/60">3s - 60s</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/20 border border-white/20 flex items-center justify-center shrink-0">
                              <Camera className="h-5 w-5 text-indigo-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-white truncate">
                                Festive Celebration Frame
                              </p>
                              <p className="text-[9px] text-zinc-300">
                                9:16 Portrait • Frame Included
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            style={{
                              backgroundColor: formik.values.defaultCtaColor || "#4F46E5",
                              color: formik.values.defaultCtaTextColor || "#FFFFFF",
                            }}
                            className="w-full py-1.5 rounded-lg text-[10px] font-bold shadow-xs flex items-center justify-center gap-1 pointer-events-none"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>Record with Filter</span>
                          </button>
                        </div>

                        {/* Card 2: Secondary Challenge */}
                        <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-2.5 space-y-2 shadow-xs opacity-90">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-1.5 py-0.5 rounded-full">
                              Community Reel
                            </span>
                            <span className="text-[8px] text-white/60">3s - 180s</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 border border-white/20 flex items-center justify-center shrink-0">
                              <Camera className="h-5 w-5 text-emerald-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-white truncate">
                                Member Spotlight Contest
                              </p>
                              <p className="text-[9px] text-zinc-300">
                                Share in Feed Enabled
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            style={{
                              backgroundColor: formik.values.defaultCtaColor || "#4F46E5",
                              color: formik.values.defaultCtaTextColor || "#FFFFFF",
                            }}
                            className="w-full py-1.5 rounded-lg text-[10px] font-bold shadow-xs flex items-center justify-center gap-1 pointer-events-none"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>Record with Filter</span>
                          </button>
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="relative z-20 py-1.5 flex justify-center">
                        <div className="w-20 h-1 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Banner Preview */
                <div
                  className="rounded-xl p-4 border border-border/40 relative overflow-hidden transition-all shadow-md"
                  style={{
                    backgroundColor: formik.values.pageBgColor || "#09090B",
                    backgroundImage: formik.values.pageBgUrl
                      ? `url(${formik.values.pageBgUrl})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                  <div className="relative z-10 space-y-3 text-white">
                    <div>
                      <h4 className="text-sm font-bold tracking-tight">
                        {formik.values.pageTitle || "Moment Challenges & Campaigns"}
                      </h4>
                      <p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">
                        {formik.values.pageSubtitle || "Record branded video reels with exclusive interactive frames."}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 backdrop-blur-md p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                          <Camera className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            Festive Holiday Challenge
                          </p>
                          <p className="text-[10px] text-zinc-300">
                            Active • 9:16 Portrait Frame
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{
                          backgroundColor: formik.values.defaultCtaColor || "#4F46E5",
                          color: formik.values.defaultCtaTextColor || "#FFFFFF",
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs shrink-0 flex items-center gap-1.5 pointer-events-none"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Record</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Tier 3: Sticky Footer */}
        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="campaigns-design-form"
            disabled={updating}
            className="bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer"
          >
            {updating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Check className="h-3.5 w-3.5 mr-1.5" />
            )}
            Save Design Settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
