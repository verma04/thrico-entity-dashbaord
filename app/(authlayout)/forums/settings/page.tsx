"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { MessageSquare, Settings2 } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";

const Page = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const FIELDS: SettingsField[] = [
    {
      key: "allowDiscussionForum",
      label: `Allow ${singularName} Posts`,
      description: `Enable or disable the ability to create ${singularName.toLowerCase()} posts across the module.`,
      icon: MessageSquare,
      section: "Engagement Controls",
    },
    {
      key: "autoApproveDiscussionForum",
      label: `Auto Approve ${singularName} Posts`,
      description: `Automatically validate and publish new ${singularName.toLowerCase()} posts without review.`,
      icon: Settings2,
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
      toast.success(`${singularName} settings updated.`);
    } catch (error) {
      toast.error(`Failed to update ${singularName.toLowerCase()} configuration.`);
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Discussion Framework"
      description="Moderate interactions and configure the discussion engine for your ecosystem."
      headerIcon={MessageSquare}
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
      badge="Global Engine"
    />
  );
};




export default withSubscriptionCheck(
  withModulePermission(Page, "FORUMS", "canEdit"),
  "forums"
);
