"use client";

import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Mic,
  Award,
  UserCheck,
  MapPin,
  Users,
  ShieldCheck,
  Image as ImageIcon,
  BarChart3,
  Settings,
  ShieldAlert,
  Activity,
  AlertTriangle,
  RotateCcw,
  Upload,
  Globe,
  Ticket,
} from "lucide-react";
import { useEventById } from "@/graphql/actions/events";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import moment from "moment";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

function EventsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const eventId = pathname?.split("/")[2];
  const section = pathname
    ?.replace(`/events/${eventId}`, "")
    .split("/")
    .filter(Boolean)[0];
  const currentTab = !section ? "general-info" : section;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = useEventById(eventId || "");

  const moduleName = useModuleStore((state) => state.eventModuleName) || "Events";
  const singularName = useModuleStore((state) => state.eventSingularName) || "Event";

  const event = data?.getEventById;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      }
      window.dispatchEvent(new CustomEvent("refresh-event-view"));
      toast.success(`${singularName} refreshed`);
    } catch {
      toast.error("Failed to refresh event details");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleExportSummary = () => {
    if (!event) {
      toast.error("No event data available to export");
      return;
    }

    const summaryRow = [
      {
        id: event.id || eventId,
        title: event.title || "",
        status: event.status || "DRAFT",
        type: event.type || "IN_PERSON",
        startDate: event.startDate
          ? moment(event.startDate).format("YYYY-MM-DD")
          : "",
        startTime: event.startTime || "",
        endDate: event.endDate
          ? moment(event.endDate).format("YYYY-MM-DD")
          : "",
        location: event.location?.name || event.location?.address || "Virtual",
        attendeeCount: event.attendeeCount ?? 0,
        registrationDeadline: event.lastDateOfRegistration
          ? moment(event.lastDateOfRegistration).format("YYYY-MM-DD")
          : "N/A",
      },
    ];

    const csv = buildCsv(summaryRow, [
      { header: "Event ID", getValue: (r) => r.id },
      { header: "Title", getValue: (r) => r.title },
      { header: "Status", getValue: (r) => r.status },
      { header: "Format", getValue: (r) => r.type },
      { header: "Start Date", getValue: (r) => r.startDate },
      { header: "Start Time", getValue: (r) => r.startTime },
      { header: "End Date", getValue: (r) => r.endDate },
      { header: "Location / Venue", getValue: (r) => r.location },
      { header: "Registered Attendees", getValue: (r) => r.attendeeCount },
      { header: "Registration Deadline", getValue: (r) => r.registrationDeadline },
    ]);

    const filename = `event-${(event.title || "summary")
      .toLowerCase()
      .replace(/\s+/g, "-")}-${moment().format("YYYY-MM-DD")}`;
    downloadCsv(csv, filename);
    toast.success("Event summary exported successfully");
  };

  const isLive = event?.status === "LIVE";
  const isPublished = event?.status === "PUBLISHED";
  const isDraft = event?.status === "DRAFT";
  const isCancelled = event?.status === "CANCELLED";

  const statusColor = isLive || isPublished
    ? "bg-emerald-500"
    : isDraft
      ? "bg-amber-500"
      : isCancelled
        ? "bg-red-500"
        : "bg-primary";

  const tabItems: ManageTabItem[] = [
    { key: "general-info", label: "General Info", icon: Calendar, path: "" },
    { key: "agenda", label: "Agenda", icon: Clock, path: "agenda" },
    { key: "speakers", label: "Speakers", icon: Mic, path: "speakers" },
    { key: "sponsors", label: "Sponsorship", icon: Award, path: "sponsors/tier" },
    { key: "hosts", label: "Hosts", icon: UserCheck, path: "hosts" },
    { key: "venue", label: "Venue", icon: MapPin, path: "venue/physical" },
    {
      key: "attendees",
      label: "Attendees",
      icon: Users,
      path: "attendees",
      count: event?.attendeeCount !== undefined ? event.attendeeCount : undefined,
    },
    { key: "team", label: "Team", icon: ShieldCheck, path: "team" },
    { key: "media", label: "Media", icon: ImageIcon, path: "media" },
    { key: "analytics", label: "Analytics", icon: BarChart3, path: "analytics" },
    { key: "settings", label: "Settings", icon: Settings, path: "settings" },
    {
      key: "reported-items",
      label: "Reported Items",
      icon: ShieldAlert,
      path: "reported-items",
    },
    { key: "audit-log", label: "Audit Log", icon: Activity, path: "audit-log" },
    {
      key: "danger-zone",
      label: "Danger Zone",
      icon: AlertTriangle,
      danger: true,
      path: "danger-zone",
    },
  ];

  const headerBadges = !loading && event ? (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge
        variant="outline"
        className={cn(
          "px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider rounded-md gap-1.5 border shadow-2xs",
          isLive
            ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800"
            : isPublished
              ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800"
              : isDraft
                ? "bg-amber-50/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800"
                : "bg-red-50/80 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200/80 dark:border-red-800"
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            isLive
              ? "bg-emerald-500 animate-pulse"
              : isPublished
                ? "bg-emerald-500"
                : isDraft
                  ? "bg-amber-500"
                  : "bg-red-500"
          )}
        />
        {event.status || "Draft"}
      </Badge>

      {event.type && (
        <Badge
          variant="secondary"
          className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md text-muted-foreground border border-border/40 shadow-2xs"
        >
          {event.type === "IN_PERSON"
            ? "In-Person Event"
            : event.type === "VIRTUAL"
              ? "Virtual Event"
              : "Hybrid Event"}
        </Badge>
      )}

      {event.category && (
        <Badge
          variant="outline"
          className="px-2 py-0.5 text-[10px] font-medium rounded-md text-foreground/80 bg-background/50 border-border/60"
        >
          {event.category}
        </Badge>
      )}
    </div>
  ) : null;

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg border-border/60 shadow-2xs transition-all"
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh event details"
      >
        <RotateCcw
          className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
        />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExportSummary}
        className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/60 shadow-2xs hover:bg-muted/70"
      >
        <Upload className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Export</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/events/${eventId}/settings`)}
        className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/60 shadow-2xs hover:bg-muted/70"
      >
        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Settings</span>
      </Button>
    </div>
  );

  const subtitleNode =
    !loading && event ? (
      <div className="text-xs text-muted-foreground flex items-center gap-2.5 flex-wrap pt-0.5">
        {event.startDate && (
          <span className="flex items-center gap-1 font-medium text-foreground/80">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {moment(event.startDate).format("MMM D, YYYY")}
            {event.startTime && ` · ${event.startTime}`}
          </span>
        )}

        {(event.location?.name || event.location?.address) && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 truncate max-w-[250px]">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              {event.location.name || event.location.address}
            </span>
          </>
        )}

        {event.attendeeCount !== undefined && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <strong className="font-semibold text-foreground">
                {event.attendeeCount}
              </strong>{" "}
              attendees
            </span>
          </>
        )}
      </div>
    ) : null;

  return (
    <ManageItemLayout
      title={event?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}…`}
      coverImage={event?.cover}
      defaultIcon={Calendar}
      statusColor={statusColor}
      badges={headerBadges}
      subtitle={subtitleNode}
      headerActions={headerActions}
      closeHref="/events/all"
      basePath={`/events/${eventId}`}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/events/all" },
        { label: event?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(EventsLayout, "EVENTS", "canRead");
