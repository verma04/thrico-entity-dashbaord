"use client";

import React, { useState, useMemo } from "react";
import { RotateCcw, Users2 } from "lucide-react";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { useGetCommunitiesStats, TimeRange } from "@/graphql/actions/communities";
import { useModuleStore } from "@/store/useModuleStore";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { AccessDeniedAlert } from "@/components/shared/access-denied-alert";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  ChartTimeFilterValue,
  getChartTimeFilter,
} from "@/components/home/chart-time-filter";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { CommunitiesKPIOverview } from "./communities-kpi-overview";
import { CommunitiesGrowthChart } from "./communities-growth-chart";
import { CommunityStatusDistribution } from "./community-status-distribution";
import { TopCommunitiesCard } from "./top-communities-card";
import { TopCreatorsCard } from "./top-creators-card";
import { CommunityShortcuts } from "./community-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function CommunitiesAnalytics() {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const activeTimeRange =
    (chartFilterValue.timeRange as TimeRange) ||
    timeRangeMap[timeRange] ||
    TimeRange.LAST_7_DAYS;

  const { data, loading: loadingStats, refetch, error } = useGetCommunitiesStats(
    activeTimeRange,
    chartFilterValue.dateRange || formattedDateRange
  );

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const stats = data?.getCommunitiesStats;
  const loading = loadingStats || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const enrollmentTrend = useMemo(() => {
    return stats?.enrollmentTrend || [];
  }, [stats?.enrollmentTrend]);

  if (error) {
    return (
      <EcosystemWrapper data-testid="communities-analytics" className="m-2">
        <EcosystemHeader
          title={`${moduleName || "Communities"} Overview`}
          description={`${moduleName || "Communities"} overview and insights`}
          badgeText="Overview"
          icon={Users2}
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
                className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg transition-all"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RotateCcw
                  size={14}
                  className={cn(loading && "animate-spin")}
                />
              </Button>
            </div>
          }
        />

        <EcosystemContainer className="p-5 space-y-5">
          <div className="max-w-3xl space-y-4">
            <DashboardSectionHeading
              title="Access Restricted"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <AccessDeniedAlert
                message={
                  error.message ||
                  `You do not have permission to view ${singularName.toLowerCase()} analytics.`
                }
              />
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  const topCommunities = stats?.topCommunities ?? [];
  const topCreators = stats?.topCreators ?? [];
  const statusDistribution = stats?.statusDistribution ?? [];

  return (
    <EcosystemWrapper data-testid="communities-analytics" className="m-2">
      <EcosystemHeader
        title={`${moduleName || "Communities"} Overview`}
        description="Real-time pulse of community group health, membership growth, and active leaders."
        icon={Users2}
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
              disabled={loading}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-5 space-y-5">
        {/* Subscription Limit Warning Banner */}
        <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />

        {/* 1. Core Communities KPIs */}
        <CommunitiesKPIOverview loading={loading} stats={stats} />

        {/* 2. Enrollment Growth & Status Distribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <CommunitiesGrowthChart
              loading={loading}
              enrollmentTrend={enrollmentTrend}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={stats?.enrollmentsChange ?? 0}
              totalEnrollments={stats?.totalEnrollments}
            />
          </div>

          <div className="lg:col-span-4">
            <CommunityStatusDistribution
              loading={loading}
              singularName={singularName}
              statusDistribution={statusDistribution}
            />
          </div>
        </div>

        {/* 3. Top Communities, Top Creators, and Shortcuts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">
            <TopCommunitiesCard
              loading={loading}
              moduleName={moduleName}
              topCommunities={topCommunities}
            />
            <TopCreatorsCard
              loading={loading}
              moduleName={moduleName}
              topCreators={topCreators}
            />
          </div>

          <div className="lg:col-span-4">
            <CommunityShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
