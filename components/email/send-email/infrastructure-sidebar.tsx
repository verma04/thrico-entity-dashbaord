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
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Email Credits</h3>
            <p className="text-xs text-slate-500">Current allocation</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              Usage
            </span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">{usagePercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                usagePercent > 80 ? "bg-amber-500" : "bg-slate-900"
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Fingerprint className="h-3 w-3" />
              Remaining
            </span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {remainingQuota.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          Ensure recipient consent and domain verification before sending. All emails include an unsubscribe option.
        </p>
      </div>
    </div>
  );
}
