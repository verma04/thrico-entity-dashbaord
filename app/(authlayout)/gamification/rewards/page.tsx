"use client";

import React from "react";
import { Gift, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetRewardStats, useGetRedemptions, useGetRewards, TimeRange } from "@/graphql/actions/rewards";
import { useGetCurrencyStats } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useModuleStore } from "@/store/useModuleStore";
import { useUrlDateRange } from "@/hooks/use-url-date-range";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};
import moment from "moment";

import { RewardsBanner } from "@/components/rewards/dashboard/rewards-banner";
import { RewardsOverviewKpis } from "@/components/rewards/dashboard/rewards-overview-kpis";
import { RedemptionActivityChart } from "@/components/rewards/dashboard/redemption-activity-chart";
import { RecentRedemptions } from "@/components/rewards/dashboard/recent-redemptions";
import { InventoryGlance } from "@/components/rewards/dashboard/inventory-glance";
import { PointsSpentChart } from "@/components/rewards/dashboard/points-spent-chart";
import { PopularRewards } from "@/components/rewards/dashboard/popular-rewards";
import { EngagementMetrics } from "@/components/rewards/dashboard/engagement-metrics";
import { RewardsNavigation } from "@/components/rewards/dashboard/rewards-navigation";

export default function RewardsDashboard() {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const {
    data: statsData,
    loading: statsLoading,
    refetch,
  } = useGetRewardStats(timeRangeMap[timeRange], formattedDateRange);

  const {
    data: currencyStatsData,
    loading: currencyStatsLoading,
  } = useGetCurrencyStats(timeRangeMap[timeRange], formattedDateRange);
  const { data: redemptionsData, loading: redemptionsLoading } =
    useGetRedemptions({
      pagination: { page: 1, limit: 6 },
    });
  const { data: rewardsData, loading: rewardsLoading } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });

  const stats = statsData?.getRewardStats;
  const redemptions = redemptionsData?.getRedemptions || [];
  const allRewards = rewardsData?.getRewards || [];

  // Inventory computed
  const inventoryRewards = allRewards.filter((r: any) => r.inventoryRequired);
  const lowStockRewards = inventoryRewards.filter(
    (r: any) => r.remainingVouchers !== undefined && r.remainingVouchers <= 10,
  );
  const healthyRewards = inventoryRewards.filter(
    (r: any) => r.remainingVouchers === undefined || r.remainingVouchers > 10,
  );

  const chartData =
    stats?.redemptionTrend?.map((t: any) => ({
      name: moment(t.date).format("MMM DD"),
      val: t.count || 0,
      tc: t.value || 0,
    })) || [];

  const pointsSpentData =
    currencyStatsData?.getCurrencyStats?.currencyFlow?.map((t: any) => ({
      name: t.name,
      amount: t.amount || 0,
    })) || [];

  return (
    <EcosystemWrapper data-section="rewards-dashboard">
      <EcosystemHeader
        title={rewardsModuleName}
        description={`Inspire engagement with high-value ${rewardsModuleName.toLowerCase()} and interactive gamification.`}
        badgeText={`${rewardsModuleName} Center`}
        icon={Gift}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards" },
        ]}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <div className="flex items-center gap-2">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateChange}
                defaultValue="LAST_7_DAYS"
              />

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => refetch()}
                title="Refresh data"
              >
                <RotateCcw
                  className={cn("h-3.5 w-3.5", statsLoading && "animate-spin")}
                />
              </Button>
              <Link href="/gamification/rewards/coupons/create">
                <EcosystemActionBar.CtaButton>
                  <Plus className="h-3 w-3" />
                  Create Reward
                </EcosystemActionBar.CtaButton>
              </Link>
            </div>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <RewardsBanner />
        <RewardsOverviewKpis stats={stats} statsLoading={statsLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RedemptionActivityChart chartData={chartData} statsLoading={statsLoading} />
          <RecentRedemptions redemptions={redemptions} redemptionsLoading={redemptionsLoading} />
        </div>

        <InventoryGlance 
          inventoryRewards={inventoryRewards}
          lowStockRewards={lowStockRewards}
          healthyRewards={healthyRewards}
          rewardsLoading={rewardsLoading}
        />
        
        <PointsSpentChart chartData={pointsSpentData} statsLoading={currencyStatsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PopularRewards />
          <EngagementMetrics stats={stats} />
        </div>

        <RewardsNavigation stats={stats} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
