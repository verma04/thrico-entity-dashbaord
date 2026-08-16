"use client";

import React, { useState } from "react";
import {
  Upload,
  Ticket,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useGetRedemptions } from "@/graphql/actions/rewards";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { RedemptionsTable } from "@/components/rewards/redemptions/redemptions-table";
import { useModuleStore } from "@/store/useModuleStore";
import { useDebounce } from "use-debounce";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

export default function RedemptionsPage() {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [showExportModal, setShowExportModal] = useState(false);
  const pageSize = 100;

  const { data, loading, refetch } = useGetRedemptions({
    pagination: { page, limit: pageSize },
  });

  // Client-side filtering if API doesn't support it directly yet
  let redemptions = data?.getRedemptions || [];
  const totalCount = redemptions.length;

  if (debouncedSearch) {
    const s = debouncedSearch.toLowerCase();
    redemptions = redemptions.filter(
      (r: any) =>
        r.user?.firstName?.toLowerCase().includes(s) ||
        r.user?.lastName?.toLowerCase().includes(s) ||
        r.user?.email?.toLowerCase().includes(s) ||
        r.reward?.title?.toLowerCase().includes(s),
    );
  }

  const hasNextPage = (data?.getRedemptions?.length || 0) === pageSize;
  const hasPrevPage = page > 1;

  const handleNextPage = () => {
    if (hasNextPage) setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (hasPrevPage) setPage((p) => p - 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Redemption History"
        badgeText="Reports"
        description={`A complete log of every ${rewardsModuleName.toLowerCase()} claimed by your community members.`}
        icon={Ticket}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Redemptions" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by member name or coupon..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RotateCcw className={cn(loading && "animate-spin")} size={14} />
            </Button>
          </EcosystemActionBar.Item>

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

          <EcosystemActionBar.Item>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={!hasPrevPage || loading}
                className="h-8 w-8 border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="text-xs text-muted-foreground font-medium px-2 min-w-[60px] text-center">
                Page {page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={!hasNextPage || loading}
                className="h-8 w-8 border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={totalCount > 0}>
            {totalCount} Redemptions
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm shrink-0 border border-border">
              <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              This list logs all redemptions across your ecosystem. You can
              search by user name, email, or reward title.
            </p>
          </div>
        </div>

        <div className="px-6">
          <RedemptionsTable
            redemptions={redemptions}
            isLoading={loading}
          />
        </div>
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="redemptions"
        description="Export redemption history as a CSV file. Includes member info, reward title, coins spent, status, voucher code, and date."
        totalCount={totalCount}
        matchingCount={debouncedSearch.trim() ? redemptions.length : undefined}
        onExport={(scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = redemptions as any[];

          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No redemptions match the current view.",
            });
            return;
          }

          const csv = buildCsv(rows, [
            { header: "First Name",    getValue: (r) => r.user?.firstName || "" },
            { header: "Last Name",     getValue: (r) => r.user?.lastName || "" },
            { header: "Email",         getValue: (r) => r.user?.email || "" },
            { header: "Reward",        getValue: (r) => r.reward?.title || "" },
            { header: "Coins Spent",   getValue: (r) => r.ecUsed ?? 0 },
            { header: "Total Cost",    getValue: (r) => r.totalCost ?? 0 },
            { header: "Status",        getValue: (r) => r.status || "" },
            { header: "Voucher Code",  getValue: (r) => r.metadata?.voucherCode || "" },
            { header: "Claimed At",    getValue: (r) => r.claimedAt ? new Date(r.claimedAt).toISOString().slice(0, 10) : "" },
            { header: "Created At",    getValue: (r) => r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "" },
          ]);

          const label = scope === "matching" ? "redemptions-search" : `redemptions-page-${page}`;
          downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

          toast.success("Export ready", {
            description: `${rows.length} redemption${rows.length !== 1 ? "s" : ""} exported successfully.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
