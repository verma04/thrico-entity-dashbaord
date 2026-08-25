"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, RotateCcw } from "lucide-react";
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
import { useGetSurveyStats, TimeRange } from "@/graphql/surveys/survey-queries";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { SurveysKpiOverview } from "./surveys-kpi-overview";
import { SurveysResponseChart } from "./surveys-response-chart";
import { SurveysStatusChart } from "./surveys-status-chart";
import { SurveysShortcuts } from "./surveys-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function SurveysDashboard() {
  const moduleName = useModuleStore((state) => state.surveyModuleName) || "Surveys";
  const singularName = useModuleStore((state) => state.surveySingularName) || "Survey";

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

  const { data, loading: loadingStats, refetch } = useGetSurveyStats(
    activeTimeRange,
    chartFilterValue.dateRange || formattedDateRange
  );

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const stats = data?.getSurveyStats;
  const loading = loadingStats || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const responseTrendData = useMemo(() => {
    return (
      stats?.responseTrend?.map((item: { date: string; count: number }) => ({
        name: item.date,
        responses: item.count,
      })) || []
    );
  }, [stats?.responseTrend]);

  const surveyStatusData = useMemo(() => {
    return (
      stats?.statusDistribution?.map(
        (item: { status: string; count: number }) => ({
          name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
          value: item.count,
        })
      ) || []
    );
  }, [stats?.statusDistribution]);

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={`${moduleName} Overview`}
        description={`Monitor response rates, ${singularName.toLowerCase()} status distribution, and engagement trends.`}
        icon={BarChart3}
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

        {/* 1. Core Surveys KPIs */}
        <SurveysKpiOverview
          loading={loading}
          moduleName={moduleName}
          stats={stats}
          trendData={responseTrendData}
        />

        {/* 2. Response Velocity & Status Distribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <SurveysResponseChart
              loading={loading}
              responseTrendData={responseTrendData}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={stats?.totalResponsesChange ?? 0}
              totalResponses={stats?.totalResponses}
            />
          </div>

          <div className="lg:col-span-4">
            <SurveysStatusChart
              loading={loading}
              data={surveyStatusData}
            />
          </div>
        </div>

        {/* 3. Feedback Operations Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12">
            <SurveysShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
