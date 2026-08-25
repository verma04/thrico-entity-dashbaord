"use client";

import React, { useMemo } from "react";
import { Sparkles } from "lucide-react";
import {
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent } from "@/components/ui/card";

const FORMAT_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

interface EventTypeDistributionItem {
  name: string;
  value: number;
  color?: string;
}

interface EventsFormatDistributionChartProps {
  loading: boolean;
  data: EventTypeDistributionItem[];
}

export function EventsFormatDistributionChart({
  loading,
  data,
}: EventsFormatDistributionChartProps) {
  const totalFormatsCount = useMemo(() => {
    return data.reduce((acc, item) => acc + (item.value || 0), 0);
  }, [data]);

  return (
    <section className="space-y-3 flex flex-col h-full">
      <DashboardSectionHeading
        title="Assembly Formats"
        icon={<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />}
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative flex-1 flex flex-col rounded-xl">
        <CardContent className="p-5 flex-1 flex flex-col justify-between">
          {loading ? (
            <div className="h-[260px] w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Analyzing Formats...
                </p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="h-[260px] w-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Sparkles className="h-8 w-8 mb-2 opacity-30" />
              <span className="text-xs">No event formats recorded yet</span>
            </div>
          ) : (
            <>
              <div className="h-[170px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsPieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      animationDuration={1200}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.color ||
                            FORMAT_COLORS[index % FORMAT_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                  </ReChartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold tracking-tight text-foreground leading-none">
                    {totalFormatsCount}
                  </span>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                    Assemblies
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/40">
                {data.map((item, i) => {
                  const itemColor =
                    item.color || FORMAT_COLORS[i % FORMAT_COLORS.length];
                  const percentage =
                    totalFormatsCount > 0
                      ? Math.round((item.value / totalFormatsCount) * 100)
                      : 0;

                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: itemColor }}
                          />
                          <span className="font-medium text-foreground/80 capitalize">
                            {item.name.replace(/_/g, " ").toLowerCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-foreground tabular-nums">
                          {item.value}{" "}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            ({percentage}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: itemColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
