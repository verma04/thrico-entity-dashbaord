"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ListOrdered,
  LayoutGrid,
  Trophy,
  Gamepad2,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  ExternalLink,
  Layers,
  Palette,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  CleanMinimalist,
  CardRankings,
  PodiumView,
  NeonArcade,
  FlashyArena,
  LeaderboardEntry,
} from "@/components/website-layout/modules/leaderboard";
import { useWebsiteBuilderStore, LayoutType } from "@/store/useWebsiteBuilderStore";
import {
  useGetWebsite,
  useUpdateModule,
  useCreateModule,
} from "@/graphql/actions/website";

type StyleVariantId =
  | "clean-minimalist"
  | "card-rankings"
  | "podium-view"
  | "neon-arcade"
  | "flashy-arena";

interface LeaderboardDesignFormValues {
  style: StyleVariantId;
  title: string;
  description: string;
  showPeriodTabs: boolean;
  showStreaks: boolean;
  showLevels: boolean;
  showHonorableMentions: boolean;
  previewDevice: "desktop" | "tablet" | "mobile";
  previewTheme: "light" | "dark";
  itemLimit: number;
}

const validationSchema = Yup.object().shape({
  style: Yup.string()
    .oneOf([
      "clean-minimalist",
      "card-rankings",
      "podium-view",
      "neon-arcade",
      "flashy-arena",
    ])
    .required("Please choose a style variant"),
  title: Yup.string()
    .max(80, "Title must be 80 characters or less")
    .required("Title is required"),
  description: Yup.string().max(250, "Description must be 250 characters or less"),
  showPeriodTabs: Yup.boolean(),
  showStreaks: Yup.boolean(),
  showLevels: Yup.boolean(),
  showHonorableMentions: Yup.boolean(),
  itemLimit: Yup.number().min(3).max(50),
});

const STYLE_OPTIONS: {
  id: StyleVariantId;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  vibe: string;
}[] = [
  {
    id: "clean-minimalist",
    title: "Clean Minimalist",
    badge: "Executive",
    icon: ListOrdered,
    description: "Distraction-free hairline rows with subtle status deltas.",
    vibe: "Ideal for enterprise, academia, and SaaS.",
  },
  {
    id: "card-rankings",
    title: "Bento Card Grid",
    badge: "Modern",
    icon: LayoutGrid,
    description: "Responsive 3-column card grid with rank watermarks.",
    vibe: "Balanced, modular, and developer-friendly.",
  },
  {
    id: "podium-view",
    title: "Olympic Podium 3D",
    badge: "Celebratory",
    icon: Trophy,
    description: "Elevated 1st/2nd/3rd pedestals with honorable mentions.",
    vibe: "High celebratory energy for monthly winners.",
  },
  {
    id: "neon-arcade",
    title: "Cyber Neon Arcade",
    badge: "High-Energy",
    icon: Gamepad2,
    description: "Dark cyberpunk neon glow, XP meters, and streak flames.",
    vibe: "Gamified, retro-modern, and competitive.",
  },
  {
    id: "flashy-arena",
    title: "Flashy VIP Arena",
    badge: "Maximum Prestige",
    icon: Sparkles,
    description: "Holographic iridescent shimmer with glassmorphic cards.",
    vibe: "Luxury, mythic leagues, and maximum WOW factor.",
  },
];

const PREVIEW_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Alex Rivera",
    score: 14850,
    change: "up",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    role: "Lead Architect",
    category: "Power Architect",
    streak: 18,
    level: 52,
    tier: "Mythic Legend",
  },
  {
    rank: 2,
    name: "Sarah Chen",
    score: 13420,
    change: "up",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    role: "Product Designer",
    category: "Elite Contributor",
    streak: 12,
    level: 47,
    tier: "Grandmaster",
  },
  {
    rank: 3,
    name: "Jordan Smith",
    score: 11900,
    change: "down",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    role: "Core Engineer",
    category: "Master Reviewer",
    streak: 9,
    level: 42,
    tier: "Immortal",
  },
  {
    rank: 4,
    name: "Elena Rodriguez",
    score: 9850,
    change: "up",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    role: "Senior Developer",
    category: "Top Mentor",
    streak: 6,
    level: 36,
    tier: "Diamond Elite",
  },
  {
    rank: 5,
    name: "David Kim",
    score: 8750,
    change: "neutral",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    role: "Tech Lead",
    category: "Innovator",
    streak: 4,
    level: 33,
    tier: "Platinum",
  },
];

