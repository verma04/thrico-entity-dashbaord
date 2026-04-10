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
} from "lucide-react";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function GamificationOverview() {
  const { reloginConfig, settings } = useGamificationStore();

  const [timeRange, setTimeRange] = React.useState<TimeRange>(TimeRange.LAST_7_DAYS);
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

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data: statsData, loading: statsLoading } = useGetGamificationStats(timeRange, formattedDateRange);
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
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Badges Earned",
      value: statsLoading
        ? "—"
        : (gamificationStats?.totalBadgesEarned?.toLocaleString() ?? "0"),
      icon: Award,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Rules",
      value: statsLoading
        ? "—"
        : (gamificationStats?.activePointRules?.toString() ?? "0"),
      icon: Coins,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const modules = [
    {
      title: "Points Node",
      desc: "Registry of coin issuance and normalization",
      count: pointRules.length,
      icon: Coins,
      link: "/gamification/points",
    },
    {
      title: "Badge Registry",
      desc: "Architectural achievement sets",
      count: badges.length,
      icon: Award,
      link: "/gamification/badges",
    },
    {
      title: "Rank Hierarchy",
      desc: "Global status escalation levels",
      count: ranks.length,
      icon: Crown,
      link: "/gamification/ranks",
    },
    {
      title: "Streak Bonuses",
      desc: "Temporal engagement multipliers",
      count: reloginConfig.streakBonuses.length,
      icon: Flame,
      link: "/gamification/relogin",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="gamification-analytics">
      <EcosystemHeader
        title="Incentive Management"
        description="Monitor system issuance, reward distribution, and engagement trajectory across the entity."
        badgeText="Gamification Hub"
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                settings.isEnabled
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-zinc-300",
              )}
            />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              {settings.isEnabled
                ? "Incentive System Active"
                : "System Paused"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/gamification/settings">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <Settings className="h-3.5 w-3.5 text-indigo-500" />
                Configure Node
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Analytics Stats" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((mod, i) => (
                <Link key={i} href={mod.link}>
                  <div className="p-6 rounded-lg bg-white border border-zinc-200 hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        <mod.icon size={20} />
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                          {mod.count}
                        </span>
                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                          Items
                        </p>
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter leading-tight mb-4">
                      {mod.desc}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                      <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest group-hover:text-amber-600 transition-colors">
                        Manage rewards
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <EcosystemCard
              title="System Parameters"
              description="Active engine configuration"
              icon={Activity}
            >
              <div className="space-y-1 mt-4 overflow-hidden rounded-lg border border-zinc-100">
                {[
                  {
                    label: "Engine Status",
                    value: settings.isEnabled ? "ACTIVE" : "PAUSED",
                    color: settings.isEnabled
                      ? "text-emerald-600"
                      : "text-rose-500",
                  },
                  {
                    label: "Login Rewards",
                    value: reloginConfig.isEnabled ? "ENABLED" : "DISABLED",
                    color: reloginConfig.isEnabled
                      ? "text-indigo-600"
                      : "text-zinc-500",
                  },
                  {
                    label: "Daily Cap",
                    value: settings.dailyPointsCap
                      ? `${settings.dailyPointsCap} pt`
                      : "UNLIMITED",
                    color: "text-zinc-900",
                  },
                  {
                    label: "Point Decay",
                    value: settings.pointDecayEnabled ? "ON" : "OFF",
                    color: settings.pointDecayEnabled
                      ? "text-rose-600"
                      : "text-zinc-500",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 bg-zinc-50/50"
                  >
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold tracking-widest leading-none",
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
                    label: "Leaderboard",
                    icon: Trophy,
                    href: "/gamification/leaderboard",
                  },
                  {
                    label: "Activity Log",
                    icon: History,
                    href: "/gamification/activity-log",
                  },
                ].map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 bg-white hover:bg-zinc-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-3.5 w-3.5 text-zinc-400 group-hover:text-indigo-600" />
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {link.label}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
                  </Link>
                ))}
              </div>
            </EcosystemCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

import { ChevronRight } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
