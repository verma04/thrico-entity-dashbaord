"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Users,
  Activity,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetDashboardStats, TimeRange } from "@/graphql/actions";
import { PlatformModules } from "./platform-modules";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleActivityChart } from "./module-activity-chart";
import { PlatformModuleChart } from "./platform-module-chart";

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const { data, loading } = useGetDashboardStats(timePeriod);

  const stats = data?.getDashboardStats;

  // KPI Stats
  const kpiStats = [
    {
      title: "Total Users",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.totalUsers?.toLocaleString() ?? "Loading...")
      ),
      change: stats?.totalUsersChange ?? 0,
      trend: (stats?.totalUsersChange ?? 0) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Today",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.activeUsers?.toLocaleString() ?? "Loading...")
      ),
      change: stats?.activeUsersChange ?? 0,
      trend: (stats?.activeUsersChange ?? 0) >= 0 ? "up" : "down",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Page Views",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        (stats?.pageViews?.toLocaleString() ?? "Loading...")
      ),
      change: stats?.pageViewsChange ?? 0,
      trend: (stats?.pageViewsChange ?? 0) >= 0 ? "up" : "down",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Engagement Rate",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : stats ? (
        `${stats.engagementRate}%`
      ) : (
        "Loading..."
      ),
      change: stats?.engagementRateChange ?? 0,
      trend: (stats?.engagementRateChange ?? 0) >= 0 ? "up" : "down",
      icon: MousePointer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Weekly Activity Data
  const weeklyActivityData = [
    { day: "Mon", posts: 245, comments: 420, likes: 680 },
    { day: "Tue", posts: 312, comments: 485, likes: 750 },
    { day: "Wed", posts: 280, comments: 445, likes: 690 },
    { day: "Thu", posts: 356, comments: 520, likes: 820 },
    { day: "Fri", posts: 298, comments: 465, likes: 710 },
    { day: "Sat", posts: 189, comments: 320, likes: 520 },
    { day: "Sun", posts: 156, comments: 280, likes: 450 },
  ];

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your platform's performance and activity
          </p>
        </div>
        <Select
          value={timePeriod}
          onValueChange={(val) => setTimePeriod(val as TimeRange)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimeRange.LAST_24_HOURS}>
              Last 24 hours
            </SelectItem>
            <SelectItem value={TimeRange.LAST_7_DAYS}>Last 7 days</SelectItem>
            <SelectItem value={TimeRange.LAST_30_DAYS}>Last 30 days</SelectItem>
            <SelectItem value={TimeRange.LAST_90_DAYS}>Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === "up" ? "text-gray-600" : "text-gray-500"
                    }`}
                  >
                    <TrendIcon className="h-4 w-4" />
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="text-2xl font-bold mt-1 flex items-center min-h-[32px]">
                    {stat.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Module Chart */}
        <PlatformModuleChart />

        {/* Module Distribution Pie Chart */}
        <ModuleActivityChart timeRange={timePeriod} />
      </div>

      {/* Weekly Activity Bar Chart */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Posts, comments, and likes by day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="posts"
                fill="#6b7280"
                name="Posts"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="comments"
                fill="#9ca3af"
                name="Comments"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="likes"
                fill="#d1d5db"
                name="Likes"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Module Overview Section */}
      <PlatformModules />
    </div>
  );
}
