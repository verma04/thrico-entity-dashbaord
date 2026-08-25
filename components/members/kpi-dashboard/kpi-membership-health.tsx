"use client";

import React from "react";
import { Users, Activity, Target, ShieldBan } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const membershipHealthKPIs = [
  {
    title: "Total Members",
    key: "totalMembers",
    icon: Users,
    color: "bg-cyan-500",
    tooltip: "COUNT(members WHERE status != 'deleted')",
  },
  {
    title: "Active Members",
    key: "activeUsers",
    icon: Activity,
    color: "bg-emerald-500",
    tooltip: "Unique members active within the selected date range",
    href: "/members/all?filter=active",
  },
  {
    title: "Active Member Rate",
    key: "engagementRate",
    icon: Target,
    color: "bg-amber-400",
    suffix: "%",
    tooltip: "(Active Members ÷ Total Members) × 100",
  },
  {
    title: "Blocked Members",
    key: "blockMembers",
    icon: ShieldBan,
    color: "bg-rose-500",
    tooltip: "Members currently blocked across the platform",
    href: "/members/all?filter=blocked",
  },
];

interface KPIMembershipHealthProps {
  loading: boolean;
  getMetric: (key: string) => StatValue;
}

export function KPIMembershipHealth({
  loading,
  getMetric,
}: KPIMembershipHealthProps) {
  return (
    <section id="kpi-section-membership" className="space-y-3 scroll-mt-24">
      <DashboardSectionHeading title="MEMBERSHIP HEALTH" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipHealthKPIs.map((v) => {
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
