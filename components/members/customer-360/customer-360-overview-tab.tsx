"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Analytics360DashboardStats,
  Analytics360EventTypeSummary,
} from "@/graphql/analytics/analytics360";
import {
  Users,
  Activity,
  MessageSquare,
  MessagesSquare,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  BarChart3,
  Flame,
  ArrowUpRight,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

interface Customer360OverviewTabProps {
  stats?: Analytics360DashboardStats;
  topEventTypes?: Analytics360EventTypeSummary[];
  loading?: boolean;
}

export function Customer360OverviewTab({
  stats,
  topEventTypes = [],
  loading,
}: Customer360OverviewTabProps) {
  const [chartMetric, setChartMetric] = useState<"all" | "activeUsers" | "events" | "revenue">("all");

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  const kpis = [
    {
      title: "Active Users",
      value: (stats?.activeUsers ?? 0).toLocaleString(),
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Total Events",
      value: (stats?.totalEvents ?? 0).toLocaleString(),
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Total Posts",
      value: (stats?.totalPosts ?? 0).toLocaleString(),
      icon: MessageSquare,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "Total Comments",
      value: (stats?.totalComments ?? 0).toLocaleString(),
      icon: MessagesSquare,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      title: "Total Orders",
      value: (stats?.totalOrders ?? 0).toLocaleString(),
      icon: ShoppingBag,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  const timeSeries = stats?.timeSeries || [];

  return (
    <div className="space-y-6">
      {/* 1. Headline KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={idx}
              className="p-4 border-border/80 bg-card hover:shadow-sm transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {kpi.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl font-bold tracking-tight text-foreground font-mono">
                  {kpi.value}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2. Interactive Trends Chart & Top Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <Card className="lg:col-span-2 border-border/80 bg-card">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Activity & Growth Trends
                </CardTitle>
                <CardDescription className="text-xs">
                  Aggregated telemetry data across time intervals
                </CardDescription>
              </div>

              {/* Metric filter buttons */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg self-start">
                <Button
                  variant={chartMetric === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartMetric("all")}
                  className="h-7 text-xs px-2.5"
                >
                  All
                </Button>
                <Button
                  variant={chartMetric === "activeUsers" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartMetric("activeUsers")}
                  className="h-7 text-xs px-2.5"
                >
                  Users
                </Button>
                <Button
                  variant={chartMetric === "events" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartMetric("events")}
                  className="h-7 text-xs px-2.5"
                >
                  Events
                </Button>
                <Button
                  variant={chartMetric === "revenue" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartMetric("revenue")}
                  className="h-7 text-xs px-2.5"
                >
                  Revenue
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {timeSeries.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <BarChart3 className="w-8 h-8 opacity-30 mb-2" />
                No time-series data available for the selected period.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeries}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      className="stroke-border/40"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-muted-foreground font-mono"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "currentColor" }}
                      className="text-muted-foreground font-mono"
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover/95 border border-border/80 shadow-xl backdrop-blur-md rounded-xl p-3 text-xs space-y-1.5 min-w-[140px]">
                              <p className="font-semibold text-foreground font-mono">
                                {label}
                              </p>
                              {payload.map((entry: any, i: number) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between gap-3"
                                >
                                  <span
                                    className="capitalize text-muted-foreground flex items-center gap-1.5"
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    {entry.name}
                                  </span>
                                  <span className="font-mono font-bold text-foreground">
                                    {entry.name === "revenue"
                                      ? `$${Number(entry.value).toFixed(2)}`
                                      : Number(entry.value).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {(chartMetric === "all" || chartMetric === "events") && (
                      <Area
                        type="monotone"
                        dataKey="events"
                        name="Events"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEvents)"
                      />
                    )}
                    {(chartMetric === "all" || chartMetric === "activeUsers") && (
                      <Area
                        type="monotone"
                        dataKey="activeUsers"
                        name="Active Users"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                      />
                    )}
                    {(chartMetric === "all" || chartMetric === "revenue") && (
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Event Types (1 Col) */}
        <Card className="border-border/80 bg-card flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Top Event Types
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of telemetry signals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {topEventTypes.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <Layers className="w-7 h-7 opacity-30 mb-2" />
                No event telemetry recorded yet.
              </div>
            ) : (
              topEventTypes.slice(0, 7).map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-foreground truncate max-w-[170px]">
                      {item.eventType}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground">
                        {item.count.toLocaleString()}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono px-1.5 py-0"
                      >
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
