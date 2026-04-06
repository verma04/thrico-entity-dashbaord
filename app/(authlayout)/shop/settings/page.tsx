"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { ShoppingBag, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowShop",
    label: "Allow Product Listings",
    description: "Enable or disable the module for listing and selling products.",
    icon: ShieldCheck,
    section: "Marketplace Governance",
  },
  {
    key: "autoApproveShop",
    label: "Auto Approve Products",
    description: "New product listings will be live instantly without manual review.",
    icon: Zap,
    section: "Automation Protocols",
  },
];

const ShopSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Shop settings updated successfully");
    } catch (error) {
      toast.error("Failed to update shop configuration");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Commerce Engine"
      description="Moderate digital storefronts and configure automated product validation."
      headerIcon={ShoppingBag}
      badge="Commerce"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default ShopSettings;
