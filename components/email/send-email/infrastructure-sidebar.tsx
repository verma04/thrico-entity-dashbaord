"use client";

import React from "react";
import {
  Shield,
  Activity,
  Zap,
  CheckCircle2,
  ExternalLink,
  Info,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailUsage } from "./types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface InfrastructureSidebarProps {
  usage: EmailUsage | null;
  remainingQuota: number;
}

export function InfrastructureSidebar({
  usage,
  remainingQuota,
}: InfrastructureSidebarProps) {
  const router = useRouter();
  const usagePercent = usage?.usagePercent || 0;
  const emailsSent = usage?.emailsSent || 0;
  const totalLimit = usage?.numberOfEmailsPerMonth || remainingQuota;

  return (
    <div className="space-y-3 sticky top-4">
      {/* Credits / Quota Card */}
      <div className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-border/60 flex items-center justify-center text-[#616161]">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <h3 className="text-[12.5px] font-bold text-foreground">
              Email Credits
            </h3>
          </div>
          <span className="text-[11px] font-bold text-foreground tabular-nums">
            {remainingQuota.toLocaleString()} Left
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Monthly Consumption
            </span>
            <span className="font-bold text-foreground tabular-nums">
              {usagePercent}%
            </span>
          </div>

          <div className="h-2 w-full bg-[#f1f1f2] dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usagePercent > 85
                  ? "bg-red-500"
                  : usagePercent > 65
                  ? "bg-amber-500"
                  : "bg-[#303030] dark:bg-zinc-100"
              )}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10.5px] text-muted-foreground pt-1">
            <span>Sent: {emailsSent.toLocaleString()}</span>
            <span>Total Limit: {totalLimit.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/email/usage")}
            className="w-full h-[28px] text-[11.5px] font-medium gap-1.5 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] cursor-pointer"
          >
            <CreditCard className="h-3 w-3" />
            Manage &amp; Top Up Credits
          </Button>
        </div>
      </div>

      {/* Deliverability Tips Card */}
      <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-1.5 text-foreground">
          <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-[12px] font-bold">Deliverability Checklist</h4>
        </div>

        <ul className="space-y-1.5 text-[11px] text-muted-foreground">
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>DKIM &amp; SPF signatures attached automatically.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>One-click unsubscribe links included by default.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span>Target warm active subscribers for optimal inbox rates.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

