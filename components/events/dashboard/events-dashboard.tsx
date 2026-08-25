"use client";

import React, { useState, useMemo } from "react";
import { Calendar, RotateCcw } from "lucide-react";
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
import { TimeRange } from "@/graphql/actions";
import {
  useEventRegistrationTrend,
  useEventStats,
  useEventTypeDistribution,
  useTopPerformingEvents,
} from "@/graphql/actions/events";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { EventsKpiOverview } from "./events-kpi-overview";
import { EventsRegistrationChart } from "./events-registration-chart";
import { EventsFormatDistributionChart } from "./events-format-distribution-chart";
import { TopEventsCard } from "./top-events-card";
import { EventsShortcuts } from "./events-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function EventsDashboard() {
  const moduleName = useModuleStore((state) => state.eventModuleName) || "Events";
  const singularName = useModuleStore((state) => state.eventSingularName) || "Event";

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
  } = useEventStats(activeTimeRange, formattedDateRange);

  const chartTimeRangeParam =
    (chartFilterValue.timeRange as TimeRange) || activeTimeRange;
  const chartDateRangeParam = chartFilterValue.dateRange || formattedDateRange;

  const {
    data: trendData,
    loading: loadingTrend,
    refetch: refetchTrend,
  } = useEventRegistrationTrend(chartTimeRangeParam, chartDateRangeParam);

  const {
    data: typeData,
    loading: loadingType,
    refetch: refetchType,
  } = useEventTypeDistribution(activeTimeRange, formattedDateRange);

  const {
    data: topData,
    loading: loadingTop,
    refetch: refetchTop,
  } = useTopPerformingEvents(7, activeTimeRange, formattedDateRange);

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const loading =
    loadingStats || loadingTrend || loadingType || loadingTop || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchTrend(),
        refetchType(),
        refetchTop(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = statsData?.getEventStats;
  const registrationTrend = useMemo(() => {
    return trendData?.getEventRegistrationTrend || [];
  }, [trendData?.getEventRegistrationTrend]);

  const eventTypeDistribution = useMemo(() => {
    return typeData?.getEventTypeDistribution || [];
  }, [typeData?.getEventTypeDistribution]);

  const topPerformingEvents = useMemo(() => {
    return topData?.getTopPerformingEvents || [];
  }, [topData?.getTopPerformingEvents]);

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={`${moduleName} Overview`}
        description="Real-time pulse of community gatherings, attendee velocity, and registration metrics."
        icon={Calendar}
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

        {/* 1. Core Event KPIs */}
        <EventsKpiOverview
          loading={loadingStats}
          moduleName={moduleName}
          stats={stats}
          registrationTrend={registrationTrend}
        />

        {/* 2. Registration Velocity & Formats Distribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <EventsRegistrationChart
              loading={loadingTrend}
              registrationTrend={registrationTrend}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={stats?.attendeesWeeklyChange ?? 0}
              totalAttendees={stats?.totalAttendees}
            />
          </div>

          <div className="lg:col-span-4">
            <EventsFormatDistributionChart
              loading={loadingType}
              data={eventTypeDistribution}
            />
          </div>
        </div>

        {/* 3. Top Performing Events & Event Shortcuts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <TopEventsCard
              loading={loadingTop}
              moduleName={moduleName}
              events={topPerformingEvents}
            />
          </div>

          <div className="lg:col-span-4">
            <EventsShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
