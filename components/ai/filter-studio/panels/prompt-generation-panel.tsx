"use client";

import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sparkles,
  Upload,
  Crown,
  Eye,
  Glasses,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useFilterStudioStore,
  GenerateFilterInput,
} from "@/store/useFilterStudioStore";
import {
  FilterCategory,
  TargetPlatform,
  AnimationPreset,
} from "../types/ar-manifest";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromptFormValues {
  prompt: string;
  category: FilterCategory;
  style: string;
  colorPalette: string;
  animationPreference: AnimationPreset;
  platforms: TargetPlatform[];
  referenceAssetUrl?: string;
}

const promptValidationSchema = Yup.object().shape({
  prompt: Yup.string()
    .trim()
    .min(5, "Prompt must be at least 5 characters")
    .required("Please describe the AR effect or mask you wish to generate"),
  category: Yup.string()
    .oneOf(["face-mask", "face-overlay", "accessory"])
    .required("Category is required"),
  style: Yup.string().required("Style selection is required"),
  colorPalette: Yup.string().required("Color palette is required"),
  animationPreference: Yup.string().required("Animation preference is required"),
  platforms: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one supported target platform"),
});

const CATEGORIES: {
  value: FilterCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    value: "face-mask",
    label: "Face Mask / Tiara",
    icon: Crown,
    description: "Multi-point facial mask or festive headpiece",
  },
  {
    value: "face-overlay",
    label: "Face Overlay / Decal",
    icon: Eye,
    description: "Cheek stickers, eye liner, or skin art",
  },
  {
    value: "accessory",
    label: "Accessory / Visor",
    icon: Glasses,
    description: "HUD visors, 3D glasses, floating horns",
  },
];

const STYLES = [
  { label: "Festive Gold", color: "#F59E0B" },
  { label: "Cyberpunk Neon", color: "#06B6D4" },
  { label: "Glamour Shimmer", color: "#EC4899" },
  { label: "Floral Organic", color: "#10B981" },
  { label: "Holographic", color: "#8B5CF6" },
  { label: "Minimalist Line", color: "#E4E4E7" },
];

const PALETTE_SWATCHES = [
  "#F59E0B",
  "#06B6D4",
  "#EC4899",
  "#8B5CF6",
  "#10B981",
  "#EF4444",
  "#F43F5E",
  "#3B82F6",
];

const ANIMATION_OPTIONS: { value: AnimationPreset; label: string }[] = [
  { value: "shimmer", label: "Glow Shimmer" },
  { value: "floating", label: "Floating Bob" },
  { value: "pulse", label: "Harmonic Pulse" },
  { value: "particle_drift", label: "Stardust Drift" },
  { value: "orbit", label: "Orbital Rotation" },
  { value: "none", label: "Static" },
];

const PLATFORMS: { value: TargetPlatform; label: string }[] = [
  { value: "web", label: "Web SDK" },
  { value: "ios", label: "iOS (Swift/RN)" },
  { value: "android", label: "Android (Kotlin/RN)" },
];

