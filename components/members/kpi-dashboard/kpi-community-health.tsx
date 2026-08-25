"use client";

import React from "react";
import { HeartPulse, Smile, Shield, AlertTriangle } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const communityHealthKPIs = [
  {
    title: "Health Index",
    key: "healthIndex",
    icon: HeartPulse,
    color: "bg-emerald-500",
    tooltip:
      "Weighted Avg: Engagement (40%) + Retention (40%) + Content Activity (20%)",
  },
  {
    title: "Member Happiness",
    key: "communityNPS",
    icon: Smile,
    color: "bg-yellow-400",
    tooltip: "Engagement Rate × 1.2 − Churn Rate × 0.5",
  },
  {
    title: "Satisfaction Score",
    key: "memberSatisfactionScore",
    icon: Shield,
    color: "bg-indigo-500",
    tooltip: "Overall member satisfaction based on engagement signals",
  },
  {
    title: "Churn Prediction",
    key: "churnPredictionScore",
    icon: AlertTriangle,
    color: "bg-rose-500",
    tooltip: "Predictive score for members likely to churn",
  },
];

interface KPICommunityHealthProps {
  loading: boolean;
  getMetric: (key: string) => StatValue;
}

export function KPICommunityHealth({
  loading,
  getMetric,
}: KPICommunityHealthProps) {
  return (
    <section id="kpi-section-health" className="space-y-3 mt-20 scroll-mt-24">
      <DashboardSectionHeading title="COMMUNITY HEALTH" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityHealthKPIs.map((v) => {
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
              tooltip={v.tooltip}
            />
          );
        })}
      </div>
    </section>
  );
}
