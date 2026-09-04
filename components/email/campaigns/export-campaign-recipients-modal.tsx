"use client";

import React from "react";
import {
  ExportCsvModal,
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { safeFormat } from "@/lib/date-utils";
import {
  useGetEmailCampaignRecipients,
  EmailCampaignRecipient,
  EmailCampaignEntity,
} from "@/graphql/actions/email/campaign-actions";

export interface ExportCampaignRecipientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaign?: EmailCampaignEntity | null;
  recipients?: EmailCampaignRecipient[];
  totalCount?: number;
  matchingCount?: number;
  selectedCount?: number;
  statusFilter?: string;
  search?: string;
  onSuccess?: () => void;
}

export function ExportCampaignRecipientsModal({
  open,
  onOpenChange,
  campaignId,
  campaign,
  recipients = [],
  totalCount,
  matchingCount,
  selectedCount,
  statusFilter,
  search,
  onSuccess,
}: ExportCampaignRecipientsModalProps) {
  const { data, loading } = useGetEmailCampaignRecipients(
    campaignId,
    {
      limit: 1000,
      offset: 0,
      status:
        statusFilter && statusFilter !== "ALL"
          ? statusFilter.toLowerCase()
          : undefined,
      search: search?.trim() || undefined,
    }
  );

  const availableRecipients: EmailCampaignRecipient[] =
    recipients.length > 0
      ? recipients
      : data?.getEmailCampaignRecipients?.items || [];

  const effectiveTotalCount =
    totalCount ??
    data?.getEmailCampaignRecipients?.total ??
    campaign?.totalRecipients ??
    availableRecipients.length;

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = availableRecipients;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no campaign recipient records to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "Recipient Email",
        getValue: (r: EmailCampaignRecipient) => r.email || "",
      },
      {
        header: "Delivery Status",
        getValue: (r: EmailCampaignRecipient) => r.status || "SENT",
      },
      {
        header: "Opens",
        getValue: (r: EmailCampaignRecipient) => r.openCount ?? 0,
      },
      {
        header: "Clicks",
        getValue: (r: EmailCampaignRecipient) => r.clickCount ?? 0,
      },
      {
        header: "First Opened At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.firstOpenedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "Last Opened At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.lastOpenedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "First Clicked At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.firstClickedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "Last Clicked At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.lastClickedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "Bounced At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.bouncedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "Bounce Type",
        getValue: (r: EmailCampaignRecipient) => r.bounceType || "",
      },
      {
        header: "Complained At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.complainedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "Unsubscribed At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.unsubscribedAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "Dispatched At",
        getValue: (r: EmailCampaignRecipient) =>
          safeFormat(r.createdAt, "yyyy-MM-dd HH:mm:ss", ""),
      },
      {
        header: "User ID",
        getValue: (r: EmailCampaignRecipient) => r.userId || "",
      },
      {
        header: "SES Message ID",
        getValue: (r: EmailCampaignRecipient) => r.sesMessageId || "",
      },
    ]);

    const sanitizedName = (campaign?.name || "campaign")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const scopeLabel =
      scope === "matching"
        ? `${sanitizedName}-recipients-filtered`
        : `${sanitizedName}-recipients`;

    const filename = `${scopeLabel}-${new Date().toISOString().slice(0, 10)}`;

    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} recipient log${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });

    onSuccess?.();
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="recipients"
      description={`Export transmission telemetry, open/click counts, delivery status, and bounce records for "${campaign?.name || "this campaign"}".`}
      totalCount={effectiveTotalCount}
      matchingCount={matchingCount}
      selectedCount={selectedCount}
      loading={loading}
      onExport={handleExport}
    />
  );
}

// Re-export common types for convenience and backwards compatibility
export {
  ExportCsvModal,
  type ExportCsvScope as ExportScope,
  type ExportCsvFormat as ExportFormat,
};

export default ExportCampaignRecipientsModal;
