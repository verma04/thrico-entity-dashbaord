"use client";

import React, { useState } from "react";

import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Users,
  Eye,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Globe,
  ArrowRight,
  Timer,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { PieChart } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemSectionHeader,
  EcosystemCard,
  EcosystemStatusIndicator,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function EventsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  let loading = false;
  const data = {
    getEventsStats: {
      totalEvents: 0,
      activeEvents: 0,
      totalAttendees: 0,
      totalViews: 0,
      totalEventsChange: 0,
      activeEventsChange: 0,
      attendeesChange: 0,
      viewsChange: 0,
    },
  };

  const stats = data?.getEventsStats;

  const kpis = [
    {
      title: "Total Events",
      value: loading ? "..." : (stats?.totalEvents?.toLocaleString() ?? "0"),
      trend: stats?.totalEventsChange ?? 0,
      icon: Calendar,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Events",
      value: loading ? "..." : (stats?.activeEvents?.toLocaleString() ?? "0"),
      trend: stats?.activeEventsChange ?? 0,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Attendees",
      value: loading ? "..." : (stats?.totalAttendees?.toLocaleString() ?? "0"),
      trend: stats?.attendeesChange ?? 0,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Event Views",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  // Placeholder data for charts
  const registrationTrend = [
    { name: "MON", registrations: 400 },
    { name: "TUE", registrations: 300 },
    { name: "WED", registrations: 200 },
    { name: "THU", registrations: 278 },
    { name: "FRI", registrations: 189 },
    { name: "SAT", registrations: 239 },
    { name: "SUN", registrations: 349 },
  ];

  const eventTypeDistribution = [
    { name: "IN_PERSON", value: 40, color: "#6366f1" },
    { name: "ONLINE", value: 30, color: "#10b981" },
    { name: "HYBRID", value: 30, color: "#f59e0b" },
  ];

  const topPerformingEvents = [
    { name: "Tech Summit 2024", attendees: 450, views: 1200 },
    { name: "Design Workshop", attendees: 320, views: 800 },
    { name: "Community Meetup", attendees: 280, views: 600 },
    { name: "Product Launch", attendees: 250, views: 500 },
  ];

  return (
    <EcosystemWrapper anonymized-1="events-analytics">
      <EcosystemHeader
        title="Events Overview"
        badgeText="Live Status"
        description="Track your community events, attendee growth, and engagement in real-time."
        icon={Calendar}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Ready to go"
            />
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified System</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as TimeRange)}
            >
              <SelectTrigger className="h-10 w-[200px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm transition-all focus:ring-indigo-500/20">
                <Timer className="h-4 w-4 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                <SelectItem
                  value={TimeRange.LAST_24_HOURS}
                  className="font-bold uppercase text-[10px]"
                >
                  Real-time Cycle
                </SelectItem>
                <SelectItem
                  value={TimeRange.LAST_7_DAYS}
                  className="font-bold uppercase text-[10px]"
                >
                  Last 7 Cycles
                </SelectItem>
                <SelectItem
                  value={TimeRange.LAST_30_DAYS}
                  className="font-bold uppercase text-[10px]"
                >
                  Last 30 Cycles
                </SelectItem>
                <SelectItem
                  value={TimeRange.LAST_90_DAYS}
                  className="font-bold uppercase text-[10px]"
                >
                  Last 90 Cycles
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white"
            >
              <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="vs last period" />
          ))}
        </div>

        {/* Charts Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <EcosystemCard
              title="Registration Trend"
              description="Daily sign-ups over time"
              icon={TrendingUp}
              decorationIcon={Zap}
            >
              <div className="h-[350px] w-full">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 transition-all">
                    <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationTrend}>
                      <defs>
                        <linearGradient
                          id="colorReg"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{
                          color: "#fff",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          fontSize: "10px",
                        }}
                        labelStyle={{ display: "none" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="registrations"
                        stroke="#6366f1"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorReg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>

            <EcosystemCard
              title="Top Performing Events"
              description="Events with the highest attendance"
              icon={BarChart3}
              decorationIcon={Sparkles}
            >
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPerformingEvents} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={150}
                      tick={{ fontSize: 9, fontWeight: 900, fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "16px",
                      }}
                      itemStyle={{
                        color: "#fff",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: "10px",
                      }}
                      labelStyle={{
                        color: "#94a3b8",
                        fontSize: "10px",
                        marginBottom: "4px",
                      }}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar
                      dataKey="attendees"
                      fill="#4f46e5"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <EcosystemCard
              title="Event Types"
              description="Distribution of event formats"
              icon={PieChart}
              decorationIcon={Globe}
            >
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsPieChart>
                    <Pie
                      data={eventTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {eventTypeDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </ReChartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {eventTypeDistribution.map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.name.replace("_", " ")}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-1000 group-hover/item:scale-x-105 origin-left"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Global engagement
                  </p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">
                    74.2%
                  </p>
                </div>
                <Link href="/events/all">
                  <Button
                    variant="outline"
                    className="h-11 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Registry
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>

            <div className="p-10 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-1000" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-400 border border-white/10 group-hover:scale-110 transition-transform">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">
                    Registry Sync
                  </h4>
                </div>
                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                  All temporal event nodes are broadcasted across the global
                  registry with 99.9% propagation velocity.
                </p>
                <Button
                  variant="link"
                  className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] p-0 group-hover:translate-x-2 transition-transform"
                >
                  View Registry Logs <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
