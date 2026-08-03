"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AppDataTable } from "@/components/ui/app-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  ExternalLink,
  MoreVertical,
  Pause,
  Play,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Coupon {
  id: string;
  title: string;
  image?: string;
  inventoryRequired: boolean;
  tcCost: number;
  status: string;
  isActive: boolean;
  totalUsageLimit?: number;
  redeemedCount?: number;
  inventoryCount?: number;
}

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading: boolean;
}

export function CouponsTable({ coupons, isLoading }: CouponsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Draft":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Paused":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Archived":
        return "text-muted-foreground bg-muted border-transparent";
      default:
        return "text-muted-foreground bg-muted border-transparent";
    }
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "title",
      header: "Coupon Name",
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {coupon.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${coupon.image}`}
                  alt={coupon.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Ticket className="h-5 w-5 text-primary/60" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground leading-tight">
                {coupon.title}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                ID: {coupon.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "inventoryRequired",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-medium">
          {row.original.inventoryRequired ? "External" : "Internal"}
        </Badge>
      ),
    },
    {
      accessorKey: "tcCost",
      header: "TC Cost",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <div className="h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] text-amber-900 border border-amber-500/20 shadow-sm">
            TC
          </div>
          {row.original.tcCost}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0 h-4",
            getStatusColor(row.original.status),
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "inventory",
      header: "Inventory",
      cell: ({ row }) => {
        const coupon = row.original;
        if (!coupon.inventoryRequired) return "Unlimited";
        return (
          <span className="text-sm font-medium text-muted-foreground">
            {coupon.totalUsageLimit
              ? `${coupon.totalUsageLimit} total`
              : "Checking..."}
          </span>
        );
      },
    },
    {
      accessorKey: "redeemedCount",
      header: "Redeemed",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-foreground">
          {row.original.redeemedCount || 0}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                {coupon.status === "Active" ? (
                  <DropdownMenuItem className="gap-2 text-amber-600">
                    <Pause className="h-4 w-4" /> Pause
                  </DropdownMenuItem>
                ) : coupon.status === "Paused" || coupon.status === "Draft" ? (
                  <DropdownMenuItem className="gap-2 text-emerald-600">
                    <Play className="h-4 w-4" /> Activate
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem className="gap-2 text-destructive">
                  <ExternalLink className="h-4 w-4" /> Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <AppDataTable
      columns={columns}
      data={coupons}
      isLoading={isLoading}
      searchableColumns={[{ id: "title", placeholder: "Search rewards..." }]}
      isShowExportButtons={true}
      addItemPagePath="/rewards/vouchers/coupons/create"
    />
  );
}
