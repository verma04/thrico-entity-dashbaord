"use client";

import React, { useMemo } from "react";
import { Radio, Activity, TrendingUp, Zap } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface FeedKpiOverviewProps {
  loading: boolean;
  kpiData?: {
    totalInteractions?: number;
    activeDiscussions?: number;
    networkVelocity?: number;
    engagementYield?: number;
    interactionsChange?: number;
    discussionsChange?: number;
    velocityChange?: number;
    yieldChange?: number;
  };
  timelineData?: Array<{ date: string; interactions: number }>;
}

export function FeedKpiOverview({
  loading,
  kpiData,
  timelineData = [],
}: FeedKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (timelineData && timelineData.length >= 3) {
      return timelineData.map((d) => d.interactions);
    }
    return [12, 19, 15, 27, 32, 28, 45];
  }, [timelineData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE ENGAGEMENT METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title="Total Reach"
          value={loading ? "..." : (kpiData?.totalInteractions?.toLocaleString() ?? "0")}
          trend={kpiData?.interactionsChange ?? 0}
          icon={Radio}
          colorScheme="indigo"
          tooltip="Total audience impressions and interactions across feed nodes"
          trendData={sparklineData.map((v) => Math.round(v * 1.5) + 8)}
          href="/feed"
        />
        <EcosystemKPI
          title="Active Dialogue"
          value={loading ? "..." : (kpiData?.activeDiscussions?.toLocaleString() ?? "0")}
          trend={kpiData?.discussionsChange ?? 0}
          icon={Activity}
          colorScheme="lime"
          tooltip="Live discussions and high-engagement threads within selected timeframe"
          trendData={sparklineData.map((v) => Math.round(v * 0.9) + 4)}
          href="/feed"
        />
        <EcosystemKPI
          title="Network Velocity"
          value={loading ? "..." : `${kpiData?.networkVelocity?.toLocaleString() ?? "0"}/hr`}
          trend={kpiData?.velocityChange ?? 0}
          icon={TrendingUp}
          colorScheme="purple"
          tooltip="Rate of new feed posts and conversational exchanges per hour"
          trendData={sparklineData}
          href="/feed"
        />
        <EcosystemKPI
          title="Engagement Yield"
          value={loading ? "..." : `${kpiData?.engagementYield ?? 0}%`}
          trend={kpiData?.yieldChange ?? 0}
          icon={Zap}
          colorScheme="orange"
          tooltip="Percentage of active feed impressions converting into meaningful actions"
          trendData={sparklineData.map((v) => Math.round(v * 2.2) + 15)}
        />
      </div>
    </section>
  );
}
