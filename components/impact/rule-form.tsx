"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Zap,
  Trophy,
  Check,
  ChevronsUpDown,
  MessageSquare,
  Flame,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/ui/platform/polaris-primitives";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisOriginPicker,
  PolarisPresetChips,
  PolarisInfoBanner,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
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
  showHeader?: boolean;
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
    badgeClass:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: MessageSquare,
  },
  {
    id: "CONTRIBUTION",
    label: "Contribution",
    desc: "Articles, guides, solutions, and original content",
    dotClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: Flame,
  },
  {
    id: "TRUST",
    label: "Trust & Safety",
    desc: "Identity verification, peer vouches, and moderation",
    dotClass: "bg-purple-500",
    badgeClass:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    icon: ShieldCheck,
  },
  {
    id: "COMMERCE",
    label: "Commerce",
    desc: "Orders, subscriptions, and marketplace purchases",
    dotClass: "bg-amber-500",
    badgeClass:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    icon: TrendingUp,
  },
];

export function ImpactRuleForm({
  showHeader = false,
  initialValues,
  onSubmit,
  loading,
  isEdit = false,
  modules = [],
  integrations = [],
  triggers = [],
  moduleTriggers = [],
  integrationTriggers = [],
  templates = [],
}: ImpactRuleFormProps) {
  const router = useRouter();
  const [sourceType, setSourceType] = useState<"MODULE" | "INTEGRATION">(
    "MODULE",
  );
  const [moduleOpen, setModuleOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);

  useEffect(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) =>
          i.id === initialValues.module ||
          (i.uuid && i.uuid === initialValues.module) ||
          (i.slug && i.slug === initialValues.module),
      );
      if (isIntegration) {
        setSourceType("INTEGRATION");
      } else {
        setSourceType("MODULE");
      }
    }
  }, [initialValues, integrations]);

  const formik = useFormik({
    initialValues: {
      module: initialValues?.module || "",
      action: initialValues?.action || "",
      category: initialValues?.category || "ENGAGEMENT",
      points: initialValues?.points ?? 10,
      dailyLimit: initialValues?.dailyLimit ?? 0,
      formula: initialValues?.formula || "",
      description: initialValues?.description || "",
    },
    validationSchema: impactRuleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit({
        ...values,
        sourceType,
      });
    },
  });

  const allSources = useMemo(() => {
    return {
      modules: modules || [],
      integrations: integrations || [],
      all: [...(modules || []), ...(integrations || [])],
    };
  }, [modules, integrations]);

  const currentSourceList =
    sourceType === "MODULE" ? allSources.modules : allSources.integrations;

  const filteredTriggers = useMemo(() => {
    if (!formik.values.module) return [];
    const selectedSource = allSources.all.find(
      (s) =>
        s.id?.toLowerCase() === formik.values.module?.toLowerCase() ||
        (s.uuid &&
          s.uuid.toLowerCase() === formik.values.module?.toLowerCase()) ||
        ((s as any).slug &&
          (s as any).slug.toLowerCase() ===
            formik.values.module?.toLowerCase()),
    );

    const sourceName = selectedSource?.name?.toLowerCase() || "";
    const sourceId = selectedSource?.id?.toLowerCase() || "";
    const sourceUuid = selectedSource?.uuid?.toLowerCase() || "";
    const sourceSlug = (selectedSource as any)?.slug?.toLowerCase() || "";

    const isMatch = (targetId?: string) => {
      if (!targetId) return false;
      const tid = targetId.toLowerCase();
      return (
        tid === sourceId ||
        tid === sourceUuid ||
        tid === sourceSlug ||
        tid === sourceName ||
        sourceName.includes(tid) ||
        tid.includes(sourceName)
      );
    };

    const fromIntegrationTriggers = integrationTriggers.filter(
      (t) =>
        isMatch(t.integrationId) ||
        isMatch(t.moduleId) ||
        isMatch(t.name) ||
        isMatch((t as any).type),
    );

    const fromModuleTriggers = moduleTriggers.filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch(t.module) ||
        isMatch(t.name) ||
        isMatch((t as any).type),
    );

    const fromGenericTriggers = triggers.filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch(t.integrationId) ||
        isMatch(t.module) ||
        isMatch(t.source),
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
      (s.uuid &&
        s.uuid.toLowerCase() === formik.values.module?.toLowerCase()) ||
      ((s as any).slug &&
        (s as any).slug.toLowerCase() ===
          formik.values.module?.toLowerCase()),
  );

  const selectedTriggerItem = filteredTriggers.find(
    (t) =>
      t.id?.toLowerCase() === formik.values.action?.toLowerCase() ||
      t.name?.toLowerCase() === formik.values.action?.toLowerCase(),
  );

  const activeCategory =
    CATEGORIES.find((c) => c.id === formik.values.category) || CATEGORIES[0];

  const readableActionName = (
    selectedTriggerItem?.name ||
    selectedTriggerItem?.description ||
    formik.values.action ||
    "Selected action"
  ).replace(/_/g, " ");

  return (
    <PolarisFormLayout
      sidebar={
        <>
          {/* Live Simulator Card */}
          <PolarisSidebarCard
            title="Reputation Simulator"
            badge="Live Preview"
            icon={Trophy}
          >
            {/* Simulated Notification Card */}
            <div className="p-3.5 rounded-[8px] bg-zinc-900 text-white dark:bg-zinc-950 border border-zinc-800 shadow-sm relative overflow-hidden space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-zinc-800 dark:bg-zinc-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700 shadow-xs">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-bold text-emerald-400">
                      {formik.values.points >= 0
                        ? `+${formik.values.points}`
                        : formik.values.points}{" "}
                      Impact Score
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-semibold bg-zinc-800 text-zinc-300 border-zinc-700 px-1.5 py-0 rounded-[3px]"
                    >
                      {activeCategory.label}
                    </Badge>
                  </div>
                  <p className="text-[12.5px] font-medium text-zinc-100 line-clamp-2 leading-[16px]">
                    Member reputation updated for {readableActionName}.
                  </p>
                  <p className="text-[10.5px] text-zinc-400 pt-0.5">
                    Source:{" "}
                    {selectedSourceItem?.name ||
                      (sourceType === "MODULE" ? "Platform" : "Integration")}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown Rows */}
            <div className="space-y-1 pt-2">
              <PolarisSummaryRow
                label="Impact Category"
                value={
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        activeCategory.dotClass,
                      )}
                    />
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
                  formik.values.dailyLimit &&
                  Number(formik.values.dailyLimit) > 0
                    ? `${formik.values.dailyLimit} times / user`
                    : "Unlimited"
                }
              />
              {formik.values.formula && (
                <PolarisSummaryRow
                  label="Formula"
                  value={
                    <code className="text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
                      {formik.values.formula}
                    </code>
                  }
                />
              )}
              <PolarisSummaryRow
                label="Points Awarded"
                value={
                  <span className="font-bold text-[#303030] dark:text-zinc-100">
                    {formik.values.points >= 0
                      ? `+${formik.values.points}`
                      : formik.values.points}{" "}
                    pts
                  </span>
                }
                isLast
              />
            </div>
          </PolarisSidebarCard>

          {/* Strategy Tip */}
          <PolarisTipCard title="Impact Scoring Guidance">
            Assign higher impact point weights to high-effort contributions
            (like authored articles or verified referrals) to encourage
            meaningful community reputation building.
          </PolarisTipCard>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Step 1: Origin & Action Definition */}
        <PolarisFormCard
          step={1}
          title="Action Origin & Trigger"
          description="Identify the community module or integration channel that triggers this impact change."
          badge="Trigger"
        >
          <div className="space-y-4">
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

            {/* Source & Action Comboboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Searchable Module Combobox */}
              <div className="space-y-1.5">
                <PolarisLabel required>
                  {sourceType === "MODULE"
                    ? "Target Module"
                    : "Connected Integration"}
                </PolarisLabel>

                <Popover open={moduleOpen} onOpenChange={setModuleOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={moduleOpen}
                      className={cn(
                        "w-full h-[40px] px-3 flex items-center justify-between rounded-[8px] border text-[14px] bg-white dark:bg-zinc-900 transition-colors shadow-none text-left cursor-pointer",
                        formik.touched.module && formik.errors.module
                          ? "border-[#d72c0d] focus:ring-[#d72c0d]"
                          : "border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196]",
                        !formik.values.module && "text-[#616161]",
                      )}
                    >
                      <span className="truncate">
                        {formik.values.module
                          ? currentSourceList.find(
                              (m) => (m.id || m.uuid) === formik.values.module,
                            )?.name || formik.values.module
                          : sourceType === "MODULE"
                            ? "Select target module..."
                            : "Select connected app..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-[#616161]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border-[#d2d5d9] dark:border-zinc-700"
                    align="start"
                  >
                    <Command className="rounded-[8px]">
                      <CommandInput
                        placeholder={
                          sourceType === "MODULE"
                            ? "Search modules..."
                            : "Search apps..."
                        }
                        className="h-10 text-[13px]"
                      />
                      <CommandList className="max-h-[220px]">
                        <CommandEmpty className="py-3 text-center text-[12.5px] text-[#616161]">
                          No options found.
                        </CommandEmpty>
                        <CommandGroup>
                          {currentSourceList.map((item) => {
                            const val = item.id || item.uuid;
                            const isSelected = formik.values.module === val;
                            return (
                              <CommandItem
                                key={val}
                                value={`${item.name} ${val}`}
                                onSelect={() => {
                                  formik.setFieldValue("module", val);
                                  formik.setFieldValue("action", "");
                                  setModuleOpen(false);
                                }}
                                className="flex items-center justify-between text-[13px] py-2 cursor-pointer"
                              >
                                <span className="truncate font-medium">
                                  {item.name}
                                </span>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-[#303030] dark:text-zinc-100" />
                                )}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {formik.touched.module && formik.errors.module && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.module as string}
                  </p>
                )}
              </div>

              {/* Searchable Action Combobox */}
              <div className="space-y-1.5">
                <PolarisLabel required>Triggering Action</PolarisLabel>

                <Popover open={actionOpen} onOpenChange={setActionOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={actionOpen}
                      disabled={!formik.values.module}
                      className={cn(
                        "w-full h-[40px] px-3 flex items-center justify-between rounded-[8px] border text-[14px] bg-white dark:bg-zinc-900 transition-colors shadow-none text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        formik.touched.action && formik.errors.action
                          ? "border-[#d72c0d] focus:ring-[#d72c0d]"
                          : "border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196]",
                        !formik.values.action && "text-[#616161]",
                      )}
                    >
                      <span className="truncate">
                        {formik.values.action
                          ? filteredTriggers.find(
                              (t) => (t.id || t.name) === formik.values.action,
                            )?.description ||
                            filteredTriggers.find(
                              (t) => (t.id || t.name) === formik.values.action,
                            )?.name ||
                            formik.values.action
                          : formik.values.module
                            ? "Select trigger action..."
                            : "Select module first"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-[#616161]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border-[#d2d5d9] dark:border-zinc-700"
                    align="start"
                  >
                    <Command className="rounded-[8px]">
                      <CommandInput
                        placeholder="Search trigger event..."
                        className="h-10 text-[13px]"
                      />
                      <CommandList className="max-h-[220px]">
                        <CommandEmpty className="py-3 text-center text-[12.5px] text-[#616161]">
                          No triggers found.
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredTriggers.map((t) => {
                            const val = t.id || t.name;
                            const isSelected = formik.values.action === val;
                            const label = t.description || t.name || t.id;
                            return (
                              <CommandItem
                                key={val}
                                value={`${label} ${val}`}
                                onSelect={() => {
                                  formik.setFieldValue("action", val);
                                  setActionOpen(false);
                                }}
                                className="flex items-center justify-between text-[13px] py-2 cursor-pointer"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <Zap className="h-3.5 w-3.5 text-[#616161] shrink-0" />
                                  <span className="truncate font-medium">
                                    {label}
                                  </span>
                                </div>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-[#303030] dark:text-zinc-100 shrink-0" />
                                )}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {formik.touched.action && formik.errors.action && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.action as string}
                  </p>
                )}
              </div>
            </div>

            {/* Impact Category Selector */}
            <div className="space-y-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel>Impact Category Classification</PolarisLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formik.values.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => formik.setFieldValue("category", cat.id)}
                      className={cn(
                        "flex flex-col text-left p-3 rounded-[8px] border transition-all cursor-pointer",
                        isSelected
                          ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn("h-2 w-2 rounded-full", cat.dotClass)}
                          />
                          <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
                            {cat.label}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
                        )}
                      </div>
                      <span className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        {cat.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisTextarea
                id="description"
                name="description"
                label="Rule Notes & Context (Optional)"
                placeholder="Explain internal criteria for when this impact scoring rule evaluates..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 2: Score Value & Calculations */}
        <PolarisFormCard
          step={2}
          title="Score Value & Multipliers"
          description="Define the impact points awarded or deducted per action execution."
          badge="Scoring Matrix"
        >
          <div className="space-y-4">
            {/* Point Input */}
            <div className="space-y-1.5 max-w-xs">
              <PolarisInput
                id="points"
                name="points"
                type="number"
                label="Impact Score Delta per Action"
                required
                prefix={<Zap className="h-4 w-4" />}
                value={formik.values.points}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.points && formik.errors.points
                    ? String(formik.errors.points)
                    : null
                }
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#616161] dark:text-zinc-400">
                Quick Point Presets
              </label>
              <PolarisPresetChips
                presets={POINT_PRESETS}
                currentValue={Number(formik.values.points)}
                onSelect={(val) => formik.setFieldValue("points", val)}
                prefix="+"
              />
            </div>

            {/* Custom Formula Input */}
            <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="formula"
                name="formula"
                label="Custom Evaluation Formula (Optional)"
                placeholder="e.g. base * 1.5 or points * streakCount"
                value={formik.values.formula}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText="Leave blank to award static point delta. Advanced formulas evaluate dynamic action metadata."
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 3: Anti-Abuse & Frequency Limits */}
        <PolarisFormCard
          step={3}
          title="Frequency Limits & Anti-Abuse"
          description="Limit repetitive reward farming by capping the daily executions per member."
          badge="Protection"
        >
          <div className="space-y-4">
            <div className="max-w-xs">
              <PolarisInput
                id="dailyLimit"
                name="dailyLimit"
                type="number"
                label="Daily Execution Cap per Member"
                labelAction={
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("dailyLimit", 0)}
                    className="text-[12px] font-semibold text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 cursor-pointer"
                  >
                    Unlimited (0)
                  </button>
                }
                placeholder="0 for unlimited"
                value={formik.values.dailyLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText="Maximum executions per member per calendar day (0 for unlimited)."
              />
            </div>

            <PolarisInfoBanner
              title="Fair Play & Integrity"
              description="Daily limits ensure reputation scores accurately reflect sustained quality contributions over time rather than automated spam."
            />
          </div>
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

export default ImpactRuleForm;
