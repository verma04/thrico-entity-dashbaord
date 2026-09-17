"use client";

import React from "react";
import { BarChart3, Plus, ArrowUpRight, Sparkles, Coins, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AIQuotaCapacityProps {
  loading: boolean;
  quota?: {
    balance: number;
    usedThisMonth: number;
    totalUsed: number;
    usagePercent?: number;
    isByok?: boolean;
  };
  onAddCredits?: () => void;
  onManagePlan?: () => void;
}

export function AIQuotaCapacity({
  loading,
  quota,
  onAddCredits,
  onManagePlan,
}: AIQuotaCapacityProps) {
  const balance = quota?.balance ?? 755000;
  const usedThisMonth = quota?.usedThisMonth ?? 245000;
  const monthlyAllowance = 1000000;
  const usagePercent = quota?.usagePercent ?? Math.round((usedThisMonth / monthlyAllowance) * 100);

  // Approximate token distribution
  const inputTokens = Math.round(usedThisMonth * 0.62);
  const outputTokens = Math.round(usedThisMonth * 0.28);
  const reasoningTokens = Math.round(usedThisMonth * 0.1);

  return (
    <div id="kpi-section-quota" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              2. Token Quota Capacity & Compute Velocity
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Monthly token allowance allocation, inference consumption, and top-up reserves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onManagePlan}
            className="h-8 text-xs font-semibold gap-1.5 border-border"
          >
            Manage AI Tier
            <ArrowUpRight className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={onAddCredits}
            className="h-8 text-xs font-semibold gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Credits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main Token Quota Gauge */}
        <Card className="lg:col-span-2 border-border/60 bg-card shadow-2xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Monthly Inference Allowance
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  {loading ? (
                    <Skeleton className="h-8 w-32 rounded" />
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-foreground tabular-nums">
                        {usedThisMonth.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">
                        / {monthlyAllowance.toLocaleString()} tokens
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Balance Remaining
                  </span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {balance.toLocaleString()} tokens
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Coins className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                <span>{usagePercent}% Allowance Utilized</span>
                <span className="tabular-nums">{(monthlyAllowance - usedThisMonth).toLocaleString()} tokens available</span>
              </div>
              <Progress value={Math.min(100, usagePercent)} className="h-2 bg-muted" />
            </div>

            {/* Breakdown Sub-metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
              <div className="p-2.5 rounded-lg bg-muted/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-medium">Input Tokens</span>
                <p className="text-xs font-bold text-foreground tabular-nums">
                  {inputTokens.toLocaleString()}
                </p>
                <span className="text-[9px] text-muted-foreground/80">Context & Prompts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-medium">Output Tokens</span>
                <p className="text-xs font-bold text-foreground tabular-nums">
                  {outputTokens.toLocaleString()}
                </p>
                <span className="text-[9px] text-muted-foreground/80">Model Responses</span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground font-medium">Reasoning / Tool</span>
                <p className="text-xs font-bold text-foreground tabular-nums">
                  {reasoningTokens.toLocaleString()}
                </p>
                <span className="text-[9px] text-muted-foreground/80">Planning & Syntheses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top-up & Cycle Card */}
        <Card className="border-border/60 bg-card shadow-2xs flex flex-col justify-between">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Cycle & Tier Health
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                Enterprise AI Tier
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>Cycle Resets in <strong className="text-foreground">18 days</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <RefreshCw className="h-4 w-4 text-teal-500 shrink-0" />
                <span>Auto-refill enabled on critical threshold (&lt;10%)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Zero rate-limit throttling across connected models</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onAddCredits}
              className="w-full text-xs font-semibold gap-1.5 h-9"
            >
              <Plus className="h-3.5 w-3.5 text-indigo-600" />
              Instant Top-up Package
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
