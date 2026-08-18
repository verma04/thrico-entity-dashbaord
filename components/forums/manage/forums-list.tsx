"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { discussionForm } from "../ts-types";
import { ForumActions } from "./forum-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getForumTableColumns = (
  singularName: string,
  refetch?: () => void,
): AdminTableColumn<discussionForm>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "forum",
    header: singularName,
    cell: (row) => (
      <div className="flex flex-col min-w-[200px]">
        <Link
          href={`/forums/${row.id}/manage`}
          className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[240px] hover:text-primary hover:underline transition-colors"
          title={row.title}
        >
          {row.title}
        </Link>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground truncate max-w-[200px]">
          <span className="truncate">{row.category?.name || "General"}</span>
        </div>
      </div>
    ),
  },
  {
    key: "upvotes",
    header: "Upvotes",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={ThumbsUp}
        value={row.upVotes || 0}
        variant="emerald"
      />
    ),
  },
  {
    key: "downvotes",
    header: "Downvotes",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={ThumbsDown}
        value={row.downVotes || 0}
        variant="amber"
      />
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
    key: "created",
    header: "Created",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
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
            <span>Anonymous</span>
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
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => <ForumActions forum={row} refetch={refetch} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ForumsListProps {
  forums: discussionForm[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ForumsList({
  forums,
  refetch,
  visibleColumns,
  offset = 0,
}: ForumsListProps) {
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const baseColumns = React.useMemo(
    () => getForumTableColumns(singularName, refetch),
    [singularName, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<discussionForm>
        columns={activeColumns}
        data={forums}
        keyExtractor={(f) => f.id}
        emptyIcon={MessageSquare}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ForumsList;
