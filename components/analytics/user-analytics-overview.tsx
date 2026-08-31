"use client";

import React from "react";
import { useUserAnalytics } from "@/graphql/analytics/userAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Activity, UserPlus, TrendingUp } from "lucide-react";

interface UserAnalyticsOverviewProps {
  timeRange?: string;
  className?: string;
}

export function UserAnalyticsOverview({
  timeRange = "LAST_30_DAYS",
  className,
}: UserAnalyticsOverviewProps) {
  const { data, loading, error } = useUserAnalytics(timeRange);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !data?.getUserAnalytics) {
    return null;
  }

  const stats = data.getUserAnalytics;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className || ""}`}>
      <Card className="p-4 bg-background border">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-xs font-medium">Total Members</span>
          <Users className="h-4 w-4 text-blue-500" />
        </div>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {stats.totalMembers?.toLocaleString() || 0}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          {stats.verifiedPercent}% verified ({stats.verifiedMembers || 0})
        </p>
      </Card>

      <Card className="p-4 bg-background border">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-xs font-medium">Active Members</span>
          <Activity className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {stats.activeMembers?.toLocaleString() || 0}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          {stats.activePercent}% active rate
        </p>
      </Card>

      <Card className="p-4 bg-background border">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-xs font-medium">New This Month</span>
          <UserPlus className="h-4 w-4 text-violet-500" />
        </div>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {stats.newMembersThisMonth?.toLocaleString() || 0}
        </p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
          New acquisitions
        </p>
      </Card>

      <Card className="p-4 bg-background border">
        <div className="flex items-center justify-between text-muted-foreground mb-1.5">
          <span className="text-xs font-medium">DAU / WAU / MAU</span>
          <TrendingUp className="h-4 w-4 text-amber-500" />
        </div>
        <p className="text-xl font-bold tracking-tight text-foreground">
          {stats.dau || 0} / {stats.wau || 0} / {stats.mau || 0}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Daily / Weekly / Monthly
        </p>
      </Card>
    </div>
  );
}
