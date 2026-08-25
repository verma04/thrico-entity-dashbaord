"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Trophy,
  Users,
  TrendingUp,
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

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { InlineAlert } from "@/components/ui/inline-alert";

import {
  useGetLeaderboard,
  LeaderboardEntry,
} from "@/graphql/actions";
import {
  SORT_OPTIONS,
  ContentArea,
} from "./leaderboard-manage-ui";
import { getLeaderboardTableColumns } from "./leaderboard-table-list";
import { ExportLeaderboardModal } from "./export-leaderboard-modal";

export function LeaderboardManager() {
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
          value === "0" ||
          value === "list" ||
          value === "rank-asc"
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

  const sortBy = searchParams.get("sort") || "rank-asc";
  const view = (searchParams.get("view") as "grid" | "list") || "list";

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

  // Modal state
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    rank: true,
    user: true,
    currentRank: true,
    badges: true,
    points: true,
    wallet: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setSortBy = (v: string) =>
    updateParams({ sort: v === "rank-asc" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Leaderboard ─────────────────────────────────────────────────────
  const { data, loading } = useGetLeaderboard({
    variables: { pagination: { limit: 100, offset: 0 } },
    notifyOnNetworkStatusChange: true,
  });

  const leaderboard = data?.getLeaderboard;
  const rawEntries = (leaderboard?.entries || []) as LeaderboardEntry[];

  // ── Filter and Sort Entries ───────────────────────────────────────────────
  const filteredEntries = useMemo(() => {
    let list = [...rawEntries];

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter((e) => {
        const name = `${e.user?.firstName || ""} ${e.user?.lastName || ""}`.toLowerCase();
        const email = ((e.user as any)?.email || "").toLowerCase();
        const rankName = (e.currentRank?.name || "").toLowerCase();
        return name.includes(q) || email.includes(q) || rankName.includes(q);
      });
    }

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "rank-asc":
          return a.rank - b.rank;
        case "points-desc":
          return (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
        case "badges-desc":
          return (b.badgesCount ?? 0) - (a.badgesCount ?? 0);
        case "wallet-desc":
          return (
            (b.entityCurrencyWallet?.balance ?? 0) -
            (a.entityCurrencyWallet?.balance ?? 0)
          );
        case "name":
          return (a.user?.firstName || "").localeCompare(
            b.user?.firstName || "",
          );
        default:
          return 0;
      }
    });
  }, [rawEntries, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedEntries = useMemo(() => {
    return filteredEntries.slice(offset, offset + limit);
  }, [filteredEntries, offset, limit]);

  const availableColumns = useMemo(() => getLeaderboardTableColumns(), []);

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Leaderboard"
        badgeText="Competition"
        description="Monitor community rankings and point aggregates across all active members in real-time."
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Leaderboard" },
        ]}
      />

      {/* ── Stats Cards & Notice Alert ────────────────────────────────────── */}
      <div className="space-y-4 px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Global Participants
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {leaderboard?.totalUsers?.toLocaleString() ?? rawEntries.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Ranking Protocol
              </span>
              <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Cumulative Point Aggregation (Lifecycle)
              </span>
            </div>
          </div>
        </div>

        <InlineAlert
          variant="alert"
          message="Leaderboard rankings are updated in real-time based on cumulative lifetime points earned across all modules and connected apps."
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
              placeholder="Search by member, email, or tier…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[170px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[180px]">
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
          <EcosystemActionBar.Status active={filteredEntries.length > 0}>
            Showing {filteredEntries.length} of {rawEntries.length} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          entries={paginatedEntries}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredEntries.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredEntries.length / limit)}
              totalItems={filteredEntries.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportLeaderboardModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entries={filteredEntries}
        totalCount={leaderboard?.totalUsers ?? rawEntries.length}
        matchingCount={
          debouncedSearch.trim() ? filteredEntries.length : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default LeaderboardManager;
