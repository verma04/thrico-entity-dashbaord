"use client";

import React from "react";
import {
  Rss,
  MessageSquare,
  BarChart2,
  Users2,
  ShieldAlert,
  Film,
  Sparkles,
} from "lucide-react";
import {
  PlatformSettingsPage,
  SettingsField,
} from "@/components/ui/platform/settings-page";
import {
  useEntitySettings,
  useUpdateEntitySettings,
  useUpdateFeedEntityName,
} from "@/graphql/actions";
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
    key: "feedEntityName",
    label: "Feed Brand Name",
    description: "Customize the display name for your entity's official publications in the feed.",
    icon: Sparkles,
    type: "text",
    section: "Branding",
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
    key: "allowEntityMomentsInFeed",
    label: "Show Moments in Feed",
    description:
      "Surface short-form video moments as feed cards within the activity feed.",
    icon: Film,
    section: "Content Sources",
  },
  {
    key: "allowEntityFeedInFeed",
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
  const [updateFeedName, { loading: loadingName }] =
    useUpdateFeedEntityName({});

  const dynamicFields = React.useMemo(() => {
    return FEED_FIELDS.map((f) => {
      if (f.key === "allowEntityFeedInFeed") {
        return {
          ...f,
          label: `Show ${data?.getEntitySettings?.feedEntityName || "Admin"} Feed`,
        };
      }
      return f;
    });
  }, [data?.getEntitySettings?.feedEntityName]);

  const handleSave = async (settings: any) => {
    try {
      // Clean up the settings object to remove fields not allowed in EntityAutoApprovalSettingsInput
      const { __typename, id, entity, feedEntityName, ...cleanSettings } =
        settings;

      const promises = [];

      // Update visibility settings
      promises.push(
        update({
          variables: { input: cleanSettings },
        })
      );

      // Update feed brand name if changed
      if (feedEntityName !== data?.getEntitySettings?.feedEntityName) {
        promises.push(
          updateFeedName({
            variables: { name: feedEntityName },
          })
        );
      }

      await Promise.all(promises);
      toast.success("Feed protocols synchronized successfully.");
    } catch (error) {
      toast.error("Failed to update feed parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Feed Visibility"
      description="Choose which types of content should be shown in your feed."
      headerIcon={Rss}
      badge="Content"
      fields={dynamicFields}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn || loadingName}
      hideHeader
    />
  );
};

export default FeedVisibility;
