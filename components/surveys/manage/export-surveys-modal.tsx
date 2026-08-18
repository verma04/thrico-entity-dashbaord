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
import { Survey } from "@/graphql/surveys/survey-queries";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportSurveysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveys: Survey[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportSurveysModal({
  open,
  onOpenChange,
  surveys,
  totalCount,
  matchingCount,
}: ExportSurveysModalProps) {
  const moduleName = useModuleStore((state) => state.surveyModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = surveys;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: Survey) => r.title || "" },
      { header: "Description", getValue: (r: Survey) => r.description || "" },
      { header: "Status", getValue: (r: Survey) => r.status || "" },
      {
        header: "Start Date",
        getValue: (r: Survey) =>
          safeFormat(r.startDate, "yyyy-MM-dd", ""),
      },
      {
        header: "End Date",
        getValue: (r: Survey) =>
          safeFormat(r.endDate, "yyyy-MM-dd", ""),
      },
      {
        header: "Created At",
        getValue: (r: Survey) =>
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
      description={`Export ${moduleName.toLowerCase()} forms, schedules, and publication statuses as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportSurveysModal;
