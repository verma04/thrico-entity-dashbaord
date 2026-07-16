"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { ShieldCheck, Zap, Settings2, Globe, Users2 } from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

const Settings = () => {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const FIELDS: SettingsField[] = [
    {
      key: "allowCommunity",
      label: `Allow ${singularName} Creation`,
      description: `When enabled, eligible members can initiate new ${moduleName.toLowerCase()} nodes within the ecosystem.`,
      icon: Globe,
      section: "Creation & Governance",
    },
    {
      key: "autoApproveCommunity",
      label: `Auto Approve ${moduleName}`,
      description: `New ${moduleName.toLowerCase()} will be live instantly in the registry without manual validation requirements.`,
      icon: Zap,
      section: "Automation Protocols",
    },
  ];

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success(`${singularName} protocols synchronized successfully.`);
    } catch (error) {
      toast.error("Failed to update registry parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title={`${singularName} Protocols`}
      description={`Configure the governance and automation frameworks for your ${moduleName.toLowerCase()} network and node clusters.`}
      headerIcon={Settings2}
      badge="Network"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default Settings;
