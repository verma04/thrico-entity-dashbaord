"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { ClipboardList, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

const ListingSettings = () => {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  const FIELDS: SettingsField[] = [
    {
      key: "allowListing",
      label: `Allow ${moduleName}`,
      description: `Enable or disable the ability for members to create new ${moduleName.toLowerCase()}.`,
      icon: ShieldCheck,
      section: "Directory Protocols",
    },
    {
      key: "autoApproveListing",
      label: `Auto Approve ${moduleName}`,
      description: `Automatically validate and publish new ${moduleName.toLowerCase()} without manual review.`,
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
      toast.error(`Failed to update ${singularName.toLowerCase()} configuration`);
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

export default withModulePermission(
  ListingSettings,
  "LISTING",
  "canRead"
);
