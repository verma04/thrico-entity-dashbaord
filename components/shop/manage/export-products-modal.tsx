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
import { useModuleStore } from "@/store/useModuleStore";

interface ExportProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportProductsModal({
  open,
  onOpenChange,
  products,
  totalCount,
  matchingCount,
}: ExportProductsModalProps) {
  const moduleName = useModuleStore((state) => state.shopModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = products;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: any) => r.title || "" },
      {
        header: "Price",
        getValue: (r: any) => `${r.currency || "₹"}${r.price || 0}`,
      },
      {
        header: "Category",
        getValue: (r: any) => r.category || "",
      },
      {
        header: "Stock Status",
        getValue: (r: any) => (r.isOutOfStock ? "Out of Stock" : "In Stock"),
      },
      {
        header: "Variants",
        getValue: (r: any) => r.variants?.length || r.numberOfVariants || 0,
      },
      { header: "Status", getValue: (r: any) => r.status || "DRAFT" },
      {
        header: "Views",
        getValue: (r: any) => r.numberOfViews ?? 0,
      },
      {
        header: "External Link",
        getValue: (r: any) => r.externalLink || "",
      },
      {
        header: "Created At",
        getValue: (r: any) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Description",
        getValue: (r: any) => r.description || "",
      },
    ]);

    const filename = `${moduleName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} ${moduleName.toLowerCase()} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName={moduleName.toLowerCase()}
      description={`Export ${moduleName.toLowerCase()} titles, prices, stock statuses, variants, and descriptions as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportProductsModal;
