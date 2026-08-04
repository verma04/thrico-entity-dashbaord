"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShieldCheck,
  AlertTriangle,
  Flag,
  Link2,
  Clock,
  Inbox,
  ChevronRight,
  Activity,
  Ban,
  ShieldAlert,
  ArrowRight,
  Zap,
  RotateCcw,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  useGetModerationStats,
  useGetContentReports,
  useGetAiModerationDashboard,
  TimeRange,
  DateRangeInput,
} from "@/graphql/moderation/hooks";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { AiModerationDashboardWidget } from "./ai-moderation-dashboard-widget";
import { HistorySection } from "./history-section";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
  EcosystemGrid,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

const PremiumSectionCard = ({
  title,
  description,
  icon: Icon,
  children,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon: any;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card overflow-hidden flex flex-col shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80",
      className,
    )}
  >
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between">{children}</div>
  </div>
);

export function ModerationDashboard() {
  const [timeRangeStr, setTimeRangeStr] = React.useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRangeStr(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRangeStr(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRangeStr(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRangeStr(TimeRange.LAST_90_DAYS);
  };

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetModerationStats(timeRangeStr, formattedDateRange);
  const {
    data: aiData,
    loading: aiLoading,
    refetch: refetchAi,
  } = useGetAiModerationDashboard(timeRangeStr, formattedDateRange);
  const {
    data: reportsData,
    loading: reportsLoading,
    refetch: refetchReports,
  } = useGetContentReports({
    status: "PENDING",
    limit: 5,
  });

  const stats = statsData?.getModerationStats;
  const aiStats = aiData?.getAiModerationDashboard;
  const recentReports = reportsData?.getContentReports.items || [];

  const handleRefresh = async () => {
    await Promise.all([refetchStats(), refetchAi(), refetchReports()]);
  };

  const totalPosts = aiStats?.totalPosts || 0;
  const flagged = aiStats?.flaggedContent || 0;
  const pending = aiStats?.pendingModeration || 0;
  const rejected = aiStats?.rejectedPosts || 0;
  const totalTokens = aiStats?.totalTokens || 0;
  const cleanPosts = Math.max(0, totalPosts - flagged - pending - rejected);
  const approvalRate =
    totalPosts > 0 ? Math.round((cleanPosts / totalPosts) * 100) : 100;

  const kpis = [
    {
      title: "Awaiting Review",
      value: statsLoading ? "—" : (stats?.pendingReports ?? 0),
      icon: Flag,
      trend: stats?.pendingReports && stats.pendingReports > 0 ? -12.5 : 0,
      trendData: [15, 12, 14, 10, 8, 5, stats?.pendingReports ?? 0],
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      tooltip:
        "Flags and reports requiring manual human moderation and final protocol decisions.",
    },
    {
      title: "Scanned Content",
      value: aiLoading ? "—" : totalPosts,
      icon: FileText,
      trend: totalPosts > 0 ? 8.2 : 0,
      trendData: [120, 140, 135, 160, 180, 195, totalPosts],
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      tooltip:
        "Total user-generated interaction nodes (posts, comments) analyzed by auto-moderation.",
    },
    {
      title: "Auto-Flagged",
      value: aiLoading ? "—" : flagged,
      icon: ShieldAlert,
      trend: flagged > 0 ? -4.3 : 0,
      trendData: [18, 15, 16, 12, 14, 10, flagged],
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      tooltip:
        "Total nodes flagged for containing violations, safety breaches, or policy leaks.",
    },
    {
      title: "Auto-Approval Trust",
      value: aiLoading ? "—" : approvalRate,
      suffix: "%",
      icon: ShieldCheck,
      trend: approvalRate > 95 ? 0.5 : -0.2,
      trendData: [95, 96, 96, 97, 97, 98, approvalRate],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      tooltip:
        "The percentage of content cleared and auto-approved automatically without flagging.",
    },
  ];

  const isRefreshing = statsLoading || aiLoading || reportsLoading;

  return (
    <EcosystemWrapper anonymized-1="moderation-analytics">
      <EcosystemHeader
        title="Safety & Moderation"
        description="Monitor automated filtering velocity, pending review queues, and architectural safety protocols."
        badgeText="Safety Engine"
        icon={ShieldCheck}
        breadcrumbs={[
          { label: "Moderation", href: "/moderation" },
          { label: "Dashboard" }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-border mx-1" />

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-indigo-600 rounded-lg transition-all border-border shadow-sm bg-background"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="vs last period" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Pending Reports & AI Diagnostics */}
          <div className="lg:col-span-8 space-y-6">
            <PremiumSectionCard
              title="Awaiting Review"
              description="High-priority manual intervention"
              icon={Clock}
              action={
                <Link href="/moderation/reports">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-indigo-600 gap-1.5"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              }
            >
              {reportsLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="h-6 w-6 rounded-full border-2 border-muted border-t-foreground animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Syncing Queue...
                  </span>
                </div>
              ) : recentReports.length > 0 ? (
                <div className="divide-y divide-border -mx-5 -my-5">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8 border border-border shadow-sm rounded-lg">
                          <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground uppercase">
                            {report.reportedBy.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground capitalize">
                              {report.contentType.toLowerCase()}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] uppercase font-bold border-rose-100 text-rose-600 bg-rose-50 px-1.5 h-4 tracking-tighter"
                            >
                              {report.reason}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate max-w-xs md:max-w-md">
                            {report.contentPreview || "No preview available..."}
                          </p>
                        </div>
                      </div>
                      <Link href={`/moderation/reports?id=${report.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-300 hover:text-indigo-600 transition-colors rounded-lg"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center dark:bg-zinc-900 dark:border-zinc-800">
                    <ShieldCheck className="h-5 w-5 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      Queue Sanitized
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-2">
                      All content reports have been resolved.
                    </p>
                  </div>
                </div>
              )}
            </PremiumSectionCard>

            <AiModerationDashboardWidget aiData={aiData} loading={aiLoading} />
          </div>

          {/* Action Center / Quick Settings */}
          <div className="lg:col-span-4 space-y-6">
            <PremiumSectionCard
              title="System Hygiene"
              description="Hygiene protocols & filters"
              icon={Activity}
            >
              <div className="space-y-4 w-full">
                <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100/50 flex items-center justify-between dark:bg-emerald-950/10 dark:border-emerald-900/20">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                        Auto-Mod Active
                      </p>
                      <p className="text-[9px] font-medium text-emerald-700/60 dark:text-emerald-400/40 uppercase tracking-tighter">
                        Sanitizing interaction nodes
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1 mt-6">
                    Registry Tools
                  </p>
                  {[
                    {
                      label: "Banned Words",
                      icon: Ban,
                      href: "/moderation/banned-words",
                      count: stats?.bannedWordsCount,
                    },
                    {
                      label: "Blocked Links",
                      icon: Link2,
                      href: "/moderation/blocked-links",
                      count: stats?.blockedLinksCount,
                    },
                    {
                      label: "Safety Settings",
                      icon: ShieldAlert,
                      href: "/moderation/settings",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded bg-muted border border-border text-muted-foreground flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 dark:group-hover:bg-indigo-950 dark:group-hover:border-indigo-900 transition-colors">
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.count !== undefined && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-[9px] font-bold font-mono bg-muted text-muted-foreground group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300"
                          >
                            {statsLoading ? "..." : item.count}
                          </Badge>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </PremiumSectionCard>

            {/* Premium Insight Alert Card */}
            <div className="p-6 rounded-2xl bg-zinc-900 dark:bg-zinc-950 text-white shadow-xl relative overflow-hidden group border border-zinc-800">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Zap size={16} />
                  </div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-100">
                    AI Core Status
                  </h4>
                </div>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                  Automated content filtration is running on Gemini 1.5 Flash
                  models with zero-latency classification active.
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                    LLM Sync Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail Section */}
        <HistorySection />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
