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

interface ExportShopifyProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportShopifyProductsModal({
  open,
  onOpenChange,
  products,
  totalCount,
  matchingCount,
}: ExportShopifyProductsModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = products;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no Shopify products to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "Shopify Product ID",
        getValue: (r: any) => r.shopifyProductId || r.id || "",
      },
      { header: "Title", getValue: (r: any) => r.title || "" },
      { header: "Status", getValue: (r: any) => r.status || "ACTIVE" },
      {
        header: "Created At",
        getValue: (r: any) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Updated At",
        getValue: (r: any) =>
          safeFormat(r.updatedAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `shopify-products-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} product${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="Shopify products"
      description="Export synchronized Shopify store catalog items, product IDs, and publication statuses as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportShopifyProductsModal;
