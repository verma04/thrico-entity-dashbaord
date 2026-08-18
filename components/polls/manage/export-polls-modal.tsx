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
import { poll } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportPollsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polls: poll[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportPollsModal({
  open,
  onOpenChange,
  polls,
  totalCount,
  matchingCount,
}: ExportPollsModalProps) {
  const moduleName = useModuleStore((state) => state.pollModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = polls;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: poll) => r.title || "" },
      { header: "Question", getValue: (r: poll) => r.question || "" },
      {
        header: "Options",
        getValue: (r: poll) =>
          (r.options || []).map((o: any) => o.text || o.title || o).join("; "),
      },
      {
        header: "Total Votes",
        getValue: (r: poll) => r.totalVotes ?? 0,
      },
      { header: "Status", getValue: (r: poll) => r.status || "" },
      {
        header: "Author",
        getValue: (r: poll) =>
          r.user
            ? `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim()
            : "Entity Admin",
      },
      {
        header: "Created At",
        getValue: (r: poll) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
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
      description={`Export ${moduleName.toLowerCase()} questions, options, total votes, and authors as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportPollsModal;
