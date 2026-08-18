"use client";

import React from "react";
import {
  ShoppingCart,
  Calendar,
  Clock,
  Gift,
  DollarSign,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { ShopifyOrderActions } from "./shopify-order-actions";
import { cn } from "@/lib/utils";
import moment from "moment";

interface ShopifyOrderCardCompactProps {
  order: any;
  refetch?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; bar: string }
> = {
  PAID: {
    label: "Paid",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "#10b981",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "#f59e0b",
  },
  REFUNDED: {
    label: "Refunded",
    bg: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500",
    bar: "#8b5cf6",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "#f43f5e",
  },
};

export function ShopifyOrderCardCompact({
  order,
  refetch,
}: ShopifyOrderCardCompactProps) {
  const statusKey = order.status?.toUpperCase() || "PENDING";
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  const user = order.user;
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Customer"
    : order.userId || "Unknown Customer";
  const initials = displayName.length >= 2 ? displayName.substring(0, 2).toUpperCase() : "U";

  const points = order.reward?.pointsEarned;

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
            Order #{order.shopifyOrderId}
          </span>

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>

          {points != null && points > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Gift className="h-2.5 w-2.5" />
              +{points} pts
            </span>
          )}
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <ShopifyOrderActions order={order} refetch={refetch} />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 pt-0.5">
            {user ? (
              <UserProfileHoverCard user={user}>
                <Avatar className="h-9 w-9 rounded-full border border-border/60 shrink-0 cursor-pointer">
                  {user.avatar ? (
                    <AvatarImage
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `https://cdn.thrico.network/${user.avatar}`
                      }
                      alt={displayName}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </UserProfileHoverCard>
            ) : (
              <Avatar className="h-9 w-9 rounded-full border border-border/60 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
                title={displayName}
              >
                {displayName}
              </h3>
              <span className="text-[10px] text-muted-foreground truncate mt-0.5">
                {user?.email || `Customer ID: ${order.userId || "—"}`}
              </span>
            </div>
          </div>

          {/* Total Price */}
          <div className="pt-1 flex items-baseline gap-1">
            <span className="text-sm font-bold font-mono text-foreground">
              {order.totalPrice != null
                ? Number(order.totalPrice).toFixed(2)
                : "0.00"}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              {order.currency || "USD"}
            </span>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{order.createdAt ? moment(order.createdAt).format("MMM D, YYYY") : "—"}</span>
          </div>

          {order.updatedAt && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{moment(order.updatedAt).fromNow()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopifyOrderCardCompact;
