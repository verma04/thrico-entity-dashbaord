"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { Link } from "lucide-react"; // Keeping Link just in case
import { Users, LayoutGrid, Calendar, MessageSquare, Eye } from "lucide-react";
import { getCommunityStats } from "@/graphql/actions/group";
import { GetCommunityStatsResponse } from "@/graphql/quries/group/approval";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import moment from "moment";
import { TimeRange } from "@/graphql/actions";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

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
      {/* Charts - Second Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklySignupsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorSignups"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorSignups)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Active Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCommunitiesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <RechartsTooltip />
                  <Bar
                    dataKey="members"
                    fill="hsl(var(--chart-2))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Third Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Communities by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Community Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Community Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Active %</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityPerformanceData.map((record) => (
                    <TableRow key={record.key}>
                      <TableCell>
                        <a href="#" className="text-blue-600 hover:underline">
                          {record.name}
                        </a>
                      </TableCell>
                      <TableCell>{record.slug}</TableCell>
                      <TableCell>{record.members.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${record.activePercentage}%`,
                                backgroundColor: getActivityColor(
                                  record.activePercentage
                                ),
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {record.activePercentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{record.lastActivity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
