"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { FileText, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowSurveys",
    label: "Allow Surveys",
    description: "Enable or disable the module for comprehensive data gathering.",
    icon: ShieldCheck,
    section: "Research Governance",
  },
  {
    key: "autoApproveSurveys",
    label: "Auto Approve Surveys",
    description: "Automatically validate and publish research modules without review.",
    icon: Zap,
    section: "Automation Protocols",
  },
];

const SurveysSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Surveys settings updated successfully");
    } catch (error) {
      toast.error("Failed to update survey configuration");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Data Protocols"
      description="Moderate research-grade surveys and configure automated validation workflows."
      headerIcon={FileText}
      badge="Research"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(SurveysSettings, "SURVEYS", "canEdit"),
  "surveys"
);
