"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Percent, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowOffers",
    label: "Allow Offer Creation",
    description: "Enable or disable the ability for members to create new perks and offers.",
    icon: ShieldCheck,
    section: "Marketplace Governance",
  },
  {
    key: "autoApproveOffers",
    label: "Auto Approve Offers",
    description: "Automatically validate and publish new offer listings without manual review.",
    icon: Zap,
    section: "Automation Protocols",
  },
];

const OffersSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Offers settings updated successfully");
    } catch (error) {
      toast.error("Failed to update offers configuration");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Benefit Ecosystem"
      description="Configure perks, discounts, and automated incentive delivery workflows."
      headerIcon={Percent}
      badge="Perks"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default OffersSettings;
