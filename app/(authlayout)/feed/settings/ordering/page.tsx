"use client";

import React from "react";
import { Rss } from "lucide-react";
import { useEntitySettings } from "@/graphql/actions";
import { FEED_FIELDS } from "@/components/settings/feed/feed-visibility";
import FeedSourceOrdering from "@/components/settings/feed/feed-source-ordering";

const FeedOrderingPage = () => {
  const { data, loading } = useEntitySettings();

  if (loading || !data) {
    return (
      <div className="flex flex-col gap-3 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full rounded-xl bg-muted/50 animate-pulse" />
        ))}
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

  return (
    <div className="max-w-2xl px-4 sm:px-0">
      <FeedSourceOrdering initialSources={sources} />
    </div>
  );
};

export default FeedOrderingPage;
