"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Search,
  Upload,
  Loader2,
  Bell,
  Mail,
  Check,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUploadImage } from "@/graphql/actions";
import { getPreferredMediaUrl } from "@/utils/media";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisOriginPicker,
  PolarisPresetChips,
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

const ICON_CATEGORIES = [
  {
    name: "Success & Achievement",
    icons: [
      "⭐",
      "🏆",
      "🎯",
      "🎖️",
      "🏅",
      "🥇",
      "🥈",
      "🥉",
      "👑",
      "✨",
      "🌟",
      "🎊",
      "🚀",
      "💫",
      "🔥",
      "💎",
    ],
  },
  {
    name: "Badges & Emblems",
    icons: [
      "🛡️",
      "⚔️",
      "⚡",
      "🔮",
      "⚜️",
      "🔱",
      "💠",
      "🔹",
      "🔸",
      "🔺",
      "🔻",
      "🔷",
      "🔶",
      "🔰",
      "🔘",
      "⚪",
    ],
  },
  {
    name: "Community & Social",
    icons: [
      "💬",
      "🗣️",
      "👥",
      "🤝",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🤎",
      "🖤",
      "🤍",
      "💯",
      "🎉",
      "👏",
    ],
  },
  {
    name: "Milestones & Progress",
    icons: [
      "🌱",
      "🌿",
      "🌳",
      "🌲",
      "🏔️",
      "🧗",
      "🏁",
      "🚩",
      "📈",
      "📊",
      "🎓",
      "📚",
      "💡",
      "🔑",
      "🗝️",
      "🔓",
    ],
  },
  {
    name: "Special & Prestigious",
    icons: [
      "🦄",
      "🐉",
      "🦁",
      "🦅",
      "🐺",
      "🦊",
      "🌌",
      "🪐",
      "☄️",
      "☀️",
      "🌙",
      "🌈",
      "⚡",
      "💥",
      "🛸",
      "💎",
    ],
  },
];

const badgeSchema = Yup.object().shape({
  name: Yup.string().required("Badge name is required"),
  description: Yup.string().required("Badge description is required"),
  icon: Yup.string().required("Visual icon is required"),
  type: Yup.string().required("Award mechanism is required"),
  module: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) => schema.required("Target module is required"),
    otherwise: (schema) => schema.optional(),
  }),
  action: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) => schema.required("Triggering action is required"),
    otherwise: (schema) => schema.optional(),
  }),
  targetValue: Yup.number()
    .required("Required threshold value is required")
    .min(1, "Must be at least 1"),
  memberEligibility: Yup.string().optional(),
  membershipTierId: Yup.array().of(Yup.string()).optional(),
  eligibleTierIds: Yup.array().of(Yup.string()).optional(),
  eligibleUserIds: Yup.array().of(Yup.string()).optional(),
  allowPushNotification: Yup.boolean().optional(),
  allowEmailNotification: Yup.boolean().optional(),
  pushNotificationTitle: Yup.string().optional(),
  pushNotificationBody: Yup.string().optional(),
  emailNotificationSubject: Yup.string().optional(),
  emailNotificationBody: Yup.string().optional(),
});

