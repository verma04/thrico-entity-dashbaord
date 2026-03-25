"use client";

import React, { useState } from "react";
import {
  TimeRange,
  useGetCurrencyTransactions,
  useGetEntityCurrencyConfig,
  useGetUser,
} from "@/graphql/actions";
import { Coins, CreditCard, Activity, History, Settings2, Zap, LayoutGrid } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  EcosystemKPI,
  EcosystemCard,
  EcosystemGrid,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { formatNumber } from "@/lib/formatNumber";

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

  const kpis = [
    {
      title: `Total ${currencyName} Earned`,
      value: configLoading ? "..." : "124,500",
      trend: 12,
      icon: Coins,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Redemption Volume",
      value: configLoading ? "..." : "42,100",
      trend: -2,
      icon: CreditCard,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Active Users",
      value: configLoading ? "..." : "1,240",
      trend: 8,
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  // Derive chart data from transactions if available, otherwise use mock
  const chartData = [
    { name: "JAN", amount: 4000 },
    { name: "FEB", amount: 3000 },
    { name: "MAR", amount: 5000 },
    { name: "APR", amount: 2780 },
    { name: "MAY", amount: 1890 },
    { name: "JUN", amount: 2390 },
    { name: "JUL", amount: 3490 },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <EcosystemGrid cols={3} className="gap-8">
        {kpis.map((kpi, i) => (
          <EcosystemKPI key={i} {...kpi} trendLabel="Economy" />
        ))}
      </EcosystemGrid>

      <EcosystemGrid cols={12} className="gap-10">
        <div className="lg:col-span-8">
          <EcosystemCard
            title="Sovereign Currency Flow"
            description="Temporal circulation velocity"
            icon={History}
            decorationIcon={Zap}
          >
            <div className="h-[350px] w-full">
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
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "16px",
                    }}
                    itemStyle={{
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "10px",
                    }}
                    labelStyle={{ display: "none" }}
                    formatter={(value: any) => [
                      value ? formatNumber(Number(value)) : "0",
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </EcosystemCard>
        </div>

        <div className="lg:col-span-4">
          <EcosystemCard
            title="Quick Configurations"
            description="Active ledger parameters"
            icon={Settings2}
            decorationIcon={LayoutGrid}
            className="min-h-fit"
          >
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Local Name
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {config?.currencyName || "N/A"}
                  </span>
                </div>
                <div className="h-px w-full bg-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Normalization
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {config?.normalizationFactor || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Spending Policy Limit
                  </span>
                  <span className="text-[11px] font-black text-slate-900">
                    {config?.maxTcPercentage || 30}% TC Cap
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 origin-left"
                    style={{
                      width: `${config?.maxTcPercentage || 30}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </EcosystemCard>
        </div>
      </EcosystemGrid>
    </div>
  );
}
