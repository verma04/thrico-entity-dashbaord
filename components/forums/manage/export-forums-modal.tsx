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
import { discussionForm } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportForumsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forums: discussionForm[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportForumsModal({
  open,
  onOpenChange,
  forums,
  totalCount,
  matchingCount,
}: ExportForumsModalProps) {
  const moduleName = useModuleStore((state) => state.forumModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = forums;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: discussionForm) => r.title || "" },
      {
        header: "Category",
        getValue: (r: discussionForm) => r.category?.name || "",
      },
      {
        header: "Author",
        getValue: (r: discussionForm) =>
          r.user
            ? `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim()
            : "Anonymous",
      },
      { header: "Status", getValue: (r: discussionForm) => r.status || "" },
      {
        header: "Upvotes",
        getValue: (r: discussionForm) => r.upVotes ?? 0,
      },
      {
        header: "Downvotes",
        getValue: (r: discussionForm) => r.downVotes ?? 0,
      },
      {
        header: "Verified",
        getValue: (r: discussionForm) =>
          r.verification?.isVerified ? "Yes" : "No",
      },
      {
        header: "Created At",
        getValue: (r: discussionForm) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Content",
        getValue: (r: discussionForm) =>
          r.content?.replace(/<[^>]*>?/gm, "") || "",
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
      description={`Export ${moduleName.toLowerCase()} topics, authors, upvotes, downvotes, and status as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportForumsModal;
