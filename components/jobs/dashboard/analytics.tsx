"use client";

import React, { useState } from "react";
import { useJobStats } from "@/graphql/actions/jobs";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Users, Eye, FileText, Activity, Zap, ShieldCheck, RotateCcw, TrendingUp, BarChart3, Globe, ArrowRight, Timer, Sparkles, LayoutGrid } from "lucide-react";
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
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function JobsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, refetch } = useJobStats(timeRange);

  const stats = data?.getJobStats;

  const kpis = [
    {
      title: "Aggregate Roles",
      value: loading ? "..." : (stats?.totalJobs?.toLocaleString() ?? "0"),
      trend: stats?.totalJobsChange ?? 0,
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Mandates",
      value: loading ? "..." : (stats?.activeJobs?.toLocaleString() ?? "0"),
      trend: stats?.activeJobsChange ?? 0,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Applicant Yield",
      value: loading ? "..." : (stats?.totalApplications?.toLocaleString() ?? "0"),
      trend: stats?.applicationsChange ?? 0,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Propagation Count",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const applicationsData = [
    { name: "MON", applications: 12 },
    { name: "TUE", applications: 19 },
    { name: "WED", applications: 15 },
    { name: "THU", applications: 22 },
    { name: "FRI", applications: 28 },
    { name: "SAT", applications: 10 },
    { name: "SUN", applications: 8 },
  ];

  return (
    <EcosystemWrapper anonymized-1="jobs-analytics">
      <EcosystemHeader
        title="Talent Intelligence"
        badgeText="Workforce Telemetry"
        description="Monitor role instantiation velocity, applicant engagement protocols, and architectural workforce expansion across the registry."
        icon={Briefcase}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <EcosystemStatusIndicator status="active" label="Talent Stream: Synchronized" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Listings Only</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={(val) => setTimeRange(val as TimeRange)}>
                <SelectTrigger className="h-10 w-[200px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm">
                  <Timer className="h-4 w-4 mr-2 text-indigo-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  <SelectItem value={TimeRange.LAST_24_HOURS} className="font-bold uppercase text-[10px]">Real-time Cycle</SelectItem>
                  <SelectItem value={TimeRange.LAST_7_DAYS} className="font-bold uppercase text-[10px]">Last 7 Cycles</SelectItem>
                  <SelectItem value={TimeRange.LAST_30_DAYS} className="font-bold uppercase text-[10px]">Last 30 Cycles</SelectItem>
                  <SelectItem value={TimeRange.LAST_90_DAYS} className="font-bold uppercase text-[10px]">Last 90 Cycles</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <Button variant="outline" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white" onClick={() => refetch()}>
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
                title="Application Yield" 
                description="Temporal talent acquisition cycles" 
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
                       <BarChart data={applicationsData} barGap={8}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={15} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                         <Tooltip
                           contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                           itemStyle={{ color: "#fff", fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                           labelStyle={{ display: 'none' }}
                           cursor={{ fill: '#f8fafc' }}
                         />
                         <Bar dataKey="applications" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500}>
                            {applicationsData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                            ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   )}
                 </div>
              </EcosystemCard>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <EcosystemCard 
                title="Role Distribution" 
                description="Registry tier allocation" 
                icon={Sparkles}
                decorationIcon={LayoutGrid}
                className="min-h-fit"
              >
                 <div className="space-y-6">
                    {[
                      { label: "Engineering Protocols", value: 45, color: "bg-indigo-500" },
                      { label: "Design Systems", value: 30, color: "bg-purple-500" },
                      { label: "Product Strategy", value: 15, color: "bg-emerald-500" },
                      { label: "Marketing Streams", value: 10, color: "bg-amber-500" }
                    ].map((item, i) => (
                      <div key={i} className="group/item">
                         <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-black text-slate-900">{item.value}%</span>
                         </div>
                         <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                            <div className={cn("h-full rounded-full transition-all duration-1000 group-hover/item:scale-x-105 origin-left", item.color)} style={{ width: `${item.value}%` }} />
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Seekers</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter">2.4k</p>
                    </div>
                    <Link href="/jobs/all">
                       <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm">
                          Post Role
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
