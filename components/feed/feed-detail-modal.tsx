"use client";

import React from "react";
import type { FeedProps } from "./types";
import { Analytics } from "./analytics";

export interface FeedDetailModalProps {
  feed: FeedProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "preview" | "shares" | "engagement" | "demographics";
}

/**
 * FeedDetailModal (Drawer pattern)
 * Displays post performance, viral share analytics, demographics, and live post preview
 * in a right-sliding Sheet matching the application's design system.
 */
export function FeedDetailModal({
  feed,
  open,
  onOpenChange,
  defaultTab = "preview",
}: FeedDetailModalProps) {
  if (!feed) return null;

  return (
    <Analytics
      feed={feed}
      feedId={feed.id.toString()}
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      defaultTab={defaultTab}
    />
  );
}

export default FeedDetailModal;
