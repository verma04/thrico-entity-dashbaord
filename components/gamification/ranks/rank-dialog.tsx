"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { getPreferredMediaUrl } from "@/utils/media";
import { Rank } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import {
  Crown,
  Sparkles,
  Trophy,
  Upload,
  Smile,
  Zap,
  TrendingUp,
  Check,
  CheckCircle2,
  Layers,
  Loader2,
  Info,
} from "lucide-react";

interface RankDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRank: Rank | null;
  onSave: (formData: any) => void;
  isLoading?: boolean;
  nextOrder: number;
}

const COLOR_PRESETS = [
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Silver", hex: "#94A3B8" },
  { name: "Gold", hex: "#EAB308" },
  { name: "Platinum", hex: "#06B6D4" },
  { name: "Diamond", hex: "#8B5CF6" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Ruby", hex: "#F43F5E" },
  { name: "Sapphire", hex: "#3B82F6" },
  { name: "Amethyst", hex: "#A855F7" },
  { name: "Obsidian", hex: "#18181B" },
];

const EMOJI_CATEGORIES = [
  {
    name: "Trophies & Medals",
    emojis: ["🏆", "🥇", "🥈", "🥉", "🎖️", "🏅", "👑", "🎗️", "🏵️", "🎯"],
  },
  {
    name: "Gems & Badges",
    emojis: ["💎", "⭐", "🌟", "✨", "💫", "🔮", "💠", "🛡️", "⚔️", "🔱"],
  },
  {
    name: "Power & Cosmos",
    emojis: ["⚡", "🔥", "🚀", "🌌", "☄️", "🪐", "☀️", "🌙", "🌋", "💥"],
  },
  {
    name: "Beasts & Animals",
    emojis: ["🦁", "🐯", "🦅", "🐲", "🐉", "🐺", "🦊", "🦄", "🐻", "🦈"],
  },
  {
    name: "Nature & Symbols",
    emojis: ["🌊", "🍀", "🌸", "🌱", "🎲", "♟️", "🔑", "🧭", "⏳", "🎨"],
  },
];

const POINT_RANGE_PRESETS = [
  { label: "+500 pts", add: 500 },
  { label: "+1,000 pts", add: 1000 },
  { label: "+2,500 pts", add: 2500 },
  { label: "+5,000 pts", add: 5000 },
  { label: "+10,000 pts", add: 10000 },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Rank name is required"),
  icon: Yup.string().required("Icon or emoji is required"),
  color: Yup.string().required("Color theme is required"),
  minPoints: Yup.number()
    .min(0, "Minimum points cannot be negative")
    .required("Min points required"),
  maxPoints: Yup.number()
    .min(Yup.ref("minPoints"), "Max points must be greater than min points")
    .required("Max points required"),
  isActive: Yup.boolean(),
});

