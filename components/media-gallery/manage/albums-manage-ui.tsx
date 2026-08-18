"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Images,
  Star,
  Folder,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlbumsGrid } from "./albums-grid";
import { AlbumsList } from "./albums-list";

export const FILTER_TABS = [
  {
    value: "ALL",
    label: "All Albums",
    icon: Images,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "FEATURED",
    label: "Featured",
    icon: Star,
    dot: "bg-amber-500",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "REGULAR",
    label: "Regular",
    icon: Folder,
    dot: "bg-zinc-400",
    color: "text-zinc-600 dark:text-zinc-400",
  },
] as const;

export type AlbumFilterValue = (typeof FILTER_TABS)[number]["value"];

export const SORT_OPTIONS = [
  { value: "custom", label: "Custom Order" },
  { value: "title", label: "Title A–Z" },
  { value: "images-desc", label: "Most Photos" },
  { value: "images-asc", label: "Least Photos" },
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

/** Status section bar — appears between action bar and content when filtering by non-ALL filter */
export function SectionHeader({
  filter,
  count,
  loading,
}: {
  filter: string;
  count: number;
  loading: boolean;
}) {
  const tab = FILTER_TABS.find((t) => t.value === filter) ?? FILTER_TABS[0];
  const Icon = tab.icon;

  if (filter === "ALL" || filter === "all") return null;

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
        <span>{tab.label}</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "album" : "albums"}
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
  albums: any[];
  onEdit: (album: any) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  enableDrag?: boolean;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ContentArea({
  view,
  loading,
  albums,
  onEdit,
  onDelete,
  onClick,
  enableDrag = false,
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
                {[40, 200, 100, 100, 80].map((w, i) => (
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
                  <Skeleton className="h-4 w-6 rounded" />
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-36 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded hidden sm:block" />
                  <Skeleton className="h-4 w-12 rounded hidden md:block" />
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
            <AlbumsGrid
              albums={albums}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onClick}
              enableDrag={enableDrag}
            />
          ) : (
            <AlbumsList
              albums={albums}
              onEdit={onEdit}
              onDelete={onDelete}
              onClick={onClick}
              visibleColumns={visibleColumns}
              offset={offset}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
