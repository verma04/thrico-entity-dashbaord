"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  BarChart3,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PollGrid } from "./poll-grid";
import { PollsList } from "./polls-list";
import { poll, By } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

export const STATUS_TABS = [
  {
    value: "ALL",
    label: "All Statuses",
    icon: BarChart3,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    value: "DISABLED",
    label: "Disabled",
    icon: Ban,
    dot: "bg-orange-500",
    color: "text-orange-600 dark:text-orange-400",
  },
] as const;

export type PollStatusValue = (typeof STATUS_TABS)[number]["value"];

export const BY_OPTIONS = [
  { value: "ALL", label: "All Polls" },
  { value: By.ENTITY, label: "Admin Polls" },
  { value: By.USER, label: "User Polls" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A–Z" },
  { value: "votes", label: "Most Votes" },
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
  const moduleName = useModuleStore((state) => state.pollModuleName);
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
        <span>
          {tab.label} {moduleName}
        </span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "record" : "records"}
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
  polls: poll[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ContentArea({
  view,
  loading,
  polls,
  refetch,
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
                  className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs space-y-3 p-3.5"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <Skeleton className="h-4 w-4/5 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border/30">
                    <Skeleton className="h-5 w-full rounded-md" />
                    <Skeleton className="h-5 w-full rounded-md" />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/30">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List table row skeleton */
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
                {[40, 160, 120, 80, 70, 80, 100].map((w, i) => (
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
                  <Skeleton className="h-5 w-24 rounded hidden sm:block" />
                  <Skeleton className="h-3 w-16 rounded hidden md:block" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded hidden lg:block" />
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
            <PollGrid polls={polls} refetch={refetch} />
          ) : (
            <PollsList
              polls={polls}
              refetch={refetch}
              visibleColumns={visibleColumns}
              offset={offset}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
