"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ShieldCheck,
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
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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
  suffix?: string;
  tooltip?: string;
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
  suffix = "",
  tooltip,
}: CommunityKPICardProps) => {
  const isPositive = change >= 0;
  const chartData = trend.map((val, i) => ({ value: val, id: i }));
  const isLoading = value === "...";

  // Derive accent color from statusColor for the top strip
  const accentColorMap: Record<string, string> = {
    "bg-emerald-500": "from-emerald-400 to-emerald-600",
    "bg-blue-500": "from-blue-400 to-blue-600",
    "bg-amber-400": "from-amber-300 to-amber-500",
    "bg-indigo-500": "from-indigo-400 to-indigo-600",
    "bg-cyan-500": "from-cyan-400 to-cyan-600",
    "bg-rose-500": "from-rose-400 to-rose-600",
    "bg-red-500": "from-red-400 to-red-600",
    "bg-yellow-400": "from-yellow-300 to-yellow-500",
  };
  const accentGradient =
    accentColorMap[statusColor] ?? "from-primary to-primary/60";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md flex flex-col justify-between">
      {/* Colored top accent strip */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r",
          accentGradient,
          "opacity-80",
        )}
      />
      {/* Subtle hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_80%_0%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative p-4 flex flex-col flex-1">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-[0.22em] leading-none">
              {title}
            </span>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/40 cursor-help hover:text-muted-foreground/70 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] bg-popover border border-border/60 text-foreground shadow-xl">
                    <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                      {tooltip}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {Icon ? (
            <div className="h-7 w-7 rounded-lg border border-border/50 bg-muted/60 flex items-center justify-center group-hover:bg-muted transition-colors">
              <Icon className="h-3 w-3 text-muted-foreground/70" />
            </div>
          ) : (
            <div className="h-7 w-7 rounded-lg border border-border/50 bg-muted/60 flex items-center justify-center">
              <div className={cn("h-2 w-2 rounded-full", statusColor)} />
            </div>
          )}
        </div>

        {/* Main Value & Change */}
        {isLoading ? (
          <div className="mb-3 space-y-1.5">
            <div className="h-6 w-20 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-14 rounded-full bg-muted animate-pulse" />
          </div>
        ) : (
          <div className="mb-3">
            <h3 className="text-[1.4rem] font-bold text-foreground tracking-tight leading-none mb-1.5 tabular-nums">
              {typeof value === "number"
                ? Math.round(value).toLocaleString()
                : value}
              {suffix}
            </h3>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold",
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-2 w-2" />
                ) : (
                  <TrendingDown className="h-2 w-2" />
                )}
                {isPositive ? "+" : ""}
                {typeof change === "number" ? Math.round(change) : change}%
              </div>
              <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                {subtext}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sparkline — flush to bottom */}
      <div className="relative h-9 -mx-0 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
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
                  stopOpacity={0.15}
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
              dot={false}
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
// Map color class to border/bg accent
const colorToBorderMap: Record<string, { border: string; bg: string }> = {
  "text-blue-600": { border: "border-l-blue-500", bg: "bg-blue-500/8" },
  "text-orange-600": { border: "border-l-orange-500", bg: "bg-orange-500/8" },
  "text-emerald-600": {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/8",
  },
  "text-purple-600": { border: "border-l-purple-500", bg: "bg-purple-500/8" },
  "text-violet-600": { border: "border-l-violet-500", bg: "bg-violet-500/8" },
  "text-yellow-600": { border: "border-l-yellow-500", bg: "bg-yellow-500/8" },
  "text-amber-600": { border: "border-l-amber-500", bg: "bg-amber-500/8" },
  "text-pink-600": { border: "border-l-pink-500", bg: "bg-pink-500/8" },
  "text-cyan-600": { border: "border-l-cyan-500", bg: "bg-cyan-500/8" },
  "text-red-600": { border: "border-l-red-500", bg: "bg-red-500/8" },
  "text-rose-600": { border: "border-l-rose-500", bg: "bg-rose-500/8" },
};

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
}) => {
  const accent = colorToBorderMap[color] ?? {
    border: "border-l-primary",
    bg: "bg-primary/5",
  };
  return (
    <div
      className={cn(
        "rounded-xl border border-l-[3px] border-border/50 bg-card p-3.5 shadow-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 flex items-center gap-3",
        accent.border,
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110",
          accent.bg,
        )}
      >
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em] leading-none mb-1.5">
          {title}
        </h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-foreground tracking-tight tabular-nums leading-none">
            {value}
          </span>
          <span className="text-[9px] text-muted-foreground/50 truncate leading-none">
            {subtext}
          </span>
        </div>
      </div>
    </div>
  );
};
import { DashboardDistributionChart } from "./dashboard-distribution-chart";
import { DashboardSessionRadarChart } from "./dashboard-session-radar-chart";
import { DashboardContentBreakdownChart } from "./dashboard-content-breakdown-chart";
import { DashboardGrowthChart } from "./dashboard-growth-chart";
import { DashboardSectionHeading } from "./dashboard-section-heading";

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
  const [timeRange, setTimeRange] = React.useState("7d");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [showAllContentTypes, setShowAllContentTypes] = useState(false);
  const [showAllFeatureModules, setShowAllFeatureModules] = useState(false);

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
  const refetch = () => {
    refetchKpis();
    refetchFeatures();
  };

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

  const vitals = [
    {
      title: "New Members",
      key: "newMembers",
      color: "bg-cyan-500",
      tooltip: "Members who joined during the selected period",
    },
    {
      title: "Active Members",
      key: "activeUsers",
      color: "bg-emerald-500",
      tooltip: "Count of unique members active within the selected date range",
    },
    {
      title: "Blocked Members",
      key: "blockMembers",
      color: "bg-blue-500",
      tooltip: "Total blocked members across the platform",
    },
    {
      title: "Engagement Rate",
      key: "engagementRate",
      color: "bg-amber-400",
      suffix: "%",
      tooltip: "(DAU / Total Members) × 100",
    },
    {
      title: "Retention Rate",
      key: "retentionRate",
      color: "bg-indigo-500",
      suffix: "%",
      tooltip: "(MAU / Total Members) × 100",
    },

    {
      title: "Churn Rate",
      key: "churnRate",
      color: "bg-rose-500",
      suffix: "%",
      tooltip: "((Total Members - DAU) / Total Members) × 100",
    },
    {
      title: "Community Health",
      key: "healthIndex",
      color: "bg-red-500",
      tooltip:
        "Weighted Avg: Engagement (40%) + Retention (40%) + Content Activity (20%)",
    },
    {
      title: "Member Happiness",
      key: "communityNPS",
      color: "bg-yellow-400",
      tooltip: "Engagement Rate × 1.2 - Churn Rate × 0.5",
    },
  ];

  const contentFeed = [
    {
      title: "Total Posts",
      key: "totalPosts",
      icon: FileText,
      tooltip: "Total feed entries, stories, and discussions",
    },
    {
      title: "Post Frequency",
      key: "contributionFrequency",
      icon: Zap,
      suffix: "/wk",
      tooltip: "(Total Posts / DAU / Days in Period) × 7",
    },
    {
      title: "Reply Rate",
      key: "interactionReciprocity",
      icon: Repeat,
      suffix: "%",
      tooltip: "(Feed Comments / Total Posts) × 100",
    },
  ];

  const acquisitionRet = [
    {
      title: "Member Activation",
      key: "memberActivationRate",
      icon: Target,
      suffix: "%",
      tooltip: "((New Members who posted) / New Members) × 100",
    },
    {
      title: "Advocacy Index",
      key: "communityAdvocacyIndex",
      icon: Heart,
      tooltip: "(New Members / DAU) × 10",
    },
    {
      title: "Superfan Count",
      key: "superfanRatio",
      icon: Star,
      suffix: "%",
      tooltip: "((DAU × 0.12) / Total Members) × 100",
    },
    {
      title: "Referrals Joined",
      key: "referralsJoined",
      icon: Users,
      tooltip: "Members who joined via a referral link",
    },
    {
      title: "Gamification Points",
      key: "gamificationPointsEarned",
      icon: Zap,
      tooltip: "Total gamification points earned by members",
    },
    {
      title: "Badges Earned",
      key: "badgesEarned",
      icon: Trophy,
      tooltip: "Total badges earned by members",
    },
    {
      title: "Leaderboard Players",
      key: "leaderboardParticipants",
      icon: Trophy,
      tooltip: "Total participants actively competing on the leaderboard",
    },
    {
      title: "Currency Payouts",
      key: "totalCurrencyPayouts",
      icon: Zap,
      tooltip: "Total currency payouts distributed to members",
    },
  ];

  const modulePerformanceList = [
    {
      title: "Communities",
      icon: Users,
      color: "text-blue-600",
      href: "/communities",
    },
    {
      title: "Events",
      icon: Calendar,
      color: "text-orange-600",
      href: "/events",
    },
    { title: "Jobs", icon: Target, color: "text-emerald-600", href: "/jobs" },
    {
      title: "Shop",
      icon: ShoppingBag,
      color: "text-purple-600",
      href: "/shop",
    },
    {
      title: "Listings",
      icon: ShoppingBag,
      color: "text-violet-600",
      href: "/marketplace",
    },
    {
      title: "Polls",
      icon: FileText,
      color: "text-yellow-600",
      href: "/polls/page",
    },
    {
      title: "Surveys",
      icon: FileText,
      color: "text-amber-600",
      href: "/polls/page",
    },
    {
      title: "Discussions",
      icon: MessageSquare,
      color: "text-pink-600",
      href: "/forums/page",
    },
    { title: "Gamification", icon: Trophy, color: "text-amber-600" },
    {
      title: "Leaderboard",
      icon: Trophy,
      color: "text-yellow-600",
      href: "/leaderboard",
    },
    {
      title: "Offers",
      icon: Target,
      color: "text-rose-600",
      href: "/offers/page",
    },
    { title: "Stories", icon: Sparkles, color: "text-violet-600" },
    {
      title: "Mentorship",
      icon: Users,
      color: "text-cyan-600",
      href: "/mentorship",
    },
    {
      title: "Moderation",
      icon: Shield,
      color: "text-red-600",
      href: "/moderation",
    },
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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Node
            </span>
          </div>

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
              onClick={() => refetch()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-8 py-8 px-4 lg:px-6 border-none bg-transparent shadow-none ring-0">
        {/* 1. Core Stats */}
        <section className="space-y-3">
          <DashboardSectionHeading title="Core Community Stats" />
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
                  suffix={(v as any).suffix}
                  tooltip={(v as any).tooltip}
                />
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <section className="lg:col-span-7 space-y-4">
            <DashboardSectionHeading title="Platform Traffic" />
            <DashboardDistributionChart />
          </section>
          <section className="lg:col-span-3 space-y-4">
            <DashboardSectionHeading title="Login Sessions" />
            <DashboardSessionRadarChart />
          </section>
        </div>

        {/* 2. Content & Feed */}
        <section className="space-y-3 mt-20">
          <DashboardSectionHeading title="Content & Feed" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
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
                    suffix={(v as any).suffix}
                    tooltip={(v as any).tooltip}
                  />
                );
              })}
            </div>

            {/* Content Type Breakdown */}
            <div className="lg:col-span-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-0.5">
                    What members post
                  </p>
                  <h3 className="text-sm font-semibold text-foreground leading-none">
                    Content Mix
                  </h3>
                </div>
                {kpis?.contentTypeBreakdown &&
                  kpis.contentTypeBreakdown.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] text-muted-foreground font-medium h-7 px-2 rounded-lg hover:bg-muted"
                      onClick={() =>
                        setShowAllContentTypes(!showAllContentTypes)
                      }
                    >
                      {showAllContentTypes ? "Less" : "More"}
                    </Button>
                  )}
              </div>
              <div className="space-y-4">
                {(showAllContentTypes
                  ? kpis?.contentTypeBreakdown
                  : kpis?.contentTypeBreakdown?.slice(0, 2)
                )?.map((item, i) => {
                  const barColors = [
                    "bg-gradient-to-r from-indigo-500 to-blue-400",
                    "bg-gradient-to-r from-violet-500 to-purple-400",
                    "bg-gradient-to-r from-pink-500 to-rose-400",
                    "bg-gradient-to-r from-amber-500 to-orange-400",
                    "bg-gradient-to-r from-emerald-500 to-teal-400",
                  ];
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-foreground/80 font-medium capitalize">
                          {item?.type?.toLowerCase() === "dashboard"
                            ? "Text feed"
                            : item?.type?.replace(/[-_]/g, " ")?.toLowerCase()}
                        </span>
                        <span className="text-[11px] font-bold text-foreground tabular-nums">
                          {Math?.round(item?.percentage)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700 ease-out",
                            barColors[i % barColors.length],
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }) || (
                  <div className="flex flex-col items-center justify-center h-36 text-muted-foreground/40 text-[11px]">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Moderation Overview & Module Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Moderation */}
          <section className="lg:col-span-4 space-y-3">
            <DashboardSectionHeading
              title="Safety & Moderation"
              icon={<Shield className="h-3.5 w-3.5 text-rose-500" />}
              titleClassName="text-rose-600 dark:text-rose-400"
              rightElement={
                <div className="text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 tabular-nums">
                  {kpis?.moderationStats?.reduce(
                    (acc, s) =>
                      acc +
                      (s.status === "Urgent" || s.status === "Review"
                        ? s.count
                        : 0),
                    0,
                  ) ?? 0}{" "}
                  pending
                </div>
              }
            />

            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-3 border-b border-border/50 bg-muted/30 px-4 py-2.5">
                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                  Type
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                  Count
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                  Status
                </span>
              </div>
              <div className="divide-y divide-border/40">
                {kpis?.moderationStats?.map((stat, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 items-center px-4 py-3 hover:bg-muted/25 transition-colors"
                  >
                    <span className="text-[12px] text-foreground/85 font-medium truncate pr-2">
                      {stat.type}
                    </span>
                    <span className="text-[13px] font-bold text-foreground tabular-nums">
                      {stat.count}
                    </span>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                          stat.status === "Urgent"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : stat.status === "Review"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1 w-1 rounded-full",
                            stat.status === "Urgent"
                              ? "bg-rose-500"
                              : stat.status === "Review"
                                ? "bg-amber-500"
                                : "bg-emerald-500",
                          )}
                        />
                        {stat.status}
                      </span>
                    </div>
                  </div>
                )) || (
                  <div className="px-4 py-10 text-center text-[11px] text-muted-foreground/40">
                    <Shield className="h-6 w-6 mx-auto mb-2 opacity-30" />
                    No active alerts
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Module Performance Grid */}
          <section className="lg:col-span-8 space-y-3">
            <DashboardSectionHeading
              title="Feature Modules"
              rightElement={
                modulePerformanceList.length > 9 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                    onClick={() => setShowAllFeatureModules((prev) => !prev)}
                  >
                    {showAllFeatureModules ? "View less" : "View More"}
                  </Button>
                )
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {visibleFeatureModules.map((mod) => {
                const dataItem = featureModules?.find(
                  (m) =>
                    m.module.toLowerCase() === mod.title.toLowerCase() ||
                    m.module.includes(mod.title) ||
                    mod.title.includes(m.module),
                );
                const card = (
                  <ModulePerformanceCard
                    title={mod.title}
                    icon={mod.icon}
                    value={dataItem?.value?.toString() ?? "0"}
                    subtext={dataItem?.subtext ?? "Initializing..."}
                    color={mod.color}
                  />
                );

                return mod.href ? (
                  <Link href={mod.href} key={mod.title} className="block">
                    {card}
                  </Link>
                ) : (
                  <div key={mod.title}>{card}</div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 3.5. Insights Row (Growth & Content Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="space-y-3">
            <DashboardSectionHeading title="Community Growth" />
            <DashboardGrowthChart />
          </section>
          <section className="space-y-3">
            <DashboardSectionHeading title="Content Breakdown" />
            <DashboardContentBreakdownChart
              data={kpis?.contentTypeBreakdown || []}
              // loading={kpisLoading}
            />
          </section>
        </div>

        {/* 4. Growing & Keeping Members */}
        <section className="space-y-3 mt-20">
          <DashboardSectionHeading title="Growing & Keeping Members" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  suffix={(v as any).suffix}
                  tooltip={(v as any).tooltip}
                />
              );
            })}
          </div>
        </section>

        {/* 4.5. Gamification Leaderboard + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-20">
          {/* Leaderboard */}
          <section className="space-y-3">
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
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
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
          <section className="space-y-3">
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
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
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
        </div>

        {/* 5. Platform Storage & Subscription Details Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Storage Stats */}
          <section className="lg:col-span-4 space-y-3">
            <DashboardSectionHeading
              title="Platform Storage"
              icon={<Database className="h-3.5 w-3.5 text-slate-500" />}
            />
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

          {/* Subscription Details */}
          <section className="lg:col-span-8 space-y-3">
            <DashboardSectionHeading title="Subscription Details" />
            <div className="h-full">
              <PlanOverview />
            </div>
          </section>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
