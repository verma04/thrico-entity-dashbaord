"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { GraduationCap, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

const MentorshipSettings = () => {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  const FIELDS: SettingsField[] = [
    {
      key: "allowMentorship",
      label: `Allow ${moduleName}`,
      description: "Enable or disable the peer-to-peer learning network.",
      icon: ShieldCheck,
      section: "Network Governance",
    },
    {
      key: "autoApproveMentorship",
      label: `Auto Approve ${singularName}s`,
      description: `Automatically validate ${singularName.toLowerCase()} applications without manual review.`,
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
      title="Mentorship Network"
      description="Configure peer-to-peer learning ecosystems and automated mentor validation."
      headerIcon={GraduationCap}
      badge="Learning"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(MentorshipSettings, "MENTORSHIP", "canEdit"),
  "mentorship"
);
