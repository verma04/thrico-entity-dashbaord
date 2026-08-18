"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Trophy,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardGrid } from "./leaderboard-grid";
import { LeaderboardTableList } from "./leaderboard-table-list";
import { LeaderboardEntry } from "@/graphql/actions";

export const SORT_OPTIONS = [
  { value: "rank-asc", label: "Rank (1 → N)" },
  { value: "points-desc", label: "Points (High to Low)" },
  { value: "badges-desc", label: "Badges (High to Low)" },
  { value: "wallet-desc", label: "Wallet Balance" },
  { value: "name", label: "Name A–Z" },
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

// ─────────────────────────────────────────────────────────────────────────────
// Content Area with animated transitions
// ─────────────────────────────────────────────────────────────────────────────

interface ContentAreaProps {
  view: "grid" | "list";
  loading: boolean;
  entries: LeaderboardEntry[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ContentArea({
  view,
  loading,
  entries,
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
                    <Skeleton className="h-5 w-14 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <div className="flex items-center gap-2.5 pt-1">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-3/4 rounded" />
                      <Skeleton className="h-2.5 w-1/2 rounded" />
                    </div>
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
                {[40, 180, 120, 80, 100, 120, 40].map((w, i) => (
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
                  <Skeleton className="h-6 w-6 rounded-md shrink-0" />
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-36 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded hidden sm:block" />
                  <Skeleton className="h-3 w-16 rounded hidden md:block" />
                  <Skeleton className="h-3 w-20 rounded hidden lg:block" />
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
            <LeaderboardGrid entries={entries} />
          ) : (
            <LeaderboardTableList
              entries={entries}
              visibleColumns={visibleColumns}
              offset={offset}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
