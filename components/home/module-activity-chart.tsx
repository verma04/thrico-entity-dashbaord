import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetModuleActivity, TimeRange } from "@/graphql/actions";

const COLORS = [
  "#6b7280",
  "#9ca3af",
  "#4b5563",
  "#374151",
  "#1f2937",
  "#111827",
];

interface ModuleActivityChartProps {
  timeRange: TimeRange;
}

export const ModuleActivityChart: React.FC<ModuleActivityChartProps> = ({
  timeRange,
}) => {
  const { data, loading } = useGetModuleActivity(timeRange);

  const moduleActivityData =
    data?.getModuleActivity?.map((item, index) => ({
      name: item.name,
      value: item.userCount,
      color: COLORS[index % COLORS.length],
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Activity</CardTitle>
        <CardDescription>User distribution by module</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moduleActivityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {moduleActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
