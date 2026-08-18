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
import { Job } from "@/graphql/actions/jobs";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportJobsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: Job[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportJobsModal({
  open,
  onOpenChange,
  jobs,
  totalCount,
  matchingCount,
}: ExportJobsModalProps) {
  const moduleName = useModuleStore((state) => state.jobModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = jobs;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: Job) => r.title || "" },
      { header: "Company", getValue: (r: Job) => r.company?.name || "" },
      { header: "Job Type", getValue: (r: Job) => r.jobType || "" },
      { header: "Workplace Type", getValue: (r: Job) => r.workplaceType || "" },
      { header: "Experience Level", getValue: (r: Job) => r.experienceLevel || "" },
      { header: "Salary", getValue: (r: Job) => r.salary || "" },
      {
        header: "Location",
        getValue: (r: Job) =>
          typeof r.location === "string"
            ? r.location
            : r.location?.name || r.location?.address || "",
      },
      { header: "Status", getValue: (r: Job) => r.status || "" },
      {
        header: "Applicants Count",
        getValue: (r: Job) => r.numberOfApplicant ?? 0,
      },
      {
        header: "Views Count",
        getValue: (r: Job) => r.numberOfViews ?? 0,
      },
      {
        header: "Verified",
        getValue: (r: Job) =>
          r.verification?.isVerified ? "Yes" : "No",
      },
      {
        header: "Application Deadline",
        getValue: (r: Job) =>
          safeFormat(r.applicationDeadline, "yyyy-MM-dd", ""),
      },
      {
        header: "Posted At",
        getValue: (r: Job) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Description",
        getValue: (r: Job) => r.description || "",
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
      description={`Export ${moduleName.toLowerCase()} title, company, job types, salaries, applicants, and statuses as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportJobsModal;
