"use client";

import React, { useState } from "react";
import { useGetCommunitiesStats } from "@/graphql/actions/communities";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  LayoutGrid,
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
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
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

export default function CommunitiesAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, refetch } = useGetCommunitiesStats(timeRange);

  const stats = data?.getCommunitiesStats;

  const kpis = [
    {
      title: "Aggregate Communities",
      value: loading
        ? "..."
        : (stats?.totalCommunities?.toLocaleString() ?? "0"),
      trend: stats?.totalCommunitiesChange ?? 0,
      icon: LayoutGrid,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Protocol Nodes",
      value: loading
        ? "..."
        : (stats?.activeCommunities?.toLocaleString() ?? "0"),
      trend: stats?.activeCommunitiesChange ?? 0,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Enrollment Yield",
      value: loading
        ? "..."
        : (stats?.totalEnrollments?.toLocaleString() ?? "0"),
      trend: stats?.enrollmentsChange ?? 0,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Propagation Count",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Globe,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const enrollmentTrendData = [
    { name: "MON", enrollments: 120 },
    { name: "TUE", enrollments: 150 },
    { name: "WED", enrollments: 100 },
    { name: "THU", enrollments: 200 },
    { name: "FRI", enrollments: 180 },
    { name: "SAT", enrollments: 90 },
    { name: "SUN", enrollments: 110 },
  ];

  return (
    <EcosystemWrapper anonymized-1="communities-analytics">
      <EcosystemHeader
        title="Network Intelligence"
        badgeText="Community Registry"
        description="Monitor community instantiation velocity, enrollment protocols, and architectural network expansion across the global registry node."
        icon={LayoutGrid}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Network Stream: Operational"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Community Node</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as TimeRange)}
            >
              <SelectTrigger className="h-10 w-[200px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm">
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
              onClick={() => refetch()}
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
            <EcosystemKPI key={i} {...kpi} trendLabel="Protocol Yield" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Enrollment Velocity"
              description="Temporal membership instantiation cycles"
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
                    <BarChart data={enrollmentTrendData} barGap={8}>
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
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar
                        dataKey="enrollments"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                        animationDuration={1500}
                      >
                        {enrollmentTrendData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? "#6366f1" : "#10b981"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Community Matrix"
              description="Registry tier allocation"
              icon={Sparkles}
              decorationIcon={LayoutGrid}
              className="min-h-fit"
            >
              <div className="space-y-6">
                {[
                  {
                    label: "Elite Foundations",
                    value: 35,
                    color: "bg-indigo-500",
                  },
                  {
                    label: "Specialized Nodes",
                    value: 40,
                    color: "bg-purple-500",
                  },
                  {
                    label: "Public Protocols",
                    value: 25,
                    color: "bg-emerald-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 group-hover/item:scale-x-105 origin-left",
                          item.color,
                        )}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Global Reach
                  </p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">
                    12.4k
                  </p>
                </div>
                <Link href="/communities/all">
                  <Button
                    variant="outline"
                    className="h-11 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Catalog
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
