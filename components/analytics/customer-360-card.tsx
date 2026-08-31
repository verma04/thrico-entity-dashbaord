"use client";

import React from "react";
import { useCustomer360 } from "@/graphql/analytics/customer360";
import { useCustomer360AiSummary } from "@/graphql/analytics/customer360AiSummary";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { safeFormatDistanceToNow } from "@/lib/date-utils";
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
  BarChart3,
  Target,
  ShoppingBag,
  Mail,
  LogIn,
} from "lucide-react";

/* ── Color Palette (matches stats-tab.tsx pattern) ───────────────────────── */

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

/* ── Metric Card (matches StatCard in stats-tab.tsx) ─────────────────────── */

function MetricCard({
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
    <Card
      className={cn(
        "border transition-all duration-200 group",
        palette.border,
        palette.hover,
        "hover:ring-2",
        palette.ring,
        "hover:shadow-sm",
      )}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl shrink-0", palette.bg)}>
          <Icon className={cn("h-4 w-4", palette.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold tracking-tight">{value}</p>
          {subtext && (
            <p className="text-[11px] text-muted-foreground truncate">{subtext}</p>
          )}
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      </CardContent>
    </Card>
  );
}

/* ── Health Score Ring ────────────────────────────────────────────────────── */

function HealthScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#10b981", text: "text-emerald-600 dark:text-emerald-400", label: "Excellent", bg: "bg-emerald-50 dark:bg-emerald-950/30" };
    if (s >= 60) return { stroke: "#3b82f6", text: "text-blue-600 dark:text-blue-400", label: "Good", bg: "bg-blue-50 dark:bg-blue-950/30" };
    if (s >= 40) return { stroke: "#f59e0b", text: "text-amber-600 dark:text-amber-400", label: "Fair", bg: "bg-amber-50 dark:bg-amber-950/30" };
    return { stroke: "#ef4444", text: "text-rose-600 dark:text-rose-400", label: "At Risk", bg: "bg-rose-50 dark:bg-rose-950/30" };
  };

  const c = getColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44" cy="44" r="38"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/30"
          />
          <circle
            cx="44" cy="44" r="38"
            fill="none"
            stroke={c.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-black tabular-nums", c.text)}>{score}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <HeartPulse className={cn("h-3.5 w-3.5", c.text)} />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {c.label}
        </span>
      </div>
    </div>
  );
}

/* ── Segment Badge ───────────────────────────────────────────────────────── */

function getSegmentBadge(segment?: string | null) {
  const map: Record<string, { className: string; label: string }> = {
    CHAMPION: { className: "bg-amber-500 hover:bg-amber-600 text-white", label: "Champion" },
    LOYAL: { className: "bg-emerald-500 hover:bg-emerald-600 text-white", label: "Loyal Member" },
    POTENTIAL_LOYALIST: { className: "bg-cyan-500 hover:bg-cyan-600 text-white", label: "Potential Loyalist" },
    NEW: { className: "bg-blue-500 hover:bg-blue-600 text-white", label: "New Member" },
    AT_RISK: { className: "bg-rose-500 hover:bg-rose-600 text-white", label: "At Risk" },
    HIBERNATING: { className: "bg-slate-500 hover:bg-slate-600 text-white", label: "Hibernating" },
    LOST: { className: "bg-gray-500 hover:bg-gray-600 text-white", label: "Lost" },
  };
  const entry = map[segment || ""] || { className: "", label: segment || "Member" };
  return (
    <Badge className={cn("font-semibold text-xs px-3 py-1", entry.className)}>
      {entry.label}
    </Badge>
  );
}

/* ── RFM Mini Bar ────────────────────────────────────────────────────────── */

function RfmBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
        <span className="text-xs font-bold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── AI Insight Tile ─────────────────────────────────────────────────────── */

