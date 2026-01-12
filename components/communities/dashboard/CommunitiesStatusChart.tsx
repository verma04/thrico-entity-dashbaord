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
  Tooltip as RechartsTooltip,
} from "recharts";

interface CommunitiesStatusChartProps {
  data: Array<{ name: string; value: number }>;
  totalCount: number;
  colors: string[];
}

export const CommunitiesStatusChart: React.FC<CommunitiesStatusChartProps> = ({
  data,
  totalCount,
  colors,
}) => {
  return (
    <Card className="md:col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Communities by Status</CardTitle>
        <CardDescription>Current distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text for Donut Feel */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
            <div className="text-center">
              <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {totalCount}
              </span>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
