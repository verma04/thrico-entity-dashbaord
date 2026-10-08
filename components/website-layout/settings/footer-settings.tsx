"use client";

import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Type,
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ColorPicker } from "../color-picker";
import { MenuEditor } from "./menu-editor";
import { SocialLinksEditor } from "./social-links-editor";
import {
  ModuleData,
  FooterContentConfig,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FooterSettingsProps {
  content: ModuleData["content"];
  moduleId: string;
  onContentUpdate: (updates: Partial<ModuleData["content"]>) => void;
}

// Curated Background & Text Color Presets
const BG_COLOR_PRESETS = [
  { label: "Dark Navy", bg: "#0f172a", text: "#f8fafc" },
  { label: "Charcoal", bg: "#1c1c1e", text: "#ffffff" },
  { label: "Slate", bg: "#1e293b", text: "#e2e8f0" },
  { label: "Pure Black", bg: "#000000", text: "#ffffff" },
  { label: "Deep Indigo", bg: "#1e1b4b", text: "#e0e7ff" },
  { label: "Forest", bg: "#064e3b", text: "#d1fae5" },
  { label: "Warm Sand", bg: "#f5f0e8", text: "#1c1917" },
  { label: "Pure White", bg: "#ffffff", text: "#0f172a" },
  { label: "Light Gray", bg: "#f8fafc", text: "#0f172a" },
];

// Curated CTA Button Presets for Footer Actions
const CTA_COLOR_PRESETS = [
  { label: "High Contrast", bg: "#000000", text: "#ffffff" },
  { label: "Pure White", bg: "#ffffff", text: "#000000" },
  { label: "Indigo Brand", bg: "#6366f1", text: "#ffffff" },
  { label: "Ocean Blue", bg: "#2563eb", text: "#ffffff" },
  { label: "Emerald Fresh", bg: "#10b981", text: "#ffffff" },
  { label: "Violet Vibrant", bg: "#8b5cf6", text: "#ffffff" },
  { label: "Amber Warm", bg: "#f59e0b", text: "#000000" },
  { label: "Rose Coral", bg: "#f43f5e", text: "#ffffff" },
];

const footerValidationSchema = Yup.object().shape({
  logoText: Yup.string().when("logoType", {
    is: "text",
    then: (schema) => schema.required("Brand name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const FooterSettings = ({
  moduleId,
  onContentUpdate,
}: FooterSettingsProps) => {
  const { toast } = useToast();
  const { globalFooter } = useWebsiteBuilderStore();
  const htmlFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const content: FooterContentConfig =
    globalFooter.id === moduleId ? globalFooter.content : {};
  const currentLayout = globalFooter.layout || "columns";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      logoType: content.logoType || "text",
      logoText: content.logoText || "",
      logoImage: content.logoImage || "",
      logoHeight: content.logoHeight || 32,
      logoTextColor: content.logoTextColor || "",
      description: content.description || "",
      copyrightText: content.copyrightText || "",
      backgroundColor:
        content.backgroundColor || content.containerSettings?.background || "",
      textColor:
        content.textColor || content.containerSettings?.textColor || "",
      linkHoverColor: content.linkHoverColor || "",
      borderColor: content.borderColor || "",
      borderStyle: content.borderStyle || "top",
      buttonBg: content.buttonBg || "",
      buttonTextColor: content.buttonTextColor || "",
      buttonSize: content.buttonSize || "md",
      buttonRadius: content.buttonRadius || "md",
      buttonVariant: content.buttonVariant || "solid",
      newsletterTitle:
        content.newsletterTitle ?? "Stay in the loop with our newsletter",
      newsletterDescription: content.newsletterDescription ?? "",
      newsletterPlaceholder:
        content.newsletterPlaceholder ?? "Enter your email address...",
      newsletterButtonText: content.newsletterButtonText ?? "Subscribe",
      newsletterDisclaimer:
        content.newsletterDisclaimer ?? "We respect your privacy. No spam ever.",
      showNewsletterSnippet: content.showNewsletterSnippet ?? false,
      companyName: content.companyName || "",
      address: content.address || "",
      email: content.email || "",
      phone: content.phone || "",
      registrationNumber: content.registrationNumber || "",
      showStatusIndicator: content.showStatusIndicator ?? true,
      statusText: content.statusText ?? "All systems operational",
      badgeText: content.badgeText || "",
      htmlCode: content.htmlCode || "",
      customCss: content.customCss || "",
      fileName: content.fileName || "",
      renderMode: content.renderMode || "direct",
      menuItems: content.menuItems || [],
      socialLinks: content.socialLinks || [],
    },
    validationSchema: footerValidationSchema,
    onSubmit: (values) => {
      onContentUpdate(values);
    },
  });

  // Sync Formik and live preview immediately
  const handleUpdate = <K extends keyof typeof formik.values>(
    key: K,
    value: (typeof formik.values)[K]
  ) => {
    formik.setFieldValue(key, value);
    onContentUpdate({
      ...formik.values,
      [key]: value,
    });
  };

  const handleHtmlFileRead = (file: File) => {
    if (!file) return;
    const validExtensions = [".html", ".htm", ".txt"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an .html, .htm, or .txt file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        handleUpdate("htmlCode", result);
        handleUpdate("fileName", file.name);
        toast({
          title: "HTML File Loaded",
          description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB).`,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* ─── STEP 1: BRAND & IDENTITY ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            1
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Brand & Identity
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Footer brand logo, tagline description, and copyright note
            </p>
          </div>
        </div>

        {/* Logo Format Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Logo Format
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleUpdate("logoType", "text")}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                formik.values.logoType === "text"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border/60 hover:border-border hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-md",
                  formik.values.logoType === "text"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Type className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground">
                  Text Brand
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  Styled typography
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleUpdate("logoType", "image")}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                formik.values.logoType === "image"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border/60 hover:border-border hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-md",
                  formik.values.logoType === "image"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <ImageIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground">
                  Image Logo
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  SVG or PNG graphic
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Text Logo Controls */}
        {formik.values.logoType === "text" && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label
                htmlFor="footerLogoText"
                className="text-xs font-semibold text-foreground"
              >
                Brand Name
              </Label>
              <Input
                id="footerLogoText"
                name="logoText"
                value={formik.values.logoText}
                onChange={(e) => handleUpdate("logoText", e.target.value)}
                onBlur={formik.handleBlur}
                placeholder="Enter brand name..."
                className={cn(
                  "h-9 text-xs",
                  formik.touched.logoText && formik.errors.logoText
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                )}
              />
              {formik.touched.logoText && formik.errors.logoText && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {formik.errors.logoText}
                </p>
              )}
            </div>

            <ColorPicker
              label="Brand Name Color"
              value={formik.values.logoTextColor}
              onChange={(color) => handleUpdate("logoTextColor", color)}
              compact
            />
          </div>
        )}

        {/* Image Logo Controls */}
        {formik.values.logoType === "image" && (
          <div className="space-y-3 pt-1">
            <ImageUploadWithCrop
              label="Footer Logo Graphic"
              currentImage={formik.values.logoImage}
              onImageUpdate={(imageUrl: string) =>
                handleUpdate("logoImage", imageUrl)
              }
              recommendedWidth={160}
              recommendedHeight={50}
              aspectRatio={3}
            />

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  Display Height
                </Label>
                <span className="text-[11px] font-mono font-medium text-muted-foreground">
                  {formik.values.logoHeight}px
                </span>
              </div>
              <Slider
                value={[formik.values.logoHeight]}
                min={20}
                max={56}
                step={2}
                onValueChange={(val) => handleUpdate("logoHeight", val[0])}
              />
            </div>
          </div>
        )}

        {/* Tagline / Description */}
        <div className="space-y-1.5 pt-1">
          <Label htmlFor="footerDescription" className="text-xs font-semibold text-foreground">
            Tagline / Description
          </Label>
          <Textarea
            id="footerDescription"
            name="description"
            value={formik.values.description}
            onChange={(e) => handleUpdate("description", e.target.value)}
            placeholder="Empowering teams and creators around the globe..."
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        {/* Copyright Text */}
        <div className="space-y-1.5 pt-1">
          <Label htmlFor="footerCopyright" className="text-xs font-semibold text-foreground">
            Copyright Notice
          </Label>
          <Input
            id="footerCopyright"
            name="copyrightText"
            value={formik.values.copyrightText}
            onChange={(e) => handleUpdate("copyrightText", e.target.value)}
            placeholder={`© ${new Date().getFullYear()} All rights reserved.`}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* ─── STEP 2: SURFACE & COLORS ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            2
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Surface & Colors
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Footer surface background, text contrast, and border styles
            </p>
          </div>
        </div>

        {/* Curated Color Presets */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Color Scheme Presets
          </Label>
          <div className="grid grid-cols-3 gap-1.5">
            {BG_COLOR_PRESETS.map((preset) => {
              const isSelected =
                formik.values.backgroundColor.toLowerCase() ===
                  preset.bg.toLowerCase() &&
                formik.values.textColor.toLowerCase() ===
                  preset.text.toLowerCase();
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    handleUpdate("backgroundColor", preset.bg);
                    handleUpdate("textColor", preset.text);
                  }}
                  className={cn(
                    "p-2 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden",
                    isSelected
                      ? "border-primary ring-1 ring-primary shadow-xs"
                      : "border-border/60 hover:border-border hover:scale-[1.02]"
                  )}
                  style={{ backgroundColor: preset.bg }}
                >
                  <div
                    className="text-[11px] font-semibold truncate"
                    style={{ color: preset.text }}
                  >
                    {preset.label}
                  </div>
                  {isSelected && (
                    <span
                      className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: preset.text + "33" }}
                    >
                      <Check
                        className="h-2.5 w-2.5"
                        style={{ color: preset.text }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Background and Text Color Pickers */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <ColorPicker
            label="Background Color"
            value={formik.values.backgroundColor || "#0f172a"}
            onChange={(color) => handleUpdate("backgroundColor", color)}
            compact
          />
          <ColorPicker
            label="Text Color"
            value={formik.values.textColor || "#f8fafc"}
            onChange={(color) => handleUpdate("textColor", color)}
            compact
          />
        </div>

        {/* Link Hover Accent Color */}
        <ColorPicker
          label="Link Hover Accent Color"
          value={formik.values.linkHoverColor}
          onChange={(color) => handleUpdate("linkHoverColor", color)}
          compact
        />

        {/* Border Top Style */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-foreground">
            Top Border Style
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "top", label: "Solid" },
              { id: "subtle", label: "Subtle" },
              { id: "none", label: "None" },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleUpdate("borderStyle", b.id as "none" | "top" | "subtle")}
                className={cn(
                  "p-1.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer",
                  formik.values.borderStyle === b.id
                    ? "border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary/30"
                    : "border-border/60 hover:border-border text-muted-foreground"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Border Color */}
        {formik.values.borderStyle !== "none" && (
          <ColorPicker
            label="Border Color"
            value={formik.values.borderColor}
            onChange={(color) => handleUpdate("borderColor", color)}
            compact
          />
        )}
      </div>

      {/* ─── STEP 3: ACTION BUTTONS & NEWSLETTER ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            3
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Action Buttons & Newsletter
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Configure button colors, button sizes, shapes, and subscribe box
            </p>
          </div>
        </div>

        {/* Button Customization Container */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/15 space-y-3.5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-foreground">
              Footer Action Button Style
            </span>
            <p className="text-[11px] text-muted-foreground">
              Applies to newsletter subscriptions and action triggers in the footer
            </p>
          </div>

          {/* Button Size */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Button Size
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sm", label: "Small", desc: "h-8 compact" },
                { id: "md", label: "Medium", desc: "h-10 standard" },
                { id: "lg", label: "Large", desc: "h-12 prominent" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleUpdate("buttonSize", s.id as "sm" | "md" | "lg")}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all cursor-pointer",
                    formik.values.buttonSize === s.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/60 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="text-xs font-semibold text-foreground">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Button Shape */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Button Corner Shape
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "full", label: "Pill", shape: "rounded-full" },
                { id: "md", label: "Rounded", shape: "rounded-lg" },
                { id: "none", label: "Sharp", shape: "rounded-none" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleUpdate("buttonRadius", r.id as "full" | "md" | "none")}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all cursor-pointer",
                    formik.values.buttonRadius === r.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/60 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="text-xs font-semibold text-foreground">
                    {r.label}
                  </div>
                  <div
                    className="mt-1 h-3 w-8 mx-auto border border-foreground/40 bg-muted/60"
                    style={{
                      borderRadius:
                        r.id === "full" ? "9999px" : r.id === "md" ? "4px" : "0px",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Button Variant */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Style Variant
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "solid", label: "Solid Fill", desc: "High contrast fill" },
                { id: "outline", label: "Outlined", desc: "Transparent border" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleUpdate("buttonVariant", v.id as "solid" | "outline")}
                  className={cn(
                    "p-2 rounded-lg border text-left transition-all cursor-pointer",
                    formik.values.buttonVariant === v.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/60 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="text-xs font-semibold text-foreground">
                    {v.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {v.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Color Schemes */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-foreground">
              Button Color Schemes
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {CTA_COLOR_PRESETS.map((preset) => {
                const isSelected =
                  formik.values.buttonBg?.toLowerCase() ===
                  preset.bg.toLowerCase();
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      handleUpdate("buttonBg", preset.bg);
                      handleUpdate("buttonTextColor", preset.text);
                    }}
                    className={cn(
                      "h-7 px-2 rounded-md border text-[11px] font-medium flex items-center gap-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary ring-1 ring-primary bg-primary/10 text-foreground font-semibold"
                        : "border-border/60 hover:border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Button Colors */}
          <div className="space-y-2 pt-1">
            <ColorPicker
              label="Button Background Color"
              value={formik.values.buttonBg}
              onChange={(color) => handleUpdate("buttonBg", color)}
              compact
            />
            <ColorPicker
              label="Button Text Color"
              value={formik.values.buttonTextColor}
              onChange={(color) => handleUpdate("buttonTextColor", color)}
              compact
            />
          </div>
        </div>

        {/* Newsletter Specific Fields (if active layout is newsletter or has newsletter snippet) */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <Label htmlFor="ftNewsletterBtn" className="text-xs font-semibold text-foreground">
              Button Text
            </Label>
            <Input
              id="ftNewsletterBtn"
              value={formik.values.newsletterButtonText}
              onChange={(e) => handleUpdate("newsletterButtonText", e.target.value)}
              placeholder="Subscribe"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="ftNewsletterPh" className="text-xs font-semibold text-foreground">
              Input Placeholder
            </Label>
            <Input
              id="ftNewsletterPh"
              value={formik.values.newsletterPlaceholder}
              onChange={(e) => handleUpdate("newsletterPlaceholder", e.target.value)}
              placeholder="Enter your email address..."
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* ─── STEP 4: LAYOUT-SPECIFIC CONTENT ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            4
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                {currentLayout.replace(/-/g, " ")} Options
              </h4>
              <span className="text-[9px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                Active Layout
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Specific fields for the chosen footer architecture
            </p>
          </div>
        </div>

        {/* Newsletter Layout Specific Fields */}
        {currentLayout === "newsletter" && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label htmlFor="newsletterHeadline" className="text-xs font-semibold text-foreground">
                Headline
              </Label>
              <Input
                id="newsletterHeadline"
                value={formik.values.newsletterTitle}
                onChange={(e) => handleUpdate("newsletterTitle", e.target.value)}
                placeholder="Stay in the loop with our newsletter"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newsletterSubtitle" className="text-xs font-semibold text-foreground">
                Subtitle
              </Label>
              <Textarea
                id="newsletterSubtitle"
                value={formik.values.newsletterDescription}
                onChange={(e) => handleUpdate("newsletterDescription", e.target.value)}
                placeholder="Weekly product updates, insights, and stories..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newsletterDisclaimer" className="text-xs font-semibold text-foreground">
                Trust / Privacy Disclaimer
              </Label>
              <Input
                id="newsletterDisclaimer"
                value={formik.values.newsletterDisclaimer}
                onChange={(e) => handleUpdate("newsletterDisclaimer", e.target.value)}
                placeholder="We respect your privacy. No spam ever."
                className="h-9 text-xs"
              />
            </div>
          </div>
        )}

        {/* Corporate Layout Specific Fields */}
        {currentLayout === "corporate" && (
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <Label htmlFor="corpCompany" className="text-xs font-semibold text-foreground">
                Company / Entity Name
              </Label>
              <Input
                id="corpCompany"
                value={formik.values.companyName}
                onChange={(e) => handleUpdate("companyName", e.target.value)}
                placeholder="Acme Global Inc."
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="corpAddress" className="text-xs font-semibold text-foreground">
                Office Address
              </Label>
              <Input
                id="corpAddress"
                value={formik.values.address}
                onChange={(e) => handleUpdate("address", e.target.value)}
                placeholder="100 Innovation Way, Suite 400, San Francisco, CA"
                className="h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="corpEmail" className="text-xs font-semibold text-foreground">
                  Contact Email
                </Label>
                <Input
                  id="corpEmail"
                  value={formik.values.email}
                  onChange={(e) => handleUpdate("email", e.target.value)}
                  placeholder="contact@company.com"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="corpPhone" className="text-xs font-semibold text-foreground">
                  Phone
                </Label>
                <Input
                  id="corpPhone"
                  value={formik.values.phone}
                  onChange={(e) => handleUpdate("phone", e.target.value)}
                  placeholder="+1 (800) 555-0199"
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="corpReg" className="text-xs font-semibold text-foreground">
                Registration / Compliance ID
              </Label>
              <Input
                id="corpReg"
                value={formik.values.registrationNumber}
                onChange={(e) => handleUpdate("registrationNumber", e.target.value)}
                placeholder="Reg. No. 8923-4410 • ISO 27001 Certified"
                className="h-9 text-xs"
              />
            </div>
          </div>
        )}

        {/* Columns Layout: Brand Newsletter Snippet */}
        {currentLayout === "columns" && (
          <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="colNewsletterSnippet" className="text-xs font-semibold text-foreground cursor-pointer">
                Brand Column Newsletter Box
              </Label>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Show compact subscribe box below brand info
              </p>
            </div>
            <Switch
              id="colNewsletterSnippet"
              checked={formik.values.showNewsletterSnippet}
              onCheckedChange={(checked) => handleUpdate("showNewsletterSnippet", checked)}
            />
          </div>
        )}

        {/* Minimal Layout: System Status Badge */}
        {currentLayout === "minimal" && (
          <div className="space-y-3 pt-1">
            <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="minStatusToggle" className="text-xs font-semibold text-foreground cursor-pointer">
                  System Status Badge
                </Label>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Pulsing indicator for platform status
                </p>
              </div>
              <Switch
                id="minStatusToggle"
                checked={formik.values.showStatusIndicator}
                onCheckedChange={(checked) => handleUpdate("showStatusIndicator", checked)}
              />
            </div>
            {formik.values.showStatusIndicator && (
              <div className="space-y-1">
                <Label htmlFor="minStatusText" className="text-xs font-semibold text-foreground">
                  Status Label
                </Label>
                <Input
                  id="minStatusText"
                  value={formik.values.statusText}
                  onChange={(e) => handleUpdate("statusText", e.target.value)}
                  placeholder="All systems operational"
                  className="h-9 text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Simple Layout: Top Badge Pill */}
        {currentLayout === "simple" && (
          <div className="space-y-1 pt-1">
            <Label htmlFor="simBadge" className="text-xs font-semibold text-foreground">
              Top Badge Pill (Optional)
            </Label>
            <Input
              id="simBadge"
              value={formik.values.badgeText}
              onChange={(e) => handleUpdate("badgeText", e.target.value)}
              placeholder="e.g., ✦ Official Community Hub"
              className="h-9 text-xs"
            />
          </div>
        )}

        {/* Custom HTML Layout */}
        {(currentLayout === "custom-html" || currentLayout === "html") && (
          <div className="space-y-3 pt-1">
            <input
              type="file"
              ref={htmlFileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleHtmlFileRead(file);
                  e.target.value = "";
                }
              }}
              accept=".html,.htm,.txt"
              className="hidden"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleHtmlFileRead(file);
              }}
              onClick={() => htmlFileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-background/50"
              )}
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="text-xs font-medium">
                  {formik.values.fileName ? `File: ${formik.values.fileName}` : "Upload .html file"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Click to browse or drag & drop HTML
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">Render Mode</Label>
              <RadioGroup
                value={formik.values.renderMode}
                onValueChange={(val) => handleUpdate("renderMode", val)}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="direct" id="ft-rm-direct" />
                  <Label htmlFor="ft-rm-direct" className="text-xs font-normal cursor-pointer">
                    Direct DOM
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="iframe" id="ft-rm-iframe" />
                  <Label htmlFor="ft-rm-iframe" className="text-xs font-normal cursor-pointer">
                    Isolated IFrame
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="ftHtmlCode" className="text-xs font-semibold text-foreground">
                  Raw HTML Markup
                </Label>
                {formik.values.htmlCode && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(formik.values.htmlCode || "");
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate("htmlCode", "");
                        handleUpdate("fileName", "");
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-destructive hover:opacity-80 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>
              <Textarea
                id="ftHtmlCode"
                value={formik.values.htmlCode}
                onChange={(e) => handleUpdate("htmlCode", e.target.value)}
                placeholder="<!-- Paste your raw <footer> or HTML markup here -->"
                rows={8}
                className="font-mono text-xs bg-slate-950 text-slate-100 p-2.5 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ftCustomCss" className="text-xs font-semibold text-foreground">
                Custom CSS (Optional)
              </Label>
              <Textarea
                id="ftCustomCss"
                value={formik.values.customCss}
                onChange={(e) => handleUpdate("customCss", e.target.value)}
                placeholder="/* Custom CSS styling for footer */"
                rows={2}
                className="font-mono text-xs bg-background resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── STEP 5: NAVIGATION & COLUMNS ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            5
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Navigation & Column Links
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Configure multi-column footer navigation trees
            </p>
          </div>
        </div>

        <MenuEditor
          menuItems={formik.values.menuItems}
          onChange={(items) => handleUpdate("menuItems", items)}
        />
      </div>

      {/* ─── STEP 6: SOCIAL MEDIA CHANNELS ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            6
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Social Media Links
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Connect external social profiles and channels
            </p>
          </div>
        </div>

        <SocialLinksEditor
          links={formik.values.socialLinks}
          onChange={(links) => handleUpdate("socialLinks", links)}
        />
      </div>
    </form>
  );
};
