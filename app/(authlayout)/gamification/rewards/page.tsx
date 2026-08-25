"use client";

import React from "react";
import {
  Gift,
  RotateCcw,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RewardsBanner,
  RedemptionActivityChart,
  RecentRedemptions,
  InventoryGlance,
  PointsSpentChart,
  PopularRewards,
  EngagementMetrics,
  RewardsNavigation,
} from "@/components/rewards/dashboard";
import { useGetRewards } from "@/graphql/actions/rewards";

export default function RewardsOverviewPage() {
  const { dateRange, handleDateChange } = useUrlDateRange(7);
  const { data, loading, refetch } = useGetRewards();

  const vouchers = data?.getRewards || [];


  return (
    <EcosystemWrapper anonymized-1="rewards-overview-analytics">
      <EcosystemHeader
        title="Rewards Center Overview"
        description="Monitor automated voucher redemption velocity, store discounts, token expenditures, and member claims."
        badgeText="Rewards Engine"
        icon={Gift}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards" },
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
        {/* Previous Interactive Games Banner */}
        <RewardsBanner />

        {/* 1. Compact Module Quick-Nav Hub */}
        <RewardsNavigation />

        {/* 2. Compact Main Analytics Row */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="REDEMPTION VELOCITY &amp; LIVE ACTIVITY STREAM"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
              <RedemptionActivityChart loading={loading} />
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <RecentRedemptions loading={loading} />
            </div>
          </div>
        </section>

        {/* 4. Compact Secondary Row: Points Flow & Popular Rewards */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="POINTS FLOW VELOCITY &amp; POPULAR CATALOG"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <PointsSpentChart loading={loading} />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <PopularRewards loading={loading} />
            </div>
          </div>
        </section>

        {/* 5. Compact Bottom Row: Stock Health & Retention */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="INVENTORY CAPACITIES &amp; RETENTION DRIVERS"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <InventoryGlance rewards={vouchers} loading={loading} />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <EngagementMetrics loading={loading} />
            </div>
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
