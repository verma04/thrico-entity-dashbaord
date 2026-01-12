"use client";
import React, { useState, useMemo } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { Users, LayoutGrid, MessageSquare, Eye } from "lucide-react";
import { getCommunityStats } from "@/graphql/actions/group";
import { GetCommunityStatsResponse } from "@/graphql/quries/group/approval";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { TimeRange } from "@/graphql/actions";

import { WeeklySignupsChart } from "./WeeklySignupsChart";
import { CommunitiesStatusChart } from "./CommunitiesStatusChart";
import { TopActiveCommunitiesChart } from "./TopActiveCommunitiesChart";
import { CommunityPerformanceTable } from "./CommunityPerformanceTable";

// Sample data for charts
const weeklySignupsData = [
  { day: "Mon", signups: 120 },
  { day: "Tue", signups: 132 },
  { day: "Wed", signups: 101 },
  { day: "Thu", signups: 134 },
  { day: "Fri", signups: 190 },
  { day: "Sat", signups: 230 },
  { day: "Sun", signups: 210 },
];

const topCommunitiesData = [
  { name: "Photography Enthusiasts", members: 12500 },
  { name: "Tech Innovators", members: 9800 },
  { name: "Fitness & Health", members: 8700 },
  { name: "Book Lovers", members: 7600 },
  { name: "Travel Adventures", members: 6500 },
];

const membersByInterestData = [
  { name: "Technology", value: 35 },
  { name: "Arts", value: 25 },
  { name: "Finance", value: 15 },
  { name: "Health", value: 15 },
  { name: "Other", value: 10 },
];

const communityPerformanceData = [
  {
    key: "1",
    name: "Photography Enthusiasts",
    slug: "photography-enthusiasts",
    members: 12500,
    activePercentage: 78,
    lastActivity: "2 hours ago",
  },
  {
    key: "2",
    name: "Tech Innovators",
    slug: "tech-innovators",
    members: 9800,
    activePercentage: 82,
    lastActivity: "1 hour ago",
  },
  {
    key: "3",
    name: "Fitness & Health",
    slug: "fitness-health",
    members: 8700,
    activePercentage: 65,
    lastActivity: "3 hours ago",
  },
  {
    key: "4",
    name: "Book Lovers",
    slug: "book-lovers",
    members: 7600,
    activePercentage: 58,
    lastActivity: "5 hours ago",
  },
  {
    key: "5",
    name: "Travel Adventures",
    slug: "travel-adventures",
    members: 6500,
    activePercentage: 72,
    lastActivity: "4 hours ago",
  },
  {
    key: "6",
    name: "Cooking Masters",
    slug: "cooking-masters",
    members: 5400,
    activePercentage: 67,
    lastActivity: "6 hours ago",
  },
  {
    key: "7",
    name: "Gaming Community",
    slug: "gaming-community",
    members: 11200,
    activePercentage: 88,
    lastActivity: "30 minutes ago",
  },
];

// Helper function to get color based on activity percentage
function getActivityColor(percentage: number) {
  if (percentage >= 80) return "hsl(var(--chart-1))";
  if (percentage >= 60) return "hsl(var(--chart-2))";
  if (percentage >= 40) return "hsl(var(--chart-3))";
  return "hsl(var(--chart-4))";
}

// Colors for pie chart
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);

  // Map TimeRange to existing logic (or update getCommunityStats to use Enum)
  // Assuming getCommunityStats needs specific date strings for now, keeping conversion logic
  const getDates = () => {
    switch (dateRange) {
      case TimeRange.LAST_24_HOURS:
        return {
          startDate: moment().startOf("day").toISOString(),
          endDate: moment().toISOString(),
        };
      case TimeRange.LAST_7_DAYS:
        return {
          startDate: moment().subtract(7, "days").toISOString(),
          endDate: moment().toISOString(),
        };
      case TimeRange.LAST_30_DAYS:
        return {
          startDate: moment().subtract(30, "days").toISOString(),
          endDate: moment().toISOString(),
        };
      case TimeRange.LAST_90_DAYS: // Not supported in original but adding
        return {
          startDate: moment().subtract(90, "days").toISOString(),
          endDate: moment().toISOString(),
        };
      default:
        return {
          startDate: moment().subtract(7, "days").toISOString(),
          endDate: moment().toISOString(),
        };
    }
  };

  const { startDate, endDate } = getDates();

  const { data, loading, error } = getCommunityStats({
    variables: {
      input: {
        startDate,
        endDate,
      },
    },
  }) as {
    data: GetCommunityStatsResponse | undefined;
    loading: boolean;
    error: any;
  };

  const stats = data?.getCommunityStats;

  const pieData = useMemo(() => {
    if (!stats?.statusBreakdown) return membersByInterestData;
    return stats.statusBreakdown.map((item, index) => ({
      name: item.status,
      value: item.count,
    }));
  }, [stats]);

  const kpiStats: KPIStat[] = [
    {
      title: "Total Communities",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalCommunities?.toLocaleString() || "0"
      ),
      change: undefined, // Add change if available
      trend: undefined,
      icon: LayoutGrid,
      color: "text-blue-600",
      bgColor: "bg-blue-50", // Adjusted to match previous design subtly or standard
    },
    {
      title: "Total Members",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalMembers?.toLocaleString() || "0"
      ),
      change: stats?.newMembers || 0,
      trend: "up", // Assuming positive change for new members
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Posts",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalPosts?.toLocaleString() || "0"
      ),
      change: stats?.newPosts || 0,
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Views",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalViews?.toLocaleString() || "0"
      ),
      change: 0,
      trend: "up",
      icon: Eye,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Communities Analytics"
      timeRange={dateRange}
      onTimeRangeChange={setDateRange}
      kpiStats={kpiStats}
    >
      <div className="space-y-6">
        {/* Row 1: Main Area Chart & Distribution Pie */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <WeeklySignupsChart data={weeklySignupsData} />
          <CommunitiesStatusChart
            data={pieData}
            totalCount={stats?.totalCommunities || 0}
            colors={COLORS}
          />
        </div>

        {/* Row 2: Top Lists & Detailed Performance */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <TopActiveCommunitiesChart data={topCommunitiesData} />
          <CommunityPerformanceTable
            data={communityPerformanceData}
            getActivityColor={getActivityColor}
          />
        </div>
      </div>
    </ModuleAnalyticsLayout>
  );
}
