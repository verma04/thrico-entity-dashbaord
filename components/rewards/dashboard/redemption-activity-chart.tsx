"use client";

import React, { useState } from "react";
import { TrendingUp, Activity } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartDataItem {
  name: string;
  val: number;
  tc?: number;
}

interface RedemptionActivityChartProps {
  chartData?: ChartDataItem[];
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
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-foreground tracking-tight">
              Redemption Velocity &amp; Claims Activity
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {totalPeriodClaims.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">claims</span>

            <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              +21.4% trend
            </div>
          </div>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 self-start sm:self-auto">
          {(["7d", "30d", "90d"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilterRange(key)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer",
                filterRange === key
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {key === "7d" ? "7D" : key === "30d" ? "30D" : "90D"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 pt-2 px-2 sm:px-4 relative min-h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Loading Redemptions...
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[190px] sm:h-[210px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayData}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rewardGlowClean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  className="stroke-border/40"
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
                  allowDecimals={false}
                  width={32}
                />

                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl min-w-[150px] space-y-1 z-50">
                          <div className="flex items-center justify-between border-b border-border/50 pb-1">
                            <span className="text-[11px] font-bold text-foreground">
                              {label}
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              Active Day
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs pt-0.5">
                            <span className="text-[11px] text-muted-foreground font-medium">Claims:</span>
                            <span className="tabular-nums font-extrabold">{payload[0]?.value} redemptions</span>
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
                  strokeWidth={2}
                  fill="url(#rewardGlowClean)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#6366f1",
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
