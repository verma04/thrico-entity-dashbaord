"use client";

import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Layout,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Search,
  ArrowRight,
  PieChart as PieChartIcon,
  Timer,
  Globe,
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
  Legend,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { TimeRange } from "@/graphql/actions/dashboard";
import { useGetSurveyStats } from "@/graphql/surveys/survey-queries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

export default function SurveyAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, refetch } = useGetSurveyStats(timeRange);

  const stats = data?.getSurveyStats;

  const kpis = [
    {
      title: "Aggregate Surveys",
      value: loading ? "..." : (stats?.totalSurveys?.toLocaleString() ?? "0"),
      trend: stats?.totalSurveysChange ?? 0,
      icon: ClipboardList,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Protocols",
      value: loading ? "..." : (stats?.activeSurveys?.toLocaleString() ?? "0"),
      trend: stats?.activeSurveysChange ?? 0,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Response Yield",
      value: loading ? "..." : (stats?.totalResponses?.toLocaleString() ?? "0"),
      trend: stats?.totalResponsesChange ?? 0,
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Completion Velocity",
      value: loading ? "..." : `${stats?.completionRate?.toFixed(1) ?? "0"}%`,
      trend: stats?.completionRateChange ?? 0,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const responseTrendData =
    stats?.responseTrend?.map((item: { date: string; count: number }) => ({
      name: item.date,
      responses: item.count,
    })) || [];

  const surveyStatusData =
    stats?.statusDistribution?.map(
      (item: { status: string; count: number }) => ({
        name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
        value: item.count,
        color:
          item.status === "PUBLISHED"
            ? "#10b981"
            : item.status === "DRAFT"
              ? "#6366f1"
              : "#ef4444",
      }),
    ) || [];

  return (
    <EcosystemWrapper anonymized-1="surveys-analytics">
      <EcosystemHeader
        title="Insight Intelligence"
        badgeText="Sentiment Registry"
        description="Monitor community sentiment instantiation velocity, response protocols, and architectural feedback expansion across the global registry node."
        icon={BarChart3}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <EcosystemStatusIndicator status="active" label="Insight Stream: Operational" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Analytical Registry</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Link href="/surveys/all">
                 <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm">
                    Registry
                    <ArrowRight className="h-4 w-4" />
                 </Button>
              </Link>
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
             <EcosystemKPI key={i} {...kpi} trendLabel="Registry" />
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Chart Section */}
           <div className="lg:col-span-8">
              <EcosystemCard 
                title="Yield Velocity" 
                description="Temporal response instantiation cycles" 
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
                         <LineChart data={responseTrendData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={15} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                           <Tooltip
                             contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                             itemStyle={{ color: "#fff", fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                             labelStyle={{ display: 'none' }}
                           />
                           <Line 
                             type="monotone" 
                             dataKey="responses" 
                             stroke="#6366f1" 
                             strokeWidth={4} 
                             dot={{ r: 6, fill: "#fff", strokeWidth: 3, stroke: "#6366f1" }} 
                             activeDot={{ r: 8, strokeWidth: 0, fill: "#6366f1" }}
                             animationDuration={1500}
                           />
                         </LineChart>
                       </ResponsiveContainer>
                    )}
                 </div>
              </EcosystemCard>
           </div>

           {/* Distribution Section */}
           <div className="lg:col-span-4">
              <EcosystemCard 
                title="Status Matrix" 
                description="Registry tier allocation" 
                icon={Sparkles}
                decorationIcon={LayoutGrid}
                className="min-h-fit"
              >
                 <div className="h-[250px] w-full mb-8 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={surveyStatusData}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                           animationDuration={1500}
                         >
                           {surveyStatusData.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                           ))}
                         </Pie>
                         <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats?.totalSurveys || "0"}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Total</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    {surveyStatusData.map((item: any, i: number) => (
                      <div key={i} className="group/item flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                         <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                         </div>
                         <span className="text-sm font-black text-slate-900">{item.value}</span>
                      </div>
                    ))}
                 </div>
              </EcosystemCard>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
