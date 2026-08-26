"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  PieChart as PieChartIcon,
  Coins,
  ShoppingBag,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PillarsDistributionChartProps {
  manualCount?: number;
  storeCount?: number;
  giftCardsCount?: number;
  loading?: boolean;
}

export function PillarsDistributionChart({
  manualCount = 0,
  storeCount = 0,
  giftCardsCount = 0,
  loading = false,
}: PillarsDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const totalRewards = manualCount + storeCount + giftCardsCount;

  const chartData = React.useMemo(() => {
    return [
      {
        id: "manual",
        name: "Pillar 1: Manual",
        shortName: "Manual Vouchers",
        value: manualCount,
        percentage: totalRewards > 0 ? (manualCount / totalRewards) * 100 : 0,
        color: "#10b981",
        icon: Coins,
        funding: "Zero Cost (Internal)",
        tag: "Zero Cost",
        tagClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      },
      {
        id: "store",
        name: "Pillar 2: E-Commerce",
        shortName: "Store Discounts",
        value: storeCount,
        percentage: totalRewards > 0 ? (storeCount / totalRewards) * 100 : 0,
        color: "#6366f1",
        icon: ShoppingBag,
        funding: "Merchant Funded (Shopify)",
        tag: "Merchant Funded",
        tagClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      },
      {
        id: "giftcards",
        name: "Pillar 3: Gift Cards",
        shortName: "Brand Gift Cards",
        value: giftCardsCount,
        percentage: totalRewards > 0 ? (giftCardsCount / totalRewards) * 100 : 0,
        color: "#a855f7",
        icon: Gift,
        funding: "Prepaid Wallet (Brands)",
        tag: "Prepaid Wallet",
        tagClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      },
    ];
  }, [manualCount, storeCount, giftCardsCount, totalRewards]);

  // Placeholder data when total is 0 so the donut ring renders cleanly
  const renderData =
    totalRewards > 0
      ? chartData
      : [
          {
            id: "empty",
            name: "No Assets Configured",
            shortName: "No Assets",
            value: 1,
            percentage: 0,
            color: "hsl(var(--muted-foreground) / 0.2)",
            icon: Coins,
            funding: "Pending Setup",
            tag: "Setup Needed",
            tagClass: "bg-muted text-muted-foreground",
          },
        ];

  const activeHoveredItem = hoveredIndex !== null && chartData[hoveredIndex] ? chartData[hoveredIndex] : null;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <PieChartIcon className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-foreground tracking-tight">
              Fulfillment Share
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Volume distribution across 3 mechanisms
          </p>
        </div>

        <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <ShieldCheck className="h-2.5 w-2.5" />
          {totalRewards > 0 ? "3 Active Pillars" : "Ready"}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 pt-2 px-3 sm:px-5 relative min-h-[220px]">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Computing Share...
              </p>
            </div>
          </div>
        )}

        {/* Left: Interactive Donut Chart */}
        <div className="relative w-[150px] h-[150px] shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={renderData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={66}
                paddingAngle={totalRewards > 0 ? 3 : 0}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
                onMouseEnter={(_, index) => {
                  if (totalRewards > 0) setHoveredIndex(index);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {renderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={
                      hoveredIndex === null || hoveredIndex === index
                        ? 1
                        : 0.4
                    }
                    className="transition-all duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              {totalRewards > 0 && (
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      if (!data) return null;
                      return (
                        <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-xl min-w-[130px] space-y-0.5 z-50">
                          <p className="text-[10px] font-bold text-foreground">
                            {data.shortName}
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-extrabold" style={{ color: data.color }}>
                            <span>{data.value} assets</span>
                            <span>{data.percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>

          {/* Dynamic Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
            {activeHoveredItem ? (
              <div className="animate-in fade-in-50 zoom-in-95 duration-150">
                <span
                  className="text-base font-extrabold tabular-nums leading-none block"
                  style={{ color: activeHoveredItem.color }}
                >
                  {activeHoveredItem.value}
                </span>
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5 truncate max-w-[80px]">
                  {activeHoveredItem.percentage.toFixed(0)}% Share
                </span>
              </div>
            ) : (
              <div>
                <span className="text-lg font-extrabold text-foreground tabular-nums leading-none block">
                  {totalRewards}
                </span>
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5">
                  Assets
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detailed Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {chartData.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "group relative p-2 rounded-xl border transition-all duration-200 cursor-pointer",
                  isHovered
                    ? "bg-muted/50 border-border shadow-xs"
                    : "bg-card/60 hover:bg-muted/30 border-border/40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Left: Icon & Info */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${item.color}18`,
                        color: item.color,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-foreground block truncate">
                          {item.shortName}
                        </span>
                        <span className={cn("text-[8px] font-bold px-1.5 py-0.2 rounded-full border hidden sm:inline", item.tagClass)}>
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-medium block leading-tight">
                        {item.funding}
                      </span>
                    </div>
                  </div>

                  {/* Right: Stat & Percentage */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs font-extrabold text-foreground tabular-nums">
                        {item.value}
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.2 rounded-full tabular-nums"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-1 bg-muted/70 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.percentage, totalRewards > 0 ? 2 : 0)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
