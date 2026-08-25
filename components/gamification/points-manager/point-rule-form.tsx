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
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [isModulePopoverOpen, setIsModulePopoverOpen] = useState(false);
  const [isActionPopoverOpen, setIsActionPopoverOpen] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            {/* Searchable Target Module Combobox */}
            <div className="space-y-1.5">
              <label
                htmlFor="module"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
              >
                {sourceType === "MODULE"
                  ? "Target Module"
                  : "Target App / Store"}
              </label>
              <Popover open={isModulePopoverOpen} onOpenChange={setIsModulePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    id="module"
                    disabled={isEdit}
                    className={cn(
                      "w-full h-[40px] px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer",
                      !formik.values.module && "text-[#8c9196] dark:text-zinc-500",
                      isEdit && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <span className="truncate">
                      {selectedSourceItem?.name ||
                        (sourceType === "MODULE"
                          ? "Select platform module..."
                          : "Select connected app...")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border-[#d2d5d9] dark:border-zinc-800"
                  align="start"
                >
                  <Command className="border-none">
                    <CommandInput
                      placeholder={
                        sourceType === "MODULE"
                          ? "Search platform modules..."
                          : "Search connected apps..."
                      }
                      className="h-10 text-[13px]"
                    />
                    <CommandList className="max-h-[240px]">
                      <CommandEmpty className="p-3 text-[12.5px] text-[#616161] text-center">
                        No {sourceType === "MODULE" ? "modules" : "apps"} found.
                      </CommandEmpty>
                      <CommandGroup>
                        {currentSourceList.map((item, idx) => {
                          const isSelected =
                            item.id?.toLowerCase() ===
                              formik.values.module?.toLowerCase() ||
                            item.uuid?.toLowerCase() ===
                              formik.values.module?.toLowerCase() ||
                            (item as any).slug?.toLowerCase() ===
                              formik.values.module?.toLowerCase();
                          return (
                            <CommandItem
                              key={`src-${item.id}-${idx}`}
                              value={item.name || item.id}
                              onSelect={() => {
                                formik.setFieldValue("module", item.id);
                                formik.setFieldValue("action", "");
                                setIsModulePopoverOpen(false);
                              }}
                              className="flex items-center justify-between text-[13px] font-medium cursor-pointer py-2 px-3"
                            >
                              <span>{item.name}</span>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
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

            {/* Searchable Trigger Event Combobox */}
            <div className="space-y-1.5">
              <label
                htmlFor="action"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
              >
                Trigger Event <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <Popover open={isActionPopoverOpen} onOpenChange={setIsActionPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    id="action"
                    disabled={!formik.values.module || isEdit}
                    className={cn(
                      "w-full h-[40px] px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer",
                      !formik.values.action && "text-[#8c9196] dark:text-zinc-500",
                      (!formik.values.module || isEdit) && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <span className="truncate">
                      {selectedTriggerItem
                        ? (selectedTriggerItem.name
                            ? selectedTriggerItem.name.replace(/_/g, " ")
                            : selectedTriggerItem.description ||
                              selectedTriggerItem.value ||
                              formik.values.action)
                        : (formik.values.module
                            ? "Choose trigger action..."
                            : `Select ${sourceType === "MODULE" ? "module" : "integration"} first`)}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border-[#d2d5d9] dark:border-zinc-800"
                  align="start"
                >
                  <Command className="border-none">
                    <CommandInput
                      placeholder="Search trigger event..."
                      className="h-10 text-[13px]"
                    />
                    <CommandList className="max-h-[240px]">
                      {filteredTriggers.length === 0 ? (
                        <CommandEmpty className="p-3 text-[12.5px] text-[#616161] text-center">
                          No trigger events found for this source
                        </CommandEmpty>
                      ) : (
                        <>
                          <CommandEmpty className="p-3 text-[12.5px] text-[#616161] text-center">
                            No matching trigger event found.
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredTriggers.map((t, idx) => {
                              const itemVal = t.value || t.name || t.id;
                              const isSelected =
                                formik.values.action === itemVal ||
                                formik.values.action === t.id ||
                                formik.values.action === t.name;
                              return (
                                <CommandItem
                                  key={`trig-${itemVal}-${idx}`}
                                  value={`${t.name || ""} ${t.description || ""} ${itemVal}`}
                                  onSelect={() => {
                                    formik.setFieldValue("action", itemVal);
                                    if (!formik.values.description) {
                                      formik.setFieldValue(
                                        "description",
                                        t.description || t.name || "",
                                      );
                                    }
                                    setIsActionPopoverOpen(false);
                                  }}
                                  className="flex items-center justify-between text-[13px] font-medium cursor-pointer py-2 px-3"
                                >
                                  <div className="flex flex-col py-0.5 text-left min-w-0 pr-2">
                                    <span className="font-medium text-[#303030] dark:text-zinc-100 truncate">
                                      {t.name
                                        ? t.name.replace(/_/g, " ")
                                        : t.description || itemVal}
                                    </span>
                                    {t.description &&
                                      t.name &&
                                      t.description !== t.name && (
                                        <span className="text-[11px] text-[#616161] dark:text-zinc-400 line-clamp-1">
                                          {t.description}
                                        </span>
                                      )}
                                  </div>
                                  {isSelected && (
                                    <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100 shrink-0" />
                                  )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </>
                      )}
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

          {/* Cadence & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <div className="space-y-1.5">
              <label
                htmlFor="trigger"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
              >
                Reward Cadence
              </label>
              <Select
                onValueChange={(val) => formik.setFieldValue("trigger", val)}
                value={formik.values.trigger}
                disabled={isEdit}
              >
                <SelectTrigger
                  id="trigger"
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] shadow-none focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500"
                >
                  <SelectValue placeholder="Select trigger cadence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST_TIME" className="text-[13px]">
                    <div className="flex flex-col text-left py-0.5">
                      <span className="font-semibold text-[#303030] dark:text-zinc-100">
                        First-time Action (One-off milestone)
                      </span>
                      <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                        Rewarded only once per user account lifetime
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="RECURRING" className="text-[13px]">
                    <div className="flex flex-col text-left py-0.5">
                      <span className="font-semibold text-[#303030] dark:text-zinc-100">
                        Recurring (Every instance)
                      </span>
                      <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                        Rewarded each time, bounded by velocity limits
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
              >
                Merchant Note / Description
              </label>
              <Textarea
                id="description"
                placeholder="Explain under what conditions this point rule applies..."
                {...formik.getFieldProps("description")}
                className="min-h-[80px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] shadow-none resize-none focus-visible:ring-1 focus-visible:ring-[#005bd3] dark:focus-visible:ring-blue-500"
              />
            </div>
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
            <label
              htmlFor="points"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              Points Awarded per Event
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616161] dark:text-zinc-400">
                  <Zap className="h-4 w-4" />
                </div>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  {...formik.getFieldProps("points")}
                  className="h-[40px] pl-9 pr-14 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] font-semibold text-[#303030] dark:text-zinc-100 rounded-[8px] shadow-none focus-visible:ring-1 focus-visible:ring-[#005bd3] dark:focus-visible:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[12px] font-semibold text-[#616161] dark:text-zinc-400 uppercase tracking-wider">
                  PTS
                </div>
              </div>

              <PolarisPresetChips
                presets={POINT_PRESETS}
                currentValue={Number(formik.values.points)}
                onSelect={(v) => formik.setFieldValue("points", v)}
              />
            </div>
            {formik.touched.points && formik.errors.points && (
              <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                {formik.errors.points as string}
              </p>
            )}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Push Notification Panel */}
            <div
              className={cn(
                "rounded-[8px] border transition-all p-4 space-y-4",
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
                className="flex items-start gap-3 cursor-pointer select-none"
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
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#616161] dark:text-zinc-400" />
                    <label
                      htmlFor="allowPushNotification"
                      className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer"
                    >
                      Allow push notification for user
                    </label>
                  </div>
                  <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                    Send an instant push notification to user's device when
                    points are awarded from this rule.
                  </p>
                </div>
              </div>

              {formik.values.allowPushNotification && (
                <div className="space-y-3 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pushNotificationTitle"
                      className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                    >
                      Push Notification Title
                    </label>
                    <Input
                      id="pushNotificationTitle"
                      placeholder="e.g. ⚡ Points Earned!"
                      {...formik.getFieldProps("pushNotificationTitle")}
                      className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="pushNotificationBody"
                      className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                    >
                      Push Notification Message
                    </label>
                    <Textarea
                      id="pushNotificationBody"
                      placeholder="e.g. You just earned {{points}} points!"
                      {...formik.getFieldProps("pushNotificationBody")}
                      className="min-h-[80px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] resize-none"
                    />
                  </div>
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
                      className="px-2 py-0.5 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[11px]"
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
                      className="px-2 py-0.5 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[11px]"
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
                "rounded-[8px] border transition-all p-4 space-y-4",
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
                className="flex items-start gap-3 cursor-pointer select-none"
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
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#616161] dark:text-zinc-400" />
                    <label
                      htmlFor="allowEmailNotification"
                      className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer"
                    >
                      Allow email notification
                    </label>
                  </div>
                  <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                    Send an email notification when user earns points from this
                    rule.
                  </p>
                </div>
              </div>

              {formik.values.allowEmailNotification && (
                <div className="space-y-3 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="emailNotificationSubject"
                      className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                    >
                      Email Subject
                    </label>
                    <Input
                      id="emailNotificationSubject"
                      placeholder="e.g. You've earned {{points}} points!"
                      {...formik.getFieldProps("emailNotificationSubject")}
                      className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="emailNotificationBody"
                      className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                    >
                      Email Message / Content
                    </label>
                    <Textarea
                      id="emailNotificationBody"
                      placeholder="e.g. Great job! You have earned {{points}} points on our platform."
                      {...formik.getFieldProps("emailNotificationBody")}
                      className="min-h-[80px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] resize-none"
                    />
                  </div>
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
                      className="px-2 py-0.5 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[11px]"
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
                      className="px-2 py-0.5 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[11px]"
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
