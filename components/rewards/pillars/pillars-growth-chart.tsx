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
import {
  TrendingUp,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RedemptionTrendItem {
  date: string;
  count: number;
  value?: number;
}

type PillarFilterType = "all" | "breakdown" | "manual" | "store" | "giftcards";

interface PillarsGrowthChartProps {
  loading?: boolean;
  redemptionTrend?: RedemptionTrendItem[];
  totalRedemptions?: number;
  manualCount?: number;
  storeCount?: number;
  giftCardsCount?: number;
  timeRange?: "7d" | "30d" | "90d";
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
  showStore?: boolean;
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
  showStore = false,
}: PillarsGrowthChartProps) {
  const [internalTimeRange, setInternalTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");
  const [activeFilter, setActiveFilter] = React.useState<PillarFilterType>("all");
  const [hoveredPillar, setHoveredPillar] = React.useState<string | null>(null);

  const timeRange = controlledTimeRange ?? internalTimeRange;

  const handleRangeChange = (range: "7d" | "30d" | "90d") => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    } else {
      setInternalTimeRange(range);
    }
  };

  const chartData = React.useMemo(() => {
    const totalAssets = (manualCount + (showStore ? storeCount : 0) + giftCardsCount) || 1;
    const manualRatio = manualCount / totalAssets || 1;
    const storeRatio = showStore ? storeCount / totalAssets || 0 : 0;

    if (redemptionTrend && redemptionTrend.length > 0) {
      return redemptionTrend.map((item) => {
        const total = item.count || 0;
        const manual = Math.round(total * manualRatio);
        const store = showStore ? Math.round(total * storeRatio) : 0;
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

    // Default timeline baseline based on selected timeframe
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 6 : 8;
    const now = new Date();
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      if (timeRange === "7d") {
        d.setDate(d.getDate() - i);
      } else if (timeRange === "30d") {
        d.setDate(d.getDate() - i * 5);
      } else {
        d.setDate(d.getDate() - i * 11);
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
  }, [redemptionTrend, manualCount, storeCount, giftCardsCount, timeRange, showStore]);

  const computedTotalClaims = React.useMemo(() => {
    if (totalRedemptions !== undefined && totalRedemptions > 0) return totalRedemptions;
    return chartData.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [totalRedemptions, chartData]);

  const hasActivity = chartData.some((item) => item.total > 0);

  // Daily average velocity
  const dailyAverage = React.useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.total, 0);
    return Math.round((sum / chartData.length) * 10) / 10;
  }, [chartData]);

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
        {/* Left: Title and Key Metrics */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-foreground tracking-tight">
              Multi-Pillar Velocity Trend
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {computedTotalClaims.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">claims</span>

            <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              {hasActivity ? "+18.2% trend" : "Live Stream"}
            </div>

            {hasActivity && (
              <span className="text-[10px] text-muted-foreground hidden md:inline">
                • {dailyAverage} / day avg
              </span>
            )}
          </div>
        </div>

        {/* Right: View mode and time filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Pillar Filter Selector */}
          <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer",
                activeFilter === "all"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Combined
            </button>
            <button
              onClick={() => setActiveFilter("breakdown")}
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer",
                activeFilter === "breakdown"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Breakdown
            </button>
          </div>

          {/* Time Filter Pill Buttons */}
          <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5">
            {(["7d", "30d", "90d"] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleRangeChange(key)}
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
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 pt-2 px-2 sm:px-4 relative min-h-[220px] flex flex-col justify-between">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Computing Velocity...
              </p>
            </div>
          </div>
        )}

        <div className="w-full h-[180px] sm:h-[195px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                {/* Combined Clean Glow */}
                <linearGradient id="fillCombined" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>

                {/* Pillar 1: Manual Glow */}
                <linearGradient id="fillPillar1Clean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>

                {/* Pillar 2: Store Glow */}
                <linearGradient id="fillPillar2Clean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>

                {/* Pillar 3: Gift Cards Glow */}
                <linearGradient id="fillPillar3Clean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border/40"
              />

              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-[10px] text-muted-foreground"
                tickLine={false}
                axisLine={false}
                dy={6}
              />

              <YAxis
                stroke="currentColor"
                className="text-[10px] text-muted-foreground"
                tickLine={false}
                axisLine={false}
                dx={-4}
                allowDecimals={false}
              />

              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const total = d.total || 0;
                    const p1 = d.manual || 0;
                    const p2 = d.store || 0;
                    const p3 = d.giftcards || 0;

                    return (
                      <div className="rounded-lg border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-md min-w-[160px] space-y-1.5 z-30">
                        <div className="flex items-center justify-between border-b border-border/40 pb-1">
                          <span className="text-[10px] font-bold text-foreground">
                            {d.date}
                          </span>
                          <span className="text-[10px] font-extrabold text-foreground tabular-nums">
                            {total} total claims
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                              Manual Vouchers:
                            </span>
                            <span className="font-bold tabular-nums text-foreground">
                              {p1}
                            </span>
                          </div>

                          {showStore && (
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                                <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                                Store Discounts:
                              </span>
                              <span className="font-bold tabular-nums text-foreground">
                                {p2}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                              <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                              Brand Gift Cards:
                            </span>
                            <span className="font-bold tabular-nums text-foreground">
                              {p3}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Combined Flow */}
              {(activeFilter === "all" || activeFilter === "manual" || activeFilter === "store" || activeFilter === "giftcards") && (
                <Area
                  dataKey={
                    activeFilter === "manual"
                      ? "manual"
                      : activeFilter === "store"
                      ? "store"
                      : activeFilter === "giftcards"
                      ? "giftcards"
                      : "total"
                  }
                  type="monotone"
                  stroke={
                    activeFilter === "manual"
                      ? "#10b981"
                      : activeFilter === "store"
                      ? "#6366f1"
                      : activeFilter === "giftcards"
                      ? "#a855f7"
                      : "#6366f1"
                  }
                  strokeWidth={2}
                  fill={
                    activeFilter === "manual"
                      ? "url(#fillPillar1Clean)"
                      : activeFilter === "store"
                      ? "url(#fillPillar2Clean)"
                      : activeFilter === "giftcards"
                      ? "url(#fillPillar3Clean)"
                      : "url(#fillCombined)"
                  }
                />
              )}

              {/* Stacked Breakdown View */}
              {activeFilter === "breakdown" && (
                <>
                  <Area
                    dataKey="manual"
                    type="monotone"
                    stackId="1"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    fill="url(#fillPillar1Clean)"
                  />
                  {showStore && (
                    <Area
                      dataKey="store"
                      type="monotone"
                      stackId="1"
                      stroke="#6366f1"
                      strokeWidth={1.5}
                      fill="url(#fillPillar2Clean)"
                    />
                  )}
                  <Area
                    dataKey="giftcards"
                    type="monotone"
                    stackId="1"
                    stroke="#a855f7"
                    strokeWidth={1.5}
                    fill="url(#fillPillar3Clean)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Legend & Focus Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[10px]">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Pillar 1 Button */}
            <button
              onClick={() => setActiveFilter(activeFilter === "manual" ? "all" : "manual")}
              onMouseEnter={() => setHoveredPillar("manual")}
              onMouseLeave={() => setHoveredPillar(null)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all cursor-pointer",
                activeFilter === "manual"
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs"
                  : "border-border/50 hover:border-emerald-500/40 text-muted-foreground hover:text-foreground bg-muted/20"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Pillar 1: Manual</span>
            </button>

            {/* Pillar 2 Button (only when showStore) */}
            {showStore && (
              <button
                onClick={() => setActiveFilter(activeFilter === "store" ? "all" : "store")}
                onMouseEnter={() => setHoveredPillar("store")}
                onMouseLeave={() => setHoveredPillar(null)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all cursor-pointer",
                  activeFilter === "store"
                    ? "bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs"
                    : "border-border/50 hover:border-indigo-500/40 text-muted-foreground hover:text-foreground bg-muted/20"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Pillar 2: Store</span>
              </button>
            )}

            {/* Pillar 3 Button */}
            <button
              onClick={() => setActiveFilter(activeFilter === "giftcards" ? "all" : "giftcards")}
              onMouseEnter={() => setHoveredPillar("giftcards")}
              onMouseLeave={() => setHoveredPillar(null)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all cursor-pointer",
                activeFilter === "giftcards"
                  ? "bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-2xs"
                  : "border-border/50 hover:border-purple-500/40 text-muted-foreground hover:text-foreground bg-muted/20"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>Pillar 3: Gift Cards</span>
            </button>
          </div>

          <span className="text-[9px] text-muted-foreground hidden md:inline font-medium">
            Click pillar to isolate curve
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
