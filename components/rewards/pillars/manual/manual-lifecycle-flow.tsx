"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

export const ManualLifecycleFlow: React.FC = () => {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          Manual Voucher Ingestion & Lifecycle
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/50">
          Batch & Pool Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-lg border border-border/70 bg-muted/30 space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              1
            </div>
            <span className="text-xs font-bold text-foreground">Ingestion / Batch Import</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Upload CSV batch of single-use codes (1:1) or configure a shared coupon code (1:N).
          </p>
        </div>

        <div className="p-3 rounded-lg border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              2
            </div>
            <span className="text-xs font-bold text-foreground">Pool Lock & Member Allocation</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Gamification wins or manual claims transition code status from UNASSIGNED to ASSIGNED.
          </p>
        </div>

        <div className="p-3 rounded-lg border border-teal-200/70 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              3
            </div>
            <span className="text-xs font-bold text-foreground">Redemption & Expiry Lifecycle</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Redeemed in member wallet, auto-expired after validity date, or manually voided.
          </p>
        </div>
      </div>
    </div>
  );
};
