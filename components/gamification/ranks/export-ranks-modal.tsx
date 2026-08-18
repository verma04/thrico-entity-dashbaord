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
import { Rank } from "@/graphql/actions";

interface ExportRanksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ranks: Rank[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportRanksModal({
  open,
  onOpenChange,
  ranks,
  totalCount,
  matchingCount,
}: ExportRanksModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = ranks;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no ranks to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Name", getValue: (r) => r.name || "" },
      { header: "Order / Tier", getValue: (r) => r.order ?? "" },
      { header: "Min Points", getValue: (r) => r.minPoints ?? 0 },
      { header: "Max Points", getValue: (r) => r.maxPoints ?? 0 },
      { header: "Color", getValue: (r) => r.color || "" },
      { header: "Icon", getValue: (r) => r.icon || "" },
      {
        header: "Push Notification",
        getValue: (r) =>
          r.allowPushNotification !== false ? "Enabled" : "Disabled",
      },
      {
        header: "Email Notification",
        getValue: (r) =>
          r.allowEmailNotification !== false ? "Enabled" : "Disabled",
      },
      {
        header: "Status",
        getValue: (r) => (r.isActive ? "Active" : "Inactive"),
      },
      {
        header: "Created At",
        getValue: (r) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Updated At",
        getValue: (r) =>
          safeFormat(r.updatedAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `ranks-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} rank${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="ranks"
      description="Export rank definitions, hierarchy levels, points thresholds, and notification settings as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportRanksModal;
