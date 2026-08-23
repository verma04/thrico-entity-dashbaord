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
  MessageSquare,
  Sparkles,
  Flame,
  Calendar,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface GamificationDistributionChartProps {
  totalPoints?: number;
  loading?: boolean;
}

export function GamificationDistributionChart({
  totalPoints = 84500,
  loading = false,
}: GamificationDistributionChartProps) {
  const chartData = [
    {
      name: "Feed Posts & Media",
      value: 29575,
      percentage: 35,
      color: "#8b5cf6",
      icon: MessageSquare,
    },
    {
      name: "Comments & Upvotes",
      value: 21125,
      percentage: 25,
      color: "#6366f1",
      icon: Sparkles,
    },
    {
      name: "Daily Login Streaks",
      value: 16900,
      percentage: 20,
      color: "#f59e0b",
      icon: Flame,
    },
    {
      name: "Event RSVPs & Polls",
      value: 10140,
      percentage: 12,
      color: "#10b981",
      icon: Calendar,
    },
    {
      name: "Milestone Badges",
      value: 6760,
      percentage: 8,
      color: "#f43f5e",
      icon: Award,
    },
  ];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <PieChartIcon className="h-3 w-3 text-primary" />
            Points by Earning Activity
          </span>
          <p className="text-[10px] text-muted-foreground">
            Distribution across triggers &amp; rules
          </p>
        </div>

        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
          Sources
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 pt-1 px-3 sm:px-5 relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Computing Breakdown...
              </p>
            </div>
          </div>
        )}

        {/* Donut Chart */}
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
                  `${value.toLocaleString()} pts (${props.payload.percentage}%)`,
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
              {(totalPoints / 1000).toFixed(1)}k
            </span>
            <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">
              Points
            </span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="flex-1 w-full space-y-1">
          {chartData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="group flex items-center justify-between p-1.5 px-2 rounded-lg bg-card/70 hover:bg-muted/40 border border-border/50 transition-all"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="h-5 w-5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground truncate">
                    {item.name}
                  </span>
                </div>

                <div className="text-right shrink-0 flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground tabular-nums">
                    {item.percentage}%
                  </span>
                  <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
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
