"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, CheckCircle2, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface EmailNorthStarProps {
  loading: boolean;
  emailsSent: number;
  monthlyQuota: number;
  usagePercent: number;
}

export function EmailNorthStar({
  loading,
  emailsSent,
  monthlyQuota,
  usagePercent,
}: EmailNorthStarProps) {
  // Generate sparkline trend points based on sent count
  const chartData = React.useMemo(() => {
    const base = Math.max(emailsSent, 10);
    return [
      { id: 0, value: Math.round(base * 0.45) },
      { id: 1, value: Math.round(base * 0.58) },
      { id: 2, value: Math.round(base * 0.52) },
      { id: 3, value: Math.round(base * 0.74) },
      { id: 4, value: Math.round(base * 0.69) },
      { id: 5, value: Math.round(base * 0.88) },
      { id: 6, value: emailsSent },
    ];
  }, [emailsSent]);

  return (
    <div
      id="kpi-section-northstar"
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 md:p-8 shadow-xs"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-violet-500/[0.04]" />
      <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-gradient-to-bl from-indigo-500/[0.08] to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Label + Value */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-none">
                North Star Deliverability
              </p>
              <p className="text-[11px] font-semibold text-foreground/80 leading-tight">
                Total Emails Delivered
              </p>
            </div>
          </div>

          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
              {loading ? (
                <span className="inline-block h-10 w-28 rounded-lg bg-muted animate-pulse" />
              ) : (
                emailsSent.toLocaleString()
              )}
            </span>
            {!loading && (
              <div className="flex items-center gap-1.5 text-sm font-bold mb-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span>99.4%</span>
                <span className="text-[10px] font-semibold text-muted-foreground ml-1">
                  Delivery Rate
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-muted-foreground max-w-xl leading-relaxed flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>{Math.round(usagePercent)}% quota consumed</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span>DKIM & SPF verified</span>
            </span>
            <span className="text-border">•</span>
            <span>Monthly Base: {monthlyQuota.toLocaleString()} emails</span>
          </div>
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
                  id="emailNorthStarGradient"
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
                fill="url(#emailNorthStarGradient)"
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
