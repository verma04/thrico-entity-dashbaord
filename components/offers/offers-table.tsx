"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { Offer } from "@/graphql/actions/offers";
import { Calendar, Tag, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfferActions } from "./offer-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

interface OffersTableProps {
  offers: Offer[];
  isLoading: boolean;
  onEdit: (offer: Offer) => void;
  refetch: (variables?: any) => Promise<any>;
}

export function OffersTable({
  offers,
  isLoading,
  onEdit,
  refetch,
}: OffersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "INACTIVE":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "EXPIRED":
        return "text-rose-600 bg-rose-50 border-rose-200";
      default:
        return "text-muted-foreground bg-muted border-transparent";
    }
  };

  const columns = useMemo<AdminTableColumn<Offer>[]>(
    () => [
      {
        key: "title",
        header: "Offer",
        cell: (row) => {
          const offer = row;
          return (
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {offer.image ? (
                  <img
                    src={`https://cdn.thrico.network/${offer.image}`}
                    alt={offer.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Tag className="h-5 w-5 text-primary/40" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-foreground leading-tight truncate max-w-[180px]">
                  {offer.title}
                </span>
                <span className="text-[11px] text-muted-foreground truncate max-w-[180px] mt-0.5">
                  {offer.description || "No description"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "category",
        header: "Category",
        cell: (row) => {
          const category = row.category;
          return (
            <div className="flex items-center gap-1.5 text-[12px] text-foreground">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: category?.color || "#cbd5e1" }}
              />
              <span className="truncate max-w-[120px]">{category?.name || "—"}</span>
            </div>
          );
        },
      },
      {
        key: "discount",
        header: "Discount",
        cell: (row) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-muted text-foreground">
            {row.discount}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (row) => (
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wide font-bold",
              getStatusColor(row.status)
            )}
          >
            {row.status}
          </span>
        ),
      },
      {
        key: "creator",
        header: "Creator",
        cell: (row) => {
          const offer = row;
          if (!offer.creator) {
            return (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 rounded-full border border-border/60">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                    EN
                  </AvatarFallback>
                </Avatar>
                <span className="text-[12px] font-semibold text-muted-foreground">
                  Entity
                </span>
              </div>
            );
          }
          
          return (
            <UserProfileHoverCard user={offer.creator}>
              <div className="flex items-center gap-2 cursor-pointer group">
                <Avatar className="h-6 w-6 rounded-full border border-border/60">
                  <AvatarImage
                    src={
                      offer.creator.avatar
                        ? offer.creator.avatar.startsWith("http")
                          ? offer.creator.avatar
                          : `https://cdn.thrico.network/${offer.creator.avatar}`
                        : ""
                    }
                    alt={`${offer.creator.firstName} ${offer.creator.lastName}`}
                  />
                  <AvatarFallback className="text-[10px] bg-muted">
                    {offer.creator.firstName?.charAt(0)}
                    {offer.creator.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[12px] font-medium group-hover:text-primary transition-colors truncate max-w-[100px]">
                  {offer.creator.firstName} {offer.creator.lastName}
                </span>
              </div>
            </UserProfileHoverCard>
          );
        },
      },
      {
        key: "validity",
        header: "Validity",
        cell: (row) => {
          const offer = row;
          return (
            <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 shrink-0" />
                {format(new Date(offer.validityStart), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1.5 opacity-70">
                <span className="pl-4">to {format(new Date(offer.validityEnd), "MMM d, yyyy")}</span>
              </div>
            </div>
          );
        },
      },
      {
        key: "stats",
        header: "Stats",
        cell: (row) => {
          const offer = row;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-center">
                <span className="font-bold text-[12px] text-foreground">
                  {offer.claimsCount || 0}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Claims
                </span>
              </div>
              <div className="h-6 w-px bg-border/60"></div>
              <div className="flex flex-col text-center">
                <span className="font-bold text-[12px] text-foreground">
                  {offer.viewsCount || 0}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Views
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-12 text-right",
        className: "text-right",
        cell: (row) => (
          <OfferActions
            offer={row}
            onEdit={onEdit}
            refetch={refetch}
          />
        ),
      },
    ],
    [onEdit, refetch],
  );

  return (
    <AdminTable<Offer>
      columns={columns}
      data={offers}
      loading={isLoading}
      keyExtractor={(o) => o.id}
      emptyIcon={Tag}
      emptyTitle="No offers found"
      emptyDescription="Try adjusting your search or filter criteria."
    />
  );
}
