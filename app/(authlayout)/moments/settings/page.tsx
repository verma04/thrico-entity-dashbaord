"use client";

import React from "react";
import { Film, Globe, Video, Bell, Shield, ShieldCheck } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useState } from "react";

const FIELDS: SettingsField[] = [
  {
    key: "allowPublicMoments",
    label: "Allow Public Moments",
    description: "Enable community-wide video discoverability across the ecosystem.",
    icon: Globe,
    section: "Visibility Controls",
  },
  {
    key: "enableShortUploads",
    label: "Enable Short Uploads",
    description: "Allow community members to draft and publish short-form moment content.",
    icon: Video,
    section: "Visibility Controls",
  },
  {
    key: "uploadNotifications",
    label: "Upload Notifications",
    description: "Receive alerts when new community moments are submitted to the registry.",
    icon: Bell,
    section: "Visibility Controls",
  },
  {
    key: "autoModeration",
    label: "Content Auto-Moderation",
    description: "Leverage vision analysis to screen moment content for policy violations.",
    icon: ShieldCheck,
    section: "Moderation Protocol",
  },
  {
    key: "moderatedFeed",
    label: "Moderated Feed",
    description: "Require manual approval before community moments appear in the public feed.",
    icon: Shield,
    section: "Moderation Protocol",
  },
];

const DEFAULT_SETTINGS = {
  allowPublicMoments: true,
  enableShortUploads: true,
  uploadNotifications: false,
  autoModeration: true,
  moderatedFeed: true,
};

export default function MomentsSettingsPage() {
  const [savedSettings] = useState(DEFAULT_SETTINGS);

  const handleSave = async (settings: typeof DEFAULT_SETTINGS) => {
    // TODO: connect to GraphQL mutation when allowMoments fields are added to entity settings
    toast.success("Moments preferences updated.");
  };

  return (
    <PlatformSettingsPage
      title="Moments Protocol"
      description="Configure video content visibility, upload permissions, and automated moderation workflows."
      headerIcon={Film}
      badge="Media"
      fields={FIELDS}
      data={savedSettings}
      onSave={handleSave}
    />
  );
}
