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

interface ExportAlbumsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albums: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportAlbumsModal({
  open,
  onOpenChange,
  albums,
  totalCount,
  matchingCount,
}: ExportAlbumsModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = albums;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no albums to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Album Title", getValue: (a) => a.title || "" },
      { header: "Description", getValue: (a) => a.description || "" },
      {
        header: "Images Count",
        getValue: (a) =>
          a.imageCount ?? a.imagesCount ?? a.images?.length ?? 0,
      },
      { header: "Featured", getValue: (a) => (a.isFeatured ? "Yes" : "No") },
      { header: "Display Order", getValue: (a) => a.order ?? "" },
      {
        header: "Created At",
        getValue: (a) =>
          safeFormat(a.createdAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `media-albums-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} album${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="media albums"
      description="Export photo albums, total photography count, display ordering, and featured status as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportAlbumsModal;
