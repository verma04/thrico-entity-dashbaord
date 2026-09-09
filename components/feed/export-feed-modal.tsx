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
import { useExportFeed } from "@/graphql/actions/export";
import { Mail } from "lucide-react";
import type { FeedProps } from "./types";

export interface FeedFilters {
  status?: string;
  search?: string;
  targetId?: string;
  source?: string;
}

export interface ExportFeedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeds?: FeedProps[];
  totalCount: number;
  matchingCount?: number;
  selectedCount?: number;
  filters?: FeedFilters;
  onSuccess?: () => void;
}

export function ExportFeedModal({
  open,
  onOpenChange,
  feeds = [],
  totalCount,
  matchingCount,
  selectedCount,
  filters,
  onSuccess,
}: ExportFeedModalProps) {
  const [exportFeedMutation, { loading }] = useExportFeed();

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = feeds;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no feed posts on this page to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "Post ID",
        getValue: (r: FeedProps) => r.id ?? "",
      },
      {
        header: "Author First Name",
        getValue: (r: FeedProps) => r.user?.firstName || "",
      },
      {
        header: "Author Last Name",
        getValue: (r: FeedProps) => r.user?.lastName || "",
      },
      {
        header: "Content",
        getValue: (r: FeedProps) =>
          r.description ||
          r.poll?.question ||
          r.job?.title ||
          r.marketPlace?.title ||
          r.moment?.caption ||
          "",
      },
      {
        header: "Source",
        getValue: (r: FeedProps) => r.source || "dashboard",
      },
      {
        header: "Privacy",
        getValue: (r: FeedProps) => r.privacy || "PUBLIC",
      },
      {
        header: "Added By",
        getValue: (r: FeedProps) => r.addedBy || "USER",
      },
      {
        header: "Total Reactions",
        getValue: (r: FeedProps) => r.totalReactions ?? 0,
      },
      {
        header: "Total Comments",
        getValue: (r: FeedProps) => r.totalComment ?? 0,
      },
      {
        header: "Total Reshares",
        getValue: (r: FeedProps) => r.totalReShare ?? 0,
      },
      {
        header: "Is Pinned",
        getValue: (r: FeedProps) => (r.isPinned ? "Yes" : "No"),
      },
      {
        header: "Created At",
        getValue: (r: FeedProps) =>
          safeFormat(r.createdAt, "yyyy-MM-dd HH:mm", ""),
      },
    ]);

    const label =
      scope === "matching" ? "feed-posts-search" : "feed-posts-page";
    downloadCsv(
      csv,
      `${label}-${new Date().toISOString().slice(0, 10)}`,
      format
    );

    toast.success("Export ready", {
      description: `${rows.length} post${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  const handleExportAll = async (format: ExportCsvFormat) => {
    try {
      const res = await exportFeedMutation({
        variables: {
          input: {
            format,
            status:
              filters?.status && filters.status !== "ALL"
                ? filters.status
                : undefined,
            search: filters?.search?.trim() || undefined,
            targetId: filters?.targetId || undefined,
            source:
              filters?.source && filters.source !== "ALL"
                ? filters.source
                : undefined,
          },
        },
      });

      if (res.data?.exportFeed?.success) {
        toast.success("CSV will be sent to your email", {
          description:
            res.data.exportFeed.message ||
            `Exporting all ${totalCount.toLocaleString()} posts — you and community administrators will receive an email once complete.`,
          icon: <Mail className="h-4 w-4" />,
          duration: 5000,
        });
        onSuccess?.();
      } else {
        toast.error("Export failed", {
          description:
            res.data?.exportFeed?.message || "Could not start feed export.",
        });
      }
    } catch (err: any) {
      toast.error("Export failed", {
        description:
          err?.message || "Something went wrong while exporting feed posts.",
      });
    }
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="feed posts"
      description="Export posts, author info, engagement metrics, and status. For All Posts, the file is processed asynchronously and delivered directly to your email."
      totalCount={totalCount}
      matchingCount={matchingCount}
      selectedCount={selectedCount}
      loading={loading}
      onExport={handleExport}
      onExportAll={handleExportAll}
    />
  );
}

export default ExportFeedModal;
