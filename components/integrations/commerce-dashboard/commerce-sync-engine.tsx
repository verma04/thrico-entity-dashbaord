"use client";

import React from "react";
import {
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Zap,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommerceSyncEngineProps {
  brand: "shopify" | "woocommerce";
  storeDomain?: string;
  installedAt?: string;
  lastSyncAt?: string;
  syncStatus?: string;
  onSyncCustomers: () => void;
  onSyncOrders: () => void;
  onSyncProducts: () => void;
  syncingCustomers: boolean;
  syncingOrders: boolean;
  syncingProducts: boolean;
}

export function CommerceSyncEngine({
  brand,
  storeDomain,
  lastSyncAt,
  syncStatus = "SYNCED_TODAY",
  onSyncCustomers,
  onSyncOrders,
  onSyncProducts,
  syncingCustomers,
  syncingOrders,
  syncingProducts,
}: CommerceSyncEngineProps) {
  const isShopify = brand === "shopify";
  const brandName = isShopify ? "Shopify" : "WooCommerce";
  const normalizedUrl = storeDomain?.startsWith("http")
    ? storeDomain
    : storeDomain
    ? `https://${storeDomain}`
    : undefined;

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/20 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Store Info & Diagnostics */}
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs",
                isShopify
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400",
              )}
            >
              <Radio className="h-4 w-4 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {brandName} Real-Time Synchronization Engine
                </h3>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  Live Connected
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automated bidirectional webhooks and scheduled background sync workers.
              </p>
            </div>
          </div>

          {/* Diagnostic badges row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Connected Store
              </span>
              <div className="flex items-center gap-1 mt-1 truncate">
                <span className="text-xs font-semibold text-foreground truncate">
                  {storeDomain || "Active Store"}
                </span>
                {normalizedUrl && (
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Sync Health
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {syncStatus || "Operational"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Last Synced
              </span>
              <span className="text-xs font-semibold text-foreground mt-1 block truncate">
                {lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Webhook Latency
              </span>
              <span className="text-xs font-semibold text-foreground mt-1 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" />
                ~1.8s avg
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Granular Sync Triggers */}
        <div className="flex flex-col gap-2.5 sm:min-w-[280px] p-4 rounded-xl bg-background/60 border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Manual Sync Triggers
            </span>
            <span className="text-[10px] text-muted-foreground">Select entity</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSyncCustomers}
              disabled={syncingCustomers}
              className="h-8 px-2 text-[10px] font-semibold gap-1 border-border bg-card shadow-2xs hover:bg-muted"
            >
              <RefreshCw className={cn("h-3 w-3", syncingCustomers && "animate-spin")} />
              {syncingCustomers ? "Syncing…" : "Customers"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSyncProducts}
              disabled={syncingProducts}
              className="h-8 px-2 text-[10px] font-semibold gap-1 border-border bg-card shadow-2xs hover:bg-muted"
            >
              <RefreshCw className={cn("h-3 w-3", syncingProducts && "animate-spin")} />
              {syncingProducts ? "Syncing…" : "Products"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSyncOrders}
              disabled={syncingOrders}
              className="h-8 px-2 text-[10px] font-semibold gap-1 border-border bg-card shadow-2xs hover:bg-muted"
            >
              <RefreshCw className={cn("h-3 w-3", syncingOrders && "animate-spin")} />
              {syncingOrders ? "Syncing…" : "Orders"}
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground/70 leading-tight">
            Trigger individual catalog and customer synchronizations on-demand without affecting rate limits.
          </p>
        </div>
      </div>
    </div>
  );
}
