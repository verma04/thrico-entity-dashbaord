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
import { PointRule } from "@/graphql/actions";

interface ExportPointRulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rules: PointRule[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportPointRulesModal({
  open,
  onOpenChange,
  rules,
  totalCount,
  matchingCount,
}: ExportPointRulesModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = rules;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no point rules to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Action", getValue: (r) => r.action || "" },
      { header: "Module", getValue: (r) => r.module || "" },
      { header: "Source", getValue: (r) => r.source || "MODULE" },
      { header: "Trigger", getValue: (r) => r.trigger || "" },
      { header: "Points", getValue: (r) => r.points ?? 0 },
      { header: "Daily Cap", getValue: (r) => r.dailyCap ?? "" },
      { header: "Weekly Cap", getValue: (r) => r.weeklyCap ?? "" },
      { header: "Monthly Cap", getValue: (r) => r.monthlyCap ?? "" },
      { header: "Status", getValue: (r) => (r.isActive ? "Active" : "Inactive") },
      { header: "Description", getValue: (r) => r.description || "" },
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

    const filename = `point-rules-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} rule${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="point rules"
      description="Export point scoring rules, trigger actions, caps, and activation statuses as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportPointRulesModal;
