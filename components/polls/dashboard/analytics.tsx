"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { useGetPollStats } from "@/graphql/actions/polls";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Vote, Activity, Users, CheckCircle } from "lucide-react";
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

export default function PollsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading } = useGetPollStats(timeRange);

  const stats = data?.getPollStats;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Polls",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalPolls?.toLocaleString() ?? "N/A"
      ),
      change: stats?.totalPollsChange ?? 0,
      trend: (stats?.totalPollsChange ?? 0) >= 0 ? "up" : "down",
      icon: Vote,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Polls",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.activePolls?.toLocaleString() ?? "N/A"
      ),
      change: stats?.activePollsChange ?? 0,
      trend: (stats?.activePollsChange ?? 0) >= 0 ? "up" : "down",
      icon: Activity,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Votes",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.votes?.toLocaleString() ?? "N/A"
      ),
      change: stats?.votesChange ?? 0,
      trend: (stats?.votesChange ?? 0) >= 0 ? "up" : "down",
      icon: CheckCircle,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    {
      title: "Engagement Rate",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : stats ? (
        `${stats.engagementRate}%`
      ) : (
        "N/A"
      ),
      change: stats?.engagementRateChange ?? 0,
      trend: (stats?.engagementRateChange ?? 0) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  const pollVotesData = [
    { name: "Mon", votes: 45 },
    { name: "Tue", votes: 32 },
    { name: "Wed", votes: 60 },
    { name: "Thu", votes: 20 },
    { name: "Fri", votes: 55 },
    { name: "Sat", votes: 80 },
    { name: "Sun", votes: 40 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Polls Analytics"
      description="Insights into poll engagement and voting trends"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pollVotesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#8b5cf6" name="Votes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
