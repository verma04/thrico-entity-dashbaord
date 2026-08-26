"use client";

import React from "react";
import { Coins, TrendingDown } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PointsSpentItem {
  name: string;
  amount: number;
}

interface PointsSpentChartProps {
  chartData?: PointsSpentItem[];
  statsLoading?: boolean;
  loading?: boolean;
}

export const PointsSpentChart = ({
  chartData,
  statsLoading,
  loading,
}: PointsSpentChartProps = {}) => {
  const isLoading = statsLoading ?? loading ?? false;
  const displayData = chartData && chartData.length > 0
    ? chartData
    : [
        { name: "Mon", amount: 1200 },
        { name: "Tue", amount: 2400 },
        { name: "Wed", amount: 1800 },
        { name: "Thu", amount: 3200 },
        { name: "Fri", amount: 4100 },
        { name: "Sat", amount: 3600 },
        { name: "Sun", amount: 5400 },
      ];

  const totalSpent = displayData.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative flex flex-col overflow-hidden h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coins className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-foreground tracking-tight">
              Points Burn &amp; Currency Velocity
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {totalSpent.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">pts burned</span>

            <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <TrendingDown className="h-2.5 w-2.5" />
              Burn Flow
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 pt-2 px-2 sm:px-4 relative min-h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Computing Burn Flow...
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
                  <linearGradient id="amberGlowClean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
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
                  tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  className="text-[10px] font-medium text-muted-foreground"
                  allowDecimals={false}
                  width={32}
                />

                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl min-w-[140px] space-y-1 z-50">
                          <div className="flex items-center justify-between border-b border-border/50 pb-1">
                            <span className="text-[11px] font-bold text-foreground">
                              {label}
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Points Burned
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold text-xs pt-0.5">
                            <span className="text-[11px] text-muted-foreground font-medium">Burn Volume:</span>
                            <span className="tabular-nums font-extrabold">{payload[0]?.value?.toLocaleString()} pts</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#amberGlowClean)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#f59e0b",
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
