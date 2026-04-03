"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { ShieldCheck, Zap, Settings2 } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowCommunity",
    label: "Allow Community Creation",
    description: "When enabled, eligible members can initiate new community nodes.",
    icon: ShieldCheck,
    section: "Creation & Governance",
  },
  {
    key: "autoApproveCommunity",
    label: "Auto Approve Communities",
    description: "New communities will be live instantly without manual review requirements.",
    icon: Zap,
    section: "Automation Engines",
  },
  {
    key: "autoApproveGroup",
    label: "Auto Approve Groups",
    description: "Enable automatic validation for sub-group units.",
    icon: Zap,
    section: "Automation Engines",
  },
];

const Settings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Community Protocols"
      description="Configure the governance and automation frameworks for your community network."
      headerIcon={Settings2}
      badge="Enterprise"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default Settings;


