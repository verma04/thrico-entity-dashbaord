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
import { cn } from "@/lib/utils";

interface GamificationDistributionChartProps {
  totalPoints?: number;
  loading?: boolean;
}

export function GamificationDistributionChart({
  totalPoints = 84500,
  loading = false,
}: GamificationDistributionChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const chartData = [
    {
      id: "posts",
      name: "Feed Posts & Media",
      shortName: "Feed & Media",
      value: 29575,
      percentage: 35,
      color: "#8b5cf6",
      icon: MessageSquare,
    },
    {
      id: "comments",
      name: "Comments & Upvotes",
      shortName: "Engagement",
      value: 21125,
      percentage: 25,
      color: "#6366f1",
      icon: Sparkles,
    },
    {
      id: "streaks",
      name: "Daily Login Streaks",
      shortName: "Daily Streaks",
      value: 16900,
      percentage: 20,
      color: "#f59e0b",
      icon: Flame,
    },
    {
      id: "events",
      name: "Event RSVPs & Polls",
      shortName: "Events & Polls",
      value: 10140,
      percentage: 12,
      color: "#10b981",
      icon: Calendar,
    },
    {
      id: "badges",
      name: "Milestone Badges",
      shortName: "Milestones",
      value: 6760,
      percentage: 8,
      color: "#f43f5e",
      icon: Award,
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
              Points by Earning Activity
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Distribution across triggers &amp; rules
          </p>
        </div>

        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          5 Sources
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 pt-2 px-3 sm:px-5 relative min-h-[220px]">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Computing Breakdown...
              </p>
            </div>
          </div>
        )}

        {/* Donut Chart */}
        <div className="relative w-[150px] h-[150px] shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={66}
                paddingAngle={3}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {chartData.map((entry, index) => (
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
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0]?.payload;
                    if (!data) return null;
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-xl min-w-[130px] space-y-0.5 z-50">
                        <p className="text-[10px] font-bold text-foreground">
                          {data.name}
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-extrabold" style={{ color: data.color }}>
                          <span>{data.value.toLocaleString()} pts</span>
                          <span>{data.percentage}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
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
                  {(activeHoveredItem.value / 1000).toFixed(1)}k
                </span>
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5">
                  {activeHoveredItem.percentage}% Share
                </span>
              </div>
            ) : (
              <div>
                <span className="text-lg font-extrabold text-foreground tabular-nums leading-none block">
                  {(totalPoints / 1000).toFixed(1)}k
                </span>
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5">
                  Points
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown List */}
        <div className="flex-1 w-full space-y-1.5">
          {chartData.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "group relative p-1.5 px-2 rounded-xl border transition-all duration-200 cursor-pointer",
                  isHovered
                    ? "bg-muted/50 border-border shadow-xs"
                    : "bg-card/60 hover:bg-muted/30 border-border/40"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="h-5 w-5 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${item.color}18`,
                        color: item.color,
                      }}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="text-[11px] font-bold text-foreground truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-foreground tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1 bg-muted/70 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
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
