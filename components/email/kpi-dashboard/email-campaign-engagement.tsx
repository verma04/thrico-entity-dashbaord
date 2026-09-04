"use client";

import React from "react";
import { TrendingUp, Eye, MousePointerClick, UserMinus, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface EmailCampaignEngagementProps {
  loading?: boolean;
}

export function EmailCampaignEngagement({ loading = false }: EmailCampaignEngagementProps) {
  const metrics = [
    {
      title: "Average Open Rate",
      value: "42.8%",
      benchmark: "+8.4% vs industry avg",
      isPositive: true,
      description: "Unique opens across delivered campaigns",
      icon: Eye,
      badge: "Excellent",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
    },
    {
      title: "Click-Through Rate (CTR)",
      value: "14.6%",
      benchmark: "+3.2% vs industry avg",
      isPositive: true,
      description: "Clicks on links and CTA buttons",
      icon: MousePointerClick,
      badge: "High Intent",
      badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200",
    },
    {
      title: "Click-to-Open (CTOR)",
      value: "34.1%",
      benchmark: "Top Quartile",
      isPositive: true,
      description: "Clicks generated per unique open",
      icon: MessageSquare,
      badge: "Engaged",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200",
    },
    {
      title: "Unsubscribe Rate",
      value: "0.12%",
      benchmark: "<0.2% optimal",
      isPositive: true,
      description: "Members opting out of broadcast lists",
      icon: UserMinus,
      badge: "Safe Zone",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
    },
  ];

  return (
    <div id="kpi-section-engagement" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              3. Campaign Performance & Engagement
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Recipient interaction, subject line efficacy, and click conversion
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card
                key={idx}
                className="border-border/60 bg-card shadow-2xs"
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded-[4px]" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <Skeleton className="h-7 w-20 rounded" />
                    <Skeleton className="h-3.5 w-16 rounded" />
                  </div>
                  <Skeleton className="h-3 w-full rounded" />
                </CardContent>
              </Card>
            ))
          : metrics.map((item, idx) => {
              return (
                <Card
                  key={idx}
                  className="border-border/60 bg-card shadow-2xs hover:border-border transition-all"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        {item.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-bold rounded-[4px] ${item.badgeColor}`}
                      >
                        {item.badge}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-foreground tracking-tight tabular-nums">
                        {item.value}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                        {item.benchmark}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
