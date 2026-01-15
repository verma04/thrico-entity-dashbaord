"use client";

import React from "react";
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
import { useCheckEntitySubscription } from "@/graphql/actions";

const data = [
  {
    name: "Mon",
    Communities: 4000,
    Jobs: 2400,
    Events: 2400,
    Offers: 1400,
  },
  {
    name: "Tue",
    Communities: 3000,
    Jobs: 1398,
    Events: 2210,
    Offers: 2300,
  },
  {
    name: "Wed",
    Communities: 2000,
    Jobs: 9800,
    Events: 2290,
    Offers: 1200,
  },
  {
    name: "Thu",
    Communities: 2780,
    Jobs: 3908,
    Events: 2000,
    Offers: 1900,
  },
  {
    name: "Fri",
    Communities: 1890,
    Jobs: 4800,
    Events: 2181,
    Offers: 1300,
  },
  {
    name: "Sat",
    Communities: 2390,
    Jobs: 3800,
    Events: 2500,
    Offers: 1800,
  },
  {
    name: "Sun",
    Communities: 3490,
    Jobs: 4300,
    Events: 2100,
    Offers: 1700,
  },
];

export function PlatformModuleChart() {
  const { data: subData } = useCheckEntitySubscription();
  const modules = subData?.checkEntitySubscription?.modules || [];

  // Map of potential data keys to module names in subscription
  // We check if the subscription has a module with a matching name
  const availableKeys = ["Communities", "Jobs", "Events", "Offers"];

  // Filter keys that correspond to enabled modules in the subscription
  // If no subscription data is loaded yet, show all by default or show none?
  // Showing all by default for better UX during loading/dev, or strict filtering?
  // Let's filter strictly if data is present, otherwise fallback to all (or empty if intended).
  // Given the request "get mdouels foem usesuncmcription", strict filtering implies we only show what they have.

  // Helper to find if module exists. Data keys are capitalized, module names might be proper case or lowercase.
  // We'll do a loose match.
  const activeKeys = availableKeys.filter((key) => {
    // specific mapping or simple includes
    return modules.some(
      (m) =>
        m.name.toLowerCase().includes(key.toLowerCase()) ||
        (key === "Offers" && m.name.toLowerCase().includes("commerce")) ||
        (key === "Offers" && m.name.toLowerCase().includes("shop"))
    );
  });

  // If no specific modules found (e.g. mock data doesn't match names), maybe fallback to all or just show what's found.
  // To avoid empty chart if names don't match mock data, we'll default to all if activeKeys is empty AND modules length is 0 (loading/error).
  // But if modules are loaded and none match, chart is empty (correct behavior).

  const keysToRender =
    activeKeys.length > 0
      ? activeKeys
      : modules.length > 0
      ? []
      : availableKeys;

  const COLORS = {
    Communities: "#60a5fa",
    Jobs: "#a78bfa",
    Events: "#fb923c",
    Offers: "#4ade80",
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Platform Module Activity</CardTitle>
        <CardDescription>
          Number of items created per module this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
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
            {keysToRender.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={COLORS[key as keyof typeof COLORS]}
                radius={
                  index === keysToRender.length - 1 // Topmost bar gets radius
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0]
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
