"use client";

import React from "react";
import { useGetMentorshipStats } from "@/graphql/mentorship/mentorship-quiries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  Clock,
  FolderTree,
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
  GraduationCap,
} from "lucide-react";
import { TimeRange } from "@/graphql/actions";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

export default function MentorshipAnalytics() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const { data, loading, refetch } = useGetMentorshipStats();

  const stats = data?.getMentorshipStats;

  const kpis = [
    {
      title: "Aggregate Mentors",
      value: loading ? "..." : (stats?.totalMentors?.toLocaleString() ?? "0"),
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Verified Guides",
      value: loading
        ? "..."
        : (stats?.approvedMentors?.toLocaleString() ?? "0"),
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pending Protocols",
      value: loading ? "..." : (stats?.pendingMentors?.toLocaleString() ?? "0"),
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Taxonomy Nodes",
      value: loading
        ? "..."
        : (stats?.totalCategories?.toLocaleString() ?? "0"),
      icon: FolderTree,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const mentorshipOverviewData = [
    { name: "APPROVED", count: stats?.approvedMentors ?? 0, color: "#6366f1" },
    { name: "PENDING", count: stats?.pendingMentors ?? 0, color: "#c084fc" },
    { name: "REJECTED", count: stats?.rejectedMentors ?? 0, color: "#94a3b8" },
  ];

  return (
    <EcosystemWrapper anonymized-1="mentorship-analytics">
      <EcosystemHeader
        title="Knowledge Intelligence"
        badgeText="Mentorship Registry"
        description="Monitor expert instantiation velocity, guidance protocols, and architectural knowledge expansion across the global registry node."
        icon={GraduationCap}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Expert Stream: Synchronized"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Mentorship Node</span>
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
            <EcosystemKPI key={i} {...kpi} trendLabel="Protocol" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Application Distribution"
              description="Registry status instantiation matrix"
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
                    <BarChart data={mentorshipOverviewData} barGap={8}>
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
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                        animationDuration={1500}
                      >
                        {mentorshipOverviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
              title="Expert Matrix"
              description="Registry knowledge allocation"
              icon={Sparkles}
              decorationIcon={Globe}
              className="min-h-fit"
            >
              {/* <div className="space-y-4">
                    {[
                      { label: "Engineering Nodes", value: 40, color: "bg-indigo-500" },
                      { label: "Design Protocols", value: 30, color: "bg-purple-500" },
                      { label: "Leadership Streams", value: 20, color: "bg-emerald-500" },
                      { label: "Commerce Yield", value: 10, color: "bg-amber-500" }
                    ].map((item, i) => (
                      <div key={i} className="group/item">
                         <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-black text-slate-900">{item.value}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 italic">
                            <div className="h-full rounded-full transition-all duration-1000 group-hover/item:scale-x-105 origin-left", item.color)} style={{ width: `${item.value}%` }} />
                         </div>
                      </div>
                    ))}
                 </div> */}

              <div className="mt-8 pt-6 border-t border-slate-50">
                <Link href="/mentorship/all">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    Verify Experts
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
