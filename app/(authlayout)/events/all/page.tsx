"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Search,
  SlidersHorizontal,
  Calendar,
} from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

import AllEvents from "../../../../components/events/all-events";
import { useAllEvents, EventStatus } from "../../../../graphql/actions/events";
import Create from "@/components/events/create/create";

type TabItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: EventStatus;
};

function AllEventsPage() {
  const [activeStatus, setActiveStatus] = useState<EventStatus>(
    EventStatus.ALL,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: eventsData,
    loading,
    error,
  } = useAllEvents({
    variables: {
      input: {
        status: activeStatus === EventStatus.ALL ? undefined : activeStatus,
      },
    },
  });

  const items: TabItem[] = [
    {
      key: "all",
      label: "All",
      icon: <List className="h-4 w-4" />,
      status: EventStatus.ALL,
    },
    {
      key: "approved",
      label: "Approved",
      icon: <CheckCircle className="h-4 w-4" />,
      status: EventStatus.APPROVED,
    },
    {
      key: "pending",
      label: "Pending",
      icon: <Clock className="h-4 w-4" />,
      status: EventStatus.PENDING,
    },
    {
      key: "disabled",
      label: "Disabled",
      icon: <XCircle className="h-4 w-4" />,
      status: EventStatus.DISABLED,
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: <XCircle className="h-4 w-4" />,
      status: EventStatus.REJECTED,
    },
  ];

  // Filter and sort locally
  const filteredEvents = useMemo(() => {
    let events = eventsData?.getAllEvents || [];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      events = events.filter(
        (e) =>
          e.title?.toLowerCase().includes(term) ||
          e.description?.toLowerCase().includes(term) ||
          e.location?.name?.toLowerCase().includes(term),
      );
    }

    // Sort
    events = [...events].sort((a, b) => {
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

    return events;
  }, [eventsData?.getAllEvents, searchTerm, sortBy]);

  const activeTab =
    items.find((item) => item.status === activeStatus)?.key || "all";

  const handleTabChange = (key: string) => {
    const tab = items.find((item) => item.key === key);
    if (tab) {
      setActiveStatus(tab.status);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Events"
        badgeText="Community Hub"
        description="Monitor, manage, and scale your global event programming."
        icon={Calendar}
        actions={
          <div className="flex items-center gap-3">
            <Create />
            <Tabs
              value={viewMode}
              onValueChange={(val: any) => setViewMode(val)}
              className="bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/50"
            >
              <TabsList className="bg-transparent border-none h-auto p-0">
                <TabsTrigger
                  value="grid"
                  className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all font-semibold text-xs py-2"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all font-semibold text-xs py-2"
                >
                  <ListIcon className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />

      <EcosystemActionBar>
        <div className="relative w-full md:max-w-[300px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm"
          />
        </div>

        <div className="h-8 w-px bg-slate-100 hidden lg:block" />

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <Select
            value={activeStatus}
            onValueChange={(val) => setActiveStatus(val as EventStatus)}
          >
            <SelectTrigger className="w-[160px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              {items.map((item) => (
                <SelectItem
                  key={item.key}
                  value={item.status}
                  className="font-semibold rounded-lg py-2.5"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem value="newest" className="font-semibold rounded-lg py-2.5">Newest First</SelectItem>
              <SelectItem value="oldest" className="font-semibold rounded-lg py-2.5">Oldest First</SelectItem>
              <SelectItem value="title" className="font-semibold rounded-lg py-2.5">Title A-Z</SelectItem>
              <SelectItem value="attendees" className="font-semibold rounded-lg py-2.5">Most Attendees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 relative z-10 ml-auto mr-4">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {filteredEvents.length} Events
          </div>
        </div>
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


export default AllEventsPage;
