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
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-500" />
            Points Velocity &amp; Issuance
          </span>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {totalPoints.toLocaleString()}
            </span>
            <div className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              +31.8%
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              points awarded
            </span>
          </div>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center rounded-md border border-border/70 bg-muted/30 p-0.5">
          {(["7d", "30d", "90d"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold rounded transition-all cursor-pointer",
                timeRange === key
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {key === "7d" ? "7D" : key === "30d" ? "30D" : "90D"}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 pt-1 px-2 sm:px-4 relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Loading Velocity...
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={205}>
          <AreaChart
            data={rawData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="amberPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted-foreground/15"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              className="text-[9px] font-medium text-muted-foreground"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              className="text-[9px] font-medium text-muted-foreground"
            />

            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-lg min-w-[140px] space-y-0.5">
                      <p className="text-[10px] font-bold text-foreground border-b border-border/50 pb-0.5">
                        {label}
                      </p>
                      <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                        <span>Points:</span>
                        <span className="tabular-nums">
                          {payload[0]?.value?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                        <span>Badges:</span>
                        <span className="tabular-nums">
                          {payload[0]?.payload?.badges}
                        </span>
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
              fill="url(#amberPoints)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#f59e0b",
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
              }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
