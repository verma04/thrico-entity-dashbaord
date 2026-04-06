"use client";

import React, { useState } from "react";
import { useJobStats } from "@/graphql/actions/jobs";
import { TimeRange } from "@/graphql/actions";
import {
  Briefcase,
  Users,
  Eye,
  FileText,
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

export default function JobsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, refetch } = useJobStats(timeRange);

  const stats = data?.getJobStats;

  const kpis = [
    {
      title: "Total Jobs",
      value: loading ? "..." : (stats?.totalJobs?.toLocaleString() ?? "0"),
      trend: stats?.totalJobsChange ?? 0,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Jobs",
      value: loading ? "..." : (stats?.activeJobs?.toLocaleString() ?? "0"),
      trend: stats?.activeJobsChange ?? 0,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Applications",
      value: loading ? "..." : (stats?.totalApplications?.toLocaleString() ?? "0"),
      trend: stats?.applicationsChange ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Visibility",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const applicationsData = [
    { name: "MON", applications: 12 },
    { name: "TUE", applications: 19 },
    { name: "WED", applications: 15 },
    { name: "THU", registrations: 22 },
    { name: "FRI", registrations: 28 },
    { name: "SAT", registrations: 10 },
    { name: "SUN", registrations: 8 },
  ];

  return (
    <EcosystemWrapper anonymized-1="jobs-analytics">
      <EcosystemHeader
        title="Jobs Overview"
        badgeText="Job Stats"
        description="Track job postings, applications, and growth across your platform."
        icon={Briefcase}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Job Stream
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
              title="Application Velocity"
              description="Daily response cycle"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={applicationsData}>
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
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar 
                        dataKey="applications" 
                        fill="#6366f1" 
                        radius={[4, 4, 0, 0]} 
                        barSize={32} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <EcosystemCard
              title="Job Matrix"
              description="Department distribution"
              icon={BarChart3}
            >
              <div className="space-y-5 mt-4">
                {[
                  { label: "Engineering", value: 45, color: "bg-indigo-500" },
                  { label: "Design", value: 30, color: "bg-purple-500" },
                  { label: "Product", value: 15, color: "bg-emerald-500" },
                  { label: "Marketing", value: 10, color: "bg-amber-500" }
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
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Candidates</p>
                  <p className="text-xl font-bold text-zinc-900 tracking-tight">2.4k</p>
                </div>
                <Link href="/jobs/all">
                  <Button variant="outline" className="h-10 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm">
                    All Jobs
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>

            <div className="p-8 rounded-2xl bg-zinc-900 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-400/20">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Growth Signal</h4>
                </div>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                  Platform hiring velocity has increased by 18% in the current cycle.
                </p>
                <Button
                  variant="link"
                  className="text-[10px] font-bold text-orange-400 uppercase tracking-widest p-0 group-hover:translate-x-1 transition-transform"
                >
                  View Market Report <ArrowRight size={10} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
