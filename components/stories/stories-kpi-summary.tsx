"use client";

import React from "react";
import {
  BookOpen,
  Radio,
  Archive,
  Users,
  TrendingUp,
  Sparkles,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Story } from "@/graphql/actions/stories";

interface StoriesKpiSummaryProps {
  stories: Story[];
  totalCount?: number;
  activeCount?: number;
  pastCount?: number;
  loading?: boolean;
}

export function StoriesKpiSummary({
  stories,
  totalCount,
  activeCount,
  pastCount,
  loading,
}: StoriesKpiSummaryProps) {
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
                <Skeleton className="h-3 w-24 rounded-[3px]" />
                <Skeleton className="h-7 w-7 rounded-[4px]" />
              </div>
              <Skeleton className="h-6 w-28 rounded-[3px]" />
              <Skeleton className="h-2.5 w-3/4 rounded-[3px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate local breakdown if counts are not explicitly provided
  const total = totalCount ?? stories.length;
  const active =
    activeCount ??
    stories.filter((s) => s.isActive && new Date(s.expiresAt) > new Date()).length;
  const past = pastCount ?? Math.max(0, total - active);

  const uniqueAuthors = new Set(
    stories.map((s) => s.userId || s.user?.id).filter(Boolean)
  ).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Stories */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Stories
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {total.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
              >
                All Time
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Aggregate ephemeral narrative volume
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Active Stories */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Live & Active
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {active.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 rounded-[3px]"
              >
                Live Now
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping mr-0.5" />
              Visible in active member stories bar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Past Archive */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Expired Archive
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
              <Archive className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {past.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
              >
                Archived
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" />
              Preserved historical media library
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Active Story Makers */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Story Makers
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900/40">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {uniqueAuthors.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800 rounded-[3px]"
              >
                Creators
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-violet-500" />
              Members contributing daily updates
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
