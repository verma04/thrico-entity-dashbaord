"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  CheckCircle2,
  Ban,
  Coins,
  Gift,
  ShoppingBag,
  Ticket,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MatchWinGrid } from "./match-win-grid";
import { MatchWinList } from "./match-win-list";
import { MatchWinCombination } from "./types";

export const STATUS_TABS = [
  {
    value: "ALL",
    label: "All Combinations",
    icon: Sparkles,
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

export const getRewardTypeFilterOptions = (currencyName: string = "Points") => [
  { value: "ALL", label: "All Reward Types", icon: Sparkles },
  { value: "COINS", label: `${currencyName} / Currency`, icon: Coins },
  { value: "GIFT_CARD", label: "Digital Gift Card", icon: Gift },
  { value: "ECOMMERCE", label: "Store Discount", icon: ShoppingBag },
  { value: "INTERNAL_VOUCHER", label: "Internal Voucher", icon: Ticket },
  { value: "NO_REWARDS", label: "Try Again (Loss)", icon: RotateCcw },
];

export const REWARD_TYPE_FILTER_OPTIONS = getRewardTypeFilterOptions();

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "key", label: "Identifier Key A–Z" },
  { value: "prob-desc", label: "Probability (High to Low)" },
  { value: "prob-asc", label: "Probability (Low to High)" },
  { value: "value-desc", label: "Prize Value (High to Low)" },
  { value: "value-asc", label: "Prize Value (Low to High)" },
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

/** Status section bar */
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
        <span>{tab.label} Combinations</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "rule" : "rules"}
        </span>
      )}
    </div>
  );
}

interface ContentAreaProps {
  view: "grid" | "list";
  loading: boolean;
  combinations: MatchWinCombination[];
  currencyName: string;
  onEdit?: (combination: MatchWinCombination) => void;
  onDelete: (id: string) => void;
  visibleColumns?: Record<string, boolean>;
}

export function ContentArea({
  view,
  loading,
  combinations,
  currencyName,
  onEdit,
  onDelete,
  visibleColumns,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {Array.from({ length: 8 }).map((_, i) => (
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
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
                {[40, 180, 100, 100, 100, 80, 40].map((w, i) => (
                  <Skeleton
                    key={i}
                    className="h-2.5 rounded"
                    style={{ width: w }}
                  />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
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
            <MatchWinGrid
              combinations={combinations}
              currencyName={currencyName}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <MatchWinList
              combinations={combinations}
              currencyName={currencyName}
              onEdit={onEdit}
              onDelete={onDelete}
              visibleColumns={visibleColumns}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
