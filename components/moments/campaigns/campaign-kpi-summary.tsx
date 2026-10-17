"use client";

import React from "react";
import { Sparkles, Video, TrendingUp, Camera, Layers } from "lucide-react";
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
}: CampaignKpiSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-border/70 bg-card shadow-2xs rounded-xl"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-20 rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const activeFilters = campaigns.filter((c) => c.isFilterActive).length;
  const sequencedCount = campaigns.filter((c) => c.introMomentId || c.outroMomentId).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Campaigns */}
      <Card className="border-border/70 bg-card shadow-2xs hover:border-indigo-500/30 hover:shadow-xs transition-all rounded-xl">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Campaigns
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                {campaigns.length}
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0 font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full"
              >
                {activeCampaigns} Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-indigo-500 shrink-0" />
              <span>Branded Moment Studio</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Videos Rendered */}
      <Card className="border-border/70 bg-card shadow-2xs hover:border-blue-500/30 hover:shadow-xs transition-all rounded-xl">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Videos Composed
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-2xs">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                {totalCompositions.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">rendered</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />
              <span>Cloud MP4 Compositor</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Camera Filters Active */}
      <Card className="border-border/70 bg-card shadow-2xs hover:border-purple-500/30 hover:shadow-xs transition-all rounded-xl">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Live Camera Filters
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40 shadow-2xs">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                {activeFilters}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">active lenses</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 inline-block" />
              <span>Mobile AR Viewport</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Sequence Pipelines */}
      <Card className="border-border/70 bg-card shadow-2xs hover:border-emerald-500/30 hover:shadow-xs transition-all rounded-xl">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Intro & Outro Sequences
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shadow-2xs">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {sequencedCount}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">campaigns</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>3-Stage Video Pipeline</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
