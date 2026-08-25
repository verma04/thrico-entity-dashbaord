"use client";

import React, { useState, useMemo } from "react";
import { ShoppingBag, RotateCcw } from "lucide-react";
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
import { useGetOfferStats, TimeRange } from "@/graphql/actions/offers";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { OffersKpiOverview } from "./offers-kpi-overview";
import { OffersVelocityChart } from "./offers-velocity-chart";
import { OffersMatrixChart } from "./offers-matrix-chart";
import { OffersShortcuts } from "./offers-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function OffersDashboard() {
  const moduleName = useModuleStore((state) => state.offerModuleName) || "Offers";
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";

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

  const { data, loading: loadingStats, refetch } = useGetOfferStats(
    activeTimeRange,
    chartFilterValue.dateRange || formattedDateRange
  );

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const stats = data?.getOfferStats;
  const loading = loadingStats || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const claimsTrendData = useMemo(() => {
    return stats?.trend || [];
  }, [stats?.trend]);

  const matrixData = useMemo(() => {
    return stats?.matrix || [];
  }, [stats?.matrix]);

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={`${moduleName} Overview`}
        description={`Monitor ${singularName.toLowerCase()} velocity, claim trends, and customer conversion cycles.`}
        icon={ShoppingBag}
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

        {/* 1. Core Offers KPIs */}
        <OffersKpiOverview
          loading={loading}
          moduleName={moduleName}
          stats={stats}
          trendData={claimsTrendData}
        />

        {/* 2. Redemption Velocity & Matrix Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <OffersVelocityChart
              loading={loading}
              claimsTrendData={claimsTrendData}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={stats?.claimsChange ?? 0}
              totalClaims={stats?.claims}
            />
          </div>

          <div className="lg:col-span-4">
            <OffersMatrixChart
              loading={loading}
              data={matrixData}
            />
          </div>
        </div>

        {/* 3. Promotions Operations Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12">
            <OffersShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
