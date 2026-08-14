"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateImpactTemplate,
  useGetImpactTemplates,
} from "@/graphql/actions/impact";
import { GET_IMPACT_TEMPLATES } from "@/graphql/quries/impact";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
  PolarisPresetChips,
} from "@/components/gamification/shared/polaris-form-ui";
import {
  Gauge,
  Sparkles,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Flame,
  Scale,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters."),
  minScore: z.coerce.number().min(0, "Minimum score must be >= 0"),
  maxScore: z.coerce.number().min(1, "Maximum score must be > 0"),
  defaultScore: z.coerce.number().min(0, "Default score must be >= 0"),
  activityWindowDays: z.coerce.number().min(1, "Window must be at least 1 day"),
  refreshFrequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  decayEnabled: z.boolean(),
  decayPenalty: z.coerce.number().min(1, "Decay penalty must be > 0"),
});

type FormValues = z.infer<typeof formSchema>;

const MAX_SCORE_PRESETS = [500, 1000, 2500, 5000, 10000];
const WINDOW_PRESETS = [7, 14, 30, 60, 90];
const DECAY_PRESETS = [5, 10, 20, 50];

const TEMPLATE_ARCHETYPES = [
  {
    id: "balanced",
    title: "Balanced Community",
    badge: "Recommended",
    desc: "Standard 0-1,000 scale with weekly recalibration and moderate decay.",
    icon: Scale,
    values: {
      name: "Standard Community Template",
      minScore: 0,
      maxScore: 1000,
      defaultScore: 100,
      activityWindowDays: 30,
      refreshFrequency: "WEEKLY" as const,
      decayEnabled: true,
      decayPenalty: 10,
    },
  },
  {
    id: "velocity",
    title: "High-Velocity Commerce",
    badge: "E-Commerce",
    desc: "Fast-paced daily cycle for active buyers and daily brand interactions.",
    icon: Flame,
    values: {
      name: "High-Velocity Commerce Template",
      minScore: 0,
      maxScore: 5000,
      defaultScore: 250,
      activityWindowDays: 14,
      refreshFrequency: "DAILY" as const,
      decayEnabled: true,
      decayPenalty: 25,
    },
  },
  {
    id: "retention",
    title: "Long-Term Retention",
    badge: "Loyalty",
    desc: "Gentle monthly cycle with generous grace period for periodic shoppers.",
    icon: Compass,
    values: {
      name: "Long-Term Retention Template",
      minScore: 0,
      maxScore: 500,
      defaultScore: 50,
      activityWindowDays: 60,
      refreshFrequency: "MONTHLY" as const,
      decayEnabled: true,
      decayPenalty: 5,
    },
  },
];

const REFRESH_OPTIONS = [
  {
    value: "DAILY",
    title: "Daily Recalculation",
    desc: "Evaluates member activity and decay every 24 hours. Best for daily active communities.",
    icon: Clock,
  },
  {
    value: "WEEKLY",
    title: "Weekly Recalculation",
    desc: "Evaluates scores on a rolling 7-day cycle. Optimal for balanced community engagement.",
    icon: Calendar,
  },
  {
    value: "MONTHLY",
    title: "Monthly Recalculation",
    desc: "Evaluates scores once every 30 days. Best for milestone-based or subscription models.",
    icon: ShieldCheck,
  },
];

