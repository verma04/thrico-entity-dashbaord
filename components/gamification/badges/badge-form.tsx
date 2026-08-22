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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
    ],
  },
  {
    name: "Rare & Premium",
    icons: [
      "💎",
      "💠",
      "🔮",
      "💫",
      "💍",
      "⚡",
      "🔥",
      "🌈",
      "🦄",
      "🍭",
      "🔱",
      "⚔️",
    ],
  },
  {
    name: "Growth & Speed",
    icons: ["🚀", "📈", "🆙", "🌱", "🏋️", "💡", "📡", "🛸", "🔋"],
  },
  {
    name: "Social & Community",
    icons: ["🤝", "🌍", "❤️", "🎈", "💬", "📣", "🦋", "🌸", "🍕", "🥂", "🎉"],
  },
];

const badgeSchema = Yup.object().shape({
  name: Yup.string().required("Badge name is required"),
  description: Yup.string().required("Please provide a description"),
  icon: Yup.string().required("Select an icon for the badge"),
  type: Yup.string().oneOf(["ACTION", "POINTS"]).required(),
  module: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) =>
      schema.required("Module is required for action challenges"),
    otherwise: (schema) => schema.optional(),
  }),
  targetValue: Yup.number()
    .required("Target value is required")
    .min(1, "Must be at least 1"),
  action: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) => schema.required("Specify the triggering action"),
    otherwise: (schema) => schema.optional(),
  }),
  allowPushNotification: Yup.boolean().optional(),
  allowEmailNotification: Yup.boolean().optional(),
  pushNotificationTitle: Yup.string().optional(),
  pushNotificationBody: Yup.string().optional(),
  emailNotificationSubject: Yup.string().optional(),
  emailNotificationBody: Yup.string().optional(),
});

