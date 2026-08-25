"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Ticket,
  Layers,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ManualRewardCard, ManualRewardItem } from "./manual-reward-card";
import { ManualRewardGrid } from "./manual-reward-grid";
import { ManualRewardList } from "./manual-reward-list";

export const MANUAL_STATUS_TABS = [
  {
    value: "ALL",
    label: "All Vouchers",
    icon: Ticket,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "ONE_TO_ONE",
    label: "1:1 Serial Pools",
    icon: Layers,
    dot: "bg-emerald-500",
    color: "text-emerald-600",
  },
  {
    value: "ONE_TO_MANY",
    label: "1:N Shared Promos",
    icon: Users,
    dot: "bg-blue-500",
    color: "text-blue-600",
  },
  {
    value: "ACTIVE",
    label: "Active Vouchers",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    color: "text-emerald-600",
  },
  {
    value: "DRAFT",
    label: "Drafts / Inactive",
    icon: Clock,
    dot: "bg-amber-500",
    color: "text-amber-600",
  },
] as const;

export type ManualStatusValue = (typeof MANUAL_STATUS_TABS)[number]["value"];

/** View-mode toggle: Grid / List (Identical to member/all) */
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
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium cursor-pointer"
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          Grid
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium cursor-pointer"
        >
          <ListIcon className="h-3.5 w-3.5 mr-1.5" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

/** Status section bar — appears above the content */
export function SectionHeader({
  status,
  count,
  loading,
}: {
  status: ManualStatusValue;
  count: number;
  loading: boolean;
}) {
  const currentTab =
    MANUAL_STATUS_TABS.find((t) => t.value === status) ?? MANUAL_STATUS_TABS[0];
  const Icon = currentTab.icon;

  if (status === "ALL") return null;

  return (
    <div className="flex items-center gap-3 pb-1">
      <div className={cn("flex items-center gap-2 text-sm font-semibold", currentTab.color)}>
        {currentTab.dot && (
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0 animate-pulse",
              currentTab.dot
            )}
          />
        )}
        <Icon className="h-4 w-4" />
        <span>{currentTab.label}</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "voucher" : "vouchers"}
        </span>
      )}
    </div>
  );
}

/** Animated ContentArea matching member/all */
export function ContentArea({
  view,
  loading,
  rewards,
  currencyName,
  visibleColumns,
  offset = 0,
  onSimulateWin,
  onManagePool,
  onEdit,
  onCreateClick,
}: {
  view: "grid" | "list";
  loading: boolean;
  rewards: ManualRewardItem[];
  currencyName: string;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
  onSimulateWin?: (reward: ManualRewardItem) => void;
  onManagePool?: (reward: ManualRewardItem) => void;
  onEdit?: (reward: ManualRewardItem) => void;
  onCreateClick?: () => void;
}) {
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
            /* 4-5 column compact card skeleton matching member/all */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs space-y-3"
                >
                  <Skeleton className="h-28 w-full rounded-none" />
                  <div className="p-3 pt-0 space-y-2.5">
                    <Skeleton className="h-3.5 w-4/5 rounded" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List table row skeleton matching member/all */
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
                {[80, 160, 100, 100, 80, 80, 70, 60].map((w, i) => (
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
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-32 rounded" />
                    <Skeleton className="h-2.5 w-20 rounded" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-md hidden sm:block" />
                  <Skeleton className="h-3 w-24 rounded font-mono hidden md:block" />
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-5 w-14 rounded-md" />
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
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {view === "grid" ? (
            <ManualRewardGrid
              rewards={rewards}
              loading={false}
              currencyName={currencyName}
              onSimulateWin={onSimulateWin}
              onManagePool={onManagePool}
              onEdit={onEdit}
              onCreateClick={onCreateClick}
            />
          ) : (
            <ManualRewardList
              rewards={rewards}
              loading={false}
              currencyName={currencyName}
              visibleColumns={visibleColumns}
              offset={offset}
              onSimulateWin={onSimulateWin}
              onManagePool={onManagePool}
              onEdit={onEdit}
              onCreateClick={onCreateClick}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
