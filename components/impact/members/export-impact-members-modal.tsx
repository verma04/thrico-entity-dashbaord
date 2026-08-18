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
import { ImpactUserNode } from "./impact-members-table";

interface ExportImpactMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: ImpactUserNode[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportImpactMembersModal({
  open,
  onOpenChange,
  users,
  totalCount,
  matchingCount,
}: ExportImpactMembersModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = users;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no impact members to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "First Name", getValue: (u) => u.user?.firstName || "" },
      { header: "Last Name", getValue: (u) => u.user?.lastName || "" },
      { header: "Member ID", getValue: (u) => u.user?.id || "" },
      { header: "Total Impact Score", getValue: (u) => u.score ?? 0 },
      { header: "Tier", getValue: (u) => u.tier || "" },
      { header: "Engagement Score", getValue: (u) => u.engagementScore ?? 0 },
      {
        header: "Contribution Score",
        getValue: (u) => u.contributionScore ?? 0,
      },
      { header: "Trust Score", getValue: (u) => u.trustScore ?? 0 },
      { header: "Network Score", getValue: (u) => u.networkScore ?? 0 },
      {
        header: "Consistency Score",
        getValue: (u) => u.consistencyScore ?? 0,
      },
      {
        header: "Last Calculated At",
        getValue: (u) =>
          safeFormat(u.lastCalculatedAt, "yyyy-MM-dd", ""),
      },
    ]);

    const filename = `impact-members-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} impact member${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="impact members"
      description="Export member impact scores, tier ratings, and sub-score metrics (engagement, contribution, trust, network, consistency) as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportImpactMembersModal;
