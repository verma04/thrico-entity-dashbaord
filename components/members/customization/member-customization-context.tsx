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
  LogoAlignment,
} from "./types";
import { CustomizationSkeleton } from "./customization-skeleton";
import { CustomFieldDrawer } from "./custom-field-drawer";
import { CustomizationStartersDrawer } from "./customization-starters-drawer";

export const memberOnboardingValidationSchema = Yup.object().shape({
  logo: Yup.string().optional().nullable(),
  logoAlignment: Yup.string().oneOf(["left", "center", "right"]).optional().nullable(),
  logoSize: Yup.number().optional().nullable(),
  authMethod: Yup.string().optional().nullable(),
  enableEmailLogin: Yup.boolean().optional(),
  enableGoogleLogin: Yup.boolean().optional(),
  referral: Yup.object().shape({
    enabled: Yup.boolean().optional(),
    required: Yup.boolean().optional(),
    helperText: Yup.string().optional().nullable(),
  }).optional().nullable(),
  customFields: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().optional(),
      key: Yup.string().optional().nullable(),
      label: Yup.string().optional().nullable(),
      type: Yup.string().optional().nullable(),
      required: Yup.boolean().optional(),
      placeholder: Yup.string().optional().nullable(),
      helperText: Yup.string().optional().nullable(),
      options: Yup.array().optional().nullable(),
      order: Yup.number().optional().nullable(),
      validationMode: Yup.string().optional().nullable(),
      validationRegex: Yup.string().optional().nullable(),
      validationErrorMessage: Yup.string().optional().nullable(),
      blockIfNotExists: Yup.boolean().optional(),
      preventDuplicate: Yup.boolean().optional(),
    })
  ).optional().nullable(),
  termsAndConditions: Yup.object().shape({
    enabled: Yup.boolean().optional(),
    required: Yup.boolean().optional(),
    checkboxLabel: Yup.string().optional().nullable(),
    linkText: Yup.string().optional().nullable(),
    contentHtml: Yup.string().optional().nullable(),
  }).optional().nullable(),
  authTexts: Yup.object().shape({
    logo: Yup.string().optional().nullable(),
    logoAlignment: Yup.string().oneOf(["left", "center", "right"]).optional().nullable(),
    logoSize: Yup.number().optional().nullable(),
    headerAlignment: Yup.string().oneOf(["left", "center", "right"]).optional().nullable(),
    loginHeaderAlignment: Yup.string().oneOf(["left", "center", "right"]).optional().nullable(),
    signupHeaderAlignment: Yup.string().oneOf(["left", "center", "right"]).optional().nullable(),
    loginHeaderImage: Yup.string().optional().nullable(),
    loginHeaderImagePlacement: Yup.string().oneOf(["above", "inline"]).optional().nullable(),
    loginHeaderImageSize: Yup.number().optional().nullable(),
    signupHeaderImage: Yup.string().optional().nullable(),
    signupHeaderImagePlacement: Yup.string().oneOf(["above", "inline"]).optional().nullable(),
    signupHeaderImageSize: Yup.number().optional().nullable(),
    loginTagline: Yup.string().optional().nullable(),
    loginTitle: Yup.string().optional().nullable(),
    loginDescription: Yup.string().optional().nullable(),
    loginFooterText: Yup.string().optional().nullable(),
    loginFooterLink: Yup.string().optional().nullable(),
    loginButtonText: Yup.string().optional().nullable(),
    signupTagline: Yup.string().optional().nullable(),
    signupTitle: Yup.string().optional().nullable(),
    signupDescription: Yup.string().optional().nullable(),
    signupFooterText: Yup.string().optional().nullable(),
    signupFooterLink: Yup.string().optional().nullable(),
    signupButtonText: Yup.string().optional().nullable(),
  }).optional().nullable(),
});

export interface MemberCustomizationContextType {
  formik: FormikProps<MemberOnboardingConfig>;
  entityName: string;
  entityLogo: string;
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
  handleLogoChange: (logoUrl: string) => void;
  handleLogoAlignmentChange: (alignment: LogoAlignment) => void;
  handleLogoSizeChange: (size: number) => void;
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
  const entityLogo = entityData?.getEntity?.logo || "";

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
        const resolvedLogo = parsed.logo || parsed.authTexts?.logo || "";
        const resolvedAlignment: LogoAlignment =
          parsed.logoAlignment || parsed.authTexts?.logoAlignment || "center";
        const resolvedSize: number =
          typeof parsed.logoSize === "number"
            ? parsed.logoSize
            : typeof parsed.authTexts?.logoSize === "number"
            ? parsed.authTexts.logoSize
            : 40;

        const parsedAuthTexts = parsed.authTexts || {};
        const loginHeaderImage = parsedAuthTexts.loginHeaderImage || "";
        const signupHeaderImage = parsedAuthTexts.signupHeaderImage || "";

