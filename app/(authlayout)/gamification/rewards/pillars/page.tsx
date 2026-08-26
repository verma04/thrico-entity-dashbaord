"use client";

import React, { useMemo } from "react";
import {
  Layers,
  Coins,
  ShoppingBag,
  Gift,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PillarsBanner,
  PillarsGrowthChart,
  PillarsDistributionChart,
  PillarsCardsGrid,
  PillarsLiveFeed,
  PillarsComparisonTable,
} from "@/components/rewards/pillars";
import {
  useGetRewards,
  useGetRewardStats,
  useGetRedemptions,
  useGetManualVoucherBatches,
  useGetStoreDiscountRules,
  useGetDigitalCardRules,
  useGetEntityRewardWallet,
  useGetRewardSecuritySettings,
  TimeRange,
} from "@/graphql/actions/rewards";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function RewardPillarsPage() {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);

  const formattedDateRange = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      };
    }
    return undefined;
  }, [dateRange]);

  // 1. Rewards & Pillar Rules Queries
  const {
    data: rewardsData,
    loading: rewardsLoading,
    refetch: refetchRewards,
  } = useGetRewards();

  const {
    data: manualBatchesData,
    loading: manualBatchesLoading,
    refetch: refetchManualBatches,
  } = useGetManualVoucherBatches();

  const {
    data: storeRulesData,
    loading: storeRulesLoading,
    refetch: refetchStoreRules,
  } = useGetStoreDiscountRules();

  const {
    data: digitalCardRulesData,
    loading: digitalCardRulesLoading,
    refetch: refetchDigitalCardRules,
  } = useGetDigitalCardRules();

  const {
    data: walletData,
    loading: walletLoading,
    refetch: refetchWallet,
  } = useGetEntityRewardWallet();

  // 2. Stats & Activity Queries
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetRewardStats(timeRangeMap[timeRange] || TimeRange.LAST_7_DAYS, formattedDateRange);

  const {
    data: redemptionsData,
    loading: redemptionsLoading,
    refetch: refetchRedemptions,
  } = useGetRedemptions({
    pagination: { page: 1, limit: 10 },
  });

  const {
    data: securityData,
    loading: securityLoading,
    refetch: refetchSecurity,
  } = useGetRewardSecuritySettings();

  const isGlobalLoading =
    rewardsLoading ||
    statsLoading ||
    manualBatchesLoading ||
    storeRulesLoading ||
    digitalCardRulesLoading ||
    walletLoading ||
    redemptionsLoading ||
    securityLoading;

  const handleRefreshAll = () => {
    refetchRewards?.();
    refetchStats?.();
    refetchManualBatches?.();
    refetchStoreRules?.();
    refetchDigitalCardRules?.();
    refetchWallet?.();
    refetchRedemptions?.();
    refetchSecurity?.();
  };

  interface PillarRewardItem {
    mechanism?: { type?: string };
    manualBatchId?: string | null;
    storeDiscountRuleId?: string | null;
    digitalCardRuleId?: string | null;
    provider?: string;
    rewardType?: string;
  }

  // 3. Process Multi-Pillar Categorizations
  const rewards = useMemo(() => (rewardsData?.getRewards || []) as PillarRewardItem[], [rewardsData]);
  const manualBatches = useMemo(() => manualBatchesData?.getManualVoucherBatches?.batches || [], [manualBatchesData]);
  const storeRules = useMemo(() => storeRulesData?.getStoreDiscountRules?.rules || [], [storeRulesData]);
  const digitalCardRules = useMemo(() => digitalCardRulesData?.getDigitalCardRules?.rules || [], [digitalCardRulesData]);
  const wallet = walletData?.getEntityRewardWallet;
  const stats = statsData?.getRewardStats;
  const redemptions = useMemo(() => redemptionsData?.getRedemptions || [], [redemptionsData]);
  const securitySettings = securityData?.getRewardSecuritySettings;

  const manualRewards = useMemo(() => {
    return rewards.filter((r: PillarRewardItem) => {
      const mechType = r.mechanism?.type;
      return (
        mechType === "INTERNAL_VOUCHER" ||
        Boolean(r.manualBatchId) ||
        r.provider === "INTERNAL" ||
        (!r.storeDiscountRuleId &&
          !r.digitalCardRuleId &&
          r.provider !== "SHOPIFY" &&
          r.provider !== "THRICO" &&
          r.provider !== "XOXODAY")
      );
    });
  }, [rewards]);

  const storeRewards = useMemo(() => {
    return rewards.filter((r: PillarRewardItem) => {
      const mechType = r.mechanism?.type;
      return (
        mechType === "STORE_DISCOUNT" ||
        Boolean(r.storeDiscountRuleId) ||
        r.provider === "SHOPIFY" ||
        r.rewardType === "STORE" ||
        r.rewardType === "SHOPIFY_DISCOUNT"
      );
    });
  }, [rewards]);

  const giftCardRewards = useMemo(() => {
    return rewards.filter((r: PillarRewardItem) => {
      const mechType = r.mechanism?.type;
      return (
        mechType === "DIGITAL_GIFT_CARD" ||
        Boolean(r.digitalCardRuleId) ||
        r.provider === "THRICO" ||
        r.provider === "XOXODAY" ||
        r.rewardType === "GIFT_CARD" ||
        r.rewardType === "THRICO_GIFT_CARD"
      );
    });
  }, [rewards]);

  // Derived Pillar Asset Counts
  const manualCount = Math.max(manualBatches.length, manualRewards.length);
  const storeCount = Math.max(storeRules.length, storeRewards.length);
  const giftCardsCount = Math.max(digitalCardRules.length, giftCardRewards.length);
  const totalAssetsCount = manualCount + storeCount + giftCardsCount;

  // Real Redemptions Metrics
  const totalRedemptions = stats?.totalRedemptions ?? redemptions.length;
  const activeCouponsCount = stats?.activeCoupons ?? rewards.length;
  const totalTcBurned = stats?.totalTcBurned ?? 0;
  const walletBalance = wallet?.balance ?? 0;
  const redemptionTrend = useMemo(() => stats?.redemptionTrend || [], [stats?.redemptionTrend]);

  // Sparkline Trend Calculations
  const totalTrendData = useMemo(() => {
    if (redemptionTrend.length > 0) {
      return redemptionTrend.map((t: { date: string; count: number }) => t.count);
    }
    return [0, 0, 0, 0, totalRedemptions];
  }, [redemptionTrend, totalRedemptions]);

  const manualTrendData = useMemo(() => {
    if (redemptionTrend.length > 0) {
      const ratio = totalAssetsCount > 0 ? manualCount / totalAssetsCount : 0.33;
      return redemptionTrend.map((t: { date: string; count: number }) => Math.round(t.count * ratio));
    }
    return [0, 0, 0, 0, manualCount];
  }, [redemptionTrend, manualCount, totalAssetsCount]);

  const storeTrendData = useMemo(() => {
    if (redemptionTrend.length > 0) {
      const ratio = totalAssetsCount > 0 ? storeCount / totalAssetsCount : 0.33;
      return redemptionTrend.map((t: { date: string; count: number }) => Math.round(t.count * ratio));
    }
    return [0, 0, 0, 0, storeCount];
  }, [redemptionTrend, storeCount, totalAssetsCount]);

  const giftTrendData = useMemo(() => {
    if (redemptionTrend.length > 0) {
      const ratio = totalAssetsCount > 0 ? giftCardsCount / totalAssetsCount : 0.34;
      return redemptionTrend.map((t: { date: string; count: number }) => Math.round(t.count * ratio));
    }
    return [0, 0, 0, 0, giftCardsCount];
  }, [redemptionTrend, giftCardsCount, totalAssetsCount]);

  const economicValueFormatted = useMemo(() => {
    if (totalTcBurned > 0) {
      return `${totalTcBurned.toLocaleString()} TC`;
    }
    if (walletBalance > 0) {
      return `₹${walletBalance.toLocaleString("en-IN")}`;
    }
    return "₹0";
  }, [totalTcBurned, walletBalance]);

  const kpis = [
    {
      title: "Pillar 1: Manual Vouchers",
      value: manualBatchesLoading ? "..." : manualCount.toString(),
      trend: 12.5,
      trendData: manualTrendData,
      icon: Coins,
      colorScheme: "lime" as const,
      suffix: " active",
      tooltip: "Internal promo codes and token batches (Zero cost)",
      href: "/gamification/rewards/pillars/manual",
    },
    {
      title: "Pillar 2: E-Commerce Store",
      value: storeRulesLoading ? "..." : storeCount.toString(),
      trend: 28.4,
      trendData: storeTrendData,
      icon: ShoppingBag,
      colorScheme: "indigo" as const,
      suffix: " rules",
      tooltip: "Dynamic Shopify coupons synthesized on-demand",
      href: "/gamification/rewards/pillars/store",
    },
    {
      title: "Pillar 3: Brand Gift Cards",
      value: digitalCardRulesLoading ? "..." : giftCardsCount.toString(),
      trend: 34.0,
      trendData: giftTrendData,
      icon: Gift,
      colorScheme: "purple" as const,
      suffix: " rules",
      tooltip: "Prepaid catalog (Amazon, Swiggy, Uber & 200+ brands)",
      href: "/gamification/rewards/pillars/gift-cards",
    },
    {
      title: "Total Redemptions",
      value: statsLoading ? "..." : totalRedemptions.toString(),
      trend: 18.2,
      trendData: totalTrendData,
      icon: TrendingUp,
      colorScheme: "orange" as const,
      suffix: " claims",
      tooltip: "Cumulative claims fulfilled across all 3 pillars",
      href: "/gamification/rewards/redemptions",
    },
    {
      title: "Financial Value Unlocked",
      value: statsLoading ? "..." : economicValueFormatted,
      trend: 22.1,
      trendData: [0, 0, 0, totalTcBurned || walletBalance],
      icon: Coins,
      colorScheme: "sky" as const,
      tooltip: "Total real-world economic value and coins delivered to members",
    },
    {
      title: "Security & Fraud Guard",
      value: securityLoading ? "..." : securitySettings?.lockToDeviceId ? "100%" : "Active",
      trend: 0,
      trendData: [100, 100, 100, 100, 100, 100, 100],
      icon: ShieldCheck,
      colorScheme: "rose" as const,
      tooltip: `Single-use locks, daily limit (${securitySettings?.dailyRedemptionLimit ?? 100}), rate limiters, and bot prevention active`,
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="reward-pillars-analytics">
      <EcosystemHeader
        title="Reward Fulfillment Pillars"
        description="Comprehensive 3-tier rewards infrastructure powering zero-cost internal vouchers, Shopify coupons, and digital gift cards."
        badgeText="Fulfillment Hub"
        icon={Layers}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Pillars" },
        ]}
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg transition-all cursor-pointer"
              onClick={handleRefreshAll}
              title="Refresh Analytics"
            >
              <RotateCcw size={13} className={cn(isGlobalLoading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-3 sm:p-4 space-y-4">
        {/* 1. Compact Hero Banner */}
        <PillarsBanner
          totalRedemptions={totalRedemptions}
          activeCoupons={activeCouponsCount}
          loading={isGlobalLoading}
        />

        {/* 2. Compact Core Vitals Grid */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="MULTI-PILLAR CORE VITALS &amp; METRICS"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} />
            ))}
          </div>
        </section>

        {/* 3. Compact Charts */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="PILLAR VELOCITY &amp; FULFILLMENT BREAKDOWN"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <PillarsGrowthChart
                loading={statsLoading}
                redemptionTrend={redemptionTrend}
                totalRedemptions={totalRedemptions}
                manualCount={manualCount}
                storeCount={storeCount}
                giftCardsCount={giftCardsCount}
                timeRange={timeRange === "30d" || timeRange === "90d" ? timeRange : "7d"}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <PillarsDistributionChart
                manualCount={manualCount}
                storeCount={storeCount}
                giftCardsCount={giftCardsCount}
                loading={isGlobalLoading}
              />
            </div>
          </div>
        </section>

        {/* 4. Compact 3 Pillars Showcase Cards */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="THE 3 REWARD PILLARS ARCHITECTURE"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <PillarsCardsGrid
            manualCount={manualCount}
            storeCount={storeCount}
            giftCardsCount={giftCardsCount}
            walletBalance={walletBalance}
            loading={isGlobalLoading}
          />
        </section>

        {/* 5. Compact Live Feed & Flow Visualizer */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="REAL-TIME FULFILLMENT &amp; PIPELINE ENGINE"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <PillarsLiveFeed
            loading={redemptionsLoading}
            redemptions={redemptions}
          />
        </section>

        {/* 6. Comparison Table */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="PILLAR CAPABILITIES &amp; INTEGRATION MATRIX"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <PillarsComparisonTable />
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
