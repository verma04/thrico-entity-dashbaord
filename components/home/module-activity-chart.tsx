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
  "#60a5fa",
  "#a78bfa",
  "#fb923c",
  "#4ade80",
  "#f472b6",
  "#facc15",
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
