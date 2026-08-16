"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

import {
  LayoutGrid,
  ListIcon,
  Calendar,
  Upload,
} from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

import AllEvents from "../../../../components/events/all-events";
import { useAllEvents, EventStatus } from "../../../../graphql/actions/events";
import Create from "@/components/events/create/create";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Status options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { key: "all", label: "All", status: EventStatus.ALL, dot: "" },
  {
    key: "approved",
    label: "Approved",
    status: EventStatus.APPROVED,
    dot: "bg-emerald-500",
  },
  {
    key: "pending",
    label: "Pending",
    status: EventStatus.PENDING,
    dot: "bg-amber-500",
  },
  {
    key: "disabled",
    label: "Disabled",
    status: EventStatus.DISABLED,
    dot: "bg-orange-500",
  },
  {
    key: "rejected",
    label: "Rejected",
    status: EventStatus.REJECTED,
    dot: "bg-red-500",
  },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A–Z" },
  { value: "attendees", label: "Most Attendees" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

function AllEventsPage() {
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
          value === "0" ||
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

  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  const [activeStatus, setActiveStatus] = useState<EventStatus>(
    (searchParams.get("status") as EventStatus) || EventStatus.ALL,
  );
  const [showExportModal, setShowExportModal] = useState(false);

  const updateStatus = (val: EventStatus) => {
    setActiveStatus(val);
    updateParams({ status: val === EventStatus.ALL ? null : val });
  };

  const viewMode =
    (searchParams.get("view") as "grid" | "list") || "grid";
  const setViewMode = (val: "grid" | "list") =>
    updateParams({ view: val === "grid" ? null : val });

  const sortBy = searchParams.get("sort") || "newest";
  const setSortBy = (val: string) =>
    updateParams({ sort: val === "newest" ? null : val });

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data: eventsData, loading } = useAllEvents({
    variables: {
      input: {
        status: activeStatus === EventStatus.ALL ? undefined : activeStatus,
      },
    },
  });

  const totalEvents = eventsData?.getAllEvents?.length || 0;

  const filteredEvents = useMemo(() => {
    let events = eventsData?.getAllEvents || [];

    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title?.toLowerCase().includes(term) ||
          e.description?.toLowerCase().includes(term) ||
          e.location?.name?.toLowerCase().includes(term),
      );
    }

    return [...events].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "attendees":
          return (b.numberOfAttendees || 0) - (a.numberOfAttendees || 0);
        default:
          return 0;
      }
    });
  }, [eventsData?.getAllEvents, debouncedSearch, sortBy]);

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title={moduleName}
        badgeText="Community Hub"
        description={`Monitor, manage, and scale your community ${singularName.toLowerCase()} programming.`}
        icon={Calendar}
        breadcrumbs={[{ label: moduleName, href: "/events" }, { label: "All" }]}
      />

      {/* Action Bar */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          {/* Search */}
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Status filter */}
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={activeStatus}
              onValueChange={(val) => setActiveStatus(val as EventStatus)}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.status,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
            />
          </EcosystemActionBar.Item>

          {/* Sort */}
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={sortBy}
              onValueChange={setSortBy}
              placeholder="Sort"
              options={SORT_OPTIONS}
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
            <EcosystemActionBar.ViewToggle
              value={viewMode}
              onChange={(val) => setViewMode(val as "grid" | "list")}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "list", label: "List", icon: ListIcon },
              ]}
            />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Create />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredEvents.length > 0}>
            Showing {filteredEvents.length} of {totalEvents} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        <AllEvents
          data={filteredEvents}
          loading={loading}
          viewMode={viewMode}
        />
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export scheduled events and registrations as CSV. Includes title, description, dates, location, status, and attendees.`}
        totalCount={totalEvents}
        matchingCount={debouncedSearch.trim() || activeStatus !== EventStatus.ALL ? filteredEvents.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredEvents;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (e: any) => e.title || "" },
            { header: "Description", getValue: (e: any) => e.description || "" },
            { header: "Start Date", getValue: (e: any) => e.startDate ? new Date(e.startDate).toISOString() : "" },
            { header: "End Date", getValue: (e: any) => e.endDate ? new Date(e.endDate).toISOString() : "" },
            { header: "Location / Mode", getValue: (e: any) => e.location || e.mode || "" },
            { header: "Status", getValue: (e: any) => e.status || "" },
            { header: "Attendees", getValue: (e: any) => e.attendeesCount ?? (e.attendees?.length || 0) },
          ]);
          downloadCsv(csv, `events-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${moduleName.toLowerCase()} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(AllEventsPage, "EVENTS", "canRead"),
  "events",
);
