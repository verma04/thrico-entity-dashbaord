"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  BookOpen,
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  Upload,
  Radio,
  Clock,
  Sparkles,
  Trash2,
  X,
  Search,
} from "lucide-react";
import {
  useGetStories,
  useGetAllActiveStories,
  useGetPastStories,
  Story,
} from "@/graphql/actions/stories";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";

import { StoriesKpiSummary } from "./stories-kpi-summary";
import { StoryCard, StoryCardSkeleton } from "./story-card";
import { StoriesTable } from "./stories-table";
import { StoryPreviewDialog } from "./story-preview-dialog";
import { DeleteStoryDialog } from "./delete-story-dialog";
import { ExportStoriesModal } from "./export-stories-modal";

export type StoryStatusFilter = "ALL" | "ACTIVE" | "PAST";

export function StoriesHub() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL Params Sync ───────────────────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "grid" ||
          value === "ALL" ||
          value === "1"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const view = (searchParams.get("view") as "grid" | "table") || "grid";
  const statusFilter = (searchParams.get("status") as StoryStatusFilter) || "ALL";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = 16;

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 300);

  // Selection state for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    story: Story | null;
    bulkIds?: string[];
  } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Data Fetching ─────────────────────────────────────────────────────────
  // Active queries depending on current filter
  const {
    data: allData,
    loading: allLoading,
    refetch: refetchAll,
  } = useGetStories(
    { page: currentPage, limit: pageSize },
    undefined,
    { skip: statusFilter !== "ALL" }
  );

  const {
    data: activeData,
    loading: activeLoading,
    refetch: refetchActive,
  } = useGetAllActiveStories(
    { page: currentPage, limit: pageSize },
    { skip: statusFilter !== "ACTIVE" }
  );

  const {
    data: pastData,
    loading: pastLoading,
    refetch: refetchPast,
  } = useGetPastStories(
    { page: currentPage, limit: pageSize },
    { skip: statusFilter !== "PAST" }
  );

  // Background KPI count queries
  const { data: kpiAllData, refetch: refetchKpiAll } = useGetStories(
    { page: 1, limit: 1 },
    undefined,
    { skip: statusFilter === "ALL" }
  );
  const { data: kpiActiveData, refetch: refetchKpiActive } = useGetAllActiveStories(
    { page: 1, limit: 1 },
    { skip: statusFilter === "ACTIVE" }
  );
  const { data: kpiPastData, refetch: refetchKpiPast } = useGetPastStories(
    { page: 1, limit: 1 },
    { skip: statusFilter === "PAST" }
  );

  // Aggregate current active data and meta
  const currentConnection = useMemo(() => {
    if (statusFilter === "ACTIVE") return activeData?.getAllActiveStories;
    if (statusFilter === "PAST") return pastData?.getPastStories;
    return allData?.stories;
  }, [statusFilter, activeData, pastData, allData]);

  const isLoading =
    statusFilter === "ACTIVE"
      ? activeLoading
      : statusFilter === "PAST"
      ? pastLoading
      : allLoading;

  const rawStories = currentConnection?.data || [];
  const meta = currentConnection?.meta;

  // Aggregate KPI counts
  const totalCount =
    statusFilter === "ALL"
      ? meta?.totalItems
      : kpiAllData?.stories?.meta?.totalItems ?? rawStories.length;

  const activeCount =
    statusFilter === "ACTIVE"
      ? meta?.totalItems
      : kpiActiveData?.getAllActiveStories?.meta?.totalItems ?? 0;

  const pastCount =
    statusFilter === "PAST"
      ? meta?.totalItems
      : kpiPastData?.getPastStories?.meta?.totalItems ?? 0;

  // Filter stories client-side by debounced search
  const filteredStories = useMemo(() => {
    if (!debouncedSearch.trim()) return rawStories;
    const term = debouncedSearch.toLowerCase().trim();
    return rawStories.filter((s) => {
      const captionMatch = (s.caption || "").toLowerCase().includes(term);
      const authorMatch =
        `${s.user?.firstName || ""} ${s.user?.lastName || ""}`
          .toLowerCase()
          .includes(term) || (s.user?.email || "").toLowerCase().includes(term);
      const idMatch = s.id.toLowerCase().includes(term);
      return captionMatch || authorMatch || idMatch;
    });
  }, [rawStories, debouncedSearch]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        refetchAll?.(),
        refetchActive?.(),
        refetchPast?.(),
        refetchKpiAll?.(),
        refetchKpiActive?.(),
        refetchKpiPast?.(),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedIds(filteredStories.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const handleStatusChange = (newStatus: StoryStatusFilter) => {
    setSelectedIds([]);
    updateParams({ status: newStatus, page: "1" });
  };

  const handleViewChange = (newView: string) => {
    updateParams({ view: newView });
  };

  const selectedStoryObjects = useMemo(() => {
    return filteredStories.filter((s) => selectedIds.includes(s.id));
  }, [filteredStories, selectedIds]);

  return (
    <EcosystemWrapper className="gap-5">
      {/* Top Header */}
      <EcosystemHeader
        title="Stories Hub"
        description="Real-time ephemeral story broadcasts, archive preservation, creator oversight, and overlay moderation."
        icon={BookOpen}
        badgeText="Stories Hub"
        breadcrumbs={[{ label: "Stories", href: "/stories" }, { label: "All Stories" }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-foreground rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh stories"
            >
              <RotateCcw
                size={13}
                className={cn(isRefreshing && "animate-spin text-indigo-600")}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="space-y-5">
        {/* KPI Executive Summary */}
        <StoriesKpiSummary
          stories={filteredStories}
          totalCount={totalCount}
          activeCount={activeCount}
          pastCount={pastCount}
          loading={isLoading && !currentConnection}
        />

        {/* Action Toolbar */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
          <EcosystemActionBar shadow="none">
            {/* Left: Search input */}
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  updateParams({ q: val || null, page: "1" });
                }}
                placeholder="Search caption, creator, ID..."
              />
            </EcosystemActionBar.Item>

            {/* Middle: Status Filter Toggle */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
              <button
                onClick={() => handleStatusChange("ALL")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                  statusFilter === "ALL"
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Stories
                {totalCount != null && (
                  <span className="ml-1 text-[10px] opacity-70">({totalCount})</span>
                )}
              </button>
              <button
                onClick={() => handleStatusChange("ACTIVE")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1",
                  statusFilter === "ACTIVE"
                    ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Active
                {activeCount != null && (
                  <span className="ml-0.5 text-[10px] opacity-80">({activeCount})</span>
                )}
              </button>
              <button
                onClick={() => handleStatusChange("PAST")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1",
                  statusFilter === "PAST"
                    ? "bg-card text-amber-600 dark:text-amber-400 shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="h-3 w-3" />
                Expired Archive
                {pastCount != null && (
                  <span className="ml-0.5 text-[10px] opacity-80">({pastCount})</span>
                )}
              </button>
            </div>

            {/* Right: Grid / Table Switcher */}
            <EcosystemActionBar.Group align="right">
              <EcosystemActionBar.ViewToggle
                value={view}
                onChange={handleViewChange}
                compact
                options={[
                  { id: "grid", icon: LayoutGrid, label: "Grid" },
                  { id: "table", icon: ListIcon, label: "Table" },
                ]}
              />
            </EcosystemActionBar.Group>
          </EcosystemActionBar>

          {/* Floating Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <div className="px-4 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs transition-all animate-in fade-in">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-600 text-white text-[10px] font-bold">
                  {selectedIds.length} Selected
                </Badge>
                <span className="text-muted-foreground">
                  Stories selected for batch management
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setDeleteTarget({ story: null, bulkIds: selectedIds })
                  }
                  className="h-7 text-xs gap-1.5 font-semibold"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete Selected ({selectedIds.length})
                </Button>
              </div>
            </div>
          )}

          {/* Main Content Area: Grid or Table */}
          <div className="p-4">
            {view === "grid" ? (
              isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <StoryCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto border border-border/60">
                    <BookOpen className="h-6 w-6 opacity-60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      No stories found
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      {debouncedSearch
                        ? `No stories match "${debouncedSearch}". Try adjusting your search or filters.`
                        : statusFilter === "ACTIVE"
                        ? "There are currently no active stories live on the feed."
                        : statusFilter === "PAST"
                        ? "There are no archived stories in the past history."
                        : "No stories have been posted yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onSelectStory={(s) => setSelectedStory(s)}
                      onDeleteStory={(s) => setDeleteTarget({ story: s })}
                    />
                  ))}
                </div>
              )
            ) : (
              <StoriesTable
                stories={filteredStories}
                isLoading={isLoading}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onSelectStory={(s) => setSelectedStory(s)}
                onDeleteStory={(s) => setDeleteTarget({ story: s })}
              />
            )}

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-6 border-t border-border/40 pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.totalPages}
                  totalItems={meta.totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </EcosystemContainer>

      {/* Story Inspection & Overlays Dialog */}
      <StoryPreviewDialog
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onDeleteStory={(s) => {
          setSelectedStory(null);
          setDeleteTarget({ story: s });
        }}
      />

      {/* Single / Bulk Delete Dialog */}
      <DeleteStoryDialog
        story={deleteTarget?.story || null}
        bulkIds={deleteTarget?.bulkIds}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onSuccess={() => {
          setSelectedIds([]);
          handleRefresh();
        }}
      />

      {/* Export to CSV Modal */}
      <ExportStoriesModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        stories={filteredStories}
        selectedStories={selectedStoryObjects}
        totalCount={totalCount}
        statusFilter={statusFilter}
      />
    </EcosystemWrapper>
  );
}

