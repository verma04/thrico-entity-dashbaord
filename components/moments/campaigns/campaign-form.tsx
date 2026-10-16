"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Sparkles,
  Camera,
  Share2,
  Smartphone,
  Maximize2,
  Loader2,
  Check,
  Upload,
  Rss,
  Palette,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { MomentSequencePicker } from "./moment-sequence-picker";
import { FramePreviewCanvas } from "./frame-preview-canvas";
import {
  MomentCampaign,
  useGenerateCampaignAssetUploadUrl,
} from "@/graphql/actions/moments/campaigns";
import { Moment } from "@/graphql/actions/moments";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CampaignFormProps {
  initialValues?: Partial<MomentCampaign>;
  isLoading?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  title?: string;
  description?: string;
}

export function CampaignForm({
  initialValues,
  isLoading = false,
  onSubmit,
  title = "Create Moment Campaign",
  description = "Configure branded intro/outro videos, transparent PNG frame overlay, and user participation rules.",
}: CampaignFormProps) {
  const [generateUploadUrl] = useGenerateCampaignAssetUploadUrl();
  const [isUploadingFrame, setIsUploadingFrame] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Campaign title is required"),
    slug: Yup.string()
      .matches(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and dashes")
      .required("Slug is required"),
    description: Yup.string().nullable(),
    status: Yup.string().oneOf(["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"]).default("ACTIVE"),
    frameUrl: Yup.string().required("Transparent PNG frame is required"),
    introMomentId: Yup.string().nullable(),
    introVideoUrl: Yup.string().nullable(),
    outroMomentId: Yup.string().nullable(),
    outroVideoUrl: Yup.string().nullable(),
    aspectRatio: Yup.string().default("9:16"),
    fitMode: Yup.string().oneOf(["FIT", "FILL", "CONTAIN"]).default("FIT"),
    minUserDurationSeconds: Yup.number()
      .min(3, "Minimum duration cannot be less than 3 seconds")
      .max(180, "Minimum duration cannot exceed 180 seconds")
      .required("Minimum duration is required"),
    maxUserDurationSeconds: Yup.number()
      .min(Yup.ref("minUserDurationSeconds"), "Max duration must be greater than or equal to min duration")
      .max(180, "Maximum duration cannot exceed 180 seconds")
      .required("Maximum duration is required"),
    festiveImageUrl: Yup.string().nullable(),
    ctaButtonText: Yup.string().max(50, "CTA label must be 50 characters or less").nullable(),
    ctaBgColor: Yup.string()
      .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code")
      .nullable(),
    ctaTextColor: Yup.string()
      .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code")
      .nullable(),
    isFilterActive: Yup.boolean().default(true),
    allowCameraRecording: Yup.boolean().default(true),
    allowFileUpload: Yup.boolean().default(true),
    autoPublishMoment: Yup.boolean().default(false),
    shareInFeed: Yup.boolean().default(true),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialValues?.title || "",
      slug: initialValues?.slug || "",
      description: initialValues?.description || "",
      status: initialValues?.status || "ACTIVE",
      frameUrl: initialValues?.frameUrl || "",
      frameMetadata: initialValues?.frameMetadata
        ? {
            width: typeof initialValues.frameMetadata.width === "number" ? initialValues.frameMetadata.width : undefined,
            height: typeof initialValues.frameMetadata.height === "number" ? initialValues.frameMetadata.height : undefined,
          }
        : null,
      introMomentId: initialValues?.introMomentId || null,
      introVideoUrl: initialValues?.introVideoUrl || null,
      outroMomentId: initialValues?.outroMomentId || null,
      outroVideoUrl: initialValues?.outroVideoUrl || null,
      aspectRatio: initialValues?.aspectRatio || "9:16",
      fitMode: initialValues?.fitMode || "FIT",
      minUserDurationSeconds: initialValues?.minUserDurationSeconds ?? 3,
      maxUserDurationSeconds: initialValues?.maxUserDurationSeconds ?? 60,
      festiveImageUrl: initialValues?.festiveImageUrl || "",
      ctaButtonText: initialValues?.ctaButtonText || "",
      ctaBgColor: initialValues?.ctaBgColor || "#4F46E5",
      ctaTextColor: initialValues?.ctaTextColor || "#FFFFFF",
      isFilterActive: initialValues?.isFilterActive ?? true,
      allowCameraRecording: initialValues?.allowCameraRecording ?? true,
      allowFileUpload: initialValues?.allowFileUpload ?? true,
      autoPublishMoment: initialValues?.autoPublishMoment ?? false,
      shareInFeed: initialValues?.shareInFeed ?? true,
    },
    validationSchema,
    onSubmit: async (values) => {
      const rawMeta = values.frameMetadata as { width?: unknown; height?: unknown } | null | undefined;
      const cleanFrameMetadata =
        rawMeta && (typeof rawMeta.width === "number" || typeof rawMeta.height === "number")
          ? {
              width: typeof rawMeta.width === "number" ? rawMeta.width : undefined,
              height: typeof rawMeta.height === "number" ? rawMeta.height : undefined,
            }
          : null;

      await onSubmit({
        ...values,
        frameMetadata: cleanFrameMetadata,
      });
    },
  });

  // Auto-slugify title if slug is empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    if (!formik.values.slug || formik.values.slug === formik.initialValues.slug) {
      const generatedSlug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      formik.setFieldValue("slug", generatedSlug);
    }
  };

  // Upload frame directly to S3 via presigned PUT
  const uploadFrameToS3 = (url: string, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "image/png");

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during frame upload."));
      xhr.send(file);
    });
  };

  // Custom upload handler for ImageUploadWithCrop
  const handleFrameCustomUpload = async (file: File): Promise<string> => {
    setIsUploadingFrame(true);

    try {
      // 1. Calculate natural image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => {
          formik.setFieldValue("frameMetadata", {
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          resolve();
        };
        img.onerror = () => resolve();
      });

      // 2. Request presigned upload URL from backend
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            fileName: file.name || "campaign-frame.png",
            fileType: "image/png",
            type: "FRAME",
          },
        },
      });

      if (!data?.generateCampaignAssetUploadUrl?.uploadUrl) {
        throw new Error("Failed to get asset upload URL from server.");
      }

      const { uploadUrl, fileUrl } = data.generateCampaignAssetUploadUrl;

      // 3. Direct upload to S3 via PUT
      await uploadFrameToS3(uploadUrl, file);

      toast.success("Frame uploaded to cloud storage!");
      return fileUrl;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to upload frame.");
      throw err;
    } finally {
      setIsUploadingFrame(false);
    }
  };

  // Custom upload handler for Festive CTA Banner
  const handleBannerCustomUpload = async (file: File): Promise<string> => {
    setIsUploadingBanner(true);

    try {
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            fileName: file.name || "festive-banner.webp",
            fileType: file.type || "image/webp",
            type: "BANNER",
          },
        },
      });

      if (!data?.generateCampaignAssetUploadUrl?.uploadUrl) {
        throw new Error("Failed to get asset upload URL from server.");
      }

      const { uploadUrl, fileUrl } = data.generateCampaignAssetUploadUrl;
      await uploadFrameToS3(uploadUrl, file);

      toast.success("Festive banner uploaded!");
      return fileUrl;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to upload festive banner.");
      throw err;
    } finally {
      setIsUploadingBanner(false);
    }
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6 pb-24">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              {title}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold px-2.5 py-1",
                formik.values.status === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {formik.values.status}
            </Badge>
          </div>
        </div>

        {/* 2-Column Responsive Layout Standard: 8-col Main Form + 4-col Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Form Fields (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Campaign Details */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Campaign Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-foreground">
                    Campaign Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Summer Festival Moment Challenge"
                    value={formik.values.title}
                    onChange={handleTitleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs",
                      formik.touched.title && formik.errors.title && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slug" className="text-xs font-semibold text-foreground">
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="summer-festival-moment"
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs font-mono",
                      formik.touched.slug && formik.errors.slug && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.slug && formik.errors.slug && (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.slug}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-foreground">
                  Description / Creator Prompt
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Explain the video challenge or instructions for members recording with this frame..."
                  value={formik.values.description || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">Campaign Status</p>
                    <p className="text-[11px] text-muted-foreground">
                      Set whether campaign is actively accepting videos
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("status", checked ? "ACTIVE" : "PAUSED")
                    }
                  />
                </div>

                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">Filter On for Users</p>
                    <p className="text-[11px] text-muted-foreground">
                      Publish festive banner and camera frame filter to the user app
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.isFilterActive}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("isFilterActive", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Sequence Builder (Intro & Outro Moments) */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    2
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Video Sequence (Intro & Outro Moments)
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Selected from Moment List
                </Badge>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Select existing moments from your community to play before and after the framed user video. Both are optional.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Intro Moment Picker */}
                <MomentSequencePicker
                  label="Intro Moment Video"
                  type="INTRO"
                  description="Plays for ~3-5 seconds introducing the brand or theme before user video."
                  selectedMomentId={formik.values.introMomentId}
                  onSelectMoment={(moment: Moment | null) => {
                    formik.setFieldValue("introMomentId", moment?.id || null);
                    formik.setFieldValue("introVideoUrl", moment?.videoUrl || null);
                  }}
                />

                {/* Outro Moment Picker */}
                <MomentSequencePicker
                  label="Outro Moment Video"
                  type="OUTRO"
                  description="Plays after the user video as a call to action or closing credit."
                  selectedMomentId={formik.values.outroMomentId}
                  onSelectMoment={(moment: Moment | null) => {
                    formik.setFieldValue("outroMomentId", moment?.id || null);
                    formik.setFieldValue("outroVideoUrl", moment?.videoUrl || null);
                  }}
                />
              </div>
            </div>

            {/* Step 3: Visual Branding Assets & Decorative Frame */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    3
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Visual Branding & Festive Assets
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {(isUploadingFrame || isUploadingBanner) && (
                    <Badge variant="outline" className="text-[10px] text-indigo-500 bg-indigo-500/10 border-indigo-500/20 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Uploading asset...
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    PNG Frame • 16:9 Banner
                  </Badge>
                </div>
              </div>

              {/* Sub-section A: Transparent PNG Frame */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Camera Overlay Frame (1080×1920 PNG) <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">9:16 Portrait Cutout</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Upload and crop a 1080×1920 PNG frame with transparent cutout. The member&apos;s live camera feed will display beneath this frame.
                </p>

                <ImageUploadWithCrop
                  currentImage={formik.values.frameUrl || undefined}
                  onImageUpdate={(_cdnUrl: string, url: string) => {
                    formik.setFieldValue("frameUrl", url || "");
                    if (!url) {
                      formik.setFieldValue("frameMetadata", null);
                    }
                  }}
                  customUploadHandler={handleFrameCustomUpload}
                  label="Campaign Overlay Frame"
                  aspectRatio={9 / 16}
                  recommendedWidth={1080}
                  recommendedHeight={1920}
                  allowedFormats={["image/png"]}
                  defaultFormat="png"
                  showFormatSelector={false}
                  allowFreeDimensions={true}
                  showAspectRatioPresets={true}
                  aspectRatioPresets={[
                    { label: "9:16 Portrait", value: 9 / 16 },
                    { label: "1:1 Square", value: 1 },
                    { label: "16:9 Banner", value: 16 / 9 },
                    { label: "Free Dimensions", value: undefined },
                  ]}
                  customDescription="Upload a 1080×1920 transparent PNG frame. Transparent center cutouts let member video show through."
                />

                {formik.touched.frameUrl && formik.errors.frameUrl && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.frameUrl}
                  </p>
                )}
              </div>

              {/* Sub-section B: Festive Banner Image */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Festive / CTA Campaign Hero Banner
                  </Label>
                  <span className="text-[10px] text-muted-foreground">16:9 Banner</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Displayed as a prominent festive challenge card on the user app Moments feed when &quot;Filter On for Users&quot; is enabled.
                </p>
                <ImageUploadWithCrop
                  currentImage={formik.values.festiveImageUrl || undefined}
                  onImageUpdate={(_cdnUrl: string, url: string) => {
                    formik.setFieldValue("festiveImageUrl", url || "");
                  }}
                  customUploadHandler={handleBannerCustomUpload}
                  label="Festive Banner"
                  aspectRatio={16 / 9}
                  recommendedWidth={1200}
                  recommendedHeight={675}
                  allowedFormats={["image/jpeg", "image/png", "image/webp"]}
                  defaultFormat="webp"
                  showFormatSelector={false}
                  allowFreeDimensions={true}
                  showAspectRatioPresets={true}
                  aspectRatioPresets={[
                    { label: "16:9 Banner", value: 16 / 9 },
                    { label: "21:9 Ultra Wide", value: 21 / 9 },
                    { label: "Free Dimensions", value: undefined },
                  ]}
                  customDescription="16:9 festive visual (e.g. Diwali celebration, holiday challenge, brand contest)."
                />
              </div>

              {/* Sub-section C: Custom CTA Button Text */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label htmlFor="ctaButtonText" className="text-xs font-semibold text-foreground">
                  Custom CTA Button Label
                </Label>
                <Input
                  id="ctaButtonText"
                  name="ctaButtonText"
                  placeholder="e.g. Record Festive Reel, Try Diwali Frame, Join Challenge"
                  value={formik.values.ctaButtonText || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-9 text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Text for the action button on the user app hero banner and mobile camera quick-action (defaults to &apos;Record with Filter&apos; if left blank).
                </p>
              </div>

              {/* Sub-section D: CTA Button Color & Style */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-indigo-500" />
                    CTA Button Styling & Palette
                  </Label>
                  <span className="text-[10px] text-muted-foreground">Button Color Scheme</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Customize the background color and text contrast for the call-to-action button in the member catalog and festive feed banner.
                </p>

                {/* Preset Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Preset Themes
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { name: "Indigo", bg: "#4F46E5", text: "#FFFFFF" },
                      { name: "Crimson", bg: "#E11D48", text: "#FFFFFF" },
                      { name: "Gold", bg: "#D97706", text: "#FFFFFF" },
                      { name: "Emerald", bg: "#059669", text: "#FFFFFF" },
                      { name: "Violet", bg: "#7C3AED", text: "#FFFFFF" },
                      { name: "Amber", bg: "#F59E0B", text: "#000000" },
                      { name: "Zinc", bg: "#18181B", text: "#FFFFFF" },
                    ].map((preset) => {
                      const isSelected =
                        formik.values.ctaBgColor?.toUpperCase() === preset.bg.toUpperCase();
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("ctaBgColor", preset.bg);
                            formik.setFieldValue("ctaTextColor", preset.text);
                          }}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
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
                    <Label htmlFor="ctaBgColor" className="text-[11px] font-medium text-muted-foreground">
                      Background Color (HEX)
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="ctaBgColorPicker"
                        aria-label="CTA Button Background Color"
                        value={formik.values.ctaBgColor || "#4F46E5"}
                        onChange={(e) => formik.setFieldValue("ctaBgColor", e.target.value)}
                        className="h-9 w-9 rounded-lg border border-border/70 cursor-pointer p-0.5 bg-background shrink-0"
                      />
                      <Input
                        id="ctaBgColor"
                        name="ctaBgColor"
                        placeholder="#4F46E5"
                        value={formik.values.ctaBgColor || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="ctaTextColor" className="text-[11px] font-medium text-muted-foreground">
                      Text & Icon Color (HEX)
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="ctaTextColorPicker"
                        aria-label="CTA Button Text & Icon Color"
                        value={formik.values.ctaTextColor || "#FFFFFF"}
                        onChange={(e) => formik.setFieldValue("ctaTextColor", e.target.value)}
                        className="h-9 w-9 rounded-lg border border-border/70 cursor-pointer p-0.5 bg-background shrink-0"
                      />
                      <Input
                        id="ctaTextColor"
                        name="ctaTextColor"
                        placeholder="#FFFFFF"
                        value={formik.values.ctaTextColor || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Button */}
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Live CTA Preview:</span> Button as members will see it
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: formik.values.ctaBgColor || "#4F46E5",
                      color: formik.values.ctaTextColor || "#FFFFFF",
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-transform active:scale-95 pointer-events-none"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{formik.values.ctaButtonText?.trim() || "Record with Filter"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Framing & User Participation Controls */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  4
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Framing & User Participation Rules
                </h3>
              </div>

              {/* Fit Mode Tiles */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Video Fitting Mode inside Frame
                </Label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div
                    onClick={() => formik.setFieldValue("fitMode", "FIT")}
                    className={cn(
                      "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1",
                      formik.values.fitMode === "FIT"
                        ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                        : "border-border/60 hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
                        Fit / Letterbox
                      </span>
                      {formik.values.fitMode === "FIT" && (
                        <Check className="h-3.5 w-3.5 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Preserves entire user video without cropping; centers in frame.
                    </p>
                  </div>

                  <div
                    onClick={() => formik.setFieldValue("fitMode", "FILL")}
                    className={cn(
                      "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1",
                      formik.values.fitMode === "FILL"
                        ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-500/20"
                        : "border-border/60 hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Maximize2 className="h-3.5 w-3.5 text-indigo-500" />
                        Fill / Cover
                      </span>
                      {formik.values.fitMode === "FILL" && (
                        <Check className="h-3.5 w-3.5 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Scales to fill entire portrait viewport, cropping edges if needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration Limits (Min & Max) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minUserDurationSeconds" className="text-xs font-semibold text-foreground">
                      Min User Duration
                    </Label>
                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      {formik.values.minUserDurationSeconds}s
                    </span>
                  </div>
                  <Input
                    id="minUserDurationSeconds"
                    name="minUserDurationSeconds"
                    type="number"
                    min={3}
                    max={180}
                    value={formik.values.minUserDurationSeconds}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs",
                      formik.touched.minUserDurationSeconds &&
                        formik.errors.minUserDurationSeconds &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.minUserDurationSeconds && formik.errors.minUserDurationSeconds && (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.minUserDurationSeconds as string}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Minimum seconds required (cannot be less than 3s).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxUserDurationSeconds" className="text-xs font-semibold text-foreground">
                      Max User Duration
                    </Label>
                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      {formik.values.maxUserDurationSeconds}s
                    </span>
                  </div>
                  <Input
                    id="maxUserDurationSeconds"
                    name="maxUserDurationSeconds"
                    type="number"
                    min={3}
                    max={180}
                    value={formik.values.maxUserDurationSeconds}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs",
                      formik.touched.maxUserDurationSeconds &&
                        formik.errors.maxUserDurationSeconds &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.maxUserDurationSeconds && formik.errors.maxUserDurationSeconds && (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.maxUserDurationSeconds as string}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Camera stops automatically when reaching limit (up to 180s).
                  </p>
                </div>
              </div>

              {/* Participation Toggles */}
              <div className="space-y-2 pt-2">
                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-indigo-500" /> Allow Live Camera Recording
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Users can record live in mobile portrait view with the PNG frame overlay
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.allowCameraRecording}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowCameraRecording", checked)
                    }
                  />
                </div>

                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5 text-indigo-500" /> Allow File Upload
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Users can upload pre-recorded MP4/MOV videos from device
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.allowFileUpload}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowFileUpload", checked)
                    }
                  />
                </div>

                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Share2 className="h-3.5 w-3.5 text-emerald-500" /> Auto-Publish to Community Moments
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Automatically register the rendered composite MP4 as a new community Moment
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.autoPublishMoment}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("autoPublishMoment", checked)
                    }
                  />
                </div>

                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Rss className="h-3.5 w-3.5 text-indigo-500" /> Share Moment in Community Feed
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Broadcast published moments to the main social feed for all community members to discover
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.shareInFeed}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("shareInFeed", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Live Preview Sidebar (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Viewport Preview
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {formik.values.aspectRatio}
                </Badge>
              </div>

              <FramePreviewCanvas
                frameUrl={formik.values.frameUrl}
                introVideoUrl={formik.values.introVideoUrl}
                outroVideoUrl={formik.values.outroVideoUrl}
                fitMode={formik.values.fitMode as "FIT" | "FILL"}
                introDuration={formik.values.introMomentId ? 5 : undefined}
                outroDuration={formik.values.outroMomentId ? 4 : undefined}
              />
            </div>
          </div>
        </div>

        {/* Floating Save Panel Bottom Dock Standard */}
        <FloatingSavePanel
          hasChanged={formik.dirty}
          saved={false}
          isSaving={formik.isSubmitting || isLoading || isUploadingFrame}
          onSave={formik.handleSubmit}
          onReset={formik.resetForm}
          title={initialValues?.id ? "Unsaved Campaign Changes" : "Create New Campaign"}
          saveButtonText={initialValues?.id ? "Save Campaign Changes" : "Publish Campaign"}
          discardButtonText="Discard"
        />
      </form>
    </FormikProvider>
  );
}
