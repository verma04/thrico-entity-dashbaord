"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { FileText, ShieldCheck, Zap } from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

const SurveysSettings = () => {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  const FIELDS: SettingsField[] = [
    {
      key: "allowSurveys",
      label: `Allow ${moduleName}`,
      description:
        "Enable or disable the module for comprehensive data gathering.",
      icon: ShieldCheck,
      section: "Research Governance",
    },
    {
      key: "autoApproveSurveys",
      label: `Auto Approve ${moduleName}`,
      description: `Automatically validate and publish research ${singularName.toLowerCase()} without review.`,
      icon: Zap,
      section: "Automation Protocols",
    },
  ];

  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success(`${moduleName} settings updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${moduleName.toLowerCase()} configuration`);
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
  "surveys",
);
