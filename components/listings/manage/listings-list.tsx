"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Eye,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarketPlaceListing } from "@/graphql/actions/listing";
import { ListingActions } from "./listing-actions";
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

export const getListingTableColumns = (
  singularName: string,
): AdminTableColumn<MarketPlaceListing>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "listing",
    header: singularName,
    cell: (row) => {
      const coverUrl =
        row.media?.[0]?.url?.startsWith("http")
          ? row.media[0].url
          : row.media?.[0]?.url
            ? `https://cdn.thrico.network/${row.media[0].url}`
            : null;

      const locationStr =
        typeof row.location === "string"
          ? row.location
          : row.location?.name || row.location?.address || "";

      return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <Link href={`/listing/${row.id}/manage`} className="shrink-0">
            <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 hover:border-primary transition-colors">
              {coverUrl ? (
                <AvatarImage
                  src={coverUrl}
                  alt={row.title}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                {(row.title || "LS").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/listing/${row.id}/manage`}
              className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[220px] hover:text-primary hover:underline transition-colors"
              title={row.title}
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground truncate max-w-[200px]">
              <span className="truncate">{row.category || "General"}</span>
              {locationStr && (
                <>
                  <span>·</span>
                  <span className="truncate">{locationStr}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: "price",
    header: "Price",
    cell: (row) => (
      <span className="font-mono text-[12px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
        {row.currency || "₹"}{Number(row.price || 0).toLocaleString()}
      </span>
    ),
  },
  {
    key: "condition",
    header: "Condition",
    cell: (row) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tight bg-muted text-muted-foreground border-border">
        {row.condition?.replace(/_/g, " ") || "Good"}
      </span>
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
    key: "verification",
    header: "Verified",
    cell: (row) => (
      <AdminVerifiedBadge verified={!!row.verification?.isVerified} />
    ),
  },
  {
    key: "created",
    header: "Posted",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.postedBy) {
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
        <UserProfileHoverCard user={row.postedBy}>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <Avatar className="h-5 w-5 rounded-full border border-border/60 shrink-0">
              <AvatarImage
                src={
                  row.postedBy.avatar?.startsWith("http")
                    ? row.postedBy.avatar
                    : `https://cdn.thrico.network/${row.postedBy.avatar}`
                }
                alt={`${row.postedBy.firstName || ""} ${row.postedBy.lastName || ""}`}
              />
              <AvatarFallback className="text-[8px] bg-muted font-bold">
                {row.postedBy.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium group-hover:text-primary transition-colors truncate max-w-[110px]">
              {row.postedBy.firstName} {row.postedBy.lastName}
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
    cell: (row) => <ListingActions listing={row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ListingsListProps {
  listings: MarketPlaceListing[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ListingsList({
  listings,
  visibleColumns,
  offset = 0,
}: ListingsListProps) {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  const baseColumns = React.useMemo(
    () => getListingTableColumns(singularName),
    [singularName],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<MarketPlaceListing>
        columns={activeColumns}
        data={listings}
        keyExtractor={(l) => l.id}
        emptyIcon={Store}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ListingsList;
