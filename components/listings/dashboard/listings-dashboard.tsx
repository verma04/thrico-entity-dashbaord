"use client";

import React, { useState, useMemo } from "react";
import { Store, RotateCcw } from "lucide-react";
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
  useListings,
  useGetListingStats,
  useListingTrend,
  useListingCategoryDistribution,
} from "@/graphql/actions/listing";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { ListingsKpiOverview } from "./listings-kpi-overview";
import { ListingsVelocityChart } from "./listings-velocity-chart";
import { ListingsCategoryMixChart } from "./listings-category-mix-chart";
import { ListingsRecentCatalog } from "./listings-recent-catalog";
import { ListingsShortcuts } from "./listings-shortcuts";

export default function ListingsDashboard() {
  const moduleName = useModuleStore((state) => state.listingModuleName) || "Marketplace";
  const singularName = useModuleStore((state) => state.listingSingularName) || "Listing";

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

  const activeTimeRange = timeRange.toUpperCase();

  const {
    data: listingsData,
    loading: listingsLoading,
    refetch: refetchListings,
  } = useListings({
    variables: { input: { status: "ALL" } },
  });

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetListingStats();

  const chartTimeRangeParam = chartFilterValue.timeRange || activeTimeRange;
  const chartDateRangeParam = chartFilterValue.dateRange || formattedDateRange;

  const {
    data: trendData,
    loading: trendLoading,
    refetch: refetchTrend,
  } = useListingTrend(chartTimeRangeParam, chartDateRangeParam);

  const {
    data: categoryData,
    loading: categoryLoading,
    refetch: refetchCategory,
  } = useListingCategoryDistribution(activeTimeRange, formattedDateRange);

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const loading =
    listingsLoading ||
    statsLoading ||
    trendLoading ||
    categoryLoading ||
    isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchListings(),
        refetchStats(),
        refetchTrend(),
        refetchCategory(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const listingItems = useMemo(() => {
    return (
      listingsData?.getListing?.data ||
      (Array.isArray(listingsData?.getListing) ? listingsData.getListing : [])
    );
  }, [listingsData]);

  const stats = statsData?.getListingStats;
  const weeklyListingsData = useMemo(() => {
    return trendData?.getListingTrend || [];
  }, [trendData?.getListingTrend]);

  const categoryDistributionData = useMemo(() => {
    return categoryData?.getListingCategoryDistribution || [];
  }, [categoryData?.getListingCategoryDistribution]);

  const pendingCount = useMemo(() => {
    return listingItems.filter(
      (i: { status?: string }) =>
        i.status?.toLowerCase() === "pending"
    ).length;
  }, [listingItems]);

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title={`${moduleName} Overview`}
        description="Monitor catalog expansion, inventory health, and engagement performance."
        icon={Store}
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

        {/* 1. Core Marketplace KPIs */}
        <ListingsKpiOverview
          loading={statsLoading}
          moduleName={moduleName}
          stats={stats}
          pendingCount={pendingCount}
          trendData={weeklyListingsData}
        />

        {/* 2. Catalog Velocity & Category Mix Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <ListingsVelocityChart
              loading={trendLoading}
              weeklyListingsData={weeklyListingsData}
              filterKey={chartFilterKey}
              onFilterChange={(key, val) => {
                setChartFilterKey(key);
                setChartFilterValue(val);
              }}
              growthPercentage={Number(stats?.listingsDiff || 0)}
              totalListings={stats?.totalListings}
            />
          </div>

          <div className="lg:col-span-4">
            <ListingsCategoryMixChart
              loading={categoryLoading}
              data={categoryDistributionData}
            />
          </div>
        </div>

        {/* 3. Recent Catalog Performance & Operations Shortcuts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <ListingsRecentCatalog
              loading={listingsLoading}
              listings={listingItems}
            />
          </div>

          <div className="lg:col-span-4">
            <ListingsShortcuts
              moduleName={moduleName}
              singularName={singularName}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
