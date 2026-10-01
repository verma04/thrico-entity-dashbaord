"use client";

import React from "react";
import { Rss } from "lucide-react";
import { useEntitySettings } from "@/graphql/actions";
import { FEED_FIELDS } from "@/components/settings/feed/feed-visibility";
import FeedSourceOrdering from "@/components/settings/feed/feed-source-ordering";
import { Skeleton } from "@/components/ui/skeleton";

const FeedOrderingPage = () => {
  const { data, loading } = useEntitySettings();

  if (loading || !data) {
    return (
      <div className="space-y-6 max-w-[1040px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const entitySettings = (data.getEntitySettings as any) || {};
  const feedOrder = entitySettings.feedOrder || [];
  const feedTabNames = entitySettings.feedTabNames || {};

  const getSourceLabel = (f: any) => {
    if (feedTabNames[f.key]) {
      return `Show ${feedTabNames[f.key]} in Feed`;
    }
    if (f.key === "allowEntityDiscoverInFeed" && entitySettings.discoverFeedName) {
      return `Show ${entitySettings.discoverFeedName} in Feed`;
    }
    if (f.key === "allowEntityMediaGalleryInFeed" && entitySettings.mediaGalleryFeedName) {
      return `Show ${entitySettings.mediaGalleryFeedName} in Feed`;
    }
    return f.label;
  };

  const sources = [...FEED_FIELDS]
    .filter((f) => f.type === "switch" || !f.type)
    .sort((a, b) => {
      const indexA = feedOrder.indexOf(a.key);
      const indexB = feedOrder.indexOf(b.key);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    .map((f) => ({
      id: f.key,
      label: getSourceLabel(f),
      description: f.description,
      icon: f.icon || Rss,
      enabled: !!entitySettings[f.key],
    }));

  return <FeedSourceOrdering initialSources={sources} />;
};

export default FeedOrderingPage;
