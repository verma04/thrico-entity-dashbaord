"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  OpportunityStatus,
  useAdminOpportunities,
} from "@/graphql/actions/opportunities";
import TableLoading from "@/components/layout/table-loading";
import OpportunitiesTable from "@/components/opportunities/opportunities-table";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { Target, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All", dot: "" },
  { value: "APPROVED", label: "Approved", dot: "bg-emerald-500" },
  { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
];

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "0"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const page = Number(searchParams.get("page") || "1");
  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  const statusParam = searchParams.get("status");
  const status =
    (statusParam?.toUpperCase() as OpportunityStatus) || OpportunityStatus.ALL;
  const setStatus = (v: string) => updateParams({ status: v, page: null });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const limit = 20;

  const { data, loading, refetch } = useAdminOpportunities({
    variables: {
      input: {
        status: status === OpportunityStatus.ALL ? undefined : status,
        search: debouncedSearch.trim() || undefined,
        pagination: {
          page,
          limit,
        },
      },
    },
    fetchPolicy: "network-only",
  });

  const opportunities = data?.adminGetOpportunities?.data || [];
  const meta = data?.adminGetOpportunities?.meta;
  const totalCount = meta?.totalItems ?? opportunities.length;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Opportunities"
        description="Manage all opportunities available to your community."
        badgeText="Opportunities"
        icon={Target}
        breadcrumbs={[
          { label: "Opportunities", href: "/opportunities/all" },
          { label: "All Opportunities" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      {/* Action / Filter Bar */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search opportunities…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={status}
              onValueChange={setStatus}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

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
          <EcosystemActionBar.Status active={opportunities.length > 0}>
            Showing {opportunities.length} of {totalCount} Opportunities
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="py-2">
          {loading ? (
            <TableLoading />
          ) : (
            <>
              <OpportunitiesTable data={opportunities} />
              {totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={loading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="opportunities"
        description={`Export career and business opportunities as CSV. Includes title, company, location, type, status, and salary.`}
        totalCount={totalCount}
        matchingCount={debouncedSearch.trim() || status !== "ALL" ? opportunities.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = opportunities;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No opportunities found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (o: any) => o.title || "" },
            { header: "Company", getValue: (o: any) => o.company || o.organization || "" },
            { header: "Location", getValue: (o: any) => o.location || "" },
            { header: "Type", getValue: (o: any) => o.type || o.employmentType || "" },
            { header: "Status", getValue: (o: any) => o.status || "" },
            { header: "Created At", getValue: (o: any) => o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `opportunities-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} opportunit${rows.length !== 1 ? "ies" : "y"} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
};

export default withModulePermission(Page, "OPPORTUNITIES", "canRead");
