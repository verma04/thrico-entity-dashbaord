"use client";

import React from "react";
import { Link2, MousePointerClick, UserCheck, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UtmCampaignItem } from "@/types/utm";

interface UtmKpiSummaryProps {
  campaigns: UtmCampaignItem[];
  loading?: boolean;
  totalVisits?: number;
  totalSignups?: number;
  avgConversionRate?: number;
  totalLogins?: number;
}

export function UtmKpiSummary({
  campaigns,
  loading,
  totalVisits = 0,
  totalSignups = 0,
  avgConversionRate = 0,
  totalLogins = 0,
}: UtmKpiSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px]"
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

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Campaigns */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total UTM Links
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Link2 className="h-3.5 w-3.5" />
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
              Signups & Login Funnels
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Attributed Clicks / Visits */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Attributed Visits
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <MousePointerClick className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {totalVisits.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Verified sessions</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Completed Signups */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Completed Signups
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {totalSignups.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                first-touch verified
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-2 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Attributed signups
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Conversion Rate */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Avg Conversion Rate
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                {avgConversionRate}%
              </span>
              {totalLogins > 0 && (
                <span className="text-[11px] font-medium text-muted-foreground">
                  {totalLogins.toLocaleString()} logins
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Visits to registered members
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
