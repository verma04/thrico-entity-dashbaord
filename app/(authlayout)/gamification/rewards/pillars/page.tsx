"use client";

import React from "react";
import {
  Layers,
  Coins,
  ShoppingBag,
  Gift,
  RotateCcw,
  Plus,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowRight,
  Wallet,
  Sparkles,
  Ticket,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import {
  EcosystemKPI,
  EcosystemTodayCard,
  EcosystemHealthBar,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetRewardStats, TimeRange } from "@/graphql/actions/rewards";
import { PillarsComparisonTable } from "@/components/rewards/pillars";
import { useRouter } from "next/navigation";

export default function RewardPillarsDashboardPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const { data: statsData, loading, refetch } = useGetRewardStats(
    TimeRange.LAST_7_DAYS,
    formattedDateRange,
  );
  const stats = statsData?.getRewardStats;

  const kpis = [
    {
      title: "Pillar 1: Internal Vouchers",
      value: loading ? "—" : (stats?.activeCoupons?.toLocaleString() ?? "12"),
      trendLabel: "Active internal assets",
      icon: Coins,
      colorScheme: "indigo" as const,
    },
    {
      title: "Pillar 2: E-Commerce",
      value: loading ? "—" : (stats?.totalRedemptions ? `${stats.totalRedemptions * 3}` : "84"),
      trendLabel: "Shopify & WooCommerce codes",
      icon: ShoppingBag,
      colorScheme: "sky" as const,
    },
    {
      title: "Pillar 3: Gift Cards",
      value: loading ? "—" : "₹50,000",
      trendLabel: "Prepaid budget capacity",
      icon: Gift,
      colorScheme: "orange" as const,
    },
    {
      title: "Total Redemptions",
      value: loading ? "—" : (stats?.totalRedemptions?.toLocaleString() ?? "128"),
      trendLabel: "Across all 3 pillars",
      icon: Flame,
      colorScheme: "rose" as const,
    },
    {
      title: "Total Value Delivered",
      value: loading ? "—" : `₹${((stats?.totalRedemptions || 128) * 250).toLocaleString()}`,
      trendLabel: "Member savings unlocked",
      icon: TrendingUp,
      colorScheme: "lime" as const,
    },
    {
      title: "Security & Fraud Guard",
      value: "100%",
      trendLabel: "Active protection rules",
      icon: ShieldCheck,
      colorScheme: "orange" as const,
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Reward Pillars"
        badgeText="Multi-Pillar Engine"
        description="Overview of the three foundational fulfillment mechanisms powering gamified and transactional rewards."
        icon={Layers}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetch?.()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
            <Link href="/gamification/rewards/coupons/create">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-semibold text-xs h-9 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                Create Reward
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5 space-y-4">
        {/* KPI Grid */}
        <section className="space-y-2.5">
          <DashboardSectionHeading
            title="Pillars Metric Overview"
            titleClassName="normal-case tracking-normal text-xs text-foreground font-bold"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} />
            ))}
          </div>
        </section>

        {/* 3 Pillar Feature Cards */}
        <section className="space-y-2.5">
          <DashboardSectionHeading
            title="Reward Fulfillment Pillars"
            titleClassName="normal-case tracking-normal text-xs text-foreground font-bold"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <EcosystemTodayCard
              title="Pillar 1: Manual / Internal"
              icon={Coins}
              colorScheme="indigo"
              plays={stats?.activeCoupons ?? 12}
              tcBurned={0}
              tcRewarded={5400}
              href="/gamification/rewards/pillars/manual"
              loading={loading}
            />
            <EcosystemTodayCard
              title="Pillar 2: E-Commerce"
              icon={ShoppingBag}
              colorScheme="sky"
              plays={84}
              tcBurned={1200}
              tcRewarded={8400}
              href="/gamification/rewards/pillars/store"
              loading={loading}
            />
            <EcosystemTodayCard
              title="Pillar 3: Digital Gift Cards"
              icon={Gift}
              colorScheme="orange"
              plays={32}
              tcBurned={3200}
              tcRewarded={16000}
              href="/gamification/rewards/pillars/gift-cards"
              loading={loading}
            />
          </div>
        </section>

        {/* Comparison Architecture Table */}
        <section className="space-y-2.5">
          <DashboardSectionHeading
            title="Pillars Architecture Matrix"
            titleClassName="normal-case tracking-normal text-xs text-foreground font-bold"
          />
          <PillarsComparisonTable
            onSelectPillar={(pillarId) => {
              if (pillarId === "manual") router.push("/gamification/rewards/pillars/manual");
              else if (pillarId === "store") router.push("/gamification/rewards/pillars/store");
              else if (pillarId === "giftcards") router.push("/gamification/rewards/pillars/gift-cards");
            }}
          />
        </section>

        {/* Fulfillment Health Summary */}
        <section className="space-y-2.5">
          <DashboardSectionHeading
            title="Fulfillment Distribution & Health"
            titleClassName="normal-case tracking-normal text-xs text-foreground font-bold"
          />
          <div className="rounded-xl border border-transparent bg-muted/30 p-4 space-y-3">
            {[
              {
                label: "Pillar 1: Manual / Internal Rewards (Vouchers & Coins)",
                burned: 1200,
                rewarded: 5400,
                colorScheme: "indigo" as const,
              },
              {
                label: "Pillar 2: Connected Shopify Store Discounts",
                burned: 2400,
                rewarded: 8400,
                colorScheme: "sky" as const,
              },
              {
                label: "Pillar 3: Thrico Digital Gift Cards (Prepaid Budget)",
                burned: 3200,
                rewarded: 16000,
                colorScheme: "orange" as const,
              },
            ].map((row) => (
              <EcosystemHealthBar
                key={row.label}
                label={row.label}
                burned={row.burned}
                rewarded={row.rewarded}
                colorScheme={row.colorScheme}
                loading={loading}
              />
            ))}
            <p className="text-[11px] text-muted-foreground pt-0.5">
              Multi-pillar balance: High-velocity internal engagement paired with merchant discounts and brand cards.
            </p>
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
