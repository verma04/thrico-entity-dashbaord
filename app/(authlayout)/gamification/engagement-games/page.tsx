"use client";

import {
  Dices,
  RectangleHorizontal,
  Trophy,
  Coins,
  TrendingDown,
  TrendingUp,
  Flame,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useGetSpinScratchStats, TimeRange } from "@/graphql/actions/rewards";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import React, { useState } from "react";
import { useModuleStore } from "@/store/useModuleStore";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {trend === "up" && (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            )}
            {trend === "down" && (
              <TrendingDown className="h-3 w-3 text-rose-500" />
            )}
            {sub}
          </p>
        )}
      </div>
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
    </div>
  );
}

function TodayCard({
  title,
  icon: Icon,
  iconBg,
  iconColor,
  plays,
  tcBurned,
  tcRewarded,
  href,
  loading,
}: {
  title: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  plays: number;
  tcBurned: number;
  tcRewarded: number;
  href: string;
  loading: boolean;
}) {
  const margin = tcBurned > 0 ? ((tcBurned - tcRewarded) / tcBurned) * 100 : 0;
  const isHealthy = margin >= 20 && margin <= 40;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
        <Link href={href}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-7 text-xs text-muted-foreground"
          >
            Configure <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div className="p-5 space-y-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Plays", value: plays, mono: false },
                {
                  label: "TC Burned",
                  value: tcBurned.toLocaleString(),
                  mono: true,
                },
                {
                  label: "TC Rewarded",
                  value: tcRewarded.toLocaleString(),
                  mono: true,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="p-3 rounded-lg bg-muted/30 text-center"
                >
                  <p
                    className={cn(
                      "text-base font-bold text-foreground",
                      row.mono && "font-mono",
                    )}
                  >
                    {row.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {row.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium",
                isHealthy
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700",
              )}
            >
              <span>Margin</span>
              <span className="font-bold font-mono">{margin.toFixed(1)}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EngagementDashboardPage() {
  const gamesCenterModuleName = useModuleStore(
    (state) => state.gamesCenterModuleName,
  );
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
  };

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const { data, loading } = useGetSpinScratchStats(
    timeRange,
    formattedDateRange,
  );
  const stats = data?.getSpinScratchStats;

  const kpis = [
    {
      label: "Total Spins",
      value: loading ? "—" : (stats?.totalSpins?.toLocaleString() ?? "0"),
      sub: `${stats?.spinStatsToday?.plays ?? 0} today`,
      icon: Dices,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      trend: "up" as const,
    },
    {
      label: "Total Scratches",
      value: loading ? "—" : (stats?.totalScratches?.toLocaleString() ?? "0"),
      sub: `${stats?.scratchStatsToday?.plays ?? 0} today`,
      icon: RectangleHorizontal,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "up" as const,
    },
    {
      label: "Match & Win Plays",
      value: loading ? "—" : (stats?.totalMatchWins?.toLocaleString() ?? "0"),
      sub: `${stats?.matchWinStatsToday?.plays ?? 0} today`,
      icon: Trophy,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "up" as const,
    },
    {
      label: "Net TC Burned",
      value: loading ? "—" : (stats?.netTcBurned?.toLocaleString() ?? "0"),
      sub: "After payouts",
      icon: Flame,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      label: "Total TC Burned",
      value: loading ? "—" : (stats?.totalTcBurned?.toLocaleString() ?? "0"),
      sub: "Across all games",
      icon: Coins,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Total TC Rewarded",
      value: loading ? "—" : (stats?.totalTcRewarded?.toLocaleString() ?? "0"),
      sub: "Paid out to users",
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${gamesCenterModuleName} Dashboard`}
        badgeText={gamesCenterModuleName}
        description="Platform-wide overview of all engagement games — spins, scratches, and match plays."
        icon={LayoutDashboard}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Engagement Games" }]}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => {}}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 space-y-6">
        {/* KPI Grid */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Metrics Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {kpis.map((kpi) => (
              <StatCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </div>

        {/* Today's Breakdown */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Today's Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TodayCard
              title="Spin Wheel"
              icon={Dices}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              plays={stats?.spinStatsToday?.plays ?? 0}
              tcBurned={stats?.spinStatsToday?.tcBurned ?? 0}
              tcRewarded={stats?.spinStatsToday?.tcRewarded ?? 0}
              href="/gamification/engagement-games/spin-wheel"
              loading={loading}
            />
            <TodayCard
              title="Scratch Card"
              icon={RectangleHorizontal}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              plays={stats?.scratchStatsToday?.plays ?? 0}
              tcBurned={stats?.scratchStatsToday?.tcBurned ?? 0}
              tcRewarded={stats?.scratchStatsToday?.tcRewarded ?? 0}
              href="/gamification/engagement-games/scratch-card"
              loading={loading}
            />
            <TodayCard
              title="Match & Win"
              icon={Trophy}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              plays={stats?.matchWinStatsToday?.plays ?? 0}
              tcBurned={stats?.matchWinStatsToday?.tcBurned ?? 0}
              tcRewarded={stats?.matchWinStatsToday?.tcRewarded ?? 0}
              href="/gamification/engagement-games/match-win"
              loading={loading}
            />
          </div>
        </div>

        {/* Economy Summary */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Economy Health
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            {[
              {
                label: "Spin Wheel",
                burned: stats?.spinStatsToday?.tcBurned ?? 0,
                rewarded: stats?.spinStatsToday?.tcRewarded ?? 0,
                color: "bg-indigo-500",
              },
              {
                label: "Scratch Card",
                burned: stats?.scratchStatsToday?.tcBurned ?? 0,
                rewarded: stats?.scratchStatsToday?.tcRewarded ?? 0,
                color: "bg-blue-500",
              },
              {
                label: "Match & Win",
                burned: stats?.matchWinStatsToday?.tcBurned ?? 0,
                rewarded: stats?.matchWinStatsToday?.tcRewarded ?? 0,
                color: "bg-amber-500",
              },
            ].map((row) => {
              const margin =
                row.burned > 0
                  ? ((row.burned - row.rewarded) / row.burned) * 100
                  : 0;
              const isHealthy = margin >= 20 && margin <= 40;
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "font-bold font-mono",
                        isHealthy
                          ? "text-emerald-600"
                          : loading
                            ? "text-muted-foreground"
                            : "text-rose-600",
                      )}
                    >
                      {loading ? "—" : `${margin.toFixed(1)}% margin`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    {!loading && row.burned > 0 && (
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          row.color,
                        )}
                        style={{ width: `${Math.min(margin, 100)}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground pt-1">
              Target margin: 20%–40% of TC burned per day
            </p>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
