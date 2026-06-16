"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { Film, Globe, Video, Bell, Shield, ShieldCheck } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useState } from "react";
import { useModuleStore } from "@/store/useModuleStore";

function getFields(moduleName: string, singularName: string): SettingsField[] {
  return [
    {
      key: "allowPublicMoments",
      label: `Allow Public ${moduleName}`,
      description: "Enable community-wide video discoverability across the ecosystem.",
      icon: Globe,
      section: "Visibility Controls",
    },
    {
      key: "enableShortUploads",
      label: "Enable Short Uploads",
      description: `Allow community members to draft and publish short-form ${singularName.toLowerCase()} content.`,
      icon: Video,
      section: "Visibility Controls",
    },
    {
      key: "uploadNotifications",
      label: "Upload Notifications",
      description: `Receive alerts when new community ${moduleName.toLowerCase()} are submitted to the registry.`,
      icon: Bell,
      section: "Visibility Controls",
    },
    {
      key: "autoModeration",
      label: "Content Auto-Moderation",
      description: `Leverage vision analysis to screen ${singularName.toLowerCase()} content for policy violations.`,
      icon: ShieldCheck,
      section: "Moderation Protocol",
    },
    {
      key: "moderatedFeed",
      label: "Moderated Feed",
      description: `Require manual approval before community ${moduleName.toLowerCase()} appear in the public feed.`,
      icon: Shield,
      section: "Moderation Protocol",
    },
  ];
}

const DEFAULT_SETTINGS = {
  allowPublicMoments: true,
  enableShortUploads: true,
  uploadNotifications: false,
  autoModeration: true,
  moderatedFeed: true,
};

function MomentsSettingsPage() {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);
  const [savedSettings] = useState(DEFAULT_SETTINGS);

  const handleSave = async (settings: typeof DEFAULT_SETTINGS) => {
    // TODO: connect to GraphQL mutation when allowMoments fields are added to entity settings
    toast.success(`${moduleName} preferences updated.`);
  };

  return (
    <PlatformSettingsPage
      title={`${moduleName} Protocol`}
      description="Configure video content visibility, upload permissions, and automated moderation workflows."
      headerIcon={Film}
      badge="Media"
      fields={getFields(moduleName, singularName)}
      data={savedSettings}
      onSave={handleSave}
    />
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsSettingsPage, "MOMENTS", "canEdit"),
  "moments"
);
