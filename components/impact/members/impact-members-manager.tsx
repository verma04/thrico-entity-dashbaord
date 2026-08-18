"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Users,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
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
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { InlineAlert } from "@/components/ui/inline-alert";

import { useGetImpactUsers } from "@/graphql/actions";
import {
  TIER_TABS,
  SORT_OPTIONS,
  ImpactTierValue,
  SectionHeader,
  ContentArea,
} from "./impact-members-manage-ui";
import { getImpactMemberTableColumns } from "./impact-members-list";
import { ImpactUserNode } from "./impact-members-table";
import { ExportImpactMembersModal } from "./export-impact-members-modal";

export function ImpactMembersManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Update URL parameters helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "all" ||
          value === "0" ||
          value === "grid" ||
          value === "score-desc"
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

  const tier = searchParams.get("tier") || "ALL";
  const sortBy = searchParams.get("sort") || "score-desc";
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

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    rank: true,
    member: true,
    tier: true,
    subscores: true,
    score: true,
    lastUpdated: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setTier = (v: string) =>
    updateParams({ tier: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "score-desc" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Impact Users ────────────────────────────────────────────────────
  const { data, loading, error, refetch } = useGetImpactUsers({
    variables: {
      input: {
        limit: 200,
        offset: 0,
        search: debouncedSearch || undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  const rawNodes: ImpactUserNode[] = data?.getImpactUsers?.nodes || [];
  const totalCount = data?.getImpactUsers?.totalCount || rawNodes.length;

  // ── Filter and Sort Nodes ─────────────────────────────────────────────────
  const filteredNodes = useMemo(() => {
    let list = [...rawNodes];

    // Tier filter
    if (tier !== "ALL") {
      list = list.filter(
        (n) => n.tier?.toUpperCase() === tier.toUpperCase(),
      );
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter((n) => {
        const name = `${n.user?.firstName || ""} ${n.user?.lastName || ""}`.toLowerCase();
        const id = (n.user?.id || "").toLowerCase();
        return name.includes(q) || id.includes(q);
      });
    }

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return (b.score ?? 0) - (a.score ?? 0);
        case "score-asc":
          return (a.score ?? 0) - (b.score ?? 0);
        case "name":
          return (a.user?.firstName || "").localeCompare(
            b.user?.firstName || "",
          );
        default:
          return 0;
      }
    });
  }, [rawNodes, tier, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedNodes = useMemo(() => {
    return filteredNodes.slice(offset, offset + limit);
  }, [filteredNodes, offset, limit]);

  const pageTitle =
    tier === "ALL"
      ? "Member Scores"
      : `${tier.charAt(0) + tier.slice(1).toLowerCase()} Tier Members`;

  const availableColumns = useMemo(
    () => getImpactMemberTableColumns(offset),
    [offset],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Impact Scores"
        description="View all community members and their corresponding impact scores and tiers."
        icon={Users}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/impact-score" },
          { label: "Members" },
        ]}
      />

      {/* ── Notice Alert ─────────────────────────────────────────────────── */}
      <div className="space-y-4 px-3">
        <InlineAlert
          variant="alert"
          message="Impact scores dynamically aggregate member activities, contributions, and community sentiment into unified tier ratings in real-time."
          className="rounded-xl"
        />
      </div>

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by member name, ID…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Tier Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={tier}
              onValueChange={(v) => setTier(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <div className="flex items-center gap-2">
                  {TIER_TABS.find((t) => t.value === tier)?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        TIER_TABS.find((t) => t.value === tier)?.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Tier" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                {TIER_TABS.map((opt) => (
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

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[160px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
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

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredNodes.length > 0}>
            Showing {filteredNodes.length} of {totalCount} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          tier={tier}
          count={filteredNodes.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          users={paginatedNodes}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredNodes.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredNodes.length / limit)}
              totalItems={filteredNodes.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportImpactMembersModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        users={filteredNodes}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() || tier !== "ALL"
            ? filteredNodes.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default ImpactMembersManager;
