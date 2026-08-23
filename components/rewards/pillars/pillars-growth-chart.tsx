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
import { TrendingUp, Layers } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PillarsGrowthChartProps {
  loading?: boolean;
}

export function PillarsGrowthChart({ loading = false }: PillarsGrowthChartProps) {
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");

  const rawData = React.useMemo(() => {
    if (timeRange === "7d") {
      return [
        { date: "Aug 17", manual: 4, store: 8, giftcards: 3, total: 15 },
        { date: "Aug 18", manual: 6, store: 12, giftcards: 5, total: 23 },
        { date: "Aug 19", manual: 5, store: 9, giftcards: 4, total: 18 },
        { date: "Aug 20", manual: 8, store: 16, giftcards: 7, total: 31 },
        { date: "Aug 21", manual: 10, store: 18, giftcards: 8, total: 36 },
        { date: "Aug 22", manual: 7, store: 14, giftcards: 6, total: 27 },
        { date: "Aug 23", manual: 12, store: 22, giftcards: 10, total: 44 },
      ];
    } else if (timeRange === "30d") {
      return [
        { date: "Jul 25", manual: 18, store: 35, giftcards: 14, total: 67 },
        { date: "Aug 01", manual: 24, store: 48, giftcards: 20, total: 92 },
        { date: "Aug 08", manual: 32, store: 55, giftcards: 25, total: 112 },
        { date: "Aug 15", manual: 40, store: 72, giftcards: 30, total: 142 },
        { date: "Aug 22", manual: 48, store: 84, giftcards: 38, total: 170 },
      ];
    } else {
      return [
        { date: "Jun W1", manual: 45, store: 90, giftcards: 40, total: 175 },
        { date: "Jun W3", manual: 60, store: 120, giftcards: 55, total: 235 },
        { date: "Jul W1", manual: 75, store: 150, giftcards: 65, total: 290 },
        { date: "Jul W3", manual: 90, store: 180, giftcards: 80, total: 350 },
        { date: "Aug W1", manual: 110, store: 210, giftcards: 95, total: 415 },
        { date: "Aug W3", manual: 130, store: 250, giftcards: 115, total: 495 },
      ];
    }
  }, [timeRange]);

  const totalClaims = rawData.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <Layers className="h-3 w-3 text-primary" />
            Multi-Pillar Velocity Trend
          </span>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {totalClaims.toLocaleString()}
            </span>
            <div className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              +24.8%
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              claims across all pillars
            </span>
          </div>
        </div>

        {/* Time Filter Pill Buttons */}
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
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
              <linearGradient id="fillPillar1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillPillar2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillPillar3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
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
              tickFormatter={(v) => `${v}`}
              className="text-[9px] font-medium text-muted-foreground"
            />

            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-lg min-w-[145px] space-y-1">
                      <p className="text-[10px] font-bold text-foreground border-b border-border/50 pb-0.5">
                        {label}
                      </p>
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                          <span className="flex items-center gap-1 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Manual:
                          </span>
                          <span className="font-bold tabular-nums">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                          <span className="flex items-center gap-1 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            Store:
                          </span>
                          <span className="font-bold tabular-nums">
                            {payload[1]?.value}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                          <span className="flex items-center gap-1 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            Gift Cards:
                          </span>
                          <span className="font-bold tabular-nums">
                            {payload[2]?.value}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-foreground pt-0.5 border-t border-border/40 text-[10px]">
                          <span>Total:</span>
                          <span className="tabular-nums">
                            {(Number(payload[0]?.value || 0) +
                              Number(payload[1]?.value || 0) +
                              Number(payload[2]?.value || 0))}
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
              dataKey="manual"
              type="monotone"
              stackId="1"
              fill="url(#fillPillar1)"
              stroke="#10b981"
              strokeWidth={1.5}
            />
            <Area
              dataKey="store"
              type="monotone"
              stackId="1"
              fill="url(#fillPillar2)"
              stroke="#6366f1"
              strokeWidth={1.5}
            />
            <Area
              dataKey="giftcards"
              type="monotone"
              stackId="1"
              fill="url(#fillPillar3)"
              stroke="#a855f7"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend row */}
        <div className="flex items-center justify-center gap-3 pt-1.5 border-t border-border/40 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-medium">Pillar 1 (Manual)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-muted-foreground font-medium">Pillar 2 (Store)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <span className="text-muted-foreground font-medium">Pillar 3 (Gift Cards)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
