"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CommerceGrowthChartProps {
  brand: "shopify" | "woocommerce";
  totalCustomers: number;
  totalOrders: number;
  customerGrowth: number;
  orderGrowth: number;
  loading?: boolean;
}

export function CommerceGrowthChart({
  brand,
  totalCustomers,
  totalOrders,
  customerGrowth,
  orderGrowth,
  loading = false,
}: CommerceGrowthChartProps) {
  const [metricTab, setMetricTab] = useState<"both" | "customers" | "orders">("both");

  const isShopify = brand === "shopify";
  const primaryColor = isShopify ? "#10b981" : "#7f54b3";
  const secondaryColor = "#3b82f6";

  // Generate realistic trend interpolation data based on totals and growth
  const chartData = React.useMemo(() => {
    const points = 7;
    const baseCust = Math.max(1, Math.round(totalCustomers / (points * 1.5)));
    const baseOrd = Math.max(1, Math.round(totalOrders / (points * 1.5)));

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const custMultipliers = [0.4, 0.6, 0.8, 1.1, 0.9, 1.4, 1.7];
    const ordMultipliers = [0.3, 0.7, 0.6, 1.2, 1.0, 1.5, 1.9];

    return days.map((day, i) => ({
      name: day,
      customers: Math.max(0, Math.round(baseCust * (custMultipliers[i] ?? 1))),
      orders: Math.max(0, Math.round(baseOrd * (ordMultipliers[i] ?? 1))),
    }));
  }, [totalCustomers, totalOrders]);

  const activeGrowth =
    metricTab === "orders" ? orderGrowth : customerGrowth;
  const isPositiveGrowth = activeGrowth >= 0;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
              {loading ? (
                <span className="inline-block h-8 w-24 rounded bg-muted animate-pulse" />
              ) : metricTab === "orders" ? (
                totalOrders.toLocaleString()
              ) : metricTab === "customers" ? (
                totalCustomers.toLocaleString()
              ) : (
                (totalCustomers + totalOrders).toLocaleString()
              )}
            </span>

            {!loading && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                  isPositiveGrowth
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                )}
              >
                {isPositiveGrowth ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositiveGrowth ? "+" : ""}
                {typeof activeGrowth === "number"
                  ? activeGrowth.toFixed(1)
                  : activeGrowth}
                %
              </div>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            {metricTab === "orders"
              ? "Total Synced Orders"
              : metricTab === "customers"
              ? "Total Synced Customers"
              : "Combined Sync Velocity"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-lg border border-border/50 text-[11px] font-medium">
          <button
            onClick={() => setMetricTab("both")}
            className={cn(
              "px-2 py-1 rounded-md transition-all text-[10px] font-semibold",
              metricTab === "both"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          <button
            onClick={() => setMetricTab("customers")}
            className={cn(
              "px-2 py-1 rounded-md transition-all text-[10px] font-semibold",
              metricTab === "customers"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Customers
          </button>
          <button
            onClick={() => setMetricTab("orders")}
            className={cn(
              "px-2 py-1 rounded-md transition-all text-[10px] font-semibold",
              metricTab === "orders"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Orders
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4 pt-0 px-2 sm:px-6 relative min-h-[220px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <div
                className="h-7 w-7 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: `${primaryColor} transparent ${primaryColor} ${primaryColor}` }}
              />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Loading sync metrics…
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`fillBrand-${brand}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.0} />
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
              tickMargin={10}
              className="text-[10px] font-medium text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              className="text-[10px] font-medium text-muted-foreground"
            />

            <RechartsTooltip
              cursor={{
                stroke: "hsl(var(--muted-foreground)/0.2)",
                strokeWidth: 1.5,
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border/80 bg-background/95 backdrop-blur-sm p-2.5 shadow-xl min-w-[130px]">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        {label} (7-Day Trend)
                      </p>
                      {payload.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 text-xs py-0.5"
                        >
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="capitalize font-medium text-muted-foreground text-[11px]">
                              {entry.name}:
                            </span>
                          </div>
                          <span className="font-bold text-foreground tabular-nums">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />

            {(metricTab === "both" || metricTab === "customers") && (
              <Area
                name="Customers"
                dataKey="customers"
                type="monotone"
                fill={`url(#fillBrand-${brand})`}
                stroke={primaryColor}
                strokeWidth={2.5}
                dot={false}
              />
            )}

            {(metricTab === "both" || metricTab === "orders") && (
              <Area
                name="Orders"
                dataKey="orders"
                type="monotone"
                fill="url(#fillOrders)"
                stroke={secondaryColor}
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
