"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Briefcase, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

const getFields = (singularName: string, moduleName: string): SettingsField[] => [
  {
    key: "allowJobs",
    label: `Allow ${moduleName} Posting`,
    description: `Enable or disable the ability for members to post new ${singularName.toLowerCase()} opportunities.`,
    icon: ShieldCheck,
    section: "Marketplace Governance",
  },
  {
    key: "autoApproveJobs",
    label: `Auto Approve ${moduleName}`,
    description: `Automatically validate and publish ${singularName.toLowerCase()} listings without manual review.`,
    icon: Zap,
    section: "Automation Engines",
  },
];

const JobsSettings = () => {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);
  const FIELDS = getFields(singularName, moduleName);

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
      title="Career Marketplace"
      description="Configure employment protocols and automated hiring workflows for your workspace."
      headerIcon={Briefcase}
      badge="Career"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default withModulePermission(
  JobsSettings,
  "JOBS",
  "canRead"
);
