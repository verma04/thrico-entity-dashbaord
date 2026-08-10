"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Activity,
  ShieldBan,
  AlertTriangle,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const kpis = [
  {
    title: "Total Members",
    key: "totalMembers" as const,
    icon: Users,
    tooltip: "COUNT(members WHERE status != 'deleted')",
    colorScheme: "indigo" as const,
  },
  {
    title: "Active Members (30d)",
    key: "activeUsers" as const,
    icon: UserCheck,
    tooltip: "COUNT(DISTINCT member_id WHERE last_action ≥ today − 30d)",
    colorScheme: "lime" as const,
    href: "/members/all?filter=active",
  },
  {
    title: "Active Member Rate",
    key: "engagementRate" as const,
    icon: Activity,
    suffix: "%",
    tooltip: "(Active Members ÷ Total Members) × 100",
    colorScheme: "sky" as const,
  },
  {
    title: "Blocked Members",
    key: "blockMembers" as const,
    icon: ShieldBan,
    tooltip: "Members currently blocked across the platform",
    colorScheme: "rose" as const,
    href: "/members/all?filter=blocked",
  },
];

interface KPIMembershipHealthProps {
  loading: boolean;
  data: Record<string, StatValue | undefined>;
}

export function KPIMembershipHealth({ loading, data }: KPIMembershipHealthProps) {
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
