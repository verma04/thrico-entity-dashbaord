"use client";

import React, { useState, useMemo } from "react";
import { Briefcase, RotateCcw } from "lucide-react";
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
import { useModuleStore } from "@/store/useModuleStore";
import {
  useJobStats,
  TimeRange,
  useJobApplicationTrend,
  useJobTypeDistribution,
} from "@/graphql/actions/jobs";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { JobsKpiOverview } from "./jobs-kpi-overview";
import { JobsApplicationChart } from "./jobs-application-chart";
import { JobsTypeDistributionChart } from "./jobs-type-distribution-chart";
import { JobsShortcuts } from "./jobs-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function JobsDashboard() {
  const moduleName = useModuleStore((state) => state.jobModuleName) || "Jobs";
  const singularName = useModuleStore((state) => state.jobSingularName) || "Job";

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

  const activeTimeRange = timeRangeMap[timeRange] || TimeRange.LAST_7_DAYS;

  const {
    data: statsData,
    loading: loadingStats,
    refetch: refetchStats,
  } = useJobStats(activeTimeRange, formattedDateRange);

  const chartTimeRangeParam =
    (chartFilterValue.timeRange as TimeRange) || activeTimeRange;
  const chartDateRangeParam = chartFilterValue.dateRange || formattedDateRange;

  const {
    data: trendData,
    loading: loadingTrend,
    refetch: refetchTrend,
  } = useJobApplicationTrend(chartTimeRangeParam, chartDateRangeParam);

  const {
    data: typeData,
    loading: loadingType,
    refetch: refetchType,
  } = useJobTypeDistribution(activeTimeRange, formattedDateRange);

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const loading =
    loadingStats || loadingTrend || loadingType || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchTrend(),
        refetchType(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = statsData?.getJobStats;
  const applicationsData = useMemo(() => {
    return trendData?.getJobApplicationTrend || [];
  }, [trendData?.getJobApplicationTrend]);

  const jobTypeData = useMemo(() => {
    return typeData?.getJobTypeDistribution || [];
  }, [typeData?.getJobTypeDistribution]);

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={`${moduleName} Overview`}
        description="Real-time pulse of career opportunities, candidate applications, and job views."
        icon={Briefcase}
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

        {/* 1. Core Jobs KPIs */}
        <JobsKpiOverview
          loading={loadingStats}
          moduleName={moduleName}
          stats={stats}
          trendData={applicationsData}
        />

        {/* 2. Application Velocity & Job Type Distribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <JobsApplicationChart
              loading={loadingTrend}
              applicationsData={applicationsData}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={stats?.applicationsChange ?? 0}
              totalApplications={stats?.totalApplications}
            />
          </div>

          <div className="lg:col-span-4">
            <JobsTypeDistributionChart
              loading={loadingType}
              data={jobTypeData}
            />
          </div>
        </div>

        {/* 3. Recruitment Operations Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12">
            <JobsShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
