"use client";

import React from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface ShopifySidebarSummaryProps {
  connection?: {
    id?: string;
    shopDomain?: string;
    status?: string;
    installedAt?: string;
    lastSyncAt?: string;
  } | null;
  isConnected: boolean;
  allowPushNotifications: boolean;
  sendEmailOnSent: boolean;
  stats?: {
    totalCustomers?: number;
    syncedProducts?: number;
    ordersProcessed?: number;
  } | null;
}

export function ShopifySidebarSummary({
  connection,
  isConnected,
  allowPushNotifications,
  sendEmailOnSent,
  stats,
}: ShopifySidebarSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Live Store Matrix */}
      <PolarisSidebarCard
        title="Live Status"
        badge="Integration"
        icon={Sparkles}
      >
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Connection
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                isConnected
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
              )}
            >
              {isConnected ? "Active" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5 pt-1">
          <PolarisSummaryRow
            label="Shop Domain"
            value={
              <span className="font-mono text-[11px] truncate max-w-[140px] block">
                {connection?.shopDomain || "None"}
              </span>
            }
          />
          <PolarisSummaryRow
            label="Push Alerts"
            value={allowPushNotifications ? "Enabled" : "Muted"}
          />
          <PolarisSummaryRow
            label="Email Dispatch"
            value={sendEmailOnSent ? "Enabled" : "Muted"}
          />
          <PolarisSummaryRow
            label="Customers"
            value={`${stats?.totalCustomers ?? 0} synced`}
          />
          <PolarisSummaryRow
            label="Products"
            value={`${stats?.syncedProducts ?? 0} synced`}
          />
          <PolarisSummaryRow
            label="Orders"
            value={`${stats?.ordersProcessed ?? 0} synced`}
            isLast
          />
        </div>
      </PolarisSidebarCard>

      {/* Tip Card */}
      <PolarisTipCard title="Notification Delivery Tip" icon={TrendingUp}>
        Enabling both Push Alerts and Email Delivery guarantees that community
        members immediately see their reward vouchers on mobile while retaining
        a permanent record in their email inbox.
      </PolarisTipCard>
    </div>
  );
}
