"use client";

import React from "react";
import { Coins, DollarSign, TrendingUp, Percent } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const monetisationKPIs = [
  {
    title: "Coins Payouts",
    key: "totalCurrencyPayouts",
    icon: Coins,
    color: "bg-amber-500",
    tooltip: "SUM(payout_amount WHERE status = 'completed')",
    href: "/gamification/currency",
  },
  {
    title: "Avg Revenue / Member",
    key: "revenuePerMember",
    icon: DollarSign,
    color: "bg-emerald-500",
    tooltip: "Total Community Revenue ÷ Active Members",
  },
  {
    title: "Member Lifetime Value",
    key: "memberLifetimeValue",
    icon: TrendingUp,
    color: "bg-indigo-500",
    tooltip: "Average total revenue generated per member over their lifecycle",
  },
  {
    title: "Revenue Conversion",
    key: "revenueConversionRate",
    icon: Percent,
    color: "bg-violet-500",
    suffix: "%",
    tooltip: "Members who made a transaction ÷ Active Members",
  },
];

interface KPIMonetisationProps {
  loading: boolean;
  getMetric: (key: string) => StatValue;
}

export function KPIMonetisation({ loading, getMetric }: KPIMonetisationProps) {
  return (
    <section
      id="kpi-section-monetisation"
      className="space-y-3 mt-20 scroll-mt-24"
    >
      <DashboardSectionHeading title="MONETISATION" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monetisationKPIs.map((v) => {
          const item = getMetric(v.key);
          return (
            <EcosystemKPI
              key={v.key}
              title={v.title}
              value={loading ? "..." : (item?.value ?? "0")}
              trend={item?.change ?? 0}
              trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
              icon={v.icon}
              color={v.color}
              suffix={(v as any).suffix}
              tooltip={v.tooltip}
              href={(v as any).href}
            />
          );
        })}
      </div>
    </section>
  );
}
