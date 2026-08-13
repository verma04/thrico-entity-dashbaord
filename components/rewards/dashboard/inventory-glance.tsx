import React from "react";
import Link from "next/link";
import { Package, Plus, CheckCircle2, AlertTriangle, ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InventoryGlanceProps {
  inventoryRewards: any[];
  lowStockRewards: any[];
  healthyRewards: any[];
  rewardsLoading: boolean;
}

const getStockColor = (remaining: number | undefined) => {
  if (remaining === undefined)
    return { text: "text-slate-500", bg: "bg-slate-100", bar: "bg-slate-300" };
  if (remaining <= 5)
    return { text: "text-rose-600", bg: "bg-rose-50", bar: "bg-rose-500" };
  if (remaining <= 10)
    return { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" };
  return {
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    bar: "bg-emerald-500",
  };
};

export const InventoryGlance = ({
  inventoryRewards,
  lowStockRewards,
  healthyRewards,
  rewardsLoading,
}: InventoryGlanceProps) => {
  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Inventory at a Glance"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="p-5 rounded-[20px] bg-white dark:bg-card border border-border shadow-sm">
        {rewardsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border animate-pulse">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : inventoryRewards.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center mt-2">
            <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center border border-border">
              <Package className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                No inventory-tracked rewards
              </p>
              <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
                Enable inventory tracking on a reward to monitor stock levels here
              </p>
            </div>
            <Link href="/gamification/rewards/coupons/create">
              <Button variant="outline" size="sm" className="gap-2 rounded-full text-xs mt-1">
                <Plus className="h-3 w-3" />
                Create reward
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="flex items-center gap-4 mt-4 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-foreground font-bold tabular-nums">
                  {healthyRewards.length}
                </span>
                <span className="text-muted-foreground">healthy</span>
              </div>
              {lowStockRewards.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-foreground font-bold tabular-nums">
                    {lowStockRewards.length}
                  </span>
                  <span className="text-muted-foreground">low stock</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground font-bold tabular-nums">
                  {inventoryRewards.length}
                </span>
                <span className="text-muted-foreground">tracked</span>
              </div>
            </div>

            {/* Reward inventory cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Show low stock first, then healthy */}
              {[...lowStockRewards, ...healthyRewards]
                .slice(0, 9)
                .map((reward: any) => {
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
                      className="group flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card hover:border-indigo-200/60 hover:shadow-sm transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 border border-border/50 overflow-hidden shrink-0 flex items-center justify-center">
                        {reward.image ? (
                          <img
                            src={reward.image}
                            alt={reward.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Ticket className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-foreground truncate leading-tight">
                            {reward.title}
                          </h4>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0",
                              remaining !== undefined && remaining <= 10
                                ? "bg-rose-50 text-rose-600 border border-rose-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100",
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

                        {/* Stock bar */}
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-700",
                                colors.bar,
                              )}
                              style={{
                                width: `${Math.max(pct, 2)}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={cn("font-bold tabular-nums", colors.text)}>
                              {remaining ?? "∞"} remaining
                            </span>
                            {total > 0 && (
                              <span className="text-muted-foreground/60 tabular-nums">
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

            {/* View all link */}
            {inventoryRewards.length > 9 && (
              <div className="mt-4 pt-4 border-t border-border">
                <Link href="/gamification/rewards/coupons">
                  <Button variant="outline" size="sm" className="w-full gap-2 rounded-lg">
                    View all {inventoryRewards.length} tracked rewards
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
