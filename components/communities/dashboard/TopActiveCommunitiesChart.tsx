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
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TopActiveCommunitiesChartProps {
  data: Array<{ name: string; members: number }>;
}

export const TopActiveCommunitiesChart: React.FC<
  TopActiveCommunitiesChartProps
> = ({ data }) => {
  return (
    <Card className="md:col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Top Active Communities</CardTitle>
        <CardDescription>By member count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip />
              <Bar
                dataKey="members"
                fill="hsl(var(--chart-2))"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
