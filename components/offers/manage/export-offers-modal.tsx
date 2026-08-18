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
import { Offer } from "@/graphql/actions/offers";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportOffersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offers: Offer[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportOffersModal({
  open,
  onOpenChange,
  offers,
  totalCount,
  matchingCount,
}: ExportOffersModalProps) {
  const moduleName = useModuleStore((state) => state.offerModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = offers;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: Offer) => r.title || "" },
      {
        header: "Discount",
        getValue: (r: Offer) => r.discount || "",
      },
      {
        header: "Category",
        getValue: (r: Offer) => r.category?.name || "",
      },
      {
        header: "Company",
        getValue: (r: Offer) => r.company || "",
      },
      { header: "Status", getValue: (r: Offer) => r.status || "" },
      {
        header: "Claims",
        getValue: (r: Offer) => r.claimsCount ?? 0,
      },
      {
        header: "Views",
        getValue: (r: Offer) => r.viewsCount ?? 0,
      },
      {
        header: "Verified",
        getValue: (r: Offer) =>
          r.verification?.isVerified ? "Yes" : "No",
      },
      {
        header: "Validity Start",
        getValue: (r: Offer) =>
          safeFormat(r.validityStart, "yyyy-MM-dd", ""),
      },
      {
        header: "Validity End",
        getValue: (r: Offer) =>
          safeFormat(r.validityEnd, "yyyy-MM-dd", ""),
      },
      {
        header: "Description",
        getValue: (r: Offer) => r.description || "",
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
      description={`Export ${moduleName.toLowerCase()} discounts, categories, validity dates, and claim numbers as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportOffersModal;
