"use client";

import React from "react";
import { Tooltip, Cell, PieChart, Pie } from "recharts";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatusDistributionPoint } from "@/graphql/actions/communities";

const STATUS_COLORS = ["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#e4e4e7"];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <div className="h-6 w-6 border-2 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-medium text-muted-foreground">Getting info...</p>
    </div>
  </div>
);

interface CommunityStatusDistributionProps {
  loading: boolean;
  singularName: string;
  statusDistribution: StatusDistributionPoint[];
}

export function CommunityStatusDistribution({
  loading,
  singularName,
  statusDistribution,
}: CommunityStatusDistributionProps) {
  const totalStatusCount = statusDistribution.reduce(
    (acc: number, item: StatusDistributionPoint) => acc + item.value,
    0,
  );

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title={`${singularName} Status`}
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="flex flex-col gap-6">
        <div className="relative h-64 w-full flex items-center justify-center">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1000}
                  >
                    {statusDistribution.map((_, i: number) => (
                      <Cell
                        key={i}
                        fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e4e4e7",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center translate-y-1">
                  <span className="text-2xl font-bold text-foreground block leading-none">
                    {totalStatusCount}
                  </span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    TOTAL
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full space-y-2">
          {statusDistribution.map((item: StatusDistributionPoint, i: number) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 rounded-[20px] bg-muted/30 border border-transparent"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length],
                  }}
                />
                <span className="text-xs font-semibold text-muted-foreground capitalize">
                  {item.name.toLowerCase()}
                </span>
              </div>
              <span className="text-xs font-bold text-foreground tabular-nums">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
