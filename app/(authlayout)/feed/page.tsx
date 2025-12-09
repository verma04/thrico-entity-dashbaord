"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Download,
  AppWindow,
  Users,
  Repeat2,
  User,
  BarChart3,
  PieChart,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1"];

export default function FeedPage() {
  const [dateRange, setDateRange] = useState<string>("7days");

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Top Navigation Bar */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Feed Overview</CardTitle>
          <div className="flex gap-2">
            <Tabs value={dateRange} onValueChange={setDateRange}>
              <TabsList>
                <TabsTrigger value="today">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Today
                </TabsTrigger>
                <TabsTrigger value="7days">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Last 7 Days
                </TabsTrigger>
                <TabsTrigger value="30days">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Last 30 Days
                </TabsTrigger>
                <TabsTrigger value="custom">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Custom Range
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="ml-2">
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center gap-3">
              <AppWindow className="h-6 w-6 text-green-600" />
              <div>
                <div className="text-lg font-semibold">Total Feeds</div>
                <div className="text-2xl font-bold text-green-600">128</div>
                <div className="text-xs text-muted-foreground mt-1">
                  +5 new this week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="text-lg font-semibold">Total Comments</div>
                <div className="text-2xl font-bold text-yellow-500">3,200</div>
                <div className="text-xs text-muted-foreground mt-1">
                  12% increase
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center gap-3">
              <Repeat2 className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-lg font-semibold">Total Reactions</div>
                <div className="text-2xl font-bold text-blue-600">5,400</div>
                <div className="text-xs text-muted-foreground mt-1">
                  +5,400 reactions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-pink-600" />
              <div>
                <div className="text-lg font-semibold">Total ReShares</div>
                <div className="text-2xl font-bold text-pink-600">1,240</div>
                <div className="text-xs text-muted-foreground mt-1">
                  1,240 reshares this week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Feed Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklySignupsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#1890ff"
                    fillOpacity={1}
                    fill="url(#colorFeed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feed Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
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
                  <RechartsTooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
