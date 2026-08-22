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
import { ManualRewardItem } from "./manual-reward-card";

interface ExportManualRewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewards: ManualRewardItem[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportManualRewardsModal({
  open,
  onOpenChange,
  rewards,
  totalCount,
  matchingCount,
}: ExportManualRewardsModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = rewards;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no manual vouchers to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r) => r.title || "" },
      { header: "Description", getValue: (r) => r.description || "" },
      { header: "Architecture", getValue: (r) => r.couponType || "ONE_TO_ONE" },
      {
        header: "Code / Prefix",
        getValue: (r) => r.couponCode || r.codePrefix || "",
      },
      { header: "Total Inventory", getValue: (r) => r.totalInventory ?? 0 },
      { header: "Redeemed Count", getValue: (r) => r.redeemedCount ?? 0 },
      {
        header: "Status",
        getValue: (r) => (r.isActive ? "Active" : "Draft"),
      },
      {
        header: "Validity Days",
        getValue: (r) => r.validityDays ?? "",
      },
      {
        header: "Created At",
        getValue: (r) => safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `manual-vouchers-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} manual voucher${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="manual vouchers"
      description="Export master internal vouchers, serial pools, and allocation counts as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}
