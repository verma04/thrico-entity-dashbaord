"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  TrendingDown,
  Zap,
  Heart,
  Star,
  FileText,
  Repeat,
  Shield,
  MessageSquare,
  Trophy,
  Calendar,
  ShoppingBag,
  Target,
  Sparkles,
  RotateCcw,
  LucideIcon,
  Users,
  Database,
  Info,
  History,
  Award,
  AlertTriangle,
  UserPlus,
  UserCheck,
  Camera,
  Image,
  Briefcase,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetCommunityKPIs,
  useGetFeatureModulePerformance,
  TimeRange,
} from "@/graphql/actions/dashboard";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { StorageStats } from "@/components/subscription/storage-stats";
import {
  useGetStorageStats,
  useGetStorageSummary,
} from "@/graphql/storage/storage-hooks";
import PlanOverview from "@/components/subscription/plan-overview";
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


import { DashboardDistributionChart } from "./dashboard-distribution-chart";
import { DashboardSessionRadarChart } from "./dashboard-session-radar-chart";
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
  const router = useRouter();
  const [timeRange, setTimeRange] = React.useState("7d");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // Determine time range loosely based on duration for fallback
    if (range?.from && range?.to) {
      const days = Math.round(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (days <= 1) setTimeRange("24h");
      else if (days <= 7) setTimeRange("7d");
      else if (days <= 30) setTimeRange("30d");
      else setTimeRange("90d");
    }
  };

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

  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
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

  const totalReported =
    kpis?.moderationStats?.reduce((acc, curr) => acc + curr.count, 0) || 0;



  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Community Overview"
        description="Your community at a glance"
        icon={Activity}
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

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="space-y-3">
            <DashboardSectionHeading title="Community Growth" />
            <DashboardGrowthChart />
          </section>
          <section className="space-y-3">
            <DashboardSectionHeading title="CONTENT INSIGHTS" />
            <DashboardContentBreakdownChart
              data={kpis?.contentTypeBreakdown || []}
              // loading={kpisLoading}
            />
          </section>
        </div>

        {/* 4. Growing & Keeping Members */}
        <DashboardAcquisition
          loading={loadingKpis}
          getMetric={getMetric}
          DashboardSectionHeading={DashboardSectionHeading}
        />

        {/* 4.5. Gamification Leaderboard + Activity Log + Impact Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-20">
          {/* Leaderboard */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="Gamification Leaderboard"
              icon={<Trophy className="h-3.5 w-3.5 text-amber-500" />}
              rightElement={
                <Link href="/gamification/leaderboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex-1">
              {loadingLeaderboard ? (
                <div className="divide-y divide-border/40">
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
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                  <Trophy className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-[11px]">No leaderboard data yet</span>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
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
                          "flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors",
                          entry.rank === 1 && "bg-yellow-500/[0.03]",
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
                            <Avatar className="h-8 w-8 border border-border/50 shadow-sm shrink-0">
                              <AvatarImage
                                src={`https://cdn.thrico.network/${user?.avatar}`}
                                alt={user?.firstName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold uppercase">
                                {user?.firstName?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <span className="text-[13px] font-semibold text-foreground truncate block group-hover:text-primary transition-colors">
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

                        <span className="text-[13px] font-bold text-foreground tabular-nums shrink-0">
                          {entry.totalPoints.toLocaleString()}
                          <span className="text-[9px] text-muted-foreground/60 ml-0.5 font-semibold">
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
              icon={<History className="h-3.5 w-3.5 text-indigo-500" />}
              rightElement={
                <Link href="/gamification/activity-log">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex-1">
              {loadingActivityLog ? (
                <div className="divide-y divide-border/40">
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
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                  <History className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-[11px]">No activity logged yet</span>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {activityLogData?.getGamificationActivityLog?.map((log) => {
                    const user = log.user;
                    const isBadge = log.type === "BADGE";
                    return (
                      <div
                        key={log.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
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
                            <Avatar className="h-7 w-7 border border-border/50 shadow-sm">
                              <AvatarImage
                                src={`https://cdn.thrico.network/${user?.avatar}`}
                                alt={user?.firstName}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-bold uppercase">
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
                                className="text-[12px] font-semibold text-foreground hover:text-primary transition-colors truncate"
                              >
                                {user?.firstName} {user?.lastName}
                              </Link>
                            </UserProfileHoverCard>
                            <span className="text-[10px] text-muted-foreground/50">
                              ·
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 shrink-0">
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
                          <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
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
                              "text-[12px] font-bold tabular-nums shrink-0",
                              log.points > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400",
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
              icon={<Users className="h-3.5 w-3.5 text-rose-500" />}
              rightElement={
                <Link href="/impact-score/members">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex-1">
              {loadingImpact ? (
                <div className="divide-y divide-border/40">
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
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                  <Users className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-[11px]">No impact data yet</span>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
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
                            "flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors",
                            rank === 1 && "bg-yellow-500/[0.03]",
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
                              <Avatar className="h-8 w-8 border border-border/50 shadow-sm shrink-0">
                                <AvatarImage
                                  src={`https://cdn.thrico.network/${user?.avatarUrl || user?.avatar}`}
                                  alt={user?.firstName}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold uppercase">
                                  {user?.firstName?.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <span className="text-[13px] font-semibold text-foreground truncate block group-hover:text-primary transition-colors">
                                  {user?.firstName} {user?.lastName}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {node?.tier}
                                </span>
                              </div>
                            </Link>
                          </UserProfileHoverCard>

                          <span className="text-[13px] font-bold text-foreground tabular-nums shrink-0">
                            {node.score.toLocaleString()}
                            <span className="text-[9px] text-muted-foreground/60 ml-0.5 font-semibold">
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
