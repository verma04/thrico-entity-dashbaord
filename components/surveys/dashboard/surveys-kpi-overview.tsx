"use client";

import React, { useMemo } from "react";
import { ClipboardList, Activity, Users, Zap } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface SurveysKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalSurveys?: number;
    activeSurveys?: number;
    totalResponses?: number;
    completionRate?: number;
    totalSurveysChange?: number;
    activeSurveysChange?: number;
    totalResponsesChange?: number;
    completionRateChange?: number;
  };
  trendData?: Array<{ name: string; responses: number }>;
}

export function SurveysKpiOverview({
  loading,
  moduleName = "Surveys",
  stats,
  trendData = [],
}: SurveysKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (trendData && trendData.length >= 3) {
      return trendData.map((d) => d.responses || 0);
    }
    return [5, 14, 9, 20, 28, 22, 36];
  }, [trendData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE FEEDBACK METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName}`}
          value={loading ? "..." : (stats?.totalSurveys?.toLocaleString() ?? "0")}
          trend={stats?.totalSurveysChange ?? 0}
          icon={ClipboardList}
          colorScheme="indigo"
          tooltip="Total feedback forms and multi-question surveys created"
          trendData={sparklineData.map((v) => Math.round(v * 1.3) + 4)}
          href="/surveys/all"
        />
        <EcosystemKPI
          title={`Active ${moduleName}`}
          value={loading ? "..." : (stats?.activeSurveys?.toLocaleString() ?? "0")}
          trend={stats?.activeSurveysChange ?? 0}
          icon={Activity}
          colorScheme="lime"
          tooltip="Currently published surveys live and collecting responses"
          trendData={sparklineData.map((v) => Math.round(v * 0.8) + 2)}
          href="/surveys/all"
        />
        <EcosystemKPI
          title="Total Responses"
          value={loading ? "..." : (stats?.totalResponses?.toLocaleString() ?? "0")}
          trend={stats?.totalResponsesChange ?? 0}
          icon={Users}
          colorScheme="purple"
          tooltip="Cumulative user response submissions across all active surveys"
          trendData={sparklineData}
          href="/surveys/all"
        />
        <EcosystemKPI
          title="Completion Rate"
          value={loading ? "..." : `${stats?.completionRate?.toFixed(1) ?? "0"}%`}
          trend={stats?.completionRateChange ?? 0}
          icon={Zap}
          colorScheme="orange"
          tooltip="Percentage of started survey forms that were completed and submitted"
          trendData={sparklineData.map((v) => Math.round(v * 2.5) + 10)}
        />
      </div>
    </section>
  );
}
