"use client";

import React from "react";
import {
  Rss,
  MessageSquare,
  BarChart2,
  Users2,
  ShieldAlert,
  Film,
} from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { toast } from "sonner";

export const FEED_FIELDS: SettingsField[] = [
  {
    key: "allowEntityCommunityInFeed",
    label: "Show Communities in Feed",
    description:
      "Surface community activity and updates in the main activity feed.",
    icon: Users2,
    section: "Content Sources",
  },
  {
    key: "allowEntityDiscussionForumInFeed",
    label: "Show Forum Posts in Feed",
    description:
      "Allow discussion forum posts to surface in the main activity feed.",
    icon: MessageSquare,
    section: "Content Sources",
  },
  {
    key: "allowEntityPollsInFeed",
    label: "Show Polls in Feed",
    description:
      "Allow poll modules to appear as interactive cards within the activity feed.",
    icon: BarChart2,
    section: "Content Sources",
  },
  {
    key: "allowEntityFeedInFeed",
    label: "Show Global Feed",
    description:
      "Include content from the global entity feed in the unified activity stream.",
    icon: Rss,
    section: "Content Sources",
  },
  {
    key: "allowEntityMomentsInFeed",
    label: "Show Moments in Feed",
    description:
      "Surface short-form video moments as feed cards within the activity feed.",
    icon: Film,
    section: "Content Sources",
  },
  {
    key: "allowAdminFeedInFeed",
    label: "Show Admin Feed",
    description:
      "Surface administrative announcements and pinned posts from entity admins.",
    icon: ShieldAlert,
    section: "Content Sources",
  },
];

const FeedVisibility = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      // Clean up the settings object to remove fields not allowed in EntityAutoApprovalSettingsInput
      const { __typename, id, entity, ...cleanSettings } = settings;

      await update({
        variables: { input: cleanSettings },
      });
      toast.success("Feed protocols synchronized successfully.");
    } catch (error) {
      toast.error("Failed to update feed parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Feed Protocol"
      description="Configure which content types surface in the activity feed and how they are moderated."
      headerIcon={Rss}
      badge="Content"
      fields={FEED_FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
      hideHeader
    />
  );
};

export default FeedVisibility;
