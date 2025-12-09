"use client";

import { useState } from "react";
import {
  Download,
  Calendar,
  LayoutGrid,
  Users,
  MessageSquare,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
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

export default function DiscussionForum() {
  const [dateRange, setDateRange] = useState<string>("7days");

  const getDateRangeLabel = (value: string) => {
    const labels: Record<string, string> = {
      today: "Today",
      "7days": "Last 7 Days",
      "30days": "Last 30 Days",
      custom: "Custom Range",
    };
    return labels[value] || "Last 7 Days";
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Discussion Forums
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your community discussions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forums</CardTitle>
            <div className="rounded-full p-2 bg-green-50 dark:bg-green-950">
              <LayoutGrid className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              128
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3 new this week
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Threads
            </CardTitle>
            <div className="rounded-full p-2 bg-amber-50 dark:bg-amber-950">
              <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              542
            </div>
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              18% increase
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posts This Week
            </CardTitle>
            <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              3,200
            </div>
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3200 posts
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="rounded-full p-2 bg-pink-50 dark:bg-pink-950">
              <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              1,240
            </div>
            <div className="flex items-center text-xs text-pink-600 dark:text-pink-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              1240 users this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Second Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly New Threads</CardTitle>
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
                      id="colorThreads"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorThreads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membersByInterestData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {membersByInterestData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Forums Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Forums Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communityPerformanceData.map((forum) => (
              <div
                key={forum.key}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <a
                    href="#"
                    className="font-medium hover:underline text-primary"
                  >
                    {forum.name}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {forum.slug}
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {forum.members.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">members</p>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${forum.activePercentage}%`,
                            backgroundColor: getActivityColor(
                              forum.activePercentage
                            ),
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">
                        {forum.activePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right w-24">
                    <p className="text-xs text-muted-foreground">
                      {forum.lastActivity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
