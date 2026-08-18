"use client";

import React from "react";
import {
  Users,
  Calendar,
  Clock,
  Mail,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShopifyUserActions } from "./shopify-user-actions";
import { cn } from "@/lib/utils";
import moment from "moment";

interface ShopifyUserCardCompactProps {
  customer: any;
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
  DISABLED: {
    label: "Disabled",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "#f43f5e",
  },
};

export function ShopifyUserCardCompact({
  customer,
  shopDomain,
  refetch,
}: ShopifyUserCardCompactProps) {
  const statusKey = customer.status?.toUpperCase() || "ACTIVE";
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  const email = customer.email || "Unknown Customer";
  const initials = email.length >= 2 ? email.substring(0, 2).toUpperCase() : "SC";

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
          <ShopifyUserActions
            customer={customer}
            shopDomain={shopDomain}
            refetch={refetch}
          />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 pt-0.5">
            <Avatar className="h-9 w-9 rounded-full border border-border/60 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 flex-1">
              <h3
                className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
                title={email}
              >
                {email}
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                ID: {customer.shopifyCustomerId || customer.id}
              </span>
            </div>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{customer.createdAt ? moment(customer.createdAt).format("MMM D, YYYY") : "—"}</span>
          </div>

          {customer.lastSyncedAt && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span>Synced {moment(customer.lastSyncedAt).fromNow()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopifyUserCardCompact;
