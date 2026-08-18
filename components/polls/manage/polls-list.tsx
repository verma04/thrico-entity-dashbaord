"use client";

import React from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { poll } from "../ts-types";
import { PollActions } from "./poll-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getPollTableColumns = (
  singularName: string,
  refetch?: () => void,
): AdminTableColumn<poll>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "poll",
    header: singularName,
    cell: (row) => (
      <div className="flex flex-col min-w-[200px]">
        <Link
          href={`/polls/${row.id}/manage`}
          className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[240px] hover:text-primary hover:underline transition-colors"
          title={row.title}
        >
          {row.title}
        </Link>
        <div className="text-[10px] text-muted-foreground line-clamp-1 max-w-[240px] mt-0.5">
          {row.question}
        </div>
      </div>
    ),
  },
  {
    key: "options",
    header: "Options",
    cell: (row) => (
      <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
        {row.options?.slice(0, 2).map((opt, i) => (
          <span
            key={i}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border truncate max-w-[80px]"
            title={opt.text}
          >
            {opt.text}
          </span>
        ))}
        {(row.options?.length || 0) > 2 && (
          <span className="text-[10px] font-medium text-muted-foreground">
            +{(row.options?.length || 0) - 2}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "votes",
    header: "Votes",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={BarChart3}
        value={row.totalVotes || 0}
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
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.user) {
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
        <UserProfileHoverCard user={row.user}>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <Avatar className="h-5 w-5 rounded-full border border-border/60 shrink-0">
              <AvatarImage
                src={
                  row.user.avatar?.startsWith("http")
                    ? row.user.avatar
                    : `https://cdn.thrico.network/${row.user.avatar}`
                }
                alt={`${row.user.firstName || ""} ${row.user.lastName || ""}`}
              />
              <AvatarFallback className="text-[8px] bg-muted font-bold">
                {row.user.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium group-hover:text-primary transition-colors truncate max-w-[110px]">
              {row.user.firstName} {row.user.lastName}
            </span>
          </div>
        </UserProfileHoverCard>
      );
    },
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
    cell: (row) => <PollActions poll={row} refetch={refetch} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface PollsListProps {
  polls: poll[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function PollsList({
  polls,
  refetch,
  visibleColumns,
  offset = 0,
}: PollsListProps) {
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);

  const baseColumns = React.useMemo(
    () => getPollTableColumns(singularName, refetch),
    [singularName, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<poll>
        columns={activeColumns}
        data={polls}
        keyExtractor={(p) => p.id}
        emptyIcon={BarChart3}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default PollsList;
