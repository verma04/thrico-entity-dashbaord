import React from "react";
import { TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Button } from "@/components/ui/button";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";

interface RedemptionActivityChartProps {
  chartData: any[];
  statsLoading: boolean;
}

export const RedemptionActivityChart = ({ chartData, statsLoading }: RedemptionActivityChartProps) => {
  return (
    <section className="lg:col-span-8 space-y-4">
      <DashboardSectionHeading
        title="Redemption Activity"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="p-5 rounded-[20px] bg-white dark:bg-card border border-border shadow-sm">
        <div className="h-[300px] w-full">
          {statsLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-border">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-14 w-14 bg-muted rounded-2xl flex items-center justify-center border border-border">
                <TrendingUp className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No activity yet
                </p>
                <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                  Redemption trends will appear here once members start claiming
                  rewards
                </p>
              </div>
              <Link href="/gamification/rewards/coupons/create">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Create first reward
                </Button>
              </Link>
            </div>
          ) : (
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 0, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 600,
                    fill: "#94a3b8",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 600,
                    fill: "#94a3b8",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 14px",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                  labelStyle={{ display: "none" }}
                  formatter={(v: any) => [`${v} redemptions`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#rewardGrad)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#6366f1",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
};
