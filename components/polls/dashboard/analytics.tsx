"use client";

import React, { useState } from "react";
import { useGetPollStats, TimeRange } from "@/graphql/actions/polls";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Vote,
  Activity,
  Users,
  CheckCircle,
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

export default function PollsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
  };

  const { data, loading, refetch } = useGetPollStats(
    timeRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined
  );

  const stats = data?.getPollStats;

  const kpis = [
    {
      title: "Total Polls",
      value: loading ? "..." : (stats?.totalPolls?.toLocaleString() ?? "0"),
      trend: stats?.totalPollsChange ?? 0,
      icon: Vote,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Now",
      value: loading ? "..." : (stats?.activePolls?.toLocaleString() ?? "0"),
      trend: stats?.activePollsChange ?? 0,
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Total Votes",
      value: loading ? "..." : (stats?.votes?.toLocaleString() ?? "0"),
      trend: stats?.votesChange ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Engagement",
      value: loading ? "..." : stats ? `${stats.engagementRate}%` : "0%",
      trend: stats?.engagementRateChange ?? 0,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const pollVotesData = stats?.trend || [];
  const registryStats = stats?.registry || {
    closedPolls: 0,
    activePolls: 0,
    drafts: 0,
    responseRate: 0,
  };

  return (
    <EcosystemWrapper anonymized-1="polls-analytics">
      <EcosystemHeader
        title="Polls Analytics"
        description="Monitor community sentiment, voting velocity, and engagement metrics across the platform."
        badgeText="Sentiment Hub"
        icon={Vote}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Node
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/polls/create">
              <Button className="h-9 px-4 rounded-lg bg-zinc-900 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-zinc-800 transition-all">
                <PlusCircle size={14} className="text-white" />
                Create Poll
              </Button>
            </Link>

            <div className="h-4 w-px bg-zinc-200 mx-1" />

            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />

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
            <EcosystemKPI key={i} {...kpi} trendLabel="v. last period" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Voting Activity"
              description="Real-time sentiment trajectory"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pollVotesData} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                        dy={10}
                        tickFormatter={(val) => {
                          if (!val) return "";
                          return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
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
                        dataKey="votes"
                        fill="#18181b"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        animationDuration={1500}
                      >
                        {pollVotesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === pollVotesData.length - 1 ? "#6366f1" : "#18181b"}
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
              title="Poll Registry"
              description="Status and performance matrix"
              icon={BarChart3}
            >
              <div className="space-y-5 mt-4">
                {[
                  { label: "Closed Polls", value: registryStats.closedPolls, color: "bg-zinc-900" },
                  { label: "Active Polls", value: registryStats.activePolls, color: "bg-zinc-500" },
                  { label: "Drafts", value: registryStats.drafts, color: "bg-zinc-300" },
                ].map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-1.5">
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

              <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Response Rate
                  </p>
                  <p className="text-xl font-bold text-zinc-900 tracking-tight">
                    {registryStats.responseRate}%
                  </p>
                </div>
                <Link href="/polls/all">
                  <Button
                    variant="outline"
                    className="h-10 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
                  >
                    Registry
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

import { PlusCircle } from "lucide-react";
