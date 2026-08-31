"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Trophy,
  RotateCcw,
  Users,
  History,
  Award,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  useGetCommunityKPIs,
  useGetFeatureModulePerformance,
  TimeRange,
} from "@/graphql/actions/dashboard";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  useGetStorageStats,
  useGetStorageSummary,
} from "@/graphql/storage/storage-hooks";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import {
  useGetLeaderboard,
  useGetGamificationActivityLog,
} from "@/graphql/actions/gamification/gamification-quiries";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useGetImpactUsers } from "@/graphql/actions";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";

// ---------------------------------------------------------------------------
// KPI Helpers
// ---------------------------------------------------------------------------
interface DashboardMetricValue {
  value?: string | number;
  change?: number;
  trend?: number[];
}

const isDashboardMetricValue = (
  value: unknown,
): value is DashboardMetricValue =>
  typeof value === "object" &&
  value !== null &&
  ("value" in value || "change" in value || "trend" in value);

import { DashboardContentBreakdownChart } from "./dashboard-content-breakdown-chart";
import { DashboardGrowthChart } from "./dashboard-growth-chart";
import { DashboardSectionHeading } from "./dashboard-section-heading";
import { DashboardCoreInsights } from "./dashboard-core-insights";
import { DashboardTrafficSessions } from "./dashboard-traffic-sessions";
import { DashboardContentFeed } from "./dashboard-content-feed";
import { DashboardAcquisition } from "./dashboard-acquisition";
import { DashboardSafetyModeration } from "./dashboard-safety-moderation";
import { DashboardQuickStats } from "./dashboard-quick-stats";
import { DashboardPlatformStorage } from "./dashboard-platform-storage";
import { ConversionFunnelCard } from "@/components/analytics";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formattedDateRange = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const {
    data: kpiData,
    loading: loadingKpis,
    refetch: refetchKpis,
  } = useGetCommunityKPIs(timeRangeMap[timeRange], formattedDateRange);

  const {
    data: featureData,
    loading: loadingFeatures,
    refetch: refetchFeatures,
  } = useGetFeatureModulePerformance(
    timeRangeMap[timeRange],
    formattedDateRange,
  );

  const loading = loadingKpis || loadingFeatures;
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchKpis(), refetchFeatures()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const { data: statsData, loading: statsLoading } = useGetStorageStats();
  const { data: summaryData, loading: summaryLoading } = useGetStorageSummary();

  const kpis = kpiData?.getCommunityKPIs;
  const featureModules = featureData?.getFeatureModulePerformance;
  const storageStats = statsData?.getStorageStats;
  const storageSummary = summaryData?.getStorageSummary;

  const { data: leaderboardData, loading: loadingLeaderboard } =
    useGetLeaderboard({
      variables: {
        pagination: { limit: 7, offset: 0 },
      },
    });

  const { data: activityLogData, loading: loadingActivityLog } =
    useGetGamificationActivityLog({
      variables: {
        input: { limit: 9, offset: 0 },
      },
    });

  const { data: impactData, loading: loadingImpact } = useGetImpactUsers({
    variables: {
      input: { limit: 7, offset: 0 },
    },
  });

  const getMetric = (key: string): DashboardMetricValue => {
    if (!kpis || !(key in kpis)) {
      return {};
    }

    const metric = kpis[key as keyof typeof kpis];
    return isDashboardMetricValue(metric) ? metric : {};
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Community Overview"
        description="Your community at a glance"
        icon={Activity}
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
              className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn((loading || isRefreshing) && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-5 space-y-5">
        {/* Subscription Limit Warning Banner */}
        <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />

        {/* 1. Core Stats */}
        <DashboardCoreInsights
          loading={loadingKpis}
          getMetric={getMetric}
          DashboardSectionHeading={DashboardSectionHeading}
        />

        <DashboardTrafficSessions
          DashboardSectionHeading={DashboardSectionHeading}
        />

        {/* 2. Content & Feed */}
        <DashboardContentFeed
          loading={loadingKpis}
          kpis={kpis}
          getMetric={getMetric}
          DashboardSectionHeading={DashboardSectionHeading}
        />

        {/* 3. Moderation Overview & Module Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <DashboardSafetyModeration
            kpis={kpis}
            DashboardSectionHeading={DashboardSectionHeading}
          />
          <DashboardQuickStats
            featureModules={featureModules}
            DashboardSectionHeading={DashboardSectionHeading}
          />
        </div>

        {/* 3.5. Insights Row (Growth & Content Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="space-y-3">
            <DashboardSectionHeading title="Community Growth" />
            <DashboardGrowthChart />
          </section>
          <section className="space-y-3">
            <DashboardSectionHeading title="Content Insights" />
            <DashboardContentBreakdownChart
              data={kpis?.contentTypeBreakdown || []}
              // loading={kpisLoading}
            />
          </section>
        </div>

        {/* ClickHouse Conversion Funnel */}
        <section className="space-y-3">
          <DashboardSectionHeading title="Event & Member Conversion Funnel" />
          <ConversionFunnelCard funnelType="EVENT_REGISTRATION" />
        </section>

        {/* 4. Growing & Keeping Members */}
        <DashboardAcquisition
          loading={loadingKpis}
          getMetric={getMetric}
          DashboardSectionHeading={DashboardSectionHeading}
        />

        {/* 4.5. Gamification Leaderboard + Activity Log + Impact Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Leaderboard */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="Gamification Leaderboard"
              icon={<Trophy className="h-3.5 w-3.5 text-muted-foreground" />}
              rightElement={
                <Link href="/gamification/points-and-badges/leaderboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05)] flex-1">
              {loadingLeaderboard ? (
                <div className="divide-y divide-border">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-3.5"
                    >
                      <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                      </div>
                      <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (leaderboardData?.getLeaderboard?.entries?.length ?? 0) ===
                0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Trophy className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-xs">No leaderboard data yet</span>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {leaderboardData?.getLeaderboard?.entries?.map((entry) => {
                    const user = entry?.user;
                    const rankColors: Record<number, string> = {
                      1: "text-yellow-500",
                      2: "text-slate-400",
                      3: "text-amber-600",
                    };
                    return (
                      <div
                        key={`${user?.id}-${entry.rank}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors",
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-bold tabular-nums w-6 text-center shrink-0",
                            rankColors[entry.rank] ||
                              "text-muted-foreground/50",
                          )}
                        >
                          {entry.rank <= 3
                            ? ["🥇", "🥈", "🥉"][entry.rank - 1]
                            : `#${entry.rank}`}
                        </span>

                        <UserProfileHoverCard
                          user={{
                            id: user?.id,
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            avatar: user?.avatar,
                          }}
                        >
                          <Link
                            href={`/members/${user?.id}`}
                            className="flex items-center gap-2.5 group min-w-0 flex-1"
                          >
                            <Avatar className="h-8 w-8 border border-border shrink-0">
                              <AvatarImage
                                src={`https://cdn.thrico.network/${user?.avatar}`}
                                alt={user?.firstName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                                {user?.firstName?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <span className="text-[13px] font-medium text-foreground truncate block group-hover:text-primary transition-colors">
                                {user?.firstName} {user?.lastName}
                              </span>
                              {entry?.currentRank && (
                                <span
                                  className="text-[9px] font-bold uppercase tracking-wider"
                                  style={{ color: entry.currentRank.color }}
                                >
                                  {entry.currentRank.icon}{" "}
                                  {entry.currentRank.name}
                                </span>
                              )}
                            </div>
                          </Link>
                        </UserProfileHoverCard>

                        <span className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                          {entry.totalPoints.toLocaleString()}
                          <span className="text-xs text-muted-foreground ml-0.5 font-normal">
                            pts
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Activity Log */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="Activity Log"
              icon={<History className="h-3.5 w-3.5 text-muted-foreground" />}
              rightElement={
                <Link href="/gamification/points-and-badges/leaderboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05)] flex-1">
              {loadingActivityLog ? (
                <div className="divide-y divide-border">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                        <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
                      </div>
                      <div className="h-3 w-10 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (activityLogData?.getGamificationActivityLog?.length ?? 0) ===
                0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <History className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-xs">No activity logged yet</span>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {activityLogData?.getGamificationActivityLog?.map((log) => {
                    const user = log.user;
                    const isBadge = log.type === "BADGE";
                    return (
                      <div
                        key={log.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors"
                      >
                        <UserProfileHoverCard
                          user={{
                            id: user?.id,
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            avatar: user?.avatar,
                          }}
                        >
                          <Link
                            href={`/members/${user?.id}`}
                            className="shrink-0"
                          >
                            <Avatar className="h-7 w-7 border border-border">
                              <AvatarImage
                                src={`https://cdn.thrico.network/${user?.avatar}`}
                                alt={user?.firstName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-medium uppercase">
                                {user?.firstName?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </UserProfileHoverCard>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <UserProfileHoverCard
                              user={{
                                id: user?.id,
                                firstName: user?.firstName,
                                lastName: user?.lastName,
                                avatar: user?.avatar,
                              }}
                            >
                              <Link
                                href={`/members/${user?.id}`}
                                className="text-[13px] font-medium text-foreground hover:text-primary transition-colors truncate"
                              >
                                {user?.firstName} {user?.lastName}
                              </Link>
                            </UserProfileHoverCard>
                            <span className="text-xs text-muted-foreground/50">
                              ·
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {(() => {
                                try {
                                  return formatDistanceToNow(
                                    new Date(log.createdAt),
                                    { addSuffix: true },
                                  );
                                } catch {
                                  return "";
                                }
                              })()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                            {isBadge ? (
                              <>
                                <Award className="inline h-3 w-3 text-indigo-500 mr-0.5 -mt-0.5" />
                                Earned{" "}
                                <span className="font-medium text-foreground/80">
                                  {log.badgeName || "badge"}
                                </span>
                              </>
                            ) : (
                              <>
                                {log.ruleDescription
                                  ?.replace(/_/g, " ")
                                  ?.toLowerCase() ||
                                  log.ruleDescription ||
                                  "Earned points"}
                              </>
                            )}
                          </p>
                        </div>

                        {log.points !== 0 && (
                          <span
                            className={cn(
                              "text-xs font-semibold tabular-nums shrink-0 px-1.5 py-0.5 rounded-full",
                              log.points > 0
                                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                                : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30",
                            )}
                          >
                            {log.points > 0 ? "+" : ""}
                            {log.points}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Impact Score */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="Impact Score"
              icon={<Users className="h-3.5 w-3.5 text-muted-foreground" />}
              rightElement={
                <Link href="/gamification/impact-score/members">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05)] flex-1">
              {loadingImpact ? (
                <div className="divide-y divide-border">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-3.5"
                    >
                      <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                      </div>
                      <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (impactData?.getImpactUsers?.nodes?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-xs">No impact data yet</span>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {impactData?.getImpactUsers?.nodes?.map(
                    (node: any, index: number) => {
                      const user = node?.user;
                      const rankColors: Record<number, string> = {
                        1: "text-yellow-500",
                        2: "text-slate-400",
                        3: "text-amber-600",
                      };
                      const rank = index + 1;
                      return (
                        <div
                          key={`${user?.id}-${rank}`}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors",
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-bold tabular-nums w-6 text-center shrink-0",
                              rankColors[rank] || "text-muted-foreground/50",
                            )}
                          >
                            {rank <= 3
                              ? ["🥇", "🥈", "🥉"][rank - 1]
                              : `#${rank}`}
                          </span>

                          <UserProfileHoverCard
                            user={{
                              id: user?.id,
                              firstName: user?.firstName,
                              lastName: user?.lastName,
                              avatar: user?.avatarUrl || user?.avatar,
                            }}
                          >
                            <Link
                              href={`/members/${user?.id}`}
                              className="flex items-center gap-2.5 group min-w-0 flex-1"
                            >
                              <Avatar className="h-8 w-8 border border-border shrink-0">
                                <AvatarImage
                                  src={`https://cdn.thrico.network/${user?.avatarUrl || user?.avatar}`}
                                  alt={user?.firstName}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                                  {user?.firstName?.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <span className="text-[13px] font-medium text-foreground truncate block group-hover:text-primary transition-colors">
                                  {user?.firstName} {user?.lastName}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {node?.tier}
                                </span>
                              </div>
                            </Link>
                          </UserProfileHoverCard>

                          <span className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                            {node.score.toLocaleString()}
                            <span className="text-xs text-muted-foreground ml-0.5 font-normal">
                              pts
                            </span>
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 5. Platform Storage & Subscription Details Row */}
        {/* 5. Platform Storage & Subscription Details Row */}
        <DashboardPlatformStorage
          statsLoading={statsLoading}
          summaryLoading={summaryLoading}
          storageStats={storageStats}
          storageSummary={storageSummary}
          DashboardSectionHeading={DashboardSectionHeading}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
