"use client";

import React from "react";
import {
  ExportCsvModal,
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { LeaderboardEntry } from "@/graphql/actions";

interface ExportLeaderboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: LeaderboardEntry[];
  totalCount: number;
  matchingCount?: number;
}

export function ExportLeaderboardModal({
  open,
  onOpenChange,
  entries,
  totalCount,
  matchingCount,
}: ExportLeaderboardModalProps) {
  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows = entries;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no leaderboard rankings to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      { header: "Rank", getValue: (e: any) => e.rank ?? "" },
      { header: "First Name", getValue: (e: any) => e.user?.firstName || "" },
      { header: "Last Name", getValue: (e: any) => e.user?.lastName || "" },
      { header: "Email", getValue: (e: any) => e.user?.email || "" },
      { header: "Total Points", getValue: (e: any) => e.totalPoints ?? 0 },
      { header: "Badges", getValue: (e: any) => e.badgesCount ?? 0 },
      { header: "Rank Tier", getValue: (e: any) => e.currentRank?.name || "Unranked" },
      { header: "Wallet Balance", getValue: (e: any) => e.entityCurrencyWallet?.balance ?? 0 },
      { header: "Total Earned", getValue: (e: any) => e.entityCurrencyWallet?.totalEarned ?? 0 },
      { header: "Total Spent", getValue: (e: any) => e.entityCurrencyWallet?.totalSpent ?? 0 },
    ]);

    const filename = `leaderboard-${new Date().toISOString().slice(0, 10)}`;
    downloadCsv(csv, filename, format);

    toast.success("Export ready", {
      description: `${rows.length} member ranking${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="leaderboard rankings"
      description="Export global community leaderboard rankings, lifetime points, badges, tier statuses, and currency balances as CSV."
      totalCount={totalCount}
      matchingCount={matchingCount}
      onExport={handleExport}
    />
  );
}

export default ExportLeaderboardModal;
