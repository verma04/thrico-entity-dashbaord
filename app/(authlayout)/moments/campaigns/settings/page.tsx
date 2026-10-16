"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Palette,
  Smartphone,
  Layers,
  Sparkles,
  Loader2,
  Trash2,
  Camera,
  RefreshCw,
  Mic,
  Video,
  ChevronLeft,
  Search,
  Wifi,
  Flame,
  ArrowRight,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import {
  useGetMomentsCampaignsDesignSettings,
  useUpdateMomentsCampaignsDesignSettings,
  useGetMomentCampaigns,
  useGenerateCampaignAssetUploadUrl,
  MomentCampaign,
} from "@/graphql/actions/moments/campaigns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const validationSchema = Yup.object().shape({
  pageTitle: Yup.string()
    .max(100, "Title must be 100 characters or less")
    .nullable(),
  pageSubtitle: Yup.string()
    .max(250, "Subtitle must be 250 characters or less")
    .nullable(),
  pageBgColor: Yup.string()
    .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code (e.g. #09090B)")
    .nullable(),
  pageBgUrl: Yup.string().nullable(),
  defaultCtaColor: Yup.string()
    .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code (e.g. #4F46E5)")
    .nullable(),
  defaultCtaTextColor: Yup.string()
    .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code (e.g. #FFFFFF)")
    .nullable(),
});

const PRESET_BG_THEMES = [
  { name: "Default Dark", hex: "#09090B", text: "#FFFFFF" },
  { name: "Deep Indigo", hex: "#0F172A", text: "#FFFFFF" },
  { name: "Midnight Purple", hex: "#1E112A", text: "#FFFFFF" },
  { name: "Festive Crimson", hex: "#2A0E1A", text: "#FFFFFF" },
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

function CampaignsSettingsPage() {
  const router = useRouter();
  const { data: settingsData, loading: loadingSettings } = useGetMomentsCampaignsDesignSettings();
  const [updateSettings, { loading: updating }] = useUpdateMomentsCampaignsDesignSettings();
  const [generateUploadUrl] = useGenerateCampaignAssetUploadUrl();
  const [isUploadingBg, setIsUploadingBg] = useState(false);

  // Fetch actual active campaigns to populate the live preview
  const { data: campaignsData } = useGetMomentCampaigns({
    pagination: { page: 1, limit: 10 },
    status: "ACTIVE",
  });
  const activeCampaigns = campaignsData?.getMomentCampaigns?.data || [];

  // Preview state inside the 9:16 mobile phone simulator
  const [previewTab, setPreviewTab] = useState<"catalog" | "studio">("catalog");
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<MomentCampaign | null>(null);

  // Fallback demo campaign if none exist yet
  const displayCampaign: Partial<MomentCampaign> =
    selectedPreviewCampaign ||
    activeCampaigns[0] || {
      id: "demo-1",
      title: "Festive Celebration Challenge",
      description: "Record your reel with our official festival frame and share with members!",
      ctaButtonText: "Record with Filter",
      ctaBgColor: "#4F46E5",
      ctaTextColor: "#FFFFFF",
      minUserDurationSeconds: 3,
      maxUserDurationSeconds: 60,
      frameUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
    };

  const initialSettings = settingsData?.getMomentsCampaignsDesignSettings;

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
        toast.success("Campaign catalog design settings updated successfully!");
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to save design settings.");
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
      xhr.onerror = () => reject(new Error("Network error during wallpaper upload."));
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
      toast.success("9:16 Mobile Wallpaper uploaded successfully!");
      return fileUrl;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to upload wallpaper.");
      throw err;
    } finally {
      setIsUploadingBg(false);
    }
  };

  return (
    <EcosystemWrapper className="m-2">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Member Campaign Settings & 9:16 Live Preview"
        description="Configure branding, 9:16 mobile wallpaper, color palette, and preview the live member catalog & recording studio"
        icon={Palette}
        badgeText="Member Experience"
        breadcrumbs={[
          { label: "Moments", href: "/moments" },
          { label: "Campaigns", href: "/moments/campaigns" },
          { label: "Settings", href: "/moments/campaigns/settings" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/moments/campaigns")}
              className="h-9 text-xs gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to Campaigns
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8">
        {loadingSettings ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-3">Loading campaign design configuration...</p>
          </div>
        ) : (
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              {/* 2-Column Standard: 8-col Form Cards + 4-col Sticky Live 9:16 Phone Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ── Left Column: Configuration Cards (8 Cols) ─────────── */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  {/* Step 1: Catalog Header & Copy */}
                  <div className="rounded-xl border border-border/70 p-5 bg-card shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                        1
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                        Member Catalog Hero & Copy
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
                        className={cn(
                          "h-9 text-xs",
                          formik.touched.pageTitle &&
                            formik.errors.pageTitle &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formik.touched.pageTitle && formik.errors.pageTitle && (
                        <p className="text-[11px] text-destructive font-medium mt-1">
                          {formik.errors.pageTitle}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        The main headline displayed at the top of the user website /moments/campaigns catalog.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
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
                        className={cn(
                          "text-xs resize-none",
                          formik.touched.pageSubtitle &&
                            formik.errors.pageSubtitle &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formik.touched.pageSubtitle && formik.errors.pageSubtitle && (
                        <p className="text-[11px] text-destructive font-medium mt-1">
                          {formik.errors.pageSubtitle}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        Guidance text instructing community members how to participate and record moments.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: 9:16 Mobile Atmosphere & Wallpaper */}
                  <div className="rounded-xl border border-border/70 p-5 bg-card shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                        2
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                        9:16 Mobile Atmosphere & Custom Wallpaper
                      </h3>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      Set the immersive atmosphere for mobile members browsing the campaign challenges catalog.
                    </p>

                    {/* Preset themes */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">
                        Preset Color Themes
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                        {PRESET_BG_THEMES.map((theme) => {
                          const isSelected =
                            formik.values.pageBgColor?.toUpperCase() === theme.hex.toUpperCase();
                          return (
                            <button
                              key={theme.name}
                              type="button"
                              onClick={() => formik.setFieldValue("pageBgColor", theme.hex)}
                              className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer",
                                isSelected
                                  ? "border-primary ring-2 ring-primary/30 font-semibold bg-muted/40 shadow-2xs"
                                  : "border-border/60 hover:border-foreground/30 bg-card"
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

                    {/* Custom 9:16 Mobile Wallpaper */}
                    <div className="space-y-2 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-indigo-500" />
                          Custom 9:16 Mobile Graphic / Wallpaper (Optional)
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
                        Upload a 9:16 mobile portrait wallpaper (1080x1920) or celebratory pattern for the member catalog.
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
                  <div className="rounded-xl border border-border/70 p-5 bg-card shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                        3
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                        Default Button Styling & Contrast
                      </h3>
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      Applied to member challenge cards whenever an individual campaign does not have custom CTA button overrides.
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
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer",
                                isSelected
                                  ? "border-primary ring-2 ring-primary/30 font-semibold"
                                  : "border-border/60 hover:border-foreground/30 bg-card"
                              )}
                            >
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                                style={{ backgroundColor: preset.bg }}
                              />
                              <span className="text-[11px] text-foreground">{preset.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color pickers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
                          Text & Icon Color (HEX)
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
                </div>

                {/* ── Right Column: Sticky 9:16 Member Experience Simulator (4-5 Cols) ─ */}
                <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-4">
                  <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Live Member Simulator
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-indigo-500/5 text-indigo-600 border-indigo-500/20">
                        9:16 Portrait
                      </Badge>
                    </div>

                    {/* View Switcher Tabs: Catalog vs Studio */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-muted/30 rounded-lg border border-border/50 text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewTab("catalog")}
                        className={cn(
                          "py-1.5 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5",
                          previewTab === "catalog"
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Layers className="h-3 w-3" />
                        <span>Catalog View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab("studio")}
                        className={cn(
                          "py-1.5 px-2 rounded-md font-medium text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5",
                          previewTab === "studio"
                            ? "bg-background text-foreground shadow-xs font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Camera className="h-3 w-3" />
                        <span>Studio / Create</span>
                      </button>
                    </div>

                    {/* 9:16 Smartphone Chassis Simulator */}
                    <div className="pt-2 flex justify-center">
                      <div className="w-[280px] h-[520px] rounded-[38px] p-2.5 bg-zinc-950 border-[3.5px] border-zinc-700 shadow-2xl relative flex flex-col shrink-0 select-none">
                        {/* Dynamic Island / Notch */}
                        <div className="w-20 h-4 bg-black rounded-full mx-auto absolute top-3.5 left-1/2 -translate-x-1/2 z-30 shadow-xs flex items-center justify-end px-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                        </div>

                        {/* Mobile Screen Area */}
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

                          {previewTab === "catalog" ? (
                            /* ── Live Member Catalog View ──────────────────── */
                            <div className="relative z-20 flex-1 flex flex-col overflow-hidden">

                              {/* Mobile Top Bar */}
                              <div className="relative z-10 flex items-center justify-between px-3 pt-2 pb-1 text-white">
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                  <ChevronLeft className="h-4 w-4" />
                                  <span>Moments</span>
                                </div>
                                <Search className="h-3.5 w-3.5 text-white/70" />
                              </div>

                              {/* Catalog Content */}
                              <div className="relative z-10 flex-1 overflow-y-auto px-3 py-2 space-y-2.5 scrollbar-none">
                                <div>
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[8px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                      <Flame className="h-2 w-2 text-amber-400" />
                                      {activeCampaigns.length > 0 ? `${activeCampaigns.length} Active Challenges` : "Live Challenges"}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-white tracking-tight leading-tight">
                                    {formik.values.pageTitle || "Moment Challenges"}
                                  </h4>
                                  <p className="text-[9px] text-zinc-300 mt-0.5 line-clamp-2 leading-snug">
                                    {formik.values.pageSubtitle || "Record branded reels with interactive frames."}
                                  </p>
                                </div>

                                {/* Active Challenge Cards */}
                                {(activeCampaigns.length > 0 ? activeCampaigns.slice(0, 3) : [displayCampaign]).map((camp, idx) => (
                                  <div
                                    key={camp.id || idx}
                                    onClick={() => {
                                      setSelectedPreviewCampaign(camp as MomentCampaign);
                                      setPreviewTab("studio");
                                    }}
                                    className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-2.5 space-y-2 shadow-xs cursor-pointer hover:bg-white/15 transition-all"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                        <Sparkles className="h-2 w-2" />
                                        Challenge
                                      </span>
                                      <span className="text-[8px] text-white/60">
                                        {camp.minUserDurationSeconds || 3}s - {camp.maxUserDurationSeconds || 60}s
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="h-10 w-10 rounded-lg bg-indigo-500/20 border border-white/20 flex items-center justify-center shrink-0">
                                        <Camera className="h-5 w-5 text-indigo-300" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold text-white truncate">
                                          {camp.title || "Festive Celebration Frame"}
                                        </p>
                                        <p className="text-[9px] text-zinc-300">
                                          9:16 Portrait • Frame Included
                                        </p>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      style={{
                                        backgroundColor: camp.ctaBgColor || formik.values.defaultCtaColor || "#4F46E5",
                                        color: camp.ctaTextColor || formik.values.defaultCtaTextColor || "#FFFFFF",
                                      }}
                                      className="w-full py-1.5 rounded-lg text-[10px] font-bold shadow-xs flex items-center justify-center gap-1 cursor-pointer hover:opacity-95"
                                    >
                                      <Sparkles className="h-2.5 w-2.5" />
                                      <span>{camp.ctaButtonText || "Record with Filter"}</span>
                                    </button>
                                  </div>
                                ))}

                                <div className="text-center pt-1 pb-2">
                                  <p className="text-[9px] text-zinc-400">
                                    Click any card to preview the 9:16 Member Studio
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* ── Live Member Studio View (/create) ────────── */
                            <div className="relative z-20 flex-1 flex flex-col bg-zinc-900 overflow-hidden">
                              {/* Camera Viewfinder Simulation Background */}
                              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
                                <div className="text-center opacity-40">
                                  <Video className="h-12 w-12 text-white mx-auto animate-pulse" />
                                  <p className="text-[9px] text-zinc-400 mt-2 font-mono">
                                    CAMERA VIEWFINDER ACTIVE
                                  </p>
                                </div>
                              </div>

                              {/* Frame overlay simulation if campaign has frameUrl */}
                              {displayCampaign.frameUrl && (
                                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                                  <div
                                    className="w-full h-full border-4 border-indigo-400/40 rounded-lg flex items-center justify-center"
                                    style={{
                                      backgroundImage: `url(${displayCampaign.frameUrl})`,
                                      backgroundSize: "contain",
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                    }}
                                  />
                                </div>
                              )}

                              {/* Studio Top Action Bar */}
                              <div className="relative z-20 flex items-center justify-between p-3">
                                <button
                                  type="button"
                                  onClick={() => setPreviewTab("catalog")}
                                  className="h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>

                                <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 text-[9px] font-mono text-white flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                  <span>00:00 / {displayCampaign.maxUserDurationSeconds || 60}s</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <div className="h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs">
                                    <RefreshCw className="h-3 w-3" />
                                  </div>
                                  <div className="h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs">
                                    <Mic className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>

                              {/* Campaign Title Floating Pill */}
                              <div className="relative z-20 px-3 text-center">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-white border border-white/20 truncate max-w-[200px]">
                                  {displayCampaign.title}
                                </span>
                              </div>

                              <div className="flex-1" />

                              {/* Studio Bottom Controls */}
                              <div className="relative z-20 p-4 pb-3 flex flex-col items-center gap-2">
                                <p className="text-[9px] text-zinc-300 font-medium">
                                  Hold or tap to record (Min {displayCampaign.minUserDurationSeconds || 3}s)
                                </p>

                                {/* Big Record Button */}
                                <div className="h-14 w-14 rounded-full border-4 border-white flex items-center justify-center p-1 cursor-pointer">
                                  <div
                                    className="h-full w-full rounded-full transition-transform active:scale-95 shadow-md"
                                    style={{
                                      backgroundColor: displayCampaign.ctaBgColor || formik.values.defaultCtaColor || "#E11D48",
                                    }}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setPreviewTab("catalog")}
                                  className="text-[9px] text-zinc-400 hover:text-white transition-colors cursor-pointer pt-1 flex items-center gap-1"
                                >
                                  <span>Switch to Catalog View</span>
                                  <ArrowRight className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Home indicator bar */}
                          <div className="relative z-30 py-1.5 flex justify-center bg-black/40">
                            <div className="w-20 h-1 bg-white/50 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-[11px] text-muted-foreground">
                        Simulating <code className="text-indigo-500 font-mono">/moments/campaigns</code> on a 9:16 smartphone viewport.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Save Panel Bottom Dock Standard */}
              <FloatingSavePanel
                hasChanged={formik.dirty}
                saved={false}
                isSaving={updating || isUploadingBg}
                onSave={formik.handleSubmit}
                onReset={formik.resetForm}
                title="Unsaved Design Changes"
                saveButtonText="Save Design Settings"
                discardButtonText="Discard"
              />
            </form>
          </FormikProvider>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CampaignsSettingsPage, "MOMENTS", "canUpdate"),
  "moments",
);
