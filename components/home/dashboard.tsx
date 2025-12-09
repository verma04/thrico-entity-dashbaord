"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  CalendarIcon,
  Download,
  RefreshCcw,
  Filter,
  Trophy,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip as RTooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const kpiData = [
    {
      title: "Total Users",
      value: 12547,
      change: 12.5,
      trend: "up",
      target: 15000,
      progress: 83.6,
      color: "#22c55e",
    },
    {
      title: "Active Users (30d)",
      value: 8942,
      change: -2.3,
      trend: "down",
      target: 10000,
      progress: 89.4,
      color: "#ef4444",
    },
    {
      title: "User Engagement",
      value: 86.4,
      suffix: "%",
      change: 15.2,
      trend: "up",
      target: 90,
      progress: 96.0,
      color: "#3b82f6",
    },
    {
      title: "Avg Response Time",
      value: 245,
      suffix: "ms",
      change: -8.1,
      trend: "up",
      target: 200,
      progress: 81.6,
      color: "#22c55e",
    },
  ];

  const userGrowthData = [
    { month: "Jan", users: 8500 },
    { month: "Feb", users: 9200 },
    { month: "Mar", users: 9800 },
    { month: "Apr", users: 10500 },
    { month: "May", users: 11200 },
    { month: "Jun", users: 12547 },
  ];

  const moduleActivityData = [
    { module: "Feed", users: 3420 },
    { module: "Communities", users: 2890 },
    { module: "Forum", users: 2156 },
    { module: "Mentorship", users: 1876 },
    { module: "Events", users: 1543 },
    { module: "Jobs", users: 1234 },
  ];

  const pieColors = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
  ];

  const recentActivities = [
    {
      user: "Sarah Chen",
      action: "Created new community",
      module: "Communities",
      time: "2 min ago",
    },
    {
      user: "Mike Johnson",
      action: "Published mentorship session",
      module: "Mentorship",
      time: "5 min ago",
    },
  ];

  return (
    <div className="p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
          <Trophy size={26} /> Analytics Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon size={16} /> Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2">
            <Filter size={16} /> Filter
          </Button>

          <Button variant="outline" className="gap-2">
            <RefreshCcw size={16} /> Refresh
          </Button>

          <Button className="gap-2">
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <p className="text-gray-500">
        Real-time insights for platform performance
      </p>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="shadow">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500 uppercase">{kpi.title}</p>
              <h3 className="text-2xl font-bold mt-2">
                {kpi.value.toLocaleString()} {kpi.suffix}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-sm font-semibold ${
                    kpi.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {kpi.change > 0 ? "+" : ""}
                  {kpi.change}%
                </span>
                <span className="text-xs text-gray-400">vs last period</span>
              </div>

              <Progress className="mt-3" value={kpi.progress} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Growth */}
        <Card className="col-span-2 shadow">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Overall platform user trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
                <RTooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Module Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moduleActivityData.map((m, i) => ({
                    name: m.module,
                    value: m.users,
                  }))}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {moduleActivityData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <RTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Avatar />
                <div>
                  <p className="text-sm font-semibold">{item.user}</p>
                  <p className="text-xs text-gray-500">{item.action}</p>
                </div>
              </div>

              <Badge>{item.module}</Badge>

              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
          <Separator className="my-2" />
        </CardContent>
      </Card>
    </div>
  );
}
