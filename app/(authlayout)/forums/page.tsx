"use client";

import React, { useState } from "react";
import {
  Download,
  Calendar,
  LayoutGrid,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  Timer,
  Hash,
  BarChart3,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
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

const postingActivityData = [
  { name: "MON", threads: 12, posts: 45 },
  { name: "TUE", threads: 15, posts: 52 },
  { name: "WED", threads: 18, posts: 38 },
  { name: "THU", threads: 14, posts: 65 },
  { name: "FRI", threads: 21, posts: 78 },
  { name: "SAT", threads: 25, posts: 95 },
  { name: "SUN", threads: 19, posts: 82 },
];

const topicDistributionData = [
  { name: "Technical", value: 35, color: "#18181b" },
  { name: "Governance", value: 25, color: "#3f3f46" },
  { name: "General", value: 15, color: "#71717a" },
  { name: "Events", value: 15, color: "#a1a1aa" },
  { name: "Support", value: 10, color: "#e4e4e7" },
];

const forumPerformanceData = [
  {
    id: "1",
    name: "Photography Enthusiasts",
    slug: "photography",
    members: 12500,
    active: 78,
    lastActivity: "2h ago",
    icon: "📸",
  },
  {
    id: "2",
    name: "Tech Innovators",
    slug: "tech",
    members: 9800,
    active: 82,
    lastActivity: "1h ago",
    icon: "💻",
  },
  {
    id: "3",
    name: "Fitness & Health",
    slug: "fitness",
    members: 8700,
    active: 65,
    lastActivity: "3h ago",
    icon: "💪",
  },
];

export default function DiscussionForum() {
  const [timeRange, setTimeRange] = useState("7d");
  const loading = false;

  const kpis = [
    {
      title: "Total Forums",
      value: "128",
      trend: 3,
      icon: LayoutGrid,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Threads",
      value: "542",
      trend: 18,
      icon: Hash,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Daily Posts",
      value: "3,200",
      trend: 24,
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Global Members",
      value: "1,240",
      trend: 5,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="discussion-forums">
      <EcosystemHeader
        title="Forum Intelligence"
        description="Monitor community participation, thread velocity, and topic distribution."
        badgeText="Overview"
        icon={MessageSquare}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Interaction Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 w-[180px] rounded-lg border-zinc-200 bg-white text-xs font-semibold shadow-sm">
                <Timer className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h" className="text-xs">
                  Last 24 Hours
                </SelectItem>
                <SelectItem value="7d" className="text-xs">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="30d" className="text-xs">
                  Last 30 Days
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-xs font-bold border-zinc-200"
            >
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              Export
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
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Interaction Pulse"
              description="New threads and replies trajectory"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={postingActivityData}>
                    <defs>
                      <linearGradient
                        id="colorPosts"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.08}
                        />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "none",
                        borderRadius: "12px",
                      }}
                      itemStyle={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "11px",
                      }}
                      labelStyle={{ display: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="posts"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPosts)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Topic Mix"
              description="Engagement distribution"
              icon={BarChart3}
            >
              <div className="h-64 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {topicDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 px-2 mt-4">
                {topicDistributionData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </EcosystemCard>
          </div>
        </div>

        <EcosystemCard
          title="Top Performing Forums"
          description="High-velocity community nodes"
          icon={Activity}
        >
          <div className="space-y-1 mt-6">
            {forumPerformanceData.map((forum) => (
              <div
                key={forum.id}
                className="flex items-center justify-between p-5 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all group"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm border border-zinc-100 group-hover:scale-105 transition-transform">
                    {forum.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 truncate">
                      {forum.name}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                      {forum.members.toLocaleString()} members • id: {forum.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                        Active
                      </span>
                      <span className="text-[10px] font-bold text-zinc-900 leading-none">
                        {forum.active}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${forum.active}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right w-24">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {forum.lastActivity}
                    </p>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">
                      last activity
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
             <Button variant="ghost" className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] hover:text-indigo-600">
                View Extensive Audit <ArrowRight size={12} className="ml-2" />
             </Button>
          </div>
        </EcosystemCard>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
