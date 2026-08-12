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
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import {
  EcosystemKPI,
  EcosystemTodayCard,
  EcosystemHealthBar,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      title: "Total Spins",
      value: loading ? "—" : (stats?.totalSpins?.toLocaleString() ?? "0"),
      trendLabel: `${stats?.spinStatsToday?.plays ?? 0} today`,
      icon: Dices,
      colorScheme: "indigo" as const,
    },
    {
      title: "Total Scratches",
      value: loading ? "—" : (stats?.totalScratches?.toLocaleString() ?? "0"),
      trendLabel: `${stats?.scratchStatsToday?.plays ?? 0} today`,
      icon: RectangleHorizontal,
      colorScheme: "sky" as const,
    },
    {
      title: "Match & Win Plays",
      value: loading ? "—" : (stats?.totalMatchWins?.toLocaleString() ?? "0"),
      trendLabel: `${stats?.matchWinStatsToday?.plays ?? 0} today`,
      icon: Trophy,
      colorScheme: "orange" as const,
    },
    {
      title: "Total Unique Members",
      value: loading ? "—" : (stats?.totalUniqueMembers?.toLocaleString() ?? "0"),
      trendLabel: "Played games",
      icon: Flame,
      colorScheme: "rose" as const,
    },
    {
      title: "Total TC Burned",
      value: loading ? "—" : (stats?.totalTcBurned?.toLocaleString() ?? "0"),
      trendLabel: "Across all games",
      icon: Coins,
      colorScheme: "orange" as const,
    },
    {
      title: "Total TC Rewarded",
      value: loading ? "—" : (stats?.totalTcRewarded?.toLocaleString() ?? "0"),
      trendLabel: "Paid out to users",
      icon: TrendingUp,
      colorScheme: "lime" as const,
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Member Games"
        badgeText={gamesCenterModuleName}
        description="Overall member games insights"
        icon={LayoutDashboard}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Engagement Games" },
        ]}
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
        <section className="space-y-4">
          <DashboardSectionHeading
            title="Metrics Overview"
            titleClassName="normal-case tracking-normal text-sm text-foreground"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} />
            ))}
          </div>
        </section>

        {/* Activities */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="Activities"
            titleClassName="normal-case tracking-normal text-sm text-foreground"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EcosystemTodayCard
              title="Spin Wheel"
              icon={Dices}
              colorScheme="indigo"
              plays={stats?.spinStats?.plays ?? 0}
              tcBurned={stats?.spinStats?.tcBurned ?? 0}
              tcRewarded={stats?.spinStats?.tcRewarded ?? 0}
              href="/gamification/engagement-games/spin-wheel"
              loading={loading}
            />
            <EcosystemTodayCard
              title="Scratch Card"
              icon={RectangleHorizontal}
              colorScheme="sky"
              plays={stats?.scratchStats?.plays ?? 0}
              tcBurned={stats?.scratchStats?.tcBurned ?? 0}
              tcRewarded={stats?.scratchStats?.tcRewarded ?? 0}
              href="/gamification/engagement-games/scratch-card"
              loading={loading}
            />
            <EcosystemTodayCard
              title="Match & Win"
              icon={Trophy}
              colorScheme="orange"
              plays={stats?.matchWinStats?.plays ?? 0}
              tcBurned={stats?.matchWinStats?.tcBurned ?? 0}
              tcRewarded={stats?.matchWinStats?.tcRewarded ?? 0}
              href="/gamification/engagement-games/match-win"
              loading={loading}
            />
          </div>
        </section>

        {/* Economy Summary */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="Economy Health"
            titleClassName="normal-case tracking-normal text-sm text-foreground"
          />
          <div className="rounded-[20px] border border-transparent bg-muted/30 p-5 space-y-4">
            {[
              {
                label: "Spin Wheel",
                burned: stats?.spinStats?.tcBurned ?? 0,
                rewarded: stats?.spinStats?.tcRewarded ?? 0,
                colorScheme: "indigo" as const,
              },
              {
                label: "Scratch Card",
                burned: stats?.scratchStats?.tcBurned ?? 0,
                rewarded: stats?.scratchStats?.tcRewarded ?? 0,
                colorScheme: "sky" as const,
              },
              {
                label: "Match & Win",
                burned: stats?.matchWinStats?.tcBurned ?? 0,
                rewarded: stats?.matchWinStats?.tcRewarded ?? 0,
                colorScheme: "orange" as const,
              },
            ].map((row) => (
              <EcosystemHealthBar
                key={row.label}
                label={row.label}
                burned={row.burned}
                rewarded={row.rewarded}
                colorScheme={row.colorScheme}
                loading={loading}
              />
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Target margin: 20%–40% of TC burned per day
            </p>
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