export function RankDialog({
  isOpen,
  onOpenChange,
  editingRank,
  onSave,
  isLoading = false,
  nextOrder,
}: RankDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("emoji");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  const formik = useFormik({
    initialValues: {
      name: editingRank?.name || "",
      icon: editingRank?.icon || "⭐",
      color: editingRank?.color || "#EAB308",
      minPoints: editingRank?.minPoints ?? 0,
      maxPoints: editingRank?.maxPoints ?? 1000,
      order: editingRank?.order || nextOrder,
      isActive: editingRank?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingRank) {
        const isCustomImage =
          editingRank.icon?.startsWith("http") ||
          editingRank.icon?.startsWith("data:") ||
          editingRank.icon?.includes("/");
        setActiveTab(isCustomImage ? "upload" : "emoji");
      } else {
        formik.resetForm();
        setActiveTab("emoji");
      }
    }
  }, [isOpen, editingRank]);

  const isImage = useMemo(() => {
    return (
      formik.values.icon?.startsWith("http") ||
      formik.values.icon?.startsWith("data:") ||
      formik.values.icon?.includes("/")
    );
  }, [formik.values.icon]);

  const currentThemeColor = formik.values.color || "#EAB308";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <SheetHeader className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center border shadow-xs transition-colors"
                  style={{
                    backgroundColor: `${currentThemeColor}15`,
                    borderColor: `${currentThemeColor}30`,
                    color: currentThemeColor,
                  }}
                >
                  <Crown className="h-4 w-4" />
                </div>
                <SheetTitle className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {editingRank ? "Edit Rank Tier" : "Create New Rank Tier"}
                </SheetTitle>
              </div>

              <Badge
                variant="outline"
                className="text-[10px] font-bold px-2 py-0.5"
                style={{
                  borderColor: `${currentThemeColor}40`,
                  color: currentThemeColor,
                  backgroundColor: `${currentThemeColor}10`,
                }}
              >
                Tier #{formik.values.order}
              </Badge>
            </div>
            <SheetDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Configure rank identity, point thresholds, and member badge aesthetics.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Rank Tier Preview Card */}
          <div
            className="relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300"
            style={{
              borderColor: `${currentThemeColor}30`,
              background: `linear-gradient(135deg, ${currentThemeColor}08 0%, rgba(255,255,255,0.02) 50%, ${currentThemeColor}12 100%)`,
            }}
          >
            {/* Glowing Accent Aura */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-60 transition-all duration-500"
              style={{ backgroundColor: currentThemeColor }}
            />

            <div className="relative flex items-center gap-4">
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border shadow-md shrink-0 overflow-hidden transition-transform duration-300 hover:scale-105"
                style={{
                  borderColor: `${currentThemeColor}40`,
                  boxShadow: `0 8px 20px -4px ${currentThemeColor}30`,
                }}
              >
                {isImage ? (
                  <img
                    src={getPreferredMediaUrl(formik.values.icon) || ""}
                    alt="Rank Icon"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl select-none">
                    {formik.values.icon || "⭐"}
                  </span>
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {formik.values.name || "Untitled Rank Tier"}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold px-1.5 py-0"
                    style={{
                      borderColor: `${currentThemeColor}50`,
                      color: currentThemeColor,
                    }}
                  >
                    Active Tier
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <Zap className="h-3.5 w-3.5" style={{ color: currentThemeColor }} />
                  <span>
                    {Number(formik.values.minPoints).toLocaleString()} –{" "}
                    {Number(formik.values.maxPoints).toLocaleString()} Points Required
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Visual Identity */}
          <div className="space-y-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                1. Rank Identity & Visuals
              </Label>
              <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
            </div>

            {/* Rank Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Rank Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Bronze Explorer, Silver Champion, Diamond Master"
                {...formik.getFieldProps("name")}
                className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.name as string}
                </p>
              )}
            </div>

            {/* Color Palette Presets */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Theme Color & Tier Aura
                </Label>
                <span className="text-[11px] font-mono text-zinc-400">
                  {formik.values.color}
                </span>
              </div>

              {/* Preset Swatches */}
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    formik.values.color?.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => formik.setFieldValue("color", preset.hex)}
                      className={cn(
                        "group relative flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 shadow-xs ring-2 ring-zinc-900/10 dark:ring-zinc-100/20"
                          : "border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 hover:border-zinc-300"
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full shrink-0 border border-black/10 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-2 pt-1">
                <Input
                  type="color"
                  value={formik.values.color}
                  onChange={(e) => formik.setFieldValue("color", e.target.value)}
                  className="w-10 h-8 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer shrink-0"
                />
                <Input
                  type="text"
                  placeholder="#Hex Code"
                  value={formik.values.color}
                  onChange={(e) => formik.setFieldValue("color", e.target.value)}
                  className="h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                />
              </div>
            </div>

            {/* Icon Picker (Tabs: Emoji vs Upload) */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Rank Badge Icon
              </Label>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 h-9 bg-zinc-200/60 dark:bg-zinc-800/60 p-0.5 rounded-lg">
                  <TabsTrigger
                    value="emoji"
                    className="text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 rounded-md gap-1.5"
                  >
                    <Smile className="h-3.5 w-3.5" />
                    Emoji Library
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 rounded-md gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Custom Upload
                  </TabsTrigger>
                </TabsList>

                {/* Emoji Tab */}
                <TabsContent value="emoji" className="space-y-2.5 pt-2 mt-0">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {EMOJI_CATEGORIES.map((cat, idx) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategoryIndex(idx)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border",
                          selectedCategoryIndex === idx
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Emoji Grid */}
                  <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-h-[140px] overflow-y-auto">
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                      {EMOJI_CATEGORIES[selectedCategoryIndex].emojis.map((emoji) => {
                        const isSelected = formik.values.icon === emoji;
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => formik.setFieldValue("icon", emoji)}
                            className={cn(
                              "h-9 w-9 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer",
                              isSelected
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 scale-110 shadow-xs ring-2 ring-zinc-900/20"
                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105"
                            )}
                          >
                            <span>{emoji}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                {/* Custom Upload Tab */}
                <TabsContent value="upload" className="pt-2 mt-0">
                  <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                    <ImageUploadWithCrop
                      currentImage={isImage ? formik.values.icon : ""}
                      onImageUpdate={(url) => formik.setFieldValue("icon", url)}
                      aspectRatio={1}
                      recommendedWidth={128}
                      recommendedHeight={128}
                      uploadButtonText="Upload Custom Rank Badge"
                    />
                    <p className="text-[11px] text-zinc-500 leading-snug">
                      Upload a 1:1 square icon (PNG, WebP, SVG). Transparent backgrounds look best.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Section 2: Progression Thresholds */}
          <div className="space-y-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                2. Point Progression Boundaries
              </Label>
              <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minPoints" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Minimum Points
                </Label>
                <Input
                  id="minPoints"
                  type="number"
                  {...formik.getFieldProps("minPoints")}
                  className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-bold"
                />
                {formik.touched.minPoints && formik.errors.minPoints && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.minPoints as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxPoints" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Maximum Points
                </Label>
                <Input
                  id="maxPoints"
                  type="number"
                  {...formik.getFieldProps("maxPoints")}
                  className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-bold"
                />
                {formik.touched.maxPoints && formik.errors.maxPoints && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.maxPoints as string}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Presets for Max Points relative to Min */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Quick Span Adjuster
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {POINT_RANGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const min = Number(formik.values.minPoints) || 0;
                      formik.setFieldValue("maxPoints", min + preset.add);
                    }}
                    className="h-7 px-2.5 rounded-lg text-[11px] font-medium border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Threshold Bar */}
            <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                <span>Start: {Number(formik.values.minPoints).toLocaleString()} pts</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                  Span: {(Number(formik.values.maxPoints) - Number(formik.values.minPoints)).toLocaleString()} pts
                </span>
                <span>Cap: {Number(formik.values.maxPoints).toLocaleString()} pts</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentThemeColor,
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="isActive" className="text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer">
                  Rank Active Status
                </Label>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                When active, community members are automatically promoted into this tier upon reaching the point threshold.
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formik.values.isActive}
              onCheckedChange={(checked) => formik.setFieldValue("isActive", checked)}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </form>

        {/* Drawer Sticky Footer */}
        <div className="p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-10 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading}
            className="h-10 px-5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-xs"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
            {editingRank ? "Update Rank Tier" : "Create Rank Tier"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
