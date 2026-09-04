"use client";

import React from "react";
import { BarChart3, Plus, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EmailQuotaCapacityProps {
  loading?: boolean;
  usage: {
    emailsSent: number;
    numberOfEmailsPerMonth: number;
    usagePercent: number;
    remaining: number;
    periodEnd?: string;
  };
  onAddCredits?: () => void;
  onManagePlan?: () => void;
}

export function EmailQuotaCapacity({
  loading = false,
  usage,
  onAddCredits,
  onManagePlan,
}: EmailQuotaCapacityProps) {
  const daysUntilReset = usage.periodEnd
    ? Math.max(
        0,
        Math.ceil((new Date(usage.periodEnd).getTime() - Date.now()) / 86400000)
      )
    : 18;

  const usagePercent = Math.min(100, Math.round(usage.usagePercent || (usage.emailsSent / (usage.numberOfEmailsPerMonth || 1)) * 100));

  return (
    <div id="kpi-section-quota" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              2. Quota Capacity & Top-Up Velocity
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Monthly broadcast allowances, remaining credits, and renewal cycles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onAddCredits}
            className="h-7 text-[11px] font-semibold gap-1.5 border-border rounded-[4px]"
          >
            <Plus className="h-3 w-3" />
            Top Up Credits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main Quota Progress Card */}
        <Card className="lg:col-span-2 border-border/60 bg-card shadow-2xs">
          <CardContent className="p-5 space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-8 w-44 rounded" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Monthly Consumption
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold text-foreground tabular-nums">
                        {usage.emailsSent.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-muted-foreground">
                        / {usage.numberOfEmailsPerMonth.toLocaleString()} base quota
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={cn(
                        "text-2xl font-extrabold tabular-nums",
                        usagePercent >= 90
                          ? "text-rose-600"
                          : usagePercent >= 75
                            ? "text-amber-600"
                            : "text-indigo-600"
                      )}
                    >
                      {usagePercent}%
                    </span>
                    <p className="text-[10px] font-medium text-muted-foreground">Used this cycle</p>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden p-0.5 border border-border/40">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        usagePercent >= 90
                          ? "bg-rose-500"
                          : usagePercent >= 75
                            ? "bg-amber-500"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600"
                      )}
                      style={{ width: `${Math.max(2, usagePercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                    <span>{usage.remaining.toLocaleString()} remaining credits</span>
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <Clock className="h-3 w-3" />
                      Renews in {daysUntilReset} days
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Plan Upgrade Card */}
        <Card className="border-border/60 bg-gradient-to-br from-indigo-50/50 via-card to-violet-50/30 dark:from-indigo-950/20 dark:via-card dark:to-violet-950/10 shadow-2xs flex flex-col justify-between">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Scale High-Volume Senders</span>
              </div>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Need dedicated IP pools or volume tiers? Upgrade your organization plan for higher monthly limits.
              </p>
            </div>

            <Button
              size="sm"
              onClick={onManagePlan}
              className="w-full h-8 text-[11.5px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-[4px]"
            >
              Compare Sending Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
