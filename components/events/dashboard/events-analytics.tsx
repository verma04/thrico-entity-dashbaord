"use client";

import React, { useState } from "react";
import { TimeRange } from "@/graphql/actions";
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
  Timer,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
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
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
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

export default function EventsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  let loading = false;
  const data = {
    getEventsStats: {
      totalEvents: 124,
      activeEvents: 42,
      totalAttendees: 15400,
      totalViews: 89000,
      totalEventsChange: 12,
      activeEventsChange: 5,
      attendeesChange: 24,
      viewsChange: 8,
    },
  };

  const stats = data?.getEventsStats;

  const kpis = [
    {
      title: "Total Events",
      value: loading ? "..." : (stats?.totalEvents?.toLocaleString() ?? "0"),
      trend: stats?.totalEventsChange ?? 0,
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Now",
      value: loading ? "..." : (stats?.activeEvents?.toLocaleString() ?? "0"),
      trend: stats?.activeEventsChange ?? 0,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Attendance",
      value: loading ? "..." : (stats?.totalAttendees?.toLocaleString() ?? "0"),
      trend: stats?.attendeesChange ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Engagement",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

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
    { name: "IN_PERSON", value: 40, color: "#18181b" },
    { name: "ONLINE", value: 30, color: "#71717a" },
    { name: "HYBRID", value: 30, color: "#a1a1aa" },
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
        title="Events Dashboard"
        description="Monitor community gathering metrics, registration velocity, and attendance trends."
        badgeText="Overview"
        icon={Calendar}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Event Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as TimeRange)}
            >
              <SelectTrigger className="h-9 w-[180px] rounded-lg border-zinc-200 bg-white text-xs font-semibold shadow-sm">
                <Timer className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TimeRange.LAST_24_HOURS} className="text-xs">Last 24 Hours</SelectItem>
                <SelectItem value={TimeRange.LAST_7_DAYS} className="text-xs">Last 7 Days</SelectItem>
                <SelectItem value={TimeRange.LAST_30_DAYS} className="text-xs">Last 30 Days</SelectItem>
                <SelectItem value={TimeRange.LAST_90_DAYS} className="text-xs">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="v. last period" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <EcosystemCard
              title="Registration Velocity"
              description="Daily enrollment trajectory"
              icon={TrendingUp}
            >
              <div className="h-[320px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationTrend}>
                    <defs>
                      <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: '11px' }}
                      labelStyle={{ display: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorReg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>

            <EcosystemCard
              title="Event Performance"
              description="Highest attendance per assembly"
              icon={BarChart3}
            >
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPerformingEvents} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      width={120}
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "12px" }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: '11px' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar
                      dataKey="attendees"
                      fill="#4f46e5"
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <EcosystemCard
              title="Assembly Formats"
              description="Distribution by medium"
              icon={Globe}
            >
              <div className="h-56 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsPieChart>
                    <Pie
                      data={eventTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {eventTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </ReChartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 px-2">
                {eventTypeDistribution.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {item.name.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-zinc-900">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EcosystemCard>

            <div className="p-8 rounded-2xl bg-zinc-900 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-400 border border-white/10">
                    <LayoutGrid size={18} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Engagement Peak</h4>
                </div>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                  Interactive assemblies showing 74.2% higher retention than passive streams.
                </p>
                <Button
                  variant="link"
                  className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest p-0 group-hover:translate-x-1 transition-transform"
                >
                  Analyze Retention <RotateCcw size={10} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
