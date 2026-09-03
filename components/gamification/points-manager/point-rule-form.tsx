"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Zap,
  Users,
  ShieldCheck,
  Crown,
  Check,
  Sparkles,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisOriginPicker,
  PolarisPresetChips,
  PolarisCapInput,
  PolarisInfoBanner,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisTextarea,
  PolarisSelect,
  PolarisCombobox,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import {
  PolarisEligibilityCard,
  toArray,
} from "@/components/gamification/shared/polaris-eligibility-card";

const pointRuleSchema = Yup.object().shape({
  module: Yup.string().required("Please select a module or integration"),
  action: Yup.string().required("Action name is required"),
  trigger: Yup.string().required("Trigger type is required"),
  points: Yup.number()
    .required("Point value is required")
    .min(1, "Must be at least 1 point"),
  dailyCap: Yup.number().nullable(),
  weeklyCap: Yup.number().nullable(),
  monthlyCap: Yup.number().nullable(),
  memberEligibility: Yup.string().optional(),
  membershipTierId: Yup.array().of(Yup.string()).optional(),
  eligibleTierIds: Yup.array().of(Yup.string()).optional(),
  eligibleUserIds: Yup.array().of(Yup.string()).optional(),
  description: Yup.string().max(200, "Description too long"),
});

interface PointRuleFormProps {
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
}

const POINT_PRESETS = [5, 10, 25, 50, 100, 250, 500];

