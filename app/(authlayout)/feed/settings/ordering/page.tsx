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

  const feedOrder = (data.getEntitySettings as any).feedOrder || [];

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
      label: f.label,
      description: f.description,
      icon: f.icon || Rss,
      enabled: !!(data.getEntitySettings as any)[f.key],
    }));

  return <FeedSourceOrdering initialSources={sources} />;
};

export default FeedOrderingPage;
