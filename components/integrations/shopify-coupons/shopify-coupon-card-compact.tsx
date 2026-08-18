"use client";

import React from "react";
import {
  Tag,
  Zap,
  Calendar,
  Clock,
  Percent,
} from "lucide-react";
import { ShopifyCouponActions } from "./shopify-coupon-actions";
import { cn } from "@/lib/utils";
import moment from "moment";

interface ShopifyCouponCardCompactProps {
  coupon: any;
  shopDomain?: string;
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
  SCHEDULED: {
    label: "Scheduled",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "#f59e0b",
  },
  EXPIRED: {
    label: "Expired",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "#f43f5e",
  },
};

export function ShopifyCouponCardCompact({
  coupon,
  shopDomain,
  refetch,
}: ShopifyCouponCardCompactProps) {
  const statusKey = coupon.status?.toUpperCase() || "ACTIVE";
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  const primaryCode = coupon.code || (coupon.codes && coupon.codes[0]);

  const formatDiscountValue = () => {
    if (coupon.discountType === "PERCENTAGE" && coupon.value != null) {
      return `${coupon.value}% OFF`;
    }
    if (coupon.discountType === "FIXED_AMOUNT" && coupon.value != null) {
      return `${coupon.currency || "$"} ${Number(coupon.value).toFixed(2)} OFF`;
    }
    if (coupon.discountType === "FREE_SHIPPING") {
      return "Free Shipping";
    }
    if (coupon.discountType === "BXGY") {
      return "Buy X Get Y";
    }
    return coupon.discountType || "Discount";
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
          {coupon.isAutomatic ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="h-2.5 w-2.5" />
              Auto
            </span>
          ) : primaryCode ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
              {primaryCode}
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-muted text-muted-foreground border border-border">
              Coupon
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <ShopifyCouponActions
            coupon={coupon}
            shopDomain={shopDomain}
            refetch={refetch}
          />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-xs font-bold text-foreground bg-muted/60 border border-border/50 px-2 py-0.5 rounded">
              {formatDiscountValue()}
            </span>
          </div>

          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={coupon.title || primaryCode}
          >
            {coupon.title || primaryCode || "Untitled Coupon"}
          </h3>

          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {coupon.summary || `Shopify discount rule ID: ${coupon.id}`}
          </p>

          <div className="pt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Tag className="h-3 w-3 shrink-0" />
            <span>
              Used {coupon.timesUsed || 0}
              {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : " times"}
            </span>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{coupon.startsAt ? moment(coupon.startsAt).format("MMM D, YYYY") : "—"}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{coupon.endsAt ? `Exp ${moment(coupon.endsAt).format("MMM D")}` : "No expiry"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopifyCouponCardCompact;
