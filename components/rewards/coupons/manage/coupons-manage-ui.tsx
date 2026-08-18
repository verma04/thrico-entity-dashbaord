"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Ticket,
  CheckCircle2,
  Ban,
  Sparkles,
  RotateCw,
  Gamepad2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CouponsGrid } from "./coupons-grid";
import { CouponsList } from "./coupons-list";

export const STATUS_TABS = [
  {
    value: "ALL",
    label: "All Statuses",
    icon: Ticket,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "ACTIVE",
    label: "Active",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    icon: Ban,
    dot: "bg-rose-500",
    color: "text-rose-600 dark:text-rose-400",
  },
] as const;

export type RewardStatusValue = (typeof STATUS_TABS)[number]["value"];

export const MECHANISM_OPTIONS = [
  { value: "ALL", label: "All Mechanisms", icon: Ticket },
  { value: "COUPON", label: "Standard Coupon", icon: Ticket },
  { value: "SCRATCH_CARD", label: "Scratch Card", icon: Sparkles },
  { value: "SPIN_WHEEL", label: "Spin Wheel", icon: RotateCw },
  { value: "MATCH_AND_WIN", label: "Match & Win", icon: Gamepad2 },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A–Z" },
  { value: "cost-desc", label: "Cost (High to Low)" },
  { value: "cost-asc", label: "Cost (Low to High)" },
  { value: "redeemed-desc", label: "Redeemed (High to Low)" },
];

/** View-mode toggle: Grid / List */
export function ViewToggle({
  value,
  onChange,
}: {
  value: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as "grid" | "list")}
      className="bg-muted p-0.5 rounded-lg border border-border"
    >
      <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
        <TabsTrigger
          value="grid"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          Grid
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
        >
          <ListIcon className="h-3.5 w-3.5 mr-1.5" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

/** Status section bar — appears between action bar and content when filtering by non-ALL status */
export function SectionHeader({
  status,
  count,
  loading,
}: {
  status: string;
  count: number;
  loading: boolean;
}) {
  const tab = STATUS_TABS.find((t) => t.value === status) ?? STATUS_TABS[0];
  const Icon = tab.icon;

  if (status === "ALL" || status === "all") return null;

  return (
    <div className="flex items-center gap-3 pb-1">
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          tab.color,
        )}
      >
        {tab.dot && (
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0 animate-pulse",
              tab.dot,
            )}
          />
        )}
        <Icon className="h-4 w-4" />
        <span>{tab.label} Rewards</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "reward" : "rewards"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Area with animated transitions
// ─────────────────────────────────────────────────────────────────────────────

interface ContentAreaProps {
  view: "grid" | "list";
  loading: boolean;
  rewards: any[];
  onOpenUploadForReward: (rewardId: string) => void;
  onManageVouchers: (rewardId: string) => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ContentArea({
  view,
  loading,
  rewards,
  onOpenUploadForReward,
  onManageVouchers,
  visibleColumns,
  offset = 0,
}: ContentAreaProps) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          {view === "grid" ? (
            /* 4-5 column compact card skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs space-y-3"
                >
                  <Skeleton className="h-28 w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List table row skeleton */
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
                {[40, 180, 100, 100, 80, 100, 80, 40].map((w, i) => (
                  <Skeleton
                    key={i}
                    className="h-2.5 rounded"
                    style={{ width: w }}
                  />
                ))}
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-3 border-b border-border/40 last:border-0"
                >
                  <Skeleton className="h-3 w-6 rounded" />
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-36 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded hidden sm:block" />
                  <Skeleton className="h-3 w-16 rounded hidden md:block" />
                  <Skeleton className="h-5 w-16 rounded hidden lg:block" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {view === "grid" ? (
            <CouponsGrid
              rewards={rewards}
              onOpenUploadForReward={onOpenUploadForReward}
              onManageVouchers={onManageVouchers}
            />
          ) : (
            <CouponsList
              rewards={rewards}
              onOpenUploadForReward={onOpenUploadForReward}
              onManageVouchers={onManageVouchers}
              visibleColumns={visibleColumns}
              offset={offset}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
