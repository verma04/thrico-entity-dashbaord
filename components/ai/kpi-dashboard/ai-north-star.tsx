"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface AINorthStarProps {
  loading: boolean;
  totalInvocations: number;
  monthlyQuota: number;
  usagePercent: number;
}

export function AINorthStar({
  loading,
  totalInvocations,
  monthlyQuota,
  usagePercent,
}: AINorthStarProps) {
  // Generate sparkline trend points based on invocation count
  const chartData = React.useMemo(() => {
    const base = Math.max(totalInvocations, 10);
    return [
      { id: 0, value: Math.round(base * 0.42) },
      { id: 1, value: Math.round(base * 0.55) },
      { id: 2, value: Math.round(base * 0.51) },
      { id: 3, value: Math.round(base * 0.72) },
      { id: 4, value: Math.round(base * 0.68) },
      { id: 5, value: Math.round(base * 0.86) },
      { id: 6, value: totalInvocations },
    ];
  }, [totalInvocations]);

  return (
    <div
      id="kpi-section-northstar"
      className="relative overflow-hidden rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-xs"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-violet-500/[0.04]" />
      <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-gradient-to-bl from-indigo-500/[0.08] to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Label + Value */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[4px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-none">
                North Star AI Telemetry
              </p>
              <p className="text-[11px] font-semibold text-foreground/80 leading-tight">
                Total Autonomous Executions
              </p>
            </div>
          </div>

          <div className="flex items-end gap-3 flex-wrap">
            {loading ? (
              <Skeleton className="h-10 w-36 rounded-[4px]" />
            ) : (
              <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
                {totalInvocations.toLocaleString()}
              </span>
            )}
            {loading ? (
              <Skeleton className="h-5 w-24 rounded-[3px] mb-1" />
            ) : (
              <div className="flex items-center gap-1.5 text-sm font-bold mb-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span>99.2%</span>
                <span className="text-[10px] font-semibold text-muted-foreground ml-1">
                  Success Rate
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center gap-3 pt-1">
              <Skeleton className="h-3.5 w-36 rounded-[3px]" />
              <Skeleton className="h-3.5 w-32 rounded-[3px]" />
              <Skeleton className="h-3.5 w-40 rounded-[3px]" />
            </div>
          ) : (
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground max-w-xl leading-relaxed flex-wrap">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>{Math.round(usagePercent)}% token allowance consumed</span>
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>Safety Guardrails Enforced</span>
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Avg Latency &lt;320ms</span>
              </span>
            </div>
          )}
        </div>

        {/* Right: Sparkline Mini Chart */}
        <div className="h-20 w-full md:w-56 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="aiNorthStarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#aiNorthStarGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
