"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Briefcase, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowJobs",
    label: "Allow Job Posting",
    description: "Enable or disable the ability for members to post new job opportunities.",
    icon: ShieldCheck,
    section: "Marketplace Governance",
  },
  {
    key: "autoApproveJobs",
    label: "Auto Approve Jobs",
    description: "Automatically validate and publish job listings without manual review.",
    icon: Zap,
    section: "Automation Engines",
  },
];

const JobsSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Jobs settings updated successfully");
    } catch (error) {
      toast.error("Failed to update jobs configuration");
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

export default JobsSettings;
