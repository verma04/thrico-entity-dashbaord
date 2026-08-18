"use client";

import React from "react";
import {
  Package,
  Calendar,
  Clock,
} from "lucide-react";
import { ShopifyProductActions } from "./shopify-product-actions";
import { cn } from "@/lib/utils";
import moment from "moment";

interface ShopifyProductCardCompactProps {
  product: any;
  refetch?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; bar: string }
> = {
  ACTIVE: {
    label: "Active",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "#10b981",
  },
  DRAFT: {
    label: "Draft",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "#f59e0b",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-500",
    bar: "#64748b",
  },
};

export function ShopifyProductCardCompact({
  product,
  refetch,
}: ShopifyProductCardCompactProps) {
  const statusKey = product.status?.toUpperCase() || "ACTIVE";
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: statusInfo.bar }}
      />

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
            Shopify
          </span>

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <ShopifyProductActions product={product} refetch={refetch} />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5 pt-0.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
              <Package className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                title={product.title}
              >
                {product.title || "Untitled Product"}
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                ID: {product.shopifyProductId || product.id}
              </span>
            </div>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{product.createdAt ? moment(product.createdAt).format("MMM D, YYYY") : "—"}</span>
          </div>

          {product.updatedAt && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{moment(product.updatedAt).fromNow()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopifyProductCardCompact;
