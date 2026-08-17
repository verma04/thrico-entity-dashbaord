"use client";

import React from "react";
import { LayoutGrid, Activity, Users, Globe } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
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
  };
}

export function CommunitiesKPIOverview({
  loading,
  stats,
}: CommunitiesKPIOverviewProps) {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  const kpis = [
    {
      title: `Total ${moduleName || "Communities"}`,
      value: loading
        ? "..."
        : (stats?.totalCommunities?.toLocaleString() ?? "0"),
      trend: stats?.totalCommunitiesChange ?? 0,
      icon: LayoutGrid,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Live Now",
      value: loading
        ? "..."
        : (stats?.activeCommunities?.toLocaleString() ?? "0"),
      trend: stats?.activeCommunitiesChange ?? 0,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Members",
      value: loading
        ? "..."
        : (stats?.totalEnrollments?.toLocaleString() ?? "0"),
      trend: stats?.enrollmentsChange ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Globe,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Insights"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <EcosystemKPI key={i} {...kpi} trendLabel="vs before" />
        ))}
      </div>
    </section>
  );
}