export function PromptGenerationPanel() {
  const { isGenerating, startGenerationJob } = useFilterStudioStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik<PromptFormValues>({
    enableReinitialize: true,
    initialValues: {
      prompt:
        "Create an ornate festive royal face mask with golden filigree arches, glowing stardust particles, and translucent ruby gemstones.",
      category: "face-mask",
      style: "Festive Gold",
      colorPalette: "#F59E0B",
      animationPreference: "shimmer",
      platforms: ["web", "ios", "android"],
      referenceAssetUrl: "",
    },
    validationSchema: promptValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const input: GenerateFilterInput = {
          prompt: values.prompt,
          category: values.category,
          style: values.style,
          colorPalette: values.colorPalette,
          animationPreference: values.animationPreference,
          platforms: values.platforms,
          referenceAssetUrl: values.referenceAssetUrl,
        };
        toast.info("Queuing AI AR generation job...");
        await startGenerationJob(input);
        toast.success("AR Filter concepts generated successfully!");
      } catch (err: unknown) {
        toast.error((err as Error).message || "Generation failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Reference image must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        formik.setFieldValue(
          "referenceAssetUrl",
          uploadEvent.target?.result as string
        );
        toast.success("Reference image attached");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 text-xs select-none"
    >
      {/* Step 1: Prompt & Description */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              1
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">
              Describe AI Filter
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-indigo-500/30 text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
          >
            35 Tokens
          </Badge>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="prompt"
            className="text-xs font-semibold text-foreground flex justify-between"
          >
            <span>Creative Prompt</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              {formik.values.prompt.length}/280 chars
            </span>
          </Label>
          <Textarea
            id="prompt"
            name="prompt"
            rows={3}
            value={formik.values.prompt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. Golden futuristic face crown with sparkling crystal embers and floating particles..."
            className={cn(
              "text-xs resize-none bg-background",
              formik.touched.prompt && formik.errors.prompt && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {formik.touched.prompt && formik.errors.prompt && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {formik.errors.prompt}
            </p>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] text-muted-foreground">Inspiration:</span>
          {[
            "Festive Gold Crown",
            "Neon HUD Visor",
            "Glitter Butterfly",
            "Tribal Face Paint",
          ].map((promptChip) => (
            <button
              type="button"
              key={promptChip}
              onClick={() => formik.setFieldValue("prompt", `Create an elegant ${promptChip} with glowing accents and transparent background.`)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              + {promptChip}
            </button>
          ))}
        </div>

        {/* Reference Image Upload Slot */}
        <div className="pt-2 border-t border-border/50">
          <Label className="text-xs font-semibold text-foreground block mb-1.5">
            Reference Design / Texture (Optional)
          </Label>
          {formik.values.referenceAssetUrl ? (
            <div className="flex items-center justify-between p-2 rounded-lg border border-border/70 bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded overflow-hidden bg-black/20 flex items-center justify-center border border-border">
                  <img
                    src={formik.values.referenceAssetUrl}
                    alt="Reference"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Reference attached
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Will guide color & geometry
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => formik.setFieldValue("referenceAssetUrl", "")}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-border/80 hover:border-indigo-500/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="text-[11px]">Upload PNG / JPG inspiration</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Step 2: Category & Format */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            2
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-foreground">
            Category & Style
          </span>
        </div>

        {/* Category Interactive Tiles */}
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = formik.values.category === cat.value;
            return (
              <button
                type="button"
                key={cat.value}
                onClick={() => formik.setFieldValue("category", cat.value)}
                className={cn(
                  "p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-600"
                    : "border-border/60 bg-card hover:bg-muted/30 text-muted-foreground"
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon className="h-4 w-4" />
                  {isSelected && <Check className="h-3 w-3 text-indigo-600" />}
                </div>
                <div className="font-semibold text-[11px] text-foreground leading-tight">
                  {cat.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Style Selection */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-foreground">
            Visual Style Preset
          </Label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STYLES.map((styleItem) => {
              const isSelected = formik.values.style === styleItem.label;
              return (
                <button
                  type="button"
                  key={styleItem.label}
                  onClick={() => formik.setFieldValue("style", styleItem.label)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5",
                    isSelected
                      ? "border-foreground bg-foreground text-background font-semibold"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: styleItem.color }}
                  />
                  <span>{styleItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Primary Color Accent</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {formik.values.colorPalette}
            </span>
          </Label>
          <div className="flex items-center gap-2">
            {PALETTE_SWATCHES.map((swatch) => (
              <button
                type="button"
                key={swatch}
                onClick={() => formik.setFieldValue("colorPalette", swatch)}
                className={cn(
                  "h-5 w-5 rounded-full transition-all cursor-pointer relative",
                  formik.values.colorPalette === swatch &&
                    "ring-2 ring-offset-2 ring-indigo-600 scale-110"
                )}
                style={{ backgroundColor: swatch }}
              />
            ))}
            <input
              type="color"
              value={formik.values.colorPalette}
              onChange={(e) => formik.setFieldValue("colorPalette", e.target.value)}
              className="h-5 w-5 rounded cursor-pointer border-0 bg-transparent p-0 ml-1"
              title="Custom Color"
            />
          </div>
        </div>
      </div>

      {/* Step 3: Animation & Target Platforms */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            3
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-foreground">
            Motion & Platforms
          </span>
        </div>

        {/* Animation Preference */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Motion & Particle Physics
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {ANIMATION_OPTIONS.map((anim) => {
              const isSelected = formik.values.animationPreference === anim.value;
              return (
                <button
                  type="button"
                  key={anim.value}
                  onClick={() =>
                    formik.setFieldValue("animationPreference", anim.value)
                  }
                  className={cn(
                    "px-2 py-1.5 rounded-lg border text-left text-[11px] transition-all cursor-pointer",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {anim.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Targets */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-foreground">
            Target Deployment Platforms
          </Label>
          <div className="flex items-center gap-2 flex-wrap">
            {PLATFORMS.map((plat) => {
              const isChecked = formik.values.platforms.includes(plat.value);
              return (
                <label
                  key={plat.value}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] cursor-pointer transition-all",
                    isChecked
                      ? "border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  )}
                >
                  <input
                    type="checkbox"
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-3 w-3"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        formik.setFieldValue("platforms", [
                          ...formik.values.platforms,
                          plat.value,
                        ]);
                      } else {
                        formik.setFieldValue(
                          "platforms",
                          formik.values.platforms.filter((p) => p !== plat.value)
                        );
                      }
                    }}
                  />
                  <span>{plat.label}</span>
                </label>
              );
            })}
          </div>
          {formik.touched.platforms && formik.errors.platforms && (
            <p className="text-[11px] text-destructive font-medium mt-1">
              {String(formik.errors.platforms)}
            </p>
          )}
        </div>
      </div>

      {/* Primary CTA Submit Button */}
      <Button
        type="submit"
        disabled={isGenerating || formik.isSubmitting}
        className="w-full bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer gap-2 transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Generating AR Concepts...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Generate AR Filter Concepts</span>
          </>
        )}
      </Button>
    </form>
  );
}
