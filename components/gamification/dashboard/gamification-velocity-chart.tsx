"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface VelocityPoint {
  date: string;
  points: number;
  badges: number;
}

interface GamificationVelocityChartProps {
  data?: VelocityPoint[];
  totalPoints?: number;
  velocityTrend?: number;
  loading?: boolean;
}

export function GamificationVelocityChart({
  data,
  totalPoints: propTotalPoints,
  velocityTrend,
  loading = false,
}: GamificationVelocityChartProps) {
  const chartData = React.useMemo(() => {
    if (data && data.length > 0) return data;
    return [
      { date: "Day 1", points: 0, badges: 0 },
      { date: "Day 2", points: 0, badges: 0 },
      { date: "Day 3", points: 0, badges: 0 },
      { date: "Day 4", points: 0, badges: 0 },
      { date: "Day 5", points: 0, badges: 0 },
      { date: "Day 6", points: 0, badges: 0 },
      { date: "Day 7", points: 0, badges: 0 },
    ];
  }, [data]);

  const computedTotalPoints = propTotalPoints ?? chartData.reduce((acc, curr) => acc + curr.points, 0);
  const hasPoints = computedTotalPoints > 0;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-foreground tracking-tight">
              Points Velocity &amp; Issuance
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {computedTotalPoints.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">points</span>

            {velocityTrend !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border",
                  velocityTrend >= 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                )}
              >
                <TrendingUp className={cn("h-2.5 w-2.5", velocityTrend < 0 && "rotate-180")} />
                {velocityTrend > 0 ? `+${velocityTrend}%` : `${velocityTrend}%`} velocity
              </div>
            )}
          </div>
        </div>

        <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
          {chartData.length} data intervals
        </span>
      </CardHeader>

      <CardContent className="flex-1 pb-3 pt-2 px-2 sm:px-4 relative min-h-[220px]">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Computing Velocity...
              </p>
            </div>
          </div>
        )}

        <div className="w-full h-[190px] sm:h-[210px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="amberPointsClean" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="date"
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
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl min-w-[150px] space-y-1 z-50">
                        <div className="flex items-center justify-between border-b border-border/50 pb-1">
                          <span className="text-[11px] font-bold text-foreground">
                            {label}
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Activity
                          </span>
                        </div>
                        <div className="space-y-0.5 text-xs pt-0.5">
                          <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
                            <span className="text-[11px] text-muted-foreground font-medium">Points:</span>
                            <span className="tabular-nums">
                              {payload[0]?.value?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-bold text-purple-600 dark:text-purple-400">
                            <span className="text-[11px] text-muted-foreground font-medium">Badges:</span>
                            <span className="tabular-nums">
                              {payload[0]?.payload?.badges}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="points"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#amberPointsClean)"
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
      </CardContent>
    </Card>
  );
}
