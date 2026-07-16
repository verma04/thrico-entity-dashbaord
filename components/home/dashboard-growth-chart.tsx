"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  YAxis,
} from "recharts";
import { TrendingUp, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartTimeFilter,
  ChartTimeFilterValue,
  getChartTimeFilter,
} from "./chart-time-filter";
import {
  useGetGrowthStats,
  TimeRange,
  GroupBy,
} from "@/graphql/actions/dashboard";
import { cn } from "@/lib/utils";

function getGroupByForKey(key: string): GroupBy {
  if (["7d", "30d", "this_month", "last_month"].includes(key))
    return GroupBy.DAY;
  if (["90d", "this_quarter"].includes(key)) return GroupBy.WEEK;
  return GroupBy.MONTH;
}

export function DashboardGrowthChart() {
  const [filterKey, setFilterKey] = React.useState("30d");
  const [filterValue, setFilterValue] = React.useState<ChartTimeFilterValue>(
    getChartTimeFilter("30d"),
  );

  const groupBy = getGroupByForKey(filterKey);
  const { data, loading } = useGetGrowthStats(
    filterValue.timeRange,
    groupBy,
    filterValue.dateRange,
  );

  const chartData = data?.getGrowthStats?.data || [];
  const totalNewMembers = data?.getGrowthStats?.totalNewMembers || 0;
  const growthRate = data?.getGrowthStats?.growthRate || 0;

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-4">
        <div className="space-y-1 w-full sm:w-auto min-w-[200px]">
          <CardTitle className="text-emerald-500 tracking-wider flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-emerald-500/10">
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            Community Growth
          </CardTitle>
          <CardDescription>New members joining over time</CardDescription>

          {!loading && (
            <div className="mt-4 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter tabular-nums">
                  {totalNewMembers.toLocaleString()}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    growthRate >= 0
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-rose-500/10 text-rose-600",
                  )}
                >
                  {growthRate >= 0 ? "+" : ""}
                  {growthRate.toFixed(1)}%
                  <TrendingUp
                    className={cn("h-3 w-3", growthRate < 0 && "rotate-180")}
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                New members
              </p>
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

      <CardContent className="flex-1 pb-4 pt-2 px-2 sm:px-6 relative min-h-[220px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Loading Growth Data...
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
              <linearGradient id="fillGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted-foreground/20"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tickFormatter={(value) => {
                // If it's a week format (YYYY-WW), show just the week number or approximate month
                if (value.includes("-W")) {
                  return `W${value.split("-W")[1]}`;
                }
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              className="text-[10px] font-medium text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              className="text-[10px] font-medium text-muted-foreground"
            />
            <RechartsTooltip
              cursor={{
                stroke: "hsl(var(--muted-foreground)/0.2)",
                strokeWidth: 2,
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const displayDate = label.includes("-W")
                    ? `Week ${label.split("-W")[1]}, ${label.split("-W")[0]}`
                    : new Date(label).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                  return (
                    <div className="rounded-lg border border-border/60 bg-background p-2 shadow-xl">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">
                        {displayDate}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold">
                          {payload[0].value} new members
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillGrowth)"
              stroke="#10b981"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
