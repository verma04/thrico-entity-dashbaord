"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Zap,
  Bell,
  Mail,
  Users,
  ShieldCheck,
  Crown,
  Check,
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
import { Checkbox } from "@/components/ui/checkbox";

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
  allowPushNotification: Yup.boolean().optional(),
  allowEmailNotification: Yup.boolean().optional(),
  pushNotificationTitle: Yup.string().optional(),
  pushNotificationBody: Yup.string().optional(),
  emailNotificationSubject: Yup.string().optional(),
  emailNotificationBody: Yup.string().optional(),
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
          allowPushNotification:
            initialValues.allowPushNotification !== undefined
              ? initialValues.allowPushNotification
              : true,
          allowEmailNotification:
            initialValues.allowEmailNotification !== undefined
              ? initialValues.allowEmailNotification
              : true,
          pushNotificationTitle: initialValues.pushNotificationTitle ?? "",
          pushNotificationBody: initialValues.pushNotificationBody ?? "",
          emailNotificationSubject:
            initialValues.emailNotificationSubject ?? "",
          emailNotificationBody: initialValues.emailNotificationBody ?? "",
        }
      : {
          source: initialSourceType,
          module: "",
          action: "",
          trigger: "FIRST_TIME",
          points: 10,
          dailyCap: 10,
          weeklyCap: 70,
          monthlyCap: 210,
          memberEligibility: "ALL",
          membershipTierId: [],
          eligibleTierIds: [],
          eligibleUserIds: [],
          description: "",
          allowPushNotification: true,
          allowEmailNotification: true,
          pushNotificationTitle: "",
          pushNotificationBody: "",
          emailNotificationSubject: "",
          emailNotificationBody: "",
        };
  }, [initialValues, initialSourceType]);

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema: pointRuleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await onSubmit({
          ...values,
          source: sourceType,
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
                  formik.values.trigger === "FIRST_TIME"
                    ? "First Time Only"
                    : "Recurring"
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
              />
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
                    {formik.values.allowPushNotification
                      ? "Enabled"
                      : "Disabled"}
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
                    {formik.values.allowEmailNotification
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                }
                isLast
              />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisSelect
              id="trigger"
              label="Reward Cadence"
              value={formik.values.trigger}
              disabled={isEdit}
              onChange={(val) => formik.setFieldValue("trigger", val)}
              options={[
                { value: "FIRST_TIME", label: "First-time Action (One-off milestone)" },
                { value: "RECURRING", label: "Recurring (Every instance)" },
              ]}
            />

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

        {/* Card 3: Velocity & Anti-Abuse Frequency Controls */}
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

        {/* Card 4: Eligibility (Shopify Polaris UI) */}
        <PolarisEligibilityCard
          step={4}
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

        {/* Card 5: Notification Settings */}
        <PolarisFormCard
          step={5}
          title="Notification Settings"
          description="Configure alert channels and custom notification text when members earn points from this rule."
          badge="Notification Channels"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Push Notification Panel */}
            <div
              className={cn(
                "rounded-[8px] border transition-all p-3.5 space-y-3.5",
                formik.values.allowPushNotification
                  ? "border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  : "border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/20 opacity-75",
              )}
            >
              <div
                onClick={() =>
                  formik.setFieldValue(
                    "allowPushNotification",
                    !formik.values.allowPushNotification,
                  )
                }
                className="flex items-start gap-2.5 cursor-pointer select-none"
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
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />
                    <label
                      htmlFor="allowPushNotification"
                      className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer"
                    >
                      Allow push notification for user
                    </label>
                  </div>
                  <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Send an instant push notification to user's device when
                    points are awarded from this rule.
                  </p>
                </div>
              </div>

              {formik.values.allowPushNotification && (
                <div className="space-y-2.5 pt-2.5 border-t border-[#e1e3e5] dark:border-zinc-800 animate-in fade-in-50 duration-200">
                  <PolarisInput
                    id="pushNotificationTitle"
                    name="pushNotificationTitle"
                    label="Push Notification Title"
                    placeholder="e.g. ⚡ Points Earned!"
                    value={formik.values.pushNotificationTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <PolarisTextarea
                    id="pushNotificationBody"
                    name="pushNotificationBody"
                    label="Push Notification Message"
                    placeholder="e.g. You just earned {{points}} points!"
                    value={formik.values.pushNotificationBody}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                    <span>Variables:</span>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "pushNotificationBody",
                          `${formik.values.pushNotificationBody} {{points}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.2 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[10.5px]"
                    >
                      {"{{points}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "pushNotificationBody",
                          `${formik.values.pushNotificationBody} {{userName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.2 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[10.5px]"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Notification Panel */}
            <div
              className={cn(
                "rounded-[8px] border transition-all p-3.5 space-y-3.5",
                formik.values.allowEmailNotification
                  ? "border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  : "border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/20 opacity-75",
              )}
            >
              <div
                onClick={() =>
                  formik.setFieldValue(
                    "allowEmailNotification",
                    !formik.values.allowEmailNotification,
                  )
                }
                className="flex items-start gap-2.5 cursor-pointer select-none"
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
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />
                    <label
                      htmlFor="allowEmailNotification"
                      className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer"
                    >
                      Allow email notification
                    </label>
                  </div>
                  <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Send an email notification when user earns points from this
                    rule.
                  </p>
                </div>
              </div>

              {formik.values.allowEmailNotification && (
                <div className="space-y-2.5 pt-2.5 border-t border-[#e1e3e5] dark:border-zinc-800 animate-in fade-in-50 duration-200">
                  <PolarisInput
                    id="emailNotificationSubject"
                    name="emailNotificationSubject"
                    label="Email Subject"
                    placeholder="e.g. You've earned {{points}} points!"
                    value={formik.values.emailNotificationSubject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <PolarisTextarea
                    id="emailNotificationBody"
                    name="emailNotificationBody"
                    label="Email Message / Content"
                    placeholder="e.g. Great job! You have earned {{points}} points on our platform."
                    value={formik.values.emailNotificationBody}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                    <span>Variables:</span>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "emailNotificationBody",
                          `${formik.values.emailNotificationBody} {{points}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.2 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[10.5px]"
                    >
                      {"{{points}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "emailNotificationBody",
                          `${formik.values.emailNotificationBody} {{userName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.2 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[10.5px]"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PolarisFormCard>
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
