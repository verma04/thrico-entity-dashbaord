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

interface ExportShopifyOrdersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportShopifyOrdersModal({
  open,
  onOpenChange,
  orders,
  totalCount,
  matchingCount,
}: ExportShopifyOrdersModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = orders;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no Shopify orders to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "Shopify Order ID",
        getValue: (r: any) => r.shopifyOrderId || r.id || "",
      },
      {
        header: "Customer Name",
        getValue: (r: any) =>
          r.user
            ? `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim()
            : "",
      },
      {
        header: "Customer Email",
        getValue: (r: any) => r.user?.email || "",
      },
      {
        header: "Total Price",
        getValue: (r: any) => r.totalPrice || "",
      },
      {
        header: "Currency",
        getValue: (r: any) => r.currency || "USD",
      },
      {
        header: "Status",
        getValue: (r: any) => r.status || "PENDING",
      },
      {
        header: "Reward Points Earned",
        getValue: (r: any) => r.reward?.pointsEarned ?? 0,
      },
      {
        header: "Created At",
        getValue: (r: any) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `shopify-orders-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} order${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="Shopify orders"
      description="Export synchronized Shopify customer orders, purchase amounts, and gamified reward points as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportShopifyOrdersModal;
