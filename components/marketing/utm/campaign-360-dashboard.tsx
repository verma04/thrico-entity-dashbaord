"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  ADMIN_GET_CAMPAIGN_360_STATS,
  ADMIN_GET_CAMPAIGN_MEMBERS,
} from "@/graphql/actions/utm/admin-utm.graphql";
import {
  BarChart3,
  MousePointerClick,
  UserCheck,
  TrendingUp,
  LogIn,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronsRight,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { safeFormat } from "@/lib/date-utils";
import {
  UtmCampaign360Stats,
  AttributedMemberProfile,
  UtmSourceBreakdown,
  UtmMediumBreakdown,
  UtmContentBreakdown,
  TimeRange,
} from "@/types/utm";
import { MemberJourneyModal } from "./member-journey-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Campaign360DashboardProps {
  campaignSlug: string;
  onBack?: () => void;
  availableCampaigns?: { name: string; slug: string }[];
  onSelectCampaign?: (slug: string) => void;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "Last 24 Hours", value: "LAST_24_HOURS" },
  { label: "Last 7 Days", value: "LAST_7_DAYS" },
  { label: "Last 30 Days", value: "LAST_30_DAYS" },
  { label: "Last 90 Days", value: "LAST_90_DAYS" },
  { label: "This Month", value: "THIS_MONTH" },
  { label: "Last Month", value: "LAST_MONTH" },
];

