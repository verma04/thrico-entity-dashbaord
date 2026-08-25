"use client";

import React, { useMemo } from "react";
import { Briefcase, FileText, Users, Eye } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface JobsKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalJobs?: number;
    activeJobs?: number;
    totalApplications?: number;
    totalViews?: number;
    totalJobsChange?: number;
    activeJobsChange?: number;
    applicationsChange?: number;
    viewsChange?: number;
  };
  trendData?: Array<{ name: string; applications: number }>;
}

export function JobsKpiOverview({
  loading,
  moduleName = "Jobs",
  stats,
  trendData = [],
}: JobsKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (trendData && trendData.length >= 3) {
      return trendData.map((d) => d.applications || 0);
    }
    return [4, 11, 8, 18, 24, 20, 32];
  }, [trendData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE RECRUITMENT METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName}`}
          value={loading ? "..." : (stats?.totalJobs?.toLocaleString() ?? "0")}
          trend={stats?.totalJobsChange ?? 0}
          icon={Briefcase}
          colorScheme="indigo"
          tooltip="Total career opportunities and job postings created"
          trendData={sparklineData.map((v) => Math.round(v * 1.4) + 5)}
          href="/jobs/all"
        />
        <EcosystemKPI
          title="Active Openings"
          value={loading ? "..." : (stats?.activeJobs?.toLocaleString() ?? "0")}
          trend={stats?.activeJobsChange ?? 0}
          icon={FileText}
          colorScheme="lime"
          tooltip="Currently active listings accepting candidate applications"
          trendData={sparklineData.map((v) => Math.round(v * 0.9) + 2)}
          href="/jobs/all"
        />
        <EcosystemKPI
          title="Applications"
          value={loading ? "..." : (stats?.totalApplications?.toLocaleString() ?? "0")}
          trend={stats?.applicationsChange ?? 0}
          icon={Users}
          colorScheme="purple"
          tooltip="Total submitted candidate resumes and job applications"
          trendData={sparklineData}
          href="/jobs/all"
        />
        <EcosystemKPI
          title="Job Visibility"
          value={loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0")}
          trend={stats?.viewsChange ?? 0}
          icon={Eye}
          colorScheme="orange"
          tooltip="Total view impressions across job detail and board pages"
          trendData={sparklineData.map((v) => Math.round(v * 3.1) + 12)}
        />
      </div>
    </section>
  );
}
