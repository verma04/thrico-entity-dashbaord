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

interface ExportCouponsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewards: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportCouponsModal({
  open,
  onOpenChange,
  rewards,
  totalCount,
  matchingCount,
}: ExportCouponsModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = rewards;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no rewards to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r) => r.title || "" },
      { header: "Description", getValue: (r) => r.description || "" },
      {
        header: "Mechanism",
        getValue: (r) =>
          Array.isArray(r.rewardMechanism)
            ? r.rewardMechanism.join(", ")
            : r.rewardMechanism || "COUPON",
      },
      { header: "Point Cost (TC)", getValue: (r) => r.tcCost ?? 0 },
      { header: "Discount Type", getValue: (r) => r.discountType || "" },
      { header: "Discount Value", getValue: (r) => r.discountValue || "" },
      {
        header: "Inventory Required",
        getValue: (r) => (r.inventoryRequired ? "Yes" : "No"),
      },
      { header: "Inventory Stock", getValue: (r) => r.inventoryCount ?? "Unlimited" },
      { header: "Redeemed Count", getValue: (r) => r.redeemedCount ?? 0 },
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
        header: "Expiry Date",
        getValue: (r) =>
          safeFormat(r.expiryDate, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `rewards-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} reward${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="rewards"
      description="Export master reward offers, redemption point costs, stock levels, and active statuses as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportCouponsModal;
