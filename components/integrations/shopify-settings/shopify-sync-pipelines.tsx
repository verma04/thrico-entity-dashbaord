"use client";

import React from "react";
import Link from "next/link";
import { Users, Package, ShoppingCart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface ShopifySyncPipelinesProps {
  stats?: {
    totalCustomers?: number;
    syncedProducts?: number;
    ordersProcessed?: number;
  } | null;
  isConnected: boolean;
  syncingCustomers: boolean;
  syncingProducts: boolean;
  syncingOrders: boolean;
  onSync: (type: "customers" | "orders" | "products") => void;
}

export function ShopifySyncPipelines({
  stats,
  isConnected,
  syncingCustomers,
  syncingProducts,
  syncingOrders,
  onSync,
}: ShopifySyncPipelinesProps) {
  return (
    <PolarisFormCard
      step={3}
      title="Data Synchronization Pipelines"
      description="Selectively trigger manual synchronization runs or monitor current recorded item volumes."
      badge="Pipelines"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Customers Box */}
        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {stats?.totalCustomers ?? 0}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Customers
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Member profiles & accounts
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-2">
            <Link
              href="/integrations/shopify/user"
              className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium underline"
            >
              View →
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSync("customers")}
              disabled={syncingCustomers || !isConnected}
              className="h-7 px-2 text-[11px] font-semibold rounded-md gap-1"
            >
              <RefreshCw
                className={cn("h-3 w-3", syncingCustomers && "animate-spin")}
              />
              {syncingCustomers ? "Syncing…" : "Sync"}
            </Button>
          </div>
        </div>

        {/* Products Box */}
        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {stats?.syncedProducts ?? 0}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Products
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Catalog & items list
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-2">
            <Link
              href="/integrations/shopify/product"
              className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium underline"
            >
              View →
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSync("products")}
              disabled={syncingProducts || !isConnected}
              className="h-7 px-2 text-[11px] font-semibold rounded-md gap-1"
            >
              <RefreshCw
                className={cn("h-3 w-3", syncingProducts && "animate-spin")}
              />
              {syncingProducts ? "Syncing…" : "Sync"}
            </Button>
          </div>
        </div>

        {/* Orders Box */}
        <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {stats?.ordersProcessed ?? 0}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Orders
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Checkouts & transactions
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-2">
            <Link
              href="/integrations/shopify/orders"
              className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium underline"
            >
              View →
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSync("orders")}
              disabled={syncingOrders || !isConnected}
              className="h-7 px-2 text-[11px] font-semibold rounded-md gap-1"
            >
              <RefreshCw
                className={cn("h-3 w-3", syncingOrders && "animate-spin")}
              />
              {syncingOrders ? "Syncing…" : "Sync"}
            </Button>
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}
