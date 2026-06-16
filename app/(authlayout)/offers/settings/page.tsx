"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Percent, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

const FIELDS = (singularName: string, moduleName: string): SettingsField[] => [
  {
    key: "allowOffers",
    label: `Allow ${singularName} Creation`,
    description: `Enable or disable the ability for members to create new perks and ${moduleName.toLowerCase()}.`,
    icon: ShieldCheck,
    section: "Marketplace Governance",
  },
  {
    key: "autoApproveOffers",
    label: `Auto Approve ${moduleName}`,
    description: `Automatically validate and publish new ${singularName.toLowerCase()} listings without manual review.`,
    icon: Zap,
    section: "Automation Protocols",
  },
];

const OffersSettings = () => {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);
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
      title={moduleName}
      description="Configure perks, discounts, and automated incentive delivery workflows."
      headerIcon={Percent}
      badge="Perks"
      fields={FIELDS(singularName, moduleName)}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default withSubscriptionCheck(
  withModulePermission(OffersSettings, "OFFERS", "canEdit"),
  "offers"
);
