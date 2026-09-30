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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuthProtocolCard } from "./auth-protocol-card";
import { ReferralConfigCard } from "./referral-config-card";
import { CustomFieldsBuilder } from "./custom-fields-builder";
import { LiveSignupPreview } from "./live-signup-preview";
import {
  MemberOnboardingConfig,
  DEFAULT_ONBOARDING_CONFIG,
  AuthMethod,
  CustomFieldItem,
} from "./types";
import { CustomizationSkeleton } from "./customization-skeleton";
import { toast } from "sonner";
import { ShieldCheck, Gift, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      })
    )
    .default([]),
});

interface FormProps {
  initialConfig: MemberOnboardingConfig;
  entityName: string;
  isSaving: boolean;
  onSave: (config: MemberOnboardingConfig) => Promise<void>;
}

function MemberCustomizationForm({
  initialConfig,
  entityName,
  isSaving,
  onSave,
}: FormProps) {
  const [activeTab, setActiveTab] = useState("auth");
  const [isSaved, setIsSaved] = useState(false);

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

  // Discard changes
  const handleReset = () => {
    formik.resetForm();
    toast.info("Changes reverted to server state.");
  };

  return (
    <div className="w-full pb-20">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Interactive Preview - reactive to formik.values */}
            <LiveSignupPreview config={formik.values} entityName={entityName} />

            {/* Conversion & Best Practice Tip Card */}
            <PolarisTipCard title="Onboarding Best Practices">
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <p>
                  • <strong>Dual Auth (Email + Google):</strong> Communities offering both Google SSO and Email OTP enjoy up to <strong>35% higher signup completion rates</strong>.
                </p>
                <p>
                  • <strong>Keep Required Fields Minimal:</strong> Each mandatory field can decrease conversion by 5–10%. Only mark fields as required if strictly necessary for compliance or vetting.
                </p>
                <p>
                  • <strong>Referrals:</strong> Making referral codes optional encourages organic invites while still allowing non-referred visitors to join seamlessly.
                </p>
              </div>
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Sub-tabs for Customization Sections */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full space-y-4"
          >
            <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 h-auto p-1.5 bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-xl gap-1.5 shadow-2xs">
              {/* Tab 1: Authentication & Login */}
              <TabsTrigger
                value="auth"
                className="py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">Authentication & Login</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal px-1.5 py-0 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shrink-0 hidden md:inline-flex"
                >
                  {formik.values.authMethod === "BOTH"
                    ? "Email & Google"
                    : formik.values.authMethod === "EMAIL_ONLY"
                    ? "Email"
                    : "Google"}
                </Badge>
              </TabsTrigger>

              {/* Tab 2: Referral & Invitation */}
              <TabsTrigger
                value="referral"
                className="py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate">Referral & Invites</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal px-1.5 py-0 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shrink-0 hidden md:inline-flex"
                >
                  {!formik.values.referral.enabled
                    ? "Off"
                    : formik.values.referral.required
                    ? "Mandatory"
                    : "Optional"}
                </Badge>
              </TabsTrigger>

              {/* Tab 3: Custom Registration Fields */}
              <TabsTrigger
                value="fields"
                className="py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="truncate">Custom Inputs</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal px-1.5 py-0 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shrink-0 hidden md:inline-flex"
                >
                  {formik.values.customFields.length}{" "}
                  {formik.values.customFields.length === 1 ? "Field" : "Fields"}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 Content: Authentication Protocol */}
            <TabsContent value="auth" className="mt-0 focus-visible:outline-hidden space-y-4">
              <AuthProtocolCard
                authMethod={formik.values.authMethod}
                onChange={handleAuthMethodChange}
              />
            </TabsContent>

            {/* Tab 2 Content: Referral & Invitation Protocol */}
            <TabsContent value="referral" className="mt-0 focus-visible:outline-hidden space-y-4">
              <ReferralConfigCard
                enabled={formik.values.referral.enabled}
                required={formik.values.referral.required}
                helperText={formik.values.referral.helperText}
                onUpdate={handleReferralUpdate}
              />
            </TabsContent>

            {/* Tab 3 Content: Custom Registration Fields */}
            <TabsContent value="fields" className="mt-0 focus-visible:outline-hidden space-y-4">
              <CustomFieldsBuilder
                fields={formik.values.customFields}
                onChange={handleCustomFieldsChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PolarisFormLayout>

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
    />
  );
}
