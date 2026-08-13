"use client";

import React from "react";
import {
  Users,
  RotateCcw,
  Activity,
  UserPlus,
  TrendingUp,
  Target,
  TrendingDown,
  Heart,
  CheckCircle,
  RefreshCw,
  FileText,
  Zap,
  Reply,
  Eye,
  Flame,
  BarChart3,
  Calendar,
  Layers,
  Star,
  Trophy,
  Crown,
  Coins,
  DollarSign,
  Percent,
  HeartPulse,
  Smile,
  Shield,
  AlertTriangle,
  ShieldBan,
  Sparkles,
  UserCheck,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import {
  useGetMemberKPIDashboard,
  TimeRange,
  type StatValue,
} from "@/graphql/actions/member-kpi-dashboard";

// ---------------------------------------------------------------------------
// KPI Helpers (same pattern as home dashboard)
// ---------------------------------------------------------------------------
const isDashboardMetricValue = (value: unknown): value is StatValue =>
  typeof value === "object" &&
  value !== null &&
  ("value" in value || "change" in value || "trend" in value);

// ---------------------------------------------------------------------------
// KPI Definitions
// ---------------------------------------------------------------------------

const membershipHealthKPIs = [
  {
    title: "Total Members",
    key: "totalMembers",
    icon: Users,
    color: "bg-cyan-500",
    tooltip: "COUNT(members WHERE status != 'deleted')",
  },
  {
    title: "Active Members",
    key: "activeUsers",
    icon: Activity,
    color: "bg-emerald-500",
    tooltip: "Unique members active within the selected date range",
    href: "/members/all?filter=active",
  },
  {
    title: "Active Member Rate",
    key: "engagementRate",
    icon: Target,
    color: "bg-amber-400",
    suffix: "%",
    tooltip: "(Active Members ÷ Total Members) × 100",
  },
  {
    title: "Blocked Members",
    key: "blockMembers",
    icon: ShieldBan,
    color: "bg-rose-500",
    tooltip: "Members currently blocked across the platform",
    href: "/members/all?filter=blocked",
  },
];

const growthRetentionKPIs = [
  {
    title: "New Members (30d)",
    key: "newMembers",
    icon: UserPlus,
    color: "bg-cyan-500",
    tooltip: "COUNT(members WHERE created_at ≥ today − 30d)",
  },
  {
    title: "Member Growth Rate",
    key: "memberGrowthRate",
    icon: TrendingUp,
    color: "bg-indigo-500",
    suffix: "%",
    tooltip: "((Members_end − Members_start) ÷ Members_start) × 100",
  },
  {
    title: "Activation Rate",
    key: "memberActivationRate",
    icon: Target,
    color: "bg-emerald-500",
    suffix: "%",
    tooltip:
      "(New members reaching activation milestone within 7d ÷ Total new members) × 100",
  },
  {
    title: "Churn Rate",
    key: "churnRate",
    icon: TrendingDown,
    color: "bg-rose-500",
    suffix: "%",
    tooltip: "(Members lost ÷ Members at period start) × 100",
  },
  {
    title: "Retention Rate (90d)",
    key: "retentionRate",
    icon: Heart,
    color: "bg-indigo-500",
    suffix: "%",
    tooltip: "(90d cohort still active ÷ Original cohort size) × 100",
  },
  {
    title: "Referrals Joined",
    key: "referralsJoined",
    icon: Users,
    color: "bg-amber-500",
    tooltip: "COUNT(members WHERE signup_source = 'referral')",
    href: "/members/referrals",
  },
  {
    title: "Onboarding Rate",
    key: "onboardingCompletionRate",
    icon: CheckCircle,
    color: "bg-blue-500",
    suffix: "%",
    tooltip: "Percentage of new members who completed onboarding",
  },
  {
    title: "Re-engagement",
    key: "reEngagementRecoveryRate",
    icon: RefreshCw,
    color: "bg-violet-500",
    suffix: "%",
    tooltip: "Dormant members who became active again",
  },
];

const engagementKPIs = [
  {
    title: "Total Posts",
    key: "totalPosts",
    icon: FileText,
    color: "bg-indigo-500",
    tooltip: "Total feed entries, stories, and discussions",
  },
  {
    title: "Post Frequency",
    key: "contributionFrequency",
    icon: Zap,
    color: "bg-cyan-500",
    suffix: "/wk",
    tooltip: "(Total Posts / Active Members / Days) × 7",
  },
  {
    title: "Reply Rate",
    key: "interactionReciprocity",
    icon: Reply,
    color: "bg-violet-500",
    suffix: "%",
    tooltip: "Comment-to-Post ratio: (Total Comments ÷ Total Posts) × 100",
  },
  {
    title: "Content Reach",
    key: "contentReach",
    icon: Eye,
    color: "bg-emerald-500",
    tooltip: "Total impressions / views on community content",
  },
  {
    title: "Virality Rate",
    key: "contentViralityRate",
    icon: Flame,
    color: "bg-orange-500",
    suffix: "%",
    tooltip: "Content that reached beyond the immediate audience",
  },
  {
    title: "Content / Member",
    key: "contentToMemberRatio",
    icon: BarChart3,
    color: "bg-rose-500",
    tooltip: "Posts per active member",
  },
  {
    title: "Event Participation",
    key: "eventParticipationRate",
    icon: Calendar,
    color: "bg-blue-500",
    suffix: "%",
    tooltip: "Event attendance rate",
  },
  {
    title: "Feature Adoption",
    key: "featureAdoptionRate",
    icon: Layers,
    color: "bg-purple-500",
    suffix: "%",
    tooltip: "Usage of platform features",
  },
];

const communityHealthKPIs = [
  {
    title: "Health Index",
    key: "healthIndex",
    icon: HeartPulse,
    color: "bg-emerald-500",
    tooltip:
      "Weighted Avg: Engagement (40%) + Retention (40%) + Content Activity (20%)",
  },
  {
    title: "Member Happiness",
    key: "communityNPS",
    icon: Smile,
    color: "bg-yellow-400",
    tooltip: "Engagement Rate × 1.2 − Churn Rate × 0.5",
  },
  {
    title: "Satisfaction Score",
    key: "memberSatisfactionScore",
    icon: Shield,
    color: "bg-indigo-500",
    tooltip: "Overall member satisfaction based on engagement signals",
  },
  {
    title: "Churn Prediction",
    key: "churnPredictionScore",
    icon: AlertTriangle,
    color: "bg-rose-500",
    tooltip: "Predictive score for members likely to churn",
  },
];

const advocacyGamificationKPIs = [
  {
    title: "Advocacy Index",
    key: "communityAdvocacyIndex",
    icon: Heart,
    color: "bg-rose-500",
    tooltip: "Composite 0–100: 0.4 × Referral + 0.35 × Reshare + 0.25 × Review",
  },
  {
    title: "Superfan %",
    key: "superfanRatio",
    icon: Star,
    color: "bg-amber-500",
    suffix: "%",
    tooltip: "(Top 10% engagement for 3+ months ÷ Active Members) × 100",
  },
  {
    title: "Points Issued",
    key: "gamificationPointsEarned",
    icon: Zap,
    color: "bg-indigo-500",
    tooltip: "SUM(points_awarded WHERE awarded_at IN period)",
    href: "/gamification/points-and-badges/points",
  },
  {
    title: "Badges Earned",
    key: "badgesEarned",
    icon: Trophy,
    color: "bg-purple-500",
    tooltip: "COUNT(badge_awards WHERE awarded_at IN period)",
  },
  {
    title: "Leaderboard Players",
    key: "leaderboardParticipants",
    icon: Crown,
    color: "bg-cyan-500",
    tooltip: "COUNT(DISTINCT member_id WHERE appeared_on_leaderboard = true)",
    href: "/gamification/points-and-badges/leaderboard",
  },
];

const monetisationKPIs = [
  {
    title: "Coins Payouts",
    key: "totalCurrencyPayouts",
    icon: Coins,
    color: "bg-amber-500",
    tooltip: "SUM(payout_amount WHERE status = 'completed')",
    href: "/gamification/currency",
  },
  {
    title: "Avg Revenue / Member",
    key: "revenuePerMember",
    icon: DollarSign,
    color: "bg-emerald-500",
    tooltip: "Total Community Revenue ÷ Active Members",
  },
  {
    title: "Member Lifetime Value",
    key: "memberLifetimeValue",
    icon: TrendingUp,
    color: "bg-indigo-500",
    tooltip: "Average total revenue generated per member over their lifecycle",
  },
  {
    title: "Revenue Conversion",
    key: "revenueConversionRate",
    icon: Percent,
    color: "bg-violet-500",
    suffix: "%",
    tooltip: "Members who made a transaction ÷ Active Members",
  },
];

// ---------------------------------------------------------------------------
// Pipeline Navigation (Acquire → Monetize)
// ---------------------------------------------------------------------------
const pipelineStages = [
  {
    key: "membership",
    label: "Acquire",
    icon: UserPlus,
    color: "from-cyan-500 to-blue-500",
  },
  {
    key: "growth",
    label: "Activate",
    icon: Zap,
    color: "from-blue-500 to-indigo-500",
  },
  {
    key: "engagement",
    label: "Engage",
    icon: MessageSquare,
    color: "from-indigo-500 to-violet-500",
  },
  {
    key: "health",
    label: "Retain",
    icon: Heart,
    color: "from-violet-500 to-purple-500",
  },
  {
    key: "advocacy",
    label: "Advocate",
    icon: Megaphone,
    color: "from-purple-500 to-pink-500",
  },
  {
    key: "monetisation",
    label: "Monetize",
    icon: DollarSign,
    color: "from-pink-500 to-rose-500",
  },
];

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
function MembersPage() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("membership");

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
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
  } = useGetMemberKPIDashboard(timeRangeMap[timeRange], formattedDateRange);

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const loading = loadingKpis;
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchKpis();
    } finally {
      setIsRefreshing(false);
    }
  };

  const kpis = kpiData?.getCommunityKPIs;

  const getMetric = (key: string): StatValue => {
    if (!kpis || !(key in kpis)) {
      return { value: 0 };
    }
    const metric = kpis[key as keyof typeof kpis];
    return isDashboardMetricValue(metric) ? metric : { value: 0 };
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`kpi-section-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // North Star data
  const northStarMetric = getMetric("activeUsers");
  const northStarChartData = (
    northStarMetric?.trend ?? [0, 0, 0, 0, 0, 0, 0]
  ).map((val, i) => ({ value: val, id: i }));
  const northStarPositive = (northStarMetric?.change ?? 0) >= 0;

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Community KPI Dashboard"
        description="Full-spectrum community health metrics"
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

        {/* ── North Star: Engaged Members ── */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-violet-500/[0.04]" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-indigo-500/[0.06] to-transparent rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] leading-none">
                    North Star Metric
                  </p>
                  <p className="text-[11px] font-semibold text-foreground/80 leading-tight">
                    Engaged Members
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
                  {loading ? (
                    <span className="inline-block h-10 w-28 rounded-lg bg-muted animate-pulse" />
                  ) : (
                    (northStarMetric?.value ?? 0)
                  )}
                </span>
                {!loading &&
                  northStarMetric?.change !== undefined &&
                  northStarMetric.change !== 0 && (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-bold mb-1",
                        northStarPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400",
                      )}
                    >
                      {northStarPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {northStarPositive ? "+" : ""}
                      {typeof northStarMetric.change === "number"
                        ? northStarMetric.change.toFixed(1)
                        : northStarMetric.change}
                      %
                      <span className="text-[10px] font-medium text-muted-foreground ml-1">
                        vs last period
                      </span>
                    </div>
                  )}
              </div>
              <p className="text-[11px] text-muted-foreground/60 max-w-md leading-relaxed">
                Members who performed a meaningful action (post, comment,
                reaction, or session &gt; 2 min) in the last 30 days.
              </p>
            </div>
            <div className="h-[80px] w-full md:w-[280px] shrink-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={1}
                minHeight={1}
              >
                <AreaChart
                  data={northStarChartData}
                  margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="northStarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#northStarGradient)"
                    dot={false}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── 1. Membership Health ── */}
        <section id="kpi-section-membership" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading title="MEMBERSHIP HEALTH" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipHealthKPIs.map((v) => {
              const item = getMetric(v.key);
              return (
                <EcosystemKPI
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  trend={item?.change ?? 0}
                  trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  icon={v.icon}
                  color={v.color}
                  suffix={(v as any).suffix}
                  tooltip={v.tooltip}
                  href={(v as any).href}
                />
              );
            })}
          </div>
        </section>

        {/* ── 2. Growth & Retention ── */}
        <section
          id="kpi-section-growth"
          className="space-y-3 mt-20 scroll-mt-24"
        >
          <DashboardSectionHeading title="GROWTH & RETENTION" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthRetentionKPIs.map((v) => {
              const item = getMetric(v.key);
              return (
                <EcosystemKPI
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  trend={item?.change ?? 0}
                  trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  icon={v.icon}
                  color={v.color}
                  suffix={(v as any).suffix}
                  tooltip={v.tooltip}
                  href={(v as any).href}
                />
              );
            })}
          </div>
        </section>

        {/* ── 3. Engagement ── */}
        <section
          id="kpi-section-engagement"
          className="space-y-3 mt-20 scroll-mt-24"
        >
          <DashboardSectionHeading title="ENGAGEMENT" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementKPIs.map((v) => {
              const item = getMetric(v.key);
              return (
                <EcosystemKPI
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  trend={item?.change ?? 0}
                  trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  icon={v.icon}
                  color={v.color}
                  suffix={(v as any).suffix}
                  tooltip={v.tooltip}
                />
              );
            })}
          </div>
        </section>

        {/* ── 4. Community Health ── */}
        <section
          id="kpi-section-health"
          className="space-y-3 mt-20 scroll-mt-24"
        >
          <DashboardSectionHeading title="COMMUNITY HEALTH" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityHealthKPIs.map((v) => {
              const item = getMetric(v.key);
              return (
                <EcosystemKPI
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  trend={item?.change ?? 0}
                  trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  icon={v.icon}
                  color={v.color}
                  tooltip={v.tooltip}
                />
              );
            })}
          </div>
        </section>

        {/* ── 5. Advocacy & Gamification ── */}
        <section
          id="kpi-section-advocacy"
          className="space-y-3 mt-20 scroll-mt-24"
        >
          <DashboardSectionHeading title="ADVOCACY & GAMIFICATION" />

          {/* Advocacy Index gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                    <Heart className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-none">
                      Composite Score
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      Advocacy Index
                    </p>
                  </div>
                  <span className="ml-auto text-2xl font-extrabold text-foreground tabular-nums">
                    {loading
                      ? "..."
                      : (getMetric("communityAdvocacyIndex")?.value ?? 0)}
                    <span className="text-xs text-muted-foreground font-medium ml-0.5">
                      /100
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(Number(getMetric("communityAdvocacyIndex")?.value ?? 0), 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                    Low
                  </span>
                  <span className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                    High
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advocacyGamificationKPIs.slice(1).map((v) => {
                const item = getMetric(v.key);
                return (
                  <EcosystemKPI
                    key={v.key}
                    title={v.title}
                    value={loading ? "..." : (item?.value ?? "0")}
                    trend={item?.change ?? 0}
                    trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                    icon={v.icon}
                    color={v.color}
                    suffix={(v as any).suffix}
                    tooltip={v.tooltip}
                    href={(v as any).href}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. Monetisation ── */}
        <section
          id="kpi-section-monetisation"
          className="space-y-3 mt-20 scroll-mt-24"
        >
          <DashboardSectionHeading title="MONETISATION" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {monetisationKPIs.map((v) => {
              const item = getMetric(v.key);
              return (
                <EcosystemKPI
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  trend={item?.change ?? 0}
                  trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  icon={v.icon}
                  color={v.color}
                  suffix={(v as any).suffix}
                  tooltip={v.tooltip}
                  href={(v as any).href}
                />
              );
            })}
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(MembersPage, "NETWORK", "canRead");
