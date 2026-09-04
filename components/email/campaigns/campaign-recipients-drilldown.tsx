"use client";

import React, { useState, useMemo } from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableDate,
  AdminTableMetric,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  useGetEmailCampaignRecipients,
  EmailCampaignRecipient,
} from "@/graphql/actions/email/campaign-actions";
import { Mail, Search, Eye, MousePointerClick, AlertTriangle, UserCheck } from "lucide-react";
import { safeFormat } from "@/lib/date-utils";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CampaignRecipientsDrilldownProps {
  campaignId: string;
}

export function CampaignRecipientsDrilldown({
  campaignId,
}: CampaignRecipientsDrilldownProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data, loading } = useGetEmailCampaignRecipients(campaignId, {
    limit: 1000,
    offset: 0,
    status: statusFilter === "ALL" ? undefined : statusFilter.toLowerCase(),
  });

  const rawRecipients: EmailCampaignRecipient[] =
    data?.getEmailCampaignRecipients?.items || [];

  const filteredRecipients = useMemo(() => {
    if (!search.trim()) return rawRecipients;
    const q = search.toLowerCase().trim();
    return rawRecipients.filter(
      (r) =>
        (r.email || "").toLowerCase().includes(q) ||
        (r.sesMessageId || "").toLowerCase().includes(q)
    );
  }, [rawRecipients, search]);

  const statuses = [
    { key: "ALL", label: "All" },
    { key: "opened", label: "Opened" },
    { key: "clicked", label: "Clicked" },
    { key: "delivered", label: "Delivered" },
    { key: "bounced", label: "Bounced" },
    { key: "complained", label: "Complained" },
  ];

  const columns = [
    {
      key: "recipient",
      header: "Recipient Email",
      cell: (r: EmailCampaignRecipient) => {
        const initial = (r.email || "??").slice(0, 2).toUpperCase();
        return (
          <AdminTableItem
            shape="circle"
            fallbackText={initial}
            title={r.email}
            subtitle={r.userId ? `User: ${r.userId.slice(0, 8)}` : "Target Contact"}
            maxTitleWidth="max-w-[200px]"
          />
        );
      },
    },
    {
      key: "status",
      header: "Delivery Status",
      cell: (r: EmailCampaignRecipient) => {
        const s = (r.status || "").toLowerCase();
        const variant =
          s === "opened" || s === "clicked" || s === "delivered" || s === "sent"
            ? "success"
            : s === "bounced" || s === "complained"
              ? "destructive"
              : "warning";

        return (
          <AdminStatusBadge
            status={r.status || "SENT"}
            variant={variant}
            className="capitalize text-[10px]"
          />
        );
      },
    },
    {
      key: "opens",
      header: "Opens",
      cell: (r: EmailCampaignRecipient) => (
        <AdminTableMetric
          icon={Eye}
          value={r.openCount || 0}
          variant={r.openCount > 0 ? "indigo" : "default"}
        />
      ),
    },
    {
      key: "clicks",
      header: "Clicks",
      cell: (r: EmailCampaignRecipient) => (
        <AdminTableMetric
          icon={MousePointerClick}
          value={r.clickCount || 0}
          variant={r.clickCount > 0 ? "indigo" : "default"}
        />
      ),
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      cell: (r: EmailCampaignRecipient) => {
        const activityDate =
          r.lastClickedAt ||
          r.firstClickedAt ||
          r.lastOpenedAt ||
          r.firstOpenedAt ||
          r.bouncedAt ||
          r.createdAt;

        return (
          <AdminTableDate
            date={activityDate}
            time={activityDate ? safeFormat(activityDate, "hh:mm a", "") : null}
            icon={true}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      {/* Sub-bar filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {statuses.map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setStatusFilter(st.key)}
              className={cn(
                "px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-all cursor-pointer",
                statusFilter === st.key
                  ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipients…"
            className="h-8 pl-8 text-xs rounded-[4px] border-border/60 bg-card"
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filteredRecipients}
        loading={loading}
        keyExtractor={(r) => r.id || r.email}
        emptyIcon={UserCheck}
        emptyTitle="No recipients found"
        emptyDescription="No recipient activity matches the selected filter criteria."
        size="sm"
        pageSize={10}
        loadingRows={6}
      />
    </div>
  );
}
