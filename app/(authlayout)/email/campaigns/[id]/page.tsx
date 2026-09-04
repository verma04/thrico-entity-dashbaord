"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Megaphone,
  ArrowLeft,
  Mail,
  Eye,
  MousePointerClick,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Users,
  Link2,
  Calendar,
  Clock,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import {
  useGetEmailCampaignDetail,
  useGetEmailCampaignTimeSeries,
} from "@/graphql/actions/email/campaign-actions";
import { safeFormat } from "@/lib/date-utils";
import { CampaignRecipientsDrilldown } from "@/components/email/campaigns/campaign-recipients-drilldown";
import { CampaignLinkClicks } from "@/components/email/campaigns/campaign-link-clicks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = String(params.id);

  const [activeTab, setActiveTab] = useState<"recipients" | "links">("recipients");

  const { data, loading, refetch } = useGetEmailCampaignDetail(campaignId);
  const { data: timeSeriesData, loading: timeSeriesLoading } =
    useGetEmailCampaignTimeSeries(campaignId, 30);

  const campaign = data?.getEmailCampaign;

  if (loading) {
    return (
      <EcosystemWrapper className="gap-4 animate-in fade-in duration-300">
        <EcosystemHeader
          title="Campaign Analytics"
          description="Loading campaign performance telemetry, deliverability rates, and recipient drilldowns…"
          icon={Megaphone}
          badgeText="Analytics"
          breadcrumbs={[
            { label: "Email", href: "/email" },
            { label: "Campaigns", href: "/email/campaigns" },
            { label: "Loading Campaign…" },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/email/campaigns")}
                className="h-[30px] gap-1.5 text-[12px] font-semibold border-border rounded-[4px] bg-white dark:bg-zinc-900 cursor-pointer"
              >
                <ArrowLeft className="h-3 w-3" />
                All Campaigns
              </Button>
            </div>
          }
        />

        <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-6">
          {/* KPI Scorecards Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded-[3px]" />
                  <Skeleton className="h-6 w-6 rounded-[3px]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-7 w-24 rounded-[3px]" />
                  <Skeleton className="h-3.5 w-12 rounded-[3px]" />
                </div>
                <Skeleton className="h-2.5 w-3/4 rounded-[3px]" />
              </div>
            ))}
          </div>

          {/* Timeline Chart Skeleton */}
          <div className="p-5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3.5">
            <div className="space-y-1">
              <Skeleton className="h-4 w-48 rounded-[3px]" />
              <Skeleton className="h-3 w-64 rounded-[3px]" />
            </div>
            <Skeleton className="h-[200px] w-full rounded-[6px]" />
          </div>

          {/* Tab & Table Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-36 rounded-[4px]" />
                <Skeleton className="h-7 w-36 rounded-[4px]" />
              </div>
              <Skeleton className="h-8 w-60 rounded-[4px]" />
            </div>

            <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-2xs">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-40 rounded-[3px]" />
                      <Skeleton className="h-2.5 w-24 rounded-[3px]" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-[3px]" />
                  <Skeleton className="h-4 w-12 rounded-[3px]" />
                  <Skeleton className="h-4 w-12 rounded-[3px]" />
                  <Skeleton className="h-3.5 w-28 rounded-[3px]" />
                </div>
              ))}
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (!campaign) {
    return (
      <EcosystemWrapper className="gap-4">
        <EcosystemHeader
          title="Campaign Not Found"
          description="The requested email campaign could not be located."
          icon={Megaphone}
          badgeText="Error"
          breadcrumbs={[
            { label: "Email", href: "/email" },
            { label: "Campaigns", href: "/email/campaigns" },
            { label: "Not Found" },
          ]}
        />
        <EcosystemContainer className="p-8 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            This campaign may have been deleted or archived.
          </p>
          <Button
            size="sm"
            onClick={() => router.push("/email/campaigns")}
            className="h-8 text-xs font-semibold bg-[#303030] text-white rounded-[4px]"
          >
            Back to Campaigns
          </Button>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  const m = campaign.metrics;
  const delivered = m?.delivered ?? campaign.successfulSent ?? 0;
  const opened = m?.opened ?? 0;
  const clicked = m?.clicked ?? 0;
  const bounced = m?.bounced ?? campaign.failedSent ?? 0;

  const deliveryRate = m?.deliveryRate ? Number(m.deliveryRate).toFixed(1) : "100.0";
  const openRate = m?.openRate ? Number(m.openRate).toFixed(1) : "0.0";
  const clickRate = m?.clickRate ? Number(m.clickRate).toFixed(1) : "0.0";
  const ctor = m?.ctor ? Number(m.ctor).toFixed(1) : "0.0";

  const chartData = timeSeriesData?.getEmailCampaignTimeSeries || [];

  return (
    <EcosystemWrapper className="gap-4 animate-in fade-in duration-500">
      <EcosystemHeader
        title={campaign.name}
        description={`Subject: "${campaign.subject || "No subject"}" · Sent via ${campaign.senderEmail || "noreply@entity.com"}`}
        icon={Megaphone}
        badgeText="Campaign Report"
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Campaigns", href: "/email/campaigns" },
          { label: campaign.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/email/campaigns")}
              className="h-8 gap-1.5 text-xs font-semibold border-border rounded-[4px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Campaigns
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-8 w-8 border-border rounded-[4px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Delivered
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {delivered.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                ({deliveryRate}%)
              </span>
            </div>
            <p className="text-[10.5px] text-muted-foreground pt-1">
              Sent to {campaign.totalRecipients.toLocaleString()} recipients
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Unique Opens
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {opened.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                ({openRate}%)
              </span>
            </div>
            <p className="text-[10.5px] text-muted-foreground pt-1">
              Subject line & preview rate
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Unique Clicks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {clicked.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                ({clickRate}%)
              </span>
            </div>
            <p className="text-[10.5px] text-muted-foreground pt-1">
              Link engagement across body
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Click-to-Open (CTOR)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {ctor}%
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                engagement
              </span>
            </div>
            <p className="text-[10.5px] text-muted-foreground pt-1">
              Ratio of clickers to openers
            </p>
          </div>
        </div>

        {/* Time-Series Chart */}
        {timeSeriesLoading ? (
          <div className="p-5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3.5">
            <div className="space-y-1">
              <Skeleton className="h-4 w-48 rounded-[3px]" />
              <Skeleton className="h-3 w-64 rounded-[3px]" />
            </div>
            <Skeleton className="h-[200px] w-full rounded-[6px]" />
          </div>
        ) : chartData.length > 0 ? (
          <div className="p-5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-bold text-foreground">
                  Transmission &amp; Engagement Timeline
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Hourly and daily activity trends after dispatch
                </p>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="opened" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="clicked" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* Tab Switcher & Drilldown Tables */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 border-b border-border/60 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("recipients")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all cursor-pointer",
                activeTab === "recipients"
                  ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              Recipient Activity Logs
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("links")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all cursor-pointer",
                activeTab === "links"
                  ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Link2 className="h-3.5 w-3.5" />
              Link Click Heatmap
            </button>
          </div>

          {activeTab === "recipients" ? (
            <CampaignRecipientsDrilldown campaignId={campaignId} />
          ) : (
            <CampaignLinkClicks campaignId={campaignId} />
          )}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(CampaignDetailPage, "EMAIL", "canRead");
