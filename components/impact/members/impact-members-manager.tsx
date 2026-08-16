"use client";

import React, { useState } from "react";
import { useGetImpactUsers } from "@/graphql/actions";
import { ImpactMembersTable, ImpactUserNode } from "./impact-members-table";
import { Button } from "@/components/ui/button";
import { Users, RotateCcw, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";

export function ImpactMembersManager() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [showExportModal, setShowExportModal] = useState(false);
  const pageSize = 100;

  const offset = (page - 1) * pageSize;

  const { data, loading, error, refetch } = useGetImpactUsers({
    variables: {
      input: {
        limit: pageSize,
        offset,
        search: debouncedSearch || undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  const nodes: ImpactUserNode[] = data?.getImpactUsers?.nodes || [];
  const totalCount = data?.getImpactUsers?.totalCount || 0;

  const hasNextPage = offset + pageSize < totalCount;
  const hasPrevPage = page > 1;

  const handleNextPage = () => {
    if (hasNextPage) setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (hasPrevPage) setPage((p) => p - 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset page on search
  };

  if (error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Member Scores"
          badgeText="Impact Scores"
          description="View and rank all community members by their total impact score."
          icon={Users}
        />
        <EcosystemContainer className="p-12">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
              <Users className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Members Unavailable
              </p>
              <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                {error.message}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl px-6"
            >
              Retry
            </Button>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Member Scores"
        badgeText="Impact Scores"
        description="View all community members and their corresponding impact scores and tiers."
        icon={Users}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by member name..."
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
            {totalCount} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="h-7 w-7 rounded-lg bg-background flex items-center justify-center shadow-sm shrink-0 border border-border">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              This list dynamically ranks all members by their overall Impact
              Score. You can view their sub-scores by hovering over the
              breakdown icons.
            </p>
          </div>
        </div>

        <div className="px-6">
          <ImpactMembersTable users={nodes} isLoading={loading} />
        </div>
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="impact members"
        description="Export member impact scores as CSV. Includes all sub-scores (engagement, contribution, trust, network, consistency), tier, and last calculated date."
        totalCount={totalCount}
        matchingCount={debouncedSearch.trim() ? nodes.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = nodes;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No members found on this page." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "First Name",        getValue: (u) => u.user?.firstName || "" },
            { header: "Last Name",         getValue: (u) => u.user?.lastName || "" },
            { header: "Total Score",       getValue: (u) => u.score ?? 0 },
            { header: "Tier",              getValue: (u) => u.tier || "" },
            { header: "Engagement",        getValue: (u) => u.engagementScore ?? 0 },
            { header: "Contribution",      getValue: (u) => u.contributionScore ?? 0 },
            { header: "Trust",             getValue: (u) => u.trustScore ?? 0 },
            { header: "Network",           getValue: (u) => u.networkScore ?? 0 },
            { header: "Consistency",       getValue: (u) => u.consistencyScore ?? 0 },
            { header: "Last Calculated",   getValue: (u) => u.lastCalculatedAt ? new Date(u.lastCalculatedAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `impact-members-p${page}-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} member${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
