"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { GraduationCap, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowMentorship",
    label: "Allow Mentorship",
    description: "Enable or disable the peer-to-peer learning network.",
    icon: ShieldCheck,
    section: "Network Governance",
  },
  {
    key: "autoApproveMentorship",
    label: "Auto Approve Mentors",
    description: "Automatically validate mentor applications without manual review.",
    icon: Zap,
    section: "Automation Protocols",
  },
];

const MentorshipSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Mentorship settings updated successfully");
    } catch (error) {
      toast.error("Failed to update mentorship configuration");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Mentorship Network"
      description="Configure peer-to-peer learning ecosystems and automated mentor validation."
      headerIcon={GraduationCap}
      badge="Learning"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default MentorshipSettings;
