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
  useGetGamificationSettings,
  useGetGamificationActivityLog,
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
  const { reloginConfig, settings: storeSettings } = useGamificationStore();

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetGamificationStats(timeRangeMap[timeRange], formattedDateRange);
  const { data: rulesData, loading: rulesLoading, refetch: refetchRules } = useGetPointRules();
  const { data: badgesData, loading: badgesLoading, refetch: refetchBadges } = useGetBadges();
  const { data: ranksData, loading: ranksLoading, refetch: refetchRanks } = useGetRanks();
  const {
    data: serverSettingsData,
    loading: settingsLoading,
    refetch: refetchSettings,
  } = useGetGamificationSettings();

  const {
    data: activityData,
    loading: activityLoading,
    refetch: refetchActivity,
  } = useGetGamificationActivityLog({
    variables: {
      input: {
        limit: 200,
        offset: 0,
        startDate: dateRange?.from ? new Date(dateRange.from) : undefined,
        endDate: dateRange?.to ? new Date(dateRange.to) : undefined,
      },
    },
  });

  const handleRefresh = () => {
    refetchStats?.();
    refetchRules?.();
    refetchBadges?.();
    refetchRanks?.();
    refetchSettings?.();
    refetchActivity?.();
  };

  const gamificationStats = statsData?.getGamificationStats;
  const pointRules = rulesData?.getPointRules || [];
  const badges = badgesData?.getBadges || [];
  const ranks = ranksData?.getRanks || [];
  const serverSettings = serverSettingsData?.getGamificationSettings;

  const totalUsers = gamificationStats?.totalUsers ?? 0;
  const totalPoints = gamificationStats?.totalPointsAwarded ?? 0;
  const totalBadges = gamificationStats?.totalBadgesEarned ?? 0;
  const activeRulesCount = pointRules.filter((r) => r.isActive).length;
  const activeRanksCount = ranks.filter((r) => r.isActive).length;

  // Real points & badges velocity timeline from backend activity logs
  const velocityData = React.useMemo(() => {
    const from = dateRange?.from
      ? new Date(dateRange.from)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const to = dateRange?.to ? new Date(dateRange.to) : new Date();

    const dateMap = new Map<string, { date: string; points: number; badges: number }>();
    const curr = new Date(from);
    let count = 0;
    while (curr <= to && count < 370) {
      const key = curr.toISOString().split("T")[0];
      const label = curr.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dateMap.set(key, { date: label, points: 0, badges: 0 });
      curr.setDate(curr.getDate() + 1);
      count++;
    }

    const logs = activityData?.getGamificationActivityLog || [];
    logs.forEach((log) => {
      if (!log.createdAt) return;
      const key = new Date(log.createdAt).toISOString().split("T")[0];
      const entry = dateMap.get(key);
      if (entry) {
        if (log.type === "BADGE") {
          entry.badges += 1;
        } else {
          entry.points += Math.max(0, log.points || 0);
        }
      }
    });

    return Array.from(dateMap.values());
  }, [activityData, dateRange]);

  // Real breakdown of points by module/source from backend activity logs
  const distributionData = React.useMemo(() => {
    const logs = activityData?.getGamificationActivityLog || [];
    const modulePointsMap = new Map<string, number>();

    logs.forEach((log) => {
      if (log.type === "BADGE" || !log.points || log.points <= 0) return;
      const rule = pointRules.find(
        (r) => r.action === log.ruleAction || r.description === log.ruleDescription,
      );
      const mod = rule?.module || log.ruleAction?.split("_")[0] || "General";
      const current = modulePointsMap.get(mod) || 0;
      modulePointsMap.set(mod, current + log.points);
    });

    const totalCalculated = Array.from(modulePointsMap.values()).reduce((a, b) => a + b, 0);
    const colors = [
      "#8b5cf6",
      "#6366f1",
      "#f59e0b",
      "#10b981",
      "#f43f5e",
      "#06b6d4",
      "#ec4899",
    ];

    return Array.from(modulePointsMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([mod, value], idx) => {
        const pct = totalCalculated > 0 ? Math.round((value / totalCalculated) * 100) : 0;
        return {
          id: mod.toLowerCase(),
          name: `${mod.charAt(0).toUpperCase() + mod.slice(1).toLowerCase()} Triggers`,
          shortName: mod,
          value,
          percentage: pct,
          color: colors[idx % colors.length],
        };
      });
  }, [activityData, pointRules]);

  // Sparklines from real daily activity
  const pointsSparkline = React.useMemo(() => {
    const vals = velocityData.map((d) => d.points);
    return vals.length > 0 ? vals : [0, 0, 0, 0, 0, 0];
  }, [velocityData]);

  const badgesSparkline = React.useMemo(() => {
    const vals = velocityData.map((d) => d.badges);
    return vals.length > 0 ? vals : [0, 0, 0, 0, 0, 0];
  }, [velocityData]);

  const usersSparkline = React.useMemo(() => {
    const logs = activityData?.getGamificationActivityLog || [];
    const from = dateRange?.from
      ? new Date(dateRange.from)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const to = dateRange?.to ? new Date(dateRange.to) : new Date();

    const userDayMap = new Map<string, Set<string>>();
    const curr = new Date(from);
    let count = 0;
    while (curr <= to && count < 370) {
      const key = curr.toISOString().split("T")[0];
      userDayMap.set(key, new Set<string>());
      curr.setDate(curr.getDate() + 1);
      count++;
    }

    logs.forEach((log) => {
      if (!log.createdAt || !log.user?.id) return;
      const key = new Date(log.createdAt).toISOString().split("T")[0];
      const set = userDayMap.get(key);
      if (set) {
        set.add(log.user.id);
      }
    });

    const vals = Array.from(userDayMap.values()).map((s) => s.size);
    return vals.length > 0 ? vals : [0, 0, 0, 0, 0, 0];
  }, [activityData, dateRange]);

  // Real trends vs earlier period
  const pointsTrend = React.useMemo(() => {
    if (velocityData.length < 2) return undefined;
    const mid = Math.floor(velocityData.length / 2);
    const firstHalf = velocityData.slice(0, mid).reduce((a, b) => a + b.points, 0);
    const secondHalf = velocityData.slice(mid).reduce((a, b) => a + b.points, 0);
    if (firstHalf === 0 && secondHalf === 0) return 0;
    if (firstHalf === 0) return 100;
    return Number((((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1));
  }, [velocityData]);

  const badgesTrend = React.useMemo(() => {
    if (velocityData.length < 2) return undefined;
    const mid = Math.floor(velocityData.length / 2);
    const firstHalf = velocityData.slice(0, mid).reduce((a, b) => a + b.badges, 0);
    const secondHalf = velocityData.slice(mid).reduce((a, b) => a + b.badges, 0);
    if (firstHalf === 0 && secondHalf === 0) return 0;
    if (firstHalf === 0) return 100;
    return Number((((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1));
  }, [velocityData]);

  const usersTrend = React.useMemo(() => {
    if (usersSparkline.length < 2) return undefined;
    const mid = Math.floor(usersSparkline.length / 2);
    const firstHalf = usersSparkline.slice(0, mid).reduce((a, b) => a + b, 0);
    const secondHalf = usersSparkline.slice(mid).reduce((a, b) => a + b, 0);
    if (firstHalf === 0 && secondHalf === 0) return 0;
    if (firstHalf === 0) return 100;
    return Number((((secondHalf - firstHalf) / firstHalf) * 100).toFixed(1));
  }, [usersSparkline]);

  const isGuardActive =
    (serverSettings?.dailyPointsCap && serverSettings.dailyPointsCap > 0) ||
    (serverSettings?.isEnabled ?? true);

  const kpis = [
    {
      title: "Engaged Members",
      value: statsLoading ? "..." : totalUsers.toLocaleString(),
      trend: usersTrend,
      trendData: usersSparkline,
      icon: Users,
      colorScheme: "indigo" as const,
      tooltip: "Active members participating in gamification loops",
      href: "/gamification/points-and-badges/leaderboard",
    },
    {
      title: "Points Awarded",
      value: statsLoading ? "..." : totalPoints.toLocaleString(),
      trend: pointsTrend,
      trendData: pointsSparkline,
      icon: Zap,
      colorScheme: "orange" as const,
      suffix: " pts",
      tooltip: "Total gamification currency issued to members",
    },
    {
      title: "Badges Earned",
      value: statsLoading ? "..." : totalBadges.toLocaleString(),
      trend: badgesTrend,
      trendData: badgesSparkline,
      icon: Award,
      colorScheme: "purple" as const,
      tooltip: "Achievement credentials unlocked by community members",
      href: "/gamification/points-and-badges/badges",
    },
    {
      title: "Active Rules",
      value: rulesLoading ? "..." : activeRulesCount.toString(),
      trend: 0,
      trendData: [activeRulesCount, activeRulesCount, activeRulesCount],
      icon: Coins,
      colorScheme: "sky" as const,
      tooltip: "Configured triggers awarding points for member actions",
      href: "/gamification/points-and-badges/points",
    },
    {
      title: "Tier Ranks",
      value: ranksLoading ? "..." : activeRanksCount.toString(),
      trend: 0,
      trendData: [activeRanksCount, activeRanksCount, activeRanksCount],
      icon: Crown,
      colorScheme: "lime" as const,
      tooltip: "Configured tier levels with point unlock thresholds",
      href: "/gamification/points-and-badges/ranks",
    },
    {
      title: "Anti-Abuse Guard",
      value: settingsLoading
        ? "..."
        : serverSettings?.dailyPointsCap && serverSettings.dailyPointsCap > 0
          ? `${serverSettings.dailyPointsCap.toLocaleString()} pts/d`
          : serverSettings?.isEnabled
            ? "Active"
            : "Paused",
      trend: 0,
      trendData: [100, 100, 100],
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
              onClick={handleRefresh}
              title="Refresh Stats"
            >
              <RotateCcw
                size={13}
                className={cn((statsLoading || activityLoading) && "animate-spin")}
              />
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
          participationLift={usersTrend}
          antiAbuseLabel={
            serverSettings?.dailyPointsCap && serverSettings.dailyPointsCap > 0
              ? `${serverSettings.dailyPointsCap.toLocaleString()} pts/day cap`
              : isGuardActive
                ? "Protected"
                : "Paused"
          }
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
              <GamificationVelocityChart
                data={velocityData}
                totalPoints={totalPoints}
                velocityTrend={pointsTrend}
                loading={statsLoading || activityLoading}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <GamificationDistributionChart
                data={distributionData}
                totalPoints={totalPoints}
                loading={statsLoading || activityLoading}
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
            badgesCount={badges.length}
            ranksCount={activeRanksCount}
            topRankName={gamificationStats?.topRank?.name || ranks[ranks.length - 1]?.name || "None configured"}
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
            settings={serverSettings || storeSettings}
            reloginConfig={reloginConfig}
          />
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
