"use client";

import {
  Users,
  AlertCircle,
  Lock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Stats = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      icon: Users,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      trend: { value: "+12%", positive: true, label: "from last month" },
    },
    {
      title: "Pending Approvals",
      value: "23",
      icon: AlertCircle,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      trend: { value: "+2", positive: false, label: "new today" },
    },
    {
      title: "Blocked Users",
      value: "7",
      icon: Lock,
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      trend: { value: "+1", positive: false, label: "from last week" },
    },
    {
      title: "Active Today",
      value: "573",
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      trend: { value: "+5%", positive: true, label: "from yesterday" },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend.positive ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                )}
                <p
                  className={`text-xs ${
                    stat.trend.positive
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {stat.trend.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.trend.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Stats;
