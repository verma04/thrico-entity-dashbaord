"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Eye,
  Globe,
  Lock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { communityEntity } from "../ts-types";
import { CommunityActions } from "./community-actions";
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
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Privacy Badge
// ─────────────────────────────────────────────────────────────────────────────

function CommunityPrivacyBadge({ privacy }: { privacy?: string }) {
  const isPrivate = privacy?.toUpperCase() === "PRIVATE";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tight",
        isPrivate
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
          : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
      )}
    >
      {isPrivate ? (
        <Lock className="h-2.5 w-2.5 shrink-0" />
      ) : (
        <Globe className="h-2.5 w-2.5 shrink-0" />
      )}
      {isPrivate ? "Private" : "Public"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getCommunityTableColumns = (
  singularName: string,
): AdminTableColumn<communityEntity>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "community",
    header: singularName,
    cell: (row) => (
      <div className="flex items-center gap-2.5 min-w-[200px]">
        <Link href={`/communities/${row.id}/about`} className="shrink-0">
          <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 hover:border-primary transition-colors">
            <AvatarImage
              src={
                row.cover
                  ? `https://cdn.thrico.network/${row.cover}`
                  : undefined
              }
              alt={row.title}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
              {(row.title || "CO").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col min-w-0">
          <Link
            href={`/communities/${row.id}/about`}
            className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[220px] hover:text-primary hover:underline transition-colors"
            title={row.title}
          >
            {row.title}
          </Link>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px]">
            {row.tagline || row.communityType || "Community Ecosystem"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "privacy",
    header: "Access",
    cell: (row) => <CommunityPrivacyBadge privacy={row.privacy} />,
  },
  {
    key: "members",
    header: "Members",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Users}
        value={row.numberOfUser || 0}
        variant="indigo"
      />
    ),
  },
  {
    key: "posts",
    header: "Posts",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={MessageSquare}
        value={row.numberOfPost || 0}
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
      if (!row.creator) {
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
        <UserProfileHoverCard user={row.creator}>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <Avatar className="h-5 w-5 rounded-full border border-border/60 shrink-0">
              <AvatarImage
                src={
                  row.creator.avatar?.startsWith("http")
                    ? row.creator.avatar
                    : `https://cdn.thrico.network/${row.creator.avatar}`
                }
                alt={`${row.creator.firstName || ""} ${row.creator.lastName || ""}`}
              />
              <AvatarFallback className="text-[8px] bg-muted font-bold">
                {row.creator.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium group-hover:text-primary transition-colors truncate max-w-[110px]">
              {row.creator.firstName} {row.creator.lastName}
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
    cell: (row) => <CommunityActions record={row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface CommunitiesListProps {
  data: communityEntity[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function CommunitiesList({
  data,
  visibleColumns,
  offset = 0,
}: CommunitiesListProps) {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const baseColumns = React.useMemo(
    () => getCommunityTableColumns(singularName),
    [singularName],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<communityEntity>
        columns={activeColumns}
        data={data}
        keyExtractor={(c) => c.id}
        emptyIcon={Users}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default CommunitiesList;
