"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Sparkles,
  Camera,
  Smartphone,
  Loader2,
  Check,
  Upload,
  Radio,
  Layers,
  Palette,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { FeedFramePreviewCanvas } from "./feed-frame-preview-canvas";
import {
  FeedCampaign,
  useGenerateFeedCampaignAssetUploadUrl,
} from "@/graphql/actions/feed/campaigns";
import { useUploadImage } from "@/graphql/actions";
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
  description = "Upload a decorative transparent PNG frame overlay and select where it applies: in Feed, Stories, or Both.",
}: FeedCampaignFormProps) {
  const [generateUploadUrl] = useGenerateFeedCampaignAssetUploadUrl();
  const [uploadImageFallback] = useUploadImage();
  const [isUploadingFrame, setIsUploadingFrame] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Campaign title is required"),
    slug: Yup.string()
      .trim()
      .matches(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and dashes")
      .required("Slug is required"),
    description: Yup.string().nullable().notRequired(),
    status: Yup.string().oneOf(["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"]).default("ACTIVE"),
    frameUrl: Yup.string().trim().required("Transparent PNG frame is required"),
    placements: Yup.array().of(Yup.string()).min(1, "Select at least one placement").default(["FEED"]),
    aspectRatio: Yup.string().default("1:1"),
    festiveImageUrl: Yup.string().nullable().notRequired(),
    ctaButtonText: Yup.string().max(50, "CTA label must be 50 characters or less").nullable().notRequired(),
    ctaBgColor: Yup.string()
      .nullable()
      .notRequired()
      .test("is-hex", "Must be a valid hex color code (e.g. #4F46E5)", (val) => !val || /^#([0-9a-fA-F]{3}){1,2}$/.test(val)),
    ctaTextColor: Yup.string()
      .nullable()
      .notRequired()
      .test("is-hex", "Must be a valid hex color code (e.g. #FFFFFF)", (val) => !val || /^#([0-9a-fA-F]{3}){1,2}$/.test(val)),
    isFilterActive: Yup.boolean().default(true),
    allowCameraRecording: Yup.boolean().default(true),
    allowFileUpload: Yup.boolean().default(true),
    startDate: Yup.string().nullable().notRequired(),
    endDate: Yup.string().nullable().notRequired(),
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
      placements:
        initialValues?.placements && initialValues.placements.length > 0
          ? initialValues.placements
          : ["FEED"],
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
    onSubmit: async (values, helpers) => {
      try {
        const rawMeta = values.frameMetadata as { width?: unknown; height?: unknown } | null | undefined;
        const cleanFrameMetadata =
          rawMeta && (typeof rawMeta.width === "number" || typeof rawMeta.height === "number")
            ? {
                width: typeof rawMeta.width === "number" ? Math.round(rawMeta.width) : undefined,
                height: typeof rawMeta.height === "number" ? Math.round(rawMeta.height) : undefined,
              }
            : null;

        await onSubmit({
          ...values,
          frameMetadata: cleanFrameMetadata,
        });
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to submit campaign.");
      } finally {
        helpers.setSubmitting(false);
      }
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    formik.setFieldValue("slug", sanitized);
  };

  const isSubmittingActive = formik.isSubmitting || isLoading || isUploadingFrame || isUploadingBanner;

  const handlePublish = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isUploadingFrame || isUploadingBanner) {
      toast.info("Please wait for the image upload to complete.");
      return;
    }

    const errors = await formik.validateForm();
    if (errors && Object.keys(errors).length > 0) {
      // Mark touched so error borders display
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );

      const firstKey = Object.keys(errors)[0];
      const firstError = errors[firstKey as keyof typeof errors];
      const errorMsg =
        typeof firstError === "string"
          ? firstError
          : `Please fill in required fields (${firstKey}).`;

      toast.error(errorMsg);

      // Auto-scroll to the first invalid field
      const el =
        document.getElementById(firstKey) ||
        document.querySelector(`[name="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement).focus?.();
      }
      return;
    }

    await formik.submitForm();
  };

  // Safe dimension reader that never hangs
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      // Fast path: createImageBitmap if supported
      if (typeof window !== "undefined" && "createImageBitmap" in window) {
        createImageBitmap(file)
          .then((bmp) => {
            const dims = { width: bmp.width || 1080, height: bmp.height || 1080 };
            bmp.close();
            resolve(dims);
          })
          .catch(() => {
            fallbackLoad();
          });
        return;
      }
      fallbackLoad();

      function fallbackLoad() {
        if (typeof window === "undefined") {
          resolve({ width: 1080, height: 1080 });
          return;
        }
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        let settled = false;

        const cleanup = () => {
          if (!settled) {
            settled = true;
            try {
              URL.revokeObjectURL(objectUrl);
            } catch {
              // ignore
            }
          }
        };

        const timer = setTimeout(() => {
          cleanup();
          resolve({ width: 1080, height: 1080 });
        }, 2500);

        img.onload = () => {
          clearTimeout(timer);
          const width = img.naturalWidth || 1080;
          const height = img.naturalHeight || 1080;
          cleanup();
          resolve({ width, height });
        };

        img.onerror = () => {
          clearTimeout(timer);
          cleanup();
          resolve({ width: 1080, height: 1080 });
        };

        img.src = objectUrl;
      }
    });
  };

  // Upload asset directly to S3 via presigned PUT
  const uploadAssetToS3 = (url: string, file: File): Promise<void> => {
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

      xhr.onerror = () => reject(new Error("Network error during asset upload."));
      xhr.send(file);
    });
  };

  // Custom upload handler for Transparent PNG Frame
  const handleFrameCustomUpload = async (file: File): Promise<string> => {
    setIsUploadingFrame(true);

    try {
      // 1. Calculate natural image dimensions safely without blocking
      try {
        const dims = await getImageDimensions(file);
        formik.setFieldValue("frameMetadata", dims);
      } catch (dimErr) {
        console.warn("Failed to extract image dimensions:", dimErr);
        formik.setFieldValue("frameMetadata", { width: 1080, height: 1080 });
      }

      // 2. Request presigned upload URL from backend, with direct uploadImage fallback
      let directUrl: string | null = null;
      try {
        const { data } = await generateUploadUrl({
          variables: {
            input: {
              fileName: file.name || "feed-campaign-frame.png",
              fileType: file.type || "image/png",
              fileSize: file.size,
              type: "FRAME",
            },
          },
        });

        if (data?.generateFeedCampaignAssetUploadUrl?.uploadUrl) {
          const { uploadUrl, fileUrl } = data.generateFeedCampaignAssetUploadUrl;
          await uploadAssetToS3(uploadUrl, file);
          directUrl = fileUrl;
        }
      } catch (presignedErr) {
        console.warn("Presigned S3 upload failed, trying standard uploadImage mutation fallback:", presignedErr);
      }

      if (directUrl) {
        toast.success("Frame uploaded to cloud storage!");
        return directUrl;
      }

      // 3. Fallback to standard uploadImage GraphQL mutation
      const uploadRes = await uploadImageFallback({
        variables: { file },
      });

      if (uploadRes?.data?.uploadImage) {
        toast.success("Frame uploaded successfully!");
        return uploadRes.data.uploadImage;
      }

      throw new Error("Failed to upload frame. Please try again.");
    } catch (err: unknown) {
      const msg = (err as Error).message || "Failed to upload frame.";
      toast.error(msg);
      throw err;
    } finally {
      setIsUploadingFrame(false);
    }
  };

  // Custom upload handler for Festive CTA Banner
  const handleBannerCustomUpload = async (file: File): Promise<string> => {
    setIsUploadingBanner(true);

    try {
      let directUrl: string | null = null;
      try {
        const { data } = await generateUploadUrl({
          variables: {
            input: {
              fileName: file.name || "feed-festive-banner.webp",
              fileType: file.type || "image/webp",
              fileSize: file.size,
              type: "BANNER",
            },
          },
        });

        if (data?.generateFeedCampaignAssetUploadUrl?.uploadUrl) {
          const { uploadUrl, fileUrl } = data.generateFeedCampaignAssetUploadUrl;
          await uploadAssetToS3(uploadUrl, file);
          directUrl = fileUrl;
        }
      } catch (presignedErr) {
        console.warn("Presigned banner upload failed, trying standard uploadImage fallback:", presignedErr);
      }

      if (directUrl) {
        toast.success("Festive banner uploaded!");
        return directUrl;
      }

      // Fallback
      const uploadRes = await uploadImageFallback({
        variables: { file },
      });

      if (uploadRes?.data?.uploadImage) {
        toast.success("Festive banner uploaded!");
        return uploadRes.data.uploadImage;
      }

      throw new Error("Failed to upload festive banner.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to upload festive banner.");
      throw err;
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const isFeedSelected =
    formik.values.placements.includes("FEED") || formik.values.placements.includes("BOTH");
  const isStoriesSelected =
    formik.values.placements.includes("STORIES") || formik.values.placements.includes("BOTH");
  const isBothSelected =
    (isFeedSelected && isStoriesSelected) || formik.values.placements.includes("BOTH");

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
          <div className="flex items-center gap-3">
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

            <Button
              type="button"
              onClick={handlePublish}
              disabled={isSubmittingActive}
              className="bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer flex items-center gap-1.5 px-4"
            >
              {(formik.isSubmitting || isLoading) ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{initialValues?.id ? "Save Changes" : "Publish Campaign"}</span>
            </Button>
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
                    placeholder="e.g. Alumni Homecoming 2026"
                    value={formik.values.title}
                    onChange={handleTitleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs",
                      formik.touched.title &&
                        formik.errors.title &&
                        "border-destructive focus-visible:ring-destructive"
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
                    placeholder="alumni-homecoming-2026"
                    value={formik.values.slug}
                    onChange={handleSlugChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs font-mono",
                      formik.touched.slug &&
                        formik.errors.slug &&
                        "border-destructive focus-visible:ring-destructive"
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
                  placeholder="Explain the occasion, hashtag guidelines, and instructions for members taking photos..."
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
                      Set whether campaign is active or paused
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
                      Publish festive banner and camera frame overlay to user app
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

            {/* Step 2: Placement & Surface Destination */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    2
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Placement & Destination Surfaces
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Feed & Story Channels
                </Badge>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Choose where this decorative frame applies: in the main feed post creator, 24-hour stories, or universally across both.
              </p>

              {/* Placement Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => formik.setFieldValue("placements", ["FEED"])}
                  className={cn(
                    "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 flex flex-col justify-between",
                    !isStoriesSelected && isFeedSelected
                      ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-500/20 shadow-xs"
                      : "border-border/60 hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-indigo-500" />
                      Feed Posts Only
                    </span>
                    {!isStoriesSelected && isFeedSelected && (
                      <Check className="h-3.5 w-3.5 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Standard community post creator (Square 1:1 & Portrait 4:5).
                  </p>
                </div>

                <div
                  onClick={() => formik.setFieldValue("placements", ["STORIES"])}
                  className={cn(
                    "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 flex flex-col justify-between",
                    isStoriesSelected && !isFeedSelected
                      ? "border-purple-600 bg-purple-500/5 ring-1 ring-purple-500/20 shadow-xs"
                      : "border-border/60 hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-purple-500" />
                      Stories Only
                    </span>
                    {isStoriesSelected && !isFeedSelected && (
                      <Check className="h-3.5 w-3.5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Vertical 9:16 fullscreen story camera lens and composer.
                  </p>
                </div>

                <div
                  onClick={() => formik.setFieldValue("placements", ["FEED", "STORIES", "BOTH"])}
                  className={cn(
                    "p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 flex flex-col justify-between",
                    isBothSelected
                      ? "border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-500/20 shadow-xs"
                      : "border-border/60 hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-emerald-500" />
                      Feed & Stories
                    </span>
                    {isBothSelected && (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Universal overlay available in both feed uploads and story lenses.
                  </p>
                </div>
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <Label className="text-xs font-semibold text-foreground">
                  Default Canvas Aspect Ratio
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Recommended ratio applied when members activate this frame lens.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "1:1 Square", val: "1:1", desc: "Classic feed post (1080×1080)" },
                    { label: "4:5 Portrait", val: "4:5", desc: "Mobile feed portrait (1080×1350)" },
                    { label: "9:16 Story", val: "9:16", desc: "Fullscreen vertical (1080×1920)" },
                  ].map((ratio) => (
                    <button
                      key={ratio.val}
                      type="button"
                      onClick={() => formik.setFieldValue("aspectRatio", ratio.val)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                        formik.values.aspectRatio === ratio.val
                          ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-500/20 shadow-xs"
                          : "border-border/60 hover:border-foreground/30"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{ratio.label}</span>
                        {formik.values.aspectRatio === ratio.val && (
                          <Check className="h-3 w-3 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{ratio.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule (Start & End Dates) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div className="space-y-1.5">
                  <Label htmlFor="startDate" className="text-xs font-semibold text-foreground">
                    Start Date (Optional)
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Campaign becomes active on this date.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="endDate" className="text-xs font-semibold text-foreground">
                    End Date (Optional)
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Campaign automatically unpublishes after this date.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Visual Branding & Decorative Assets */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    3
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Visual Branding & Decorative Assets
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {(isUploadingFrame || isUploadingBanner) && (
                    <Badge
                      variant="outline"
                      className="text-[10px] text-indigo-500 bg-indigo-500/10 border-indigo-500/20 flex items-center gap-1"
                    >
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
                    Camera Overlay Frame (Transparent PNG) <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {formik.values.aspectRatio} Overlay
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Upload a transparent PNG frame with decorative borders and cutouts. Member photos or videos will show through beneath the frame.
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
                  label="Feed Overlay Frame"
                  aspectRatio={
                    formik.values.aspectRatio === "4:5"
                      ? 4 / 5
                      : formik.values.aspectRatio === "9:16"
                      ? 9 / 16
                      : 1
                  }
                  recommendedWidth={1080}
                  recommendedHeight={
                    formik.values.aspectRatio === "4:5"
                      ? 1350
                      : formik.values.aspectRatio === "9:16"
                      ? 1920
                      : 1080
                  }
                  allowedFormats={["image/png", "image/x-png", "image/webp"]}
                  defaultFormat="png"
                  showFormatSelector={false}
                  allowFreeDimensions={true}
                  showAspectRatioPresets={true}
                  aspectRatioPresets={[
                    { label: "1:1 Square", value: 1 },
                    { label: "4:5 Portrait", value: 4 / 5 },
                    { label: "9:16 Story", value: 9 / 16 },
                    { label: "Free Dimensions", value: undefined },
                  ]}
                  customDescription="Upload a transparent PNG frame. Transparent center cutouts let member photos show through."
                />

                {formik.touched.frameUrl && formik.errors.frameUrl && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.frameUrl}
                  </p>
                )}
              </div>

              {/* Sub-section B: Festive / Hero Banner Image */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Festive / CTA Campaign Hero Banner
                  </Label>
                  <span className="text-[10px] text-muted-foreground">16:9 Banner</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Displayed as a prominent festive challenge card on the community feed when &quot;Filter On for Users&quot; is enabled.
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
                  customDescription="16:9 festive visual (e.g. Alumni Homecoming, contest announcement, holiday theme)."
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
                  placeholder="e.g. Use Frame, Share Post, Try Filter, Join Challenge"
                  value={formik.values.ctaButtonText || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-9 text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Text for the action button on the user app feed hero banner and post lens preview (defaults to &apos;Use Frame&apos; if left blank).
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
                  Customize the background color and text contrast for the call-to-action button in the member feed and story lens composer.
                </p>

                {/* Preset Themes Chips */}
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
                    <span>{formik.values.ctaButtonText?.trim() || "Use Frame"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: User Participation Controls */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  4
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  User Participation & Creation Rules
                </h3>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-indigo-500" /> Allow Live Camera Capture
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Users can snap new photos directly using the device camera with PNG frame overlay
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
                      <Upload className="h-3.5 w-3.5 text-indigo-500" /> Allow Device Photo Upload
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Users can pick existing photos or images from their camera roll or desktop
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.allowFileUpload}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowFileUpload", checked)
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

        {/* Floating Save Panel Bottom Dock Standard */}
        <FloatingSavePanel
          hasChanged={formik.dirty || !initialValues?.id}
          saved={false}
          isSaving={isSubmittingActive}
          onSave={handlePublish}
          onReset={formik.resetForm}
          title={initialValues?.id ? "Unsaved Campaign Changes" : "Create New Campaign"}
          saveButtonText={initialValues?.id ? "Save Campaign Changes" : "Publish Campaign"}
          discardButtonText="Discard"
        />
      </form>
    </FormikProvider>
  );
}