export function LeaderboardDesignStudio() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { pages, updateModuleLayout, updateModuleContent } =
    useWebsiteBuilderStore();

  // Fetch website data from GraphQL backend
  const {
    data: websiteData,
    refetch: refetchWebsite,
  } = useGetWebsite({});

  const [updateModuleMutation, { loading: isUpdatingModule }] =
    useUpdateModule();
  const [createModuleMutation, { loading: isCreatingModule }] =
    useCreateModule();

  // Find existing leaderboard module in backend website pages or builder store
  const serverLeaderboardModule = useMemo(() => {
    const serverPages = websiteData?.getWebsite?.pages || [];
    for (const page of serverPages) {
      const found = page.modules?.find(
        (m: { type: string; id: string; layout?: string; name?: string; content?: Record<string, unknown> }) =>
          m.type === "leaderboard"
      );
      if (found) return { module: found, pageId: page.id };
    }
    return null;
  }, [websiteData]);

  const existingLeaderboardModule = useMemo(() => {
    for (const page of pages) {
      const found = page.modules.find((m) => m.type === "leaderboard");
      if (found) return found;
    }
    return null;
  }, [pages]);

  const targetModule =
    serverLeaderboardModule?.module || existingLeaderboardModule;

  const initialValues: LeaderboardDesignFormValues = useMemo(() => {
    let localPref: Partial<LeaderboardDesignFormValues> | null = null;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("thrico_leaderboard_design_pref");
        if (stored) localPref = JSON.parse(stored) as Partial<LeaderboardDesignFormValues>;
      } catch {
        // ignore
      }
    }

    const modContent = targetModule?.content as Record<string, unknown> | undefined;

    return {
      style:
        (targetModule?.layout as StyleVariantId) ||
        (localPref?.style as StyleVariantId) ||
        "podium-view",
      title:
        targetModule?.name ||
        (modContent?.title as string) ||
        localPref?.title ||
        "Community Leaderboard",
      description:
        (modContent?.description as string) ||
        localPref?.description ||
        "Celebrating our most dedicated contributors, top earners, and community champions.",
      showPeriodTabs:
        (modContent?.showPeriodTabs as boolean | undefined) ??
        localPref?.showPeriodTabs ??
        true,
      showStreaks:
        (modContent?.showStreaks as boolean | undefined) ??
        localPref?.showStreaks ??
        true,
      showLevels:
        (modContent?.showLevels as boolean | undefined) ??
        localPref?.showLevels ??
        true,
      showHonorableMentions:
        (modContent?.showHonorableMentions as boolean | undefined) ??
        localPref?.showHonorableMentions ??
        true,
      previewDevice: "desktop",
      previewTheme: "dark",
      itemLimit:
        (modContent?.itemLimit as number | undefined) ||
        localPref?.itemLimit ||
        5,
    };
  }, [targetModule]);

  const formik = useFormik<LeaderboardDesignFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSaving(true);
      try {
        const payloadContent = {
          title: values.title,
          description: values.description,
          showPeriodTabs: values.showPeriodTabs,
          showStreaks: values.showStreaks,
          showLevels: values.showLevels,
          showHonorableMentions: values.showHonorableMentions,
          itemLimit: values.itemLimit,
        };

        const existingId =
          serverLeaderboardModule?.module?.id || existingLeaderboardModule?.id;

        if (existingId) {
          // Update existing module on GraphQL backend
          await updateModuleMutation({
            variables: {
              moduleId: existingId,
              name: values.title,
              layout: values.style,
              content: payloadContent,
            },
          });
        } else if (
          websiteData?.getWebsite?.pages &&
          websiteData.getWebsite.pages.length > 0
        ) {
          // Create module on primary or leaderboard page in backend
          const targetPage =
            websiteData.getWebsite.pages.find(
              (p: { slug?: string; id: string }) =>
                p.slug === "home" || p.slug === "leaderboard"
            ) || websiteData.getWebsite.pages[0];

          await createModuleMutation({
            variables: {
              pageId: targetPage.id,
              name: values.title,
              type: "leaderboard",
              layout: values.style,
              content: payloadContent,
            },
          });
        }

        // Sync local builder store
        if (existingId) {
          updateModuleLayout(existingId, values.style as LayoutType);
          updateModuleContent(existingId, payloadContent);
        }

        // Persist preferences in localStorage for instant sync across website and dashboard
        localStorage.setItem(
          "thrico_leaderboard_design_pref",
          JSON.stringify({
            style: values.style,
            title: values.title,
            description: values.description,
            showPeriodTabs: values.showPeriodTabs,
            showStreaks: values.showStreaks,
            showLevels: values.showLevels,
            updatedAt: new Date().toISOString(),
          })
        );

        // Refetch website to sync cache
        await refetchWebsite().catch(() => {});

        setSavedSuccess(true);
        formik.resetForm({ values });
        toast.success(
          `Leaderboard style updated to "${
            STYLE_OPTIONS.find((s) => s.id === values.style)?.title
          }" and saved to backend!`
        );
        setTimeout(() => setSavedSuccess(false), 2500);
      } catch (err: unknown) {
        toast.error(
          (err as Error).message || "Failed to update design configuration"
        );
      } finally {
        setIsSaving(false);
      }
    },
  });

  const renderActiveVariantPreview = () => {
    const previewContent = {
      title: formik.values.title,
      description: formik.values.description,
      entries: PREVIEW_ENTRIES.slice(0, formik.values.itemLimit).map((e) => ({
        ...e,
        streak: formik.values.showStreaks ? e.streak : undefined,
        level: formik.values.showLevels ? e.level : undefined,
      })),
    };

    switch (formik.values.style) {
      case "clean-minimalist":
        return <CleanMinimalist content={previewContent} />;
      case "card-rankings":
        return <CardRankings content={previewContent} />;
      case "podium-view":
        return <PodiumView content={previewContent} />;
      case "neon-arcade":
        return <NeonArcade content={previewContent} />;
      case "flashy-arena":
        return <FlashyArena content={previewContent} />;
      default:
        return <PodiumView content={previewContent} />;
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 pb-24">
      {/* ── Studio Header Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/30">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Leaderboard Design Studio
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure layout style, titles, and live gamification visuals for website and dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/app-layout/layout")}
            className="h-8 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Website Builder
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/gamification/points-and-badges/leaderboard")}
            className="h-8 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            Live Standings
          </Button>
          <Button
            type="submit"
            disabled={isSaving || isUpdatingModule || isCreatingModule}
            className="h-8 gap-1.5 text-xs font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs cursor-pointer"
          >
            {isSaving || isUpdatingModule || isCreatingModule ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Save Design</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── 2-Column Standard Studio Layout ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Style Selection */}
          <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Choose Style Variant
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-medium">
                5 Progressive Variants
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              Select the aesthetic that fits your community culture—from minimalist executive rows to high-voltage holographic arenas.
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {STYLE_OPTIONS.map((style) => {
                const Icon = style.icon;
                const isSelected = formik.values.style === style.id;

                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => formik.setFieldValue("style", style.id)}
                    className={cn(
                      "relative flex items-start gap-3.5 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer shadow-2xs group",
                      isSelected
                        ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/20"
                        : "border-[#d2d5d9] dark:border-zinc-800 bg-card hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-muted/40"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg border transition-colors shrink-0 mt-0.5",
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-muted/70 text-muted-foreground border-border group-hover:text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isSelected
                              ? "text-indigo-950 dark:text-indigo-100"
                              : "text-foreground"
                          )}
                        >
                          {style.title}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 h-4 uppercase font-semibold"
                        >
                          {style.badge}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {style.description}
                      </p>
                      <span className="text-[10px] text-primary/80 font-medium block mt-1">
                        {style.vibe}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {formik.touched.style && formik.errors.style && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.style}
              </p>
            )}
          </div>

          {/* Section 2: Content & Copy */}
          <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                Headers & Typography
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold text-foreground mb-1 block"
                >
                  Leaderboard Heading
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Community Leaderboard"
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

              <div>
                <Label
                  htmlFor="description"
                  className="text-xs font-semibold text-foreground mb-1 block"
                >
                  Subheading Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Supporting tagline celebrating member impact..."
                  className={cn(
                    "text-xs resize-none",
                    formik.touched.description &&
                      formik.errors.description &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Gamification Elements */}
          <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                Display & Gamification Elements
              </h3>
            </div>

            <div className="space-y-2 pt-1">
              {/* Streaks Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <Flame className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      Show Streak Badges
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Display daily participation flame multipliers (e.g. 🔥 14d streak).
                    </span>
                  </div>
                </div>
                <Switch
                  checked={formik.values.showStreaks}
                  onCheckedChange={(val) =>
                    formik.setFieldValue("showStreaks", val)
                  }
                />
              </div>

              {/* Levels & XP Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      Show Level Progression & Tiers
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Render user levels (Lvl 42) and Mythic/Challenger league tags.
                    </span>
                  </div>
                </div>
                <Switch
                  checked={formik.values.showLevels}
                  onCheckedChange={(val) =>
                    formik.setFieldValue("showLevels", val)
                  }
                />
              </div>

              {/* Honorable Mentions Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <Layers className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      Include Honorable Mentions (Ranks 4+)
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Render runners-up roster directly below the top 3 pedestal.
                    </span>
                  </div>
                </div>
                <Switch
                  checked={formik.values.showHonorableMentions}
                  onCheckedChange={(val) =>
                    formik.setFieldValue("showHonorableMentions", val)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Interactive Preview (5 cols on lg) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-2xs overflow-hidden">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/60 bg-muted/40">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Live Preview
                </span>
              </div>

              {/* Viewport Toggles */}
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("previewDevice", "desktop")}
                  className={cn(
                    "p-1 rounded cursor-pointer transition-colors",
                    formik.values.previewDevice === "desktop"
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Desktop View"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("previewDevice", "tablet")}
                  className={cn(
                    "p-1 rounded cursor-pointer transition-colors",
                    formik.values.previewDevice === "tablet"
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Tablet View"
                >
                  <Tablet className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("previewDevice", "mobile")}
                  className={cn(
                    "p-1 rounded cursor-pointer transition-colors",
                    formik.values.previewDevice === "mobile"
                      ? "bg-card text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Mobile View"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="p-3 sm:p-4 bg-muted/10 overflow-x-auto min-h-[440px] flex items-center justify-center">
              <div
                className={cn(
                  "w-full transition-all duration-300",
                  formik.values.previewDevice === "mobile"
                    ? "max-w-[340px]"
                    : formik.values.previewDevice === "tablet"
                    ? "max-w-[560px]"
                    : "w-full"
                )}
              >
                {renderActiveVariantPreview()}
              </div>
            </div>

            {/* Preview Footer Info */}
            <div className="px-3.5 py-2 border-t border-border/60 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-mono">
                Active Style: <strong>{formik.values.style}</strong>
              </span>
              <span>Live Interactive Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Save Dock ────────────────────────────────────────────── */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={savedSuccess}
        isSaving={isSaving || isUpdatingModule || isCreatingModule}
        onSave={() => formik.handleSubmit()}
        onReset={() => formik.resetForm()}
        title="Unsaved Leaderboard Design"
        description="Changes will update website and community dashboard."
        saveButtonText="Apply Design"
      />
    </form>
  );
}
export default LeaderboardDesignStudio;
