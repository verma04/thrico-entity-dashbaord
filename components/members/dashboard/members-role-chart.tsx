"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useGetUserRoleDistribution } from "@/graphql/actions";
import { TimeRange } from "@/graphql/actions/dashbaord/dashboard-quries";
import { Skeleton } from "@/components/ui/skeleton";

interface MembersRoleChartProps {
  timeRange: TimeRange;
}

export const MembersRoleChart = ({ timeRange }: MembersRoleChartProps) => {
  const { data: roleData, loading } = useGetUserRoleDistribution(timeRange);

  const displayData = roleData?.getUserRoleDistribution || [];

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

  const totalMembers = displayData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="lg:col-span-4 shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Member Roles</CardTitle>
        <CardDescription>Distribution by role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full relative">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayData as any}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {displayData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs font-medium text-slate-600">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-12">
                <div className="text-center">
                  <span className="text-2xl font-bold text-slate-800 tracking-tight">
                    {(totalMembers / 1000).toFixed(1)}k
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Total
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
