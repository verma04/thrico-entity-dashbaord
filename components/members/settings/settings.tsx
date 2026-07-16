"use client";

import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Users, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "autoApproveUser",
    label: "Auto Approve New Users",
    description: "Automatically approve new user registrations without manual intervention.",
    icon: Zap,
    section: "Registration Protocol",
  },
  {
    key: "allowNewUser",
    label: "Allow New User Registration",
    description: "Temporarily pause or resume the onboarding of new ecosystem participants.",
    icon: ShieldCheck,
    section: "Registration Protocol",
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
      toast.success("Member protocols synchronized successfully.");
    } catch (error) {
      toast.error("Failed to update registry parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Member Protocols"
      description="Configure the foundational access and registration parameters for your community members."
      headerIcon={Users}
      badge="Identity"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default Settings;

