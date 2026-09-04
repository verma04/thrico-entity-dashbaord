"use client";

import React from "react";
import {
  Mail,
  Users,
  Eye,
  MousePointerClick,
  Send,
  Calendar,
  Clock,
  BarChart2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { EmailCampaignEntity } from "@/graphql/actions/email/campaign-actions";
import { safeFormat } from "@/lib/date-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface CampaignCardProps {
  campaign: EmailCampaignEntity;
  onSelectAnalytics: (campaign: EmailCampaignEntity) => void;
}

export function CampaignCard({ campaign, onSelectAnalytics }: CampaignCardProps) {
  const router = useRouter();
  const m = campaign.metrics;

  const total = campaign.totalRecipients || m?.sent || 0;
  const openRate = m?.openRate ? Number(m.openRate).toFixed(1) : "0.0";
  const clickRate = m?.clickRate ? Number(m.clickRate).toFixed(1) : "0.0";
  const deliveryRate = m?.deliveryRate ? Number(m.deliveryRate).toFixed(1) : "100.0";

  const isSent = (campaign.status || "").toUpperCase() === "SENT";
  const isDraft = (campaign.status || "").toUpperCase() === "DRAFT";
  const isScheduled = (campaign.status || "").toUpperCase() === "SCHEDULED";

  return (
    <Card className="group rounded-xl border border-border/60 bg-card hover:border-border hover:shadow-2xs transition-all flex flex-col justify-between space-y-4 p-4">
      <div className="space-y-3">
        {/* Top Header: Badge & Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] font-bold text-foreground truncate max-w-[180px] group-hover:text-indigo-600 transition-colors">
                {campaign.name}
              </h4>
              <p className="text-[10.5px] text-muted-foreground truncate max-w-[180px]">
                {campaign.senderEmail || "noreply@entity.com"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <AdminStatusBadge
              status={campaign.status}
              variant={
                isSent
                  ? "success"
                  : isScheduled
                    ? "warning"
                    : isDraft
                      ? "neutral"
                      : "info"
              }
              className="text-[9.5px] px-1.5 py-0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-[4px] cursor-pointer"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 rounded-[6px]">
                <DropdownMenuItem
                  onClick={() => onSelectAnalytics(campaign)}
                  className="text-[11.5px] font-semibold cursor-pointer"
                >
                  <BarChart2 className="h-3 w-3 mr-1.5 text-indigo-500" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/email/campaigns/${campaign.id}`)}
                  className="text-[11.5px] font-semibold cursor-pointer"
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  Full Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Subject Line & Target */}
        <div className="p-2.5 rounded-[6px] bg-muted/30 border border-border/40 space-y-1">
          <p className="text-[11px] font-semibold text-foreground truncate">
            {campaign.subject || "No subject defined"}
          </p>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {campaign.audienceType || "All Members"}
            </span>
            <span className="font-semibold text-foreground">
              {total.toLocaleString()} Recipients
            </span>
          </div>
        </div>

        {/* Live Metrics Progress Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded-[4px] bg-background border border-border/60 text-center space-y-1">
            <span className="text-[9.5px] font-bold text-muted-foreground uppercase">Delivered</span>
            <p className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">{deliveryRate}%</p>
          </div>

          <div className="p-2 rounded-[4px] bg-background border border-border/60 text-center space-y-1">
            <span className="text-[9.5px] font-bold text-muted-foreground uppercase">Opens</span>
            <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400">{openRate}%</p>
          </div>

          <div className="p-2 rounded-[4px] bg-background border border-border/60 text-center space-y-1">
            <span className="text-[9.5px] font-bold text-muted-foreground uppercase">Clicks</span>
            <p className="text-[12px] font-bold text-purple-600 dark:text-purple-400">{clickRate}%</p>
          </div>
        </div>
      </div>

      {/* Footer & Quick Actions */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>
            {campaign.sentAt
              ? safeFormat(campaign.sentAt, "MMM d, yyyy", "Sent")
              : campaign.scheduledAt
                ? `Sched: ${safeFormat(campaign.scheduledAt, "MMM d", "")}`
                : "Draft"}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelectAnalytics(campaign)}
          className="h-7 px-2.5 text-[11px] font-bold gap-1 rounded-[4px] border-border text-foreground hover:bg-muted cursor-pointer"
        >
          <BarChart2 className="h-3 w-3 text-indigo-500" />
          Analytics
        </Button>
      </div>
    </Card>
  );
}

export function CampaignCardSkeleton() {
  return (
    <Card className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col justify-between space-y-4 p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-[4px]" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-32 rounded-[3px]" />
              <Skeleton className="h-2.5 w-24 rounded-[3px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-12 rounded-[3px]" />
        </div>

        {/* Subject and Target Box */}
        <div className="p-2.5 rounded-[6px] bg-muted/20 border border-border/40 space-y-1.5">
          <Skeleton className="h-3 w-3/4 rounded-[3px]" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-2.5 w-20 rounded-[3px]" />
            <Skeleton className="h-2.5 w-16 rounded-[3px]" />
          </div>
        </div>

        {/* Metrics 3-Col */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-2 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800/60 border border-border/40 text-center space-y-1"
            >
              <Skeleton className="h-2 w-10 mx-auto rounded-[2px]" />
              <Skeleton className="h-3.5 w-8 mx-auto rounded-[2px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded-[3px]" />
        <Skeleton className="h-6 w-16 rounded-[4px]" />
      </div>
    </Card>
  );
}

