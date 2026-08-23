"use client";

import React, { useState } from "react";
import { TrendingUp, Plus, Activity, Layers } from "lucide-react";
import Link from "next/link";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RedemptionActivityChartProps {
  chartData?: any[];
  statsLoading?: boolean;
  loading?: boolean;
}

export const RedemptionActivityChart = ({
  chartData,
  statsLoading,
  loading,
}: RedemptionActivityChartProps = {}) => {
  const [filterRange, setFilterRange] = useState<"7d" | "30d" | "90d">("7d");
  const isLoading = statsLoading ?? loading ?? false;

  const displayData = chartData && chartData.length > 0
    ? chartData
    : [
        { name: "Aug 17", val: 8, tc: 1200 },
        { name: "Aug 18", val: 14, tc: 2100 },
        { name: "Aug 19", val: 12, tc: 1800 },
        { name: "Aug 20", val: 19, tc: 2850 },
        { name: "Aug 21", val: 24, tc: 3600 },
        { name: "Aug 22", val: 18, tc: 2700 },
        { name: "Aug 23", val: 33, tc: 4950 },
      ];

  const totalPeriodClaims = displayData.reduce((acc, curr) => acc + (curr.val || 0), 0);

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-3 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="space-y-1">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Redemption Velocity &amp; Claims Activity
          </span>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
              {totalPeriodClaims.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" />
              +21.4%
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              claims in selected period
            </span>
          </div>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5">
          {(["7d", "30d", "90d"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilterRange(key)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
                filterRange === key
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {key === "7d" ? "7D" : key === "30d" ? "30D" : "90D"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4 pt-1 px-2 sm:px-5 relative min-h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-2">
              <div className="h-7 w-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Loading Redemptions...
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={displayData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="rewardGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-muted-foreground/15"
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px] font-medium text-muted-foreground"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
                className="text-[10px] font-medium text-muted-foreground"
              />

              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl min-w-[150px] space-y-1">
                        <p className="text-[11px] font-bold text-foreground border-b border-border/50 pb-1">
                          {label}
                        </p>
                        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          <span>Total Redemptions:</span>
                          <span className="tabular-nums">{payload[0]?.value}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="val"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#rewardGlow)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#6366f1",
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
