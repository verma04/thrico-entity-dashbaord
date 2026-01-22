"use client";

import React from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { useGetMentorshipStats } from "@/graphql/mentorship/mentorship-quiries";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Clock, UserX, FolderTree } from "lucide-react";
import { TimeRange } from "@/graphql/actions";
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

export default function MentorshipAnalytics() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const { data, loading } = useGetMentorshipStats();

  const stats = data?.getMentorshipStats;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Mentors",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.totalMentors?.toLocaleString() ?? "0")
      ),
      icon: Users,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      title: "Approved Mentors",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.approvedMentors?.toLocaleString() ?? "0")
      ),
      icon: UserCheck,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Requests",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.pendingMentors?.toLocaleString() ?? "0")
      ),
      icon: Clock,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Categories",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.totalCategories?.toLocaleString() ?? "0")
      ),
      icon: FolderTree,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  // Placeholder data for distribution or trends since the current query doesn't provide it
  const mentorshipOverviewData = [
    { name: "Approved", count: stats?.approvedMentors ?? 0 },
    { name: "Pending", count: stats?.pendingMentors ?? 0 },
    { name: "Rejected", count: stats?.rejectedMentors ?? 0 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Mentorship Analytics"
      description="Track mentor applications and platform distribution"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mentorshipOverviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Mentors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
