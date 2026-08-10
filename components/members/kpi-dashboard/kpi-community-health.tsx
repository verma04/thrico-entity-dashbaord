"use client";

import React from "react";
import {
  HeartPulse,
  Smile,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const kpis = [
  {
    title: "Health Index",
    key: "healthIndex" as const,
    icon: HeartPulse,
    tooltip: "Weighted Avg: Engagement (40%) + Retention (40%) + Content Activity (20%)",
    colorScheme: "lime" as const,
  },
  {
    title: "Member Happiness",
    key: "communityNPS" as const,
    icon: Smile,
    tooltip: "Engagement Rate × 1.2 − Churn Rate × 0.5",
    colorScheme: "orange" as const,
  },
  {
    title: "Satisfaction Score",
    key: "memberSatisfactionScore" as const,
    icon: Shield,
    tooltip: "Overall member satisfaction based on engagement signals",
    colorScheme: "indigo" as const,
  },
  {
    title: "Churn Prediction",
    key: "churnPredictionScore" as const,
    icon: AlertTriangle,
    tooltip: "Predictive score for members likely to churn",
    colorScheme: "rose" as const,
  },
];

interface KPICommunityHealthProps {
  loading: boolean;
  data: Record<string, StatValue | undefined>;
}

export function KPICommunityHealth({ loading, data }: KPICommunityHealthProps) {
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
            tooltip={kpi.tooltip}
          />
        );
      })}
    </div>
  );
}
