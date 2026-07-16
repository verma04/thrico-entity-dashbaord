"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment";
import { Event } from "@/graphql/actions/events";
import EventCard from "./event-card";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Type Badge
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  ONLINE: "bg-cyan-50 text-cyan-700 border-cyan-200",
  OFFLINE: "bg-violet-50 text-violet-700 border-violet-200",
  HYBRID: "bg-amber-50 text-amber-700 border-amber-200",
};

function EventTypeBadge({ type }: { type: string }) {
  const color = TYPE_COLORS[type] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide ${color}`}
    >
      {type?.replace("_", " ")}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

const getColumns = (singularName: string): AdminTableColumn<Event>[] => [
  {
    key: "event",
    header: singularName,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0">
          <AvatarImage
            src={
              row.cover
                ? `https://cdn.thrico.network/${row.cover}`
                : "https://cdn.thrico.network/defaultEventCover.png"
            }
            alt={row.title}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
            <Calendar className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight truncate max-w-[200px]">
            {row.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
            {row.type?.toLowerCase()} ·{" "}
            {row.startDate ? moment(row.startDate).format("MMM DD, YYYY") : "—"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate max-w-[140px]">{row.location?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    cell: (row) => (
      <div className="flex flex-col text-[12px]">
        <span className="font-medium text-foreground/80 whitespace-nowrap">
          {row.startDate ? moment(row.startDate).format("MMM DD, YYYY") : "—"}
        </span>
        {row.startTime && (
          <span className="text-muted-foreground">{row.startTime}</span>
        )}
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => <EventTypeBadge type={row.type} />,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "verification",
    header: "Verified",
    cell: (row) => <AdminVerifiedBadge verified={!!row.verification?.isVerified} />,
  },
  {
    key: "attendees",
    header: "Attendees",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <div className="flex items-center justify-end gap-1.5 text-[12px] text-muted-foreground">
        <Users className="h-3 w-3 shrink-0" />
        <span className="font-semibold text-foreground/80">
          {row.numberOfAttendees || 0}
        </span>
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AllEvents({
  data,
  loading,
  viewMode = "grid",
}: {
  data: Event[] | undefined;
  loading?: boolean;
  viewMode?: "grid" | "list";
}) {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);
  const columns = React.useMemo(() => getColumns(singularName), [singularName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Loading {moduleName.toLowerCase()}…</p>
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    if (!data || data.length === 0) {
      return (
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4 text-muted-foreground/40">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No {moduleName.toLowerCase()} found</p>
            <p className="text-xs text-muted-foreground mt-1 text-center max-w-sm">
              No {moduleName.toLowerCase()} match your current filters. Try adjusting your search or create a new {singularName.toLowerCase()}.
            </p>
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }

  // List / Table view
  return (
    <AdminTable<Event>
      columns={columns}
      data={data}
      keyExtractor={(e) => e.id}
      emptyIcon={Calendar}
      emptyTitle={`No ${moduleName.toLowerCase()} found`}
      emptyDescription="Try adjusting your search or filter criteria."
    />
  );
}
