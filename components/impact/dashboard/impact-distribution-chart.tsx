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
  BookOpen,
  Calendar,
  HeartHandshake,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ImpactDistributionChartProps {
  loading?: boolean;
}

export function ImpactDistributionChart({ loading = false }: ImpactDistributionChartProps) {
  const chartData = [
    {
      name: "Community",
      value: 38,
      percentage: 38,
      color: "#10b981",
      icon: MessageSquare,
    },
    {
      name: "Knowledge",
      value: 24,
      percentage: 24,
      color: "#6366f1",
      icon: BookOpen,
    },
    {
      name: "Events",
      value: 18,
      percentage: 18,
      color: "#a855f7",
      icon: Calendar,
    },
    {
      name: "Mentorship",
      value: 12,
      percentage: 12,
      color: "#f59e0b",
      icon: HeartHandshake,
    },
    {
      name: "Moderation",
      value: 8,
      percentage: 8,
      color: "#f43f5e",
      icon: Shield,
    },
  ];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-4 pt-3 sm:pt-3.5">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <PieChartIcon className="h-3 w-3 text-primary" />
            Impact Contribution Weights
          </span>
          <p className="text-[10px] text-muted-foreground">
            Multi-dimensional activity weighting
          </p>
        </div>

        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Normalized
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 pb-2.5 pt-0.5 px-3 sm:px-4 relative min-h-[180px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Computing...
              </p>
            </div>
          </div>
        )}

        {/* Donut Chart */}
        <div className="relative w-full sm:w-[130px] h-[130px] shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
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
                formatter={(value: number, name: string) => [
                  `${value}% Weight`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "11px",
                  padding: "4px 8px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "600" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-sm font-black text-foreground tabular-nums leading-none">
              100%
            </span>
            <span className="text-[7px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">
              Weight
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
                className="group flex items-center justify-between p-1 px-1.5 rounded-lg bg-card/70 hover:bg-muted/40 border border-border/50 transition-all"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="h-4 w-4 rounded flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground truncate">
                    {item.name}
                  </span>
                </div>

                <div className="text-right shrink-0 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-foreground tabular-nums">
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
