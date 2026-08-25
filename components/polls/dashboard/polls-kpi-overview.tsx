"use client";

import React, { useMemo } from "react";
import { Vote, Activity, CheckCircle, Users } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface PollsKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalPolls?: number;
    activePolls?: number;
    votes?: number;
    engagementRate?: number;
    totalPollsChange?: number;
    activePollsChange?: number;
    votesChange?: number;
    engagementRateChange?: number;
  };
  trendData?: Array<{ name: string; votes: number }>;
}

export function PollsKpiOverview({
  loading,
  moduleName = "Polls",
  stats,
  trendData = [],
}: PollsKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (trendData && trendData.length >= 3) {
      return trendData.map((d) => d.votes || 0);
    }
    return [10, 22, 16, 30, 42, 35, 55];
  }, [trendData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE SENTIMENT METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName}`}
          value={loading ? "..." : (stats?.totalPolls?.toLocaleString() ?? "0")}
          trend={stats?.totalPollsChange ?? 0}
          icon={Vote}
          colorScheme="indigo"
          tooltip="Total sentiment surveys and opinion polls published"
          trendData={sparklineData.map((v) => Math.round(v * 1.2) + 3)}
          href="/polls/all"
        />
        <EcosystemKPI
          title="Active Now"
          value={loading ? "..." : (stats?.activePolls?.toLocaleString() ?? "0")}
          trend={stats?.activePollsChange ?? 0}
          icon={Activity}
          colorScheme="lime"
          tooltip="Currently live polls actively gathering community votes"
          trendData={sparklineData.map((v) => Math.round(v * 0.8) + 1)}
          href="/polls/all"
        />
        <EcosystemKPI
          title="Total Votes"
          value={loading ? "..." : (stats?.votes?.toLocaleString() ?? "0")}
          trend={stats?.votesChange ?? 0}
          icon={CheckCircle}
          colorScheme="purple"
          tooltip="Cumulative casted ballot votes across all active polls"
          trendData={sparklineData}
          href="/polls/all"
        />
        <EcosystemKPI
          title="Participation Rate"
          value={loading ? "..." : `${stats?.engagementRate ?? 0}%`}
          trend={stats?.engagementRateChange ?? 0}
          icon={Users}
          colorScheme="orange"
          tooltip="Percentage of active community members participating in polling"
          trendData={sparklineData.map((v) => Math.round(v * 2.1) + 12)}
        />
      </div>
    </section>
  );
}
