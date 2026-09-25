"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Calendar,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  RotateCcw,
  X,
  FileSpreadsheet,
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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { safeFormat } from "@/lib/date-utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";

import { useAllEvents, EventStatus, Event } from "@/graphql/actions/events";
import Create from "@/components/events/create/create";
import {
  STATUS_TABS,
  EVENT_TYPE_OPTIONS,
  SORT_OPTIONS,
  EventStatusValue,
  SectionHeader,
  ContentArea,
} from "./events-manage-ui";
import { getEventTableColumns } from "./event-list";
import { ExportEventsModal } from "./export-events-modal";
import { EventKpiSummary } from "./event-kpi-summary";
import { EventStarters } from "./event-starters";

interface EventsManageProps {
  status?: string;
}

export function EventsManage({ status: initialStatus }: EventsManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

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
  const limit = 24; // clean multiple for 1, 2, 3, 4, and 6 columns
  const offset = (page - 1) * limit;

  const status: EventStatusValue =
    (searchParams.get("status") as EventStatusValue) ||
    (initialStatus as EventStatusValue) ||
    EventStatus.ALL;

  const selectedType = searchParams.get("type") || "ALL";
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
    event: true,
    type: true,
    date: true,
    location: true,
    status: true,
    verification: true,
    attendees: true,
    views: true,
    created: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setStatus = (v: EventStatusValue) =>
    updateParams({ status: v === EventStatus.ALL ? null : v, page: null });

  const setSelectedType = (v: string) =>
    updateParams({ type: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Events ──────────────────────────────────────────────────────────
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: eventsData, loading: queryLoading, refetch } = useAllEvents({
    variables: {
      input: {
        status: status === EventStatus.ALL ? undefined : (status as EventStatus),
      },
    },
  });

  const loading = queryLoading || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success(`${moduleName} refreshed`);
    } catch {
      toast.error("Failed to refresh events");
    } finally {
      setIsRefreshing(false);
    }
  };

  const allEvents = eventsData?.getAllEvents || [];
  const totalCount = allEvents.length;

  // ── Quick CSV Export ───────────────────────────────────────────────────────
  const handleQuickExport = () => {
    if (filteredEvents.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const csv = buildCsv(filteredEvents, [
      { header: "Title", getValue: (r: Event) => r.title || "" },
      { header: "Type", getValue: (r: Event) => r.type || "" },
      { header: "Status", getValue: (r: Event) => r.status || "" },
      {
        header: "Start Date",
        getValue: (r: Event) => safeFormat(r.startDate, "yyyy-MM-dd", ""),
      },
      {
        header: "End Date",
        getValue: (r: Event) => safeFormat(r.endDate, "yyyy-MM-dd", ""),
      },
      { header: "Start Time", getValue: (r: Event) => r.startTime || "" },
      {
        header: "Location",
        getValue: (r: Event) => r.location?.name || r.location?.address || "",
      },
      {
        header: "Attendees",
        getValue: (r: Event) => r.numberOfAttendees ?? 0,
      },
      {
        header: "Views",
        getValue: (r: Event) => r.numberOfViews ?? 0,
      },
      {
        header: "Created At",
        getValue: (r: Event) => safeFormat(r.createdAt, "yyyy-MM-dd", ""),
      },
      { header: "Description", getValue: (r: Event) => r.description || "" },
    ]);

    downloadCsv(csv, `${moduleName.toLowerCase()}-${safeFormat(new Date(), "yyyy-MM-dd", "")}`);
    toast.success(`Exported ${filteredEvents.length} ${moduleName.toLowerCase()} to CSV`);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch.trim() ||
      status !== EventStatus.ALL ||
      selectedType !== "ALL" ||
      sortBy !== "newest"
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    updateParams({
      q: null,
      status: null,
      type: null,
      sort: null,
      page: null,
    });
  };

  // ── Filter and Sort Events ────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Status filter
    if (status !== EventStatus.ALL) {
      events = events.filter((e) => e.status === status);
    }

    // Type filter
    if (selectedType !== "ALL") {
      events = events.filter((e) => {
        const t = e.type?.toUpperCase();
        if (selectedType === "ONLINE") {
          return t === "ONLINE" || t === "VIRTUAL";
        }
        if (selectedType === "OFFLINE") {
          return t === "OFFLINE" || t === "IN_PERSON";
        }
        if (selectedType === "HYBRID") {
          return t === "HYBRID";
        }
        return true;
      });
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title?.toLowerCase().includes(term) ||
          e.description?.toLowerCase().includes(term) ||
          e.location?.name?.toLowerCase().includes(term) ||
          e.location?.address?.toLowerCase().includes(term),
      );
    }

    // Sorting
    return events.sort((a, b) => {
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
        case "upcoming":
          return (
            new Date(a.startDate || 0).getTime() -
            new Date(b.startDate || 0).getTime()
          );
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "attendees":
          return (b.numberOfAttendees || 0) - (a.numberOfAttendees || 0);
        case "views":
          return (b.numberOfViews || 0) - (a.numberOfViews || 0);
        default:
          return 0;
      }
    });
  }, [allEvents, status, selectedType, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedEvents = useMemo(() => {
    return filteredEvents.slice(offset, offset + limit);
  }, [filteredEvents, offset, limit]);

  const pageTitle =
    status === EventStatus.ALL
      ? moduleName
      : `${status.charAt(0) + status.slice(1).toLowerCase()} ${moduleName}`;

  const availableColumns = useMemo(
    () => getEventTableColumns(singularName),
    [singularName],
  );

  return (
    <EcosystemWrapper className="gap-5 animate-in fade-in duration-500">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Event Hub"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `${totalCount} total ${moduleName.toLowerCase()} registered across your community ecosystem.`
        }
        icon={Calendar}
        breadcrumbs={[
          { label: moduleName, href: "/events/all" },
          { label: pageTitle },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickExport}
              className="h-8 gap-1.5 rounded-lg border-border/60 text-xs font-semibold shadow-2xs hover:bg-muted"
            >
              <Upload className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
              title="Refresh roster"
            >
              <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>
            <Create />
          </div>
        }
      />

      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <EventKpiSummary
        events={allEvents}
        loading={queryLoading}
        moduleName={moduleName}
        activeStatus={status}
        onFilterStatus={(s) => setStatus(s as EventStatusValue)}
      />

      {/* ── Fast Assembly Launchpads ─────────────────────────────────────── */}
      <EventStarters />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${moduleName.toLowerCase()} by title, venue, or details…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Status Filter */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as EventStatusValue)}
            >
              <SelectTrigger className="w-[135px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
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
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[145px]">
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

          {/* Type Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v)}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                {EVENT_TYPE_OPTIONS.map((opt) => (
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

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[135px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <EcosystemActionBar.Item>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            </EcosystemActionBar.Item>
          )}
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

          {/* Export Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
              >
                <Upload className="h-3.5 w-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                onClick={handleQuickExport}
                className="text-xs font-medium cursor-pointer gap-2"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                Quick CSV Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowExportModal(true)}
                className="text-xs font-medium cursor-pointer gap-2"
              >
                <Upload className="h-3.5 w-3.5 text-primary" />
                Advanced Export…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
          <EcosystemActionBar.Status active={filteredEvents.length > 0}>
            Showing {filteredEvents.length} of {totalCount} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredEvents.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          events={paginatedEvents}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredEvents.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredEvents.length / limit)}
              totalItems={filteredEvents.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportEventsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        events={filteredEvents}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() ||
          status !== EventStatus.ALL ||
          selectedType !== "ALL"
            ? filteredEvents.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default EventsManage;
