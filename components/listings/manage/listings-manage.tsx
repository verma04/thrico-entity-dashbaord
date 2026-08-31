"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import {
  Store,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";

import { MarketPlaceListing, useListings } from "@/graphql/actions/listing";
import { MemberEligibilitySelect } from "@/components/gamification/shared/member-eligibility-select";
import {
  STATUS_TABS,
  CONDITION_OPTIONS,
  SORT_OPTIONS,
  ListingStatusValue,
  SectionHeader,
  ContentArea,
} from "./listings-manage-ui";
import { getListingTableColumns } from "./listings-list";
import { ExportListingsModal } from "./export-listings-modal";

export interface ListingsManageProps {
  status?: string;
}

export function ListingsManage({ status: initialStatus }: ListingsManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  // ── Update URL parameters helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "0" ||
          value === "grid" ||
          value === "newest"
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

  // ── Derive state from URL search params ───────────────────────────────────
  const page = Number(searchParams.get("page") || "1");
  const limit = 24;
  const offset = (page - 1) * limit;

  const status =
    searchParams.get("status") ||
    initialStatus ||
    "ALL";

  const memberEligibility =
    searchParams.get("memberEligibility") || "ALL";

  const selectedCondition = searchParams.get("condition") || "ALL";
  const sortBy = searchParams.get("sort") || "newest";
  const view = (searchParams.get("view") as "grid" | "list") || "grid";

  // Search input state with debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    listing: true,
    price: true,
    condition: true,
    views: true,
    status: true,
    eligibility: true,
    verification: true,
    created: true,
    creator: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setStatus = (v: string) =>
    updateParams({ status: v === "ALL" ? null : v, page: null });

  const setMemberEligibility = (v: string) =>
    updateParams({ memberEligibility: v === "ALL" ? null : v, page: null });

  const setSelectedCondition = (v: string) =>
    updateParams({ condition: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Listings ────────────────────────────────────────────────────────
  const { data, loading, refetch } = useListings({
    variables: {
      input: {
        status: status === "ALL" ? undefined : status,
        memberEligibility:
          memberEligibility === "ALL" ? undefined : (memberEligibility as any),
      },
    },
    fetchPolicy: "network-only",
  });

  const allListings: MarketPlaceListing[] = data?.getListing?.data || [];
  const totalCount = data?.getListing?.total ?? allListings.length;

  // ── Filter and Sort Listings ──────────────────────────────────────────────
  const filteredListings = useMemo(() => {
    let list = [...allListings];

    // Status filter
    if (status !== "ALL") {
      list = list.filter((l) => l.status === status);
    }

    // Eligibility filter
    if (memberEligibility !== "ALL") {
      list = list.filter((l) => {
        const elig =
          l.memberEligibility ||
          l.eligibility?.memberEligibility ||
          l.eligibilityRule?.memberEligibility;
        return elig === memberEligibility;
      });
    }

    // Condition filter
    if (selectedCondition !== "ALL") {
      list = list.filter(
        (l) => l.condition?.toUpperCase() === selectedCondition.toUpperCase(),
      );
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      list = list.filter((l) => {
        const loc =
          typeof l.location === "string"
            ? l.location
            : l.location?.name || l.location?.address || "";
        return (
          l.title?.toLowerCase().includes(term) ||
          l.description?.toLowerCase().includes(term) ||
          l.category?.toLowerCase().includes(term) ||
          loc.toLowerCase().includes(term)
        );
      });
    }

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "price_high":
          return Number(b.price || 0) - Number(a.price || 0);
        case "price_low":
          return Number(a.price || 0) - Number(b.price || 0);
        case "views":
          return (b.numberOfViews || 0) - (a.numberOfViews || 0);
        default:
          return 0;
      }
    });
  }, [allListings, status, selectedCondition, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedListings = useMemo(() => {
    return filteredListings.slice(offset, offset + limit);
  }, [filteredListings, offset, limit]);

  const pageTitle =
    status === "ALL"
      ? moduleName
      : `${status.charAt(0) + status.slice(1).toLowerCase()} ${moduleName}`;

  const availableColumns = useMemo(
    () => getListingTableColumns(singularName),
    [singularName],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Marketplace"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `${totalCount} total ${moduleName.toLowerCase()} in your directory.`
        }
        icon={Store}
        breadcrumbs={[
          { label: moduleName, href: "/listing/all" },
          { label: pageTitle },
        ]}
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Status Filter */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v)}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <div className="flex items-center gap-2">
                  {STATUS_TABS.find((t) => t.value === status)?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        STATUS_TABS.find((t) => t.value === status)?.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                {STATUS_TABS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot,
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Condition Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedCondition}
              onValueChange={(v) => setSelectedCondition(v)}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                {CONDITION_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Eligibility Filter */}
          <EcosystemActionBar.Item>
            <MemberEligibilitySelect
              value={memberEligibility}
              onValueChange={setMemberEligibility}
              className="w-[145px]"
            />
          </EcosystemActionBar.Item>

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[145px]">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        {/* Right controls */}
        <EcosystemActionBar.Group align="right">
          {/* Columns Toggle for List View */}
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableColumns
                  .filter((c) => c.key !== "actions")
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {typeof col.header === "string" ? col.header : col.key}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* View Toggle */}
          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          {/* Create CTA Button */}
          <Link href="/listing/create">
            <CtaButton>
              <Plus className="h-3.5 w-3.5" />
              Create {singularName}
            </CtaButton>
          </Link>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredListings.length > 0}>
            Showing {filteredListings.length} of {totalCount} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredListings.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          listings={paginatedListings}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredListings.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredListings.length / limit)}
              totalItems={filteredListings.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportListingsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        listings={filteredListings}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() ||
          status !== "ALL" ||
          selectedCondition !== "ALL"
            ? filteredListings.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default ListingsManage;