export function PointRuleForm({
  showHeader = true,
  initialValues,
  onSubmit,
  loading,
  isEdit,
  modules = [],
  integrations = [],
  triggers = [],
  moduleTriggers = [],
  integrationTriggers = [],
}: PointRuleFormProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const initialSourceType = React.useMemo(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) => i.id === initialValues.module || i.uuid === initialValues.module,
      );
      if (isIntegration) return "INTEGRATION";
    }
    return "MODULE";
  }, [initialValues, integrations]);

  const [sourceType, setSourceType] = useState<"MODULE" | "INTEGRATION">(
    initialSourceType,
  );

  useEffect(() => {
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) => i.id === initialValues.module || i.uuid === initialValues.module,
      );
      setSourceType(isIntegration ? "INTEGRATION" : "MODULE");
    }
  }, [initialValues, integrations]);

  const formikInitialValues = React.useMemo(() => {
    return initialValues
      ? {
          ...initialValues,
          memberEligibility:
            initialValues.memberEligibility ||
            (initialValues.eligibleUserIds?.length
              ? "SPECIFIC_CUSTOMERS"
              : (Array.isArray(initialValues.membershipTierId)
                    ? initialValues.membershipTierId.length
                    : initialValues.membershipTierId) ||
                  initialValues.eligibleTierIds?.length
                ? "TIERS"
                : initialValues.isVerifiedOnly
                  ? "VERIFIED"
                  : "ALL"),
          membershipTierId: Array.isArray(initialValues.membershipTierId)
            ? initialValues.membershipTierId
            : initialValues.membershipTierId
              ? [initialValues.membershipTierId]
              : initialValues.eligibleTierIds || [],
          eligibleTierIds: Array.isArray(initialValues.membershipTierId)
            ? initialValues.membershipTierId
            : initialValues.membershipTierId
              ? [initialValues.membershipTierId]
              : initialValues.eligibleTierIds || [],
          eligibleUserIds: initialValues.eligibleUserIds || [],
        }
      : {
          source: initialSourceType,
          module: "",
          action: "",
          trigger: "FIRST_TIME",
          points: 10,
          dailyCap: null,
          weeklyCap: null,
          monthlyCap: null,
          memberEligibility: "ALL",
          membershipTierId: [],
          eligibleTierIds: [],
          eligibleUserIds: [],
          description: "",
        };
  }, [initialValues, initialSourceType]);

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema: pointRuleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const isFirstTime = values.trigger === "FIRST_TIME";
        await onSubmit({
          ...values,
          source: sourceType,
          dailyCap: isFirstTime
            ? null
            : values.dailyCap
              ? Number(values.dailyCap)
              : null,
          weeklyCap: isFirstTime
            ? null
            : values.weeklyCap
              ? Number(values.weeklyCap)
              : null,
          monthlyCap: isFirstTime
            ? null
            : values.monthlyCap
              ? Number(values.monthlyCap)
              : null,
        });
        setSaved(true);
        toast.success(
          isEdit
            ? "Point rule updated successfully!"
            : "Point rule created successfully!",
        );
        setTimeout(() => {
          router.push("/gamification/points-and-badges/points");
        }, 1200);
      } catch (error: any) {
        const errorMsg =
          error?.graphQLErrors?.[0]?.message ||
          error?.networkError?.result?.errors?.[0]?.message ||
          error?.message ||
          "Failed to preserve configuration.";
        toast.error("Save Failed", {
          description: errorMsg,
        });
      }
    },
  });

  const isRecurring = formik.values.trigger === "RECURRING";

  const allSources = React.useMemo(() => {
    const modsMap = new Map<string, any>();
    (modules || []).forEach((m) => {
      const id = String(m.id || m.uuid || m.slug || m.name || "").trim();
      if (id && !modsMap.has(id.toLowerCase())) {
        modsMap.set(id.toLowerCase(), {
          id,
          uuid: m.uuid,
          name: m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : id,
          type: "Module",
          icon: m.icon,
        });
      }
    });

    const intsMap = new Map<string, any>();
    (integrations || []).forEach((i) => {
      const id = String(i.id || i.uuid || (i as any).slug || i.name || "").trim();
      if (id && !intsMap.has(id.toLowerCase())) {
        intsMap.set(id.toLowerCase(), {
          id,
          uuid: i.uuid,
          slug: (i as any).slug,
          name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : id,
          type: "Integration",
          icon: i.icon,
        });
      }
    });

    const mods = Array.from(modsMap.values());
    const ints = Array.from(intsMap.values());
    return { modules: mods, integrations: ints, all: [...mods, ...ints] };
  }, [modules, integrations]);

  const currentSourceList =
    sourceType === "MODULE" ? allSources.modules : allSources.integrations;

  const filteredTriggers = React.useMemo(() => {
    const selected = formik.values.module;
    if (!selected) return [];

    const selectedSource = allSources.all.find(
      (s) =>
        s.id?.toLowerCase() === selected.toLowerCase() ||
        (s.uuid && s.uuid.toLowerCase() === selected.toLowerCase()) ||
        ((s as any).slug &&
          (s as any).slug.toLowerCase() === selected.toLowerCase()),
    );

    const matchValues = new Set<string>();
    matchValues.add(selected.toLowerCase());
    if (selectedSource?.id) matchValues.add(selectedSource.id.toLowerCase());
    if (selectedSource?.uuid)
      matchValues.add(selectedSource.uuid.toLowerCase());
    if ((selectedSource as any)?.slug)
      matchValues.add((selectedSource as any).slug.toLowerCase());
    if (selectedSource?.name)
      matchValues.add(selectedSource.name.toLowerCase());

    const isMatch = (target?: string | null) => {
      if (!target) return false;
      return matchValues.has(target.toLowerCase());
    };

    const fromIntegrationTriggers = (integrationTriggers || []).filter(
      (t) =>
        isMatch(t.integrationId) ||
        isMatch(t.moduleId) ||
        isMatch((t as any).slug) ||
        isMatch((t as any).integrationSlug),
    );

    const fromModuleTriggers = (moduleTriggers || []).filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch((t as any).integrationId) ||
        isMatch((t as any).slug),
    );

    const fromGenericTriggers = (triggers || []).filter(
      (t) =>
        isMatch(t.moduleId) ||
        isMatch((t as any).integrationId) ||
        isMatch((t as any).slug),
    );

    const combined = [
      ...fromIntegrationTriggers,
      ...fromModuleTriggers,
      ...fromGenericTriggers,
    ];

    if (combined.length === 0 && sourceType === "INTEGRATION") {
      (integrationTriggers || []).forEach((t) => {
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

    const unique = new Map<string, any>();
    combined.forEach((item) => {
      const val = String(item.name || item.id || item.description || "").trim();
      if (val && !unique.has(val.toLowerCase())) {
        unique.set(val.toLowerCase(), {
          ...item,
          value: val,
        });
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
        (s as any).slug.toLowerCase() === formik.values.module?.toLowerCase()),
  );

  const selectedTriggerItem = filteredTriggers.find(
    (t) => t.id === formik.values.action || t.name === formik.values.action,
  );

  const readableActionName = (
    selectedTriggerItem?.name ||
    selectedTriggerItem?.description ||
    formik.values.action ||
    "Select an action"
  ).replace(/_/g, " ");

  return (
    <PolarisFormLayout
      sidebar={
        <>
          {/* Live Customer Simulator Card */}
          <PolarisSidebarCard
            title="Customer Experience Preview"
            badge="Live Simulator"
          >
            {/* Simulated Customer Notification Toast */}
            <div className="p-3.5 rounded-[8px] bg-[#303030] text-white dark:bg-zinc-950 border border-[#202020] dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-white/20 shadow-xs">
                  <Zap className="h-3.5 w-3.5 fill-white" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-white">
                      +{formik.values.points || 0} Points Awarded!
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-zinc-200 line-clamp-2 leading-[16px]">
                    You just earned points for {readableActionName}.
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Channel:{" "}
                    {selectedSourceItem?.name ||
                      (sourceType === "MODULE"
                        ? "Platform Module"
                        : "Integration")}
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Rule Breakdown */}
            <div className="space-y-2.5 pt-1">
              <PolarisSummaryRow
                label="Channel Origin"
                value={selectedSourceItem?.name || "Unspecified"}
              />
              <PolarisSummaryRow
                label="Target Trigger"
                value={
                  formik.values.trigger === "FIRST_TIME" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      <Sparkles className="h-2.5 w-2.5 text-amber-500" /> One-Time Bonus
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      <Repeat className="h-2.5 w-2.5 text-sky-500" /> Recurring Rule
                    </span>
                  )
                }
              />
              <PolarisSummaryRow
                label="Eligibility"
                value={
                  formik.values.memberEligibility === "VERIFIED"
                    ? "Verified Only"
                    : formik.values.memberEligibility === "TIERS"
                      ? formik.values.eligibleTierIds?.length > 0
                        ? `${formik.values.eligibleTierIds.length} Tier(s)`
                        : "Specific Tiers"
                      : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                        ? formik.values.eligibleUserIds?.length > 0
                          ? `${formik.values.eligibleUserIds.length} Customer(s)`
                          : "Specific Customers"
                        : "All Customers"
                }
                isLast={!isRecurring}
              />
              {isRecurring && (
                <>
                  <PolarisSummaryRow
                    label="Daily Payout Cap"
                    value={
                      formik.values.dailyCap
                        ? `${formik.values.dailyCap} times / user`
                        : "Unlimited"
                    }
                  />
                  <PolarisSummaryRow
                    label="Weekly Payout Cap"
                    value={
                      formik.values.weeklyCap
                        ? `${formik.values.weeklyCap} times / user`
                        : "Unlimited"
                    }
                  />
                  <PolarisSummaryRow
                    label="Monthly Payout Cap"
                    value={
                      formik.values.monthlyCap
                        ? `${formik.values.monthlyCap} times / user`
                        : "Unlimited"
                    }
                    isLast
                  />
                </>
              )}
            </div>
          </PolarisSidebarCard>

          <PolarisTipCard>
            Calibrate your point values so high-friction actions (like store
            purchases or reviews) grant higher point rewards compared to
            high-frequency actions (like comments or likes).
          </PolarisTipCard>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Card 1: Origin & Action Definition */}
        <PolarisFormCard
          step={1}
          title="Origin & Event Trigger"
          description="Select where this action occurs and which event initiates the point reward."
          badge="Polaris Engine"
        >
          <PolarisOriginPicker
            sourceType={sourceType}
            onSelect={(type) => {
              setSourceType(type);
              formik.setFieldValue("source", type);
              formik.setFieldValue("module", "");
              formik.setFieldValue("action", "");
            }}
            modulesCount={modules.length}
            integrationsCount={integrations.length}
            disabled={isEdit}
          />

          {/* Target Source and Triggering Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            {/* Searchable Target Module Combobox */}
            <PolarisCombobox
              id="module"
              label={sourceType === "MODULE" ? "Target Module" : "Target App / Store"}
              placeholder={sourceType === "MODULE" ? "Select platform module..." : "Select connected app..."}
              searchPlaceholder={sourceType === "MODULE" ? "Search platform modules..." : "Search connected apps..."}
              options={currentSourceList.map((item) => ({
                value: item.id || item.uuid || (item as any).slug,
                label: item.name,
              }))}
              value={formik.values.module}
              disabled={isEdit}
              onChange={(val) => {
                formik.setFieldValue("module", val);
                formik.setFieldValue("action", "");
              }}
              error={formik.touched.module && formik.errors.module ? (formik.errors.module as string) : undefined}
            />

            {/* Searchable Trigger Event Combobox */}
            <PolarisCombobox
              id="action"
              label="Trigger Event"
              required
              placeholder={formik.values.module ? "Choose trigger action..." : `Select ${sourceType === "MODULE" ? "module" : "integration"} first`}
              searchPlaceholder="Search trigger event..."
              options={filteredTriggers.map((t) => {
                const itemVal = t.value || t.name || t.id;
                const label = t.name ? t.name.replace(/_/g, " ") : (t.description || itemVal);
                return {
                  value: itemVal,
                  label: label,
                  badge: t.type || undefined,
                };
              })}
              value={formik.values.action}
              disabled={!formik.values.module || isEdit}
              onChange={(val) => {
                formik.setFieldValue("action", val);
                const found = filteredTriggers.find((t) => (t.value || t.name || t.id) === val);
                if (!formik.values.description && found) {
                  formik.setFieldValue("description", found.description || found.name || "");
                }
              }}
              error={formik.touched.action && formik.errors.action ? (formik.errors.action as string) : undefined}
            />
          </div>

          {/* Cadence & Description */}
          <div className="space-y-3.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <div>
              <div className="flex items-center justify-between mb-2">
                <PolarisLabel required>Reward Cadence</PolarisLabel>
                <span className="text-[11px] text-muted-foreground">
                  Choose how often members can be credited for this trigger.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* One-off milestone */}
                <div
                  role="button"
                  tabIndex={isEdit ? -1 : 0}
                  onClick={() => {
                    if (isEdit) return;
                    formik.setFieldValue("trigger", "FIRST_TIME");
                    formik.setFieldValue("dailyCap", null);
                    formik.setFieldValue("weeklyCap", null);
                    formik.setFieldValue("monthlyCap", null);
                  }}
                  className={cn(
                    "relative flex items-start gap-3 p-3.5 rounded-[10px] border text-left transition-all duration-200 cursor-pointer select-none",
                    formik.values.trigger === "FIRST_TIME"
                      ? "border-amber-500/60 bg-gradient-to-b from-amber-500/[0.08] to-amber-500/[0.02] dark:from-amber-500/[0.12] dark:to-transparent ring-2 ring-amber-500/30 shadow-xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-700",
                    isEdit && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0 transition-colors",
                      formik.values.trigger === "FIRST_TIME"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[13px] font-bold text-foreground">
                        First-Time Action
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight uppercase border",
                          formik.values.trigger === "FIRST_TIME"
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40"
                            : "bg-muted text-muted-foreground border-transparent",
                        )}
                      >
                        One-Off
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                      Awarded exactly once per user account lifetime upon first completion.
                    </p>
                  </div>
                </div>

                {/* Recurring */}
                <div
                  role="button"
                  tabIndex={isEdit ? -1 : 0}
                  onClick={() => {
                    if (isEdit) return;
                    formik.setFieldValue("trigger", "RECURRING");
                    if (
                      formik.values.dailyCap === null &&
                      formik.values.weeklyCap === null &&
                      formik.values.monthlyCap === null
                    ) {
                      formik.setFieldValue("dailyCap", 10);
                      formik.setFieldValue("weeklyCap", 70);
                      formik.setFieldValue("monthlyCap", 210);
                    }
                  }}
                  className={cn(
                    "relative flex items-start gap-3 p-3.5 rounded-[10px] border text-left transition-all duration-200 cursor-pointer select-none",
                    formik.values.trigger === "RECURRING"
                      ? "border-sky-500/60 bg-gradient-to-b from-sky-500/[0.08] to-sky-500/[0.02] dark:from-sky-500/[0.12] dark:to-transparent ring-2 ring-sky-500/30 shadow-xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-700",
                    isEdit && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0 transition-colors",
                      formik.values.trigger === "RECURRING"
                        ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Repeat className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[13px] font-bold text-foreground">
                        Recurring Rule
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight uppercase border",
                          formik.values.trigger === "RECURRING"
                            ? "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40"
                            : "bg-muted text-muted-foreground border-transparent",
                        )}
                      >
                        Recurring
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                      Awarded continuously upon every event, governed by frequency caps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <PolarisTextarea
              id="description"
              label="Merchant Note / Description"
              placeholder="Explain under what conditions this point rule applies..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </PolarisFormCard>

        {/* Card 2: Point Economics & Payout Values */}
        <PolarisFormCard
          step={2}
          title="Points Economics"
          description="Define the point reward value credited to the member upon action completion."
          badge="Instant Credit"
        >
          <div className="space-y-2">
            <PolarisLabel required>Points Awarded per Event</PolarisLabel>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex-1">
                <PolarisInput
                  id="points"
                  name="points"
                  type="number"
                  min="1"
                  prefix={<Zap className="h-3.5 w-3.5" />}
                  suffix="PTS"
                  value={formik.values.points}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.points && formik.errors.points ? (formik.errors.points as string) : undefined}
                />
              </div>

              <PolarisPresetChips
                presets={POINT_PRESETS}
                currentValue={Number(formik.values.points)}
                onSelect={(v) => formik.setFieldValue("points", v)}
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* Card 3: Velocity & Anti-Abuse Frequency Controls - Only rendered for Recurring rules */}
        {isRecurring && (
          <PolarisFormCard
            step={3}
            title="Velocity & Fraud Protection"
            description="Protect the community point economy with velocity limitations and anti-farming caps."
            badge="Anti-Abuse Engine"
          >
            <PolarisInfoBanner
              title="Frequency Cap Enforcement"
              description="Caps define the maximum number of rewarded occurrences per individual user account. Leave a cap blank or set to 0 for unconstrained earning."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <PolarisCapInput
                id="dailyCap"
                label="Daily Cap"
                periodSuffix="/ day"
                value={formik.values.dailyCap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onClear={() => formik.setFieldValue("dailyCap", null)}
              />
              <PolarisCapInput
                id="weeklyCap"
                label="Weekly Cap"
                periodSuffix="/ week"
                value={formik.values.weeklyCap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onClear={() => formik.setFieldValue("weeklyCap", null)}
              />
              <PolarisCapInput
                id="monthlyCap"
                label="Monthly Cap"
                periodSuffix="/ month"
                value={formik.values.monthlyCap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onClear={() => formik.setFieldValue("monthlyCap", null)}
              />
            </div>
          </PolarisFormCard>
        )}

        {/* Card 4: Eligibility (Shopify Polaris UI) */}
        <PolarisEligibilityCard
          step={isRecurring ? 4 : 3}
          eligibility={formik.values.memberEligibility || "ALL"}
          onEligibilityChange={(val) =>
            formik.setFieldValue("memberEligibility", val)
          }
          tierIds={
            formik.values.membershipTierId ||
            formik.values.eligibleTierIds ||
            []
          }
          onTierIdsChange={(tiers) => {
            formik.setFieldValue("eligibleTierIds", tiers);
            formik.setFieldValue("membershipTierId", tiers);
          }}
          userIds={formik.values.eligibleUserIds || []}
          onUserIdsChange={(users) => {
            formik.setFieldValue("eligibleUserIds", users);
          }}
        />
      </form>

      {/* Floating Save Panel (Shopify Bottom Action Bar) */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title={isEdit ? "Unsaved Rule Changes" : "New Point Rule"}
        description={
          isEdit
            ? "Save your modifications to activate the updated point payout."
            : "Commission this point rule into your live gamification engine?"
        }
        buttonText={isEdit ? "Save Rule" : "Save Rule"}
      />
    </PolarisFormLayout>
  );
}
