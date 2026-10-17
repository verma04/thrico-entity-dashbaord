"use client";

import React from "react";
import { Sparkles, Layers, Image as ImageIcon, TrendingUp, Smartphone, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FeedCampaign } from "@/graphql/actions/feed/campaigns";

interface FeedCampaignKpiSummaryProps {
  campaigns: FeedCampaign[];
  loading?: boolean;
  totalPosts?: number;
}

export function FeedCampaignKpiSummary({
  campaigns,
  loading = false,
  totalPosts = 0,
}: FeedCampaignKpiSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-border/60 bg-card shadow-2xs rounded-xl"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-7 w-7 rounded" />
              </div>
              <Skeleton className="h-6 w-28 rounded" />
              <Skeleton className="h-2.5 w-3/4 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const feedAndStoriesCount = campaigns.filter((c) => c.placements.includes("STORIES") || c.placements.includes("BOTH")).length;
  const feedOnlyCount = campaigns.filter((c) => c.placements.includes("FEED") && !c.placements.includes("STORIES") && !c.placements.includes("BOTH")).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Campaigns */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Feed Campaigns
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {campaigns.length}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
              >
                {activeCampaigns} Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-indigo-500" />
              Branded Photo Frames
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Posts Created */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Posts Generated
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <ImageIcon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {totalPosts.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Feed & Story Creations</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Stories Placements */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Stories Enabled
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
              <Smartphone className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                {feedAndStoriesCount}
              </span>
              <span className="text-xs text-muted-foreground">Campaigns</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Vertical 9:16 Fullscreen</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Active Filters */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Community Feed Frames
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Radio className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {campaigns.filter((c) => c.isFilterActive).length}
              </span>
              <span className="text-xs text-muted-foreground">Enabled for Members</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Instant Member Posting</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
