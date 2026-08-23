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

interface PillarsDistributionChartProps {
  manualCount?: number;
  storeCount?: number;
  giftCardsCount?: number;
  loading?: boolean;
}

export function PillarsDistributionChart({
  manualCount = 54,
  storeCount = 48,
  giftCardsCount = 26,
  loading = false,
}: PillarsDistributionChartProps) {
  const chartData = React.useMemo(() => {
    const total = manualCount + storeCount + giftCardsCount;
    return [
      {
        name: "Pillar 1: Manual",
        shortName: "Manual Vouchers",
        value: manualCount,
        percentage: total > 0 ? (manualCount / total) * 100 : 0,
        color: "#10b981",
        icon: Coins,
        funding: "Zero Cost",
      },
      {
        name: "Pillar 2: E-Commerce",
        shortName: "Store Discounts",
        value: storeCount,
        percentage: total > 0 ? (storeCount / total) * 100 : 0,
        color: "#6366f1",
        icon: ShoppingBag,
        funding: "Merchant Funded",
      },
      {
        name: "Pillar 3: Gift Cards",
        shortName: "Brand Gift Cards",
        value: giftCardsCount,
        percentage: total > 0 ? (giftCardsCount / total) * 100 : 0,
        color: "#a855f7",
        icon: Gift,
        funding: "Prepaid Wallet",
      },
    ];
  }, [manualCount, storeCount, giftCardsCount]);

  const totalRewards = manualCount + storeCount + giftCardsCount;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <PieChartIcon className="h-3 w-3 text-primary" />
            Fulfillment Share
          </span>
          <p className="text-[10px] text-muted-foreground">
            Volume breakdown across 3 mechanisms
          </p>
        </div>

        <div className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
          <ShieldCheck className="h-2.5 w-2.5" />
          Balanced
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 pt-1 px-3 sm:px-5 relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Computing Share...
              </p>
            </div>
          </div>
        )}

        {/* Donut Chart Container */}
        <div className="relative w-full sm:w-[150px] h-[150px] shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={64}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="drop-shadow-xs hover:opacity-85 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value} claims (${props.payload.percentage.toFixed(0)}%)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "11px",
                  padding: "6px 10px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "600" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-base font-extrabold text-foreground tabular-nums leading-none">
              {totalRewards}
            </span>
            <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">
              Assets
            </span>
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="flex-1 w-full space-y-1.5">
          {chartData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="group flex items-center justify-between p-1.5 px-2 rounded-lg bg-card/70 hover:bg-muted/40 border border-border/50 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="h-5 w-5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-foreground block truncate">
                      {item.shortName}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium block leading-none">
                      {item.funding}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-extrabold text-foreground tabular-nums block">
                    {item.value}{" "}
                    <span className="text-[9px] font-medium text-muted-foreground">
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </span>
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden mt-0.5 ml-auto">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
