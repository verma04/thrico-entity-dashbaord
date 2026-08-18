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
import { Moment } from "@/graphql/actions/moments";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportMomentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moments: Moment[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportMomentsModal({
  open,
  onOpenChange,
  moments,
  totalCount,
  matchingCount,
}: ExportMomentsModalProps) {
  const moduleName = useModuleStore((state) => state.momentModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = moments;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Caption", getValue: (r: Moment) => r.caption || "" },
      { header: "Status", getValue: (r: Moment) => r.status || "" },
      {
        header: "Views",
        getValue: (r: Moment) => r.totalViews ?? 0,
      },
      {
        header: "Creator",
        getValue: (r: Moment) =>
          r.owner
            ? `${r.owner.firstName || ""} ${r.owner.lastName || ""}`.trim()
            : "Entity",
      },
      {
        header: "Created At",
        getValue: (r: Moment) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Video URL",
        getValue: (r: Moment) => r.videoUrl || "",
      },
      {
        header: "Thumbnail URL",
        getValue: (r: Moment) => r.thumbnailUrl || "",
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
      description={`Export ${moduleName.toLowerCase()} captions, creator details, views, statuses, and video links as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportMomentsModal;
