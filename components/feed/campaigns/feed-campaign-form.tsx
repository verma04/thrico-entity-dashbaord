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
  Radio,
  Layers,
  Palette,
  Image as ImageIcon,
  Calendar,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { FeedFramePreviewCanvas } from "./feed-frame-preview-canvas";
import {
  FeedCampaign,
  useGenerateFeedCampaignAssetUploadUrl,
} from "@/graphql/actions/feed/campaigns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedCampaignFormProps {
  initialValues?: Partial<FeedCampaign>;
  isLoading?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  title?: string;
  description?: string;
}

export function FeedCampaignForm({
  initialValues,
  isLoading = false,
  onSubmit,
  title = "Create Feed Campaign",
  description = "Upload a decorative transparent PNG frame and select where it applies: in Feed, Stories, or Both.",
}: FeedCampaignFormProps) {
  const [generateUploadUrl] = useGenerateFeedCampaignAssetUploadUrl();
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
    placements: Yup.array().of(Yup.string()).min(1, "Select at least one placement").default(["FEED"]),
    aspectRatio: Yup.string().default("1:1"),
    festiveImageUrl: Yup.string().nullable(),
    ctaButtonText: Yup.string().max(50, "CTA label must be 50 characters or less").nullable(),
    ctaBgColor: Yup.string().matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code").nullable(),
    ctaTextColor: Yup.string().matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code").nullable(),
    isFilterActive: Yup.boolean().default(true),
    allowCameraRecording: Yup.boolean().default(true),
    allowFileUpload: Yup.boolean().default(true),
    startDate: Yup.string().nullable(),
    endDate: Yup.string().nullable(),
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
      placements: initialValues?.placements && initialValues.placements.length > 0 ? initialValues.placements : ["FEED"],
      aspectRatio: initialValues?.aspectRatio || "1:1",
      festiveImageUrl: initialValues?.festiveImageUrl || "",
      ctaButtonText: initialValues?.ctaButtonText || "Use Frame",
      ctaBgColor: initialValues?.ctaBgColor || "#4F46E5",
      ctaTextColor: initialValues?.ctaTextColor || "#FFFFFF",
      isFilterActive: initialValues?.isFilterActive ?? true,
      allowCameraRecording: initialValues?.allowCameraRecording ?? true,
      allowFileUpload: initialValues?.allowFileUpload ?? true,
      startDate: initialValues?.startDate ? initialValues.startDate.slice(0, 10) : "",
      endDate: initialValues?.endDate ? initialValues.endDate.slice(0, 10) : "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  // Auto slug generation from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("title", val);
    if (!formik.touched.slug || !formik.values.slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      formik.setFieldValue("slug", generatedSlug);
    }
  };

  // Upload frame handler
  const handleFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("png") && !file.type.includes("webp")) {
      toast.error("Please upload a transparent PNG or WebP image frame");
      return;
    }

    try {
      setIsUploadingFrame(true);

      // Measure dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => {
          formik.setFieldValue("frameMetadata", {
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          URL.revokeObjectURL(objectUrl);
          resolve();
        };
        img.src = objectUrl;
      });

      const { data } = await generateUploadUrl({
        variables: {
          input: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            type: "FRAME",
          },
        },
      });

      const uploadInfo = data?.generateFeedCampaignAssetUploadUrl;
      if (!uploadInfo?.uploadUrl) throw new Error("Failed to get asset upload URL");

      const res = await fetch(uploadInfo.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) throw new Error("Frame upload failed");

      formik.setFieldValue("frameUrl", uploadInfo.fileUrl);
      toast.success("Frame uploaded successfully!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Frame upload failed.");
    } finally {
      setIsUploadingFrame(false);
    }
  };

  // Banner image upload handler
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingBanner(true);
      const { data } = await generateUploadUrl({
        variables: {
          input: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            type: "BANNER",
          },
        },
      });

      const uploadInfo = data?.generateFeedCampaignAssetUploadUrl;
      if (!uploadInfo?.uploadUrl) throw new Error("Failed to get upload URL");

      const res = await fetch(uploadInfo.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!res.ok) throw new Error("Banner upload failed");

      formik.setFieldValue("festiveImageUrl", uploadInfo.fileUrl);
      toast.success("Banner image uploaded successfully!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Banner upload failed.");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Helper to toggle placements
  const togglePlacement = (placement: "FEED" | "STORIES" | "BOTH") => {
    if (placement === "BOTH") {
      formik.setFieldValue("placements", ["FEED", "STORIES", "BOTH"]);
      return;
    }
    const current = [...(formik.values.placements || [])];
    const withoutBoth = current.filter((p) => p !== "BOTH");
    if (withoutBoth.includes(placement)) {
      if (withoutBoth.length === 1) {
        toast.warning("At least one placement must be selected.");
        return;
      }
      formik.setFieldValue(
        "placements",
        withoutBoth.filter((p) => p !== placement)
      );
    } else {
      formik.setFieldValue("placements", [...withoutBoth, placement]);
    }
  };

  const isFeedSelected = formik.values.placements.includes("FEED") || formik.values.placements.includes("BOTH");
  const isStoriesSelected = formik.values.placements.includes("STORIES") || formik.values.placements.includes("BOTH");
  const isBothSelected = (isFeedSelected && isStoriesSelected) || formik.values.placements.includes("BOTH");

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Header Summary */}
        <div className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Placement Selection */}
            <Card className="border-border/60 bg-card shadow-2xs rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div>
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Placement & Destination *
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Choose whether this decorative frame is available for standard Feed posts, Stories, or Both.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Option 1: Feed Only */}
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("placements", ["FEED"])}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24",
                      !isStoriesSelected && isFeedSelected
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500"
                        : "border-border/60 bg-background hover:border-border text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Radio className="h-4 w-4 text-indigo-600" />
                      {!isStoriesSelected && isFeedSelected && (
                        <Check className="h-3.5 w-3.5 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Feed Only</p>
                      <p className="text-[10px] text-muted-foreground">Square & portrait post grid</p>
                    </div>
                  </button>

                  {/* Option 2: Stories Only */}
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("placements", ["STORIES"])}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24",
                      isStoriesSelected && !isFeedSelected
                        ? "border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 ring-1 ring-purple-500"
                        : "border-border/60 bg-background hover:border-border text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Smartphone className="h-4 w-4 text-purple-600" />
                      {isStoriesSelected && !isFeedSelected && (
                        <Check className="h-3.5 w-3.5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Stories Only</p>
                      <p className="text-[10px] text-muted-foreground">9:16 Fullscreen vertical</p>
                    </div>
                  </button>

                  {/* Option 3: Both (Feed & Stories) */}
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("placements", ["FEED", "STORIES", "BOTH"])}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24",
                      isBothSelected
                        ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500"
                        : "border-border/60 bg-background hover:border-border text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Layers className="h-4 w-4 text-emerald-600" />
                      {isBothSelected && (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Feed & Stories</p>
                      <p className="text-[10px] text-muted-foreground">Universal campaign frame</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 2. Transparent Frame Upload (Frame Only) */}
            <Card className="border-border/60 bg-card shadow-2xs rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Transparent Frame Overlay *
                    </Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Upload a transparent PNG overlay frame with cutouts where the user&apos;s photo appears.
                    </p>
                  </div>
                  {formik.values.frameUrl && (
                    <Badge variant="outline" className="text-[10px] border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                      Frame Uploaded
                    </Badge>
                  )}
                </div>

                {formik.values.frameUrl ? (
                  <div className="relative rounded-xl border border-border/60 bg-neutral-900/90 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden p-1">
                        <img
                          src={formik.values.frameUrl}
                          alt="Frame"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Custom PNG Frame</p>
                        <p className="text-[11px] text-neutral-400">
                          {formik.values.frameMetadata?.width && formik.values.frameMetadata?.height
                            ? `${formik.values.frameMetadata.width} × ${formik.values.frameMetadata.height} px`
                            : "Transparent PNG"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <span className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline">
                          Replace
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/webp"
                          className="hidden"
                          onChange={handleFrameUpload}
                          disabled={isUploadingFrame}
                        />
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-400 hover:text-red-400"
                        onClick={() => {
                          formik.setFieldValue("frameUrl", "");
                          formik.setFieldValue("frameMetadata", null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border/80 hover:border-indigo-500 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all">
                    {isUploadingFrame ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                        <span className="text-xs text-muted-foreground font-medium">Uploading & analyzing frame...</span>
                      </div>
                    ) : (
                      <>
                        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">Click to upload frame</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">Transparent PNG or WebP up to 10MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/webp"
                      className="hidden"
                      onChange={handleFrameUpload}
                      disabled={isUploadingFrame}
                    />
                  </label>
                )}

                {formik.touched.frameUrl && formik.errors.frameUrl && (
                  <p className="text-[11px] text-destructive font-medium">
                    {String(formik.errors.frameUrl)}
                  </p>
                )}

                {/* Aspect Ratio Preference */}
                <div className="pt-2 border-t border-border/40">
                  <Label className="text-xs font-semibold text-foreground">Frame Canvas Ratio</Label>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Default framing ratio applied when members open this campaign lens.
                  </p>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "1:1 Square", val: "1:1" },
                      { label: "4:5 Portrait", val: "4:5" },
                      { label: "9:16 Story", val: "9:16" },
                    ].map((ratio) => (
                      <button
                        key={ratio.val}
                        type="button"
                        onClick={() => formik.setFieldValue("aspectRatio", ratio.val)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          formik.values.aspectRatio === ratio.val
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                            : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Campaign General Information */}
            <Card className="border-border/60 bg-card shadow-2xs rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Campaign Details
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Title *</Label>
                    <Input
                      name="title"
                      placeholder="e.g. Alumni Homecoming 2026"
                      value={formik.values.title}
                      onChange={handleTitleChange}
                      onBlur={formik.handleBlur}
                      className="h-9 text-xs"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-[11px] text-destructive">{String(formik.errors.title)}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Slug *</Label>
                    <Input
                      name="slug"
                      placeholder="alumni-homecoming-2026"
                      value={formik.values.slug}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-9 text-xs font-mono"
                    />
                    {formik.touched.slug && formik.errors.slug && (
                      <p className="text-[11px] text-destructive">{String(formik.errors.slug)}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Describe the occasion, hashtag guidelines, and instructions for members..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>

                {/* Status Picker */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status</Label>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "Active", val: "ACTIVE" },
                      { label: "Draft", val: "DRAFT" },
                      { label: "Paused", val: "PAUSED" },
                      { label: "Archived", val: "ARCHIVED" },
                    ].map((st) => (
                      <button
                        key={st.val}
                        type="button"
                        onClick={() => formik.setFieldValue("status", st.val)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          formik.values.status === st.val
                            ? "bg-foreground text-background border-foreground shadow-2xs font-semibold"
                            : "bg-background border-border/60 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. CTA Button & Visual Branding */}
            <Card className="border-border/60 bg-card shadow-2xs rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Action Button & Branding
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* CTA Label */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">CTA Button Text</Label>
                    <Input
                      name="ctaButtonText"
                      placeholder="e.g. Share Post"
                      value={formik.values.ctaButtonText}
                      onChange={formik.handleChange}
                      className="h-9 text-xs"
                    />
                  </div>

                  {/* CTA BG Color */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Button Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formik.values.ctaBgColor || "#4F46E5"}
                        onChange={(e) => formik.setFieldValue("ctaBgColor", e.target.value)}
                        className="h-9 w-9 rounded-md border border-border cursor-pointer p-0.5 bg-background"
                      />
                      <Input
                        name="ctaBgColor"
                        value={formik.values.ctaBgColor}
                        onChange={formik.handleChange}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* CTA Text Color */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formik.values.ctaTextColor || "#FFFFFF"}
                        onChange={(e) => formik.setFieldValue("ctaTextColor", e.target.value)}
                        className="h-9 w-9 rounded-md border border-border cursor-pointer p-0.5 bg-background"
                      />
                      <Input
                        name="ctaTextColor"
                        value={formik.values.ctaTextColor}
                        onChange={formik.handleChange}
                        className="h-9 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Festive / Banner Image */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Label className="text-xs font-semibold">Campaign Banner / Badge (Optional)</Label>
                      <p className="text-[11px] text-muted-foreground">Appears on campaign discovery carousels.</p>
                    </div>
                    {formik.values.festiveImageUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => formik.setFieldValue("festiveImageUrl", "")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {formik.values.festiveImageUrl ? (
                    <div className="h-20 w-48 rounded-lg overflow-hidden border border-border">
                      <img
                        src={formik.values.festiveImageUrl}
                        alt="Festive banner"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/80 hover:border-border cursor-pointer text-xs text-muted-foreground bg-muted/20 w-fit">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploadingBanner ? "Uploading..." : "Upload banner image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerUpload}
                        disabled={isUploadingBanner}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 5. Participation Controls & Schedule */}
            <Card className="border-border/60 bg-card shadow-2xs rounded-xl overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Member Controls & Schedule
                </Label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Active for Community</p>
                      <p className="text-[11px] text-muted-foreground">Members see this frame in Feed & Story creators.</p>
                    </div>
                    <Switch
                      checked={formik.values.isFilterActive}
                      onCheckedChange={(val) => formik.setFieldValue("isFilterActive", val)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Allow Camera Recording</p>
                      <p className="text-[11px] text-muted-foreground">Allow snapping new photos directly through camera.</p>
                    </div>
                    <Switch
                      checked={formik.values.allowCameraRecording}
                      onCheckedChange={(val) => formik.setFieldValue("allowCameraRecording", val)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Allow Device Photo Upload</p>
                      <p className="text-[11px] text-muted-foreground">Allow choosing existing photos from phone/computer.</p>
                    </div>
                    <Switch
                      checked={formik.values.allowFileUpload}
                      onCheckedChange={(val) => formik.setFieldValue("allowFileUpload", val)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/40">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Start Date (Optional)</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">End Date (Optional)</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Interactive Frame Preview (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="rounded-xl border border-border/60 bg-card p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Live Overlay Preview
                </span>
                <Badge variant="secondary" className="text-[9px]">
                  Real-time Canvas
                </Badge>
              </div>

              <FeedFramePreviewCanvas
                frameUrl={formik.values.frameUrl}
                aspectRatio={formik.values.aspectRatio}
                placements={formik.values.placements}
                ctaButtonText={formik.values.ctaButtonText}
                ctaBgColor={formik.values.ctaBgColor}
                ctaTextColor={formik.values.ctaTextColor}
              />
            </div>
          </div>
        </div>

        {/* Floating Save Panel */}
        <FloatingSavePanel
          hasChanged={formik.dirty || !initialValues?.id}
          saved={false}
          isSaving={isLoading}
          onSave={() => formik.handleSubmit()}
          onReset={() => formik.resetForm()}
          title={initialValues?.id ? "Unsaved changes" : "Ready to create campaign"}
          buttonText={initialValues?.id ? "Save Changes" : "Create Campaign"}
        />
      </form>
    </FormikProvider>
  );
}
