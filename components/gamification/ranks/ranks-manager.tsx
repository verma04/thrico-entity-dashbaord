"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Crown,
  Plus,
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
import { CtaButton } from "@/components/ui/cta-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { InlineAlert } from "@/components/ui/inline-alert";

import {
  useGetRanks,
  useUpdateRankOrder,
  useToggleRank,
  Rank,
} from "@/graphql/actions";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  RankStatusValue,
  SectionHeader,
  ContentArea,
} from "./ranks-manage-ui";
import { getRankTableColumns } from "./ranks-table-list";
import { StatsCards } from "./stats-cards";
import { RankNotificationModal } from "./rank-notification-modal";
import { ExportRanksModal } from "./export-ranks-modal";

export interface RanksManagerProps {
  status?: string;
}

export function RanksManager({ status: initialStatus }: RanksManagerProps) {
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
          value === "list" ||
          value === "order-asc"
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

  const sortBy = searchParams.get("sort") || "order-asc";
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

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [notificationModalRank, setNotificationModalRank] =
    useState<Rank | null>(null);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    order: true,
    rank: true,
    range: true,
    notifications: true,
    status: true,
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

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "order-asc" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Ranks ───────────────────────────────────────────────────────────
  const { data: ranksData, refetch, loading: ranksLoading } = useGetRanks();
  const rawRanks = ranksData?.getRanks || [];

  const [updateRankOrder] = useUpdateRankOrder({
    onCompleted: () => refetch(),
  });

  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => {
      refetch();
      toast.success("Rank status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggleActive = async (id: string) => {
    await toggleRank({ variables: { id } });
  };

  const handleMoveRank = async (index: number, direction: "up" | "down") => {
    const sortedRanks = [...filteredRanks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sortedRanks.length) return;

    const rankOrders = [
      { id: sortedRanks[index].id, order: sortedRanks[targetIndex].order },
      { id: sortedRanks[targetIndex].id, order: sortedRanks[index].order },
    ];

    try {
      await updateRankOrder({ variables: { rankOrders } });
    } catch (error) {
      console.error("Error updating rank order:", error);
    }
  };

  // ── Filter and Sort Ranks ─────────────────────────────────────────────────
  const filteredRanks = useMemo(() => {
    let list = [...rawRanks];

    // Status filter
    if (status === "ACTIVE") {
      list = list.filter((r) => r.isActive);
    } else if (status === "DISABLED") {
      list = list.filter((r) => !r.isActive);
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q),
      );
    }

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "order-asc":
          return (a.order ?? 0) - (b.order ?? 0);
        case "order-desc":
          return (b.order ?? 0) - (a.order ?? 0);
        case "points-asc":
          return (a.minPoints ?? 0) - (b.minPoints ?? 0);
        case "points-desc":
          return (b.minPoints ?? 0) - (a.minPoints ?? 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });
  }, [rawRanks, status, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedRanks = useMemo(() => {
    return filteredRanks.slice(offset, offset + limit);
  }, [filteredRanks, offset, limit]);

  const handleCreate = () => {
    router.push("/gamification/points-and-badges/ranks/create");
  };

  const handleEdit = (rank: Rank) => {
    router.push(`/gamification/points-and-badges/ranks/edit/${rank.id}`);
  };

  const pageTitle =
    status === "ALL"
      ? "Ranks"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Ranks`;

  const availableColumns = useMemo(
    () =>
      getRankTableColumns(
        filteredRanks,
        handleEdit,
        setNotificationModalRank,
        (i) => handleMoveRank(i, "up"),
        (i) => handleMoveRank(i, "down"),
        handleToggleActive,
        toggling,
        refetch,
      ),
    [filteredRanks, toggling],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Hierarchy"
        description={
          ranksLoading
            ? "Loading ranks…"
            : `${rawRanks.length} total tier progression levels configured.`
        }
        icon={Crown}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Ranks" },
        ]}
        actions={
          <CtaButton onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Rank
          </CtaButton>
        }
      />

      {/* ── Stats Cards & Notice Alert ────────────────────────────────────── */}
      <div className="space-y-4 px-3">
        <StatsCards ranks={rawRanks} />

        <InlineAlert
          variant="alert"
          message="Reordering ranks will automatically adjust the order property of each level. Member eligibility is calculated in real-time based on these thresholds."
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
              placeholder="Search by rank name or tier…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Status Filter */}
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

          {/* Add Rank CTA Button */}
          <CtaButton onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Rank
          </CtaButton>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredRanks.length > 0}>
            Showing {filteredRanks.length} of {rawRanks.length} Ranks
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredRanks.length}
          loading={ranksLoading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={ranksLoading}
          ranks={paginatedRanks}
          onEdit={handleEdit}
          onOpenNotifications={setNotificationModalRank}
          onMoveUp={(i) => handleMoveRank(i, "up")}
          onMoveDown={(i) => handleMoveRank(i, "down")}
          refetch={refetch}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!ranksLoading && filteredRanks.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredRanks.length / limit)}
              totalItems={filteredRanks.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Notification Edit Modal ───────────────────────────────────────── */}
      <RankNotificationModal
        rank={notificationModalRank}
        open={!!notificationModalRank}
        onOpenChange={(open) => !open && setNotificationModalRank(null)}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportRanksModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        ranks={filteredRanks}
        totalCount={rawRanks.length}
        matchingCount={
          debouncedSearch.trim() || status !== "ALL"
            ? filteredRanks.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default RanksManager;
