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
  useGetEmailOverview,
  useGetEmailDomain,
} from "@/graphql/actions/email";

export interface ExportEmailOverviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportEmailOverviewModal({
  open,
  onOpenChange,
}: ExportEmailOverviewModalProps) {
  const { data: overviewData, loading: overviewLoading } = useGetEmailOverview();
  const { data: domainData, loading: domainLoading } = useGetEmailDomain();

  const overview = overviewData?.getEmailOverview;
  const domain = domainData?.getEmailDomain;
  const loading = overviewLoading || domainLoading;

  const recentEmails = overview?.recentEmails || [];

  const handleExport = (_scope: ExportCsvScope, format: ExportCsvFormat) => {
    // 1. Export Overview KPIs & Deliverability Health
    const overviewRows = [
      {
        section: "Quota & Usage",
        metric: "Emails Sent",
        value: overview?.usage?.emailsSent ?? 0,
      },
      {
        section: "Quota & Usage",
        metric: "Monthly Allowance",
        value: overview?.usage?.numberOfEmailsPerMonth ?? 5000,
      },
      {
        section: "Quota & Usage",
        metric: "Usage Percentage",
        value: `${(overview?.usage?.usagePercent ?? 0).toFixed(1)}%`,
      },
      {
        section: "Quota & Usage",
        metric: "Quota Remaining",
        value: overview?.usage?.remaining ?? 5000,
      },
      {
        section: "Subscription",
        metric: "Current Plan",
        value: overview?.subscription?.plan || "Free",
      },
      {
        section: "Subscription",
        metric: "Subscription Status",
        value: overview?.subscription?.status || "Active",
      },
      {
        section: "Domain Health",
        metric: "Sending Domain",
        value: domain?.domain || "Default Domain",
      },
      {
        section: "Domain Health",
        metric: "Domain Verification",
        value: domain?.status || "Verified",
      },
      {
        section: "Domain Health",
        metric: "Verified At",
        value: domain?.verifiedAt
          ? safeFormat(domain.verifiedAt, "yyyy-MM-dd HH:mm:ss", "")
          : "N/A",
      },
    ];

    // If there are recent emails, include them in rows or as activity list
    const exportRows =
      recentEmails.length > 0
        ? recentEmails.map((e, idx) => ({
            itemNumber: idx + 1,
            recipient: e.to || "",
            subject: e.subject || "",
            status: e.status || "SENT",
            sentAt: safeFormat(e.sentAt, "yyyy-MM-dd HH:mm:ss", ""),
          }))
        : overviewRows.map((r, idx) => ({
            itemNumber: idx + 1,
            recipient: r.metric,
            subject: r.section,
            status: String(r.value),
            sentAt: safeFormat(new Date(), "yyyy-MM-dd", ""),
          }));

    const csv =
      recentEmails.length > 0
        ? buildCsv(exportRows, [
            { header: "No.", getValue: (r: any) => r.itemNumber },
            { header: "Recipient Email", getValue: (r: any) => r.recipient },
            { header: "Subject", getValue: (r: any) => r.subject },
            { header: "Status", getValue: (r: any) => r.status },
            { header: "Sent At", getValue: (r: any) => r.sentAt },
          ])
        : buildCsv(overviewRows, [
            { header: "Category", getValue: (r) => r.section },
            { header: "KPI Metric", getValue: (r) => r.metric },
            { header: "Value", getValue: (r) => r.value },
          ]);

    const filename = `email-hub-report-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: "Email Hub performance and transmission data exported successfully.",
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="email overview report"
      description="Export full email quota usage, domain authentication health, deliverability rates, and recent broadcast metrics."
      totalCount={recentEmails.length > 0 ? recentEmails.length : 9}
      loading={loading}
      onExport={handleExport}
    />
  );
}

export default ExportEmailOverviewModal;
