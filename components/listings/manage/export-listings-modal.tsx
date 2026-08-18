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
import { MarketPlaceListing } from "@/graphql/actions/listing";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportListingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: MarketPlaceListing[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportListingsModal({
  open,
  onOpenChange,
  listings,
  totalCount,
  matchingCount,
}: ExportListingsModalProps) {
  const moduleName = useModuleStore((state) => state.listingModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = listings;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: MarketPlaceListing) => r.title || "" },
      {
        header: "Price",
        getValue: (r: MarketPlaceListing) => `${r.currency || "₹"}${r.price || 0}`,
      },
      {
        header: "Condition",
        getValue: (r: MarketPlaceListing) => r.condition || "",
      },
      {
        header: "Category",
        getValue: (r: MarketPlaceListing) => r.category || "",
      },
      {
        header: "Location",
        getValue: (r: MarketPlaceListing) =>
          typeof r.location === "string"
            ? r.location
            : r.location?.name || r.location?.address || "",
      },
      { header: "Status", getValue: (r: MarketPlaceListing) => r.status || "" },
      {
        header: "Views",
        getValue: (r: MarketPlaceListing) => r.numberOfViews ?? 0,
      },
      {
        header: "Verified",
        getValue: (r: MarketPlaceListing) =>
          r.verification?.isVerified ? "Yes" : "No",
      },
      {
        header: "Created At",
        getValue: (r: MarketPlaceListing) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Description",
        getValue: (r: MarketPlaceListing) => r.description || "",
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
      description={`Export ${moduleName.toLowerCase()} title, price, category, status, and details as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportListingsModal;
