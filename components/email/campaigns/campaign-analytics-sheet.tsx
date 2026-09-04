"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Eye,
  MousePointerClick,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Users,
  Activity,
  Link2,
  X,
} from "lucide-react";
import { EmailCampaignEntity } from "@/graphql/actions/email/campaign-actions";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeFormat } from "@/lib/date-utils";
import { CampaignRecipientsDrilldown } from "./campaign-recipients-drilldown";
import { CampaignLinkClicks } from "./campaign-link-clicks";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CampaignAnalyticsSheetProps {
  campaign: EmailCampaignEntity | null;
  onClose: () => void;
}

export function CampaignAnalyticsSheet({
  campaign,
  onClose,
}: CampaignAnalyticsSheetProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"recipients" | "links">("recipients");

  if (!campaign) return null;

  const m = campaign.metrics;
  const sent = m?.sent ?? campaign.successfulSent ?? 0;
  const delivered = m?.delivered ?? campaign.successfulSent ?? 0;
  const opened = m?.opened ?? 0;
  const clicked = m?.clicked ?? 0;
  const bounced = m?.bounced ?? campaign.failedSent ?? 0;

  const deliveryRate = m?.deliveryRate ? Number(m.deliveryRate).toFixed(1) : "100.0";
  const openRate = m?.openRate ? Number(m.openRate).toFixed(1) : "0.0";
  const clickRate = m?.clickRate ? Number(m.clickRate).toFixed(1) : "0.0";
  const ctor = m?.ctor ? Number(m.ctor).toFixed(1) : "0.0";

  return (
    <Dialog open={!!campaign} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-border/80 bg-card shadow-2xl">
        {/* Header Strip */}
        <div className="p-6 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[6px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {campaign.name}
                </h3>
                <AdminStatusBadge status={campaign.status} className="text-[10px]" />
              </div>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                {campaign.subject || "No subject set"} · Sent via{" "}
                <span className="font-mono text-foreground/80">
                  {campaign.senderEmail || "noreply@entity.com"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                router.push(`/email/campaigns/${campaign.id}`);
              }}
              className="h-8 text-xs font-semibold gap-1.5 border-border rounded-[4px]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Full Screen Report
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* KPI Scorecard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Delivered
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {delivered.toLocaleString()}
                </span>
                <span className="text-[10.5px] text-muted-foreground">
                  ({deliveryRate}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Unique Opens
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {opened.toLocaleString()}
                </span>
                <span className="text-[10.5px] text-muted-foreground">
                  ({openRate}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Unique Clicks
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {clicked.toLocaleString()}
                </span>
                <span className="text-[10.5px] text-muted-foreground">
                  ({clickRate}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Click-to-Open (CTOR)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {ctor}%
                </span>
                <span className="text-[10.5px] text-muted-foreground">
                  engagement
                </span>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Recipients vs Links */}
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
              <CampaignRecipientsDrilldown campaignId={campaign.id} />
            ) : (
              <CampaignLinkClicks campaignId={campaign.id} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
