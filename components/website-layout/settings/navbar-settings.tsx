"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Type,
  Image as ImageIcon,
  SlidersHorizontal,
  Sparkles,
  Palette,
  Maximize2,
  Check,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ColorPicker } from "../color-picker";
import { MenuEditor } from "./menu-editor";
import {
  ModuleData,
  NavbarContentConfig,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";


interface NavbarSettingsProps {
  content: ModuleData["content"];
  moduleId: string;
  onContentUpdate: (updates: Partial<ModuleData["content"]>) => void;
}

// Curated Background Color Presets
const BG_COLOR_PRESETS = [
  { label: "Pure White", color: "#ffffff" },
  { label: "Pure Dark", color: "#0f172a" },
  { label: "Zinc Dark", color: "#18181b" },
  { label: "Slate Charcoal", color: "#1e293b" },
  { label: "Midnight Blue", color: "#0a0f1d" },
  { label: "Warm Sand", color: "#faf7f2" },
  { label: "Soft Zinc", color: "#f4f4f5" },
];

// Curated Text Color Presets
const TEXT_COLOR_PRESETS = [
  { label: "Dark Slate", color: "#0f172a" },
  { label: "Pure White", color: "#ffffff" },
  { label: "Muted Gray", color: "#64748b" },
  { label: "Silver Slate", color: "#cbd5e1" },
  { label: "Indigo Accent", color: "#6366f1" },
  { label: "Emerald Accent", color: "#10b981" },
];

// Curated CTA Button Presets
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

const navbarValidationSchema = Yup.object().shape({
  logoText: Yup.string().when("logoType", {
    is: "text",
    then: (schema) => schema.required("Logo text is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  ctaButtonText: Yup.string().when("showCtaButton", {
    is: true,
    then: (schema) => schema.required("Button label is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  secondaryButtonText: Yup.string().when("showSecondaryButton", {
    is: true,
    then: (schema) => schema.required("Button label is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const NavbarSettings = ({
  moduleId,
  onContentUpdate,
}: NavbarSettingsProps) => {
  const { globalHeader } = useWebsiteBuilderStore();

  const content: NavbarContentConfig =
    globalHeader.id === moduleId ? globalHeader.content : {};


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      logoType: content.logoType || "text",
      logoText: content.logoText || "",
      logoImage: content.logoImage || "",
      logoHeight: content.logoHeight || 32,
      logoTextColor: content.logoTextColor || "",
      isSticky: content.isSticky !== false,
      height: content.height || "default",
      maxWidth: content.maxWidth || "full",
      backgroundType: content.backgroundType || "solid",
      backgroundColor:
        content.backgroundColor || content.containerSettings?.background || "",
      scrolledBackground: content.scrolledBackground || "",
      backgroundBlur: content.backgroundBlur || "md",
      textColor:
        content.textColor || content.containerSettings?.textColor || "",
      linkHoverColor: content.linkHoverColor || "",
      borderColor: content.borderColor || "",
      borderStyle: content.borderStyle || "bottom",
      shadow: content.shadow || "none",
      showCtaButton: content.showCtaButton !== false,
      ctaButtonText: content.ctaButtonText || "Sign up",
      ctaButtonLink: content.ctaButtonLink || "/signup",
      ctaButtonBg: content.ctaButtonBg || "",
      ctaButtonTextColor: content.ctaButtonTextColor || "",
      ctaButtonSize: content.ctaButtonSize || "md",
      ctaButtonRadius: content.ctaButtonRadius || "full",
      ctaButtonVariant: content.ctaButtonVariant || "solid",
      showSecondaryButton: content.showSecondaryButton !== false,
      secondaryButtonText: content.secondaryButtonText || "Log in",
      secondaryButtonLink: content.secondaryButtonLink || "/login",
      secondaryButtonTextColor: content.secondaryButtonTextColor || "",
      menuItems: content.menuItems || [],
    },
    validationSchema: navbarValidationSchema,
    onSubmit: (values) => {
      onContentUpdate(values);
    },
  });

  // Helper to sync Formik and the real-time live preview immediately
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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* ─── STEP 1: BRAND & LOGO ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            1
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Brand & Logo
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Configure brand presentation and display format
            </p>
          </div>
        </div>

        {/* Logo Type Selector Tiles */}
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
                  SVG or PNG file
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
                htmlFor="logoText"
                className="text-xs font-semibold text-foreground"
              >
                Brand Name
              </Label>
              <Input
                id="logoText"
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
              label="Logo Graphic"
              currentImage={formik.values.logoImage}
              onImageUpdate={(imageUrl: string) =>
                handleUpdate("logoImage", imageUrl)
              }
              recommendedWidth={180}
              recommendedHeight={60}
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
      </div>

      {/* ─── STEP 2: LAYOUT & SIZING ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            2
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Layout & Sizing
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Set header height, container alignment and sticky lock
            </p>
          </div>
        </div>

        {/* Height Presets */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Navbar Height
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "compact", label: "Compact", height: "56px" },
              { id: "default", label: "Default", height: "64px" },
              { id: "tall", label: "Roomy", height: "80px" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate("height", item.id as "compact" | "default" | "tall")}
                className={cn(
                  "p-2 rounded-lg border text-center transition-all cursor-pointer",
                  formik.values.height === item.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border/60 hover:border-border hover:bg-muted/40"
                )}
              >
                <div className="text-xs font-semibold text-foreground">
                  {item.label}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {item.height}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Width Option */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Container Width
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "full", label: "Full Bleed", desc: "Edge to edge" },
              { id: "container", label: "Contained", desc: "Max width 1280px" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate("maxWidth", item.id as "full" | "container")}
                className={cn(
                  "p-2 rounded-lg border text-left transition-all cursor-pointer",
                  formik.values.maxWidth === item.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border/60 hover:border-border hover:bg-muted/40"
                )}
              >
                <div className="text-xs font-semibold text-foreground">
                  {item.label}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Switch */}
        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sticky-toggle" className="text-xs font-semibold text-foreground cursor-pointer">
              Sticky Header
            </Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Keep navbar pinned to top during scroll
            </p>
          </div>
          <Switch
            id="sticky-toggle"
            checked={formik.values.isSticky}
            onCheckedChange={(checked) => handleUpdate("isSticky", checked)}
          />
        </div>
      </div>

      {/* ─── STEP 3: BACKGROUND & SURFACE ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            3
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Background & Surface
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Adjust background mode, solid colors, and frosted glass blur
            </p>
          </div>
        </div>

        {/* Background Mode Tiles */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Background Style
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: "solid",
                label: "Solid Color",
                desc: "Opaque background",
                icon: Palette,
              },
              {
                id: "glass",
                label: "Frosted Glass",
                desc: "Modern blur effect",
                icon: Sparkles,
              },
              {
                id: "transparent",
                label: "Transparent",
                desc: "Overlay on hero",
                icon: Maximize2,
              },
              {
                id: "gradient",
                label: "Subtle Fade",
                desc: "Top gradient fade",
                icon: SlidersHorizontal,
              },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = formik.values.backgroundType === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleUpdate("backgroundType", mode.id as "solid" | "glass" | "transparent" | "gradient")}
                  className={cn(
                    "flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/60 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-md shrink-0",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground">
                      {mode.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {mode.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Presets */}
        {formik.values.backgroundType !== "transparent" && (
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-foreground">
              Color Presets
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {BG_COLOR_PRESETS.map((preset) => {
                const isSelected =
                  formik.values.backgroundColor.toLowerCase() ===
                  preset.color.toLowerCase();
                return (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => handleUpdate("backgroundColor", preset.color)}
                    className={cn(
                      "h-6 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary ring-1 ring-primary bg-primary/10 text-foreground font-semibold"
                        : "border-border/60 hover:border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    {preset.label}
                    {isSelected && <Check className="h-2.5 w-2.5 text-primary ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Background ColorPicker */}
        {formik.values.backgroundType !== "transparent" && (
          <ColorPicker
            label="Custom Background Color"
            value={formik.values.backgroundColor}
            onChange={(color) => handleUpdate("backgroundColor", color)}
            compact
          />
        )}

        {/* Glass Blur Intensity */}
        {formik.values.backgroundType === "glass" && (
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-foreground">
              Blur Intensity
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sm", label: "Subtle (4px)" },
                { id: "md", label: "Standard (12px)" },
                { id: "lg", label: "Heavy (24px)" },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleUpdate("backgroundBlur", b.id as "none" | "sm" | "md" | "lg")}
                  className={cn(
                    "p-1.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer",
                    formik.values.backgroundBlur === b.id
                      ? "border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary/30"
                      : "border-border/60 hover:border-border text-muted-foreground"
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrolled Sticky Background */}
        {formik.values.isSticky && (
          <div className="pt-2 border-t border-border/40">
            <ColorPicker
              label="Scrolled Background (On Scroll)"
              value={formik.values.scrolledBackground}
              onChange={(color) => handleUpdate("scrolledBackground", color)}
              compact
            />
          </div>
        )}
      </div>

      {/* ─── STEP 4: TYPOGRAPHY & LINKS ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            4
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Typography & Links
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Control navigation link colors, hover highlights, and border
            </p>
          </div>
        </div>

        {/* Text / Link Color Presets */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Text Color Presets
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {TEXT_COLOR_PRESETS.map((preset) => {
              const isSelected =
                formik.values.textColor.toLowerCase() ===
                preset.color.toLowerCase();
              return (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => handleUpdate("textColor", preset.color)}
                  className={cn(
                    "h-6 px-2 rounded-md border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer",
                    isSelected
                      ? "border-primary ring-1 ring-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border/60 hover:border-border bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Text Color */}
        <ColorPicker
          label="Custom Link / Text Color"
          value={formik.values.textColor}
          onChange={(color) => handleUpdate("textColor", color)}
          compact
        />

        {/* Link Hover Accent Color */}
        <ColorPicker
          label="Link Hover Highlight Color"
          value={formik.values.linkHoverColor}
          onChange={(color) => handleUpdate("linkHoverColor", color)}
          compact
        />

        {/* Border Style */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-foreground">
            Border Style
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "bottom", label: "Solid" },
              { id: "subtle", label: "Subtle" },
              { id: "none", label: "None" },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleUpdate("borderStyle", b.id as "none" | "bottom" | "subtle")}
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

        {/* Shadow Style */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-foreground">
            Shadow
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none", label: "None" },
              { id: "sm", label: "Subtle" },
              { id: "md", label: "Elevated" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleUpdate("shadow", s.id as "none" | "sm" | "md")}
                className={cn(
                  "p-1.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer",
                  formik.values.shadow === s.id
                    ? "border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary/30"
                    : "border-border/60 hover:border-border text-muted-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STEP 5: ACTION BUTTONS (CTA & AUTH) ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            5
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Action Buttons (CTA & Auth)
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Configure primary call-to-action button color, size, and shape
            </p>
          </div>
        </div>

        {/* Primary CTA Button Section */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/15 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground">
                Primary CTA Button
              </span>
              <p className="text-[11px] text-muted-foreground">
                Main action button (e.g. Sign up, Join)
              </p>
            </div>
            <Switch
              checked={formik.values.showCtaButton}
              onCheckedChange={(checked) => handleUpdate("showCtaButton", checked)}
            />
          </div>

          {formik.values.showCtaButton && (
            <div className="space-y-3 pt-1 border-t border-border/40">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="ctaButtonText" className="text-xs font-semibold text-foreground">
                    Button Label
                  </Label>
                  <Input
                    id="ctaButtonText"
                    name="ctaButtonText"
                    value={formik.values.ctaButtonText}
                    onChange={(e) => handleUpdate("ctaButtonText", e.target.value)}
                    onBlur={formik.handleBlur}
                    placeholder="Sign up"
                    className={cn(
                      "h-9 text-xs",
                      formik.touched.ctaButtonText && formik.errors.ctaButtonText
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    )}
                  />
                  {formik.touched.ctaButtonText && formik.errors.ctaButtonText && (
                    <p className="text-[11px] text-destructive font-medium mt-0.5">
                      {formik.errors.ctaButtonText}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ctaButtonLink" className="text-xs font-semibold text-foreground">
                    Target URL
                  </Label>
                  <Input
                    id="ctaButtonLink"
                    name="ctaButtonLink"
                    value={formik.values.ctaButtonLink}
                    onChange={(e) => handleUpdate("ctaButtonLink", e.target.value)}
                    placeholder="/signup"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Button Size */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Button Size
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "sm", label: "Small", desc: "h-7 compact" },
                    { id: "md", label: "Medium", desc: "h-9 standard" },
                    { id: "lg", label: "Large", desc: "h-10 prominent" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleUpdate("ctaButtonSize", s.id as "sm" | "md" | "lg")}
                      className={cn(
                        "p-2 rounded-lg border text-center transition-all cursor-pointer",
                        formik.values.ctaButtonSize === s.id
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
                      onClick={() => handleUpdate("ctaButtonRadius", r.id as "full" | "md" | "none")}
                      className={cn(
                        "p-2 rounded-lg border text-center transition-all cursor-pointer",
                        formik.values.ctaButtonRadius === r.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border/60 hover:border-border hover:bg-muted/40"
                      )}
                    >
                      <div className="text-xs font-semibold text-foreground">
                        {r.label}
                      </div>
                      <div className="mt-1 h-3 w-8 mx-auto border border-foreground/40 bg-muted/60" style={{
                        borderRadius: r.id === "full" ? "9999px" : r.id === "md" ? "4px" : "0px"
                      }} />
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
                      onClick={() => handleUpdate("ctaButtonVariant", v.id as "solid" | "outline" | "ghost")}
                      className={cn(
                        "p-2 rounded-lg border text-left transition-all cursor-pointer",
                        formik.values.ctaButtonVariant === v.id
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

              {/* CTA Color Presets */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground">
                  CTA Color Schemes
                </Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CTA_COLOR_PRESETS.map((preset) => {
                    const isSelected =
                      formik.values.ctaButtonBg?.toLowerCase() ===
                      preset.bg.toLowerCase();
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          handleUpdate("ctaButtonBg", preset.bg);
                          handleUpdate("ctaButtonTextColor", preset.text);
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

              {/* Custom CTA Colors */}
              <div className="space-y-2 pt-1">
                <ColorPicker
                  label="Button Background Color"
                  value={formik.values.ctaButtonBg}
                  onChange={(color) => handleUpdate("ctaButtonBg", color)}
                  compact
                />
                <ColorPicker
                  label="Button Text Color"
                  value={formik.values.ctaButtonTextColor}
                  onChange={(color) => handleUpdate("ctaButtonTextColor", color)}
                  compact
                />
              </div>
            </div>
          )}
        </div>

        {/* Secondary Button Section */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/15 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground">
                Secondary Button (Login)
              </span>
              <p className="text-[11px] text-muted-foreground">
                Secondary link or login trigger
              </p>
            </div>
            <Switch
              checked={formik.values.showSecondaryButton}
              onCheckedChange={(checked) => handleUpdate("showSecondaryButton", checked)}
            />
          </div>

          {formik.values.showSecondaryButton && (
            <div className="space-y-3 pt-1 border-t border-border/40">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="secondaryButtonText" className="text-xs font-semibold text-foreground">
                    Button Label
                  </Label>
                  <Input
                    id="secondaryButtonText"
                    name="secondaryButtonText"
                    value={formik.values.secondaryButtonText}
                    onChange={(e) => handleUpdate("secondaryButtonText", e.target.value)}
                    placeholder="Log in"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="secondaryButtonLink" className="text-xs font-semibold text-foreground">
                    Target URL
                  </Label>
                  <Input
                    id="secondaryButtonLink"
                    name="secondaryButtonLink"
                    value={formik.values.secondaryButtonLink}
                    onChange={(e) => handleUpdate("secondaryButtonLink", e.target.value)}
                    placeholder="/login"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <ColorPicker
                label="Secondary Text Color"
                value={formik.values.secondaryButtonTextColor}
                onChange={(color) => handleUpdate("secondaryButtonTextColor", color)}
                compact
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── STEP 6: NAVIGATION MENU ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            6
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Navigation Menu Items
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Add links, arrange order, and configure nested dropdown items
            </p>
          </div>
        </div>

        <MenuEditor
          menuItems={formik.values.menuItems}
          onChange={(items) => handleUpdate("menuItems", items)}
        />
      </div>
    </form>
  );
};
