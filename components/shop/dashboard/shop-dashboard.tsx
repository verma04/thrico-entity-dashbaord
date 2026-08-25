"use client";

import React, { useState, useMemo } from "react";
import { ShoppingBag, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { useModuleStore } from "@/store/useModuleStore";
import { useGetShopStats, TimeRange } from "@/graphql/actions/shop/shop-hooks";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { cn } from "@/lib/utils";

import { ShopKpiOverview } from "./shop-kpi-overview";
import { ShopShortcuts } from "./shop-shortcuts";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function ShopDashboard() {
  const moduleName = useModuleStore((state) => state.shopModuleName) || "Products";
  const singularName = useModuleStore((state) => state.shopSingularName) || "Product";

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formattedDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const activeTimeRange = timeRangeMap[timeRange] || TimeRange.LAST_7_DAYS;

  const { data, loading: loadingStats, refetch } = useGetShopStats(
    activeTimeRange,
    formattedDateRange
  );

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const stats = data?.getShopStats;
  const loading = loadingStats || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Commerce & Storefront Hub"
        description="Monitor product performance, inventory status, and storefront analytics."
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

        {/* 1. Core Shop KPIs */}
        <ShopKpiOverview
          loading={loading}
          moduleName={moduleName}
          stats={stats}
        />

        {/* 2. Commerce Operations Shortcuts */}
        <div className="grid grid-cols-1 gap-4">
          <ShopShortcuts
            moduleName={moduleName}
            singularName={singularName}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
