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
import type { communityEntity } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

interface ExportCommunitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communities: communityEntity[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportCommunitiesModal({
  open,
  onOpenChange,
  communities,
  totalCount,
  matchingCount,
}: ExportCommunitiesModalProps) {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = communities;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: `There are no ${moduleName.toLowerCase()} to export.`,
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Title", getValue: (r: communityEntity) => r.title || "" },
      { header: "Tagline", getValue: (r: communityEntity) => r.tagline || "" },
      {
        header: "Privacy",
        getValue: (r: communityEntity) =>
          r.privacy || ((r as any).isPrivate ? "Private" : "Public"),
      },
      { header: "Status", getValue: (r: communityEntity) => r.status || "" },
      {
        header: "Members Count",
        getValue: (r: communityEntity) => r.numberOfUser ?? 0,
      },
      {
        header: "Posts Count",
        getValue: (r: communityEntity) => r.numberOfPost ?? 0,
      },
      {
        header: "Views Count",
        getValue: (r: communityEntity) => r.numberOfViews ?? 0,
      },
      {
        header: "Verified",
        getValue: (r: communityEntity) =>
          r.verification?.isVerified ? "Yes" : "No",
      },
      {
        header: "Created At",
        getValue: (r: communityEntity) =>
          safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Description",
        getValue: (r: communityEntity) => r.description || "",
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
      description={`Export ${moduleName.toLowerCase()} title, members, privacy, status, and activity as CSV.`}
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportCommunitiesModal;
