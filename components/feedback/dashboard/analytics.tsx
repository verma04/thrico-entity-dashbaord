"use client";

import React, { useState } from "react";
import { useGetFeedbackStats } from "@/graphql/actions/feedback";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Check, Clock, ThumbsUp, Activity, Zap, ShieldCheck, RotateCcw, TrendingUp, BarChart3, Globe, ArrowRight, Timer, Sparkles, MessageCircle } from "lucide-react";
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
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
export default function FeedbackAnalytics() {
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

  const { data, loading, refetch } = useGetFeedbackStats(timeRange);

  const stats = data?.getFeedbackStats;

  const kpis = [
    {
      title: "Aggregate Feedback",
      value: loading ? "..." : (stats?.totalFeedback?.toLocaleString() ?? "0"),
      trend: stats?.totalFeedbackChange ?? 0,
      icon: MessageSquare,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Pending Resolution",
      value: loading ? "..." : (stats?.pendingFeedback?.toLocaleString() ?? "0"),
      trend: stats?.pendingFeedbackChange ?? 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Resolved Nodes",
      value: loading ? "..." : (stats?.resolvedFeedback?.toLocaleString() ?? "0"),
      trend: stats?.resolvedFeedbackChange ?? 0,
      icon: Check,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Satisfaction Yield",
      value: loading ? "..." : stats ? `${stats.satisfactionScore}/5` : "0/5",
      trend: stats?.satisfactionScoreChange ?? 0,
      icon: ThumbsUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  const feedbackTrendData = [
    { name: "MON", feedback: 8 },
    { name: "TUE", feedback: 12 },
    { name: "WED", feedback: 10 },
    { name: "THU", feedback: 15 },
    { name: "FRI", feedback: 9 },
    { name: "SAT", feedback: 4 },
    { name: "SUN", feedback: 6 },
  ];

  return (
    <EcosystemWrapper anonymized-1="feedback-analytics">
      <EcosystemHeader
        title="Dialogue Analytics"
        badgeText="Sentiment Registry"
        description="Monitor user feedback velocity, resolution protocols, and architectural satisfaction yield across the global registry."
        icon={MessageCircle}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
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
        }
      />

      

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
                title="Dialogue Velocity" 
                description="Temporal feedback instantiation cycles" 
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
                       <BarChart data={feedbackTrendData} barGap={8}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} dy={15} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                         <Tooltip
                           contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                           itemStyle={{ color: "#fff", fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                           labelStyle={{ display: 'none' }}
                           cursor={{ fill: '#f8fafc' }}
                         />
                         <Bar dataKey="feedback" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500}>
                            {feedbackTrendData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
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
                title="Sentiment Matrix" 
                description="Registry satisfaction distribution" 
                icon={Sparkles}
                decorationIcon={Activity}
                className="min-h-fit"
              >
                 <div className="flex flex-col items-center justify-center pt-6 group/score">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                       <svg className="h-full w-full -rotate-90">
                          <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                          <circle cx="64" cy="64" r="58" fill="transparent" stroke="#6366f1" strokeWidth="12" strokeDasharray="364.4" strokeDashoffset={364.4 * (1 - (stats?.satisfactionScore || 0) / 5)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter group-hover/score:scale-110 transition-transform">{stats?.satisfactionScore || "0"}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Yield / 5</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 mt-8">
                    {[
                      { label: "Positive Sentiment", value: 85, color: "bg-emerald-500" },
                      { label: "Neutral Nodes", value: 10, color: "bg-amber-500" },
                      { label: "Critical Priority", value: 5, color: "bg-rose-500" }
                    ].map((item, i) => (
                      <div key={i} className="group/item">
                         <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-black text-slate-900">{item.value}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                            <div className={cn("h-full rounded-full transition-all duration-1000 group-hover/item:scale-x-105 origin-left", item.color)} style={{ width: `${item.value}%` }} />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-50">
                    <Link href="/feedback/all">
                       <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
                          Resolve Protocols
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