        return {
          logo: resolvedLogo,
          logoAlignment: resolvedAlignment,
          logoSize: resolvedSize,
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
            logo: resolvedLogo,
            logoAlignment: resolvedAlignment,
            logoSize: resolvedSize,
            headerAlignment: parsedAuthTexts.headerAlignment || "center",
            loginHeaderAlignment: parsedAuthTexts.loginHeaderAlignment || parsedAuthTexts.headerAlignment || "center",
            signupHeaderAlignment: parsedAuthTexts.signupHeaderAlignment || parsedAuthTexts.headerAlignment || "center",
            loginHeaderImage: loginHeaderImage,
            loginHeaderImagePlacement: parsedAuthTexts.loginHeaderImagePlacement || "above",
            loginHeaderImageSize: typeof parsedAuthTexts.loginHeaderImageSize === "number" ? parsedAuthTexts.loginHeaderImageSize : 40,
            signupHeaderImage: signupHeaderImage,
            signupHeaderImagePlacement: parsedAuthTexts.signupHeaderImagePlacement || "above",
            signupHeaderImageSize: typeof parsedAuthTexts.signupHeaderImageSize === "number" ? parsedAuthTexts.signupHeaderImageSize : 40,
            loginTagline: typeof parsedAuthTexts.loginTagline === "string" ? parsedAuthTexts.loginTagline : (loginHeaderImage ? "" : DEFAULT_AUTH_TEXTS.loginTagline),
            loginTitle: typeof parsedAuthTexts.loginTitle === "string" ? parsedAuthTexts.loginTitle : (loginHeaderImage ? "" : DEFAULT_AUTH_TEXTS.loginTitle),
            loginDescription: typeof parsedAuthTexts.loginDescription === "string" ? parsedAuthTexts.loginDescription : (loginHeaderImage ? "" : DEFAULT_AUTH_TEXTS.loginDescription),
            loginFooterText: typeof parsedAuthTexts.loginFooterText === "string" ? parsedAuthTexts.loginFooterText : DEFAULT_AUTH_TEXTS.loginFooterText,
            loginFooterLink: typeof parsedAuthTexts.loginFooterLink === "string" ? parsedAuthTexts.loginFooterLink : DEFAULT_AUTH_TEXTS.loginFooterLink,
            loginButtonText: typeof parsedAuthTexts.loginButtonText === "string" ? parsedAuthTexts.loginButtonText : DEFAULT_AUTH_TEXTS.loginButtonText,
            signupTagline: typeof parsedAuthTexts.signupTagline === "string" ? parsedAuthTexts.signupTagline : (signupHeaderImage ? "" : DEFAULT_AUTH_TEXTS.signupTagline),
            signupTitle: typeof parsedAuthTexts.signupTitle === "string" ? parsedAuthTexts.signupTitle : (signupHeaderImage ? "" : DEFAULT_AUTH_TEXTS.signupTitle),
            signupDescription: typeof parsedAuthTexts.signupDescription === "string" ? parsedAuthTexts.signupDescription : (signupHeaderImage ? "" : DEFAULT_AUTH_TEXTS.signupDescription),
            signupFooterText: typeof parsedAuthTexts.signupFooterText === "string" ? parsedAuthTexts.signupFooterText : DEFAULT_AUTH_TEXTS.signupFooterText,
            signupFooterLink: typeof parsedAuthTexts.signupFooterLink === "string" ? parsedAuthTexts.signupFooterLink : DEFAULT_AUTH_TEXTS.signupFooterLink,
            signupButtonText: typeof parsedAuthTexts.signupButtonText === "string" ? parsedAuthTexts.signupButtonText : DEFAULT_AUTH_TEXTS.signupButtonText,
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

  const handleLogoChange = (logoUrl: string) => {
    formik.setFieldValue("logo", logoUrl);
    formik.setFieldValue("authTexts", {
      ...formik.values.authTexts,
      logo: logoUrl,
    });
  };

  const handleLogoAlignmentChange = (alignment: LogoAlignment) => {
    formik.setFieldValue("logoAlignment", alignment);
    formik.setFieldValue("authTexts", {
      ...formik.values.authTexts,
      logoAlignment: alignment,
    });
  };

  const handleLogoSizeChange = (size: number) => {
    formik.setFieldValue("logoSize", size);
    formik.setFieldValue("authTexts", {
      ...formik.values.authTexts,
      logoSize: size,
    });
  };

  if ((settingsLoading || entityLoading) && !settingsData) {
    return <CustomizationSkeleton />;
  }

  const contextValue: MemberCustomizationContextType = {
    formik,
    entityName,
    entityLogo,
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
    handleLogoChange,
    handleLogoAlignmentChange,
    handleLogoSizeChange,
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
