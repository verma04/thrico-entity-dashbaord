"use client";

import React, { useState } from "react";
import { useCustomer360 } from "@/graphql/analytics/customer360";
import { useCustomer360AiSummary } from "@/graphql/analytics/customer360AiSummary";
import { MemberActivityStream } from "./member-activity-stream";
import { Customer360GaAnalyticsSection } from "./customer-360-ga-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Activity,
  HeartPulse,
  Award,
  Users,
  Calendar,
  DollarSign,
  Sparkles,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  MessageSquare,
  Bot,
  TrendingUp,
  ArrowUpRight,
  Gauge,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ── Color Palette (consistent with stats & theme tokens) ─────────────────── */

const METRIC_COLORS = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/40",
    hover: "hover:border-emerald-200 dark:hover:border-emerald-800/60",
    ring: "hover:ring-emerald-100 dark:hover:ring-emerald-900/30",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/40",
    hover: "hover:border-blue-200 dark:hover:border-blue-800/60",
    ring: "hover:ring-blue-100 dark:hover:ring-blue-900/30",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    icon: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/40",
    hover: "hover:border-violet-200 dark:hover:border-violet-800/60",
    ring: "hover:ring-violet-100 dark:hover:ring-violet-900/30",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/40",
    hover: "hover:border-amber-200 dark:hover:border-amber-800/60",
    ring: "hover:ring-amber-100 dark:hover:ring-amber-900/30",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    icon: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900/40",
    hover: "hover:border-rose-200 dark:hover:border-rose-800/60",
    ring: "hover:ring-rose-100 dark:hover:ring-rose-900/30",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    icon: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/40",
    hover: "hover:border-indigo-200 dark:hover:border-indigo-800/60",
    ring: "hover:ring-indigo-100 dark:hover:ring-indigo-900/30",
  },
} as const;

type MetricColor = keyof typeof METRIC_COLORS;

/* ── Compact Metric Tile ─────────────────────────────────────────────────── */

function CompactMetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  color: MetricColor;
}) {
  const palette = METRIC_COLORS[color];

  return (
    <div
      className={cn(
        "rounded-lg border p-2.5 sm:p-3 transition-all duration-200 flex items-center justify-between gap-2.5 bg-card/60 hover:bg-card group",
        palette.border,
        palette.hover,
        "hover:shadow-xs",
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className={cn("p-2 rounded-md shrink-0 flex items-center justify-center", palette.bg)}>
          <Icon className={cn("h-3.5 w-3.5", palette.icon)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-sm sm:text-base font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          {subtext && (
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
              {subtext}
            </p>
          )}
        </div>
      </div>
      <ArrowUpRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0 self-start mt-0.5" />
    </div>
  );
}

/* ── Compact Health Score Gauge ─────────────────────────────────────────── */

function CompactHealthGauge({ score }: { score: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#10b981", text: "text-emerald-600 dark:text-emerald-400", label: "Excellent", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
    if (s >= 60) return { stroke: "#3b82f6", text: "text-blue-600 dark:text-blue-400", label: "Good", badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" };
    if (s >= 40) return { stroke: "#f59e0b", text: "text-amber-600 dark:text-amber-400", label: "Fair", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
    return { stroke: "#ef4444", text: "text-rose-600 dark:text-rose-400", label: "At Risk", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" };
  };

  const c = getColor(score);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/40">
      <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            className="text-muted/30"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-sm font-black tabular-nums leading-none", c.text)}>{score}</span>
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Health Index
        </span>
        <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0 h-4.5 border", c.badge)}>
          <HeartPulse className="h-2.5 w-2.5 mr-1" />
          {c.label}
        </Badge>
      </div>
    </div>
  );
}

/* ── Compact Segment Badge ──────────────────────────────────────────────── */

function getSegmentBadge(segment?: string | null) {
  const map: Record<string, { className: string; label: string }> = {
    CHAMPION: { className: "bg-amber-500 text-white hover:bg-amber-600", label: "Champion" },
    LOYAL: { className: "bg-emerald-500 text-white hover:bg-emerald-600", label: "Loyal Member" },
    POTENTIAL_LOYALIST: { className: "bg-cyan-500 text-white hover:bg-cyan-600", label: "Potential Loyalist" },
    NEW: { className: "bg-blue-500 text-white hover:bg-blue-600", label: "New Member" },
    AT_RISK: { className: "bg-rose-500 text-white hover:bg-rose-600", label: "At Risk" },
    HIBERNATING: { className: "bg-slate-500 text-white hover:bg-slate-600", label: "Hibernating" },
    LOST: { className: "bg-gray-500 text-white hover:bg-gray-600", label: "Lost" },
  };
  const entry = map[segment || ""] || { className: "bg-muted text-foreground", label: segment || "Member" };
  return (
    <Badge className={cn("font-semibold text-[10px] px-2.5 py-0.5 h-5 shadow-2xs", entry.className)}>
      {entry.label}
    </Badge>
  );
}

/* ── Compact RFM Bar ─────────────────────────────────────────────────────── */

function CompactRfmBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.max(8, (value / max) * 100));
  return (
    <div className="space-y-1 min-w-[72px]">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold tabular-nums text-foreground">{value}/5</span>
      </div>
      <div className="h-1 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Compact AI Insight Tile ────────────────────────────────────────────── */

function CompactInsightTile({
  title,
  icon: Icon,
  items,
  color,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
  color: "emerald" | "rose" | "indigo";
}) {
  const styles = {
    emerald: {
      card: "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30",
      title: "text-emerald-800 dark:text-emerald-300",
      icon: "text-emerald-600 dark:text-emerald-400",
      bullet: "text-emerald-500",
      text: "text-emerald-950 dark:text-emerald-100",
    },
    rose: {
      card: "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30",
      title: "text-rose-800 dark:text-rose-300",
      icon: "text-rose-600 dark:text-rose-400",
      bullet: "text-rose-500",
      text: "text-rose-950 dark:text-rose-100",
    },
    indigo: {
      card: "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-900/30",
      title: "text-indigo-800 dark:text-indigo-300",
      icon: "text-indigo-600 dark:text-indigo-400",
      bullet: "text-indigo-500",
      text: "text-indigo-950 dark:text-indigo-100",
    },
  };
  const s = styles[color];

  return (
    <div className={cn("p-2.5 rounded-lg border space-y-1.5", s.card)}>
      <h4 className={cn("font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider", s.title)}>
        <Icon className={cn("h-3 w-3", s.icon)} /> {title}
      </h4>
      <ul className="space-y-1">
        {items?.slice(0, 3).map((item, idx) => (
          <li key={idx} className={cn("flex items-start gap-1.5 text-[11px] leading-snug", s.text)}>
            <span className={cn("font-black text-[10px] mt-px shrink-0", s.bullet)}>•</span>
            <span className="line-clamp-2">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main Customer 360 Component ─────────────────────────────────────────── */

interface MemberCustomer360CardProps {
  userId: string;
  className?: string;
}

export function MemberCustomer360Card({ userId, className }: MemberCustomer360CardProps) {
  const { data, loading, error } = useCustomer360(userId);
  const { data: aiData, loading: aiLoading } = useCustomer360AiSummary(userId);
  const aiSummary = aiData?.getCustomer360AiSummary;
  const [aiExpanded, setAiExpanded] = useState(true);

  /* ── Loading State ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-3 animate-in fade-in-50 duration-300">
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-14 w-28 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  /* ── Error State ───────────────────────────────────────────────────────── */
  if (error || !data?.getCustomer360) {
    return (
      <Card className="p-4 border-dashed border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold">Unable to load intelligence profile</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {error ? error.message : "No 360° profile found for this member."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const profile = data.getCustomer360;
  const rfm = profile?.rfm || { recencyDays: 0, frequencyScore: 1, monetaryScore: 1, segment: "NEW" };
  const healthScore = profile.healthScore ?? 50;
  const attendanceRate =
    (profile.eventsRegistered || 0) > 0
      ? Math.round(((profile.eventsAttended || 0) / (profile.eventsRegistered || 1)) * 100)
      : 0;

  return (
    <div className={cn("space-y-3 animate-in fade-in-50 duration-300", className)}>

      {/* ═══════════════════════════════════════════════════════════════════
          COMPACT HERO: Health Index + RFM + Segment + Metric Tiles
          ═══════════════════════════════════════════════════════════════════ */}
      <Card className="border border-border/60 shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-4 bg-muted/10 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Title & Segment & Recency */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                  360° Intelligence Profile
                </h3>
                {getSegmentBadge(rfm?.segment)}
                <Badge variant="outline" className="text-[10px] font-medium gap-1 h-5 text-muted-foreground">
                  <Gauge className="h-2.5 w-2.5" />
                  Recency: {rfm?.recencyDays ?? 0}d
                </Badge>
              </div>

              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Last active: {profile.lastActiveAt ? new Date(profile.lastActiveAt).toLocaleString() : "Never"}</span>
                {profile.firstSeenAt && (
                  <span className="hidden sm:inline">
                    · Joined {new Date(profile.firstSeenAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>

            {/* Right: RFM Mini-Bars + Compact Health Gauge */}
            <div className="flex items-center gap-4 flex-wrap self-start md:self-auto">
              <div className="flex items-center gap-2.5 bg-card px-2.5 py-1.5 rounded-lg border border-border/50 shadow-2xs">
                <CompactRfmBar label="Freq" value={rfm?.frequencyScore ?? 1} />
                <CompactRfmBar label="Monetary" value={rfm?.monetaryScore ?? 1} />
                <CompactRfmBar label="Recency" value={Math.max(1, 5 - Math.floor((rfm?.recencyDays ?? 0) / 30))} />
              </div>
              <CompactHealthGauge score={healthScore} />
            </div>
          </div>
        </div>

        {/* ── Compact Metric Tiles Strip ─────────────────────────────────── */}
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            <CompactMetricCard
              label="Total Spend"
              value={`₹${(profile.totalSpend || 0).toLocaleString()}`}
              subtext={`${profile.totalOrders || 0} orders`}
              icon={DollarSign}
              color="emerald"
            />
            <CompactMetricCard
              label="Events"
              value={`${profile.eventsAttended || 0}/${profile.eventsRegistered || 0}`}
              subtext={`${attendanceRate}% attendance`}
              icon={Calendar}
              color="blue"
            />
            <CompactMetricCard
              label="Communities"
              value={profile.communitiesJoined || 0}
              subtext={`${profile.postsCreated || 0} posts · ${profile.commentsCreated || 0} cmts`}
              icon={Users}
              color="violet"
            />
            <CompactMetricCard
              label="Points Earned"
              value={(profile.pointsEarned || 0).toLocaleString()}
              subtext="Gamification score"
              icon={Award}
              color="amber"
            />
            <CompactMetricCard
              label="Engagement"
              value={`${Math.min(100, Math.round(healthScore * 1.1))}%`}
              subtext="Platform activity"
              icon={TrendingUp}
              color="rose"
            />
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════
          AI EXECUTIVE SUMMARY & PERSONA (COMPACT ACCORDION CARD)
          ═══════════════════════════════════════════════════════════════════ */}
      {(aiLoading || aiSummary) && (
        <Card className="border border-border/60 shadow-xs overflow-hidden">
          <div
            onClick={() => setAiExpanded(!aiExpanded)}
            className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 select-none transition-colors border-b border-border/40"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-bold text-foreground">
                AI Executive Summary
              </h4>
              {aiSummary?.personaTitle && (
                <Badge variant="secondary" className="text-[10px] font-semibold h-4.5 px-2">
                  {aiSummary.personaTitle}
                </Badge>
              )}
              {aiSummary?.suggestedOutreachChannel && (
                <Badge variant="outline" className="text-[10px] font-medium gap-1 h-4.5 px-1.5 text-muted-foreground hidden sm:inline-flex">
                  <MessageSquare className="h-2.5 w-2.5 text-primary" />
                  Channel: {aiSummary.suggestedOutreachChannel}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                {aiExpanded ? "Collapse" : "Expand Insights"}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                {aiExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          {aiExpanded && (
            <CardContent className="p-3 sm:p-4 pt-3 space-y-3 animate-in fade-in-50 duration-200">
              {aiLoading ? (
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ) : aiSummary ? (
                <>
                  <p className="text-xs text-foreground/90 leading-relaxed bg-muted/20 p-2.5 rounded-md border border-border/30">
                    {aiSummary.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5">
                    <CompactInsightTile
                      title="Key Strengths"
                      icon={CheckCircle2}
                      items={aiSummary.keyStrengths || []}
                      color="emerald"
                    />
                    <CompactInsightTile
                      title="Risk Factors"
                      icon={AlertTriangle}
                      items={aiSummary.riskFactors || []}
                      color="rose"
                    />
                    <CompactInsightTile
                      title="Recommended Actions"
                      icon={Zap}
                      items={aiSummary.recommendedActions || []}
                      color="indigo"
                    />
                  </div>
                </>
              ) : null}
            </CardContent>
          )}
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          GOOGLE ANALYTICS (GA4) DIGITAL INTELLIGENCE (COMPACT)
          ═══════════════════════════════════════════════════════════════════ */}
      <Customer360GaAnalyticsSection gaAnalytics={profile.gaAnalytics} />

      {/* ═══════════════════════════════════════════════════════════════════
          ACTIVITY STREAM (COMPACT TABLE VIEW + COMPACT CARDS)
          ═══════════════════════════════════════════════════════════════════ */}
      <MemberActivityStream activities={profile.recentActivity || []} />
    </div>
  );
}
