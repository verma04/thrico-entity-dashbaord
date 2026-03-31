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
  RefreshCw,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  {
    id: "5",
    member: "Karan J.",
    avatar: "KJ",
    sentiment: "neutral" as const,
    message: "Forum search could be better. Hard to find older posts by topic.",
    rating: 3,
    time: "2d ago",
    category: "Forums",
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
  positive: { icon: Smile, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", label: "Positive" },
  neutral: { icon: Meh, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", label: "Neutral" },
  negative: { icon: Frown, color: "text-rose-600", bg: "bg-rose-50 border-rose-100", label: "Negative" },
};

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------
function KPICard({
  label,
  value,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center", color)}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 tabular-nums">{value}</p>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feedback Row
// ---------------------------------------------------------------------------
function FeedbackRow({ item }: { item: (typeof RECENT_FEEDBACK)[0] }) {
  const conf = SENTIMENT_CONFIG[item.sentiment];
  const SentimentIcon = conf.icon;

  return (
    <div className="group px-6 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer">
      <div className="h-9 w-9 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 mt-0.5">
        {item.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-slate-800">{item.member}</span>
          <span className="text-[10px] font-bold text-slate-300">·</span>
          <span className="text-[10px] font-semibold text-slate-400">{item.category}</span>
          <span className="text-[10px] font-bold text-slate-300">·</span>
          <span className="text-[10px] text-slate-400">{item.time}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.message}</p>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-2.5 w-2.5",
                i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              )}
            />
          ))}
        </div>
      </div>
      <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold shrink-0", conf.bg, conf.color)}>
        <SentimentIcon className="h-2.5 w-2.5" />
        {conf.label}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function FeedbackDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [search, setSearch] = useState("");
  const { data, loading, refetch } = useGetFeedbackStats(timeRange);
  const stats = data?.getFeedbackStats;

  const filtered = RECENT_FEEDBACK.filter(
    (f) =>
      f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.member.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Sentiment Hub
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Feedback</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Monitor member sentiment, resolve feedback, and track satisfaction trends.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="h-10 w-44 rounded-xl border-slate-200 text-xs font-bold text-slate-600 bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
              <SelectItem value={TimeRange.LAST_24_HOURS} className="text-xs font-bold">Last 24 hours</SelectItem>
              <SelectItem value={TimeRange.LAST_7_DAYS} className="text-xs font-bold">Last 7 days</SelectItem>
              <SelectItem value={TimeRange.LAST_30_DAYS} className="text-xs font-bold">Last 30 days</SelectItem>
              <SelectItem value={TimeRange.LAST_90_DAYS} className="text-xs font-bold">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={() => refetch()}
            className="h-10 w-10 border border-slate-200 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Feedback"
          value={loading ? "—" : (stats?.totalFeedback?.toLocaleString() ?? "0")}
          icon={MessageSquare}
          color="bg-indigo-50 border-indigo-100 text-indigo-600"
          trend="+8%"
        />
        <KPICard
          label="Pending"
          value={loading ? "—" : (stats?.pendingFeedback?.toLocaleString() ?? "0")}
          icon={Clock}
          color="bg-amber-50 border-amber-100 text-amber-600"
        />
        <KPICard
          label="Resolved"
          value={loading ? "—" : (stats?.resolvedFeedback?.toLocaleString() ?? "0")}
          icon={CheckCircle2}
          color="bg-emerald-50 border-emerald-100 text-emerald-600"
          trend="+12%"
        />
        <KPICard
          label="Satisfaction Score"
          value={loading ? "—" : stats ? `${stats.satisfactionScore}/5` : "0/5"}
          icon={Star}
          color="bg-amber-50 border-amber-100 text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart + Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Feedback Trend</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Sentiment breakdown over time</p>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { label: "Positive", color: "bg-emerald-500" },
                  { label: "Neutral", color: "bg-amber-400" },
                  { label: "Negative", color: "bg-rose-400" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={cn("h-1.5 w-1.5 rounded-full", l.color)} />
                    <span className="text-[10px] font-semibold text-slate-500">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TREND_DATA} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", padding: "8px 12px" }}
                    itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "11px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: 900, textTransform: "uppercase" }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="positive" fill="#10b981" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="neutral" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="negative" fill="#f87171" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Feedback</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              {filtered.map((item) => (
                <FeedbackRow key={item.id} item={item} />
              ))}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-400">No feedback found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Sentiment breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-5">
            <h4 className="text-sm font-bold text-slate-900">Sentiment Breakdown</h4>
            {[
              { label: "Positive", pct: 63, color: "bg-emerald-500" },
              { label: "Neutral", pct: 27, color: "bg-amber-400" },
              { label: "Negative", pct: 10, color: "bg-rose-400" },
            ].map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">{s.label}</span>
                  <span className="text-xs font-black text-slate-800">{s.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", s.color)}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CSAT Ring */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Satisfaction Score</h4>
            <div className="flex flex-col items-center py-2">
              <div className="relative h-28 w-28">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke="#6366f1"
                    strokeWidth="10"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 * (1 - ((stats?.satisfactionScore ?? 4.2) / 5))}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">
                    {loading ? "—" : (stats?.satisfactionScore ?? 4.2)}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">out of 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cta */}
          <div className="bg-slate-950 rounded-2xl p-5 text-white space-y-4">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-sm font-bold">Deep Dive Analytics</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Export full feedback reports and view member-level sentiment history.
              </p>
            </div>
            <button className="w-full h-9 bg-white text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              View Reports
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
