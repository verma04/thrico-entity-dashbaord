"use client";

import React, { useState } from "react";
import { useGetLeaderboard } from "@/graphql/actions";
import { LeaderboardTable } from "./leaderboard-table";
import {
  Trophy,
  Users,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { InlineAlert } from "@/components/ui/inline-alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

export function LeaderboardManager() {
  const [pagination] = useState({ limit: 20, offset: 0 });
  const { data, loading, refetch } = useGetLeaderboard({
    variables: { pagination },
    notifyOnNetworkStatusChange: true,
  });

  const [search, setSearch] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const leaderboard = data?.getLeaderboard;
  const entries = leaderboard?.entries || [];

  const filteredEntries = React.useMemo(() => {
    if (!search) return entries;
    return entries.filter((e: any) => {
      const name = `${e.user.firstName} ${e.user.lastName}`.toLowerCase();
      return name.includes(search.toLowerCase());
    });
  }, [entries, search]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Leaderboard"
        badgeText="Competition"
        description="Monitor community rankings and point aggregates across all active members in real-time."
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Leaderboard" },
        ]}
      />

      <div className="px-6 pt-2 pb-0">
        <InlineAlert
          variant="alert"
          message="Leaderboard rankings are updated in real-time based on cumulative lifetime points earned across all modules and connected apps."
          className="rounded-xl"
        />
      </div>

      <EcosystemActionBar shadow="sm" className="">
        <EcosystemActionBar.Item grow className="max-w-sm">
          <EcosystemActionBar.Search
            value={search}
            onChange={setSearch}
            placeholder="Search members..."
          />
        </EcosystemActionBar.Item>
        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Global Participants
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {leaderboard?.totalUsers?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Ranking Protocol
              </span>
              <span className="text-lg font-bold text-foreground tracking-tight">
                Cumulative Point Aggregation (Lifecycle)
              </span>
            </div>
          </div>
        </div>

        <div className="px-6">
          <LeaderboardTable entries={filteredEntries} isLoading={loading} />
        </div>
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="leaderboard entries"
        description="Export the current leaderboard as a CSV file. Includes rank, member name, points, badges, rank tier, and wallet balance."
        totalCount={leaderboard?.totalUsers ?? 0}
        matchingCount={search.trim() ? filteredEntries.length : undefined}
        onExport={(scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = scope === "matching" ? filteredEntries : entries;

          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No leaderboard entries to export.",
            });
            return;
          }

          const csv = buildCsv(rows, [
            { header: "Rank",           getValue: (e: any) => e.rank ?? "" },
            { header: "First Name",     getValue: (e: any) => e.user?.firstName || "" },
            { header: "Last Name",      getValue: (e: any) => e.user?.lastName || "" },
            { header: "Total Points",   getValue: (e: any) => e.totalPoints ?? 0 },
            { header: "Badges",         getValue: (e: any) => e.badgesCount ?? 0 },
            { header: "Rank Tier",      getValue: (e: any) => e.currentRank?.name || "" },
            { header: "Wallet Balance", getValue: (e: any) => e.entityCurrencyWallet?.balance ?? 0 },
            { header: "Total Earned",   getValue: (e: any) => e.entityCurrencyWallet?.totalEarned ?? 0 },
            { header: "Total Spent",    getValue: (e: any) => e.entityCurrencyWallet?.totalSpent ?? 0 },
          ]);

          const label = scope === "matching" ? "leaderboard-search" : "leaderboard";
          downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

          toast.success("Export ready", {
            description: `${rows.length} entr${rows.length !== 1 ? "ies" : "y"} exported successfully.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
