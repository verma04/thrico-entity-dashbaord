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
  MessageSquare,
  Briefcase,
  Tag,
  Users,
  CalendarDays,
  UserCircle,
  Globe,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  MousePointer,
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

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState("7d");

  // KPI Stats
  const kpiStats = [
    {
      title: "Total Users",
      value: "12,547",
      change: 12.5,
      trend: "up",
      icon: Users,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
    {
      title: "Active Today",
      value: "3,842",
      change: 8.2,
      trend: "up",
      icon: Activity,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
    {
      title: "Page Views",
      value: "48.2K",
      change: -2.4,
      trend: "down",
      icon: Eye,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
    {
      title: "Engagement Rate",
      value: "68.4%",
      change: 15.3,
      trend: "up",
      icon: MousePointer,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
  ];

  // User Growth Data
  const userGrowthData = [
    { date: "Jan 15", users: 8500, active: 6200 },
    { date: "Feb 15", users: 9200, active: 6800 },
    { date: "Mar 15", users: 9800, active: 7200 },
    { date: "Apr 15", users: 10500, active: 7800 },
    { date: "May 15", users: 11200, active: 8400 },
    { date: "Jun 15", users: 12547, active: 8942 },
  ];

  // Module Activity Data
  const moduleActivityData = [
    { name: "Forums", value: 3420, color: "#6b7280" },
    { name: "Jobs", value: 2890, color: "#9ca3af" },
    { name: "Offers", value: 2156, color: "#4b5563" },
    { name: "Mentorship", value: 1876, color: "#374151" },
    { name: "Events", value: 1543, color: "#1f2937" },
    { name: "Communities", value: 1234, color: "#111827" },
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

  const modules = [
    {
      title: "Discussion Forums",
      description: "Community discussions, Q&A, and knowledge sharing",
      icon: MessageSquare,
      href: "/discussion-forum",
      color: "bg-gray-600",
      stats: { total: 1234, active: 856, pending: 24 },
    },
    {
      title: "Job Board",
      description: "Post jobs, manage applications, and hire talent",
      icon: Briefcase,
      href: "/jobs",
      color: "bg-gray-600",
      stats: { total: 87, active: 65, pending: 12 },
    },
    {
      title: "Offers & Deals",
      description: "Manage offers, categories, and user submissions",
      icon: Tag,
      href: "/offers",
      color: "bg-gray-600",
      stats: { total: 156, active: 142, pending: 8 },
    },
    {
      title: "Mentorship",
      description: "Connect mentors and mentees, manage requests",
      icon: Users,
      href: "/mentorship",
      color: "bg-gray-600",
      stats: { total: 45, active: 38, pending: 5 },
    },
    {
      title: "Events",
      description: "Create and manage events, registrations, and attendance",
      icon: CalendarDays,
      href: "/events",
      color: "bg-gray-600",
      stats: { total: 32, active: 28, pending: 3 },
    },
    {
      title: "Communities",
      description: "Build and moderate communities around shared interests",
      icon: UserCircle,
      href: "/communities",
      color: "bg-gray-600",
      stats: { total: 78, active: 72, pending: 6 },
    },
    {
      title: "Website Builder",
      description: "Design and customize your entity's public website",
      icon: Globe,
      href: "/website",
      color: "bg-gray-600",
      stats: { pages: 12, modules: 45, published: true },
    },
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
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
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
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total and active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6b7280"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Total Users"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#374151"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Module Activity</CardTitle>
            <CardDescription>User distribution by module</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moduleActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moduleActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Bar Chart */}
      <Card>
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
              <Bar dataKey="posts" fill="#6b7280" name="Posts" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="#9ca3af" name="Comments" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" fill="#d1d5db" name="Likes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Module Overview Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-100">
            <TrendingUp className="h-5 w-5 text-gray-700" />
          </div>
          Platform Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.href}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-xl ${module.color} bg-opacity-10 shadow-sm`}>
                      <Icon className={`h-8 w-8 ${module.color.replace("bg-", "text-")}`} />
                    </div>
                    <Link href={module.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Open
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {module.stats.total !== undefined ? (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{module.stats.total}</span>
                        <span className="text-muted-foreground">Total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                        <span className="font-semibold">{module.stats.active}</span>
                        <span className="text-muted-foreground">Active</span>
                      </div>
                      {module.stats.pending > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <Badge variant="secondary">{module.stats.pending}</Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{module.stats.pages}</span>
                        <span className="text-muted-foreground">Pages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{module.stats.modules}</span>
                        <span className="text-muted-foreground">Modules</span>
                      </div>
                      {module.stats.published && (
                        <Badge variant="default" className="bg-gray-600">
                          Published
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
