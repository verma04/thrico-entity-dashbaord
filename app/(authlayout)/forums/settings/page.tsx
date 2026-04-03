"use client";

import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { MessageSquare, Settings2 } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowDiscussionForum",
    label: "Allow Forum Posts",
    description: "Enable or disable the ability to create forum posts across the module.",
    icon: MessageSquare,
    section: "Engagement Controls",
  },
  {
    key: "autoApproveDiscussionForum",
    label: "Auto Approve Forum Posts",
    description: "Automatically validate and publish new forum posts without review.",
    icon: Settings2,
    section: "Automation Protocols",
  },
];

const Page = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Forum settings updated.");
    } catch (error) {
      toast.error("Failed to update forum configuration.");
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

export default Page;