interface BadgeFormProps {
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

export function BadgeForm({
  showHeader = true,
  initialValues,
  onSubmit,
  loading,
  isEdit = false,
  modules = [],
  integrations = [],
  triggers = [],
  moduleTriggers = [],
  integrationTriggers = [],
}: BadgeFormProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [iconMode, setIconMode] = useState<"emoji" | "upload">("emoji");
  const [iconSearch, setIconSearch] = useState("");
  const [uploadImage, { loading: isUploading }] = useUploadImage();
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

  const formikInitialValues = React.useMemo(() => {
    return initialValues
      ? {
          source: initialSourceType,
          name: initialValues.name || "",
          description: initialValues.description || "",
          icon: initialValues.icon || "⭐",
          type: initialValues.type || "ACTION",
          module: initialValues.module || "",
          action: initialValues.action || "",
          targetValue: initialValues.count || initialValues.points || initialValues.targetValue || 1,
          memberEligibility:
            initialValues.memberEligibility ||
            (initialValues.eligibleUserIds?.length
              ? "SPECIFIC_CUSTOMERS"
              : (Array.isArray(initialValues.membershipTierId)
                    ? initialValues.membershipTierId.length
                    : initialValues.membershipTierId) ||
                  initialValues.eligibleTierIds?.length
                ? "TIERS"
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
          source: initialSourceType,
          name: "",
          description: "",
          icon: "⭐",
          type: "ACTION",
          module: "",
          action: "",
          targetValue: 1,
          memberEligibility: "ALL",
          membershipTierId: [],
          eligibleTierIds: [],
          eligibleUserIds: [],
          allowPushNotification: true,
          allowEmailNotification: true,
          pushNotificationTitle: "",
          pushNotificationBody: "",
          emailNotificationSubject: "",
          emailNotificationBody: "",
          isActive: true,
        };
  }, [initialValues, initialSourceType]);

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema: badgeSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await onSubmit({
          ...values,
          source: values.type === "ACTION" ? sourceType : undefined,
        });
        setSaved(true);
        toast.success(
          isEdit
            ? "Badge updated successfully!"
            : "Badge created successfully!",
        );
        setTimeout(() => {
          router.push("/gamification/points-and-badges/badges");
        }, 1500);
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

  const selectedSourceItem = React.useMemo(() => {
    const target = formik.values.module;
    if (!target) return null;
    return allSources.all.find(
      (item) =>
        item.id?.toLowerCase() === target.toLowerCase() ||
        item.uuid?.toLowerCase() === target.toLowerCase() ||
        (item as any).slug?.toLowerCase() === target.toLowerCase(),
    );
  }, [formik.values.module, allSources]);

  const filteredTriggers = React.useMemo(() => {
    const selected = formik.values.module;
    if (!selected) return [];

    const selectedSource = allSources.all.find(
      (s) =>
        s.id?.toLowerCase() === selected.toLowerCase() ||
        (s.uuid && s.uuid.toLowerCase() === selected.toLowerCase()) ||
        ((s as any).slug && (s as any).slug.toLowerCase() === selected.toLowerCase()),
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

  const selectedTriggerItem = React.useMemo(() => {
    const val = formik.values.action;
    if (!val) return null;
    return filteredTriggers.find(
      (t) =>
        t.value === val ||
        t.id === val ||
        t.name === val ||
        (t.name || t.id) === val,
    );
  }, [formik.values.action, filteredTriggers]);

  const isIconImage = formik.values.icon?.includes("/") || formik.values.icon?.startsWith("http");

  return (
    <PolarisFormLayout
      sidebar={
        <>
          {/* Badge Discovery Preview */}
          <PolarisSidebarCard title="Discovery Preview" badge="Member View">
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-zinc-900/10 dark:bg-zinc-100/10 rounded-full blur-2xl transition-colors" />
                <div className="relative h-20 w-20 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center text-4xl transition-transform group-hover:scale-105 overflow-hidden">
                  {isIconImage ? (
                    <img src={getPreferredMediaUrl(formik.values.icon)} alt="Icon" className="h-full w-full object-cover" />
                  ) : (
                    formik.values.icon || "⭐"
                  )}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 h-7 w-7 bg-[#303030] dark:bg-zinc-100 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center shadow-md text-white dark:text-zinc-900">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="text-[16px] font-bold text-[#303030] dark:text-zinc-100">
                  {formik.values.name || "Achievement Name"}
                </h3>
                <p className="text-[12.5px] text-[#616161] dark:text-zinc-400 px-2 leading-[18px]">
                  {formik.values.description ||
                    "Design your badge to see how it will appear to members in their profile gallery."}
                </p>
              </div>
              <div className="w-full space-y-2 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Type"
                  value={formik.values.type === "ACTION" ? "Action Cumulative" : "Milestone Threshold"}
                />
                <PolarisSummaryRow
                  label="Target"
                  value={`${formik.values.targetValue || 0} ${formik.values.type === "ACTION" ? "actions" : "points"}`}
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
                  label="Push Alert"
                  value={
                    <span
                      className={cn(
                        "text-[12px] font-medium",
                        formik.values.allowPushNotification
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[#8c9196] dark:text-zinc-500",
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
                        "text-[12px] font-medium",
                        formik.values.allowEmailNotification
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[#8c9196] dark:text-zinc-500",
                      )}
                    >
                      {formik.values.allowEmailNotification ? "Enabled" : "Disabled"}
                    </span>
                  }
                  isLast
                />
              </div>
            </div>
          </PolarisSidebarCard>

          <PolarisTipCard title="Badge Design Tip">
            Members who meet the criteria after deployment will be automatically awarded. Higher target values create rarer badges — calibrate difficulty for maximum engagement.
          </PolarisTipCard>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Card 1: Identity & Designation */}
        <PolarisFormCard
          step={1}
          title="Identity & Designation"
          description="Give your achievement a name, description, and visual icon."
          badge="Badge Builder"
        >
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 space-y-3.5">
              <PolarisInput
                id="name"
                name="name"
                label="Achievement Name"
                required
                placeholder="e.g. Master Contributor, Early Adopter"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name ? (formik.errors.name as string) : undefined}
              />
              <PolarisTextarea
                id="description"
                name="description"
                label="Detailed Description"
                required
                placeholder="What does a user need to do to earn this?"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description ? (formik.errors.description as string) : undefined}
              />
            </div>

            <div className="w-full md:w-[260px] space-y-2.5">
              <PolarisLabel>Visual Representation</PolarisLabel>
              <div className="flex flex-col gap-2.5 p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
                <div className="h-14 w-14 mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-sm flex items-center justify-center text-3xl border border-[#d2d5d9] dark:border-zinc-700 overflow-hidden">
                  {isIconImage ? (
                    <img src={getPreferredMediaUrl(formik.values.icon)} alt="Icon" className="h-full w-full object-cover" />
                  ) : (
                    formik.values.icon || "⭐"
                  )}
                </div>

                <div className="flex bg-white dark:bg-zinc-800 rounded-[6px] p-0.5 border border-[#d2d5d9] dark:border-zinc-700 text-[11.5px] font-medium">
                  <button 
                    type="button" 
                    onClick={() => setIconMode("emoji")} 
                    className={cn(
                      "flex-1 py-1 rounded-[4px] transition-all font-medium text-[11.5px]",
                      iconMode === "emoji"
                        ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]",
                    )}
                  >
                    Emoji
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIconMode("upload")} 
                    className={cn(
                      "flex-1 py-1 rounded-[4px] transition-all font-medium text-[11.5px]",
                      iconMode === "upload"
                        ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]",
                    )}
                  >
                    Custom Icon
                  </button>
                </div>

                {iconMode === "emoji" ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#616161]" />
                      <Input
                        placeholder="Filter icons..."
                        className="pl-8 h-[34px] text-[12.5px] bg-white dark:bg-zinc-800 border-[#aeb4b9] dark:border-zinc-700 rounded-[6px]"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-1.5 max-h-[130px] overflow-y-auto pr-1">
                      {ICON_CATEGORIES.flatMap((c) => c.icons).map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => formik.setFieldValue("icon", icon)}
                          className={cn(
                            "h-6 w-6 rounded-[4px] flex items-center justify-center text-sm transition-all",
                            formik.values.icon === icon
                              ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                              : "bg-white dark:bg-zinc-800 hover:bg-[#f6f6f7] dark:hover:bg-zinc-700",
                          )}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#d2d5d9] dark:border-zinc-700 rounded-[8px] p-3 gap-1 bg-white dark:bg-zinc-800 hover:bg-[#f6f6f7] dark:hover:bg-zinc-700/50 transition-colors text-center relative h-[130px]">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const res = await uploadImage({ variables: { file } });
                            if (res.data?.uploadImage) {
                              formik.setFieldValue("icon", res.data.uploadImage);
                            }
                          } catch (err: any) {
                            toast.error("Upload Failed", {
                              description: err?.message || "Failed to upload image.",
                            });
                          }
                        }
                      }}
                    />
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 text-[#303030] dark:text-zinc-100 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 text-[#616161] mb-0.5" />
                    )}
                    <p className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-100">Click to upload icon</p>
                    <p className="text-[10px] text-[#616161] dark:text-zinc-400">PNG, JPG, SVG</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PolarisFormCard>

