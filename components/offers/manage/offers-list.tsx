"use client";

import React from "react";
import Link from "next/link";
import {
  Tag,
  Eye,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Offer } from "@/graphql/actions/offers";
import { OfferActions } from "./offer-actions";
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

export const getOfferTableColumns = (
  singularName: string,
  onEdit?: (offer: Offer) => void,
  refetch?: () => void,
): AdminTableColumn<Offer>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "offer",
    header: singularName,
    cell: (row) => {
      const coverUrl = row.image
        ? row.image.startsWith("http")
          ? row.image
          : `https://cdn.thrico.network/${row.image}`
        : null;

      return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <Link href={`/offers/${row.id}/manage`} className="shrink-0">
            <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 hover:border-primary transition-colors">
              {coverUrl ? (
                <AvatarImage
                  src={coverUrl}
                  alt={row.title}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                <Tag className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/offers/${row.id}/manage`}
              className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[220px] hover:text-primary hover:underline transition-colors"
              title={row.title}
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground truncate max-w-[200px]">
              <span className="truncate">{row.category?.name || "General"}</span>
              {row.company && (
                <>
                  <span>·</span>
                  <span className="truncate">{row.company}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: "discount",
    header: "Discount",
    cell: (row) => (
      <span className="font-mono text-[12px] font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
        {row.discount || "Special"}
      </span>
    ),
  },
  {
    key: "claims",
    header: "Claims",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Users}
        value={row.claimsCount || 0}
        variant="emerald"
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
        value={row.viewsCount || 0}
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
    key: "validity",
    header: "Validity",
    cell: (row) => <AdminTableDate date={row.validityEnd || row.createdAt} />,
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
    cell: (row) => (
      <OfferActions offer={row} onEdit={onEdit} refetch={refetch} />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface OffersListProps {
  offers: Offer[];
  onEdit?: (offer: Offer) => void;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function OffersList({
  offers,
  onEdit,
  refetch,
  visibleColumns,
  offset = 0,
}: OffersListProps) {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);

  const baseColumns = React.useMemo(
    () => getOfferTableColumns(singularName, onEdit, refetch),
    [singularName, onEdit, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<Offer>
        columns={activeColumns}
        data={offers}
        keyExtractor={(o) => o.id}
        emptyIcon={Tag}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default OffersList;
