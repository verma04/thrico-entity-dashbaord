import React from "react";
import { Package, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryTable } from "@/components/rewards/inventory/inventory-table";

interface InventoryStatusTabProps {
  totalTracked: number;
  healthyCount: number;
  lowStockCount: number;
  inventoryItems: any[];
  isLoading: boolean;
}

export function InventoryStatusTab({
  totalTracked,
  healthyCount,
  lowStockCount,
  inventoryItems,
  isLoading,
}: InventoryStatusTabProps) {
  return (
    <div className="px-6 space-y-6 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active Tracking",
            value: totalTracked,
            desc: "Rewards with inventory logic",
            icon: Package,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Optimal Logic",
            value: healthyCount,
            desc: "Stock above safety margin",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Critical Stock",
            value: lowStockCount,
            desc:
              lowStockCount > 0
                ? "Immediate restock required"
                : "All nodes fully saturated",
            icon: AlertTriangle,
            color: lowStockCount > 0 ? "text-rose-600" : "text-zinc-400",
            bg: lowStockCount > 0 ? "bg-rose-50" : "bg-zinc-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02]"
          >
            <div
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/40 shadow-inner",
                stat.bg,
              )}
            >
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-foreground tabular-nums leading-tight mt-1">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/70">
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <InventoryTable items={inventoryItems} isLoading={isLoading} />
      </div>
    </div>
  );
}
