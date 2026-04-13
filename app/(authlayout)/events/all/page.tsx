"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  XCircle,
  List,
  LayoutGrid,
  ListIcon,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

import AllEvents from "../../../../components/events/all-events";
import { useAllEvents, EventStatus } from "../../../../graphql/actions/events";
import Create from "@/components/events/create/create";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Status options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { key: "all",      label: "All",      status: EventStatus.ALL,      dot: "" },
  { key: "approved", label: "Approved", status: EventStatus.APPROVED, dot: "bg-emerald-500" },
  { key: "pending",  label: "Pending",  status: EventStatus.PENDING,  dot: "bg-amber-500" },
  { key: "disabled", label: "Disabled", status: EventStatus.DISABLED, dot: "bg-orange-500" },
  { key: "rejected", label: "Rejected", status: EventStatus.REJECTED, dot: "bg-red-500" },
];

const SORT_OPTIONS = [
  { value: "newest",   label: "Newest First" },
  { value: "oldest",   label: "Oldest First" },
  { value: "title",    label: "Title A–Z" },
  { value: "attendees",label: "Most Attendees" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

function AllEventsPage() {
  const [activeStatus, setActiveStatus] = useState<EventStatus>(EventStatus.ALL);
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
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "attendees":
          return (b.numberOfAttendees || 0) - (a.numberOfAttendees || 0);
        default:
          return 0;
      }
    });
  }, [eventsData?.getAllEvents, searchTerm, sortBy]);

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.status === activeStatus) || STATUS_OPTIONS[0];

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title="Events"
        badgeText="Community Hub"
        description="Monitor, manage, and scale your community event programming."
        icon={Calendar}
        actions={
          <div className="flex items-center gap-2">
            <Create />
            {/* View toggle */}
            <Tabs
              value={viewMode}
              onValueChange={(val: any) => setViewMode(val)}
              className="bg-muted p-0.5 rounded-lg border border-border"
            >
              <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                <TabsTrigger
                  value="grid"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <ListIcon className="h-3.5 w-3.5 mr-1.5" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />

      {/* Action Bar */}
      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          {/* Search */}
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search events…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Status filter */}
          <EcosystemActionBar.Item>
            <Select
              value={activeStatus}
              onValueChange={(val) => setActiveStatus(val as EventStatus)}
            >
              <SelectTrigger className="w-[150px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  {currentStatus.dot && (
                    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", currentStatus.dot)} />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.key}
                    value={opt.status}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)} />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Sort */}
          <EcosystemActionBar.Item>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredEvents.length > 0}>
            {filteredEvents.length} Events
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none shadow-none ring-0 bg-transparent">
        <AllEvents data={filteredEvents} loading={loading} viewMode={viewMode} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default AllEventsPage;
