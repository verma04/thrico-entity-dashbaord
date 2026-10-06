"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useFormik, FormikProvider, FormikProps } from "formik";
import * as Yup from "yup";
import { useEntitySettings, useUpdateEntitySettings, useGetEntity } from "@/graphql/actions";
import { toast } from "sonner";
import {
  MemberOnboardingConfig,
  DEFAULT_ONBOARDING_CONFIG,
  DEFAULT_AUTH_TEXTS,
  DEFAULT_TERMS_CONFIG,
  TermsAndConditionsConfig,
  AuthMethod,
  CustomFieldItem,
} from "./types";
import { CustomizationSkeleton } from "./customization-skeleton";
import { CustomFieldDrawer } from "./custom-field-drawer";
import { CustomizationStartersDrawer } from "./customization-starters-drawer";

export const memberOnboardingValidationSchema = Yup.object().shape({
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
  termsAndConditions: Yup.object().shape({
    enabled: Yup.boolean().required(),
    required: Yup.boolean().required(),
    checkboxLabel: Yup.string().optional(),
    linkText: Yup.string().optional(),
    contentHtml: Yup.string().optional(),
  }).optional(),
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

export interface MemberCustomizationContextType {
  formik: FormikProps<MemberOnboardingConfig>;
  entityName: string;
  isSaving: boolean;
  isSaved: boolean;
  isRefreshing: boolean;
  handleManualRefresh: () => Promise<void>;
  handleReset: () => void;
  startersDrawerOpen: boolean;
  setStartersDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addFieldDrawerOpen: boolean;
  setAddFieldDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAuthMethodChange: (authMethod: AuthMethod) => void;
  handleReferralUpdate: (updates: {
    enabled?: boolean;
    required?: boolean;
    helperText?: string;
  }) => void;
  handleCustomFieldsChange: (customFields: CustomFieldItem[]) => void;
  handleSelectRecipe: (recipeField: Omit<CustomFieldItem, "id" | "order">) => void;
  handleTermsUpdate: (updates: Partial<TermsAndConditionsConfig>) => void;
}

const MemberCustomizationContext = createContext<MemberCustomizationContextType | null>(null);

export function useMemberCustomization(): MemberCustomizationContextType {
  const context = useContext(MemberCustomizationContext);
  if (!context) {
    throw new Error(
      "useMemberCustomization must be used within a MemberCustomizationProvider"
    );
  }
  return context;
}

interface MemberCustomizationProviderProps {
  children: ReactNode;
}

export function MemberCustomizationProvider({ children }: MemberCustomizationProviderProps) {
  const { data: entityData, loading: entityLoading } = useGetEntity();
  const { data: settingsData, loading: settingsLoading, refetch } = useEntitySettings();
  const [updateSettings, { loading: isSaving }] = useUpdateEntitySettings({});

  const entityName = entityData?.getEntity?.name || "Your Community";

  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startersDrawerOpen, setStartersDrawerOpen] = useState(false);
  const [addFieldDrawerOpen, setAddFieldDrawerOpen] = useState(false);

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
          termsAndConditions: {
            enabled: parsed.termsAndConditions?.enabled ?? DEFAULT_TERMS_CONFIG.enabled,
            required: parsed.termsAndConditions?.required ?? DEFAULT_TERMS_CONFIG.required,
            checkboxLabel: parsed.termsAndConditions?.checkboxLabel || DEFAULT_TERMS_CONFIG.checkboxLabel,
            linkText: parsed.termsAndConditions?.linkText || DEFAULT_TERMS_CONFIG.linkText,
            contentHtml: parsed.termsAndConditions?.contentHtml || DEFAULT_TERMS_CONFIG.contentHtml,
          },
        };
      } catch {
        return DEFAULT_ONBOARDING_CONFIG;
      }
    }
    return DEFAULT_ONBOARDING_CONFIG;
  }, [settingsData]);

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

  const formik = useFormik<MemberOnboardingConfig>({
    initialValues: serverConfig,
    validationSchema: memberOnboardingValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload: MemberOnboardingConfig = {
          ...values,
          enableEmailLogin: values.authMethod === "BOTH" || values.authMethod === "EMAIL_ONLY",
          enableGoogleLogin: values.authMethod === "BOTH" || values.authMethod === "GOOGLE_ONLY",
        };
        await handleSave(payload);
        resetForm({ values: payload });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAuthMethodChange = (authMethod: AuthMethod) => {
    formik.setFieldValue("authMethod", authMethod);
    formik.setFieldValue("enableEmailLogin", authMethod === "BOTH" || authMethod === "EMAIL_ONLY");
    formik.setFieldValue("enableGoogleLogin", authMethod === "BOTH" || authMethod === "GOOGLE_ONLY");
  };

  const handleTermsUpdate = (updates: Partial<TermsAndConditionsConfig>) => {
    formik.setFieldValue("termsAndConditions", {
      ...formik.values.termsAndConditions,
      ...updates,
    });
  };

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

  const handleCustomFieldsChange = (customFields: CustomFieldItem[]) => {
    formik.setFieldValue("customFields", customFields);
  };

  const handleSelectRecipe = (recipeField: Omit<CustomFieldItem, "id" | "order">) => {
    const newField: CustomFieldItem = {
      ...recipeField,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order: formik.values.customFields.length,
    };
    handleCustomFieldsChange([...formik.values.customFields, newField]);
    toast.success(`Recipe "${recipeField.label}" added to registration fields.`);
  };

  const handleReset = () => {
    formik.resetForm();
    toast.info("Changes reverted to server state.");
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) await refetch();
      toast.success("Member onboarding settings reloaded.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  if ((settingsLoading || entityLoading) && !settingsData) {
    return <CustomizationSkeleton />;
  }

  const contextValue: MemberCustomizationContextType = {
    formik,
    entityName,
    isSaving,
    isSaved,
    isRefreshing,
    handleManualRefresh,
    handleReset,
    startersDrawerOpen,
    setStartersDrawerOpen,
    addFieldDrawerOpen,
    setAddFieldDrawerOpen,
    handleAuthMethodChange,
    handleReferralUpdate,
    handleCustomFieldsChange,
    handleSelectRecipe,
    handleTermsUpdate,
  };

  return (
    <MemberCustomizationContext.Provider value={contextValue}>
      <FormikProvider value={formik}>
        {children}

        {/* Add Custom Field Drawer (available globally in customization) */}
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

        {/* Starter Presets Drawer (available globally in customization) */}
        <CustomizationStartersDrawer
          open={startersDrawerOpen}
          onOpenChange={setStartersDrawerOpen}
          onSelectRecipe={handleSelectRecipe}
        />
      </FormikProvider>
    </MemberCustomizationContext.Provider>
  );
}
