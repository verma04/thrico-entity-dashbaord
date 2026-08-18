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

interface ExportShopifyUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportShopifyUsersModal({
  open,
  onOpenChange,
  customers,
  totalCount,
  matchingCount,
}: ExportShopifyUsersModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = customers;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no Shopify customers to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "Shopify Customer ID",
        getValue: (r: any) => r.shopifyCustomerId || r.id || "",
      },
      { header: "Email", getValue: (r: any) => r.email || "" },
      { header: "Status", getValue: (r: any) => r.status || "ACTIVE" },
      {
        header: "Customer Since",
        getValue: (r: any) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Last Synced",
        getValue: (r: any) =>
          safeFormat(r.lastSyncedAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `shopify-customers-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} customer${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="Shopify customers"
      description="Export synchronized Shopify customer accounts and sync timestamps as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportShopifyUsersModal;
