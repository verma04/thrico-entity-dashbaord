"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Ticket, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InventoryItem {
  id: string;
  title: string;
  totalVouchers: number;
  redeemedCount: number;
  remainingVouchers: number;
  // still needed for UI
  expiringSoon?: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
}

export function InventoryTable({ items, isLoading }: InventoryTableProps) {
  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "title",
      header: "Coupon",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-blue-500/5 flex items-center justify-center">
            <Ticket className="h-4 w-4 text-blue-500/60" />
          </div>
          <span className="font-bold text-foreground">
            {row.original.title}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "totalVouchers",
      header: "Total Uploaded",
      cell: ({ row }) => (
        <span className="font-mono font-medium">
          {row.original.totalVouchers || 0}
        </span>
      ),
    },
    {
      accessorKey: "redeemedCount",
      header: "Allocated",
      cell: ({ row }) => (
        <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
          {row.original.redeemedCount || 0}
        </span>
      ),
    },
    {
      accessorKey: "remainingVouchers",
      header: "Remaining",
      cell: ({ row }) => {
        const remaining = row.original.remainingVouchers || 0;
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono font-bold",
                remaining < 10 ? "text-rose-600" : "text-emerald-600",
              )}
            >
              {remaining}
            </span>
            {remaining < 10 && (
              <AlertTriangle className="h-3 w-3 text-rose-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "expiringSoon",
      header: "Expiring Soon",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "font-bold",
            (row.original.expiringSoon || 0) > 0
              ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-muted-foreground",
          )}
        >
          {row.original.expiringSoon || 0}
        </Badge>
      ),
    },
  ];

  return <DataTable columns={columns} data={items} isLoading={isLoading} />;
}
