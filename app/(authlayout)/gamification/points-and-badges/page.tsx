"use client";

import React from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Trophy,
  Users,
  Zap,
  History,
  Settings,
  Flame,
  ArrowRight,
  Activity,
  Coins,
  Crown,
  ShieldCheck,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import Link from "next/link";
import {
  useGetGamificationStats,
  useGetPointRules,
  useGetBadges,
  useGetRanks,
  TimeRange,
} from "@/graphql/actions";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-card";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useModuleStore } from "@/store/useModuleStore";

export default function GamificationOverview() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const { reloginConfig, settings } = useGamificationStore();

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

  const { data: statsData, loading: statsLoading } = useGetGamificationStats(
    timeRange,
    formattedDateRange,
  );
  const { data: rulesData, loading: rulesLoading } = useGetPointRules();
  const { data: badgesData, loading: badgesLoading } = useGetBadges();
  const { data: ranksData, loading: ranksLoading } = useGetRanks();

  const gamificationStats = statsData?.getGamificationStats;
  const pointRules = rulesData?.getPointRules || [];
  const badges = badgesData?.getBadges || [];
  const ranks = ranksData?.getRanks || [];

  const isLoading =
    statsLoading || rulesLoading || badgesLoading || ranksLoading;

  const kpis = [
    {
      title: "Engaged Users",
      value: statsLoading
        ? "—"
        : (gamificationStats?.totalUsers?.toLocaleString() ?? "0"),
      icon: Users,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Points Awarded",
      value: statsLoading
        ? "—"
        : (gamificationStats?.totalPointsAwarded?.toLocaleString() ?? "0"),
      icon: Zap,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Badges Earned",
      value: statsLoading
        ? "—"
        : (gamificationStats?.totalBadgesEarned?.toLocaleString() ?? "0"),
      icon: Award,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Rules",
      value: statsLoading
        ? "—"
        : (gamificationStats?.activePointRules?.toString() ?? "0"),
      icon: Coins,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
  ];

  const modules = [
    {
      title: "Points & Coins",
      desc: "Manage how users earn and spend points.",
      count: pointRules.length,
      icon: Coins,
      link: "/gamification/points-and-badges/points",
    },
    {
      title: "Badges",
      desc: "Manage achievement credentials and icons.",
      count: badges.length,
      icon: Award,
      link: "/gamification/points-and-badges/badges",
    },
    {
      title: "Ranks",
      desc: "Set up tier progression for users.",
      count: ranks.length,
      icon: Crown,
      link: "/gamification/points-and-badges/ranks",
    },
    {
      title: "Streak Bonuses",
      desc: "Give extra points for daily activity streaks.",
      count: reloginConfig.streakBonuses.length,
      icon: Flame,
      link: "/gamification/points-and-badges/relogin",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="gamification-analytics">
      <EcosystemHeader
        title={`${gamificationModuleName} Dashboard`}
        description="Manage points, badges, and user rewards across your community."
        badgeText="Overview"
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points & Badges" },
        ]}
        actions={
          <div className="flex items-center gap-4">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {/* KPI Grid */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="Core Gamification Stats"
            titleClassName="normal-case tracking-normal text-sm text-foreground"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} trendLabel="Last 7 days" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Modules Grid */}
          <section className="lg:col-span-8 space-y-4">
            <DashboardSectionHeading
              title="Gamification Modules"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((mod, i) => (
                <Link key={i} href={mod.link}>
                  <div className="p-6 rounded-xl bg-white dark:bg-background border border-zinc-200 dark:border-neutral-800 hover:border-zinc-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-zinc-500/5 transition-all group relative overflow-hidden h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="h-12 w-12 rounded-xl bg-zinc-50 dark:bg-neutral-900 border border-zinc-100 dark:border-neutral-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-neutral-800 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:border-zinc-200 dark:group-hover:border-neutral-700 transition-colors">
                          <mod.icon size={22} />
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            {mod.count}
                          </span>
                          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                            Items
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                          {mod.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-50 dark:border-neutral-800">
                      <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        Manage
                      </span>
                      <ArrowRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Sidebar / Settings */}
          <section className="lg:col-span-4 space-y-4">
            <DashboardSectionHeading
              title="System Summary"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <div className="space-y-1.5 overflow-hidden rounded-xl border border-zinc-100 dark:border-neutral-800">
                {[
                  {
                    label: "Engine Status",
                    value: settings.isEnabled ? "Active" : "Paused",
                    color: settings.isEnabled
                      ? "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                  },
                  {
                    label: "Login Rewards",
                    value: reloginConfig.isEnabled ? "Enabled" : "Disabled",
                    color: reloginConfig.isEnabled
                      ? "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                  },
                  {
                    label: "Daily Cap",
                    value: settings.dailyPointsCap
                      ? `${settings.dailyPointsCap} pt`
                      : "Unlimited",
                    color: "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800",
                  },
                  {
                    label: "Point Decay",
                    value: settings.pointDecayEnabled ? "Enabled" : "Disabled",
                    color: settings.pointDecayEnabled
                      ? "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900/50 border-b last:border-0 border-zinc-50 dark:border-neutral-800"
                  >
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider",
                        row.color,
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {[
                  {
                    label: "View Leaderboard",
                    icon: Trophy,
                    href: "/gamification/leaderboard",
                  },
                  {
                    label: "Activity History",
                    icon: History,
                    href: "/gamification/activity-log",
                  },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:bg-zinc-50 dark:hover:bg-neutral-900 hover:border-zinc-200 dark:hover:border-neutral-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-50 dark:bg-neutral-950 group-hover:bg-zinc-100 dark:group-hover:bg-neutral-800 transition-colors">
                        <link.icon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                      </div>
                      <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {link.label}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
