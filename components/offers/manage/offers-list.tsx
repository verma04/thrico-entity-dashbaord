"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Eye,
  Users,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Percent,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Offer, useChangeOfferStatus } from "@/graphql/actions/offers";
import { OfferActions } from "./offer-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableText,
  AdminTableTag,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions matching member/all and events table architecture
// ─────────────────────────────────────────────────────────────────────────────

export const getOfferTableColumns = (
  singularName: string,
  onEdit?: (offer: Offer) => void,
  refetch?: () => void,
  router?: ReturnType<typeof useRouter>,
  rowSelection?: Record<string, boolean>,
  onToggleRow?: (index: number, checked: boolean) => void,
): AdminTableColumn<Offer>[] => [
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
    cell: (row) => (
      <OfferActions offer={row} onEdit={onEdit} refetch={refetch} />
    ),
  },
  {
    key: "offer",
    header: singularName,
    cell: (row) => {
      const coverUrl = row.image
        ? row.image.startsWith("http")
          ? row.image
          : `https://cdn.thrico.network/${row.image}`
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
          fallbackText={row.title?.slice(0, 2).toUpperCase() || "OF"}
          shape="square"
          maxTitleWidth="max-w-[240px]"
          onClick={() => {
            if (router) {
              router.push(`/offers/${row.id}/manage`);
            } else {
              window.location.href = `/offers/${row.id}/manage`;
            }
          }}
        />
      );
    },
  },
  {
    key: "discount",
    header: "Discount",
    cell: (row) => (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 whitespace-nowrap">
        <Percent className="h-3 w-3 shrink-0" />
        {row.discount || "Special"}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    cell: (row) => (
      <AdminTableTag variant="purple">
        {row.category?.name || "General"}
      </AdminTableTag>
    ),
  },
  {
    key: "partner",
    header: "Partner / Location",
    cell: (row) => (
      <AdminTableText
        primary={row.company || "Direct Offer"}
        secondary={row.location || "Online / Global"}
        icon={row.company ? Building2 : MapPin}
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
    key: "validity",
    header: "Valid Until",
    cell: (row) => <AdminTableDate date={row.validityEnd || row.createdAt} format="MMM d, yyyy" />,
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
  const router = useRouter();
  const moduleName = useModuleStore((state) => state.offerModuleName) || "Offers";
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [changeStatus, { loading: bulkLoading }] = useChangeOfferStatus();

  const handleToggleRow = (index: number, checked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [index]: checked,
    }));
  };

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const isAllSelected = offers.length > 0 && selectedCount === offers.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setRowSelection({});
    } else {
      const all: Record<string, boolean> = {};
      offers.forEach((_, idx) => {
        all[idx] = true;
      });
      setRowSelection(all);
    }
  };

  const handleBulkStatus = async (
    action: "ACTIVATE" | "DEACTIVATE" | "EXPIRE" | "APPROVE" | "REJECT",
  ) => {
    const selectedIndexes = Object.entries(rowSelection)
      .filter(([_, val]) => val)
      .map(([idx]) => parseInt(idx, 10));

    const selectedOffers = selectedIndexes.map((idx) => offers[idx]).filter(Boolean);

    if (selectedOffers.length === 0) return;

    try {
      await Promise.all(
        selectedOffers.map((o) =>
          changeStatus({
            variables: {
              input: {
                id: o.id,
                action,
              },
            },
          }),
        ),
      );
      toast.success(`Updated ${selectedOffers.length} ${singularName.toLowerCase()}(s) to ${action.toLowerCase()}`);
      setRowSelection({});
      if (refetch) {
        refetch();
      }
    } catch {
      toast.error(`Failed to update some ${singularName.toLowerCase()}s`);
    }
  };

  const baseColumns = useMemo(
    () =>
      getOfferTableColumns(
        singularName,
        onEdit,
        refetch,
        router,
        rowSelection,
        handleToggleRow,
      ),
    [singularName, onEdit, refetch, router, rowSelection],
  );

  const activeColumns = useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      {/* Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">
              {selectedCount} {selectedCount === 1 ? singularName : moduleName} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAll}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
            >
              {isAllSelected ? "Deselect all" : "Select all"}
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={bulkLoading}
              onClick={() => handleBulkStatus("ACTIVATE")}
              className="h-7 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={bulkLoading}
              onClick={() => handleBulkStatus("DEACTIVATE")}
              className="h-7 text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <Clock className="h-3 w-3 mr-1" />
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={bulkLoading}
              onClick={() => handleBulkStatus("EXPIRE")}
              className="h-7 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Expire
            </Button>
          </div>
        </div>
      )}

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

