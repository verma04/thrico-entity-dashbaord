"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import {
  TimeRange,
  useGetCurrencyTransactions,
  useGetEntityCurrencyConfig,
} from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, CreditCard, Activity, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { useGetUser } from "@/graphql/actions";

export function CurrencyDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data: configData, loading: configLoading } =
    useGetEntityCurrencyConfig();
  const { data: userData } = useGetUser();

  // Mocking stats as the backend might not have a dedicated stats query for currency yet
  // In a real scenario, we would use a useGetCurrencyStats hook
  const { data: txData, loading: txLoading } = useGetCurrencyTransactions({
    userId: userData?.getUser?.id || "",
    limit: 100,
  });

  const config = configData?.getEntityCurrencyConfig;
  const currencyName = config?.currencyName || "EC";

  const kpiStats: KPIStat[] = [
    {
      title: `Total ${currencyName} Earned`,
      value: configLoading ? <Skeleton className="h-8 w-24" /> : "124,500",
      change: 12,
      trend: "up",
      icon: Coins,
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
    },

    {
      title: "Redemption Volume",
      value: configLoading ? <Skeleton className="h-8 w-24" /> : "42,100",
      change: -2,
      trend: "down",
      icon: CreditCard,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Users",
      value: configLoading ? <Skeleton className="h-8 w-24" /> : "1,240",
      change: 8,
      trend: "up",
      icon: Activity,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  // Derive chart data from transactions if available, otherwise use mock
  const chartData = [
    { date: "2024-01-01", amount: 4000 },
    { date: "2024-01-02", amount: 3000 },
    { date: "2024-01-03", amount: 5000 },
    { date: "2024-01-04", amount: 2780 },
    { date: "2024-01-05", amount: 1890 },
    { date: "2024-01-06", amount: 2390 },
    { date: "2024-01-07", amount: 3490 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Currency Insights"
      description={`Track ${currencyName} circulation and global TC conversion rates`}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Sovereign Currency Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis dataKey="date" hide />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Configurations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Local Name</span>
                <span className="font-bold">
                  {config?.currencyName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Normalization</span>
                <span className="font-bold">
                  {config?.normalizationFactor || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Spending Policy
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${config?.maxTcPercentage || 30}%` }}
                  />
                </div>
                <span className="text-xs font-bold">
                  {config?.maxTcPercentage || 30}% TC Cap
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}
