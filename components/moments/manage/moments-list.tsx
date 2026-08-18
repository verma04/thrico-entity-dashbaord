"use client";

import React from "react";
import {
  PlaySquare,
  Eye,
  Video,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moment } from "@/graphql/actions/moments";
import { MomentActions } from "./moment-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getMomentTableColumns = (
  singularName: string,
  onSelectMoment?: (m: Moment) => void,
  onDeleteMoment?: (id: string) => void,
): AdminTableColumn<Moment>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "moment",
    header: singularName,
    cell: (row) => {
      const thumbUrl = row.thumbnailUrl
        ? getPreferredMediaUrl(row.thumbnailUrl)
        : null;

      return (
        <div
          className="flex items-center gap-2.5 min-w-[200px] cursor-pointer group"
          onClick={() => onSelectMoment?.(row)}
        >
          <div className="relative h-9 w-9 rounded-lg border border-border/60 overflow-hidden bg-zinc-950 shrink-0 group-hover:border-primary transition-colors flex items-center justify-center">
            {thumbUrl ? (
              <img
                src={thumbUrl}
                alt={row.caption}
                className="w-full h-full object-cover"
              />
            ) : (
              <Video className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[240px] group-hover:text-primary transition-colors"
              title={row.caption}
            >
              {row.caption || "Untitled Moment"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "views",
    header: "Views",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Eye}
        value={row.totalViews || 0}
        variant="indigo"
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "created",
    header: "Created",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.owner) {
        return (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <Avatar className="h-5 w-5 rounded-full border border-primary/20">
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                EN
              </AvatarFallback>
            </Avatar>
            <span>Entity</span>
          </div>
        );
      }

      return (
        <UserProfileHoverCard user={row.owner}>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <Avatar className="h-5 w-5 rounded-full border border-border/60 shrink-0">
              <AvatarImage
                src={
                  row.owner.avatar?.startsWith("http")
                    ? row.owner.avatar
                    : `https://cdn.thrico.network/${row.owner.avatar}`
                }
                alt={`${row.owner.firstName || ""} ${row.owner.lastName || ""}`}
              />
              <AvatarFallback className="text-[8px] bg-muted font-bold">
                {row.owner.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium group-hover:text-primary transition-colors truncate max-w-[110px]">
              {row.owner.firstName} {row.owner.lastName}
            </span>
          </div>
        </UserProfileHoverCard>
      );
    },
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => (
      <MomentActions
        moment={row}
        onPreview={() => onSelectMoment?.(row)}
        onDelete={onDeleteMoment}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface MomentsListProps {
  moments: Moment[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
  onSelectMoment?: (m: Moment) => void;
  onDeleteMoment?: (id: string) => void;
}

export function MomentsList({
  moments,
  visibleColumns,
  offset = 0,
  onSelectMoment,
  onDeleteMoment,
}: MomentsListProps) {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const baseColumns = React.useMemo(
    () => getMomentTableColumns(singularName, onSelectMoment, onDeleteMoment),
    [singularName, onSelectMoment, onDeleteMoment],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<Moment>
        columns={activeColumns}
        data={moments}
        keyExtractor={(m) => m.id}
        emptyIcon={PlaySquare}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default MomentsList;
