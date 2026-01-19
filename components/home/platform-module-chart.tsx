"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useCheckEntitySubscription,
  useGetModuleActivity,
  TimeRange,
} from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
const COLORS = [
  "#60a5fa",
  "#a78bfa",
  "#fb923c",
  "#4ade80",
  "#f472b6",
  "#facc15",
];
export function PlatformModuleChart() {
  const [timeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data: subData } = useCheckEntitySubscription();
  const { data: activityData, loading } = useGetModuleActivity(timeRange);

  const modules = subData?.checkEntitySubscription?.modules || [];
  const moduleActivity = activityData?.getModuleActivity || [];

  // Transform the module activity data to match chart format
  // Filter to only show modules that are in the user's subscription
  const chartData = moduleActivity
    .filter((activity) => {
      // If no modules loaded yet, show all
      if (modules.length === 0) return true;

      // Filter to only show modules that are in the user's subscription
      return modules.some(
        (m) =>
          m.name.toLowerCase().includes(activity.name.toLowerCase()) ||
          activity.name.toLowerCase().includes(m.name.toLowerCase()),
      );
    })
    .map((activity, index) => ({
      name: activity.name,
      count: activity.userCount,
      fill: COLORS[index % COLORS?.length],
    }));

  // Dynamic colors based on module count

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Platform Module Activity</CardTitle>
        <CardDescription>
          Active users per module for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-[280px] w-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No module activity data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "rgba(107, 114, 128, 0.1)" }}
              />
              <Legend />
              <Bar dataKey="count" name="Active Users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
