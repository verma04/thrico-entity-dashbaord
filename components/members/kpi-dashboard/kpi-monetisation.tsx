"use client";

import React from "react";
import {
  Coins,
  DollarSign,
  TrendingUp,
  Percent,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const kpis = [
  {
    title: "Coins Payouts",
    key: "totalCurrencyPayouts" as const,
    icon: Coins,
    tooltip: "SUM(payout_amount WHERE status = 'completed')",
    colorScheme: "orange" as const,
    href: "/gamification/currency",
  },
  {
    title: "Avg Revenue / Member",
    key: "revenuePerMember" as const,
    icon: DollarSign,
    tooltip: "Total Community Revenue ÷ Active Members",
    colorScheme: "lime" as const,
  },
  {
    title: "Member Lifetime Value",
    key: "memberLifetimeValue" as const,
    icon: TrendingUp,
    tooltip: "Average total revenue generated per member over their lifecycle",
    colorScheme: "indigo" as const,
  },
  {
    title: "Revenue Conversion",
    key: "revenueConversionRate" as const,
    icon: Percent,
    suffix: "%",
    tooltip: "Members who made a transaction ÷ Active Members",
    colorScheme: "purple" as const,
  },
];

interface KPIMonetisationProps {
  loading: boolean;
  data: Record<string, StatValue | undefined>;
}

export function KPIMonetisation({ loading, data }: KPIMonetisationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const metric = data[kpi.key];
        return (
          <EcosystemKPI
            key={kpi.key}
            title={kpi.title}
            value={loading ? "..." : (metric?.value ?? "0")}
            trend={metric?.change ?? 0}
            trendData={metric?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
            icon={kpi.icon}
            colorScheme={kpi.colorScheme}
            suffix={(kpi as any).suffix}
            tooltip={kpi.tooltip}
            href={(kpi as any).href}
          />
        );
      })}
    </div>
  );
}
