"use client";

import React, { useState } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Heart,
  Star,
  FileText,
  Repeat,
  Eye,
  Shield,
  MessageSquare,
  Trophy,
  Calendar,
  ShoppingBag,
  Target,
  Sparkles,
  RefreshCcw,
  LucideIcon,
  Circle,
  Users,
  Database,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useGetCommunityKPIs, TimeRange } from "@/graphql/actions/dashboard";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { StorageStats } from "@/components/subscription/storage-stats";
import PlanOverview from "@/components/subscription/plan-overview";
import {
  useGetStorageStats,
  useGetStorageSummary,
} from "@/graphql/storage/storage-hooks";

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------
interface CommunityKPICardProps {
  title: string;
  value: string | number;
  change: number;
  trend: number[];
  icon?: LucideIcon;
  statusColor?: string;
  subtext?: string;
}

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

const CommunityKPICard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  statusColor = "bg-emerald-500",
  subtext = "vs last period",
}: CommunityKPICardProps) => {
  const isPositive = change >= 0;
  const chartData = trend.map((val, i) => ({ value: val, id: i }));

  return (
    <div className="h-[170px] group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background via-background to-muted/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_90%_10%,hsl(var(--primary)/0.12),transparent_45%)]" />
      {/* Top Header */}
      <div className="relative flex items-start justify-between mb-3">
        <span className="text-[10px] font-semibold text-muted-foreground/85 uppercase tracking-[0.18em] leading-none">
          {title}
        </span>
        {Icon ? (
          <div className="h-8 w-8 rounded-lg border border-border/60 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground/80" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-lg border border-border/60 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className={cn("h-2.5 w-2.5 rounded-full", statusColor)} />
          </div>
        )}
      </div>

      {/* Main Value & Change */}
      <div className="relative mb-5">
        <h3 className="text-3xl font-semibold text-foreground tracking-tight mb-1.5 tabular-nums">
          {typeof value === "number" ? Math.round(value) : value}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-semibold border",
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-300"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-300",
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {isPositive ? "+" : ""}
            {typeof change === "number" ? Math.round(change) : change}%
          </div>
          <span className="text-[10px] font-medium text-muted-foreground/65 uppercase tracking-wider">
            {subtext}
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="relative h-10 -mx-5 -mb-5 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`gradient-${title.replace(/\s+/g, "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#10b981" : "#f43f5e"}
                  stopOpacity={0.08}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#10b981" : "#f43f5e"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#f43f5e"}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#gradient-${title.replace(/\s+/g, "")})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Module Performance Card
// ---------------------------------------------------------------------------
const ModulePerformanceCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = "text-primary",
}: {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  color?: string;
}) => (
  <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-background to-muted/20 p-4 shadow-sm transition-all duration-300 group hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg">
    <div className="flex items-center gap-3.5">
      <div className="h-10 w-10 rounded-xl bg-background border border-border/70 flex items-center justify-center group-hover:scale-105 transition-transform">
        <Icon className={cn("h-4.5 w-4.5", color)} />
      </div>
      <div className="min-w-0">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1.5">
          {title}
        </h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold text-foreground tracking-tight tabular-nums">
            {value}
          </span>
          <span className="text-[10px] text-muted-foreground/60 truncate">
            {subtext}
          </span>
        </div>
      </div>
    </div>
  </div>
);
import { DashboardDistributionChart } from "./dashboard-distribution-chart";

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [showAllContentTypes, setShowAllContentTypes] = useState(false);
  const [showAllFeatureModules, setShowAllFeatureModules] = useState(false);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);

    // Simple mapping logic: if the range matches a preset, set the enum
    if (!range?.from || !range?.to) return;

    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
    // If custom, we currently still use the closest enum until backend supports custom
  };

  const { data, loading, refetch } = useGetCommunityKPIs(
    timeRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined,
  );

  const { data: statsData, loading: statsLoading } = useGetStorageStats();
  const { data: summaryData, loading: summaryLoading } = useGetStorageSummary();

  const kpis = data?.getCommunityKPIs;
  const storageStats = statsData?.getStorageStats;
  const storageSummary = summaryData?.getStorageSummary;

  const vitals = [
    {
      title: "Daily Active Users",
      key: "dailyActiveUsers",
      color: "bg-emerald-500",
    },
    {
      title: "Monthly Active Users",
      key: "monthlyActiveUsers",
      color: "bg-blue-500",
    },
    { title: "Engagement Rate", key: "engagementRate", color: "bg-amber-400" },
    { title: "Retention Rate", key: "retentionRate", color: "bg-indigo-500" },
    { title: "New Members", key: "newMembers", color: "bg-cyan-500" },
    { title: "Churn Rate", key: "churnRate", color: "bg-rose-500" },
    { title: "Community Health", key: "healthIndex", color: "bg-red-500" },
    { title: "Member Happiness", key: "communityNPS", color: "bg-yellow-400" },
  ];

  const contentFeed = [
    { title: "Total Posts", key: "totalPosts", icon: FileText },
    { title: "Post Frequency", key: "contributionFrequency", icon: Zap },
    { title: "Reply Rate", key: "interactionReciprocity", icon: Repeat },
    { title: "Post Views", key: "contentReach", icon: Eye },
  ];

  const acquisitionRet = [
    { title: "Member Activation", key: "memberActivationRate", icon: Target },
    { title: "Word of Mouth", key: "communityAdvocacyIndex", icon: Heart },
    { title: "Superfan Count", key: "superfanRatio", icon: Star },
  ];

  const modulePerformanceList = [
    { title: "Communities", icon: Users, color: "text-blue-600" },
    { title: "Events", icon: Calendar, color: "text-orange-600" },
    { title: "Jobs", icon: Target, color: "text-emerald-600" },
    { title: "Shop & Listings", icon: ShoppingBag, color: "text-purple-600" },
    { title: "Polls & Surveys", icon: FileText, color: "text-yellow-600" },
    { title: "Discussions", icon: MessageSquare, color: "text-pink-600" },
    { title: "Gamification", icon: Trophy, color: "text-amber-600" },
    { title: "Leaderboard", icon: Trophy, color: "text-yellow-600" },
    { title: "Offers", icon: Target, color: "text-rose-600" },
    { title: "Stories", icon: Sparkles, color: "text-violet-600" },
    { title: "Mentorship", icon: Users, color: "text-cyan-600" },
    { title: "Moderation", icon: Shield, color: "text-red-600" },
  ];

  const getMetric = (key: string): DashboardMetricValue => {
    if (!kpis || !(key in kpis)) {
      return {};
    }

    const metric = kpis[key as keyof typeof kpis];
    return isDashboardMetricValue(metric) ? metric : {};
  };

  const visibleFeatureModules = showAllFeatureModules
    ? modulePerformanceList
    : modulePerformanceList.slice(0, 9);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Community Overview"
        badgeText="Live Stats"
        description="Track how your community is growing, engaging, and interacting in real-time."
        icon={Activity}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                All systems running normally
              </span>
            </div>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Item>
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3.5 rounded-xl text-xs gap-2 border-border/70 bg-background/80 backdrop-blur-sm hover:bg-muted/60"
            onClick={() => refetch()}
          >
            <RefreshCcw
              className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            className="h-9 px-4 rounded-xl text-xs gap-2 shadow-sm shadow-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Insights
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 py-8 px-4 lg:px-6 border-none bg-transparent shadow-none ring-0">
        {/* 1. Core Stats */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              Core Community Stats
            </span>
            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {vitals.map((v) => {
              const item = getMetric(v.key);
              return (
                <CommunityKPICard
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  change={item?.change ?? 0}
                  trend={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  statusColor={v.color}
                />
              );
            })}
          </div>
        </section>

        {/* Device Distribution Chart */}
        <DashboardDistributionChart />
        {/* <DashboardLoginSessionsChart /> */}

        {/* 2. Content & Feed */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              Content & Feed
            </span>
            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {contentFeed.map((v) => {
                const item = getMetric(v.key);
                return (
                  <CommunityKPICard
                    key={v.key}
                    title={v.title}
                    value={loading ? "..." : (item?.value ?? "0")}
                    change={item?.change ?? 0}
                    trend={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                    icon={v.icon}
                  />
                );
              })}
            </div>

            {/* Content Type Breakdown */}
            <div className="lg:col-span-4 rounded-2xl border border-border/60 bg-gradient-to-b from-background to-muted/25 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-semibold text-foreground uppercase tracking-[0.16em]">
                  What members are posting
                </h3>
                {kpis?.contentTypeBreakdown &&
                  kpis.contentTypeBreakdown.length > 3 && (
                    <Button
                      variant="link"
                      className="text-[10px] text-muted-foreground font-medium p-0 h-auto"
                      onClick={() =>
                        setShowAllContentTypes(!showAllContentTypes)
                      }
                    >
                      {showAllContentTypes ? "View less ←" : "View all →"}
                    </Button>
                  )}
              </div>
              <div className="space-y-5">
                {(showAllContentTypes
                  ? kpis?.contentTypeBreakdown
                  : kpis?.contentTypeBreakdown?.slice(0, 3)
                )?.map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-medium capitalize">
                        {item?.type?.toLowerCase() === "dashboard"
                          ? "Text feed"
                          : item?.type?.replace(/[-_]/g, " ")?.toLowerCase()}
                      </span>
                      <span className="text-foreground font-semibold tabular-nums">
                        {Math?.round(item?.percentage)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 shadow-sm",
                          i === 0
                            ? "bg-indigo-500"
                            : i === 1
                              ? "bg-purple-500"
                              : i === 2
                                ? "bg-pink-500"
                                : i === 3
                                  ? "bg-amber-500"
                                  : "bg-muted-foreground/30",
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                )) || (
                  <div className="flex flex-col items-center justify-center h-36 text-muted-foreground/40 text-[11px]">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Moderation Overview & Module Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Moderation */}
          <section className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-rose-500" />
                <h2 className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Safety & Moderation
                </h2>
              </div>
              <div className="text-rose-600 dark:text-rose-400 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                7 pending
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-background to-muted/20 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40">
                    <th className="px-4 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-4 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis?.moderationStats?.map((stat, i) => (
                    <tr key={i} className="hover:bg-muted/35 transition-colors">
                      <td className="px-4 py-3 text-[12px] text-foreground/80">
                        {stat.type}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-foreground tabular-nums">
                        {stat.count}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Circle
                            className={cn(
                              "h-1.5 w-1.5 fill-current",
                              stat.status === "Urgent"
                                ? "text-rose-500"
                                : stat.status === "Review"
                                  ? "text-amber-500"
                                  : "text-emerald-500",
                            )}
                          />
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                            {stat.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-[11px] text-muted-foreground/50"
                      >
                        No active alerts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Module Performance Grid */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  How people use features
                </span>
                <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 min-w-10" />
              </div>
              {modulePerformanceList.length > 9 && (
                <Button
                  variant="link"
                  className="text-[10px] text-muted-foreground font-medium p-0 h-auto"
                  onClick={() => setShowAllFeatureModules((prev) => !prev)}
                >
                  {showAllFeatureModules ? "View less ←" : "View all →"}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {visibleFeatureModules.map((mod) => {
                const dataItem = kpis?.modulePerformance?.find(
                  (m) => m.module === mod.title,
                );
                return (
                  <ModulePerformanceCard
                    key={mod.title}
                    title={mod.title}
                    icon={mod.icon}
                    value={dataItem?.value?.toString() ?? "0"}
                    subtext={dataItem?.subtext ?? "Initializing..."}
                    color={mod.color}
                  />
                );
              })}
            </div>
          </section>
        </div>

        {/* 4. Storage & Acquisition/Retention Combined Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Storage Stats */}
          <section className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-800" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-[0.14em]">
                Platform Storage
              </h2>
            </div>
            <div className="h-full">
              {statsLoading || summaryLoading ? (
                <div className="h-[280px] border border-border/70 rounded-2xl bg-gradient-to-b from-background to-muted/25 animate-pulse flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Crunching usage data...
                  </span>
                </div>
              ) : (
                <StorageStats stats={storageStats} summary={storageSummary} />
              )}
            </div>
          </section>

          {/* Growing & Keeping Members (Acquisition & Retention) */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Growing & Keeping Members
              </span>
              <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {acquisitionRet.map((v) => {
                const item = getMetric(v.key);
                return (
                  <CommunityKPICard
                    key={v.key}
                    title={v.title}
                    value={loading ? "..." : (item?.value ?? "0")}
                    change={item?.change ?? 0}
                    trend={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                    icon={v.icon}
                  />
                );
              })}
            </div>
          </section>
        </div>

        {/* 5. Subscription Details */}
        <section className="space-y-4 mt-16">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              Subscription Details
            </span>
            <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
          </div>
          <PlanOverview />
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
