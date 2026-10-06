"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEntitySettings, useUpdateEntitySettings, useGetEntity } from "@/graphql/actions";
import {
  PolarisFormLayout,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthProtocolCard } from "./auth-protocol-card";
import { ReferralConfigCard } from "./referral-config-card";
import { CustomFieldsBuilder } from "./custom-fields-builder";
import { LiveSignupPreview } from "./live-signup-preview";
import { MemberCustomizationKpis } from "./member-customization-kpi";
import { CustomFieldDrawer } from "./custom-field-drawer";
import { CustomizationStartersDrawer } from "./customization-starters-drawer";
import { AuthTextCard } from "./auth-text-card";
import {
  MemberOnboardingConfig,
  DEFAULT_ONBOARDING_CONFIG,
  DEFAULT_AUTH_TEXTS,
  AuthMethod,
  CustomFieldItem,
} from "./types";
import { CustomizationSkeleton } from "./customization-skeleton";
import { toast } from "sonner";
import {
  ShieldCheck,
  Gift,
  Layers,
  Sparkles,
  RotateCcw,
  Plus,
  Eye,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Yup Validation Schema for Member Onboarding Configuration
const memberOnboardingValidationSchema = Yup.object().shape({
  authMethod: Yup.string()
    .oneOf(["BOTH", "EMAIL_ONLY", "GOOGLE_ONLY"], "Invalid authentication method")
    .required("Authentication method is required"),
  enableEmailLogin: Yup.boolean().default(true),
  enableGoogleLogin: Yup.boolean().default(true),
  referral: Yup.object().shape({
    enabled: Yup.boolean().required(),
    required: Yup.boolean().required(),
    helperText: Yup.string().optional(),
  }),
  customFields: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        key: Yup.string().required("Field key is required"),
        label: Yup.string().required("Field label is required"),
        type: Yup.string().required("Field type is required"),
        required: Yup.boolean().required(),
        placeholder: Yup.string().optional(),
        helperText: Yup.string().optional(),
        options: Yup.array().of(Yup.string()).optional(),
        order: Yup.number().optional(),
        validationMode: Yup.string().optional(),
        validationRegex: Yup.string().optional(),
        validationErrorMessage: Yup.string().optional(),
        blockIfNotExists: Yup.boolean().optional(),
        preventDuplicate: Yup.boolean().optional(),
      })
    )
    .default([]),
  authTexts: Yup.object().shape({
    loginTagline: Yup.string().optional(),
    loginTitle: Yup.string().optional(),
    loginDescription: Yup.string().optional(),
    loginFooterText: Yup.string().optional(),
    loginFooterLink: Yup.string().optional(),
    loginButtonText: Yup.string().optional(),
    signupTagline: Yup.string().optional(),
    signupTitle: Yup.string().optional(),
    signupDescription: Yup.string().optional(),
    signupFooterText: Yup.string().optional(),
    signupFooterLink: Yup.string().optional(),
    signupButtonText: Yup.string().optional(),
  }).optional(),
});

interface FormProps {
  initialConfig: MemberOnboardingConfig;
  entityName: string;
  isSaving: boolean;
  onSave: (config: MemberOnboardingConfig) => Promise<void>;
  onRefresh?: () => void;
}

