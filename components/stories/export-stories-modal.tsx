"use client";

import React, { useState } from "react";
import {
  ExportCsvModal,
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { Story, useExportStoriesData } from "@/graphql/actions/stories";
import { buildCsv, downloadCsv, CsvColumn } from "@/lib/export-csv";
import { toast } from "sonner";
import { getMediaUrl } from "./story-card";

interface ExportStoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: Story[];
  selectedStories?: Story[];
  totalCount?: number;
  statusFilter?: string;
}

const STORY_CSV_COLUMNS: CsvColumn<Story>[] = [
  { header: "Story ID", getValue: (s) => s.id },
  { header: "Entity ID", getValue: (s) => s.entityId },
  {
    header: "Author Name",
    getValue: (s) =>
      [s.user?.firstName, s.user?.lastName].filter(Boolean).join(" ") || "Unknown",
  },
  { header: "Author Email", getValue: (s) => s.user?.email || "" },
  { header: "Author Headline", getValue: (s) => s.user?.headline || "" },
  { header: "Caption", getValue: (s) => s.caption || "" },
  {
    header: "Status",
    getValue: (s) =>
      s.isActive && new Date(s.expiresAt).getTime() > Date.now()
        ? "LIVE"
        : "EXPIRED",
  },
  { header: "Media URL", getValue: (s) => getMediaUrl(s.image) },
  { header: "Created At", getValue: (s) => s.createdAt },
  { header: "Expires At", getValue: (s) => s.expiresAt },
];

export function ExportStoriesModal({
  open,
  onOpenChange,
  stories,
  selectedStories = [],
  totalCount,
  statusFilter = "ACTIVE",
}: ExportStoriesModalProps) {
  const [loading, setLoading] = useState(false);
  const [exportStoriesMutation] = useExportStoriesData();

  const handleExport = async (scope: ExportCsvScope, format: ExportCsvFormat) => {
    setLoading(true);
    try {
      if (scope === "selected") {
        if (selectedStories.length === 0) {
          toast.error("No stories selected to export");
          setLoading(false);
          return;
        }
        const csv = buildCsv(selectedStories, STORY_CSV_COLUMNS);
        const filename = `stories-selected-${new Date().toISOString().slice(0, 10)}`;
        downloadCsv(csv, filename, format);
        toast.success(`Exported ${selectedStories.length} stories successfully`);
        onOpenChange(false);
        return;
      }

      // For "current" or "all", execute GraphQL mutation ExportStoriesData
      const statusParam =
        statusFilter === "ACTIVE"
          ? "ACTIVE"
          : statusFilter === "PAST"
          ? "PAST"
          : undefined;

      const res = await exportStoriesMutation({
        variables: {
          input: {
            module: "STORIES",
            status: statusParam,
            format: format,
          },
        },
      });

      const exportResult = res.data?.exportData;
      if (exportResult?.fileUrl) {
        window.open(exportResult.fileUrl, "_blank");
      }
      toast.success(
        exportResult?.message ||
          "Export initiated. CSV will be generated and sent."
      );
      onOpenChange(false);
    } catch (err: any) {
      console.warn("Backend export mutation error, using client fallback:", err);
      if (stories.length > 0) {
        const csv = buildCsv(stories, STORY_CSV_COLUMNS);
        const filename = `stories-export-${new Date().toISOString().slice(0, 10)}`;
        downloadCsv(csv, filename, format);
        toast.success(`Exported ${stories.length} stories successfully`);
        onOpenChange(false);
      } else {
        toast.error(err.message || "Failed to export stories");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="stories"
      description="Export active and historical narrative stories into a spreadsheet format for auditing and analysis."
      totalCount={totalCount ?? stories.length}
      selectedCount={selectedStories.length > 0 ? selectedStories.length : undefined}
      loading={loading}
      onExport={handleExport}
      onExportAll={(format) => handleExport("all", format)}
    />
  );
}
