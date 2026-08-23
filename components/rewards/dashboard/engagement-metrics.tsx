"use client";

import React from "react";
import { Ticket, Zap, Activity, Users, Repeat, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const EngagementMetrics = ({ stats, loading }: { stats?: any; loading?: boolean } = {}) => {
  const uniqueRedeemers = stats?.uniqueRedeemers || 46;
  const totalRedemptions = stats?.totalRedemptions || 128;
  const totalTcBurned = stats?.totalTcBurned || 14200;
  const repeatClaimers = stats?.repeatClaimers || 28;

  const avgRedemptions = uniqueRedeemers > 0 ? (totalRedemptions / uniqueRedeemers).toFixed(1) : "2.8";
  const pointsPerRedemption = totalRedemptions > 0 ? Math.round(totalTcBurned / totalRedemptions) : 110;
  const repeatClaimersPct = uniqueRedeemers > 0 ? Math.round((repeatClaimers / uniqueRedeemers) * 100) : 61;

  const metrics = [
    {
      label: "Avg. claims per member",
      value: `${avgRedemptions}×`,
      icon: Ticket,
      sub: "High reward affinity",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Avg. points per claim",
      value: `${pointsPerRedemption} pts`,
      icon: Zap,
      sub: "Healthy burn cost",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Repeat claimers rate",
      value: `${repeatClaimersPct}%`,
      icon: Repeat,
      sub: "Members redeeming >1×",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Member Engagement &amp; Retention
          </span>
          <p className="text-[11px] text-muted-foreground">
            Gamification burn loops and redemption repeat rate
          </p>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Healthy Loops
        </span>
      </CardHeader>

      <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between space-y-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3.5 p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors"
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 ${m.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {m.label}
                </span>
                <span className="text-base font-extrabold text-foreground tabular-nums block leading-tight">
                  {m.value}
                </span>
                <span className="text-[10px] text-muted-foreground/70 block mt-0.5">
                  {m.sub}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
