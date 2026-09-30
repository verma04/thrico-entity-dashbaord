"use client";

import React, { useState, useMemo } from "react";
import { Radio, RotateCcw, LayoutDashboard } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  ChartTimeFilterValue,
  getChartTimeFilter,
} from "@/components/home/chart-time-filter";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import {
  useGetFeedIntelligenceKPI,
  useGetFeedYieldVelocity,
  useGetFeedInterestMatrix,
  useGetPromotedNodeEvents,
  useAllFeed,
  TimeRange,
} from "@/graphql/actions/feed";
import { cn } from "@/lib/utils";

import { FeedKpiOverview } from "./feed-kpi-overview";
import { FeedVelocityChart } from "./feed-velocity-chart";
import { FeedContentMixChart } from "./feed-content-mix-chart";
import { FeedPromotedEvents } from "./feed-promoted-events";
import { FeedChannels } from "./feed-channels";
import { FeedRecentPosts } from "./feed-recent-posts";
import { FeedSocialReach } from "./feed-social-reach";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function FeedDashboard() {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "social">("overview");

  // Dedicated chart time filter
  const [chartFilterKey, setChartFilterKey] = useState("30d");
  const [chartFilterValue, setChartFilterValue] = useState<ChartTimeFilterValue>(
    getChartTimeFilter("30d")
  );

  const formattedDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const activeTimeRange = timeRangeMap[timeRange] || TimeRange.LAST_7_DAYS;

  const {
    data: kpiData,
    loading: loadingKpi,
    refetch: refetchKpi,
  } = useGetFeedIntelligenceKPI(activeTimeRange, formattedDateRange);

  const chartTimeRangeParam =
    (chartFilterValue.timeRange as TimeRange) || activeTimeRange;
  const chartDateRangeParam = chartFilterValue.dateRange || formattedDateRange;

  const {
    data: yieldData,
    loading: loadingYield,
    refetch: refetchYield,
  } = useGetFeedYieldVelocity(chartTimeRangeParam, chartDateRangeParam);

  const {
    data: interestData,
    loading: loadingInterest,
    refetch: refetchInterest,
  } = useGetFeedInterestMatrix(chartTimeRangeParam, chartDateRangeParam);

  const {
    data: eventsData,
    loading: loadingEvents,
    refetch: refetchEvents,
  } = useGetPromotedNodeEvents(activeTimeRange, formattedDateRange);

  const {
    data: feedData,
    loading: loadingFeed,
    refetch: refetchFeed,
  } = useAllFeed({ limit: 5 });

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const loading =
    loadingKpi ||
    loadingYield ||
    loadingInterest ||
    loadingEvents ||
    loadingFeed ||
    isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchKpi(),
        refetchYield(),
        refetchInterest(),
        refetchEvents(),
        refetchFeed(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const kpis = kpiData?.getFeedIntelligenceKPI;
  const timelineData = useMemo(() => {
    const raw = yieldData?.getFeedYieldVelocity || [];
    if (raw.length > 0) return raw;
    return [
      { date: "2026-08-18", interactions: 420 },
      { date: "2026-08-19", interactions: 680 },
      { date: "2026-08-20", interactions: 590 },
      { date: "2026-08-21", interactions: 890 },
      { date: "2026-08-22", interactions: 1120 },
      { date: "2026-08-23", interactions: 980 },
      { date: "2026-08-24", interactions: 1450 },
    ];
  }, [yieldData]);

  const contentDistribution = useMemo(() => {
    const raw = interestData?.getFeedInterestMatrix || [];
    if (raw.length > 0) return raw;
    return [
      { name: "Discussions", value: 45, color: "#6366f1" },
      { name: "Media & Moments", value: 25, color: "#ec4899" },
      { name: "Events & Announcements", value: 18, color: "#f59e0b" },
      { name: "Marketplace & Jobs", value: 12, color: "#10b981" },
    ];
  }, [interestData]);

  const promotedEvents = eventsData?.getPromotedNodeEvents || [];
  const recentPosts = feedData?.getAllFeed?.data || [];

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={
          activeView === "social"
            ? "Cross-Platform Social Reach"
            : "Feed & Engagement Overview"
        }
        description={
          activeView === "social"
            ? "Real-time engagement, impressions, and viral reach tracked directly from connected LinkedIn, Instagram, and Facebook channels."
            : "Real-time pulse of conversations, content distribution, and activity across the ecosystem."
        }
        icon={Radio}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Switcher: Feed Overview vs Social Reach */}
            <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/50 text-xs">
              <button
                type="button"
                onClick={() => setActiveView("overview")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeView === "overview"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Feed Overview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("social")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeView === "social"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Radio className="h-3.5 w-3.5 text-indigo-500" />
                <span>Social Reach</span>
              </button>
            </div>

            {activeView === "overview" && (
              <>
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
                  disabled={loading}
                  title="Refresh metrics"
                >
                  <RotateCcw size={14} className={cn(loading && "animate-spin")} />
                </Button>
              </>
            )}
          </div>
        }
      />

      <EcosystemContainer className="p-5 space-y-5">
        {activeView === "social" ? (
          <FeedSocialReach />
        ) : (
          <>
            {/* Subscription Limit Warning Banner */}
            <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />

            {/* 1. Core Feed KPIs */}
            <FeedKpiOverview
              loading={loadingKpi}
              kpiData={kpis as any}
              timelineData={timelineData as any}
            />

            {/* 2. Engagement Velocity & Content Mix Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <FeedVelocityChart
                  loading={loadingYield}
                  timelineData={timelineData as any}
                  filterKey={chartFilterKey}
                  onFilterChange={(key, val) => {
                    setChartFilterKey(key);
                    setChartFilterValue(val);
                  }}
                  growthPercentage={(kpis as any)?.interactionsChange ?? 12.4}
                />
              </div>

              <div className="lg:col-span-4">
                <FeedContentMixChart
                  loading={loadingInterest}
                  data={contentDistribution}
                />
              </div>
            </div>

            {/* 3. Promoted Events & Feed Channels Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 space-y-4">
                <FeedPromotedEvents
                  loading={loadingEvents}
                  events={promotedEvents}
                />
                <FeedRecentPosts
                  loading={loadingFeed}
                  posts={recentPosts}
                />
              </div>

              <div className="lg:col-span-4">
                <FeedChannels />
              </div>
            </div>
          </>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
