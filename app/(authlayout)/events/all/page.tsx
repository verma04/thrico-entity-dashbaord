"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useState, useMemo } from "react";

import {
  LayoutGrid,
  ListIcon,
  Calendar,
} from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

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
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);
  const [activeStatus, setActiveStatus] = useState<EventStatus>(
    EventStatus.ALL,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: eventsData, loading } = useAllEvents({
    variables: {
      input: {
        status: activeStatus === EventStatus.ALL ? undefined : activeStatus,
      },
    },
  });

  const filteredEvents = useMemo(() => {
    let events = eventsData?.getAllEvents || [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
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
  }, [eventsData?.getAllEvents, searchTerm, sortBy]);



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
      <EcosystemActionBar>
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
            {filteredEvents.length} {moduleName}
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
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(AllEventsPage, "EVENTS", "canRead"),
  "events",
);
