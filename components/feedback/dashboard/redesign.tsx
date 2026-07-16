"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  BarChart3,
  ArrowUpRight,
  RotateCcw,
  ShieldCheck,
  Timer,
  ArrowRight,
  Zap,
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
import { cn } from "@/lib/utils";
import { useGetFeedbackStats } from "@/graphql/actions/feedback";
import { TimeRange } from "@/graphql/actions";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ---------------------------------------------------------------------------
// Mock recent feedback entries
// ---------------------------------------------------------------------------
const RECENT_FEEDBACK = [
  {
    id: "1",
    member: "Aarav S.",
    avatar: "AS",
    sentiment: "positive" as const,
    message: "The new community events feature is fantastic! Really easy to set up and promote.",
    rating: 5,
    time: "2h ago",
    category: "Events",
  },
  {
    id: "2",
    member: "Priya K.",
    avatar: "PK",
    sentiment: "neutral" as const,
    message: "The dashboard is good but the mobile layout could use some work. Navigation feels clunky on phones.",
    rating: 3,
    time: "5h ago",
    category: "UX",
  },
  {
    id: "3",
    member: "Rohan M.",
    avatar: "RM",
    sentiment: "negative" as const,
    message: "Points are still not crediting after completing the onboarding challenge. Been waiting 3 days.",
    rating: 2,
    time: "1d ago",
    category: "Gamification",
  },
  {
    id: "4",
    member: "Sneha V.",
    avatar: "SV",
    sentiment: "positive" as const,
    message: "Love the mentorship matching — got connected with exactly the right person for my goals.",
    rating: 5,
    time: "1d ago",
    category: "Mentorship",
  },
];

const TREND_DATA = [
  { day: "Mon", positive: 8, neutral: 3, negative: 1 },
  { day: "Tue", positive: 12, neutral: 4, negative: 2 },
  { day: "Wed", positive: 7, neutral: 5, negative: 3 },
  { day: "Thu", positive: 15, neutral: 2, negative: 1 },
  { day: "Fri", positive: 10, neutral: 4, negative: 2 },
  { day: "Sat", positive: 5, neutral: 2, negative: 0 },
  { day: "Sun", positive: 6, neutral: 3, negative: 1 },
];

const SENTIMENT_CONFIG = {
  positive: { icon: Smile, color: "text-emerald-600", bg: "bg-emerald-50", label: "Positive" },
  neutral: { icon: Meh, color: "text-amber-600", bg: "bg-amber-50", label: "Neutral" },
  negative: { icon: Frown, color: "text-rose-600", bg: "bg-rose-50", label: "Negative" },
};

export default function FeedbackDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [search, setSearch] = useState("");

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

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data, loading, refetch } = useGetFeedbackStats(timeRange, formattedDateRange);
  const stats = data?.getFeedbackStats;

  const filtered = RECENT_FEEDBACK.filter(
    (f) =>
      f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.member.toLowerCase().includes(search.toLowerCase())
  );

  const kpis = [
    {
      title: "Total Feedback",
      value: loading ? "—" : (stats?.totalFeedback?.toLocaleString() ?? "0"),
      icon: MessageSquare,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Resolving",
      value: loading ? "—" : (stats?.pendingFeedback?.toLocaleString() ?? "0"),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Registry Resolved",
      value: loading ? "—" : (stats?.resolvedFeedback?.toLocaleString() ?? "0"),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Registry Score",
      value: loading ? "—" : stats ? `${stats.satisfactionScore}/5` : "0/5",
      icon: Star,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="feedback-analytics">
      <EcosystemHeader
        title="Sentiment Analysis"
        description="Monitor member feedback velocity, sentiment distribution, and resolution performance."
        badgeText="Sentiment Hub"
        icon={Smile}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Sentiment Stream
            </span>
          </div>

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
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Metric Rate" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EcosystemCard
              title="Sentiment Trajectory"
              description="Daily feedback breakdown"
              icon={TrendingUp}
            >
              <div className="h-64 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TREND_DATA} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "12px" }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "11px" }}
                      labelStyle={{ display: "none" }}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar dataKey="positive" fill="#18181b" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar dataKey="neutral" fill="#71717a" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar dataKey="negative" fill="#d4d4d8" radius={[2, 2, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 px-1">
                {[
                  { label: "Positive", color: "bg-zinc-900" },
                  { label: "Neutral", color: "bg-zinc-500" },
                  { label: "Negative", color: "bg-zinc-300" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", l.color)} />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{l.label}</span>
                  </div>
                ))}
              </div>
            </EcosystemCard>

            <EcosystemCard
              title="Recent Registry"
              description="Live interaction feed"
              icon={MessageSquare}
            >
              <div className="divide-y divide-zinc-100">
                {filtered.map((item) => {
                  const conf = SENTIMENT_CONFIG[item.sentiment];
                  const SentimentIcon = conf.icon;
                  return (
                    <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-zinc-50/50 transition-all group">
                      <Avatar className="h-9 w-9 border border-zinc-200 shadow-sm rounded-lg">
                        <AvatarFallback className="bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase">
                          {item.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-zinc-900">{item.member}</span>
                          <span className="text-[10px] font-bold text-zinc-300">·</span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{item.category}</span>
                          <span className="text-[10px] font-bold text-zinc-300">·</span>
                          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">{item.time}</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-1">{item.message}</p>
                        <div className="flex items-center gap-0.5 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={cn(
                                i < item.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className={cn("px-2 py-1 rounded border text-[9px] font-bold tracking-tighter uppercase shrink-0 flex items-center gap-1", conf.bg, conf.color, "border-transparent")}>
                        <SentimentIcon size={10} />
                        {conf.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-zinc-100 bg-zinc-50/30">
                 <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 gap-2">
                    View Full Feed <ArrowRight size={12} />
                 </Button>
              </div>
            </EcosystemCard>
          </div>

          <div className="space-y-6">
            <EcosystemCard
              title="Metric Distribution"
              description="Aggregate sentiment breakdown"
              icon={BarChart3}
            >
              <div className="space-y-5 mt-4">
                {[
                  { label: "Positive", pct: 63, color: "bg-zinc-900" },
                  { label: "Neutral", pct: 27, color: "bg-zinc-500" },
                  { label: "Negative", pct: 10, color: "bg-zinc-300" },
                ].map((s) => (
                  <div key={s.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{s.label}</span>
                      <span className="text-xs font-bold text-zinc-900 leading-none">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", s.color)}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 flex flex-col items-center py-4 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                <div className="relative h-24 w-24 mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="42" fill="transparent" stroke="#e4e4e7" strokeWidth="6" />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="transparent"
                      stroke="#6366f1"
                      strokeWidth="6"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 * (1 - ((stats?.satisfactionScore ?? 4.2) / 5))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-zinc-900">
                      {loading ? "—" : (stats?.satisfactionScore ?? 4.2)}
                    </span>
                    <span className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  Platform Satisfaction Rank
                </p>
              </div>
            </EcosystemCard>

            <div className="p-8 rounded-2xl bg-zinc-900 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
                    <Zap size={18} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Insight Alert</h4>
                </div>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                  Export behavioral reports and sentiment history across all interaction nodes.
                </p>
                <Button
                  variant="link"
                  className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest p-0 group-hover:translate-x-1 transition-transform"
                >
                  Generate Report <ArrowUpRight size={10} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