function InsightTile({
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
      card: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40",
      title: "text-emerald-800 dark:text-emerald-300",
      icon: "text-emerald-600 dark:text-emerald-400",
      bullet: "text-emerald-500",
      text: "text-emerald-950 dark:text-emerald-200",
    },
    rose: {
      card: "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40",
      title: "text-rose-800 dark:text-rose-300",
      icon: "text-rose-600 dark:text-rose-400",
      bullet: "text-rose-500",
      text: "text-rose-950 dark:text-rose-200",
    },
    indigo: {
      card: "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-900/40",
      title: "text-indigo-800 dark:text-indigo-300",
      icon: "text-indigo-600 dark:text-indigo-400",
      bullet: "text-indigo-500",
      text: "text-indigo-950 dark:text-indigo-200",
    },
  };
  const s = styles[color];

  return (
    <div className={cn("p-4 border rounded-xl space-y-2.5", s.card)}>
      <h4 className={cn("font-semibold flex items-center gap-1.5 text-xs", s.title)}>
        <Icon className={cn("h-3.5 w-3.5", s.icon)} /> {title}
      </h4>
      <ul className="space-y-1.5">
        {items?.map((item, idx) => (
          <li key={idx} className={cn("flex items-start gap-2 text-[11px] leading-relaxed", s.text)}>
            <span className={cn("font-bold mt-px", s.bullet)}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Event Icon Categorization ───────────────────────────────────────────── */

function getEventIcon(eventType?: string, entityType?: string) {
  const t = (eventType || "").toUpperCase();
  const ent = (entityType || "").toUpperCase();

  if (
    t.includes("ORDER") ||
    t.includes("PURCHASE") ||
    t.includes("CHECKOUT") ||
    t.includes("PAYMENT") ||
    ent === "ORDER"
  ) {
    return {
      icon: ShoppingBag,
      bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    };
  }
  if (t.includes("EVENT") || ent === "EVENT") {
    return {
      icon: Calendar,
      bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    };
  }
  if (
    t.includes("COMMUNITY") ||
    t.includes("POST") ||
    t.includes("COMMENT") ||
    ent === "COMMUNITY" ||
    ent === "POST"
  ) {
    return {
      icon: MessageSquare,
      bg: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    };
  }
  if (
    t.includes("BADGE") ||
    t.includes("POINT") ||
    t.includes("REWARD") ||
    t.includes("GAMIF")
  ) {
    return {
      icon: Award,
      bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    };
  }
  if (
    t.includes("CAMPAIGN") ||
    t.includes("EMAIL") ||
    t.includes("MAIL") ||
    ent === "CAMPAIGN"
  ) {
    return {
      icon: Mail,
      bg: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    };
  }
  if (t.includes("LOGIN") || t.includes("AUTH") || t.includes("SESSION")) {
    return {
      icon: LogIn,
      bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    };
  }
  return {
    icon: Activity,
    bg: "bg-primary/10 text-primary",
  };
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

  /* ── Loading State ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-300">
        <Card className="overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[88px] w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </Card>
      </div>
    );
  }

  /* ── Error State ───────────────────────────────────────────────────────── */
  if (error || !data?.getCustomer360) {
    return (
      <Card className="p-6 border-dashed border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/10">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Unable to load intelligence profile</p>
            <p className="text-xs text-muted-foreground mt-0.5">
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
      ? Math.round(((profile.eventsAttended || 0) / profile.eventsRegistered) * 100)
      : 0;

  return (
    <div className={cn("space-y-4 animate-in fade-in-50 duration-500", className)}>

      {/* ═══════════════════════════════════════════════════════════════════
          AI EXECUTIVE SUMMARY & PERSONA (TOP)
          ═══════════════════════════════════════════════════════════════════ */}
      {(aiLoading || aiSummary) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={cn("p-2 rounded-xl", METRIC_COLORS.indigo.bg)}>
                  <Bot className={cn("h-4 w-4", METRIC_COLORS.indigo.icon)} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-sm font-bold">
                      AI Executive Summary
                    </CardTitle>
                    {aiSummary?.personaTitle && (
                      <Badge variant="secondary" className="text-[11px] font-semibold">
                        {aiSummary.personaTitle}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    AI-powered behavioral analysis
                  </CardDescription>
                </div>
              </div>

              {aiSummary?.suggestedOutreachChannel && (
                <Badge variant="outline" className="text-[11px] gap-1 font-medium self-start sm:self-auto">
                  <MessageSquare className="h-3 w-3" />
                  {aiSummary.suggestedOutreachChannel}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            {aiLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : aiSummary ? (
              <>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {aiSummary.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InsightTile
                    title="Key Strengths"
                    icon={CheckCircle2}
                    items={aiSummary.keyStrengths || []}
                    color="emerald"
                  />
                  <InsightTile
                    title="Risk Factors"
                    icon={AlertTriangle}
                    items={aiSummary.riskFactors || []}
                    color="rose"
                  />
                  <InsightTile
                    title="Recommended Actions"
                    icon={Zap}
                    items={aiSummary.recommendedActions || []}
                    color="indigo"
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          HERO: Health Score + Segment + RFM
          ═══════════════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left: Title & segment */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5">
                <div className={cn("p-2 rounded-xl", METRIC_COLORS.indigo.bg)}>
                  <Sparkles className={cn("h-4 w-4", METRIC_COLORS.indigo.icon)} />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">
                    360° Intelligence Profile
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Last active: {profile.lastActiveAt ? new Date(profile.lastActiveAt).toLocaleString() : "Never"}
                    {profile.firstSeenAt && ` · First seen: ${new Date(profile.firstSeenAt).toLocaleDateString()}`}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {getSegmentBadge(rfm?.segment)}
                <Badge variant="outline" className="text-[11px] font-medium gap-1">
                  <Gauge className="h-3 w-3" />
                  Recency: {rfm?.recencyDays ?? 0}d
                </Badge>
              </div>

              {/* RFM Scores */}
              <div className="grid grid-cols-3 gap-4 pt-1 max-w-sm">
                <RfmBar label="Frequency" value={rfm?.frequencyScore ?? 1} />
                <RfmBar label="Monetary" value={rfm?.monetaryScore ?? 1} />
                <RfmBar label="Recency" value={Math.max(1, 5 - Math.floor((rfm?.recencyDays ?? 0) / 30))} />
              </div>
            </div>

            {/* Right: Health score ring */}
            <div className="self-center md:self-start">
              <HealthScoreRing score={healthScore} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-6">
          {/* ── Metric Cards Grid ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <MetricCard
              label="Total Spend"
              value={`₹${(profile.totalSpend || 0).toLocaleString()}`}
              subtext={`${profile.totalOrders || 0} orders placed`}
              icon={DollarSign}
              color="emerald"
            />
            <MetricCard
              label="Events"
              value={`${profile.eventsAttended || 0} / ${profile.eventsRegistered || 0}`}
              subtext={`${attendanceRate}% attendance rate`}
              icon={Calendar}
              color="blue"
            />
            <MetricCard
              label="Communities"
              value={profile.communitiesJoined || 0}
              subtext={`${profile.postsCreated || 0} posts · ${profile.commentsCreated || 0} comments`}
              icon={Users}
              color="violet"
            />
            <MetricCard
              label="Points Earned"
              value={(profile.pointsEarned || 0).toLocaleString()}
              subtext="Gamification total"
              icon={Award}
              color="amber"
            />
            <MetricCard
              label="Engagement"
              value={`${Math.min(100, Math.round(healthScore * 1.1))}%`}
              subtext="Overall activity score"
              icon={TrendingUp}
              color="rose"
            />
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════
          ACTIVITY STREAM (COMPACT LIST)
          ═══════════════════════════════════════════════════════════════════ */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-5 pt-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className={cn("p-2 rounded-xl", METRIC_COLORS.blue.bg)}>
              <Activity className={cn("h-4 w-4", METRIC_COLORS.blue.icon)} />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Activity Stream</CardTitle>
              <CardDescription className="text-xs">
                Recent ClickHouse behavioral event stream
              </CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] font-medium gap-1 text-muted-foreground">
            <BarChart3 className="h-3 w-3" />
            {profile.recentActivity?.length || 0} events
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {profile.recentActivity && profile.recentActivity.length > 0 ? (
            <div className="divide-y divide-border/40 max-h-80 overflow-y-auto">
              {profile.recentActivity.map((act, i) => {
                const { icon: EventIcon, bg: iconBg } = getEventIcon(act.eventType, act.entityType);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
                        <EventIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground truncate">
                            {act.summary || act.eventType}
                          </p>
                          {act.entityType && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-normal text-muted-foreground shrink-0">
                              {act.entityType}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {act.eventType}
                          {act.entityId && ` · ID: ${act.entityId.substring(0, 8)}...`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-medium text-muted-foreground block">
                        {safeFormatDistanceToNow(act.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Activity className="h-6 w-6 mb-1.5 opacity-30" />
              <span className="text-[11px] font-medium">No recent activity stream events logged for this member yet</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