function MemberCustomizationForm({
  initialConfig,
  entityName,
  isSaving,
  onSave,
  onRefresh,
}: FormProps) {
  const [activeTab, setActiveTab] = useState<"fields" | "auth" | "text" | "referral" | "preview">("fields");
  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startersDrawerOpen, setStartersDrawerOpen] = useState(false);
  const [addFieldDrawerOpen, setAddFieldDrawerOpen] = useState(false);

  // Initialize Formik with Yup validation
  const formik = useFormik<MemberOnboardingConfig>({
    initialValues: initialConfig,
    validationSchema: memberOnboardingValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload: MemberOnboardingConfig = {
          ...values,
          enableEmailLogin: values.authMethod === "BOTH" || values.authMethod === "EMAIL_ONLY",
          enableGoogleLogin: values.authMethod === "BOTH" || values.authMethod === "GOOGLE_ONLY",
        };
        await onSave(payload);
        resetForm({ values: payload });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Auth Method changes
  const handleAuthMethodChange = (authMethod: AuthMethod) => {
    formik.setFieldValue("authMethod", authMethod);
    formik.setFieldValue("enableEmailLogin", authMethod === "BOTH" || authMethod === "EMAIL_ONLY");
    formik.setFieldValue("enableGoogleLogin", authMethod === "BOTH" || authMethod === "GOOGLE_ONLY");
  };

  // Handle Referral config updates
  const handleReferralUpdate = (updates: {
    enabled?: boolean;
    required?: boolean;
    helperText?: string;
  }) => {
    formik.setFieldValue("referral", {
      ...formik.values.referral,
      ...updates,
    });
  };

  // Handle Custom Fields updates
  const handleCustomFieldsChange = (customFields: CustomFieldItem[]) => {
    formik.setFieldValue("customFields", customFields);
  };

  // Handle Recipe from Starters Drawer
  const handleSelectRecipe = (recipeField: Omit<CustomFieldItem, "id" | "order">) => {
    const newField: CustomFieldItem = {
      ...recipeField,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order: formik.values.customFields.length,
    };
    handleCustomFieldsChange([...formik.values.customFields, newField]);
    toast.success(`Recipe "${recipeField.label}" added to registration fields.`);
  };

  // Discard changes
  const handleReset = () => {
    formik.resetForm();
    toast.info("Changes reverted to server state.");
  };

  // Manual Refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) onRefresh();
      toast.success("Member onboarding settings reloaded.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <div className="w-full pb-20 space-y-6">
      {/* ── Sub-header Action Bar (UTM EcosystemHeader Actions Style) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Registration & Gatekeeping Protocols
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure member sign-in methods, CSV whitelist rosters, regex patterns, and referral loops.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-all"
            title="Reload Settings"
          >
            <RotateCcw size={13} className={cn(isRefreshing && "animate-spin")} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setStartersDrawerOpen(true)}
            className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Preset Recipes</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setAddFieldDrawerOpen(true)}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Field</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Summary Cards (UTM UtmKpiSummary Style) ── */}
      <MemberCustomizationKpis config={formik.values} />

      {/* ── Sub-Nav Tabs Strip (UTM CampaignNavTab Style) ── */}
      <div className="border-b border-border/60 bg-muted/20 px-2 sm:px-4 py-1.5 rounded-xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
        {/* Tab 1: Custom Registration Fields */}
        <button
          type="button"
          onClick={() => setActiveTab("fields")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            activeTab === "fields"
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>Custom Registration Inputs</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5"
          >
            {formik.values.customFields.length}
          </Badge>
        </button>

        {/* Tab 2: Authentication & SSO */}
        <button
          type="button"
          onClick={() => setActiveTab("auth")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            activeTab === "auth"
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Authentication & SSO</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            {formik.values.authMethod === "BOTH"
              ? "Email & Google"
              : formik.values.authMethod === "EMAIL_ONLY"
              ? "Email"
              : "Google"}
          </Badge>
        </button>

        {/* Tab 2.5: Auth Page Text */}
        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            activeTab === "text"
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Type className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Login / Signup Text</span>
        </button>

        {/* Tab 3: Referral & Invites */}
        <button
          type="button"
          onClick={() => setActiveTab("referral")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            activeTab === "referral"
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Gift className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Referral & Invites</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            {!formik.values.referral.enabled
              ? "Off"
              : formik.values.referral.required
              ? "Mandatory"
              : "Optional"}
          </Badge>
        </button>

        {/* Tab 4: Live Onboarding Simulator */}
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            activeTab === "preview"
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Live Onboarding Preview</span>
        </button>
      </div>

      {/* ── Active Tab Content ── */}
      {activeTab === "fields" && (
        <div className="space-y-4">
          <CustomFieldsBuilder
            fields={formik.values.customFields}
            onChange={handleCustomFieldsChange}
          />
        </div>
      )}

      {activeTab === "auth" && (
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              <LiveSignupPreview config={formik.values} entityName={entityName} />
              <PolarisTipCard title="Authentication Best Practice">
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <p>
                    • <strong>Dual Auth (Email + Google):</strong> Offering both Google SSO and Email OTP typically yields up to <strong>35% higher signup completion rates</strong>.
                  </p>
                  <p>
                    • <strong>Workspace Gating:</strong> Organizations targeting corporate teams can restrict authentication to Google SSO with domain-matched accounts.
                  </p>
                </div>
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-4">
            <AuthProtocolCard
              authMethod={formik.values.authMethod}
              onChange={handleAuthMethodChange}
            />
          </div>
        </PolarisFormLayout>
      )}

      {activeTab === "text" && (
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              <LiveSignupPreview config={formik.values} entityName={entityName} />
              <PolarisTipCard title="Copywriting & Brand Voice">
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <p>
                    • <strong>Distinct Identity:</strong> Customize your login and signup headers to match your community tone and brand.
                  </p>
                  <p>
                    • <strong>Clear Value Proposition:</strong> Keep descriptions concise so new visitors immediately understand the community value.
                  </p>
                </div>
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-4">
            <AuthTextCard
              authTexts={formik.values.authTexts}
              onChange={(updates) =>
                formik.setFieldValue("authTexts", {
                  ...formik.values.authTexts,
                  ...updates,
                })
              }
            />
          </div>
        </PolarisFormLayout>
      )}

      {activeTab === "referral" && (
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              <LiveSignupPreview config={formik.values} entityName={entityName} />
              <PolarisTipCard title="Viral Growth Strategy">
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <p>
                    • <strong>Optional Referrals:</strong> Leaving referral codes optional maximizes top-of-funnel conversion while still rewarding organic word-of-mouth invites.
                  </p>
                  <p>
                    • <strong>Mandatory Referrals:</strong> Use mandatory mode for invite-only alpha communities or exclusive cohort access.
                  </p>
                </div>
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-4">
            <ReferralConfigCard
              enabled={formik.values.referral.enabled}
              required={formik.values.referral.required}
              helperText={formik.values.referral.helperText}
              onUpdate={handleReferralUpdate}
            />
          </div>
        </PolarisFormLayout>
      )}

      {activeTab === "preview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Live Member Simulator
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This simulator mirrors the exact interactive registration dialog presented to members visiting your community on web and mobile. Test inputs, validation errors, and custom fields in real time.
              </p>
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-border/50">
                <div className="flex justify-between">
                  <span>Authentication Mode:</span>
                  <strong className="text-foreground">{formik.values.authMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Custom Inputs:</span>
                  <strong className="text-foreground">{formik.values.customFields.length} configured</strong>
                </div>
                <div className="flex justify-between">
                  <span>Referrals:</span>
                  <strong className="text-foreground">
                    {formik.values.referral.enabled ? "Active" : "Disabled"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md">
              <LiveSignupPreview config={formik.values} entityName={entityName} />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Panel using Formik dirty state and actions */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={isSaved}
        isSaving={isSaving || formik.isSubmitting}
        onSave={() => formik.handleSubmit()}
        onReset={handleReset}
        saveButtonText="Save Changes"
        discardButtonText="Discard"
      />

      {/* Add Custom Field Drawer (from top header action button) */}
      <CustomFieldDrawer
        open={addFieldDrawerOpen}
        onOpenChange={setAddFieldDrawerOpen}
        fieldToEdit={null}
        onSave={(newField) => {
          handleCustomFieldsChange([
            ...formik.values.customFields,
            { ...newField, order: formik.values.customFields.length },
          ]);
          toast.success(`Field "${newField.label}" added.`);
        }}
      />

      {/* Starter Presets Drawer (from top header action button) */}
      <CustomizationStartersDrawer
        open={startersDrawerOpen}
        onOpenChange={setStartersDrawerOpen}
        onSelectRecipe={handleSelectRecipe}
      />
    </div>
  );
}

export default function MemberCustomizationSettings() {
  const { data: entityData, loading: entityLoading } = useGetEntity();
  const { data: settingsData, loading: settingsLoading, refetch } = useEntitySettings();
  const [updateSettings, { loading: isSaving }] = useUpdateEntitySettings({});

  const entityName = entityData?.getEntity?.name || "Your Community";

  // Parse server config or default
  const serverConfig = useMemo<MemberOnboardingConfig>(() => {
    const raw = settingsData?.getEntitySettings?.memberOnboardingConfig;
    if (raw) {
      try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
          authMethod: parsed.authMethod || "BOTH",
          enableGoogleLogin: parsed.enableGoogleLogin ?? true,
          enableEmailLogin: parsed.enableEmailLogin ?? true,
          referral: {
            enabled: parsed.referral?.enabled ?? true,
            required: parsed.referral?.required ?? false,
            helperText: parsed.referral?.helperText || "Have a referral code?",
          },
          customFields: Array.isArray(parsed.customFields) ? parsed.customFields : [],
          authTexts: {
            loginTagline: parsed.authTexts?.loginTagline || DEFAULT_AUTH_TEXTS.loginTagline,
            loginTitle: parsed.authTexts?.loginTitle || DEFAULT_AUTH_TEXTS.loginTitle,
            loginDescription: parsed.authTexts?.loginDescription || DEFAULT_AUTH_TEXTS.loginDescription,
            loginFooterText: parsed.authTexts?.loginFooterText || DEFAULT_AUTH_TEXTS.loginFooterText,
            loginFooterLink: parsed.authTexts?.loginFooterLink || DEFAULT_AUTH_TEXTS.loginFooterLink,
            loginButtonText: parsed.authTexts?.loginButtonText || DEFAULT_AUTH_TEXTS.loginButtonText,
            signupTagline: parsed.authTexts?.signupTagline || DEFAULT_AUTH_TEXTS.signupTagline,
            signupTitle: parsed.authTexts?.signupTitle || DEFAULT_AUTH_TEXTS.signupTitle,
            signupDescription: parsed.authTexts?.signupDescription || DEFAULT_AUTH_TEXTS.signupDescription,
            signupFooterText: parsed.authTexts?.signupFooterText || DEFAULT_AUTH_TEXTS.signupFooterText,
            signupFooterLink: parsed.authTexts?.signupFooterLink || DEFAULT_AUTH_TEXTS.signupFooterLink,
            signupButtonText: parsed.authTexts?.signupButtonText || DEFAULT_AUTH_TEXTS.signupButtonText,
          },
        };
      } catch {
        return DEFAULT_ONBOARDING_CONFIG;
      }
    }
    return DEFAULT_ONBOARDING_CONFIG;
  }, [settingsData]);

  // Compute a stable key from server config to reset form when server data updates
  const formKey = useMemo(() => {
    return JSON.stringify(serverConfig);
  }, [serverConfig]);

  const handleSave = async (configToSave: MemberOnboardingConfig) => {
    try {
      await updateSettings({
        variables: {
          input: {
            memberOnboardingConfig: configToSave,
          },
        },
      });
      toast.success("Member onboarding & customization saved successfully!");
      refetch?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save member customization settings.";
      toast.error(message);
    }
  };

  if ((settingsLoading || entityLoading) && !settingsData) {
    return <CustomizationSkeleton />;
  }

  return (
    <MemberCustomizationForm
      key={formKey}
      initialConfig={serverConfig}
      entityName={entityName}
      isSaving={isSaving}
      onSave={handleSave}
      onRefresh={refetch}
    />
  );
}
