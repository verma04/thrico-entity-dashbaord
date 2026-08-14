"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Zap,
  ChevronRight,
  Info,
  Trophy,
  Target,
  Clock,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  Calculator,
  MessageSquare,
  Users,
  Compass,
  Flame,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisOriginPicker,
  PolarisPresetChips,
  PolarisInfoBanner,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  getSourceIcon,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

const impactRuleSchema = Yup.object().shape({
  module: Yup.string().required("Please select a module or integration"),
  action: Yup.string().required("Action trigger is required"),
  category: Yup.string().required("Category is required"),
  points: Yup.number()
    .required("Point value is required")
    .min(-1000, "Min -1000")
    .max(1000, "Max 1000"),
  dailyLimit: Yup.number().nullable(),
  formula: Yup.string().nullable(),
  description: Yup.string().max(200, "Description too long"),
});

interface ImpactRuleFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  loading: boolean;
  isEdit?: boolean;
  modules?: any[];
  integrations?: any[];
  triggers?: any[];
  moduleTriggers?: any[];
  integrationTriggers?: any[];
  templates?: any[];
}

const POINT_PRESETS = [5, 10, 25, 50, 100, 250];

const CATEGORIES = [
  {
    id: "ENGAGEMENT",
    label: "Engagement",
    desc: "Discussions, likes, comments, and community chat",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: MessageSquare,
  },
  {
    id: "CONTRIBUTION",
    label: "Contribution",
    desc: "Articles, guides, solutions, and original content",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: Flame,
  },
  {
    id: "TRUST",
    label: "Trust & Safety",
    desc: "Identity verification, peer vouches, and moderation",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    icon: ShieldCheck,
  },
  {
    id: "NETWORK",
    label: "Network & Referrals",
    desc: "Invites, followers, referrals, and connections",
    dotClass: "bg-violet-500",
    badgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    icon: Users,
  },
  {
    id: "CONSISTENCY",
    label: "Consistency",
    desc: "Daily streaks, weekly attendance, and recurring visits",
    dotClass: "bg-rose-500",
    badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    icon: Compass,
  },
];

