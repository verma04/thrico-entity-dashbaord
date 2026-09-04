"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import { Mail, Megaphone, BarChart2, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { EmailCampaignEntity } from "@/graphql/actions/email/campaign-actions";
import { safeFormat } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CampaignsTableProps {
  campaigns: EmailCampaignEntity[];
  isLoading?: boolean;
  onSelectAnalytics: (campaign: EmailCampaignEntity) => void;
}

export function CampaignsTable({
  campaigns,
  isLoading,
  onSelectAnalytics,
}: CampaignsTableProps) {
  const router = useRouter();

  const columns = [
    {
      key: "campaign",
      header: "Campaign & Subject",
      cell: (campaign: EmailCampaignEntity) => (
        <AdminTableItem
          icon={Mail}
          title={campaign.name || "Untitled Campaign"}
          subtitle={campaign.subject || "No subject set"}
          onClick={() => onSelectAnalytics(campaign)}
          maxTitleWidth="max-w-[240px]"
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (campaign: EmailCampaignEntity) => {
        const s = (campaign.status || "").toUpperCase();
        return (
          <AdminStatusBadge
            status={campaign.status || "DRAFT"}
            variant={
              s === "SENT"
                ? "success"
                : s === "SCHEDULED"
                  ? "warning"
                  : s === "DRAFT"
                    ? "neutral"
                    : "info"
            }
            className="text-[10px]"
          />
        );
      },
    },
    {
      key: "audience",
      header: "Audience",
      cell: (campaign: EmailCampaignEntity) => (
        <AdminTableTag variant="indigo" className="text-[9px]">
          {campaign.audienceType || "All Users"}
        </AdminTableTag>
      ),
    },
    {
      key: "recipients",
      header: "Recipients",
      cell: (campaign: EmailCampaignEntity) => {
        const total = campaign.totalRecipients || campaign.metrics?.sent || 0;
        return (
          <AdminTableMetric
            value={total.toLocaleString()}
            unit="Sent"
            variant="default"
          />
        );
      },
    },
    {
      key: "openRate",
      header: "Open Rate",
      cell: (campaign: EmailCampaignEntity) => {
        const m = campaign.metrics;
        const rate = m?.openRate ? Number(m.openRate).toFixed(1) : "0.0";
        return (
          <AdminTableMetric
            icon={Eye}
            value={`${rate}%`}
            variant="indigo"
          />
        );
      },
    },
    {
      key: "clickRate",
      header: "Click Rate (CTOR)",
      cell: (campaign: EmailCampaignEntity) => {
        const m = campaign.metrics;
        const rate = m?.clickRate ? Number(m.clickRate).toFixed(1) : "0.0";
        return (
          <AdminTableMetric
            icon={MousePointerClick}
            value={`${rate}%`}
            variant="indigo"
          />
        );
      },
    },
    {
      key: "deliveryRate",
      header: "Deliverability",
      cell: (campaign: EmailCampaignEntity) => {
        const m = campaign.metrics;
        const rate = m?.deliveryRate ? Number(m.deliveryRate).toFixed(1) : "100.0";
        return (
          <AdminTableMetric
            value={`${rate}%`}
            variant="emerald"
          />
        );
      },
    },
    {
      key: "date",
      header: "Dispatched",
      cell: (campaign: EmailCampaignEntity) => (
        <AdminTableDate
          date={campaign.sentAt || campaign.scheduledAt || campaign.createdAt}
          time={
            campaign.sentAt
              ? safeFormat(campaign.sentAt, "hh:mm a", "")
              : campaign.scheduledAt
                ? safeFormat(campaign.scheduledAt, "hh:mm a", "")
                : null
          }
          icon={true}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      isFixedRight: true,
      cell: (campaign: EmailCampaignEntity) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelectAnalytics(campaign)}
            className="h-7 px-2 text-[11px] font-bold gap-1 rounded-[4px] border-border text-foreground hover:bg-muted cursor-pointer"
          >
            <BarChart2 className="h-3 w-3 text-indigo-500" />
            Analytics
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/email/campaigns/${campaign.id}`)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-[4px] cursor-pointer"
            title="Full Report"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={campaigns || []}
      loading={isLoading}
      keyExtractor={(c) => c.id}
      emptyIcon={Megaphone}
      emptyTitle="No email campaigns found"
      emptyDescription="Broadcast campaigns and scheduled newsletter dispatches will appear here in real-time."
      size="sm"
      pageSize={15}
      loadingRows={8}
      enableColumnToggle={true}
    />
  );
}
