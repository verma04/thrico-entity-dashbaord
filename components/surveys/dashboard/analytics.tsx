"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Layout,
} from "lucide-react";
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
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { TimeRange } from "@/graphql/actions/dashboard";
import { useGetSurveyStats } from "@/graphql/surveys/survey-queries";

export default function SurveyAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading } = useGetSurveyStats(timeRange);

  const stats = data?.getSurveyStats;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Surveys",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.totalSurveys?.toLocaleString() ?? "0")
      ),
      change: stats?.totalSurveysChange ?? 0,
      trend: (stats?.totalSurveysChange ?? 0) >= 0 ? "up" : "down",
      icon: ClipboardList,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Surveys",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.activeSurveys?.toLocaleString() ?? "0")
      ),
      change: stats?.activeSurveysChange ?? 0,
      trend: (stats?.activeSurveysChange ?? 0) >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Responses",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.totalResponses?.toLocaleString() ?? "0")
      ),
      change: stats?.totalResponsesChange ?? 0,
      trend: (stats?.totalResponsesChange ?? 0) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-purple-700",
      bgColor: "bg-purple-50",
    },
    {
      title: "Completion Rate",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        `${stats?.completionRate?.toFixed(1) ?? "0"}%`
      ),
      change: stats?.completionRateChange ?? 0,
      trend: (stats?.completionRateChange ?? 0) >= 0 ? "up" : "down",
      icon: CheckCircle2,
      color: "text-orange-700",
      bgColor: "bg-orange-50",
    },
  ];

  const responseTrendData =
    stats?.responseTrend?.map((item: { date: string; count: number }) => ({
      name: item.date,
      responses: item.count,
    })) || [];

  const surveyStatusData =
    stats?.statusDistribution?.map(
      (item: { status: string; count: number }) => ({
        name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
        value: item.count,
        color:
          item.status === "PUBLISHED"
            ? "#10b981"
            : item.status === "DRAFT"
              ? "#6b7280"
              : "#ef4444",
      }),
    ) || [];

  return (
    <ModuleAnalyticsLayout
      title="Surveys Dashboard"
      description="Monitor survey engagement and response trends"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Responses Trend */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Response Trends
              </CardTitle>
            </div>
            <Link href="/surveys/all">
              <Button variant="outline" size="sm" className="gap-2">
                <Layout className="h-4 w-4" />
                View All Surveys
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="responses"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#8b5cf6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="shadow-sm border-none bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Survey Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {loading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={surveyStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {surveyStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {!loading && (
              <div className="space-y-3 mt-4">
                {surveyStatusData.map((item: any) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                    <span className="text-muted-foreground">
                      {item.value} Surveys
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
