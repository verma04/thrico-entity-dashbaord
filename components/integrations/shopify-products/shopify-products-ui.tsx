"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Package,
  CheckCircle2,
  FileText,
  Archive,
  RefreshCw,
  ExternalLink,
  Radio,
  Clock,
  Layers,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import moment from "moment";
import { ShopifyProductGrid } from "./shopify-product-grid";
import { ShopifyProductsList } from "./shopify-products-list";

export const STATUS_TABS = [
  {
    value: "ALL",
    label: "All Statuses",
    icon: Package,
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
    value: "DRAFT",
    label: "Draft",
    icon: FileText,
    dot: "bg-amber-500",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Archive,
    dot: "bg-slate-500",
    color: "text-slate-600 dark:text-slate-400",
  },
] as const;

export type ShopifyProductStatusValue = (typeof STATUS_TABS)[number]["value"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A–Z" },
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

/** Product Sync Information Diagnostic Banner */
export interface ShopifyProductSyncBannerProps {
  shopDomain?: string;
  lastSyncAt?: string;
  syncStatus?: string;
  totalSynced?: number;
  activeCount?: number;
  draftCount?: number;
  syncing?: boolean;
  onSync?: () => void;
}

export function ShopifyProductSyncBanner({
  shopDomain,
  lastSyncAt,
  syncStatus = "OPERATIONAL",
  totalSynced = 0,
  activeCount = 0,
  draftCount = 0,
  syncing = false,
  onSync,
}: ShopifyProductSyncBannerProps) {
  const normalizedShopUrl = shopDomain
    ? `https://${shopDomain.replace(/^https?:\/\//, "")}/admin/products`
    : null;

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-r from-card via-card to-muted/20 p-4 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Store Connection & Status Info */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Radio className="h-4.5 w-4.5 animate-pulse" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground">
                Shopify Catalog Sync
              </span>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-1.5 py-0 h-4.5 gap-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                {syncStatus || "Live Connected"}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
              {shopDomain && (
                <span className="flex items-center gap-1 font-mono text-foreground font-medium">
                  {shopDomain}
                  {normalizedShopUrl && (
                    <a
                      href={normalizedShopUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Open Shopify Products Admin"
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </span>
              )}
              {shopDomain && <span>•</span>}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                {lastSyncAt
                  ? `Last synced ${moment(lastSyncAt).fromNow()}`
                  : "Continuous automated webhook sync"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Metrics & Sync CTA */}
        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="font-bold text-foreground font-mono">{totalSynced}</span>
              <span className="text-muted-foreground">Total</span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="font-bold font-mono">{activeCount}</span>
              <span className="text-muted-foreground">Active</span>
            </div>
            {draftCount > 0 && (
              <>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span className="font-bold font-mono">{draftCount}</span>
                  <span className="text-muted-foreground">Draft</span>
                </div>
              </>
            )}
          </div>

          {onSync && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSync}
              disabled={syncing}
              className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-border bg-card shadow-2xs hover:bg-muted"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", syncing && "animate-spin")}
              />
              {syncing ? "Syncing Catalog…" : "Sync Catalog"}
            </Button>
          )}
        </div>
      </div>
    </div>
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
        <span>{tab.label} Products</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "product" : "products"}
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
  products: any[];
  shopDomain?: string;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ContentArea({
  view,
  loading,
  products,
  shopDomain,
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
                    <Skeleton className="h-3 w-1/2 rounded" />
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
                {[40, 200, 100, 100, 100].map((w, i) => (
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
                    <Skeleton className="h-3.5 w-40 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded hidden sm:block" />
                  <Skeleton className="h-3 w-20 rounded hidden md:block" />
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
            <ShopifyProductGrid
              products={products}
              shopDomain={shopDomain}
              refetch={refetch}
            />
          ) : (
            <ShopifyProductsList
              products={products}
              shopDomain={shopDomain}
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
