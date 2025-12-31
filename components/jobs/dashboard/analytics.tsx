"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
// import { useGetJobStats } from "@/graphql/actions/jobs";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Users, Eye, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function JobsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  // const { data, loading } = useGetJobStats(timeRange);

  const stats = {
    totalJobs: 100,
    activeJobs: 50,
    applications: 200,
    views: 150,
    totalJobsChange: 10,
    activeJobsChange: 5,
    applicationsChange: 20,
    viewsChange: 15,
  };
  let loading = false;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Jobs",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalJobs?.toLocaleString() ?? "N/A"
      ),
      change: stats?.totalJobsChange ?? 0,
      trend: (stats?.totalJobsChange ?? 0) >= 0 ? "up" : "down",
      icon: Briefcase,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Jobs",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.activeJobs?.toLocaleString() ?? "N/A"
      ),
      change: stats?.activeJobsChange ?? 0,
      trend: (stats?.activeJobsChange ?? 0) >= 0 ? "up" : "down",
      icon: FileText,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Applications",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.applications?.toLocaleString() ?? "N/A"
      ),
      change: stats?.applicationsChange ?? 0,
      trend: (stats?.applicationsChange ?? 0) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Views",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.views?.toLocaleString() ?? "N/A"
      ),
      change: stats?.viewsChange ?? 0,
      trend: (stats?.viewsChange ?? 0) >= 0 ? "up" : "down",
      icon: Eye,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  // Mock data for charts
  const applicationsData = [
    { name: "Mon", applications: 12 },
    { name: "Tue", applications: 19 },
    { name: "Wed", applications: 15 },
    { name: "Thu", applications: 22 },
    { name: "Fri", applications: 28 },
    { name: "Sat", applications: 10 },
    { name: "Sun", applications: 8 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Jobs Analytics"
      description="Track job postings and applicant activity"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="applications"
                  fill="#6366f1"
                  name="Applications"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
