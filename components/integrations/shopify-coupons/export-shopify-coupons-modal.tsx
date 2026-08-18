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

interface ExportShopifyCouponsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupons: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportShopifyCouponsModal({
  open,
  onOpenChange,
  coupons,
  totalCount,
  matchingCount,
}: ExportShopifyCouponsModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = coupons;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no Shopify coupons to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "Coupon Title",
        getValue: (r: any) => r.title || "",
      },
      {
        header: "Discount Code",
        getValue: (r: any) =>
          r.code || (r.codes ? r.codes.join(", ") : r.isAutomatic ? "AUTOMATIC" : ""),
      },
      {
        header: "Discount Type",
        getValue: (r: any) => r.discountType || "",
      },
      {
        header: "Value",
        getValue: (r: any) => (r.value != null ? `${r.value}` : ""),
      },
      {
        header: "Status",
        getValue: (r: any) => r.status || "ACTIVE",
      },
      {
        header: "Times Used",
        getValue: (r: any) => r.timesUsed ?? 0,
      },
      {
        header: "Usage Limit",
        getValue: (r: any) => r.usageLimit ?? "Unlimited",
      },
      {
        header: "Starts At",
        getValue: (r: any) =>
          safeFormat(r.startsAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Expires At",
        getValue: (r: any) =>
          safeFormat(r.endsAt, "yyyy-MM-dd", "No Expiry"),
      },
    ]);

    const filename = `shopify-coupons-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} coupon${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="Shopify coupons"
      description="Export synchronized Shopify store coupons, discount codes, and promotion usage logs as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportShopifyCouponsModal;
