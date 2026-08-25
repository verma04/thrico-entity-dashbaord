"use client";

import React, { useMemo } from "react";
import { Calendar, Activity, Users, Eye } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface EventsKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalEvents?: number;
    activeEvents?: number;
    totalAttendees?: number;
    totalViews?: number;
    attendeesWeeklyChange?: number;
    viewsWeeklyChange?: number;
  };
  registrationTrend?: Array<{ name: string; registrations: number }>;
}

export function EventsKpiOverview({
  loading,
  moduleName = "Events",
  stats,
  registrationTrend = [],
}: EventsKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (registrationTrend.length >= 4) {
      return registrationTrend.map((d) => d.registrations || 0);
    }
    return [5, 12, 8, 19, 26, 22, 35];
  }, [registrationTrend]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE EVENT METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName}`}
          value={loading ? "..." : (stats?.totalEvents?.toLocaleString() ?? "0")}
          trend={stats?.attendeesWeeklyChange ?? 0}
          icon={Calendar}
          colorScheme="indigo"
          tooltip="Total scheduled and published events"
          trendData={sparklineData.map((v) => Math.round(v * 1.5) + 3)}
          href="/events/all"
        />
        <EcosystemKPI
          title="Active Now"
          value={loading ? "..." : (stats?.activeEvents?.toLocaleString() ?? "0")}
          trend={stats?.viewsWeeklyChange ?? 0}
          icon={Activity}
          colorScheme="lime"
          tooltip="Currently running live or open registration assemblies"
          trendData={sparklineData.map((v) => Math.round(v * 0.9) + 1)}
          href="/events/all"
        />
        <EcosystemKPI
          title="Total Attendance"
          value={loading ? "..." : (stats?.totalAttendees?.toLocaleString() ?? "0")}
          trend={stats?.attendeesWeeklyChange ?? 0}
          icon={Users}
          colorScheme="purple"
          tooltip="Cumulative registered attendees across all assemblies"
          trendData={sparklineData}
          href="/events/all"
        />
        <EcosystemKPI
          title="Event Engagement"
          value={loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0")}
          trend={stats?.viewsWeeklyChange ?? 0}
          icon={Eye}
          colorScheme="orange"
          tooltip="Total view impressions across event listing and detail pages"
          trendData={sparklineData.map((v) => Math.round(v * 2.8) + 10)}
        />
      </div>
    </section>
  );
}
