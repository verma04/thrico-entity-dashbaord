"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Sparkles, PieChart as PieChartIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentTypeBreakdown } from "@/graphql/actions/dashboard";

interface DashboardContentBreakdownChartProps {
  data: ContentTypeBreakdown[];
  loading?: boolean;
}

// Predefined colors for content types
const COLORS = [
  "#8b5cf6", // Violet 500
  "#ec4899", // Pink 500
  "#3b82f6", // Blue 500
  "#10b981", // Emerald 500
  "#f59e0b", // Amber 500
  "#6366f1", // Indigo 500
  "#ef4444", // Red 500
  "#14b8a6", // Teal 500
];

export function DashboardContentBreakdownChart({
  data,
  loading,
}: DashboardContentBreakdownChartProps) {
  // Format data for Recharts
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Filter out 0 counts and sort by count descending
    return [...data]
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((item, index) => ({
        name:
          item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase(),
        value: item.count,
        percentage: item.percentage,
        color: COLORS[index % COLORS.length],
      }));
  }, [data]);

  const totalContent = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col relative pb-6 pt-2">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Analyzing Content...
              </p>
            </div>
          </div>
        )}

        {chartData.length === 0 && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <Sparkles className="h-8 w-8 mb-2 text-muted-foreground/50" />
            <p className="text-sm font-medium">No content created yet</p>
            <p className="text-xs text-muted-foreground">
              Check back later when members start posting.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="drop-shadow-sm hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value} (${props.payload.percentage.toFixed(1)}%)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "11px",
                    color: "hsl(var(--muted-foreground))",
                  }}
                  formatter={(value, entry: any) => {
                    const count = entry?.payload?.value ?? 0;
                    const pct = entry?.payload?.percentage ?? 0;
                    return (
                      <span className="text-foreground font-medium">
                        {value}: {count} ({pct.toFixed(1)}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && chartData.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-4 pr-16 md:pr-24 lg:pr-32 xl:pr-28">
            <div className="text-center">
              <span className="block text-2xl font-bold tracking-tighter text-foreground leading-none">
                {totalContent.toLocaleString()}
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest mt-1">
                Total Items
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
