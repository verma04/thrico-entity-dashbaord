"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Offer } from "@/graphql/actions/offers";
import { Edit2, Trash2, Eye, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfferActions } from "./offer-actions";

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

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "title",
      header: "Offer",
      cell: ({ row }) => {
        const offer = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {offer.image ? (
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Tag className="h-6 w-6 text-primary/40" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground leading-tight">
                  {offer.title}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0 h-4",
                    getStatusColor(offer.status),
                  )}
                >
                  {offer.status}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                {offer.description}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <Badge
            variant="outline"
            className="gap-1.5 font-medium border-transparent bg-muted/50 text-foreground"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </Badge>
        );
      },
    },
    {
      id: "validity",
      header: "Validity",
      cell: ({ row }) => {
        const offer = row.original;
        return (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {format(new Date(offer.validityStart), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] opacity-70">
              <span>to</span>
              {format(new Date(offer.validityEnd), "MMM d, yyyy")}
            </div>
          </div>
        );
      },
    },
    {
      id: "stats",
      header: "Stats",
      cell: ({ row }) => {
        const offer = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-mono font-bold text-sm text-foreground">
                {offer.claimsCount}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Claims
              </span>
            </div>
            <div className="flex flex-col opacity-60">
              <span className="font-mono font-bold text-sm text-foreground">
                {offer.viewsCount}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Views
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <OfferActions
            offer={row.original}
            onEdit={onEdit}
            refetch={refetch}
          />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={offers} isLoading={isLoading} />;
}
