"use client";

import React, { useState } from "react";
import { useCustomer360 } from "@/graphql/analytics/customer360";
import { useCustomer360AiSummary } from "@/graphql/analytics/customer360AiSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { safeFormatDistanceToNow } from "@/lib/date-utils";
import {
  Activity,
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
  BarChart3,
  Target,
  ShoppingBag,
  Mail,
  LogIn,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

/* ── Color Palette & Module Accents (matches home/dashboard layout) ───────── */

const ACCENT_STYLES = {
  emerald: {
    borderL: "border-l-emerald-500",
    bgIcon: "bg-emerald-50 dark:bg-emerald-950/40",
    textIcon: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
    bar: "from-emerald-500 to-teal-500",
  },
  blue: {
    borderL: "border-l-blue-500",
    bgIcon: "bg-blue-50 dark:bg-blue-950/40",
    textIcon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
    bar: "from-blue-500 to-cyan-500",
  },
  violet: {
    borderL: "border-l-violet-500",
    bgIcon: "bg-violet-50 dark:bg-violet-950/40",
    textIcon: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
    dot: "bg-violet-500",
    bar: "from-violet-500 to-purple-500",
  },
  amber: {
    borderL: "border-l-amber-500",
    bgIcon: "bg-amber-50 dark:bg-amber-950/40",
    textIcon: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
    bar: "from-amber-500 to-orange-500",
  },
  rose: {
    borderL: "border-l-rose-500",
    bgIcon: "bg-rose-50 dark:bg-rose-950/40",
    textIcon: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
    bar: "from-rose-500 to-red-500",
  },
  indigo: {
    borderL: "border-l-indigo-500",
    bgIcon: "bg-indigo-50 dark:bg-indigo-950/40",
    textIcon: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    dot: "bg-indigo-500",
    bar: "from-indigo-500 to-violet-500",
  },
  cyan: {
    borderL: "border-l-cyan-500",
    bgIcon: "bg-cyan-50 dark:bg-cyan-950/40",
    textIcon: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
    dot: "bg-cyan-500",
    bar: "from-cyan-500 to-teal-500",
  },
} as const;

type AccentKey = keyof typeof ACCENT_STYLES;

/* ── RFM Segment Mapping ─────────────────────────────────────────────────── */

function getSegmentConfig(segment?: string | null) {
  const map: Record<
    string,
    { label: string; icon: string; className: string; accent: AccentKey }
  > = {
    CHAMPION: {
      label: "Champion",
      icon: "🏆",
      className: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
      accent: "amber",
    },
    LOYAL: {
      label: "Loyal Member",
      icon: "⭐",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
      accent: "emerald",
    },
    POTENTIAL_LOYALIST: {
      label: "Potential Loyalist",
      icon: "🚀",
      className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300",
      accent: "cyan",
    },
    NEW: {
      label: "New Member",
      icon: "🌱",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
      accent: "blue",
    },
    AT_RISK: {
      label: "At Risk",
      icon: "⚠️",
      className: "bg-rose-500/10 text-rose-600 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300",
      accent: "rose",
    },
    HIBERNATING: {
      label: "Hibernating",
      icon: "💤",
      className: "bg-slate-500/10 text-slate-600 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300",
      accent: "indigo",
    },
    LOST: {
      label: "Lost",
      icon: "🛑",
      className: "bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-300",
      accent: "rose",
    },
  };
  return (
    map[segment || ""] || {
      label: segment || "Active Member",
      icon: "✨",
      className: "bg-primary/10 text-primary border-primary/20",
      accent: "indigo",
    }
  );
}

/* ── Health Score Gauge Component (Compact SVG) ──────────────────────────── */

function CompactHealthGauge({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getStatus = (s: number) => {
    if (s >= 80)
      return {
        label: "Optimal",
        color: "#10b981",
        textColor: "text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
      };
    if (s >= 60)
      return {
        label: "Stable",
        color: "#3b82f6",
        textColor: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
      };
    if (s >= 40)
      return {
        label: "Moderate",
        color: "#f59e0b",
        textColor: "text-amber-600 dark:text-amber-400",
        badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
      };
    return {
      label: "At Risk",
      color: "#ef4444",
      textColor: "text-rose-600 dark:text-rose-400",
      badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
    };
  };

  const status = getStatus(clampedScore);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 54 54">
          <circle
            cx="27"
            cy="27"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/30"
          />
          <circle
            cx="27"
            cy="27"
            r={radius}
            fill="none"
            stroke={status.color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-sm font-black tabular-nums tracking-tight", status.textColor)}>
            {clampedScore}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
            HEALTH SCORE
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-4 font-semibold border", status.badge)}
          >
            {status.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
    </div>
  );
}

/* ── Compact RFM Mini-Score Bars ─────────────────────────────────────────── */

function CompactRfmBar({
  label,
  score,
  max = 5,
  accent = "indigo",
}: {
  label: string;
  score: number;
  max?: number;
  accent?: AccentKey;
}) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const style = ACCENT_STYLES[accent];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold tabular-nums text-foreground">
          {score}
          <span className="text-muted-foreground/60 text-[9px] font-normal">/{max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", style.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Compact Metric KPI Card (Matches ModulePerformanceCard in Home) ─────── */

interface CompactMetricCardProps {
  title: string;
  mainValue: string | number;
  subValue?: string;
  icon: React.ElementType;
  accent: AccentKey;
}

function CompactMetricCard({
  title,
  mainValue,
  subValue,
  icon: Icon,
  accent,
}: CompactMetricCardProps) {
  const style = ACCENT_STYLES[accent];

  return (
    <div
      className={cn(
        "rounded-xl border border-l-[3px] border-border/50 bg-card p-3 shadow-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 flex items-center gap-3",
        style.borderL,
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
          style.bgIcon,
        )}
      >
        <Icon className={cn("h-4 w-4", style.textIcon)} />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-[0.14em] leading-none mb-1 truncate">
          {title}
        </h4>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[13px] sm:text-[14px] font-bold text-foreground tracking-tight tabular-nums leading-tight">
            {mainValue}
          </span>
          {subValue && (
            <>
              <span className="text-muted-foreground/30 text-[10px] select-none font-light">|</span>
              <span className="text-[10px] font-normal text-muted-foreground truncate leading-tight">
                {subValue}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Event Icon Categorization Helper ────────────────────────────────────── */

function getEventMeta(eventType?: string, entityType?: string) {
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
      category: "Commerce",
      icon: ShoppingBag,
      bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50",
    };
  }
  if (t.includes("EVENT") || ent === "EVENT") {
    return {
      category: "Events",
      icon: Calendar,
      bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50",
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
      category: "Community",
      icon: MessageSquare,
      bg: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200/50",
    };
  }
  if (
    t.includes("BADGE") ||
    t.includes("POINT") ||
    t.includes("REWARD") ||
    t.includes("GAMIF")
  ) {
    return {
      category: "Rewards",
      icon: Award,
      bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50",
    };
  }
  if (
    t.includes("CAMPAIGN") ||
    t.includes("EMAIL") ||
    t.includes("MAIL") ||
    ent === "CAMPAIGN"
  ) {
    return {
      category: "Outreach",
      icon: Mail,
      bg: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200/50",
    };
  }
  if (t.includes("LOGIN") || t.includes("AUTH") || t.includes("SESSION")) {
    return {
      category: "Auth",
      icon: LogIn,
      bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50",
    };
  }
  return {
    category: "System",
    icon: Activity,
    bg: "bg-muted text-muted-foreground border-border/40",
  };
}

/* ── Section Heading Component (Dashboard Style) ─────────────────────────── */

function DashboardSectionHeading({
  title,
  icon: Icon,
  rightElement,
}: {
  title: string;
  icon?: React.ElementType;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </h3>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

/* ── Main Customer 360 Component ─────────────────────────────────────────── */

export interface MemberCustomer360CardProps {
  userId: string;
  className?: string;
  variant?: "full" | "compact";
  showAiSummary?: boolean;
  showActivityStream?: boolean;
}

export function MemberCustomer360Card({
  userId,
  className,
  variant = "full",
  showAiSummary = true,
  showActivityStream = true,
}: MemberCustomer360CardProps) {
  const { data, loading, error, refetch } = useCustomer360(userId);
  const { data: aiData, loading: aiLoading, refetch: refetchAi } = useCustomer360AiSummary(userId);
  const aiSummary = aiData?.getCustomer360AiSummary;

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [insightTab, setInsightTab] = useState<"strengths" | "risks" | "actions">("actions");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isCompact = variant === "compact";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refetchAi()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopySummary = () => {
    if (!aiSummary?.summary) return;
    navigator.clipboard.writeText(
      `360° Intelligence Profile (${aiSummary.personaTitle || "Member"}):\n${aiSummary.summary}\n\nRecommended Actions:\n${aiSummary.recommendedActions?.map((a) => `• ${a}`).join("\n")}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Loading Skeleton ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className={cn("space-y-3.5 animate-in fade-in-50 duration-300", className)}>
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-1">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>

        {/* Top bento grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 rounded-xl border border-border/50 bg-card p-4 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-8 rounded-xl border border-border/50 bg-card p-4 space-y-3">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* KPI Row skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>

        {!isCompact && <Skeleton className="h-48 w-full rounded-xl" />}
      </div>
    );
  }

  /* ── Error State ─────────────────────────────────────────────────────────── */
  if (error || !data?.getCustomer360) {
    return (
      <div
        className={cn(
          "rounded-xl border border-l-[3px] border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/10 p-4 border-dashed border-rose-200 dark:border-rose-900",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Intelligence Profile Unavailable</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {error ? error.message : "No ClickHouse behavioral telemetry logged for this member yet."}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-7 text-xs font-semibold gap-1.5"
          >
            <RotateCcw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const profile = data.getCustomer360;
  const rfm = profile?.rfm || {
    recencyDays: 0,
    frequencyScore: 1,
    monetaryScore: 1,
    segment: "NEW",
  };
  const segmentMeta = getSegmentConfig(rfm?.segment);
  const healthScore = profile.healthScore ?? 50;

  const attendanceRate =
    (profile.eventsRegistered || 0) > 0
      ? Math.round(((profile.eventsAttended || 0) / profile.eventsRegistered) * 100)
      : 0;

  const campaignOpenRate =
    (profile.campaignsReceived || 0) > 0
      ? Math.round(((profile.campaignsOpened || 0) / profile.campaignsReceived) * 100)
      : 0;

  // Filtered recent activity
  const allEvents = profile.recentActivity || [];
  const filteredEvents =
    activeCategory === "ALL"
      ? allEvents
      : allEvents.filter((act) => {
          const meta = getEventMeta(act.eventType, act.entityType);
          return meta.category.toUpperCase() === activeCategory.toUpperCase();
        });

  // Calculate activity category counts
  const categoryCounts = allEvents.reduce<Record<string, number>>((acc, act) => {
    const meta = getEventMeta(act.eventType, act.entityType);
    acc[meta.category] = (acc[meta.category] || 0) + 1;
    return acc;
  }, {});

  const totalCalculatedEvents = allEvents.length || 1;

  return (
    <div className={cn("space-y-3.5 animate-in fade-in-50 duration-500", className)}>
      {/* ═══════════════════════════════════════════════════════════════════
          1. COMPACT EXECUTIVE HEADER BAR
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
            360° Intelligence Profile
          </h2>

          {/* AI Persona Pill */}
          {aiSummary?.personaTitle && (
            <Badge
              variant="outline"
              className="text-[10px] font-semibold h-5 px-2 gap-1 bg-indigo-50/50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
            >
              <Bot className="h-3 w-3 text-indigo-500" />
              {aiSummary.personaTitle}
            </Badge>
          )}

          {/* Suggested Outreach Channel Pill */}
          {aiSummary?.suggestedOutreachChannel && (
            <Badge
              variant="outline"
              className="text-[10px] font-medium h-5 px-2 gap-1 text-muted-foreground border-border/60 bg-muted/30"
            >
              <MessageSquare className="h-2.5 w-2.5 text-muted-foreground" />
              {aiSummary.suggestedOutreachChannel} Preferred
            </Badge>
          )}
        </div>

        {/* Meta & Quick Actions */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0 self-start sm:self-auto">
          {profile.lastActiveAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground/60" />
              Active {safeFormatDistanceToNow(profile.lastActiveAt, { addSuffix: true })}
            </span>
          )}
          <span className="text-muted-foreground/30 font-light">·</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground font-medium rounded gap-1"
            title="Refresh 360 Telemetry"
          >
            <RotateCcw className={cn("h-2.5 w-2.5", isRefreshing && "animate-spin")} />
            Sync
          </Button>

          {aiSummary?.summary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopySummary}
              className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground font-medium rounded gap-1"
              title="Copy Summary"
            >
              {copied ? (
                <>
                  <Check className="h-2.5 w-2.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-2.5 w-2.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          2. TOP BENTO GRID: Health Score & RFM Matrix + AI Synthesis
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* ── Left Widget: Health Score & RFM Matrix (4 Cols) ───────────── */}
        <div className="lg:col-span-4 rounded-xl border border-l-[3px] border-l-indigo-500 border-border/60 bg-card p-3.5 shadow-sm space-y-3">
          {/* Header Row: Health & Segment */}
          <div className="flex items-center justify-between gap-2">
            <CompactHealthGauge score={healthScore} />

            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge
                variant="outline"
                className={cn("text-[10px] font-bold px-2 py-0.5 border gap-1 shadow-none", segmentMeta.className)}
              >
                <span>{segmentMeta.icon}</span>
                <span>{segmentMeta.label}</span>
              </Badge>
              <span className="text-[10px] text-muted-foreground font-medium">
                {rfm?.recencyDays ?? 0}d recency
              </span>
            </div>
          </div>

          <div className="h-px bg-border/40 w-full" />

          {/* RFM Score Meters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
              <span>RFM BEHAVIOR SCORES</span>
              <span className="text-muted-foreground/60 font-mono text-[9px]">CLUSTERING</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <CompactRfmBar
                label="Recency"
                score={Math.max(1, 5 - Math.floor((rfm?.recencyDays ?? 0) / 30))}
                accent="cyan"
              />
              <CompactRfmBar
                label="Frequency"
                score={rfm?.frequencyScore ?? 1}
                accent="indigo"
              />
              <CompactRfmBar
                label="Monetary"
                score={rfm?.monetaryScore ?? 1}
                accent="emerald"
              />
            </div>
          </div>
        </div>

        {/* ── Right Widget: AI Behavioral Synthesis (8 Cols) ────────────── */}
        {showAiSummary && (
          <div className="lg:col-span-8 rounded-xl border border-l-[3px] border-l-violet-500 border-border/60 bg-card p-3.5 shadow-sm flex flex-col justify-between space-y-2.5">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
                    AI Behavioral Synthesis
                  </h4>
                </div>
              </div>

              {/* Mini Segmented Insight Tabs */}
              <div className="flex items-center p-0.5 bg-muted/60 rounded-lg self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setInsightTab("actions")}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1",
                    insightTab === "actions"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Zap className="h-2.5 w-2.5 text-amber-500" />
                  Recommended ({aiSummary?.recommendedActions?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setInsightTab("strengths")}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1",
                    insightTab === "strengths"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                  Strengths ({aiSummary?.keyStrengths?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setInsightTab("risks")}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1",
                    insightTab === "risks"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <AlertTriangle className="h-2.5 w-2.5 text-rose-500" />
                  Risk Signals ({aiSummary?.riskFactors?.length || 0})
                </button>
              </div>
            </div>

            {/* AI Summary Text */}
            {aiLoading ? (
              <div className="space-y-1.5 py-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>
            ) : aiSummary ? (
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {aiSummary.summary}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground italic">
                AI synthesis generating behavioral insights from ClickHouse events...
              </p>
            )}

            {/* Tabbed Content Pill Cards */}
            <div className="pt-0.5">
              {insightTab === "actions" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(aiSummary?.recommendedActions || ["Keep monitoring engagement trends and reward participation."]).map(
                    (action, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 p-2 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/30 text-[11px] text-indigo-950 dark:text-indigo-200"
                      >
                        <Zap className="h-3 w-3 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                        <span className="leading-snug">{action}</span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {insightTab === "strengths" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(aiSummary?.keyStrengths || ["Consistent platform activity and community interaction."]).map(
                    (strength, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 p-2 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/70 dark:border-emerald-900/30 text-[11px] text-emerald-950 dark:text-emerald-200"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span className="leading-snug">{strength}</span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {insightTab === "risks" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(aiSummary?.riskFactors || ["No immediate churn or inactivity risks detected."]).map(
                    (risk, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 p-2 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/70 dark:border-rose-900/30 text-[11px] text-rose-950 dark:text-rose-200"
                      >
                        <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                        <span className="leading-snug">{risk}</span>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          3. CORE PERFORMANCE KPIS (5 COMPACT CARDS - EXACT DASHBOARD STYLE)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-2">
        <DashboardSectionHeading title="ACTIVITY & ECOSYSTEM KPIS" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Spend & Orders */}
          <CompactMetricCard
            title="Total Spend"
            mainValue={`₹${(profile.totalSpend || 0).toLocaleString()}`}
            subValue={`${profile.totalOrders || 0} orders`}
            icon={DollarSign}
            accent="emerald"
          />

          {/* Events Participation */}
          <CompactMetricCard
            title="Events Attended"
            mainValue={`${profile.eventsAttended || 0}/${profile.eventsRegistered || 0}`}
            subValue={`${attendanceRate}% rate`}
            icon={Calendar}
            accent="blue"
          />

          {/* Community & Content */}
          <CompactMetricCard
            title="Communities"
            mainValue={`${profile.communitiesJoined || 0}`}
            subValue={`${profile.postsCreated || 0} posts · ${profile.commentsCreated || 0} comments`}
            icon={Users}
            accent="violet"
          />

          {/* Points & Gamification */}
          <CompactMetricCard
            title="Points Earned"
            mainValue={(profile.pointsEarned || 0).toLocaleString()}
            subValue="Gamification"
            icon={Award}
            accent="amber"
          />

          {/* Campaign Engagement */}
          <CompactMetricCard
            title="Campaigns"
            mainValue={`${profile.campaignsOpened || 0}/${profile.campaignsReceived || 0}`}
            subValue={`${campaignOpenRate}% opened`}
            icon={Mail}
            accent="rose"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          4. LOWER SECTION: SPLIT STREAM FEED + BEHAVIORAL BREAKDOWN
          ═══════════════════════════════════════════════════════════════════ */}
      {!isCompact && showActivityStream && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
          {/* ── Left Column: Behavioral Event Stream (8 Cols) ───────────── */}
          <div className="lg:col-span-8 rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm flex flex-col">
            {/* Header & Filter Tabs */}
            <div className="p-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground">
                    ClickHouse Activity Feed
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {allEvents.length} raw telemetry events captured
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { key: "ALL", label: "All", count: allEvents.length },
                  { key: "COMMERCE", label: "Orders", count: categoryCounts["Commerce"] || 0 },
                  { key: "EVENTS", label: "Events", count: categoryCounts["Events"] || 0 },
                  { key: "COMMUNITY", label: "Social", count: categoryCounts["Community"] || 0 },
                  { key: "REWARDS", label: "Points", count: categoryCounts["Rewards"] || 0 },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-semibold transition-colors shrink-0 flex items-center gap-1",
                      activeCategory === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {tab.label}
                    <span className="text-[9px] opacity-75 tabular-nums">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Event List Feed */}
            <div className="divide-y divide-border/40 max-h-[280px] overflow-y-auto no-scrollbar flex-1">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((act, idx) => {
                  const meta = getEventMeta(act.eventType, act.entityType);
                  const Icon = meta.icon;

                  return (
                    <div
                      key={idx}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-accent/40 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
                            meta.bg,
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {act.summary || act.eventType}
                            </span>
                            {act.entityType && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1 py-0 h-3.5 font-medium text-muted-foreground/80 border-border/60"
                              >
                                {act.entityType}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                            {act.eventType}
                            {act.entityId && ` · #${act.entityId.substring(0, 8)}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                          {safeFormatDistanceToNow(act.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                  <Activity className="h-6 w-6 mb-1.5 opacity-30" />
                  <span className="text-xs font-medium">No events found in this category</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Engagement & Category Breakdown (4 Cols) ──── */}
          <div className="lg:col-span-4 rounded-xl border border-border/60 bg-card p-3.5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground">
                  Engagement Mix
                </h4>
              </div>

              {/* Progress Bars for Categories */}
              <div className="space-y-2.5 pt-1">
                {[
                  {
                    name: "Commerce & Orders",
                    count: categoryCounts["Commerce"] || 0,
                    accent: "emerald" as AccentKey,
                  },
                  {
                    name: "Events & Workshops",
                    count: categoryCounts["Events"] || 0,
                    accent: "blue" as AccentKey,
                  },
                  {
                    name: "Community & Posts",
                    count: categoryCounts["Community"] || 0,
                    accent: "violet" as AccentKey,
                  },
                  {
                    name: "Points & Badges",
                    count: categoryCounts["Rewards"] || 0,
                    accent: "amber" as AccentKey,
                  },
                  {
                    name: "Campaigns & Mail",
                    count: categoryCounts["Outreach"] || 0,
                    accent: "rose" as AccentKey,
                  },
                ].map((item) => {
                  const pct = Math.round((item.count / totalCalculatedEvents) * 100);
                  const style = ACCENT_STYLES[item.accent];

                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground font-medium">{item.name}</span>
                        <span className="font-bold tabular-nums text-foreground">
                          {item.count}{" "}
                          <span className="text-[9px] text-muted-foreground font-normal">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r", style.bar)}
                          style={{ width: `${Math.max(item.count > 0 ? 5 : 0, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Meta Box */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3 text-indigo-500" />
                Telemetry Coverage
              </span>
              <span className="font-bold text-foreground tabular-nums">
                {profile.totalEvents || allEvents.length} Events
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
