"use client";

import React from "react";
import { Sparkles, Video, Download, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MomentCampaign } from "@/graphql/actions/moments/campaigns";

interface CampaignKpiSummaryProps {
  campaigns: MomentCampaign[];
  loading?: boolean;
  totalCompositions?: number;
  totalDownloads?: number;
}

export function CampaignKpiSummary({
  campaigns,
  loading = false,
  totalCompositions = 0,
  totalDownloads = 0,
}: CampaignKpiSummaryProps) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Campaigns */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Campaigns
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
              Branded Moment Lenses
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Videos Rendered */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Videos Composed
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <Video className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {totalCompositions.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>FFmpeg Worker Pipeline</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Downloads */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Downloads
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Download className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {totalDownloads.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Merged 1080p MP4 Files</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Filter Availability */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Camera Filters Active
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                {campaigns.filter((c) => c.isFilterActive).length}
              </span>
              <span className="text-xs text-muted-foreground">Enabled for Users</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Mobile Portrait Mode</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
