import React from "react";
import { Ticket, Flame, AlertTriangle, Activity } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";

interface RewardsOverviewKpisProps {
  stats: any;
  statsLoading: boolean;
}

export const RewardsOverviewKpis = ({
  stats,
  statsLoading,
}: RewardsOverviewKpisProps) => {
  const kpis = [
    {
      title: "Total Redemptions",
      value: statsLoading ? "..." : stats?.totalRedemptions || "0",
      icon: Ticket,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trendLabel: "All time records",
    },
    {
      title: "Points Distributed",
      value: statsLoading
        ? "..."
        : stats?.totalTcBurned?.toLocaleString() || "0",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trendLabel: "Value given back",
    },
    {
      title: "Low Stock Items",
      value: statsLoading ? "..." : stats?.lowInventoryItems || "0",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trendLabel: "Needs attention",
    },
    {
      title: "Success Rate",
      value: statsLoading 
        ? "..." 
        : stats?.totalRedemptions > 0 
          ? `${Math.round(((stats?.successfulRedemptions || 0) / stats.totalRedemptions) * 100)}%` 
          : "0%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trendLabel: "Fulfillment health",
    },
  ];

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Rewards Overview"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <EcosystemKPI key={i} {...kpi} />
        ))}
      </div>
    </section>
  );
};
