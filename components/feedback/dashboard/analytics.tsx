"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { useGetFeedbackStats } from "@/graphql/actions/feedback";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Check, Clock, ThumbsUp } from "lucide-react";
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

export default function FeedbackAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading } = useGetFeedbackStats(timeRange);

  const stats = data?.getFeedbackStats;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Feedback",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalFeedback?.toLocaleString() ?? "N/A"
      ),
      change: stats?.totalFeedbackChange ?? 0,
      trend: (stats?.totalFeedbackChange ?? 0) >= 0 ? "up" : "down",
      icon: MessageSquare,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.pendingFeedback?.toLocaleString() ?? "N/A"
      ),
      change: stats?.pendingFeedbackChange ?? 0,
      trend: (stats?.pendingFeedbackChange ?? 0) <= 0 ? "up" : "down", // Less pending is usually good, but here let's assume standard trend display
      icon: Clock,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Resolved",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.resolvedFeedback?.toLocaleString() ?? "N/A"
      ),
      change: stats?.resolvedFeedbackChange ?? 0,
      trend: (stats?.resolvedFeedbackChange ?? 0) >= 0 ? "up" : "down",
      icon: Check,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Satisfaction Score",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : stats ? (
        `${stats.satisfactionScore}/5`
      ) : (
        "N/A"
      ),
      change: stats?.satisfactionScoreChange ?? 0,
      trend: (stats?.satisfactionScoreChange ?? 0) >= 0 ? "up" : "down",
      icon: ThumbsUp,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
  ];

  const feedbackTrendData = [
    { name: "Mon", feedback: 8 },
    { name: "Tue", feedback: 12 },
    { name: "Wed", feedback: 10 },
    { name: "Thu", feedback: 15 },
    { name: "Fri", feedback: 9 },
    { name: "Sat", feedback: 4 },
    { name: "Sun", feedback: 6 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Feedback Analytics"
      description="Monitor user feedback and resolution metrics"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedbackTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="feedback" fill="#3b82f6" name="Feedback" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
