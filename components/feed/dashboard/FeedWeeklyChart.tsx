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
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FeedWeeklyChartProps {
  data: Array<{ day: string; signups: number }>; // Keeping 'signups' key to match data structure
}

export const FeedWeeklyChart: React.FC<FeedWeeklyChartProps> = ({ data }) => {
  return (
    <Card className="md:col-span-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Weekly Feed Posts</CardTitle>
        <CardDescription>Activity over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="#1890ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFeed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
