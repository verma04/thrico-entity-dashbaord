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

interface GamificationVelocityChartProps {
  loading?: boolean;
}

export function GamificationVelocityChart({
  loading = false,
}: GamificationVelocityChartProps) {
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");

  const rawData = React.useMemo(() => {
    if (timeRange === "7d") {
      return [
        { date: "Aug 17", points: 3400, badges: 8 },
        { date: "Aug 18", points: 5200, badges: 14 },
        { date: "Aug 19", points: 4800, badges: 12 },
        { date: "Aug 20", points: 7600, badges: 22 },
        { date: "Aug 21", points: 9100, badges: 26 },
        { date: "Aug 22", points: 6800, badges: 18 },
        { date: "Aug 23", points: 11400, badges: 34 },
      ];
    } else if (timeRange === "30d") {
      return [
        { date: "Jul 25", points: 18400, badges: 45 },
        { date: "Aug 01", points: 26500, badges: 68 },
        { date: "Aug 08", points: 34200, badges: 92 },
        { date: "Aug 15", points: 42100, badges: 110 },
        { date: "Aug 22", points: 56300, badges: 145 },
      ];
    } else {
      return [
        { date: "Jun W1", points: 55000, badges: 140 },
        { date: "Jun W3", points: 78000, badges: 210 },
        { date: "Jul W1", points: 110000, badges: 290 },
        { date: "Jul W3", points: 145000, badges: 380 },
        { date: "Aug W1", points: 190000, badges: 480 },
        { date: "Aug W3", points: 245000, badges: 620 },
      ];
    }
  }, [timeRange]);

  const totalPoints = rawData.reduce((acc, curr) => acc + curr.points, 0);

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
              {totalPoints.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">points</span>

            <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              +31.8% velocity
            </div>
          </div>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 self-start sm:self-auto">
          {(["7d", "30d", "90d"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer",
                timeRange === key
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
              data={rawData}
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
