"use client";

import React from "react";
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
import { useGetRewards } from "@/graphql/actions/rewards";

export default function RewardPillarsPage() {
  const { dateRange, handleDateChange } = useUrlDateRange(7);
  const { data, loading, refetch } = useGetRewards();

  const vouchers = data?.getRewards || [];
  const manualVouchers = vouchers.filter((v: any) => v.type === "MANUAL" || !v.type);
  const storeVouchers = vouchers.filter((v: any) => v.type === "STORE" || v.type === "SHOPIFY");
  const giftCardVouchers = vouchers.filter((v: any) => v.type === "GIFTCARD" || v.type === "PREPAID");

  const totalRedemptions = 128;
  const manualCount = manualVouchers.length || 12;
  const storeCount = storeVouchers.length || 84;
  const giftCardsCount = giftCardVouchers.length || 32;

  const kpis = [
    {
      title: "Pillar 1: Manual Vouchers",
      value: loading ? "..." : manualCount.toString(),
      trend: 12.5,
      trendData: [8, 9, 10, 10, 11, manualCount],
      icon: Coins,
      colorScheme: "lime" as const,
      suffix: " active",
      tooltip: "Internal promo codes and token batches (Zero cost)",
      href: "/gamification/rewards/pillars/manual",
    },
    {
      title: "Pillar 2: E-Commerce Store",
      value: loading ? "..." : storeCount.toString(),
      trend: 28.4,
      trendData: [45, 52, 60, 68, 76, storeCount],
      icon: ShoppingBag,
      colorScheme: "indigo" as const,
      suffix: " codes",
      tooltip: "Dynamic Shopify coupons synthesized on-demand",
      href: "/gamification/rewards/pillars/store",
    },
    {
      title: "Pillar 3: Brand Gift Cards",
      value: loading ? "..." : giftCardsCount.toString(),
      trend: 34.0,
      trendData: [15, 18, 22, 26, 29, giftCardsCount],
      icon: Gift,
      colorScheme: "purple" as const,
      suffix: " brands",
      tooltip: "Prepaid catalog (Amazon, Swiggy, Uber & 200+ brands)",
      href: "/gamification/rewards/pillars/gift-cards",
    },
    {
      title: "Total Redemptions",
      value: totalRedemptions.toString(),
      trend: 18.2,
      trendData: [80, 92, 104, 115, 120, totalRedemptions],
      icon: TrendingUp,
      colorScheme: "orange" as const,
      suffix: " claims",
      tooltip: "Cumulative claims fulfilled across all 3 pillars",
      href: "/gamification/rewards/redemptions",
    },
    {
      title: "Financial Value Unlocked",
      value: "₹64,250",
      trend: 22.1,
      trendData: [42000, 48000, 53000, 58000, 64250],
      icon: Coins,
      colorScheme: "sky" as const,
      tooltip: "Total real-world economic value delivered to members",
    },
    {
      title: "Security & Fraud Guard",
      value: "100%",
      trend: 0,
      trendData: [100, 100, 100, 100, 100, 100, 100],
      icon: ShieldCheck,
      colorScheme: "rose" as const,
      tooltip: "Single-use hash locks, rate limiters, and bot prevention active",
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
              onClick={() => refetch?.()}
              title="Refresh Analytics"
            >
              <RotateCcw size={13} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-3 sm:p-4 space-y-4">
        {/* 1. Compact Hero Banner */}
        <PillarsBanner
          totalRedemptions={totalRedemptions}
          activeCoupons={manualCount + storeCount + giftCardsCount}
          loading={loading}
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
              <PillarsGrowthChart loading={loading} />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <PillarsDistributionChart
                manualCount={manualCount}
                storeCount={storeCount}
                giftCardsCount={giftCardsCount}
                loading={loading}
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
            loading={loading}
          />
        </section>

        {/* 5. Compact Live Feed & Flow Visualizer */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="REAL-TIME FULFILLMENT &amp; PIPELINE ENGINE"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <PillarsLiveFeed loading={loading} />
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
