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
import { Switch } from "@/components/ui/switch";
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
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import {
  Gauge,
  Sparkles,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
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

interface TemplateFormProps {
  showHeader?: boolean;
}

export function TemplateForm({ showHeader = false }: TemplateFormProps) {
  const { data: templatesData, refetch } = useGetImpactTemplates();
  const [createTemplate, { loading: saving }] = useCreateImpactTemplate({
    refetchQueries: [{ query: GET_IMPACT_TEMPLATES }],
  });

  const [simulatedScore, setSimulatedScore] = useState<number>(500);
  const [simulatedInactiveCycles, setSimulatedInactiveCycles] =
    useState<number>(3);

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

  const watchedValues = form.watch();
  const {
    minScore,
    maxScore,
    defaultScore,
    activityWindowDays,
    refreshFrequency,
    decayEnabled,
    decayPenalty,
  } = watchedValues;

  useEffect(() => {
    if (
      templatesData?.impactTemplates &&
      templatesData.impactTemplates.length > 0
    ) {
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

  const handleApplyArchetype = (
    archetypeValues: (typeof TEMPLATE_ARCHETYPES)[0]["values"],
  ) => {
    form.setValue("name", archetypeValues.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("minScore", archetypeValues.minScore, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("maxScore", archetypeValues.maxScore, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("defaultScore", archetypeValues.defaultScore, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("activityWindowDays", archetypeValues.activityWindowDays, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("refreshFrequency", archetypeValues.refreshFrequency, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("decayEnabled", archetypeValues.decayEnabled, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("decayPenalty", archetypeValues.decayPenalty, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
          : "Impact Engine template initialized successfully!",
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save impact template.");
    }
  }

  const simulationResults = useMemo(() => {
    const start = Number(simulatedScore) || 0;
    const penalty = decayEnabled ? Number(decayPenalty) || 0 : 0;
    const cycles = Number(simulatedInactiveCycles) || 0;
    const totalDecay = penalty * cycles;
    const minLimit = Number(minScore) || 0;
    const maxLimit = Number(maxScore) || 1000;
    const finalScore = Math.max(
      minLimit,
      Math.min(maxLimit, start - totalDecay),
    );
    const cyclesUntilMin =
      penalty > 0 ? Math.ceil((start - minLimit) / penalty) : Infinity;

    return {
      start,
      totalDecay,
      finalScore,
      cyclesUntilMin,
    };
  }, [
    simulatedScore,
    simulatedInactiveCycles,
    decayEnabled,
    decayPenalty,
    minScore,
    maxScore,
  ]);

  const defaultScorePercentage = useMemo(() => {
    const min = Number(minScore) || 0;
    const max = Number(maxScore) || 1000;
    const def = Number(defaultScore) || 0;
    if (max <= min) return 0;
    return Math.min(100, Math.max(0, ((def - min) / (max - min)) * 100));
  }, [minScore, maxScore, defaultScore]);

  return (
    <div className="w-full">
      {showHeader && (
        <div className="mb-4">
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
      )}

      <PolarisFormLayout
        sidebar={
          <>
            {/* Simulator Card */}
            <PolarisSidebarCard
              title="Decay Simulator"
              badge="Interactive"
              icon={Sparkles}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-[#303030] dark:text-zinc-300">
                      Simulated Member Score
                    </label>
                    <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 font-mono">
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
                    <label className="text-[13px] font-medium text-[#303030] dark:text-zinc-300">
                      Missed Inactive Cycles
                    </label>
                    <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 font-mono">
                      {simulatedInactiveCycles}{" "}
                      {refreshFrequency.toLowerCase()} cycle
                      {simulatedInactiveCycles === 1 ? "" : "s"}
                    </span>
                  </div>
                  <Slider
                    value={[simulatedInactiveCycles]}
                    onValueChange={(val) =>
                      setSimulatedInactiveCycles(val[0])
                    }
                    min={1}
                    max={12}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                {/* Projected Result Box */}
                <div className="p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#616161] dark:text-zinc-400">
                      Projected Score
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] text-[#8c9196] line-through font-mono">
                        {simulationResults.start}
                      </span>
                      <span className="text-[14px] font-bold text-[#303030] dark:text-zinc-100 font-mono">
                        {simulationResults.finalScore} pts
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#616161] dark:text-zinc-400">
                      Decay Deduction
                    </span>
                    <span
                      className={cn(
                        "font-semibold font-mono text-[12.5px]",
                        decayEnabled && simulationResults.totalDecay > 0
                          ? "text-[#d72c0d] dark:text-rose-400"
                          : "text-[#616161]",
                      )}
                    >
                      {decayEnabled
                        ? `-${simulationResults.totalDecay} pts`
                        : "0 pts (Disabled)"}
                    </span>
                  </div>

                  {decayEnabled && (
                    <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                      Member reaches baseline minimum in ~
                      {simulationResults.cyclesUntilMin === Infinity
                        ? "0"
                        : simulationResults.cyclesUntilMin}{" "}
                      missed cycles.
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
              <div className="space-y-1">
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
                    <span className="font-semibold text-[#303030] dark:text-zinc-100">
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
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[12px]">
                        <CheckCircle2 className="h-3 w-3" /> -{decayPenalty} pts/cycle
                      </span>
                    ) : (
                      <span className="text-[#616161] font-medium text-[12px]">Inactive</span>
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
          </>
        }
      >
        <div className="space-y-3.5">
          {/* Quick Preset Archetypes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-[#303030] dark:text-zinc-200 flex items-center gap-1.5 select-none">
                <Zap className="h-3 w-3 text-amber-500" />
                Quick Preset Archetypes
              </span>
              <span className="text-[11.5px] text-[#616161]">Click to autofill values</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {TEMPLATE_ARCHETYPES.map((archetype) => {
                const Icon = archetype.icon;
                return (
                  <button
                    key={archetype.id}
                    type="button"
                    onClick={() => handleApplyArchetype(archetype.values)}
                    className="flex flex-col text-left p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 flex items-center justify-center group-hover:bg-[#303030] group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors">
                        <Icon className="h-3 w-3" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9.5px] font-semibold border-[#d2d5d9] dark:border-zinc-700 text-[#616161] px-1.5 py-0.2 rounded-[3px]"
                      >
                        {archetype.badge}
                      </Badge>
                    </div>
                    <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                      {archetype.title}
                    </span>
                    <span className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                      {archetype.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
              {/* Step 1: Score Boundaries & Baseline */}
              <PolarisFormCard
                step={1}
                title="Score Boundaries & Baseline"
                description="Define the numeric boundaries and initial score granted to community members."
                badge="Core Range"
              >
                <div className="space-y-3.5">
                  {/* Template Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <PolarisInput
                        id="name"
                        label="Template Name"
                        required
                        placeholder="e.g. Standard Community Ruleset"
                        {...field}
                        error={fieldState.error?.message}
                        helperText="An administrative name identifying this impact scoring model."
                      />
                    )}
                  />

                  {/* Score Range Min / Max */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FormField
                      control={form.control}
                      name="minScore"
                      render={({ field, fieldState }) => (
                        <PolarisInput
                          id="minScore"
                          type="number"
                          label="Minimum Score Baseline"
                          required
                          {...field}
                          error={fieldState.error?.message}
                          helperText="Lowest score a member can reach through decay (typically 0)."
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxScore"
                      render={({ field, fieldState }) => (
                        <PolarisInput
                          id="maxScore"
                          type="number"
                          label="Maximum Score Ceiling"
                          required
                          {...field}
                          error={fieldState.error?.message}
                          helperText="Cap for top-tier community members."
                        />
                      )}
                    />
                  </div>

                  {/* Max Score Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[11.5px] font-medium text-[#616161] dark:text-zinc-400">
                      Quick Max Score Presets
                    </span>
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
                    render={({ field, fieldState }) => (
                      <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                        <PolarisInput
                          id="defaultScore"
                          type="number"
                          label="Default Starting Score for New Members"
                          required
                          {...field}
                          error={fieldState.error?.message}
                          helperText="Initial starting score assigned immediately upon registration or onboarding."
                        />
                      </div>
                    )}
                  />

                  {/* Visual Range Indicator Bar */}
                  <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11.5px] font-medium text-[#616161] dark:text-zinc-300">
                      <span>Baseline: {minScore} pts</span>
                      <span className="text-[#303030] dark:text-zinc-100 font-semibold">
                        Starting: {defaultScore} pts ({Math.round(defaultScorePercentage)}%)
                      </span>
                      <span>Ceiling: {maxScore} pts</span>
                    </div>
                    <div className="relative h-1.5 w-full bg-[#d2d5d9] dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-[#303030] dark:bg-zinc-100 rounded-full transition-all duration-300"
                        style={{ width: `${defaultScorePercentage}%` }}
                      />
                    </div>
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
                <div className="space-y-3.5">
                  {/* Refresh Frequency Cards */}
                  <FormField
                    control={form.control}
                    name="refreshFrequency"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <PolarisLabel required>
                          Recalculation Frequency
                        </PolarisLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {REFRESH_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const isSelected = field.value === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => field.onChange(opt.value)}
                                className={cn(
                                  "flex flex-col text-left p-2.5 rounded-[6px] border transition-all cursor-pointer",
                                  isSelected
                                    ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 shadow-xs ring-1 ring-[#303030] dark:ring-zinc-100"
                                    : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                                )}
                              >
                                <div className="flex items-center justify-between w-full mb-1.5">
                                  <div
                                    className={cn(
                                      "h-6 w-6 rounded-[4px] flex items-center justify-center transition-colors",
                                      isSelected
                                        ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900"
                                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-300",
                                    )}
                                  >
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  {isSelected && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
                                  )}
                                </div>
                                <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                                  {opt.title}
                                </span>
                                <span className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                                  {opt.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <FormMessage className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]" />
                      </FormItem>
                    )}
                  />

                  {/* Activity Window Days */}
                  <FormField
                    control={form.control}
                    name="activityWindowDays"
                    render={({ field, fieldState }) => (
                      <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                        <PolarisInput
                          id="activityWindowDays"
                          type="number"
                          label="Inactivity Grace Period (Days)"
                          required
                          {...field}
                          error={fieldState.error?.message}
                          helperText="Number of consecutive days without eligible actions before score decay starts applying."
                        />
                      </div>
                    )}
                  />

                  {/* Activity Window Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[11.5px] font-medium text-[#616161] dark:text-zinc-400">
                      Quick Grace Period Presets
                    </span>
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
                </div>
              </PolarisFormCard>

              {/* Step 3: Inactivity Decay Mechanics */}
              <PolarisFormCard
                step={3}
                title="Inactivity Decay Mechanics"
                description="Configure automated deductions for members who remain inactive past their grace period."
                badge="Retention Engine"
              >
                <div className="space-y-3.5">
                  {/* Decay Switch */}
                  <FormField
                    control={form.control}
                    name="decayEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 p-3.5 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
                            <FormLabel className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer">
                              Enable Automated Score Decay
                            </FormLabel>
                          </div>
                          <FormDescription className="text-[11.5px] text-[#616161] dark:text-zinc-400">
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
                    render={({ field, fieldState }) => (
                      <PolarisInput
                        id="decayPenalty"
                        type="number"
                        label="Decay Penalty Deduction (Points per Cycle)"
                        required
                        disabled={!decayEnabled}
                        {...field}
                        error={fieldState.error?.message}
                        helperText={`Points subtracted each ${refreshFrequency.toLowerCase()} interval once past the ${activityWindowDays}-day inactivity window.`}
                      />
                    )}
                  />

                  {/* Decay Penalty Presets */}
                  {decayEnabled && (
                    <div className="space-y-1.5">
                      <span className="text-[11.5px] font-medium text-[#616161] dark:text-zinc-400">
                        Quick Deduction Presets
                      </span>
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
                </div>
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
        </div>
      </PolarisFormLayout>
    </div>
  );
}
