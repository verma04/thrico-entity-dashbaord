"use client";

import React from "react";
import { Images, MessageCircle } from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";

const FIELDS: SettingsField[] = [
  {
    key: "allowMediaGalleryComments",
    label: "Allow User Comments on Images",
    description:
      "When enabled, community members can leave comments on images in the media gallery. Admins can always delete comments.",
    icon: MessageCircle,
    section: "Media Gallery Settings",
  },
];

const MediaGallerySettings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({ variables: { input: settings } });
      toast.success("Media Gallery settings updated");
    } catch {
      toast.error("Failed to update settings");
    }
  };

  return (
    <PlatformSettingsPage
      title="Media Gallery"
      description="Control the media gallery experience for your community members."
      headerIcon={Images}
      badge="Gallery"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default MediaGallerySettings;
