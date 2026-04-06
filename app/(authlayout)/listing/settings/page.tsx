"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { ClipboardList, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowListing",
    label: "Allow Listings",
    description: "Enable or disable the ability for members to create new directory listings.",
    icon: ShieldCheck,
    section: "Directory Protocols",
  },
  {
    key: "autoApproveListing",
    label: "Auto Approve Listings",
    description: "Automatically validate and publish new listings without manual review.",
    icon: Zap,
    section: "Automation Protocols",
  },
];

const ListingSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Listing settings updated successfully");
    } catch (error) {
      toast.error("Failed to update listing configuration");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Directory Management"
      description="Moderate directory infrastructure and configure automated validation workflows."
      headerIcon={ClipboardList}
      badge="Directory"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default ListingSettings;
