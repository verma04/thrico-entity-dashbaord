"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, Plus, CheckCircle2, AlertTriangle, ArrowRight, Ticket, Upload, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InventoryGlanceProps {
  inventoryRewards?: any[];
  lowStockRewards?: any[];
  healthyRewards?: any[];
  rewardsLoading?: boolean;
  loading?: boolean;
  rewards?: any[];
}

const getStockColor = (remaining: number | undefined) => {
  if (remaining === undefined)
    return { text: "text-slate-500", bg: "bg-slate-100", bar: "bg-slate-300" };
  if (remaining <= 5)
    return { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", bar: "bg-rose-500" };
  if (remaining <= 10)
    return { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", bar: "bg-amber-500" };
  return {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    bar: "bg-emerald-500",
  };
};

const DEFAULT_INVENTORY_ITEMS = [
  {
    id: "1",
    title: "Flat ₹500 Swiggy Voucher",
    image: "",
    remainingVouchers: 3,
    totalVouchers: 50,
  },
  {
    id: "2",
    title: "Amazon Shopping Gift Card ₹250",
    image: "",
    remainingVouchers: 8,
    totalVouchers: 100,
  },
  {
    id: "3",
    title: "Uber Premier ₹100 Off Code",
    image: "",
    remainingVouchers: 42,
    totalVouchers: 150,
  },
  {
    id: "4",
    title: "Spotify Premium 1 Month Pass",
    image: "",
    remainingVouchers: 1,
    totalVouchers: 30,
  },
  {
    id: "5",
    title: "BookMyShow ₹300 Movie Ticket",
    image: "",
    remainingVouchers: 65,
    totalVouchers: 80,
  },
  {
    id: "6",
    title: "Starbucks Coffee Coupon",
    image: "",
    remainingVouchers: 19,
    totalVouchers: 50,
  },
];

export const InventoryGlance = ({
  inventoryRewards,
  lowStockRewards,
  healthyRewards,
  rewardsLoading,
  loading,
  rewards,
}: InventoryGlanceProps = {}) => {
  const [filter, setFilter] = useState<"all" | "low" | "healthy">("all");
  const isLoading = rewardsLoading ?? loading ?? false;

  const sourceRewards =
    rewards ||
    inventoryRewards ||
    DEFAULT_INVENTORY_ITEMS;

  const resolvedLowStock =
    lowStockRewards ??
    sourceRewards.filter(
      (r: any) =>
        r.remainingVouchers !== undefined && r.remainingVouchers <= 10
    );

  const resolvedHealthy =
    healthyRewards ??
    sourceRewards.filter(
      (r: any) =>
        r.remainingVouchers === undefined || r.remainingVouchers > 10
    );

  const allItems = inventoryRewards || sourceRewards;

  const displayList =
    filter === "low"
      ? resolvedLowStock
      : filter === "healthy"
        ? resolvedHealthy
        : [...resolvedLowStock, ...resolvedHealthy];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-primary" />
            Voucher Inventory &amp; Stock Health
          </span>
          <p className="text-[11px] text-muted-foreground">
            Track remaining codes across static pools, CSV batches, and automated vouchers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
              filter === "all"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All ({allItems.length})
          </button>
          <button
            onClick={() => setFilter("low")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1",
              filter === "low"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow-xs font-bold"
                : "text-muted-foreground hover:text-rose-600"
            )}
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            Low Stock ({resolvedLowStock.length})
          </button>
          <button
            onClick={() => setFilter("healthy")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
              filter === "healthy"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Healthy ({resolvedHealthy.length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border/60 animate-pulse bg-card">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayList.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
            <div className="h-12 w-12 bg-muted/60 rounded-2xl flex items-center justify-center border border-border">
              <Package className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {filter === "low" ? "No low-stock items" : "No inventory-tracked rewards"}
              </p>
              <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                {filter === "low"
                  ? "All tracked vouchers are healthy and well-stocked"
                  : "Enable inventory tracking on rewards to monitor code depletion"}
              </p>
            </div>
            <Link href="/gamification/rewards/coupons/create">
              <Button size="sm" className="gap-2 rounded-xl text-xs mt-1">
                <Plus className="h-3 w-3" />
                Create tracked reward
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayList.slice(0, 6).map((reward: any) => {
              const remaining = reward.remainingVouchers;
              const total = reward.totalVouchers || 0;
              const pct =
                total > 0
                  ? Math.round((remaining / total) * 100)
                  : remaining > 0
                    ? 100
                    : 0;
              const colors = getStockColor(remaining);

              return (
                <div
                  key={reward.id}
                  className="group flex items-start gap-3.5 p-4 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xs transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted/70 border border-border/50 overflow-hidden shrink-0 flex items-center justify-center">
                    {reward.image ? (
                      <img
                        src={reward.image}
                        alt={reward.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Ticket className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                        {reward.title}
                      </h4>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold border shrink-0",
                          colors.bg,
                          colors.text
                        )}
                      >
                        {remaining !== undefined && remaining <= 5 ? (
                          <>
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Critical
                          </>
                        ) : remaining !== undefined && remaining <= 10 ? (
                          <>
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Low
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            OK
                          </>
                        )}
                      </span>
                    </div>

                    {/* Stock Meter */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            colors.bar
                          )}
                          style={{ width: `${Math.max(pct, 3)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={cn("font-bold tabular-nums", colors.text)}>
                          {remaining ?? "∞"} remaining
                        </span>
                        {total > 0 && (
                          <span className="text-muted-foreground font-medium tabular-nums">
                            of {total}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
