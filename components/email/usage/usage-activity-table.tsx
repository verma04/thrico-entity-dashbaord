"use client";

import React, { useState } from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableDate,
  AdminTableText,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import { Mail, Copy, Check, ExternalLink, ShieldCheck, Eye, MousePointerClick, AlertOctagon } from "lucide-react";
import { EmailLog } from "@/graphql/actions/email";
import { safeFormat } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface UsageActivityTableProps {
  logs: EmailLog[];
  isLoading?: boolean;
}

export function UsageActivityTable({ logs, isLoading }: UsageActivityTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusVariant = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "sent" || s === "opened" || s === "clicked") return "success";
    if (s === "pending" || s === "queued" || s === "sending") return "warning";
    if (s === "bounced" || s === "failed" || s === "rejected" || s === "complained") return "destructive";
    return "neutral";
  };

  const columns = [
    {
      key: "recipient",
      header: "Recipient",
      cell: (log: EmailLog) => {
        const email = log.to || "Unknown Recipient";
        const initial = email.slice(0, 2).toUpperCase();

        return (
          <AdminTableItem
            shape="circle"
            fallbackText={initial}
            title={email}
            subtitle={log.senderAddress ? `via ${log.senderAddress}` : "Direct Dispatch"}
            maxTitleWidth="max-w-[240px]"
          />
        );
      },
    },
    {
      key: "subject",
      header: "Subject & Campaign",
      cell: (log: EmailLog) => (
        <AdminTableText
          icon={Mail}
          primary={log.subject || "No Subject"}
          secondary={log.sesMessageId ? `ID: ${log.sesMessageId.slice(0, 16)}…` : undefined}
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (log: EmailLog) => {
        const variant = getStatusVariant(log.status);
        return (
          <AdminStatusBadge
            status={log.status || "SENT"}
            variant={variant}
            className="capitalize text-[10px]"
          />
        );
      },
    },
    {
      key: "sender",
      header: "Sender Identity",
      cell: (log: EmailLog) => (
        <AdminTableTag variant="muted" className="font-mono text-[9px] lowercase">
          {log.senderAddress || "system@notifications"}
        </AdminTableTag>
      ),
    },
    {
      key: "sesMessageId",
      header: "SES Message ID",
      cell: (log: EmailLog) => {
        if (!log.sesMessageId) {
          return <span className="text-[11px] text-muted-foreground">—</span>;
        }
        const isCopied = copiedId === log.sesMessageId;
        const shortId = `${log.sesMessageId.slice(0, 12)}…${log.sesMessageId.slice(-6)}`;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => copyToClipboard(log.sesMessageId, "SES Message ID")}
                  className="group flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/40 hover:bg-muted border border-border/40 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  <span>{shortId}</span>
                  {isCopied ? (
                    <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground/50 group-hover:text-foreground shrink-0" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs font-mono">
                {log.sesMessageId} (Click to copy)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      key: "date",
      header: "Dispatched At",
      cell: (log: EmailLog) => (
        <AdminTableDate
          date={log.sentAt}
          time={log.sentAt ? safeFormat(log.sentAt, "hh:mm a", "") : null}
          icon={true}
        />
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={logs || []}
      loading={isLoading}
      keyExtractor={(log) => log.id || `${log.to}-${log.sentAt}`}
      emptyIcon={Mail}
      emptyTitle="No transmission logs found"
      emptyDescription="Outbound campaign broadcasts and transactional email events will appear here in real-time."
      size="sm"
      pageSize={15}
      loadingRows={8}
      enableColumnToggle={true}
    />
  );
}
