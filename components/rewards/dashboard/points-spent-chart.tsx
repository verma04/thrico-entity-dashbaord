import React from "react";
import { Flame } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";

interface PointsSpentChartProps {
  chartData: any[];
  statsLoading: boolean;
}

export const PointsSpentChart = ({ chartData, statsLoading }: PointsSpentChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-zinc-900 text-white rounded-xl px-4 py-3 shadow-xl text-xs">
        <p className="font-semibold">
          {payload[0]?.value?.toLocaleString()}{" "}
          points
        </p>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Points Spent Over Time"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="p-5 rounded-[20px] bg-white dark:bg-card border border-border shadow-sm">
        <div className="h-[260px] w-full">
          {statsLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-border">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center border border-border">
                <Flame className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  No data yet
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] leading-relaxed">
                  Points data appears once members start redeeming
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 0, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                  dy={8}
                />
                <YAxis
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#f97316",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
};