interface BadgeFormProps {
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
  initialValues,
  onSubmit,
  loading,
  isEdit,
  modules = [],
  integrations = [],
  triggers = [],
  moduleTriggers = [],
  integrationTriggers = [],
}: BadgeFormProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [iconMode, setIconMode] = useState<"emoji" | "upload">("emoji");
  const [uploadImage, { loading: isUploading }] = useUploadImage();

  const initialSourceType = React.useMemo(() => {
    if (initialValues?.source) return initialValues.source;
    if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) =>
          i.id?.toLowerCase() === initialValues.module?.toLowerCase() ||
          i.uuid?.toLowerCase() === initialValues.module?.toLowerCase() ||
          (i as any).slug?.toLowerCase() === initialValues.module?.toLowerCase(),
      );
      return isIntegration ? "INTEGRATION" : "MODULE";
    }
    return "MODULE";
  }, [initialValues, integrations]);

  const [sourceType, setSourceType] = useState<"MODULE" | "INTEGRATION">(
    initialSourceType,
  );

  React.useEffect(() => {
    if (initialValues?.source) {
      setSourceType(initialValues.source);
    } else if (initialValues?.module) {
      const isIntegration = integrations.some(
        (i) =>
          i.id?.toLowerCase() === initialValues.module?.toLowerCase() ||
          i.uuid?.toLowerCase() === initialValues.module?.toLowerCase() ||
          (i as any).slug?.toLowerCase() === initialValues.module?.toLowerCase(),
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
                <div className="relative h-24 w-24 bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-5xl transition-transform group-hover:scale-105 overflow-hidden">
                  {isIconImage ? (
                    <img src={getPreferredMediaUrl(formik.values.icon)} alt="Icon" className="h-full w-full object-cover" />
                  ) : (
                    formik.values.icon || "⭐"
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-zinc-900 dark:bg-zinc-100 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg text-white dark:text-zinc-900">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {formik.values.name || "Achievement Name"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 px-4 leading-relaxed font-medium">
                  {formik.values.description ||
                    "Design your badge to see how it will appear to members in their profile gallery."}
                </p>
              </div>
              <div className="w-full space-y-2.5 pt-1">
                <PolarisSummaryRow label="Type" value={formik.values.type === "ACTION" ? "Action Cumulative" : "Milestone Threshold"} />
                <PolarisSummaryRow label="Target" value={`${formik.values.targetValue || 0} ${formik.values.type === "ACTION" ? "actions" : "points"}`} />
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
                />
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                </div>
              </div>
            </div>
          </PolarisSidebarCard>

          <PolarisTipCard title="Badge Design Tip">
            Members who meet the criteria after deployment will be automatically awarded. Higher target values create rarer badges — calibrate difficulty for maximum engagement.
          </PolarisTipCard>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Card 1: Identity & Designation */}
        <PolarisFormCard
          step={1}
          title="Identity & Designation"
          description="Give your achievement a name, description, and visual icon."
          badge="Badge Builder"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Achievement Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Master Contributor, Early Adopter"
                  {...formik.getFieldProps("name")}
                  className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does a user need to do to earn this?"
                  {...formik.getFieldProps("description")}
                  className="min-h-[100px] bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none resize-none"
                />
              </div>
            </div>

            <div className="w-full md:w-[300px] space-y-4">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Visual Representation</Label>
              <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="h-20 w-20 mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center text-4xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-90 duration-300 overflow-hidden">
                      {isIconImage ? (
                        <img src={getPreferredMediaUrl(formik.values.icon)} alt="Icon" className="h-full w-full object-cover" />
                      ) : (
                        formik.values.icon || "⭐"
                      )}
                    </div>

                <div className="flex bg-white dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium">
                  <button 
                    type="button" 
                    onClick={() => setIconMode("emoji")} 
                    className={cn("flex-1 py-1 rounded-md transition-all font-semibold", iconMode === "emoji" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs" : "text-zinc-500 dark:text-zinc-400")}
                  >
                    Emoji
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIconMode("upload")} 
                    className={cn("flex-1 py-1 rounded-md transition-all font-semibold", iconMode === "upload" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs" : "text-zinc-500 dark:text-zinc-400")}
                  >
                    Custom Icon
                  </button>
                </div>

                {iconMode === "emoji" ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <Input
                        placeholder="Filter icons..."
                        className="pl-9 h-8 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-2 max-h-[150px] overflow-y-auto pr-1">
                      {ICON_CATEGORIES.flatMap((c) => c.icons).map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => formik.setFieldValue("icon", icon)}
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center text-lg transition-all",
                            formik.values.icon === icon
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md scale-110"
                              : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700",
                          )}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-4 gap-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-center relative h-[150px]">
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
                      <Loader2 className="h-6 w-6 text-zinc-900 dark:text-zinc-100 animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6 text-zinc-400 mb-1" />
                    )}
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Click to upload icon</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">Recommended: 256x256px<br/>Supported: PNG, JPG, SVG</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Award Mechanism</Label>
              <Select
                value={formik.values.type}
                onValueChange={(val) => formik.setFieldValue("type", val)}
                disabled={isEdit}
              >
                <SelectTrigger className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTION">Action Cumulative</SelectItem>
                  <SelectItem value="POINTS">Milestone Threshold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {formik.values.type === "ACTION"
                  ? "Required Count"
                  : "Required Points"}
              </Label>
              <Input
                type="number"
                {...formik.getFieldProps("targetValue")}
                className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none"
                min={1}
              />
            </div>
          </div>

          {formik.values.type === "ACTION" && (
            <div className="space-y-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="module" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {sourceType === "MODULE"
                      ? "Target Module"
                      : "Target Integration"}
                  </Label>
                  <Select
                        value={
                          currentSourceList.find(
                            (item) =>
                              item.id?.toLowerCase() ===
                                formik.values.module?.toLowerCase() ||
                              item.uuid?.toLowerCase() ===
                                formik.values.module?.toLowerCase() ||
                              (item as any).slug?.toLowerCase() ===
                                formik.values.module?.toLowerCase(),
                          )?.id || formik.values.module
                        }
                        onValueChange={(val) => {
                          formik.setFieldValue("module", val);
                          formik.setFieldValue("action", "");
                        }}
                        disabled={isEdit}
                  >
                    <SelectTrigger className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none">
                      <SelectValue
                        placeholder={
                          sourceType === "MODULE"
                            ? "Select a module"
                            : "Select an integration"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSourceList.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.module && formik.errors.module && (
                    <p className="text-[11px] text-red-500 font-medium">
                      {formik.errors.module as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Triggering Action</Label>
                  <Select
                        value={
                          filteredTriggers.find(
                            (t) =>
                              t.id === formik.values.action ||
                              t.name === formik.values.action ||
                              (t.name || t.id) === formik.values.action,
                          )?.name ||
                          filteredTriggers.find(
                            (t) =>
                              t.id === formik.values.action ||
                              t.name === formik.values.action ||
                              (t.name || t.id) === formik.values.action,
                          )?.id ||
                          formik.values.action
                        }
                        onValueChange={(val) =>
                          formik.setFieldValue("action", val)
                        }
                    disabled={!formik.values.module || isEdit}
                  >
                    <SelectTrigger className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none">
                      <SelectValue
                        placeholder={
                          formik.values.module
                            ? "Select trigger event"
                            : `Select ${sourceType === "MODULE" ? "module" : "integration"} first`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTriggers.length === 0 ? (
                        <div className="p-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                          No trigger events found for this{" "}
                          {sourceType === "MODULE" ? "module" : "integration"}
                        </div>
                      ) : (
                        filteredTriggers.map((t, idx) => {
                          const itemVal = t.value || t.name || t.id;
                          return (
                            <SelectItem key={`trig-${itemVal}-${idx}`} value={itemVal}>
                              <div className="flex flex-col py-0.5 text-left">
                                <span className="font-medium text-xs text-zinc-900 dark:text-zinc-100">
                                  {t.name
                                    ? t.name.replace(/_/g, " ")
                                    : t.description || itemVal}
                                </span>
                                {t.description &&
                                  t.name &&
                                  t.description !== t.name && (
                                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                      {t.description}
                                    </span>
                                  )}
                              </div>
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  {formik.touched.action && formik.errors.action && (
                    <p className="text-[11px] text-red-500 font-medium">
                      {formik.errors.action as string}
                    </p>
                  )}
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Push Notification Panel */}
            <div className={cn(
              "rounded-xl border transition-all p-4 space-y-4",
              formik.values.allowPushNotification
                ? "border-zinc-900/40 dark:border-zinc-100/40 bg-zinc-50/50 dark:bg-zinc-800/40"
                : "border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/10 opacity-75"
            )}>
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
                      Allow push notification for user
                    </Label>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Send an instant push notification to user's device when this badge is achieved.
                  </p>
                </div>
              </div>

              {formik.values.allowPushNotification && (
                <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-700/80 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <Label htmlFor="pushNotificationTitle" className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Push Notification Title
                    </Label>
                    <Input
                      id="pushNotificationTitle"
                      placeholder="e.g. 🎉 New Badge Unlocked!"
                      {...formik.getFieldProps("pushNotificationTitle")}
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pushNotificationBody" className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Push Notification Message
                    </Label>
                    <Textarea
                      id="pushNotificationBody"
                      placeholder="e.g. Congratulations! You've unlocked the {{badgeName}} badge."
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
                          `${formik.values.pushNotificationBody} {{badgeName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
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
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Notification Panel */}
            <div className={cn(
              "rounded-xl border transition-all p-4 space-y-4",
              formik.values.allowEmailNotification
                ? "border-zinc-900/40 dark:border-zinc-100/40 bg-zinc-50/50 dark:bg-zinc-800/40"
                : "border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/10 opacity-75"
            )}>
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
                    Send a celebratory email notification when user achieves this badge.
                  </p>
                </div>
              </div>

              {formik.values.allowEmailNotification && (
                <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-700/80 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <Label htmlFor="emailNotificationSubject" className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Email Subject
                    </Label>
                    <Input
                      id="emailNotificationSubject"
                      placeholder="e.g. You've earned a new badge: {{badgeName}}!"
                      {...formik.getFieldProps("emailNotificationSubject")}
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="emailNotificationBody" className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Email Message / Content
                    </Label>
                    <Textarea
                      id="emailNotificationBody"
                      placeholder="e.g. Great job! You have successfully unlocked the {{badgeName}} badge on our platform."
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
                          `${formik.values.emailNotificationBody} {{badgeName}}`.trim(),
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors font-mono"
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
