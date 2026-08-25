"use client";

import React, { useMemo } from "react";
import { LayoutGrid, Activity, Users, Globe } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { useModuleStore } from "@/store/useModuleStore";

interface CommunitiesKPIOverviewProps {
  loading: boolean;
  stats?: {
    totalCommunities?: number;
    totalCommunitiesChange?: number;
    activeCommunities?: number;
    activeCommunitiesChange?: number;
    totalEnrollments?: number;
    enrollmentsChange?: number;
    totalViews?: number;
    viewsChange?: number;
    enrollmentTrend?: Array<{ label: string; count: number }>;
  };
}

export function CommunitiesKPIOverview({
  loading,
  stats,
}: CommunitiesKPIOverviewProps) {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  const sparklineData = useMemo(() => {
    if (stats?.enrollmentTrend && stats.enrollmentTrend.length >= 3) {
      return stats.enrollmentTrend.map((t) => t.count);
    }
    return [4, 9, 7, 14, 20, 16, 28];
  }, [stats]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE COMMUNITY METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName || "Communities"}`}
          value={loading ? "..." : (stats?.totalCommunities?.toLocaleString() ?? "0")}
          trend={stats?.totalCommunitiesChange ?? 0}
          icon={LayoutGrid}
          colorScheme="indigo"
          tooltip="Total number of created community groups and hubs"
          trendData={sparklineData.map((v) => Math.round(v * 1.8) + 5)}
          href="/communities/all"
        />
        <EcosystemKPI
          title="Active Hubs"
          value={loading ? "..." : (stats?.activeCommunities?.toLocaleString() ?? "0")}
          trend={stats?.activeCommunitiesChange ?? 0}
          icon={Activity}
          colorScheme="lime"
          tooltip="Count of communities with recent active discussions and posts"
          trendData={sparklineData.map((v) => Math.round(v * 1.2) + 3)}
          href="/communities/all"
        />
        <EcosystemKPI
          title="Total Members"
          value={loading ? "..." : (stats?.totalEnrollments?.toLocaleString() ?? "0")}
          trend={stats?.enrollmentsChange ?? 0}
          icon={Users}
          colorScheme="purple"
          tooltip="Cumulative member enrollments across all community groups"
          trendData={sparklineData}
          href="/communities/all"
        />
        <EcosystemKPI
          title="Community Views"
          value={loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0")}
          trend={stats?.viewsChange ?? 0}
          icon={Globe}
          colorScheme="orange"
          tooltip="Total view impressions across community landing and discussion pages"
          trendData={sparklineData.map((v) => Math.round(v * 3.2) + 12)}
        />
      </div>
    </section>
  );
}
