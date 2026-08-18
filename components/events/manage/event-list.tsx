"use client";

import React, { useState } from "react";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";
import { Event, useChangeEventStatus } from "@/graphql/actions/events";
import { EventActions } from "./event-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Type Badge
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  ONLINE: {
    label: "Online",
    bg: "bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-500/20",
  },
  VIRTUAL: {
    label: "Online",
    bg: "bg-cyan-500/10",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-500/20",
  },
  OFFLINE: {
    label: "In-Person",
    bg: "bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-500/20",
  },
  IN_PERSON: {
    label: "In-Person",
    bg: "bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-500/20",
  },
  HYBRID: {
    label: "Hybrid",
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
  },
};

function EventTypeBadge({ type }: { type: string }) {
  const norm = type?.toUpperCase() || "OFFLINE";
  const cfg = TYPE_CONFIG[norm] || {
    label: type || "Event",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tight",
        cfg.bg,
        cfg.text,
        cfg.border,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getEventTableColumns = (
  singularName: string,
): AdminTableColumn<Event>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "event",
    header: singularName,
    cell: (row) => (
      <div className="flex items-center gap-2.5 min-w-[200px]">
        <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0">
          <AvatarImage
            src={
              row.cover
                ? `https://cdn.thrico.network/${row.cover}`
                : "https://cdn.thrico.network/defaultEventCover.png"
            }
            alt={row.title}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
            <Calendar className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p
            className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[220px]"
            title={row.title}
          >
            {row.title}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px]">
            {row.type?.replace("_", " ").toLowerCase()} ·{" "}
            {row.startDate ? moment(row.startDate).format("MMM D, YYYY") : "No date"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => <EventTypeBadge type={row.type} />,
  },
  {
    key: "date",
    header: "Date & Time",
    cell: (row) => (
      <div className="flex flex-col text-[12px]">
        <span className="font-medium text-foreground/90 whitespace-nowrap">
          {row.startDate ? moment(row.startDate).format("MMM D, YYYY") : "—"}
        </span>
        {row.startTime && (
          <span className="text-[10px] text-muted-foreground">{row.startTime}</span>
        )}
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground max-w-[160px]">
        {row.type?.toUpperCase() === "ONLINE" ||
        row.type?.toUpperCase() === "VIRTUAL" ? (
          <Globe className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
        ) : (
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
        )}
        <span className="truncate">
          {row.location?.name ||
            (row.type?.toUpperCase() === "ONLINE"
              ? "Virtual"
              : "Location TBD")}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "verification",
    header: "Verified",
    cell: (row) => (
      <AdminVerifiedBadge verified={!!row.verification?.isVerified} />
    ),
  },
  {
    key: "attendees",
    header: "Attendees",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Users}
        value={row.numberOfAttendees || 0}
        variant="indigo"
      />
    ),
  },
  {
    key: "views",
    header: "Views",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Eye}
        value={row.numberOfViews || 0}
      />
    ),
  },
  {
    key: "created",
    header: "Created",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => <EventActions event={row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface EventListProps {
  events: Event[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function EventList({
  events,
  visibleColumns,
  offset = 0,
}: EventListProps) {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  const baseColumns = React.useMemo(
    () => getEventTableColumns(singularName),
    [singularName],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<Event>
        columns={activeColumns}
        data={events}
        keyExtractor={(e) => e.id}
        emptyIcon={Calendar}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}
