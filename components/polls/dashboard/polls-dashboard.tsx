"use client";

import React, { useState, useMemo } from "react";
import { Vote, RotateCcw } from "lucide-react";
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
import { useGetPollStats, TimeRange } from "@/graphql/actions/polls";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { PollsKpiOverview } from "./polls-kpi-overview";
import { PollsVotingChart } from "./polls-voting-chart";
import { PollsStatusChart } from "./polls-status-chart";
import { PollsShortcuts } from "./polls-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function PollsDashboard() {
  const moduleName = useModuleStore((state) => state.pollModuleName) || "Polls";
  const singularName = useModuleStore((state) => state.pollSingularName) || "Poll";

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

  const { data, loading: loadingStats, refetch } = useGetPollStats(
    activeTimeRange,
    chartFilterValue.dateRange || formattedDateRange
  );

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const stats = data?.getPollStats;
  const loading = loadingStats || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const pollVotesData = useMemo(() => {
    return stats?.trend || [];
  }, [stats?.trend]);

  const registryStats = useMemo(() => {
    return (
      stats?.registry || {
        closedPolls: 0,
        activePolls: 0,
        drafts: 0,
        responseRate: 0,
      }
    );
  }, [stats?.registry]);

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={`${moduleName} Overview`}
        description="Monitor community sentiment, voting velocity, and engagement metrics across the platform."
        icon={Vote}
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

        {/* 1. Core Polls KPIs */}
        <PollsKpiOverview
          loading={loading}
          moduleName={moduleName}
          stats={stats}
          trendData={pollVotesData}
        />

        {/* 2. Voting Velocity & Registry Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <PollsVotingChart
              loading={loading}
              pollVotesData={pollVotesData}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={stats?.votesChange ?? 0}
              totalVotes={stats?.votes}
            />
          </div>

          <div className="lg:col-span-4">
            <PollsStatusChart
              loading={loading}
              registry={registryStats}
            />
          </div>
        </div>

        {/* 3. Polling Operations Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12">
            <PollsShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
