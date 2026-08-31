"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Monitor, Smartphone, LayoutGrid } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartTimeFilter,
  ChartTimeFilterValue,
  getChartTimeFilter,
} from "./chart-time-filter";

import {
  useGetDeviceDistribution,
  TimeRange,
} from "@/graphql/actions/dashboard";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  web: {
    label: "Web App",
    color: "#6366f1", // Indigo
    icon: Monitor,
  },
  ios: {
    label: "iOS Native",
    color: "#0ea5e9", // Sky
    icon: Smartphone,
  },
  android: {
    label: "Android Native",
    color: "#10b981", // Emerald
    icon: Smartphone,
  },
} satisfies ChartConfig;

export function DashboardDistributionChart() {
  const [filterKey, setFilterKey] = React.useState("90d");
  const [filterValue, setFilterValue] = React.useState<ChartTimeFilterValue>(
    getChartTimeFilter("90d"),
  );

  const { data, loading } = useGetDeviceDistribution(
    filterValue.timeRange,
    filterValue.dateRange,
  );
  const chartData = data?.getDeviceDistribution || [];

  // Calculate totals for a premium metric display
  const totals = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        web: acc.web + curr.web,
        ios: acc.ios + curr.ios,
        android: acc.android + curr.android,
      }),
      { web: 0, ios: 0, android: 0 },
    );
  }, [chartData]);

  const totalAll = totals.web + totals.ios + totals.android;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/10 shadow-sm overflow-hidden flex flex-col flex-1 h-full">
      <CardHeader className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 w-full">
          {!loading && totalAll > 0 && (
            <div className="flex items-center gap-4 pt-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#6366f1]" />
                <span className="text-xs font-medium text-muted-foreground">
                  Web{" "}
                  <span className="text-foreground font-semibold">
                    {((totals.web / totalAll) * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#0ea5e9]" />
                <span className="text-xs font-medium text-muted-foreground">
                  iOS{" "}
                  <span className="text-foreground font-semibold">
                    {((totals.ios / totalAll) * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#10b981]" />
                <span className="text-xs font-medium text-muted-foreground">
                  Android{" "}
                  <span className="text-foreground font-semibold">
                    {((totals.android / totalAll) * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        <ChartTimeFilter
          value={filterKey}
          onChange={(key, val) => {
            setFilterKey(key);
            setFilterValue(val);
          }}
        />
      </CardHeader>

      <CardContent className="flex-1 px-0 pb-4 pt-6 relative min-h-[300px] flex flex-col">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col items-center gap-3 bg-background/90 p-4 rounded-xl shadow-lg border border-border/50">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Analyzing Traffic
              </p>
            </div>
          </div>
        )}

        <div className="px-2 sm:px-6 h-full flex-1">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -20, bottom: 15 }}
            >
              <defs>
                <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillIos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillAndroid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                className="stroke-muted-foreground/15"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={40}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                className="text-[10px] font-semibold text-muted-foreground/70"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
                className="text-[10px] font-semibold text-muted-foreground/70"
              />
              <ChartTooltip
                cursor={{
                  stroke: "hsl(var(--muted-foreground)/0.3)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                    className="backdrop-blur-xl bg-background/95 border-border/50 shadow-xl rounded-xl"
                  />
                }
              />
              <Area
                dataKey="android"
                type="monotone"
                fill="url(#fillAndroid)"
                stroke="#10b981"
                stackId="a"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
              />
              <Area
                dataKey="ios"
                type="monotone"
                fill="url(#fillIos)"
                stroke="#0ea5e9"
                stackId="a"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#0ea5e9" }}
              />
              <Area
                dataKey="web"
                type="monotone"
                fill="url(#fillWeb)"
                stroke="#6366f1"
                stackId="a"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
