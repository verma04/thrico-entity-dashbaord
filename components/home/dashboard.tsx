"use client";

import React, { useState } from "react";
import { Activity, RotateCcw } from "lucide-react";
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
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { InViewContainer } from "@/components/shared/in-view-container";

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
import {
  DashboardPlatformStorage,
  DashboardPlatformStorageSkeleton,
} from "./dashboard-platform-storage";
import {
  DashboardGamificationSection,
  DashboardGamificationSkeleton,
} from "./dashboard-gamification-section";
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

  const kpis = kpiData?.getCommunityKPIs;
  const featureModules = featureData?.getFeatureModulePerformance;

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
            featureModules={featureModules || []}
            DashboardSectionHeading={DashboardSectionHeading}
          />
        </div>

        {/* 3.5. Insights Row (Growth & Content Breakdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <section className="space-y-3 flex flex-col">
            <DashboardSectionHeading title="Community Growth" />
            <InViewContainer minHeight={280}>
              <DashboardGrowthChart />
            </InViewContainer>
          </section>
          <section className="space-y-3 flex flex-col">
            <DashboardSectionHeading title="Content Insights" />
            <DashboardContentBreakdownChart
              data={kpis?.contentTypeBreakdown || []}
            />
          </section>
        </div>

        {/* ClickHouse Conversion Funnel */}
        <section className="space-y-3">
          <DashboardSectionHeading title="Event & Member Conversion Funnel" />
          <InViewContainer minHeight={180}>
            <ConversionFunnelCard funnelType="EVENT_REGISTRATION" />
          </InViewContainer>
        </section>

        {/* 4. Growing & Keeping Members */}
        <DashboardAcquisition
          loading={loadingKpis}
          getMetric={getMetric}
          DashboardSectionHeading={DashboardSectionHeading}
        />

        {/* 4.5. Gamification Leaderboard + Activity Log + Impact Score */}
        <InViewContainer minHeight={380} fallback={<DashboardGamificationSkeleton />}>
          <DashboardGamificationSection
            DashboardSectionHeading={DashboardSectionHeading}
          />
        </InViewContainer>

        {/* 5. Platform Storage & Subscription Details Row */}
        <InViewContainer minHeight={300} fallback={<DashboardPlatformStorageSkeleton />}>
          <DashboardPlatformStorage
            DashboardSectionHeading={DashboardSectionHeading}
          />
        </InViewContainer>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
