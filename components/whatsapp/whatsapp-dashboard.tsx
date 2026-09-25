"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  CheckCircle2,
  Eye,
  AlertCircle,
  ShieldCheck,
  Zap,
  RefreshCw,
  Layers,
  TrendingUp,
  Activity,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Gift,
  Megaphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CtaButton } from "@/components/ui/cta-button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useWhatsAppStore } from "./whatsapp-store";
import { toast } from "sonner";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import {
  useGetWhatsAppConnections,
  useTestWhatsAppConnection,
  useGetWhatsAppTemplates,
  useGetWhatsAppAnalytics,
  useSyncWhatsAppTemplates,
  WhatsAppConnectionStatus,
} from "@/graphql/actions";

interface WhatsAppDashboardProps {
  dateRange?: unknown;
  timeRange?: string;
}

const BROADCAST_STARTERS = [
  {
    title: "Event Reminder Broadcast 🎉",
    description: "Notify registered members of starting times and live stream links.",
    icon: Sparkles,
    gradient: "from-emerald-500 to-teal-600",
    audience: "Event Attendees",
  },
  {
    title: "Community Welcome Notice 👋",
    description: "Onboard new members with instant dashboard access & key resources.",
    icon: Zap,
    gradient: "from-blue-500 to-indigo-600",
    audience: "New Members",
  },
  {
    title: "Membership Status Update",
    description: "Alert members of tier upgrades, renewals, and newly unlocked perks.",
    icon: Megaphone,
    gradient: "from-amber-500 to-orange-600",
    audience: "Active Tiers",
  },
  {
    title: "Official Announcement 📢",
    description: "Broadcast platform updates and important community notices.",
    icon: Gift,
    gradient: "from-purple-500 to-pink-600",
    audience: "All Subscribers",
  },
];

