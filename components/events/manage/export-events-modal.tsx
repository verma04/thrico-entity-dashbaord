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
import { Event } from "@/graphql/actions/events";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportEventsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportEventsModal({
  open,
  onOpenChange,
  events,
  totalCount,
  matchingCount,
}: ExportEventsModalProps) {
  const moduleName = useModuleStore((state) => state.eventModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = events;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: Event) => r.title || "" },
      { header: "Type", getValue: (r: Event) => r.type || "" },
      { header: "Status", getValue: (r: Event) => r.status || "" },
      {
        header: "Start Date",
        getValue: (r: Event) => safeFormat(r.startDate, "yyyy-MM-dd", ""),
      },
      {
        header: "End Date",
        getValue: (r: Event) => safeFormat(r.endDate, "yyyy-MM-dd", ""),
      },
      { header: "Start Time", getValue: (r: Event) => r.startTime || "" },
      {
        header: "Location",
        getValue: (r: Event) =>
          r.location?.name || r.location?.address || "",
      },
      {
        header: "Attendees",
        getValue: (r: Event) => r.numberOfAttendees ?? 0,
      },
      {
        header: "Views",
        getValue: (r: Event) => r.numberOfViews ?? 0,
      },
      {
        header: "Verified",
        getValue: (r: Event) =>
          r.verification?.isVerified ? "Yes" : "No",
      },
      {
        header: "Created At",
        getValue: (r: Event) => safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      { header: "Description", getValue: (r: Event) => r.description || "" },
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
      description={`Export ${moduleName.toLowerCase()} schedule, attendees, types, dates, and locations as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}
