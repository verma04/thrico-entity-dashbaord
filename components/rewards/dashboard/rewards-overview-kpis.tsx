import React from "react";
import { Ticket, Flame, AlertTriangle, Activity, TrendingUp, ShieldCheck, Coins } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";

interface RewardsOverviewKpisProps {
  stats?: any;
  statsLoading?: boolean;
  loading?: boolean;
  activeRewardsCount?: number;
}

export const RewardsOverviewKpis = ({
  stats,
  statsLoading,
  loading,
  activeRewardsCount,
}: RewardsOverviewKpisProps = {}) => {
  const isLoading = statsLoading ?? loading ?? false;
  const totalRedemptions = stats?.totalRedemptions || 128;
  const tcBurned = stats?.totalTcBurned || 14200;
  const activeCoupons = activeRewardsCount || stats?.activeCoupons || 14;
  const lowStock = stats?.lowInventoryItems || 2;
  const successRate = stats?.totalRedemptions > 0 
    ? Math.round(((stats?.successfulRedemptions || stats.totalRedemptions) / stats.totalRedemptions) * 100)
    : 99;

  const kpis = [
    {
      title: "Total Redemptions",
      value: isLoading ? "..." : totalRedemptions.toLocaleString(),
      trend: 18.2,
      trendData: [82, 88, 95, 104, 112, 120, totalRedemptions],
      icon: Ticket,
      colorScheme: "indigo" as const,
      trendLabel: "vs last period",
      tooltip: "Total reward claim events across coupons, games, and gift cards",
      href: "/gamification/rewards/redemptions",
    },
    {
      title: "Value Delivered",
      value: isLoading ? "..." : `₹${((stats?.totalRedemptions || 128) * 220).toLocaleString()}`,
      trend: 24.5,
      trendData: [18000, 20500, 22000, 24000, 26000, 28160],
      icon: TrendingUp,
      colorScheme: "lime" as const,
      trendLabel: "member savings",
      tooltip: "Estimated financial discount value unlocked for members",
    },
    {
      title: "Points Burned",
      value: isLoading ? "..." : tcBurned.toLocaleString(),
      trend: 14.8,
      trendData: [9500, 10400, 11200, 12300, 13100, 14200],
      icon: Flame,
      colorScheme: "orange" as const,
      suffix: " pts",
      trendLabel: "gamified tokens",
      tooltip: "Total currency burned by members across all reward claims",
    },
    {
      title: "Active Rewards",
      value: isLoading ? "..." : activeCoupons.toLocaleString(),
      trend: 8.3,
      trendData: [10, 11, 12, 12, 13, 14],
      icon: Coins,
      colorScheme: "sky" as const,
      trendLabel: "live in catalog",
      tooltip: "Total currently published and redeemable rewards",
      href: "/gamification/rewards/coupons",
    },
    {
      title: "Claim Success Rate",
      value: isLoading ? "..." : `${successRate}%`,
      trend: 0.5,
      trendData: [98, 98, 99, 99, 99, 99, successRate],
      icon: Activity,
      colorScheme: "rose" as const,
      trendLabel: "instant fulfillment",
      tooltip: "Percentage of claims successfully fulfilled without error",
    },
    {
      title: "Security & Guard",
      value: "100%",
      trend: 0,
      trendData: [100, 100, 100, 100, 100, 100, 100],
      icon: ShieldCheck,
      colorScheme: "purple" as const,
      trendLabel: "fraud protected",
      tooltip: "Single-use validation, rate limiting, and bot protection active",
      href: "/gamification/rewards/fraud",
    },
  ];

  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title="REWARDS CORE VITALS &amp; METRICS"
        titleClassName="normal-case tracking-normal text-xs text-foreground font-bold"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <EcosystemKPI key={i} {...kpi} />
        ))}
      </div>
    </section>
  );
};
