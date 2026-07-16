"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Share2, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowStories",
    label: "Allow Stories",
    description: "Enable or disable the ability to create new stories within the ecosystem.",
    icon: ShieldCheck,
    section: "Creation Protocol",
  },
  {
    key: "autoApproveStories",
    label: "Auto Approve Stories",
    description: "Automatically validate and publish new story nodes in real-time without manual review.",
    icon: Zap,
    section: "Automation Protocol",
  },
];

const StoriesSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: { input: settings },
      });
      toast.success("Stories protocols synchronized successfully.");
    } catch (error) {
      toast.error("Failed to update registry parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Stories Protocol"
      description="Configure story instantiation parameters and automated validation workflows."
      headerIcon={Share2}
      badge="Media"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default StoriesSettings;
