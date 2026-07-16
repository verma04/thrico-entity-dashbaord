"use client";

import React from "react";
import { Shield, Activity, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailUsage } from "./types";

interface InfrastructureSidebarProps {
  usage: EmailUsage | null;
  remainingQuota: number;
}

export function InfrastructureSidebar({ usage, remainingQuota }: InfrastructureSidebarProps) {
  const usagePercent = usage?.usagePercent || 0;

  return (
    <div className="space-y-4 sticky top-8">
      <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-foreground/80">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Email Credits</h3>
            <p className="text-xs text-muted-foreground">Current allocation</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              Usage
            </span>
            <span className="text-sm font-bold text-foreground tabular-nums">{usagePercent}%</span>
          </div>
          <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                usagePercent > 80 ? "bg-amber-50 dark:bg-amber-500/100" : "bg-slate-900 dark:bg-slate-100"
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Fingerprint className="h-3 w-3" />
              Remaining
            </span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {remainingQuota.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border/50 bg-muted space-y-2">
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Ensure recipient consent and domain verification before sending. All emails include an unsubscribe option.
        </p>
      </div>
    </div>
  );
}