export function ImpactRuleForm({
  initialValues,
  onSubmit,
  loading,
  isEdit,
  modules = [],
  integrations = [],
  triggers = [],
  moduleTriggers = [],
  integrationTriggers = [],
  templates = [],
}: ImpactRuleFormProps) {
  const router = useRouter();

  const initialSourceType = useMemo(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) => i.id === initialValues.module || i.uuid === initialValues.module || (i as any).slug === initialValues.module
      );
      if (isIntegration) return "INTEGRATION";
    }
    return "MODULE";
  }, [initialValues, integrations]);

  const [sourceType, setSourceType] = useState<"MODULE" | "INTEGRATION">(initialSourceType);

  useEffect(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) => i.id === initialValues.module || i.uuid === initialValues.module || (i as any).slug === initialValues.module
      );
      setSourceType(isIntegration ? "INTEGRATION" : "MODULE");
    }
  }, [initialValues, integrations]);

  const formik = useFormik({
    initialValues: initialValues || {
      module: "",
      action: "",
      category: "ENGAGEMENT",
      points: 10,
      dailyLimit: 5,
      formula: "",
      description: "",
    },
    validationSchema: impactRuleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          templateId: templates?.[0]?.id,
        };
        await onSubmit(payload);
        toast.success(isEdit ? "Scoring rule updated successfully!" : "Scoring rule created successfully!");
        setTimeout(() => {
          router.push("/gamification/impact-score/rules");
        }, 1200);
      } catch (error: any) {
        toast.error(error.message || "Failed to save scoring rule.");
      }
    },
  });

  const allSources = useMemo(() => {
    const mods = modules.map((m) => ({
      id: m.id,
      uuid: m.uuid,
      name: m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : m.name,
      type: "Module",
      icon: m.icon,
    }));
    const ints = integrations.map((i) => ({
      id: i.id,
      uuid: i.uuid,
      slug: (i as any).slug,
      name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : i.name,
      type: "Integration",
      icon: i.icon,
    }));
    return { modules: mods, integrations: ints, all: [...mods, ...ints] };
  }, [modules, integrations]);

  const currentSourceList =
    sourceType === "MODULE" ? allSources.modules : allSources.integrations;

  const filteredTriggers = useMemo(() => {
    const selected = formik.values.module;
    if (!selected) return [];

    const selectedSource = allSources.all.find(
      (s) =>
        s.id?.toLowerCase() === selected.toLowerCase() ||
        (s.uuid && s.uuid.toLowerCase() === selected.toLowerCase()) ||
        ((s as any).slug && (s as any).slug.toLowerCase() === selected.toLowerCase())
    );

    const matchValues = new Set<string>();
    matchValues.add(selected.toLowerCase());
    if (selectedSource?.id) matchValues.add(selectedSource.id.toLowerCase());
    if (selectedSource?.uuid) matchValues.add(selectedSource.uuid.toLowerCase());
    if ((selectedSource as any)?.slug) matchValues.add((selectedSource as any).slug.toLowerCase());
    if (selectedSource?.name) matchValues.add(selectedSource.name.toLowerCase());

    const isMatch = (target?: string | null) => {
      if (!target) return false;
      return matchValues.has(target.toLowerCase());
    };

    const fromIntegrationTriggers = integrationTriggers.filter(
      (t) =>
        isMatch(t.integrationId) ||
        isMatch(t.moduleId) ||
        isMatch((t as any).slug) ||
        isMatch((t as any).integrationSlug)
    );

    const fromModuleTriggers = moduleTriggers.filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch((t as any).integrationId) ||
        isMatch((t as any).slug)
    );

    const fromGenericTriggers = triggers.filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch((t as any).integrationId) ||
        isMatch((t as any).slug)
    );

    const combined = [
      ...fromIntegrationTriggers,
      ...fromModuleTriggers,
      ...fromGenericTriggers,
    ];

    if (combined.length === 0 && sourceType === "INTEGRATION") {
      integrationTriggers.forEach((t) => {
        if (
          isMatch(t.integrationId) ||
          isMatch(t.moduleId) ||
          isMatch(t.name) ||
          isMatch((t as any).type)
        ) {
          combined.push(t);
        }
      });
    }

    const unique = new Map();
    combined.forEach((item) => {
      const key = item.id || item.name || item.description;
      if (key && !unique.has(key)) {
        unique.set(key, item);
      }
    });
    return Array.from(unique.values());
  }, [
    formik.values.module,
    sourceType,
    moduleTriggers,
    integrationTriggers,
    triggers,
    allSources,
  ]);

  const selectedSourceItem = allSources.all.find(
    (s) =>
      s.id?.toLowerCase() === formik.values.module?.toLowerCase() ||
      (s.uuid && s.uuid.toLowerCase() === formik.values.module?.toLowerCase()) ||
      ((s as any).slug && (s as any).slug.toLowerCase() === formik.values.module?.toLowerCase())
  );

  const selectedTriggerItem = filteredTriggers.find(
    (t) => t.id === formik.values.action || t.name === formik.values.action
  );

  const activeCategory = CATEGORIES.find((c) => c.id === formik.values.category) || CATEGORIES[0];

  const readableActionName = (
    selectedTriggerItem?.name ||
    selectedTriggerItem?.description ||
    formik.values.action ||
    "Selected action"
  ).replace(/_/g, " ");

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-6">
          {/* Live Simulator Card */}
          <PolarisSidebarCard
            title="Reputation Simulator"
            badge="Live Preview"
            icon={Sparkles}
          >
            {/* Simulated Notification Card */}
            <div className="p-4 rounded-xl bg-zinc-900 text-white dark:bg-zinc-950 border border-zinc-800 shadow-md relative overflow-hidden space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 dark:bg-zinc-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700 shadow-xs">
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-400">
                      {formik.values.points >= 0 ? `+${formik.values.points}` : formik.values.points} Impact Score
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold bg-zinc-800 text-zinc-300 border-zinc-700 px-1.5 py-0"
                    >
                      {activeCategory.label}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-zinc-100 line-clamp-2">
                    Member reputation updated for {readableActionName}.
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Source: {selectedSourceItem?.name || (sourceType === "MODULE" ? "Platform" : "Integration")}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown Rows */}
            <div className="space-y-1.5 pt-1">
              <PolarisSummaryRow
                label="Impact Category"
                value={
                  <span className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", activeCategory.dotClass)} />
                    {activeCategory.label}
                  </span>
                }
              />
              <PolarisSummaryRow
                label="Origin Channel"
                value={selectedSourceItem?.name || "Unspecified"}
              />
              <PolarisSummaryRow
                label="Target Action"
                value={readableActionName}
              />
              <PolarisSummaryRow
                label="Daily Cap"
                value={
                  formik.values.dailyLimit && Number(formik.values.dailyLimit) > 0
                    ? `${formik.values.dailyLimit} times / user`
                    : "Unlimited"
                }
              />
              {formik.values.formula && (
                <PolarisSummaryRow
                  label="Formula"
                  value={<code>{formik.values.formula}</code>}
                />
              )}
              <PolarisSummaryRow
                label="Points Awarded"
                value={
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {formik.values.points >= 0 ? `+${formik.values.points}` : formik.values.points} pts
                  </span>
                }
                isLast
              />
            </div>
          </PolarisSidebarCard>

          {/* Strategy Tip */}
          <PolarisTipCard title="Impact Scoring Guidance">
            Assign higher impact point weights to high-effort contributions (like authored articles or verified referrals) to encourage meaningful community reputation building.
          </PolarisTipCard>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Step 1: Origin & Action Definition */}
        <PolarisFormCard
          step={1}
          title="Action Origin & Trigger"
          description="Identify the community module or integration channel that triggers this impact change."
          badge="Trigger"
        >
          {/* Origin Picker */}
          <PolarisOriginPicker
            sourceType={sourceType}
            onSelect={(type) => {
              setSourceType(type);
              formik.setFieldValue("module", "");
              formik.setFieldValue("action", "");
            }}
            modulesCount={allSources.modules.length}
            integrationsCount={allSources.integrations.length}
          />

          {/* Source Select Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {sourceType === "MODULE" ? "Platform Module" : "Third-Party Integration"}
              </Label>
              <Select
                value={formik.values.module}
                onValueChange={(val) => {
                  formik.setFieldValue("module", val);
                  formik.setFieldValue("action", "");
                }}
              >
                <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                  <SelectValue
                    placeholder={
                      sourceType === "MODULE"
                        ? "Select platform module"
                        : "Select connected app"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {currentSourceList.map((item) => (
                    <SelectItem key={item.id || item.uuid} value={item.id || item.uuid}>
                      <div className="flex items-center gap-2">
                        {getSourceIcon(item.name, item.type)}
                        <span>{item.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.module && formik.errors.module && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.module as string}
                </p>
              )}
            </div>

            {/* Action Trigger Select */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Triggering Action
              </Label>
              <Select
                value={formik.values.action}
                onValueChange={(val) => formik.setFieldValue("action", val)}
                disabled={!formik.values.module}
              >
                <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-50">
                  <SelectValue
                    placeholder={
                      formik.values.module
                        ? "Select trigger event"
                        : "Select module first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredTriggers.map((t) => (
                    <SelectItem key={t.id || t.name} value={t.id || t.name}>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{t.description || t.name || t.id}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.action && formik.errors.action && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.action as string}
                </p>
              )}
            </div>
          </div>

          {/* Impact Category Selector */}
          <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Impact Category Classification
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formik.values.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => formik.setFieldValue("category", cat.id)}
                    className={cn(
                      "flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer",
                      isSelected
                        ? "border-zinc-900 bg-zinc-900/[0.03] dark:bg-zinc-100/10 ring-2 ring-zinc-900/15 dark:ring-zinc-100/20 shadow-xs"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("h-2 w-2 rounded-full", cat.dotClass)} />
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {cat.label}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Rule Notes & Context (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Explain internal criteria for when this impact scoring rule evaluates..."
              {...formik.getFieldProps("description")}
              className="min-h-[80px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
            />
          </div>
        </PolarisFormCard>

        {/* Step 2: Score Value & Calculations */}
        <PolarisFormCard
          step={2}
          title="Score Value & Multipliers"
          description="Define the impact points awarded or deducted per action execution."
          badge="Scoring Matrix"
        >
          {/* Point Input */}
          <div className="space-y-2">
            <Label htmlFor="points" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Impact Score Delta per Action
            </Label>
            <div className="relative">
              <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="points"
                type="number"
                {...formik.getFieldProps("points")}
                className="h-10 pl-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-bold"
              />
            </div>
            {formik.touched.points && formik.errors.points && (
              <p className="text-[11px] text-rose-500 font-medium">
                {formik.errors.points as string}
              </p>
            )}
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              Quick Point Presets
            </Label>
            <PolarisPresetChips
              presets={POINT_PRESETS}
              currentValue={Number(formik.values.points)}
              onSelect={(val) => formik.setFieldValue("points", val)}
              prefix="+"
            />
          </div>

          {/* Custom Formula Input */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <Label htmlFor="formula" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Custom Evaluation Formula (Optional)
              </Label>
              <span className="text-[10px] text-zinc-400">Dynamic Multiplier</span>
            </div>
            <Input
              id="formula"
              type="text"
              placeholder="e.g. base * 1.5 or points * streakCount"
              {...formik.getFieldProps("formula")}
              className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Leave blank to award the static point delta. Advanced formulas evaluate dynamic action metadata.
            </p>
          </div>
        </PolarisFormCard>

        {/* Step 3: Anti-Abuse & Frequency Limits */}
        <PolarisFormCard
          step={3}
          title="Frequency Limits & Anti-Abuse"
          description="Limit repetitive reward farming by capping the daily executions per member."
          badge="Protection"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyLimit" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Daily Execution Cap per Member
              </Label>
              <button
                type="button"
                onClick={() => formik.setFieldValue("dailyLimit", 0)}
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Set to Unlimited (0)
              </button>
            </div>
            <Input
              id="dailyLimit"
              type="number"
              placeholder="0 for unlimited"
              {...formik.getFieldProps("dailyLimit")}
              className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
            />
            <p className="text-[11px] text-zinc-500">
              The maximum number of times a single member can trigger this rule per calendar day. Set to 0 for unlimited.
            </p>
          </div>

          <PolarisInfoBanner
            title="Fair Play & Integrity"
            description="Daily limits ensure reputation scores accurately reflect sustained quality contributions over time rather than automated spam."
          />
        </PolarisFormCard>

        {/* Floating Save Panel */}
        <FloatingSavePanel
          hasChanged={formik.dirty}
          saved={false}
          isSaving={loading}
          onSave={formik.handleSubmit}
          onReset={() => formik.resetForm()}
          title={isEdit ? "Unsaved Rule Changes" : "Unsaved Scoring Rule"}
          description="You have modified the scoring rule configuration."
          buttonText={isEdit ? "Update Rule" : "Create Scoring Rule"}
        />
      </form>
    </PolarisFormLayout>
  );
}
