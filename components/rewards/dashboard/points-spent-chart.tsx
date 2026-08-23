"use client";

import React from "react";
import { Flame, Coins } from "lucide-react";
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

interface PointsSpentChartProps {
  chartData?: any[];
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
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            Points Burn &amp; Currency Flow
          </span>
          <p className="text-[11px] text-muted-foreground">
            Total member points redeemed and burned across interactions
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-extrabold text-foreground tabular-nums block">
            {totalSpent.toLocaleString()} pts
          </span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
            Total Burned
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-5 relative min-h-[220px]">
        {isLoading ? (
          <div className="h-[220px] w-full flex items-center justify-center bg-muted/30 rounded-xl">
            <div className="h-7 w-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={displayData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
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
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl min-w-[130px] space-y-1">
                        <p className="text-[11px] font-bold text-foreground border-b border-border/50 pb-1">
                          {label}
                        </p>
                        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold text-xs">
                          <span>Burned:</span>
                          <span className="tabular-nums">{payload[0]?.value?.toLocaleString()} pts</span>
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
                strokeWidth={2.5}
                fill="url(#amberGlow)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#f59e0b",
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
