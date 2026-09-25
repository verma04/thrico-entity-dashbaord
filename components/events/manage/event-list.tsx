"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Event, useChangeEventStatus } from "@/graphql/actions/events";
import { EventActions } from "./event-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableText,
  AdminTableMetric,
  AdminTableTag,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions matching member/all table architecture
// ─────────────────────────────────────────────────────────────────────────────

export const getEventTableColumns = (
  singularName: string,
  router?: ReturnType<typeof useRouter>,
  rowSelection?: Record<string, boolean>,
  onToggleRow?: (index: number, checked: boolean) => void,
): AdminTableColumn<Event>[] => [
  {
    key: "select",
    header: "",
    headerClassName: "w-8 text-center",
    className: "text-center",
    cell: (_, index) => (
      <div
        className="flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={!!rowSelection?.[index]}
          onChange={(e) => onToggleRow?.(index, e.target.checked)}
          className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
        />
      </div>
    ),
  },
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-10 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-left",
    className: "text-left",
    isFixedLeft: true,
    cell: (row) => <EventActions event={row} />,
  },
  {
    key: "event",
    header: singularName,
    cell: (row) => {
      const coverUrl = row.cover
        ? row.cover.startsWith("http")
          ? row.cover
          : `https://cdn.thrico.network/${row.cover}`
        : "https://cdn.thrico.network/defaultEventCover.png";

      return (
        <AdminTableItem
          avatar={coverUrl}
          title={row.title}
          subtitle={
            row.description
              ? row.description.slice(0, 60) + (row.description.length > 60 ? "…" : "")
              : "No description provided"
          }
          fallbackText={row.title?.slice(0, 2).toUpperCase() || "EV"}
          shape="rounded"
          maxTitleWidth="max-w-[240px]"
          onClick={() => router?.push(`/events/${row.id}`)}
        />
      );
    },
  },
  {
    key: "type",
    header: "Format",
    cell: (row) => {
      const t = row.type?.toUpperCase() || "OFFLINE";
      const variant =
        t === "ONLINE" || t === "VIRTUAL"
          ? "sky"
          : t === "HYBRID"
            ? "amber"
            : "purple";
      return (
        <AdminTableTag variant={variant}>
          {row.type?.replace("_", " ") || "EVENT"}
        </AdminTableTag>
      );
    },
  },
  {
    key: "location",
    header: "Location",
    cell: (row) => {
      const isOnline =
        row.type?.toUpperCase() === "ONLINE" ||
        row.type?.toUpperCase() === "VIRTUAL";
      return (
        <AdminTableText
          primary={
            row.location?.name ||
            (isOnline ? "Virtual / Online Event" : "Location TBD")
          }
          secondary={row.location?.address}
          icon={isOnline ? Globe : MapPin}
        />
      );
    },
  },
  {
    key: "date",
    header: "Schedule",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        <AdminTableDate date={row.startDate} format="MMM d, yyyy" />
        {row.startTime && (
          <span className="text-[10px] text-muted-foreground font-mono">
            {row.startTime}
          </span>
        )}
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
    header: "Verification",
    cell: (row) => (
      <AdminVerifiedBadge verified={!!row.verification?.isVerified} />
    ),
  },
  {
    key: "attendees",
    header: "Attendees",
    cell: (row) => (
      <AdminTableMetric
        icon={Users}
        value={row.numberOfAttendees?.toLocaleString() || "0"}
        variant="indigo"
      />
    ),
  },
  {
    key: "views",
    header: "Views",
    cell: (row) => (
      <AdminTableMetric
        icon={Eye}
        value={row.numberOfViews?.toLocaleString() || "0"}
      />
    ),
  },
  {
    key: "created",
    header: "Created",
    cell: (row) => <AdminTableDate date={row.createdAt} relative />,
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
  const router = useRouter();
  const moduleName = useModuleStore((state) => state.eventModuleName) || "Events";
  const singularName = useModuleStore((state) => state.eventSingularName) || "Event";

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [changeStatus, { loading: bulkLoading }] = useChangeEventStatus();

  const handleToggleRow = (index: number, checked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [index]: checked,
    }));
  };

  const selectedRowsIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => events[Number(key)]?.id)
      .filter(Boolean);
  }, [rowSelection, events]);

  const handleBulkAction = async (statusAction: string) => {
    if (!selectedRowsIds.length) return;
    try {
      await Promise.all(
        selectedRowsIds.map((eventId) =>
          changeStatus({
            variables: {
              input: {
                eventId,
                action: statusAction,
              },
            },
          })
        )
      );
      toast.success(
        `Updated ${selectedRowsIds.length} ${moduleName.toLowerCase()} to ${statusAction.toLowerCase()}`
      );
      setRowSelection({});
    } catch (e: any) {
      toast.error("Bulk action failed", { description: e?.message });
    }
  };

  const baseColumns = useMemo(
    () =>
      getEventTableColumns(
        singularName,
        router,
        rowSelection,
        handleToggleRow
      ),
    [singularName, router, rowSelection]
  );

  const activeColumns = useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      {/* ── Bulk Action Bar ────────────────────────────────────────────── */}
      {selectedRowsIds.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 bg-primary/5 border border-primary/10 rounded-xl animate-in fade-in slide-in-from-top-2">
          <span className="text-xs font-semibold text-foreground px-2.5 py-1 bg-primary/10 rounded-lg whitespace-nowrap">
            {selectedRowsIds.length} selected
          </span>
          <div className="h-3.5 w-px bg-border mx-1 shrink-0" />
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 whitespace-nowrap cursor-pointer"
            onClick={() => handleBulkAction("APPROVED")}
            disabled={bulkLoading}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs font-medium border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 whitespace-nowrap cursor-pointer"
            onClick={() => handleBulkAction("PAUSED")}
            disabled={bulkLoading}
          >
            Pause
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs font-medium border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 whitespace-nowrap cursor-pointer"
            onClick={() => handleBulkAction("DISABLED")}
            disabled={bulkLoading}
          >
            Disable
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
            onClick={() => setRowSelection({})}
          >
            Deselect all
          </Button>
        </div>
      )}

      {/* ── Standard AdminTable ────────────────────────────────────────── */}
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

export default EventList;
