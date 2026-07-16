"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  AlertTriangle,
  TrendingUp,
  Archive,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface InventoryItem {
  id: string;
  title: string;
  totalVouchers: number;
  redeemedCount: number;
  remainingVouchers: number;
  expiringSoon?: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
}

export function InventoryTable({ items, isLoading }: InventoryTableProps) {
  const columns = [
    {
      key: "title",
      header: "Reward Identity",
      cell: (item: InventoryItem) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Ticket className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground text-sm truncate max-w-[200px]">
              {item?.title}
            </span>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">
              Stock Tracking Active
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total Lifecycle",
      cell: (item: InventoryItem) => (
        <div className="flex items-center gap-2">
          <Archive className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-mono text-[13px] font-black text-foreground">
            {(item?.totalVouchers || 0).toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "allocated",
      header: "Circulation",
      cell: (item: InventoryItem) => {
        const percentage =
          item?.totalVouchers > 0
            ? (item?.redeemedCount / item?.totalVouchers) * 100
            : 0;
        return (
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <div className="flex items-center justify-between text-xs font-bold leading-none">
              <span className="text-foreground">
                {item?.redeemedCount?.toLocaleString()}
              </span>
              <span className="text-muted-foreground opacity-60 text-[10px] uppercase font-black">
                {Math.round(percentage)}% Used
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "remaining",
      header: "Available Stock",
      cell: (item: InventoryItem) => {
        const remaining = item?.remainingVouchers || 0;
        const isLow = remaining < 10;
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                isLow ? "bg-rose-500 animate-pulse" : "bg-emerald-500",
              )}
            />
            <span
              className={cn(
                "font-mono text-[14px] font-black tracking-tight",
                isLow
                  ? "text-rose-600 underline decoration-rose-200"
                  : "text-emerald-600",
              )}
            >
              {remaining.toLocaleString()}
            </span>
            {isLow && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />}
          </div>
        );
      },
    },
    {
      key: "critical",
      header: "Expiring",
      cell: (item: InventoryItem) => {
        const expiring = item?.expiringSoon || 0;
        return (
          <div className="flex items-center gap-2 pr-4">
            <div
              className={cn(
                "px-2.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5",
                expiring > 0
                  ? "bg-amber-50 border-amber-200 text-amber-600"
                  : "bg-zinc-50 border-zinc-200 text-zinc-400",
              )}
            >
              <BarChart3 className="h-3 w-3" />
              {expiring} <span className="text-[9px] opacity-70">Soon</span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={items || []}
      loading={isLoading}
      keyExtractor={(item) => item?.id}
      emptyTitle="No inventory tracked"
      emptyDescription="Inventory tracking is automatically enabled for rewards requiring voucher codes. Upload codes to see analytics here."
    />
  );
}