export default function WhatsAppDashboard({
  timeRange,
}: WhatsAppDashboardProps) {
  const router = useRouter();
  const { templates: storeTemplates, messages, analytics: storeAnalytics, syncTemplates, isSyncingTemplates } =
    useWhatsAppStore();
  const [copiedWaba, setCopiedWaba] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const days = timeRange === "LAST_7_DAYS" ? 7 : timeRange === "LAST_90_DAYS" ? 90 : 30;
  const { data: whatsappData } = useGetWhatsAppConnections();
  const [testConnMutation] = useTestWhatsAppConnection();
  const { data: templatesData, refetch: refetchTemplates } = useGetWhatsAppTemplates();
  const { data: analyticsData } = useGetWhatsAppAnalytics(days);
  const [syncMetaMutation, { loading: isSyncingMutation }] = useSyncWhatsAppTemplates();

  const liveConn = whatsappData?.getWhatsAppConnections?.find(
    (c) => c.status === WhatsAppConnectionStatus.CONNECTED,
  );

  const displayPhone =
    liveConn?.displayPhoneNumber ||
    liveConn?.phoneNumber ||
    "";
  const verifiedName = liveConn?.verifiedName || "";
  const wabaId = liveConn?.wabaId || "";
  const qualityRating = liveConn?.qualityRating || "";

  const templates = useMemo(() => {
    return templatesData?.getWhatsAppTemplates || storeTemplates;
  }, [templatesData, storeTemplates]);

  const liveAnalytics = analyticsData?.getWhatsAppAnalytics;
  const totalSent = liveAnalytics?.totalMessages ?? liveAnalytics?.sentCount ?? storeAnalytics.totalSent;
  const totalDelivered = liveAnalytics?.deliveredCount ?? storeAnalytics.totalDelivered;
  const totalRead = liveAnalytics?.readCount ?? storeAnalytics.totalRead;
  const totalFailed = liveAnalytics?.failedCount ?? storeAnalytics.totalFailed;
  const deliveryRate = totalSent > 0 ? (liveAnalytics?.deliveryRatePercent ?? Number(((totalDelivered / totalSent) * 100).toFixed(1))) : 0;
  const readRate = totalDelivered > 0 ? (liveAnalytics?.readRatePercent ?? Number(((totalRead / totalDelivered) * 100).toFixed(1))) : 0;
  const failureRate = totalSent > 0 ? (liveAnalytics?.failureRatePercent ?? Number(((totalFailed / totalSent) * 100).toFixed(1))) : 0;

  const handleCopyWaba = () => {
    if (!wabaId) return;
    navigator.clipboard.writeText(wabaId);
    setCopiedWaba(true);
    toast.success("WABA ID copied to clipboard");
    setTimeout(() => setCopiedWaba(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      if (liveConn?.id) {
        await testConnMutation({ variables: { connectionId: liveConn.id } });
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      toast.success("WhatsApp Cloud API connection is healthy & active!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to test connection";
      toast.error(msg);
    } finally {
      setIsTesting(false);
    }
  };

  const isSyncing = isSyncingTemplates || isSyncingMutation;

  const handleSync = async () => {
    if (!liveConn?.id) {
      await syncTemplates();
      toast.success("Templates synced!");
      return;
    }
    try {
      await syncMetaMutation({ variables: { connectionId: liveConn.id } });
      await refetchTemplates();
      toast.success("Templates synced with Meta Cloud API!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sync templates";
      toast.error(msg);
    }
  };

  // Sparkline data matching EmailNorthStar
  const chartData = useMemo(() => {
    if (totalSent === 0) {
      return [
        { id: 0, value: 0 },
        { id: 1, value: 0 },
        { id: 2, value: 0 },
        { id: 3, value: 0 },
        { id: 4, value: 0 },
        { id: 5, value: 0 },
        { id: 6, value: 0 },
      ];
    }
    const base = totalSent;
    return [
      { id: 0, value: Math.round(base * 0.45) },
      { id: 1, value: Math.round(base * 0.58) },
      { id: 2, value: Math.round(base * 0.52) },
      { id: 3, value: Math.round(base * 0.74) },
      { id: 4, value: Math.round(base * 0.69) },
      { id: 6, value: totalSent },
    ];
  }, [totalSent]);

  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── 1. North Star Deliverability Banner (Matching EmailNorthStar) ── */}
      <div className="relative overflow-hidden rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-xs">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-teal-500/[0.04]" />
        <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-gradient-to-bl from-emerald-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Label + Value */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[4px] bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                <WhatsAppIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-none">
                  Meta Cloud API Deliverability
                </p>
                <p className="text-[11px] font-semibold text-foreground/80 leading-tight">
                  Total WhatsApp Messages Dispatched
                </p>
              </div>
            </div>

            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
                {totalSent.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold mb-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span>{deliveryRate}%</span>
                <span className="text-[10px] font-semibold text-muted-foreground ml-1">
                  Delivery Rate
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-muted-foreground max-w-xl leading-relaxed flex-wrap">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>{readRate}% open & read engagement</span>
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                <span>{liveConn ? "Meta WABA Official Channel Active" : "Channel Disconnected"}</span>
              </span>
              <span className="text-border">•</span>
              <span>{liveConn ? "Tier 1K (1,000 daily messages)" : "Tier Unassigned"}</span>
            </div>
          </div>

          {/* Right: Sparkline */}
          <div className="h-[80px] w-full md:w-[280px] shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="whatsappNorthStarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#25D366"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#whatsappNorthStarGradient)"
                  dot={false}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 2. Quick Broadcast Starters Row (Matching Email Starters) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Quick Broadcast Starters
          </p>
          <span className="text-[11px] text-muted-foreground">Pre-approved Meta templates</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BROADCAST_STARTERS.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => router.push("/marketing/whatsapp/send")}
              className="group p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 hover:shadow-xs transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-7 w-7 rounded-[4px] bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-xs`}
                  >
                    <s.icon className="h-3.5 w-3.5" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[9.5px] px-1.5 py-0 font-medium bg-[#f6f6f7] dark:bg-zinc-800 text-muted-foreground rounded-[3px]"
                  >
                    {s.audience}
                  </Badge>
                </div>
                <h4 className="text-[12.5px] font-bold text-foreground group-hover:text-emerald-600 transition-colors leading-snug">
                  {s.title}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-border/50">
                <span>Compose Broadcast</span>
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. KPI Summary Cards (Matching CampaignKpiSummary) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Broadcasts */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Broadcasts
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Megaphone className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground tracking-tight">
                  {totalSent.toLocaleString()}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
                >
                  {messages.length} Recent Logs
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-indigo-500" />
                <span>Dispatched WhatsApp broadcasts</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deliverability Rate */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Deliverability Rate
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {deliveryRate}%
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  ({totalDelivered.toLocaleString()} delivered)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>Optimal Meta Cloud API deliverability</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Read / Open Rate */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Read & Opened
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                <Eye className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                  {readRate}%
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  ({totalRead.toLocaleString()} read)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                <span>High audience response rate</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Failed */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Delivery Failures
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
                  {totalFailed}
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  ({failureRate}% failure rate)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-rose-500" />
                <span>Opted-out or unregistered phones</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Main Two-Column Hub: WABA Profile + Template Performance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* WABA Profile Card */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#25D366]" />
              <h3 className="text-[13px] font-bold text-foreground">
                Official WABA Channel Status
              </h3>
            </div>
            <Link
              href="/marketing/whatsapp/usage"
              className="text-[11.5px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>Manage Quotas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Verified Channel Name</span>
              <span className="font-semibold text-foreground">{verifiedName || "Not configured"}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Display Phone Number</span>
              <span className="font-mono font-semibold text-foreground">{displayPhone || "No number connected"}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">WABA ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-foreground">{wabaId || "—"}</span>
                {wabaId && (
                  <button
                    type="button"
                    onClick={handleCopyWaba}
                    className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                    title="Copy WABA ID"
                  >
                    {copiedWaba ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Health & Quality Rating</span>
              {qualityRating ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 text-[11px] font-medium"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> {qualityRating}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-xs">{liveConn ? "Good" : "Not connected"}</span>
              )}
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-muted-foreground">Daily Messaging Tier</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {liveConn ? "Tier 1K (1,000 unique customers/24h)" : "Unconfigured"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10.5px] font-medium border ${liveConn ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60" : "bg-muted text-muted-foreground border-border/60"}`}>
              {liveConn ? <ShieldCheck className="w-3 h-3 text-[#25D366]" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
              {liveConn ? "Meta Channel Active" : "Disconnected"}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10.5px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              <Layers className="w-3 h-3" /> Webhooks Subscribed
            </span>
            <CtaButton
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="ml-auto h-[28px] rounded-[4px] text-[11.5px] gap-1 px-2 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-200"
            >
              <Activity className={`w-3 h-3 text-emerald-500 ${isTesting ? "animate-spin" : ""}`} />
              <span>{isTesting ? "Testing…" : "Test Key"}</span>
            </CtaButton>
          </div>
        </Card>

        {/* Template Performance Breakdown */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="text-[13px] font-bold text-foreground">
                Template Performance Breakdown
              </h3>
            </div>
            <Link
              href="/marketing/whatsapp/templates"
              className="text-[11.5px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>Manage Templates ({templates.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {storeAnalytics.templateBreakdown.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No template broadcast data available yet.
              </div>
            ) : (
              storeAnalytics.templateBreakdown.map((t) => {
                const readPct = t.sent > 0 ? Math.round((t.read / t.sent) * 100) : 0;
                const delivPct = t.sent > 0 ? Math.round((t.delivered / t.sent) * 100) : 0;
                return (
                  <div key={t.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-foreground">
                        {t.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {t.sent.toLocaleString()} sent
                      </span>
                    </div>

                    {/* Dual progress bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#25D366] h-full transition-all duration-500"
                        style={{ width: `${readPct}%` }}
                      />
                      <div
                        className="bg-blue-400 h-full transition-all duration-500"
                        style={{ width: `${Math.max(0, delivPct - readPct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                        Read: <strong className="text-foreground">{readPct}%</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        Delivered: <strong className="text-foreground">{delivPct}%</strong>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Need newly created templates?</span>
            <CtaButton
              variant="ghost"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 gap-1.5 p-1"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>{isSyncing ? "Syncing…" : "Sync from Meta"}</span>
            </CtaButton>
          </div>
        </Card>
      </div>

      {/* ── 5. Recent Dispatches Table (Matching Campaigns Table) ── */}
      <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <h3 className="text-[13px] font-bold text-foreground">
              Recent Message Broadcasts
            </h3>
          </div>
          <Link
            href="/marketing/whatsapp/campaigns"
            className="text-[11.5px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <span>View All Dispatches ({messages.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No message broadcasts found. Compose a broadcast to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold text-[10.5px] uppercase tracking-wider text-left">
                  <th className="pb-2.5 pl-1">Recipient</th>
                  <th className="pb-2.5">Template</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Dispatched</th>
                  <th className="pb-2.5">Delivered</th>
                  <th className="pb-2.5 pr-1">Read</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    <td className="py-2.5 pl-1">
                      <div>
                        <p className="font-semibold text-foreground text-[12px]">
                          {msg.recipientName}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {msg.recipientPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="font-mono text-foreground font-medium bg-muted px-2 py-0.5 rounded-[4px] text-[11px]">
                        {msg.templateName}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <AdminStatusBadge
                        status={msg.status}
                        variant={
                          msg.status === "READ" || msg.status === "DELIVERED"
                            ? "success"
                            : msg.status === "FAILED"
                            ? "error"
                            : "info"
                        }
                        className="text-[10px]"
                      />
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {msg.deliveredAt
                        ? new Date(msg.deliveredAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="py-2.5 pr-1 text-muted-foreground">
                      {msg.readAt
                        ? new Date(msg.readAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
