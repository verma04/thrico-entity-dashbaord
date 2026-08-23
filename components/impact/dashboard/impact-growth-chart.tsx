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
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImpactGrowthChartProps {
  loading?: boolean;
}

export function ImpactGrowthChart({ loading = false }: ImpactGrowthChartProps) {
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");

  const rawData = React.useMemo(() => {
    if (timeRange === "7d") {
      return [
        { date: "Aug 17", avgScore: 280, maxScore: 840 },
        { date: "Aug 18", avgScore: 295, maxScore: 890 },
        { date: "Aug 19", avgScore: 310, maxScore: 920 },
        { date: "Aug 20", avgScore: 305, maxScore: 940 },
        { date: "Aug 21", avgScore: 325, maxScore: 980 },
        { date: "Aug 22", avgScore: 340, maxScore: 1020 },
        { date: "Aug 23", avgScore: 355, maxScore: 1080 },
      ];
    } else if (timeRange === "30d") {
      return [
        { date: "Jul 25", avgScore: 210, maxScore: 680 },
        { date: "Aug 01", avgScore: 245, maxScore: 780 },
        { date: "Aug 08", avgScore: 280, maxScore: 890 },
        { date: "Aug 15", avgScore: 315, maxScore: 980 },
        { date: "Aug 22", avgScore: 355, maxScore: 1080 },
      ];
    } else {
      return [
        { date: "Jun W1", avgScore: 160, maxScore: 520 },
        { date: "Jun W3", avgScore: 195, maxScore: 640 },
        { date: "Jul W1", avgScore: 235, maxScore: 760 },
        { date: "Jul W3", avgScore: 280, maxScore: 880 },
        { date: "Aug W1", avgScore: 320, maxScore: 990 },
        { date: "Aug W3", avgScore: 355, maxScore: 1080 },
      ];
    }
  }, [timeRange]);

  const currentAvg = rawData[rawData.length - 1]?.avgScore || 355;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-4 pt-3 sm:pt-3.5">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            Impact Velocity &amp; Growth
          </span>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight tabular-nums text-foreground">
              {currentAvg} pts
            </span>
            <div className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              +26.8%
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              avg score
            </span>
          </div>
        </div>

        {/* Time Selector */}
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

      <CardContent className="flex-1 pb-2.5 pt-0.5 px-2 sm:px-3 relative min-h-[180px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Loading...
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={185}>
          <AreaChart
            data={rawData}
            margin={{ top: 8, right: 8, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="emeraldImpact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
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
              className="text-[9px] font-medium text-muted-foreground"
            />

            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-lg min-w-[130px] space-y-0.5">
                      <p className="text-[10px] font-bold text-foreground border-b border-border/50 pb-0.5">
                        {label}
                      </p>
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <span>Avg:</span>
                        <span className="tabular-nums">{payload[0]?.value} pts</span>
                      </div>
                      <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                        <span>Peak:</span>
                        <span className="tabular-nums">{payload[0]?.payload?.maxScore} pts</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="avgScore"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#emeraldImpact)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#10b981",
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
