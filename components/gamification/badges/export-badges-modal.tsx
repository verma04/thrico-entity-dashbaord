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
import { Badge } from "@/graphql/actions";

interface ExportBadgesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badges: Badge[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportBadgesModal({
  open,
  onOpenChange,
  badges,
  totalCount,
  matchingCount,
}: ExportBadgesModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = badges;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no badges to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Name", getValue: (b) => b.name || "" },
      { header: "Description", getValue: (b) => b.description || "" },
      { header: "Type", getValue: (b) => b.type || "" },
      { header: "Module", getValue: (b) => b.module || "" },
      { header: "Source", getValue: (b) => b.source || "MODULE" },
      { header: "Action", getValue: (b) => b.action || "" },
      { header: "Target Value", getValue: (b) => b.targetValue ?? "" },
      { header: "Count", getValue: (b) => b.count ?? "" },
      { header: "Points Required", getValue: (b) => b.points ?? "" },
      { header: "Icon", getValue: (b) => b.icon || "" },
      {
        header: "Push Notification",
        getValue: (b) =>
          b.allowPushNotification !== false ? "Enabled" : "Disabled",
      },
      {
        header: "Email Notification",
        getValue: (b) =>
          b.allowEmailNotification !== false ? "Enabled" : "Disabled",
      },
      {
        header: "Status",
        getValue: (b) => (b.isActive ? "Active" : "Inactive"),
      },
      {
        header: "Created At",
        getValue: (b) =>
          safeFormat(b.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Updated At",
        getValue: (b) =>
          safeFormat(b.updatedAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `badges-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} badge${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="badges"
      description="Export recognition badges, requirement criteria, notification settings, and statuses as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportBadgesModal;
