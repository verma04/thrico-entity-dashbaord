"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useListings } from "../../../../graphql/actions/listing";
import TableLoading from "@/components/layout/table-loading";
import { ListingsTable } from "@/components/listings/listings-table";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Store, Plus, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { key: "all", label: "All", status: "ALL", dot: "" },
  {
    key: "approved",
    label: "Approved",
    status: "APPROVED",
    dot: "bg-emerald-500",
  },
  { key: "pending", label: "Pending", status: "PENDING", dot: "bg-amber-500" },
  {
    key: "disabled",
    label: "Disabled",
    status: "DISABLED",
    dot: "bg-orange-500",
  },
  { key: "rejected", label: "Rejected", status: "REJECTED", dot: "bg-red-500" },
];

const ListingsAllPage = () => {
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

  const initialStatusParam = searchParams.get("status") || "ALL";
  const activeStatus = initialStatusParam.toUpperCase();
  const setActiveStatus = (val: string) =>
    updateParams({ status: val === "ALL" ? null : val });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  const { data, loading, refetch } = useListings({
    variables: {
      input: {
        status: activeStatus === "ALL" ? undefined : activeStatus,
      },
    },
    fetchPolicy: "network-only",
  });

  const listings = data?.getListing?.data || [];

  const filteredListings = listings.filter(
    (item: any) => {
      const q = debouncedSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q)
      );
    },
  );

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Marketplace"
        description={`Manage and view all ${moduleName.toLowerCase()}.`}
        icon={Store}
        breadcrumbs={[
          { label: moduleName, href: "/listing" },
          { label: "All" },
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

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={activeStatus}
              onValueChange={(val) => setActiveStatus(val)}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.status,
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
          <EcosystemActionBar.Item>
            <Link href="/listing/create">
              <CtaButton>
                <Plus className="h-3.5 w-3.5" />
                Create {singularName}
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredListings.length > 0}>
            Showing {filteredListings.length} of {listings.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        {loading ? (
          <TableLoading />
        ) : (
          <ListingsTable listings={filteredListings} />
        )}
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export directory listings as CSV. Includes title, description, category, author, and status.`}
        totalCount={listings.length}
        matchingCount={debouncedSearch.trim() || activeStatus !== "ALL" ? filteredListings.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredListings;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (l: any) => l.title || "" },
            { header: "Description", getValue: (l: any) => l.description || "" },
            { header: "Category", getValue: (l: any) => l.category?.name || l.category || "" },
            { header: "Author", getValue: (l: any) => l.user ? `${l.user.firstName || ""} ${l.user.lastName || ""}`.trim() : "" },
            { header: "Status", getValue: (l: any) => l.status || "" },
            { header: "Created At", getValue: (l: any) => l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `listings-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${moduleName.toLowerCase()} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
};

export default withModulePermission(ListingsAllPage, "LISTING", "canRead");

