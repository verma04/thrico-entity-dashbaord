"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

interface KPINorthStarProps {
  loading: boolean;
  metric?: StatValue;
}

export function KPINorthStar({ loading, metric }: KPINorthStarProps) {
  const isPositive = (metric?.change ?? 0) >= 0;
  const chartData = (metric?.trend ?? [0, 0, 0, 0, 0, 0, 0]).map((val, i) => ({
    value: val,
    id: i,
  }));

  return (
    <div
      id="kpi-north-star"
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 md:p-8"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-violet-500/[0.04]" />
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-indigo-500/[0.06] to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Label + Value */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] leading-none">
                North Star Metric
              </p>
              <p className="text-[11px] font-semibold text-foreground/80 leading-tight">
                Engaged Members
              </p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
              {loading ? (
                <span className="inline-block h-10 w-28 rounded-lg bg-muted animate-pulse" />
              ) : (
                (metric?.value ?? 0)
              )}
            </span>
            {!loading &&
              metric?.change !== undefined &&
              metric.change !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-bold mb-1",
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive ? "+" : ""}
                  {typeof metric.change === "number"
                    ? metric.change.toFixed(1)
                    : metric.change}
                  %
                  <span className="text-[10px] font-medium text-muted-foreground ml-1">
                    vs last period
                  </span>
                </div>
              )}
          </div>

          <p className="text-[11px] text-muted-foreground/60 max-w-md leading-relaxed">
            Members who performed a meaningful action (post, comment,
            reaction, or session &gt; 2 min) in the last 30 days.
          </p>
        </div>

        {/* Right: Sparkline */}
        <div className="h-[80px] w-full md:w-[280px] shrink-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={1}
            minHeight={1}
          >
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="northStarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#6366f1"
                    stopOpacity={0.25}
                  />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#northStarGradient)"
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