        {/* Card 2: Achievement Logic */}
        <PolarisFormCard
          step={2}
          title="Achievement Logic"
          description="Determine how this badge is algorithmically awarded."
          badge="Award Engine"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <PolarisSelect
              id="type"
              label="Award Mechanism"
              value={formik.values.type}
              disabled={isEdit}
              onChange={(val) => formik.setFieldValue("type", val)}
              options={[
                { value: "ACTION", label: "Action Cumulative" },
                { value: "POINTS", label: "Milestone Threshold" },
              ]}
            />

            <PolarisInput
              id="targetValue"
              name="targetValue"
              type="number"
              min={1}
              label={formik.values.type === "ACTION" ? "Required Count" : "Required Points"}
              value={formik.values.targetValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {formik.values.type === "ACTION" && (
            <div className="space-y-3.5 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {/* Searchable Target Module */}
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

                {/* Searchable Triggering Action */}
                <PolarisCombobox
                  id="action"
                  label="Triggering Action"
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
                  onChange={(val) => formik.setFieldValue("action", val)}
                  error={formik.touched.action && formik.errors.action ? (formik.errors.action as string) : undefined}
                />
              </div>
            </div>
          )}
        </PolarisFormCard>

        {/* Card 3: Member Eligibility */}
        <PolarisEligibilityCard
          step={3}
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

        {/* Card 4: Notification Settings */}
        <PolarisFormCard
          step={4}
          title="Notification Settings"
          description="Configure alert channels and custom notification text when members unlock this badge."
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
                    Send an instant push notification to user's device when this badge is achieved.
                  </p>
                </div>
              </div>

              {formik.values.allowPushNotification && (
                <div className="space-y-2.5 pt-2.5 border-t border-[#e1e3e5] dark:border-zinc-800 animate-in fade-in-50 duration-200">
                  <PolarisInput
                    id="pushNotificationTitle"
                    name="pushNotificationTitle"
                    label="Push Notification Title"
                    placeholder="e.g. 🎉 New Badge Unlocked!"
                    value={formik.values.pushNotificationTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <PolarisTextarea
                    id="pushNotificationBody"
                    name="pushNotificationBody"
                    label="Push Notification Message"
                    placeholder="e.g. Congratulations! You've unlocked the {{badgeName}} badge."
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
                          `${formik.values.pushNotificationBody} {{badgeName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.2 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[10.5px]"
                    >
                      {"{{badgeName}}"}
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
                    Send a celebratory email notification when user achieves this badge.
                  </p>
                </div>
              </div>

              {formik.values.allowEmailNotification && (
                <div className="space-y-2.5 pt-2.5 border-t border-[#e1e3e5] dark:border-zinc-800 animate-in fade-in-50 duration-200">
                  <PolarisInput
                    id="emailNotificationSubject"
                    name="emailNotificationSubject"
                    label="Email Subject"
                    placeholder="e.g. You've earned a new badge: {{badgeName}}!"
                    value={formik.values.emailNotificationSubject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <PolarisTextarea
                    id="emailNotificationBody"
                    name="emailNotificationBody"
                    label="Email Message / Content"
                    placeholder="e.g. Great job! You have successfully unlocked the {{badgeName}} badge on our platform."
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
                          `${formik.values.emailNotificationBody} {{badgeName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.2 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#d2d5d9] transition-colors font-mono text-[10.5px]"
                    >
                      {"{{badgeName}}"}
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

      <FloatingSavePanel
        hasChanged={formik.dirty && !!formik.values.name}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title={isEdit ? "Unsaved Changes" : "Unsaved Achievement"}
        description={
          isEdit
            ? "Update this badge in the global directory?"
            : "Deploy this badge to the production community?"
        }
        buttonText={isEdit ? "Update Badge" : "Deploy Badge"}
      />
    </PolarisFormLayout>
  );
}
