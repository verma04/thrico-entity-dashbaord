"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { BarChart2, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowPolls",
    label: "Allow Poll Creation",
    description: "Enable or disable the ability for members to create new polling modules.",
    icon: ShieldCheck,
    section: "Engagement Controls",
  },
  {
    key: "autoApprovePolls",
    label: "Auto Approve Polls",
    description: "Automatically validate and publish new polls without review.",
    icon: Zap,
    section: "Automation Protocols",
  },
];

const PollsSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Polls settings updated successfully");
    } catch (error) {
      toast.error("Failed to update polls configuration");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Opinion Framework"
      description="Configure public sentiment gathering and automated polling workflows."
      headerIcon={BarChart2}
      badge="Sentiment"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default PollsSettings;
