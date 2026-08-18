"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LayoutGrid,
  List as ListIcon,
  MessageSquarePlus,
  RefreshCw,
  SlidersHorizontal,
  Globe,
  Lock,
  Pin,
  Plus,
  Briefcase,
  ShoppingBag,
  Play,
  BarChart2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import {
  useAllFeed,
  usePinnedFeed,
  useAdminFeed,
  useMomentsFeed,
  useJobFeed,
  useListingFeed,
  useNumberOfFeeds,
} from "@/graphql/actions/feed";
import PostModal from "./add-feed";
import { FeedGrid } from "./feed-grid";
import { FeedTable, feedTableColumns } from "./feed-table";
import type { FeedProps } from "./types";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Loading Skeletons
// ─────────────────────────────────────────────────────────────────────────────

function FeedSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 max-w-2xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-2xl bg-card border border-border/80 p-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
          <Skeleton className="h-44 w-full rounded-xl" />
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedSkeletonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
        {[40, 140, 260, 80, 80, 60, 60, 60, 90, 40].map((w, i) => (
          <Skeleton key={i} className="h-2.5 rounded" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-3 border-b border-border/40 last:border-0"
        >
          <Skeleton className="h-4 w-6 rounded" />
          <div className="flex items-center gap-2.5 w-36">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-2.5 w-14 rounded" />
            </div>
          </div>
          <div className="space-y-1.5 flex-1 max-w-[280px]">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-2.5 w-3/4 rounded" />
          </div>
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Constants
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Types", icon: MessageSquare },
  { value: "POST", label: "General Posts", icon: MessageSquare },
  { value: "POLL", label: "Polls", icon: BarChart2 },
  { value: "MOMENT", label: "Moments", icon: Play },
  { value: "JOB", label: "Jobs", icon: Briefcase },
  { value: "MARKETPLACE", label: "Listings", icon: ShoppingBag },
  { value: "CELEBRATION", label: "Celebrations", icon: Sparkles },
];

const PRIVACY_OPTIONS = [
  { value: "ALL", label: "All Privacy", icon: Globe },
  { value: "PUBLIC", label: "Public", icon: Globe },
  { value: "CONNECTIONS", label: "Connections", icon: Lock },
];

export type FeedType = "all" | "pinned" | "admin" | "moments" | "jobs" | "listing";

export interface FeedManageProps {
  feedType?: FeedType;
  emptyTitle?: string;
  emptyDescription?: string;
  searchPlaceholder?: string;
  showTypeFilter?: boolean;
  showPinnedFilter?: boolean;
}

export function FeedManage({
  feedType = "all",
  emptyTitle,
  emptyDescription,
  searchPlaceholder,
  showTypeFilter = feedType === "all",
  showPinnedFilter = feedType === "all" || feedType === "admin",
}: FeedManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL Search Params Synchronization ──────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL" || value === "0") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const page = Number(searchParams.get("page") || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const selectedType = searchParams.get("type") || "ALL";
  const selectedPrivacy = searchParams.get("privacy") || "ALL";
  const selectedPinned = searchParams.get("pinned") === "true";

  // Search input state (with debouncing)
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 400);

  React.useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Column visibility for Table view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    author: true,
    content: true,
    type: true,
    privacy: true,
    reactions: true,
    comments: true,
    reshares: true,
    pinned: true,
    createdAt: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Query Hook Mapping based on FeedType ─────────────
  const variables = { input: { offset, limit } };
  const queryOptions = { variables, fetchPolicy: "cache-and-network" as const };

  const allQuery = useAllFeed({ ...queryOptions, skip: feedType !== "all" });
  const pinnedQuery = usePinnedFeed({ ...queryOptions, skip: feedType !== "pinned" });
  const adminQuery = useAdminFeed({ ...queryOptions, skip: feedType !== "admin" });
  const momentsQuery = useMomentsFeed({ ...queryOptions, skip: feedType !== "moments" });
  const jobQuery = useJobFeed({ ...queryOptions, skip: feedType !== "jobs" });
  const listingQuery = useListingFeed({ ...queryOptions, skip: feedType !== "listing" });

  const activeQueryResult = useMemo(() => {
    switch (feedType) {
      case "pinned":
        return { data: pinnedQuery.data?.getPinnedFeed, loading: pinnedQuery.loading, refetch: pinnedQuery.refetch };
      case "admin":
        return { data: adminQuery.data?.getAdminFeed, loading: adminQuery.loading, refetch: adminQuery.refetch };
      case "moments":
        return { data: momentsQuery.data?.getMomentsFeed, loading: momentsQuery.loading, refetch: momentsQuery.refetch };
      case "jobs":
        return { data: jobQuery.data?.getJobFeed, loading: jobQuery.loading, refetch: jobQuery.refetch };
      case "listing":
        return { data: listingQuery.data?.getListingFeed, loading: listingQuery.loading, refetch: listingQuery.refetch };
      case "all":
      default:
        return { data: allQuery.data?.getAllFeed, loading: allQuery.loading, refetch: allQuery.refetch };
    }
  }, [
    feedType,
    allQuery.data, allQuery.loading, allQuery.refetch,
    pinnedQuery.data, pinnedQuery.loading, pinnedQuery.refetch,
    adminQuery.data, adminQuery.loading, adminQuery.refetch,
    momentsQuery.data, momentsQuery.loading, momentsQuery.refetch,
    jobQuery.data, jobQuery.loading, jobQuery.refetch,
    listingQuery.data, listingQuery.loading, listingQuery.refetch,
  ]);

  const { data: countData } = useNumberOfFeeds();
  const totalCount =
    feedType === "all"
      ? countData?.numberOfFeeds || activeQueryResult.data?.length || 0
      : activeQueryResult.data?.length || 0;

  const rawFeeds: FeedProps[] = activeQueryResult.data || [];
  const loading = activeQueryResult.loading;
  const refetch = activeQueryResult.refetch;

  // ── Client-side filtering ───────────────────────────
  const filteredFeeds = useMemo(() => {
    let result = rawFeeds;

    // Search Query Filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((item) => {
        const descMatch = item.description?.toLowerCase().includes(q);
        const authorMatch =
          item.user?.firstName?.toLowerCase().includes(q) ||
          item.user?.lastName?.toLowerCase().includes(q);
        const jobMatch = item.job?.title?.toLowerCase().includes(q) || item.job?.location?.toLowerCase().includes(q);
        const marketMatch = item.marketPlace?.title?.toLowerCase().includes(q) || item.marketPlace?.category?.toLowerCase().includes(q);
        const pollMatch = item.poll?.title?.toLowerCase().includes(q) || item.poll?.question?.toLowerCase().includes(q);
        const momentMatch = item.moment?.caption?.toLowerCase().includes(q);
        return descMatch || authorMatch || jobMatch || marketMatch || pollMatch || momentMatch;
      });
    }

    // Type Filter
    if (showTypeFilter && selectedType !== "ALL") {
      result = result.filter((item) => {
        if (selectedType === "POST") return !item.poll && !item.moment && !item.job && !item.marketPlace && !item.celebration;
        if (selectedType === "POLL") return !!item.poll;
        if (selectedType === "MOMENT") return !!item.moment;
        if (selectedType === "JOB") return !!item.job || item.source === "jobs";
        if (selectedType === "MARKETPLACE") return !!item.marketPlace || item.source === "marketPlace";
        if (selectedType === "CELEBRATION") return !!item.celebration;
        return true;
      });
    }

    // Privacy Filter
    if (selectedPrivacy !== "ALL") {
      result = result.filter((item) => item.privacy === selectedPrivacy);
    }

    // Pinned Filter
    if (showPinnedFilter && selectedPinned) {
      result = result.filter((item) => !!item.isPinned);
    }

    return result;
  }, [rawFeeds, debouncedSearch, selectedType, selectedPrivacy, selectedPinned, showTypeFilter, showPinnedFilter]);

  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    (showTypeFilter && selectedType !== "ALL") ||
    selectedPrivacy !== "ALL" ||
    (showPinnedFilter && selectedPinned);

  const clearAllFilters = () => {
    setSearch("");
    updateParams({
      q: null,
      type: null,
      privacy: null,
      pinned: null,
      page: null,
    });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // Default placeholders and labels based on feedType
  const defaultPlaceholder =
    searchPlaceholder ||
    (feedType === "pinned"
      ? "Search pinned posts…"
      : feedType === "admin"
      ? "Search admin posts…"
      : feedType === "moments"
      ? "Search video moments…"
      : feedType === "jobs"
      ? "Search job postings…"
      : feedType === "listing"
      ? "Search marketplace listings…"
      : "Search posts or authors…");

  const defaultEmptyTitle =
    emptyTitle ||
    (feedType === "pinned"
      ? "No Pinned Posts Found"
      : feedType === "admin"
      ? "No Admin Posts Found"
      : feedType === "moments"
      ? "No Video Moments Found"
      : feedType === "jobs"
      ? "No Job Openings Found"
      : feedType === "listing"
      ? "No Listings Found"
      : "No Community Posts Found");

  const defaultEmptyDescription =
    emptyDescription ||
    (feedType === "pinned"
      ? "Important announcements and highlighted posts pinned by admins will appear here."
      : feedType === "admin"
      ? "Official announcements and updates published by community managers will appear here."
      : feedType === "moments"
      ? "Share short videos, stories, and reels with your ecosystem."
      : feedType === "jobs"
      ? "Career opportunities, internships, and job postings will appear here."
      : feedType === "listing"
      ? "Items, services, and offers listed by community members will appear here."
      : "Start the conversation by sharing news, announcements, polls, or media with your ecosystem.");

  const EmptyIcon: LucideIcon =
    feedType === "pinned"
      ? Pin
      : feedType === "admin"
      ? ShieldCheck
      : feedType === "moments"
      ? Play
      : feedType === "jobs"
      ? Briefcase
      : feedType === "listing"
      ? ShoppingBag
      : MessageSquarePlus;

  const typeLabel =
    feedType === "pinned"
      ? "Pinned Posts"
      : feedType === "admin"
      ? "Admin Posts"
      : feedType === "moments"
      ? "Moments"
      : feedType === "jobs"
      ? "Job Posts"
      : feedType === "listing"
      ? "Listings"
      : "Posts";

  return (
    <div className="space-y-6">
      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none" className="rounded-xl border border-border/80 bg-card p-2">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder={defaultPlaceholder}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary Filters */}
        <EcosystemActionBar.Group>
          {/* Optional Type Filter */}
          {showTypeFilter && (
            <EcosystemActionBar.Item>
              <Select
                value={selectedType}
                onValueChange={(v) => updateParams({ type: v, page: null })}
              >
                <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Post Type" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                  {TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}

          {/* Privacy Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedPrivacy}
              onValueChange={(v) => updateParams({ privacy: v, page: null })}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[130px]">
                {PRIVACY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{opt.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Optional Pinned Filter */}
          {showPinnedFilter && feedType !== "pinned" && (
            <EcosystemActionBar.Item>
              <Button
                variant={selectedPinned ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateParams({
                    pinned: selectedPinned ? null : "true",
                    page: null,
                  })
                }
                className={cn(
                  "h-8 px-2.5 rounded-md text-xs font-medium gap-1.5 transition-all shadow-2xs",
                  selectedPinned
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "border-border text-foreground"
                )}
              >
                <Pin className={cn("h-3.5 w-3.5", selectedPinned && "fill-white")} />
                Pinned
              </Button>
            </EcosystemActionBar.Item>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <EcosystemActionBar.Item>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </EcosystemActionBar.Item>
          )}
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {/* Column Visibility Menu (List mode only) */}
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
                {feedTableColumns
                  .filter((c) => c.key !== "actions")
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {col.header}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-2.5 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>

          {/* View Toggle (Grid / List) */}
          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => updateParams({ view: v === "grid" ? null : v })}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          <EcosystemActionBar.Separator />

          {/* Status Counter */}
          <EcosystemActionBar.Status active={filteredFeeds.length > 0}>
            Showing {filteredFeeds.length} of {totalCount} {typeLabel}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Main Content Area (Animated View Switch) ──────────────────────── */}
      <AnimatePresence mode="wait">
        {loading && filteredFeeds.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {view === "grid" ? <FeedSkeletonGrid /> : <FeedSkeletonTable />}
          </motion.div>
        ) : filteredFeeds.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border/80 bg-card/50"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-xs">
              <EmptyIcon className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">
              {defaultEmptyTitle}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
              {hasActiveFilters
                ? "No posts match your selected filter criteria. Try resetting filters."
                : defaultEmptyDescription}
            </p>
            <div className="flex items-center gap-3">
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="rounded-xl h-9 text-xs font-semibold"
                >
                  Reset Filters
                </Button>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl h-9 text-xs font-semibold gap-1.5"
                >
                  <Link href="/feed/create">
                    <Plus className="h-3.5 w-3.5" />
                    Create Post
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="rounded-xl h-9 text-xs font-semibold gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {view === "grid" ? (
              <FeedGrid feeds={filteredFeeds} onRefresh={() => refetch()} />
            ) : (
              <FeedTable
                feeds={filteredFeeds}
                visibleColumns={visibleColumns}
                offset={offset}
                loading={loading}
              />
            )}

            {/* ── Pagination ─────────────────────────────────────────── */}
            <div className="pt-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalCount}
                pageSize={limit}
                onPageChange={(p) =>
                  updateParams({ page: p <= 1 ? null : String(p) })
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedManage;
