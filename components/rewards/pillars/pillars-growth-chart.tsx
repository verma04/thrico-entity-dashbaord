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
import { TrendingUp, Layers, Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RedemptionTrendItem {
  date: string;
  count: number;
  value?: number;
}

interface PillarsGrowthChartProps {
  loading?: boolean;
  redemptionTrend?: RedemptionTrendItem[];
  totalRedemptions?: number;
  manualCount?: number;
  storeCount?: number;
  giftCardsCount?: number;
  timeRange?: "7d" | "30d" | "90d";
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
}

export function PillarsGrowthChart({
  loading = false,
  redemptionTrend = [],
  totalRedemptions,
  manualCount = 0,
  storeCount = 0,
  giftCardsCount = 0,
  timeRange: controlledTimeRange,
  onTimeRangeChange,
}: PillarsGrowthChartProps) {
  const [internalTimeRange, setInternalTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");
  const timeRange = controlledTimeRange ?? internalTimeRange;

  const handleRangeChange = (range: "7d" | "30d" | "90d") => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    } else {
      setInternalTimeRange(range);
    }
  };

  const chartData = React.useMemo(() => {
    const totalAssets = manualCount + storeCount + giftCardsCount || 1;
    const manualRatio = manualCount / totalAssets || 0.33;
    const storeRatio = storeCount / totalAssets || 0.33;
    const giftRatio = giftCardsCount / totalAssets || 0.34;

    if (redemptionTrend && redemptionTrend.length > 0) {
      return redemptionTrend.map((item) => {
        const total = item.count || 0;
        const manual = Math.round(total * manualRatio);
        const store = Math.round(total * storeRatio);
        const giftcards = Math.max(0, total - manual - store);

        let formattedDate = item.date;
        try {
          const d = new Date(item.date);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }
        } catch {
          // fallback to raw date
        }

        return {
          date: formattedDate,
          manual,
          store,
          giftcards,
          total,
          value: item.value || 0,
        };
      });
    }

    // Default timeline baseline based on selected timeframe if no trend data points exist yet
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 5 : 6;
    const now = new Date();
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      if (timeRange === "7d") {
        d.setDate(d.getDate() - i);
      } else if (timeRange === "30d") {
        d.setDate(d.getDate() - i * 6);
      } else {
        d.setDate(d.getDate() - i * 15);
      }

      result.push({
        date: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        manual: 0,
        store: 0,
        giftcards: 0,
        total: 0,
        value: 0,
      });
    }

    return result;
  }, [redemptionTrend, manualCount, storeCount, giftCardsCount, timeRange]);

  const computedTotalClaims = React.useMemo(() => {
    if (totalRedemptions !== undefined) return totalRedemptions;
    return chartData.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [totalRedemptions, chartData]);

  const hasActivity = chartData.some((item) => item.total > 0);

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
              {computedTotalClaims.toLocaleString()}
            </span>
            <div className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              {hasActivity ? "Live Active" : "Real-Time"}
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              claims across all 3 pillars
            </span>
          </div>
        </div>

        {/* Time Filter Pill Buttons */}
        <div className="flex items-center rounded-md border border-border/70 bg-muted/30 p-0.5">
          {(["7d", "30d", "90d"] as const).map((key) => (
            <button
              key={key}
              onClick={() => handleRangeChange(key)}
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

      <CardContent className="flex-1 pb-3 pt-1 px-2 sm:px-4 relative min-h-[200px] flex flex-col justify-between">
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
            data={chartData}
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
              allowDecimals={false}
            />

            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const p1 = Number(payload[0]?.value || 0);
                  const p2 = Number(payload[1]?.value || 0);
                  const p3 = Number(payload[2]?.value || 0);
                  const total = p1 + p2 + p3;

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
                          <span className="font-bold tabular-nums">{p1}</span>
                        </div>
                        <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                          <span className="flex items-center gap-1 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            Store:
                          </span>
                          <span className="font-bold tabular-nums">{p2}</span>
                        </div>
                        <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                          <span className="flex items-center gap-1 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                            Gift Cards:
                          </span>
                          <span className="font-bold tabular-nums">{p3}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-foreground pt-0.5 border-t border-border/40 text-[10px]">
                          <span>Total:</span>
                          <span className="tabular-nums">{total}</span>
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
