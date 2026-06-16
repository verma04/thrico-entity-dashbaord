"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { ShoppingBag, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

const ShopSettings = () => {
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

  const FIELDS: SettingsField[] = [
    {
      key: "allowShop",
      label: `Allow ${moduleName}`,
      description: `Enable or disable the module for listing and selling ${moduleName.toLowerCase()}.`,
      icon: ShieldCheck,
      section: "Marketplace Governance",
    },
    {
      key: "autoApproveShop",
      label: `Auto Approve ${moduleName}`,
      description: `New ${singularName.toLowerCase()} listings will be live instantly without manual review.`,
      icon: Zap,
      section: "Automation Protocols",
    },
  ];

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



export default withSubscriptionCheck(
  withModulePermission(ShopSettings, "SHOP", "canEdit"),
  "shop"
);
