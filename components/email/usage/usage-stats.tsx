"use client";

import React from "react";
import { Mail, Layers, Zap, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UsageStatsProps {
  emailsSent?: number;
  monthlyQuota?: number;
  remaining?: number;
  daysToReset?: number;
  loading?: boolean;
}

export function UsageStats({
  emailsSent = 0,
  monthlyQuota = 10000,
  remaining = 0,
  daysToReset = 30,
  loading = false,
}: UsageStatsProps) {
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
                <Skeleton className="h-3 w-20 rounded-[3px]" />
                <Skeleton className="h-7 w-7 rounded-[4px]" />
              </div>
              <Skeleton className="h-6 w-28 rounded-[3px]" />
              <Skeleton className="h-2 w-full rounded-[3px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const safeTotal = monthlyQuota > 0 ? monthlyQuota : 1;
  const usagePercent = Math.min(100, Math.round((emailsSent / safeTotal) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Emails Sent */}
      <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Emails Dispatched
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <Mail className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {emailsSent.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                sent this cycle
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <Progress value={usagePercent} className="h-1.5 bg-muted" />
              <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                <span>{usagePercent}% of base quota</span>
                <span>{monthlyQuota.toLocaleString()} max</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Monthly Base Quota */}
      <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Monthly Base Quota
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {monthlyQuota.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
              >
                Auto-Renew
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-500" />
              Dedicated sending throughput
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Available Sending Credits */}
      <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Available Credits
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {remaining.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                ready to send
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Instant transmission active
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Days to Reset */}
      <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Cycle Reset In
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
                {daysToReset} {daysToReset === 1 ? "Day" : "Days"}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                remaining
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Quota refreshes on billing anniversary
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
