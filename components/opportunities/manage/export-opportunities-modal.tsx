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
import { AdminOpportunity } from "@/graphql/actions/opportunities";

interface ExportOpportunitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunities: AdminOpportunity[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportOpportunitiesModal({
  open,
  onOpenChange,
  opportunities,
  totalCount,
  matchingCount,
}: ExportOpportunitiesModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = opportunities;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no opportunities to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: AdminOpportunity) => r.title || "" },
      {
        header: "Description",
        getValue: (r: AdminOpportunity) => r.description || "",
      },
      {
        header: "Category",
        getValue: (r: AdminOpportunity) =>
          r.category?.replace(/_/g, " ") || "",
      },
      { header: "Status", getValue: (r: AdminOpportunity) => r.status || "" },
      {
        header: "Location",
        getValue: (r: AdminOpportunity) =>
          typeof r.location === "object" && r.location
            ? Object.values(r.location).filter((v) => typeof v === "string").join(", ")
            : String(r.location || ""),
      },
      {
        header: "Budget",
        getValue: (r: AdminOpportunity) => r.budgetRange || "",
      },
      {
        header: "Timeline",
        getValue: (r: AdminOpportunity) => r.timeline || "",
      },
      {
        header: "Views",
        getValue: (r: AdminOpportunity) => r.viewsCount ?? 0,
      },
      {
        header: "Interested",
        getValue: (r: AdminOpportunity) => r.interestedCount ?? 0,
      },
      {
        header: "Created At",
        getValue: (r: AdminOpportunity) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `opportunities-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} opportunit${rows.length !== 1 ? "ies" : "y"} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="opportunities"
      description="Export career and collaboration opportunities, category breakdown, engagement counts, and dates as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportOpportunitiesModal;
