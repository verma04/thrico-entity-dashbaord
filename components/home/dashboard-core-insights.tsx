import React from "react";
import {
  Users,
  Activity,
  Shield,
  Target,
  Heart,
  TrendingDown,
  Award,
  Star,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

const vitals = [
  {
    title: "New Members",
    key: "newMembers",
    color: "bg-cyan-500",
    icon: Users,
    tooltip: "Members who joined during the selected period",
    href: "/members/all?filter=new",
  },
  {
    title: "Active Members",
    key: "activeUsers",
    color: "bg-emerald-500",
    icon: Activity,
    tooltip: "Count of unique members active within the selected date range",
    href: "/members/all?filter=active",
  },
  {
    title: "Blocked Members",
    key: "blockMembers",
    color: "bg-blue-500",
    icon: Shield,
    tooltip: "Total blocked members across the platform",
    href: "/members/all?filter=blocked",
  },
  {
    title: "Engagement Rate",
    key: "engagementRate",
    color: "bg-amber-400",
    suffix: "%",
    icon: Target,
    tooltip: "(DAU / Total Members) × 100",
  },
  {
    title: "Retention Rate",
    key: "retentionRate",
    color: "bg-indigo-500",
    suffix: "%",
    icon: Heart,
    tooltip: "(MAU / Total Members) × 100",
  },
  {
    title: "Churn Rate",
    key: "churnRate",
    color: "bg-rose-500",
    suffix: "%",
    icon: TrendingDown,
    tooltip: "((Total Members - DAU) / Total Members) × 100",
  },
  {
    title: "Community Health",
    key: "healthIndex",
    color: "bg-red-500",
    icon: Award,
    tooltip:
      "Weighted Avg: Engagement (40%) + Retention (40%) + Content Activity (20%)",
  },
  {
    title: "Member Happiness",
    key: "communityNPS",
    color: "bg-yellow-400",
    icon: Star,
    tooltip: "Engagement Rate × 1.2 - Churn Rate × 0.5",
  },
];

interface DashboardCoreInsightsProps {
  loading: boolean;
  getMetric: (key: string) => any;
  DashboardSectionHeading: React.FC<{
    title: string;
    action?: React.ReactNode;
    tooltip?: string;
  }>;
}

export function DashboardCoreInsights({
  loading,
  getMetric,
  DashboardSectionHeading,
}: DashboardCoreInsightsProps) {
  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE COMMUNITY INSIGHTS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitals.map((v) => {
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
              tooltip={(v as any).tooltip}
              href={(v as any).href}
            />
          );
        })}
      </div>
    </section>
  );
}