export function TemplateForm() {
  const { data: templatesData, loading: fetchingTemplate, refetch } = useGetImpactTemplates();
  const [createTemplate, { loading: saving }] = useCreateImpactTemplate({
    refetchQueries: [{ query: GET_IMPACT_TEMPLATES }],
  });

  const [simulatedScore, setSimulatedScore] = useState<number>(500);
  const [simulatedInactiveCycles, setSimulatedInactiveCycles] = useState<number>(3);

  const defaultFormValues: FormValues = {
    name: "Default Community Template",
    minScore: 0,
    maxScore: 1000,
    defaultScore: 100,
    activityWindowDays: 30,
    refreshFrequency: "WEEKLY",
    decayEnabled: true,
    decayPenalty: 10,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // Watch form fields for live sidebar & previews
  const watchedValues = form.watch();
  const {
    name,
    minScore,
    maxScore,
    defaultScore,
    activityWindowDays,
    refreshFrequency,
    decayEnabled,
    decayPenalty,
  } = watchedValues;

  // Hydrate initial values if template exists
  useEffect(() => {
    if (templatesData?.impactTemplates && templatesData.impactTemplates.length > 0) {
      const existing = templatesData.impactTemplates[0];
      form.reset({
        name: existing.name || "Default Community Template",
        minScore: Number(existing.minScore ?? 0),
        maxScore: Number(existing.maxScore ?? 1000),
        defaultScore: Number(existing.defaultScore ?? 100),
        activityWindowDays: Number(existing.activityWindowDays ?? 30),
        refreshFrequency: (existing.refreshFrequency as any) || "WEEKLY",
        decayEnabled: Boolean(existing.decayEnabled ?? true),
        decayPenalty: Number(existing.decayPenalty ?? 10),
      });
      setSimulatedScore(Math.round(Number(existing.maxScore ?? 1000) * 0.5));
    }
  }, [templatesData, form]);

  const existingTemplate = templatesData?.impactTemplates?.[0];

  const handleApplyArchetype = (archetypeValues: typeof TEMPLATE_ARCHETYPES[0]["values"]) => {
    form.setValue("name", archetypeValues.name, { shouldDirty: true, shouldValidate: true });
    form.setValue("minScore", archetypeValues.minScore, { shouldDirty: true, shouldValidate: true });
    form.setValue("maxScore", archetypeValues.maxScore, { shouldDirty: true, shouldValidate: true });
    form.setValue("defaultScore", archetypeValues.defaultScore, { shouldDirty: true, shouldValidate: true });
    form.setValue("activityWindowDays", archetypeValues.activityWindowDays, { shouldDirty: true, shouldValidate: true });
    form.setValue("refreshFrequency", archetypeValues.refreshFrequency, { shouldDirty: true, shouldValidate: true });
    form.setValue("decayEnabled", archetypeValues.decayEnabled, { shouldDirty: true, shouldValidate: true });
    form.setValue("decayPenalty", archetypeValues.decayPenalty, { shouldDirty: true, shouldValidate: true });
    setSimulatedScore(Math.round(archetypeValues.maxScore * 0.5));
    toast.info(`Applied "${archetypeValues.name}" preset`);
  };

  async function onSubmit(values: FormValues) {
    try {
      await createTemplate({
        variables: {
          input: {
            name: values.name,
            minScore: Number(values.minScore),
            maxScore: Number(values.maxScore),
            defaultScore: Number(values.defaultScore),
            activityWindowDays: Number(values.activityWindowDays),
            refreshFrequency: values.refreshFrequency,
            decayEnabled: Boolean(values.decayEnabled),
            decayPenalty: Number(values.decayPenalty),
          },
        },
      });
      await refetch();
      form.reset(values);
      toast.success(
        existingTemplate
          ? "Impact Engine configuration updated successfully!"
          : "Impact Engine template initialized successfully!"
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save impact template.");
    }
  }

  // Simulation calculations
  const simulationResults = useMemo(() => {
    const start = Number(simulatedScore) || 0;
    const penalty = decayEnabled ? Number(decayPenalty) || 0 : 0;
    const cycles = Number(simulatedInactiveCycles) || 0;
    const totalDecay = penalty * cycles;
    const minLimit = Number(minScore) || 0;
    const maxLimit = Number(maxScore) || 1000;
    const finalScore = Math.max(minLimit, Math.min(maxLimit, start - totalDecay));
    const cyclesUntilMin = penalty > 0 ? Math.ceil((start - minLimit) / penalty) : Infinity;

    return {
      start,
      totalDecay,
      finalScore,
      cyclesUntilMin,
    };
  }, [simulatedScore, simulatedInactiveCycles, decayEnabled, decayPenalty, minScore, maxScore]);

  // Relative percentage for range visualizer
  const defaultScorePercentage = useMemo(() => {
    const min = Number(minScore) || 0;
    const max = Number(maxScore) || 1000;
    const def = Number(defaultScore) || 0;
    if (max <= min) return 0;
    return Math.min(100, Math.max(0, ((def - min) / (max - min)) * 100));
  }, [minScore, maxScore, defaultScore]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Impact Engine Configuration"
            badgeText="Scoring Ruleset"
            description="Manage your impact scoring boundaries, evaluation cycles, and inactivity decay penalties."
            icon={Gauge}
            breadcrumbs={[
              { label: "Gamification", href: "/gamification" },
              { label: "Impact Score", href: "/gamification/impact-score" },
              { label: "Settings" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Simulator Card */}
              <PolarisSidebarCard
                title="Decay Simulator"
                badge="Interactive"
                icon={Sparkles}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Simulated Member Score
                      </Label>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {simulatedScore} pts
                      </span>
                    </div>
                    <Slider
                      value={[simulatedScore]}
                      onValueChange={(val) => setSimulatedScore(val[0])}
                      min={Number(minScore) || 0}
                      max={Number(maxScore) || 1000}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Missed Inactive Cycles
                      </Label>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {simulatedInactiveCycles} {refreshFrequency.toLowerCase()} cycle{simulatedInactiveCycles === 1 ? "" : "s"}
                      </span>
                    </div>
                    <Slider
                      value={[simulatedInactiveCycles]}
                      onValueChange={(val) => setSimulatedInactiveCycles(val[0])}
                      min={1}
                      max={12}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Projected Result Box */}
                  <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                        Projected Score
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-zinc-400 line-through">
                          {simulationResults.start}
                        </span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {simulationResults.finalScore} pts
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Decay Deduction
                      </span>
                      <span className={cn(
                        "font-semibold",
                        decayEnabled && simulationResults.totalDecay > 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-zinc-500"
                      )}>
                        {decayEnabled ? `-${simulationResults.totalDecay} pts` : "0 pts (Disabled)"}
                      </span>
                    </div>

                    {decayEnabled && (
                      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                        Member reaches baseline minimum in ~{simulationResults.cyclesUntilMin === Infinity ? "0" : simulationResults.cyclesUntilMin} missed cycles.
                      </div>
                    )}
                  </div>
                </div>
              </PolarisSidebarCard>

              {/* Live Configuration Summary */}
              <PolarisSidebarCard
                title="Ruleset Summary"
                icon={Sliders}
              >
                <div className="space-y-2">
                  <PolarisSummaryRow
                    label="Score Boundary"
                    value={`${minScore} - ${maxScore} pts`}
                  />
                  <PolarisSummaryRow
                    label="Starting Score"
                    value={`${defaultScore} pts`}
                  />
                  <PolarisSummaryRow
                    label="Cycle Cadence"
                    value={
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {refreshFrequency}
                      </span>
                    }
                  />
                  <PolarisSummaryRow
                    label="Grace Window"
                    value={`${activityWindowDays} Days`}
                  />
                  <PolarisSummaryRow
                    label="Decay Protection"
                    value={
                      decayEnabled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> -{decayPenalty} pts/cycle
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-medium">Inactive</span>
                      )
                    }
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Economic Tip Card */}
              <PolarisTipCard title="Impact Engine Insight">
                Inactivity score decay maintains healthy community leaderboards by ensuring top ranks represent currently engaged members rather than inactive legacy accounts.
              </PolarisTipCard>
            </div>
          }
        >
          {/* Quick Preset Archetypes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Quick Preset Archetypes
              </Label>
              <span className="text-[11px] text-zinc-400">Click to autofill values</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TEMPLATE_ARCHETYPES.map((archetype) => {
                const Icon = archetype.icon;
                return (
                  <button
                    key={archetype.id}
                    type="button"
                    onClick={() => handleApplyArchetype(archetype.values)}
                    className="flex flex-col text-left p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-bold border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5"
                      >
                        {archetype.badge}
                      </Badge>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {archetype.title}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                      {archetype.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Score Boundaries & Baseline */}
              <PolarisFormCard
                step={1}
                title="Score Boundaries & Baseline"
                description="Define the numeric boundaries and initial score granted to community members."
                badge="Core Range"
              >
                {/* Template Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Template Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Standard Community Ruleset"
                          {...field}
                          className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-zinc-500">
                        An administrative name identifying this impact scoring model.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Score Range Min / Max */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minScore"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Minimum Score Baseline
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] text-zinc-500">
                          Lowest score a member can reach through decay (typically 0).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxScore"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Maximum Score Ceiling
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px] text-zinc-500">
                          Cap for top-tier community influencers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Max Score Presets */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    Quick Max Score Presets
                  </Label>
                  <PolarisPresetChips
                    presets={MAX_SCORE_PRESETS}
                    currentValue={Number(maxScore)}
                    onSelect={(val) =>
                      form.setValue("maxScore", val, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    prefix=""
                  />
                </div>

                {/* Default Starting Score */}
                <FormField
                  control={form.control}
                  name="defaultScore"
                  render={({ field }) => (
                    <FormItem className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Default Starting Score for New Members
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-zinc-500">
                        Initial starting score assigned immediately upon registration or onboarding.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visual Range Indicator Bar */}
                <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <span>Baseline: {minScore} pts</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                      Starting: {defaultScore} pts ({Math.round(defaultScorePercentage)}%)
                    </span>
                    <span>Ceiling: {maxScore} pts</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-zinc-600 to-zinc-900 dark:from-zinc-400 dark:to-zinc-100 rounded-full transition-all duration-300"
                      style={{ width: `${defaultScorePercentage}%` }}
                    />
                  </div>
                </div>
              </PolarisFormCard>

              {/* Step 2: Activity Cycle & Recalculation Cadence */}
              <PolarisFormCard
                step={2}
                title="Activity Cycle & Recalculation Cadence"
                description="Determine how often impact scores are re-evaluated and the inactivity grace window."
                badge="Scheduling"
              >
                {/* Refresh Frequency Cards */}
                <FormField
                  control={form.control}
                  name="refreshFrequency"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Recalculation Frequency
                      </FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {REFRESH_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = field.value === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={cn(
                                "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer",
                                isSelected
                                  ? "border-zinc-900 bg-zinc-900/[0.03] dark:bg-zinc-100/10 ring-2 ring-zinc-900/15 dark:ring-zinc-100/20 shadow-xs"
                                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                              )}
                            >
                              <div className="flex items-center justify-between w-full mb-2">
                                <div
                                  className={cn(
                                    "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                                    isSelected
                                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                  )}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                                )}
                              </div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                {opt.title}
                              </span>
                              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                                {opt.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activity Window Days */}
                <FormField
                  control={form.control}
                  name="activityWindowDays"
                  render={({ field }) => (
                    <FormItem className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Inactivity Grace Period (Days)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-zinc-500">
                        Number of consecutive days without eligible actions before score decay starts applying.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Activity Window Presets */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    Quick Grace Period Presets
                  </Label>
                  <PolarisPresetChips
                    presets={WINDOW_PRESETS}
                    currentValue={Number(activityWindowDays)}
                    onSelect={(val) =>
                      form.setValue("activityWindowDays", val, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    prefix=""
                  />
                </div>

                <PolarisInfoBanner
                  title="Rolling Evaluation Window"
                  description="When a member performs any qualifying action within their grace period, their decay clock automatically resets to zero."
                />
              </PolarisFormCard>

              {/* Step 3: Inactivity Decay Mechanics */}
              <PolarisFormCard
                step={3}
                title="Inactivity Decay Mechanics"
                description="Configure automated deductions for members who remain inactive past their grace period."
                badge="Retention Engine"
              >
                {/* Decay Switch */}
                <FormField
                  control={form.control}
                  name="decayEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/40">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                          <FormLabel className="text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer">
                            Enable Automated Score Decay
                          </FormLabel>
                        </div>
                        <FormDescription className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Automatically deduct penalty points every {refreshFrequency.toLowerCase()} cycle when inactive.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Decay Penalty Amount */}
                <FormField
                  control={form.control}
                  name="decayPenalty"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Decay Penalty Deduction (Points per Cycle)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={!decayEnabled}
                          className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-50"
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-zinc-500">
                        Points subtracted each {refreshFrequency.toLowerCase()} interval once past the {activityWindowDays}-day inactivity window.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Decay Penalty Presets */}
                {decayEnabled && (
                  <div className="space-y-2">
                    <Label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      Quick Deduction Presets
                    </Label>
                    <PolarisPresetChips
                      presets={DECAY_PRESETS}
                      currentValue={Number(decayPenalty)}
                      onSelect={(val) =>
                        form.setValue("decayPenalty", val, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      prefix="-"
                    />
                  </div>
                )}
              </PolarisFormCard>

              {/* Floating Save Panel */}
              <FloatingSavePanel
                hasChanged={form.formState.isDirty}
                saved={false}
                isSaving={saving}
                onSave={form.handleSubmit(onSubmit)}
                onReset={() => {
                  if (existingTemplate) {
                    form.reset({
                      name: existingTemplate.name || "Default Community Template",
                      minScore: Number(existingTemplate.minScore ?? 0),
                      maxScore: Number(existingTemplate.maxScore ?? 1000),
                      defaultScore: Number(existingTemplate.defaultScore ?? 100),
                      activityWindowDays: Number(existingTemplate.activityWindowDays ?? 30),
                      refreshFrequency: (existingTemplate.refreshFrequency as any) || "WEEKLY",
                      decayEnabled: Boolean(existingTemplate.decayEnabled ?? true),
                      decayPenalty: Number(existingTemplate.decayPenalty ?? 10),
                    });
                  } else {
                    form.reset(defaultFormValues);
                  }
                  toast.info("Form reset to saved settings.");
                }}
                title={existingTemplate ? "Unsaved Template Changes" : "Unsaved Engine Settings"}
                description="You have modified the impact engine configuration."
                buttonText={existingTemplate ? "Update Configuration" : "Save Configuration"}
              />
            </form>
          </Form>
        </PolarisFormLayout>
      </div>
    </div>
  );
}
