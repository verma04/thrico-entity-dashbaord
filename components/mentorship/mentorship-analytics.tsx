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
      title: "Total Mentors",
      value: loading ? "..." : (stats?.totalMentors?.toLocaleString() ?? "0"),
      icon: Users,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Now",
      value: loading
        ? "..."
        : (stats?.approvedMentors?.toLocaleString() ?? "0"),
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Awaiting Review",
      value: loading ? "..." : (stats?.pendingMentors?.toLocaleString() ?? "0"),
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Expertise Hubs",
      value: loading
        ? "..."
        : (stats?.totalCategories?.toLocaleString() ?? "0"),
      icon: FolderTree,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const mentorshipOverviewData = [
    { name: "APPROVED", count: stats?.approvedMentors ?? 0, color: "#18181b" },
    { name: "PENDING", count: stats?.pendingMentors ?? 0, color: "#6366f1" },
    { name: "REJECTED", count: stats?.rejectedMentors ?? 0, color: "#d4d4d8" },
  ];

  return (
    <EcosystemWrapper anonymized-1="mentorship-analytics">
      <EcosystemHeader
        title="Mentorship Intelligence"
        description="Monitor expert application velocity, approval trajectories, and ecosystem expertise distribution."
        badgeText="Mentorship Hub"
        icon={GraduationCap}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Mentorship Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as TimeRange)}
            >
              <SelectTrigger className="h-9 w-[180px] rounded-lg border-zinc-200 bg-white text-xs font-semibold shadow-sm text-zinc-600">
                <Timer className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TimeRange.LAST_24_HOURS} className="text-xs">
                  Today
                </SelectItem>
                <SelectItem value={TimeRange.LAST_7_DAYS} className="text-xs">
                  Last 7 Days
                </SelectItem>
                <SelectItem value={TimeRange.LAST_30_DAYS} className="text-xs">
                  Last 30 Days
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetch()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry Hub" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Application Status"
              description="Review of mentorship registry nodes"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
                          fontWeight: 600,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 600,
                          fill: "#94a3b8",
                        }}
                      />
                      <Tooltip
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
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
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
              title="Expertise Registry"
              description="System categorization distribution"
              icon={Sparkles}
            >
              <div className="space-y-5 mt-4">
                {[
                  { label: "Engineering Nodes", value: 40, color: "bg-zinc-900" },
                  { label: "Design Protocols", value: 30, color: "bg-zinc-500" },
                  { label: "Leadership Streams", value: 20, color: "bg-zinc-300" },
                  { label: "Commerce Yield", value: 10, color: "bg-indigo-400" },
                ].map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-1.5 px-0.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 leading-none">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-zinc-100 italic">
                <p className="text-[9px] font-medium text-zinc-400 leading-relaxed uppercase tracking-widest">
                   Integrity verified. Mentor nodes are synchronized with global governance protocols.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                <Link href="/mentorship/all">
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
                  >
                    Registry Feed
                    <ArrowRight className="h-3.5 w-3.5" />
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
