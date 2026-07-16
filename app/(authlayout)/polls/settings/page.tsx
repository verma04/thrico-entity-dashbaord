"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { BarChart2, ShieldCheck, Zap } from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";

const PollsSettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);

  const FIELDS: SettingsField[] = [
    {
      key: "allowPolls",
      label: `Allow ${singularName} Creation`,
      description: `Enable or disable the ability for members to create new ${singularName.toLowerCase()} modules.`,
      icon: ShieldCheck,
      section: "Engagement Controls",
    },
    {
      key: "autoApprovePolls",
      label: `Auto Approve ${moduleName}`,
      description: `Automatically validate and publish new ${moduleName.toLowerCase()} without review.`,
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
      toast.success(`${moduleName} settings updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${moduleName.toLowerCase()} configuration`);
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title={`${singularName} Framework`}
      description="Configure public sentiment gathering and automated polling workflows."
      headerIcon={BarChart2}
      badge="Sentiment"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default withSubscriptionCheck(
  withModulePermission(PollsSettings, "POLLS", "canEdit"),
  "polls",
);
