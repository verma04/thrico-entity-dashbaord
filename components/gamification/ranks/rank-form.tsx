"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Crown,
  Sparkles,
  Zap,
  TrendingUp,
  Smile,
  Upload,
  Check,
  Bell,
  Mail,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { getPreferredMediaUrl } from "@/utils/media";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

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

const rankSchema = Yup.object().shape({
  name: Yup.string().required("Rank name is required"),
  icon: Yup.string().required("Icon or emoji is required"),
  color: Yup.string().required("Color theme is required"),
  minPoints: Yup.number()
    .min(0, "Minimum points cannot be negative")
    .required("Min points required"),
  maxPoints: Yup.number()
    .min(Yup.ref("minPoints"), "Max points must be greater than min points")
    .required("Max points required"),
  isActive: Yup.boolean().optional(),
  allowPushNotification: Yup.boolean().optional(),
  allowEmailNotification: Yup.boolean().optional(),
  pushNotificationTitle: Yup.string().optional(),
  pushNotificationBody: Yup.string().optional(),
  emailNotificationSubject: Yup.string().optional(),
  emailNotificationBody: Yup.string().optional(),
});

interface RankFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  loading: boolean;
  isEdit?: boolean;
  nextOrder?: number;
}

export function RankForm({
  initialValues,
  onSubmit,
  loading,
  isEdit = false,
  nextOrder = 1,
}: RankFormProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [iconMode, setIconMode] = useState<"emoji" | "upload">("emoji");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  useEffect(() => {
    if (initialValues?.icon) {
      const isCustomImage =
        initialValues.icon.startsWith("http") ||
        initialValues.icon.startsWith("data:") ||
        initialValues.icon.includes("/");
      setIconMode(isCustomImage ? "upload" : "emoji");
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: initialValues
      ? {
          name: initialValues.name || "",
          icon: initialValues.icon || "⭐",
          color: initialValues.color || "#EAB308",
          minPoints: initialValues.minPoints ?? 0,
          maxPoints: initialValues.maxPoints ?? 1000,
          order: initialValues.order ?? nextOrder,
          isActive: initialValues.isActive ?? true,
          allowPushNotification:
            initialValues.allowPushNotification !== undefined
              ? initialValues.allowPushNotification
              : true,
          allowEmailNotification:
            initialValues.allowEmailNotification !== undefined
              ? initialValues.allowEmailNotification
              : true,
          pushNotificationTitle:
            initialValues.pushNotificationTitle ?? "",
          pushNotificationBody:
            initialValues.pushNotificationBody ?? "",
          emailNotificationSubject:
            initialValues.emailNotificationSubject ?? "",
          emailNotificationBody:
            initialValues.emailNotificationBody ?? "",
        }
      : {
          name: "",
          icon: "⭐",
          color: "#EAB308",
          minPoints: 0,
          maxPoints: 1000,
          order: nextOrder,
          isActive: true,
          allowPushNotification: true,
          allowEmailNotification: true,
          pushNotificationTitle: "",
          pushNotificationBody: "",
          emailNotificationSubject: "",
          emailNotificationBody: "",
        },
    validationSchema: rankSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        setSaved(true);
        toast.success(
          isEdit
            ? "Rank updated successfully!"
            : "Rank created successfully!",
        );
        setTimeout(() => {
          router.push("/gamification/points-and-badges/ranks");
        }, 1200);
      } catch (error: any) {
        const errorMsg =
          error?.graphQLErrors?.[0]?.message ||
          error?.networkError?.result?.errors?.[0]?.message ||
          error?.message ||
          "Failed to save rank configuration.";
        toast.error("Save Failed", {
          description: errorMsg,
        });
      }
    },
  });

  const isImage = useMemo(() => {
    return (
      formik.values.icon?.startsWith("http") ||
      formik.values.icon?.startsWith("data:") ||
      formik.values.icon?.includes("/")
    );
  }, [formik.values.icon]);

  const currentThemeColor = formik.values.color || "#EAB308";

  return (
    <PolarisFormLayout
      sidebar={
        <>
          {/* Live Customer Simulator Card */}
          <PolarisSidebarCard title="Rank Tier Preview" badge="Member View">
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="relative group">
                <div
                  className="absolute -inset-4 rounded-full blur-2xl transition-colors opacity-40"
                  style={{ backgroundColor: currentThemeColor }}
                />
                <div
                  className="relative h-24 w-24 rounded-3xl shadow-2xl border flex items-center justify-center text-5xl transition-transform group-hover:scale-105 overflow-hidden bg-white dark:bg-zinc-800"
                  style={{
                    borderColor: `${currentThemeColor}40`,
                    boxShadow: `0 8px 24px -4px ${currentThemeColor}30`,
                  }}
                >
                  {isImage ? (
                    <img
                      src={getPreferredMediaUrl(formik.values.icon)}
                      alt="Icon"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    formik.values.icon || "⭐"
                  )}
                </div>
                <div
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg text-white"
                  style={{ backgroundColor: currentThemeColor }}
                >
                  <Crown className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                    {formik.values.name || "Untitled Tier"}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{
                    borderColor: `${currentThemeColor}50`,
                    color: currentThemeColor,
                    backgroundColor: `${currentThemeColor}10`,
                  }}
                >
                  Tier #{formik.values.order || 1}
                </Badge>
              </div>

              <div className="w-full space-y-2.5 pt-2">
                <PolarisSummaryRow
                  label="Point Range"
                  value={`${Number(formik.values.minPoints).toLocaleString()} – ${Number(formik.values.maxPoints).toLocaleString()} PTS`}
                />
                <PolarisSummaryRow
                  label="Span Range"
                  value={`${(Number(formik.values.maxPoints) - Number(formik.values.minPoints)).toLocaleString()} PTS`}
                />
                <PolarisSummaryRow
                  label="Push Alert"
                  value={
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        formik.values.allowPushNotification
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400 dark:text-zinc-500",
                      )}
                    >
                      {formik.values.allowPushNotification ? "Enabled" : "Disabled"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Email Alert"
                  value={
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        formik.values.allowEmailNotification
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400 dark:text-zinc-500",
                      )}
                    >
                      {formik.values.allowEmailNotification ? "Enabled" : "Disabled"}
                    </span>
                  }
                  isLast
                />
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
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
          </PolarisSidebarCard>

          <PolarisTipCard title="Rank Balancing Tip">
            Keep tier thresholds contiguous so members naturally advance to the next rank tier without point gaps.
          </PolarisTipCard>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Card 1: Identity & Visuals */}
        <PolarisFormCard
          step={1}
          title="Rank Identity & Visual Theme"
          description="Define the title, theme color palette, and visual insignia for this tier."
          badge="Hierarchy Level"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Rank Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Bronze Explorer, Silver Champion, Diamond Master"
                {...formik.getFieldProps("name")}
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold shadow-none"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.name as string}
                </p>
              )}
            </div>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Theme Color & Tier Aura
                </Label>
                <span className="text-[11px] font-mono text-zinc-400">
                  {formik.values.color}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    formik.values.color?.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => formik.setFieldValue("color", preset.hex)}
                      className={cn(
                        "group relative flex items-center gap-1.5 p-2 rounded-lg border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 shadow-xs ring-2 ring-zinc-900/10 dark:ring-zinc-100/20"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-300",
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full shrink-0 border border-black/10 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

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
                  className="h-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                />
              </div>
            </div>

            {/* Icon / Emoji Selection */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Rank Badge Icon
              </Label>

              <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium max-w-xs">
                <button
                  type="button"
                  onClick={() => setIconMode("emoji")}
                  className={cn(
                    "flex-1 py-1 rounded-md transition-all font-semibold",
                    iconMode === "emoji"
                      ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Emoji Library
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode("upload")}
                  className={cn(
                    "flex-1 py-1 rounded-md transition-all font-semibold",
                    iconMode === "upload"
                      ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Custom Icon
                </button>
              </div>

              {iconMode === "emoji" ? (
                <div className="space-y-2.5 pt-1">
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
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100",
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl max-h-[140px] overflow-y-auto">
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
                                : "hover:bg-white dark:hover:bg-zinc-800 hover:scale-105",
                            )}
                          >
                            <span>{emoji}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
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
              )}
            </div>
          </div>
        </PolarisFormCard>

        {/* Card 2: Point Progression Boundaries */}
        <PolarisFormCard
          step={2}
          title="Point Progression Boundaries"
          description="Set the minimum and maximum point thresholds that qualify a member for this tier."
          badge="Threshold Gate"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="minPoints" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Minimum Points <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="minPoints"
                  type="number"
                  min={0}
                  {...formik.getFieldProps("minPoints")}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-bold"
                />
                {formik.touched.minPoints && formik.errors.minPoints && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.minPoints as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxPoints" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Maximum Points <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="maxPoints"
                  type="number"
                  min={0}
                  {...formik.getFieldProps("maxPoints")}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-bold"
                />
                {formik.touched.maxPoints && formik.errors.maxPoints && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.maxPoints as string}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Quick Span Adjuster (from min points)
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
            <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                <span>Start: {Number(formik.values.minPoints).toLocaleString()} pts</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                  Span: {(Number(formik.values.maxPoints) - Number(formik.values.minPoints)).toLocaleString()} pts
                </span>
                <span>Cap: {Number(formik.values.maxPoints).toLocaleString()} pts</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
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
        </PolarisFormCard>

        {/* Card 3: Notification Settings */}
        <PolarisFormCard
          step={3}
          title="Notification Settings"
          description="Configure alert channels and celebratory messaging when members unlock this rank tier."
          badge="Promotion Alerts"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Push Notification */}
            <div
              className={cn(
                "rounded-xl border transition-all p-4 space-y-4",
                formik.values.allowPushNotification
                  ? "border-zinc-900/40 dark:border-zinc-100/40 bg-zinc-50/50 dark:bg-zinc-800/40"
                  : "border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/10 opacity-75",
              )}
            >
              <div
                onClick={() =>
                  formik.setFieldValue(
                    "allowPushNotification",
                    !formik.values.allowPushNotification,
                  )
                }
                className="flex items-start gap-3.5 cursor-pointer select-none"
              >
                <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id="allowPushNotification"
                    checked={formik.values.allowPushNotification}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowPushNotification", !!checked)
                    }
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                    <Label
                      htmlFor="allowPushNotification"
                      className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                    >
                      Allow push notification
                    </Label>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Send an instant push alert when user advances to this rank.
                  </p>
                </div>
              </div>

              {formik.values.allowPushNotification && (
                <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-700/80 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pushNotificationTitle"
                      className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Push Notification Title
                    </Label>
                    <Input
                      id="pushNotificationTitle"
                      placeholder="e.g. 👑 You've reached a new Rank!"
                      {...formik.getFieldProps("pushNotificationTitle")}
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pushNotificationBody"
                      className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Push Notification Message
                    </Label>
                    <Textarea
                      id="pushNotificationBody"
                      placeholder="e.g. Congratulations! You have been promoted to {{rankName}} tier."
                      {...formik.getFieldProps("pushNotificationBody")}
                      className="min-h-[70px] text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                    <span>Variables:</span>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "pushNotificationBody",
                          `${formik.values.pushNotificationBody} {{rankName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
                    >
                      {"{{rankName}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "pushNotificationBody",
                          `${formik.values.pushNotificationBody} {{userName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Notification */}
            <div
              className={cn(
                "rounded-xl border transition-all p-4 space-y-4",
                formik.values.allowEmailNotification
                  ? "border-zinc-900/40 dark:border-zinc-100/40 bg-zinc-50/50 dark:bg-zinc-800/40"
                  : "border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/10 opacity-75",
              )}
            >
              <div
                onClick={() =>
                  formik.setFieldValue(
                    "allowEmailNotification",
                    !formik.values.allowEmailNotification,
                  )
                }
                className="flex items-start gap-3.5 cursor-pointer select-none"
              >
                <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id="allowEmailNotification"
                    checked={formik.values.allowEmailNotification}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowEmailNotification", !!checked)
                    }
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                    <Label
                      htmlFor="allowEmailNotification"
                      className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                    >
                      Allow email notification
                    </Label>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Send a congratulatory email when user achieves this rank.
                  </p>
                </div>
              </div>

              {formik.values.allowEmailNotification && (
                <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-700/80 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="emailNotificationSubject"
                      className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Email Subject
                    </Label>
                    <Input
                      id="emailNotificationSubject"
                      placeholder="e.g. You've reached {{rankName}}!"
                      {...formik.getFieldProps("emailNotificationSubject")}
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="emailNotificationBody"
                      className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Email Message / Content
                    </Label>
                    <Textarea
                      id="emailNotificationBody"
                      placeholder="e.g. Great job! You have reached {{rankName}} tier on our platform."
                      {...formik.getFieldProps("emailNotificationBody")}
                      className="min-h-[70px] text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                    <span>Variables:</span>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "emailNotificationBody",
                          `${formik.values.emailNotificationBody} {{rankName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
                    >
                      {"{{rankName}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "emailNotificationBody",
                          `${formik.values.emailNotificationBody} {{userName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PolarisFormCard>

        {/* Card 4: Participation & Status */}
        <PolarisFormCard
          step={4}
          title="Tier Status & Enforcement"
          description="Control whether this rank tier is actively awarded in real-time."
          badge="Live Status"
        >
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
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
        </PolarisFormCard>
      </form>

      <FloatingSavePanel
        hasChanged={formik.dirty && !!formik.values.name}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title={isEdit ? "Unsaved Rank Changes" : "New Rank Tier"}
        description={
          isEdit
            ? "Save your modifications to update this rank tier in the progression ladder."
            : "Commission this rank tier into the live gamification progression ladder?"
        }
        buttonText={isEdit ? "Save Rank" : "Commission Rank"}
      />
    </PolarisFormLayout>
  );
}
