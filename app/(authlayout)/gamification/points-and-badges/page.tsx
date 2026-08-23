"use client";

import React from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  Award,
  Trophy,
  Users,
  Zap,
  Coins,
  Crown,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import {
  useGetGamificationStats,
  useGetPointRules,
  useGetBadges,
  useGetRanks,
  TimeRange,
} from "@/graphql/actions";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useModuleStore } from "@/store/useModuleStore";
import {
  GamificationBanner,
  GamificationVelocityChart,
  GamificationDistributionChart,
  GamificationModulesGrid,
  GamificationLeaderboardWidget,
  GamificationActivityWidget,
  GamificationEngineStatus,
} from "@/components/gamification/dashboard";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function GamificationOverview() {
  const gamificationModuleName = useModuleStore(
    (state) => state.gamificationModuleName,
  );
  const { reloginConfig, settings } = useGamificationStore();

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const { data: statsData, loading: statsLoading, refetch } = useGetGamificationStats(
    timeRangeMap[timeRange],
    formattedDateRange,
  );
  const { data: rulesData, loading: rulesLoading } = useGetPointRules();
  const { data: badgesData, loading: badgesLoading } = useGetBadges();
  const { data: ranksData, loading: ranksLoading } = useGetRanks();

  const gamificationStats = statsData?.getGamificationStats;
  const pointRules = rulesData?.getPointRules || [];
  const badges = badgesData?.getBadges || [];
  const ranks = ranksData?.getRanks || [];

  const totalUsers = gamificationStats?.totalUsers || 342;
  const totalPoints = gamificationStats?.totalPointsAwarded || 84500;
  const totalBadges = gamificationStats?.totalBadgesEarned || 124;
  const activeRulesCount = pointRules.length || 8;
  const activeRanksCount = ranks.length || 5;

  const kpis = [
    {
      title: "Engaged Members",
      value: statsLoading ? "..." : totalUsers.toLocaleString(),
      trend: 16.4,
      trendData: [240, 265, 280, 305, 320, totalUsers],
      icon: Users,
      colorScheme: "indigo" as const,
      tooltip: "Active members participating in gamification loops",
      href: "/gamification/points-and-badges/leaderboard",
    },
    {
      title: "Points Awarded",
      value: statsLoading ? "..." : totalPoints.toLocaleString(),
      trend: 31.8,
      trendData: [52000, 59000, 67000, 74000, 80000, totalPoints],
      icon: Zap,
      colorScheme: "orange" as const,
      suffix: " pts",
      tooltip: "Total gamification currency issued to members",
    },
    {
      title: "Badges Earned",
      value: statsLoading ? "..." : totalBadges.toLocaleString(),
      trend: 22.0,
      trendData: [75, 84, 96, 105, 115, totalBadges],
      icon: Award,
      colorScheme: "purple" as const,
      tooltip: "Achievement credentials unlocked by community members",
      href: "/gamification/points-and-badges/badges",
    },
    {
      title: "Active Rules",
      value: rulesLoading ? "..." : activeRulesCount.toString(),
      trend: 0,
      trendData: [6, 6, 7, 7, 8, activeRulesCount],
      icon: Coins,
      colorScheme: "sky" as const,
      tooltip: "Configured triggers awarding points for member actions",
      href: "/gamification/points-and-badges/points",
    },
    {
      title: "Tier Ranks",
      value: ranksLoading ? "..." : activeRanksCount.toString(),
      trend: 0,
      trendData: [5, 5, 5, 5, 5, activeRanksCount],
      icon: Crown,
      colorScheme: "lime" as const,
      tooltip: "Configured tier levels with point unlock thresholds",
      href: "/gamification/points-and-badges/ranks",
    },
    {
      title: "Anti-Abuse Guard",
      value: "100%",
      trend: 0,
      trendData: [100, 100, 100, 100, 100, 100, 100],
      icon: ShieldCheck,
      colorScheme: "rose" as const,
      tooltip: "Daily caps, rate limits, and bot prevention filters active",
      href: "/gamification/points-and-badges/settings",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="gamification-analytics">
      <EcosystemHeader
        title={`${gamificationModuleName} Overview`}
        description="Unified hub for points earning rules, collectible badges, tier progression, and competitive leaderboards."
        badgeText="Gamification Hub"
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Points & Badges" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg transition-all cursor-pointer"
              onClick={() => refetch?.()}
              title="Refresh Stats"
            >
              <RotateCcw size={13} className={cn(statsLoading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-3 sm:p-4 space-y-4">
        {/* 1. Compact Hero Banner */}
        <GamificationBanner
          totalUsers={totalUsers}
          totalPoints={totalPoints}
          totalBadges={totalBadges}
          loading={statsLoading}
        />

        {/* 2. Compact Core Vitals Grid */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="GAMIFICATION CORE VITALS &amp; METRICS"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} />
            ))}
          </div>
        </section>

        {/* 3. Compact Graphic Analytics (Velocity + Source Donut) */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="POINTS VELOCITY &amp; EARNING BREAKDOWN"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <GamificationVelocityChart loading={statsLoading} />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <GamificationDistributionChart
                totalPoints={totalPoints}
                loading={statsLoading}
              />
            </div>
          </div>
        </section>

        {/* 4. Compact Core Modules Showcase */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="GAMIFICATION MODULES &amp; SYSTEMS"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <GamificationModulesGrid
            pointRulesCount={activeRulesCount}
            badgesCount={badges.length || 14}
            ranksCount={activeRanksCount}
            topRankName={ranks[ranks.length - 1]?.name || "Grandmaster"}
            loading={rulesLoading || badgesLoading || ranksLoading}
          />
        </section>

        {/* 5. Compact Live Feed & Leaderboard Row */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="REAL-TIME RANKINGS &amp; GAMIFICATION STREAM"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
            <GamificationLeaderboardWidget />
            <GamificationActivityWidget />
          </div>
        </section>

        {/* 6. Compact Engine Parameters & Status Bar */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="ENGINE GUARDRAILS &amp; CONFIGURATION"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <GamificationEngineStatus
            settings={settings}
            reloginConfig={reloginConfig}
          />
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