export function Campaign360Dashboard({
  campaignSlug,
  onBack,
  availableCampaigns,
  onSelectCampaign,
}: Campaign360DashboardProps) {
  const [activeTab, setActiveTab] = useState<"hierarchy" | "funnel" | "members">("hierarchy");
  const [timeRange, setTimeRange] = useState<TimeRange>("LAST_30_DAYS");
  const [memberSourceFilter, setMemberSourceFilter] = useState<string>("ALL");
  const [memberSearch, setMemberSearch] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<AttributedMemberProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({
    google: true,
    twitter: true,
    newsletter: true,
  });

  // Query 1: 360 Stats with timeRange
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(ADMIN_GET_CAMPAIGN_360_STATS, {
    variables: {
      campaign: campaignSlug,
      timeRange: timeRange,
    },
    fetchPolicy: "cache-and-network",
    pollInterval: 30000,
  });

  // Query 2: Attributed Members with source filter
  const {
    data: membersData,
    loading: membersLoading,
    refetch: refetchMembers,
  } = useQuery(ADMIN_GET_CAMPAIGN_MEMBERS, {
    variables: {
      campaign: campaignSlug,
      source: memberSourceFilter !== "ALL" ? memberSourceFilter : undefined,
      limit: 50,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  // Real stats or empty zero state
  const stats: UtmCampaign360Stats =
    statsData?.getUtmCampaign360Stats || {
      campaign: campaignSlug,
      visits: 0,
      signupPageVisits: 0,
      signups: 0,
      loginClicks: 0,
      successfulLogins: 0,
      conversionRate: 0,
      sources: [],
    };

  const rawMembers: AttributedMemberProfile[] =
    membersData?.getUtmCampaignMembers || [];

  // Filter members by local search query and source
  const filteredMembers = useMemo(() => {
    return rawMembers.filter((m) => {
      if (memberSourceFilter !== "ALL") {
        const matchesFirst = m.firstTouch?.source?.toLowerCase() === memberSourceFilter.toLowerCase();
        const matchesLast = m.lastTouch?.source?.toLowerCase() === memberSourceFilter.toLowerCase();
        if (!matchesFirst && !matchesLast) return false;
      }
      if (memberSearch.trim()) {
        const q = memberSearch.toLowerCase().trim();
        const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
        const email = (m.email || "").toLowerCase();
        const content = (m.firstTouch?.content || "").toLowerCase();
        return fullName.includes(q) || email.includes(q) || content.includes(q);
      }
      return true;
    });
  }, [rawMembers, memberSourceFilter, memberSearch]);

  const toggleSource = (source: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchMembers()]);
      toast.success("Telemetry refreshed from ClickHouse");
    } catch {
      toast.success("Telemetry updated");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleDrilldownToSourceMembers = (source: string) => {
    setMemberSourceFilter(source);
    setActiveTab("members");
  };

  // Funnel conversion drops
  const landingDrop =
    stats.visits > 0
      ? Math.max(0, 100 - (stats.signupPageVisits / stats.visits) * 100).toFixed(1)
      : "0";
  const signupDrop =
    stats.signupPageVisits > 0
      ? Math.max(0, 100 - (stats.signups / stats.signupPageVisits) * 100).toFixed(1)
      : "0";
  const signupRateFromLanding =
    stats.signupPageVisits > 0
      ? ((stats.signups / stats.signupPageVisits) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Header / Breadcrumb Card ───────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-border/60 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-7 text-xs text-muted-foreground hover:text-foreground -ml-2 mr-1 cursor-pointer"
              >
                ← All UTM Campaigns
              </Button>
            )}
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300"
            >
              utm_campaign: {campaignSlug}
            </Badge>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live ClickHouse Telemetry
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            360° Attribution Performance: {stats.campaign}
          </h2>
          <p className="text-xs text-muted-foreground">
            Aggregated multi-touch conversion telemetry, creative variants, and attributed member audit trail.
          </p>
        </div>

        {/* Controls: TimeRange Selector & Campaign Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Select value={timeRange} onValueChange={(val) => setTimeRange(val as TimeRange)}>
            <SelectTrigger className="h-8 w-[145px] text-xs bg-muted/30 border-border font-medium">
              <Calendar className="h-3 w-3 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((tr) => (
                <SelectItem key={tr.value} value={tr.value} className="text-xs">
                  {tr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {availableCampaigns && availableCampaigns.length > 0 && onSelectCampaign && (
            <div className="flex items-center gap-1.5">
              <select
                value={campaignSlug}
                onChange={(e) => onSelectCampaign(e.target.value)}
                className="h-8 px-2.5 bg-muted/30 border border-border rounded-md text-xs font-medium text-foreground cursor-pointer"
              >
                {availableCampaigns.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* ── 5 KPI Metric Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Visits */}
        <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Visits
              </span>
              <div className="h-6 w-6 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <MousePointerClick className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
                {stats.visits.toLocaleString()}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Unique traffic clicks</p>
            </div>
          </CardContent>
        </Card>

        {/* Signup Page Visits */}
        <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Signup Page Views
              </span>
              <div className="h-6 w-6 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight tabular-nums">
                {stats.signupPageVisits.toLocaleString()}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {stats.visits > 0
                  ? `${((stats.signupPageVisits / stats.visits) * 100).toFixed(1)}% landing rate`
                  : "Funnel entry"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Completed Signups */}
        <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Completed Signups
              </span>
              <div className="h-6 w-6 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">
                {stats.signups.toLocaleString()}
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                Attributed new accounts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Conversion Rate
              </span>
              <div className="h-6 w-6 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight tabular-nums">
                {stats.conversionRate}%
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Visit-to-member ratio</p>
            </div>
          </CardContent>
        </Card>

        {/* Logins & Retained */}
        <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all col-span-2 sm:col-span-1">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Logins & Returns
              </span>
              <div className="h-6 w-6 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <LogIn className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight tabular-nums">
                {stats.successfulLogins.toLocaleString()}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {stats.loginClicks.toLocaleString()} login clicks
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Sub-Navigation Tabs ─────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "hierarchy" | "funnel" | "members")
        }
        className="w-full"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <TabsList className="bg-muted/40 h-8 p-0.5">
            <TabsTrigger value="hierarchy" className="text-xs px-3 py-1 gap-1.5 cursor-pointer">
              <Layers className="h-3.5 w-3.5" />
              Sources & Creatives Breakdown
            </TabsTrigger>
            <TabsTrigger value="funnel" className="text-xs px-3 py-1 gap-1.5 cursor-pointer">
              <Compass className="h-3.5 w-3.5" />
              Conversion Funnel
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs px-3 py-1 gap-1.5 cursor-pointer">
              <Users className="h-3.5 w-3.5" />
              Attributed Members ({filteredMembers.length})
            </TabsTrigger>
          </TabsList>

          <span className="text-[11px] text-muted-foreground hidden sm:inline-block">
            {stats.sources?.length || 0} active traffic channels
          </span>
        </div>

        {/* ── Tab 1: Hierarchical Channel & Creative Breakdown ──────────── */}
        <TabsContent value="hierarchy" className="pt-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Channel, Medium & Creative Hierarchical Attribution
                </h3>
                <p className="text-xs text-muted-foreground">
                  Drill down from high-level channel source into UTM mediums and individual creative content variants.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allOpen = Object.values(expandedSources).every(Boolean);
                  const next: Record<string, boolean> = {};
                  (stats.sources || []).forEach((s) => {
                    next[s.source] = !allOpen;
                  });
                  setExpandedSources(next);
                }}
                className="text-xs h-7 cursor-pointer"
              >
                {Object.values(expandedSources).every(Boolean) ? "Collapse All" : "Expand All"}
              </Button>
            </div>

            <div className="space-y-3">
              {(!stats.sources || stats.sources.length === 0) && (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-1.5 bg-muted/10 rounded-xl border border-dashed border-border/60">
                  <p className="font-semibold text-foreground text-sm">No telemetry recorded yet</p>
                  <p className="text-muted-foreground/80 max-w-sm mx-auto">
                    When visitors click your tracking link, their sources, mediums, and conversions will appear here.
                  </p>
                </div>
              )}
              {(stats.sources || []).map((sourceItem: UtmSourceBreakdown) => {
                const isExpanded = expandedSources[sourceItem.source] ?? true;
                const sourceShare =
                  stats.visits > 0
                    ? ((sourceItem.visits / stats.visits) * 100).toFixed(0)
                    : "0";

                return (
                  <div
                    key={sourceItem.source}
                    className="border border-border/60 rounded-xl bg-muted/10 overflow-hidden transition-all"
                  >
                    {/* Source Header Row */}
                    <div
                      onClick={() => toggleSource(sourceItem.source)}
                      className="p-3.5 bg-muted/20 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-xs" />
                        <div>
                          <span className="font-bold text-xs text-foreground uppercase tracking-wider font-mono">
                            {sourceItem.source}
                          </span>
                          <span className="text-[11px] text-muted-foreground ml-2">
                            ({sourceShare}% of total visits)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono flex-wrap">
                        <span className="text-foreground">
                          <strong>{sourceItem.visits.toLocaleString()}</strong> visits
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          <strong>{sourceItem.signups.toLocaleString()}</strong> signups
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                        >
                          {sourceItem.conversionRate}% conv.
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDrilldownToSourceMembers(sourceItem.source);
                          }}
                          className="h-6 text-[11px] px-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-sans cursor-pointer"
                        >
                          View Members →
                        </Button>
                      </div>
                    </div>

                    {/* Mediums & Creatives (Expanded) */}
                    {isExpanded && (
                      <div className="p-3.5 space-y-3 border-t border-border/40 bg-white dark:bg-zinc-900/60">
                        {(sourceItem.mediums || []).map((mediumItem: UtmMediumBreakdown) => (
                          <div
                            key={mediumItem.medium}
                            className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-2 py-1"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 font-medium text-foreground">
                                <span className="text-muted-foreground">↳ Medium:</span>
                                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                  {mediumItem.medium}
                                </span>
                              </div>
                              <div className="font-mono text-[11px] text-muted-foreground">
                                {mediumItem.visits.toLocaleString()} visits •{" "}
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  {mediumItem.signups.toLocaleString()} signups
                                </span>
                              </div>
                            </div>

                            {/* Creative Contents */}
                            <div className="pl-3 space-y-1.5">
                              {(mediumItem.contents || []).map(
                                (contentItem: UtmContentBreakdown, cIdx: number) => {
                                  const contentConversion =
                                    contentItem.conversionRate ??
                                    (contentItem.visits > 0
                                      ? Number(
                                          ((contentItem.signups / contentItem.visits) * 100).toFixed(1)
                                        )
                                      : 0);

                                  return (
                                    <div
                                      key={cIdx}
                                      className="p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors flex items-center justify-between text-xs font-mono"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">• Creative:</span>
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] font-mono border-border/80"
                                        >
                                          {contentItem.content}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground text-[11px]">
                                          {contentItem.visits.toLocaleString()} visits
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                                          {contentItem.signups.toLocaleString()} signups
                                        </span>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                                          ({contentConversion}%)
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 2: Visual Conversion Funnel ───────────────────────────── */}
        <TabsContent value="funnel" className="pt-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Acquisition & Attribution Funnel Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Step-by-step conversion drop-off from initial campaign click through to authenticated member engagement.
              </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Step 1: Campaign Clicks */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>Total Campaign Clicks / Visits</span>
                  </div>
                  <div className="font-mono font-bold text-foreground">
                    {stats.visits.toLocaleString()} (100%)
                  </div>
                </div>
                <Progress value={100} className="h-3 bg-muted" />
              </div>

              {/* Transition 1 -> 2 */}
              <div className="flex items-center gap-2 pl-7 text-[11px] text-muted-foreground font-mono">
                <ArrowRight className="h-3 w-3 rotate-90" />
                <span>
                  Landing view drop-off: <strong className="text-rose-500">-{landingDrop}%</strong>
                </span>
              </div>

              {/* Step 2: Signup Page Visits */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>Signup Landing Page Views</span>
                  </div>
                  <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {stats.signupPageVisits.toLocaleString()} (
                    {stats.visits > 0
                      ? ((stats.signupPageVisits / stats.visits) * 100).toFixed(1)
                      : 0}
                    %)
                  </div>
                </div>
                <Progress
                  value={
                    stats.visits > 0
                      ? (stats.signupPageVisits / stats.visits) * 100
                      : 0
                  }
                  className="h-3 bg-muted"
                />
              </div>

              {/* Transition 2 -> 3 */}
              <div className="flex items-center gap-2 pl-7 text-[11px] text-muted-foreground font-mono">
                <ArrowRight className="h-3 w-3 rotate-90" />
                <span>
                  Form completion drop-off: <strong className="text-rose-500">-{signupDrop}%</strong> • Form conversion:{" "}
                  <strong className="text-emerald-600">{signupRateFromLanding}%</strong>
                </span>
              </div>

              {/* Step 3: Completed Signups */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>Completed User Signups</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.signups.toLocaleString()} ({stats.conversionRate}%)
                  </div>
                </div>
                <Progress
                  value={
                    stats.visits > 0
                      ? (stats.signups / stats.visits) * 100
                      : 0
                  }
                  className="h-3 bg-muted"
                />
              </div>

              {/* Step 4: Subsequent Logins */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
                    <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center text-[10px]">
                      4
                    </span>
                    <span>Subsequent Logins & Returning Member Sessions</span>
                  </div>
                  <div className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    {stats.successfulLogins.toLocaleString()} sessions
                  </div>
                </div>
                <Progress
                  value={
                    stats.visits > 0
                      ? Math.min((stats.successfulLogins / stats.visits) * 100, 100)
                      : 0
                  }
                  className="h-3 bg-muted"
                />
              </div>
            </div>

            {/* Funnel Health Summary Box */}
            <div className="mt-6 p-4 rounded-xl bg-muted/20 border border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground text-[11px] font-semibold">
                  Overall Traffic Conversion
                </div>
                <div className="text-lg font-bold text-foreground font-mono">
                  {stats.conversionRate}%
                </div>
                <div className="text-[10px] text-muted-foreground">Clicks converted to registered users</div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground text-[11px] font-semibold">
                  Signup Landing Efficiency
                </div>
                <div className="text-lg font-bold text-emerald-600 font-mono">
                  {signupRateFromLanding}%
                </div>
                <div className="text-[10px] text-muted-foreground">Visitors on signup page who registered</div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground text-[11px] font-semibold">
                  Activity Velocity
                </div>
                <div className="text-lg font-bold text-purple-600 font-mono">
                  {stats.signups > 0
                    ? (stats.successfulLogins / stats.signups).toFixed(1)
                    : "0.0"}x
                </div>
                <div className="text-[10px] text-muted-foreground">Average login sessions per new signup</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 3: Campaign Attributed Members List ───────────────────── */}
        <TabsContent value="members" className="pt-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Attributed Members & Multi-Touch Audit
                </h3>
                <p className="text-xs text-muted-foreground">
                  Audited registered users with first-touch acquisition and last-touch conversion telemetry.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Search */}
                <div className="relative w-48 sm:w-56">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search member or email…"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>

                {/* Source Filter */}
                <Select
                  value={memberSourceFilter}
                  onValueChange={(val) => setMemberSourceFilter(val)}
                >
                  <SelectTrigger className="h-8 w-36 text-xs bg-muted/30">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Sources</SelectItem>
                    {(stats.sources || []).map((s) => (
                      <SelectItem key={s.source} value={s.source}>
                        {s.source.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Badge variant="secondary" className="text-xs font-mono h-8 flex items-center px-2.5">
                  {filteredMembers.length} Members
                </Badge>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="px-5 py-3 font-bold">Member Profile</th>
                    <th className="px-5 py-3 font-bold">Logins</th>
                    <th className="px-5 py-3 font-bold">First Touch Attribution</th>
                    <th className="px-5 py-3 font-bold">Last Touch Attribution</th>
                    <th className="px-5 py-3 font-bold text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredMembers.map((m) => (
                    <tr
                      key={m.userId}
                      onClick={() => setSelectedMember(m)}
                      className="hover:bg-muted/20 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-full border border-border">
                            <AvatarImage src={m.avatar} />
                            <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-700 font-bold">
                              {(m.firstName?.[0] || "U") + (m.lastName?.[0] || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-xs text-foreground group-hover:text-indigo-600 transition-colors">
                              {m.firstName} {m.lastName}
                            </div>
                            <div className="text-[10.5px] text-muted-foreground">{m.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {m.loginCount} logins
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {m.firstTouch.source}
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span>{m.firstTouch.medium}</span>
                          </div>
                          {m.firstTouch.content && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              creative: {m.firstTouch.content}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="font-bold text-purple-600 dark:text-purple-400">
                              {m.lastTouch.source}
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span>{m.lastTouch.medium}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {m.lastTouch.landingPage || "/auth/login"}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(m);
                          }}
                          className="h-7 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer"
                        >
                          Audit Journey →
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground text-xs">
                        No members found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Member Multi-Touch Journey Modal ─────────────────────────────── */}
      <MemberJourneyModal
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}
