"use client";

import React from "react";
import {
  ExportCsvModal,
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportMentorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentors: any[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportMentorsModal({
  open,
  onOpenChange,
  mentors,
  totalCount,
  matchingCount,
}: ExportMentorsModalProps) {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = mentors;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${singularName.toLowerCase()}s to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Name", getValue: (r: any) => r.name || "" },
      {
        header: "Email",
        getValue: (r: any) => r.mentorUser?.user?.email || "",
      },
      {
        header: "Headline / Title",
        getValue: (r: any) => r.title || r.intro || "",
      },
      {
        header: "Category",
        getValue: (r: any) => r.categoryName || r.category?.title || "",
      },
      {
        header: "Status",
        getValue: (r: any) =>
          r.isApproved
            ? "APPROVED"
            : r.isRequested
              ? "PENDING"
              : "REJECTED",
      },
      {
        header: "Top Mentor",
        getValue: (r: any) => (r.isTopMentor ? "Yes" : "No"),
      },
      {
        header: "Skills",
        getValue: (r: any) =>
          (r.expertise || r.skills || []).join("; "),
      },
      {
        header: "Bio",
        getValue: (r: any) => r.about || r.intro || "",
      },
    ]);

    const filename = `${singularName.toLowerCase()}s-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} ${singularName.toLowerCase()}${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName={`${singularName.toLowerCase()}s`}
      description={`Export ${singularName.toLowerCase()}s directory, contact emails, categories, skills, and statuses as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportMentorsModal;
