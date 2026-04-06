"use client";

import React from "react";
import {
  useGetEntityCurrencyConfig,
} from "@/graphql/actions";
import { Coins, CreditCard, Activity, Settings2, TrendingUp, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatNumber } from "@/lib/formatNumber";
import { EcosystemKPI, EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

const chartData = [
  { name: "Jan", amount: 4000 },
  { name: "Feb", amount: 3000 },
  { name: "Mar", amount: 5000 },
  { name: "Apr", amount: 2780 },
  { name: "May", amount: 1890 },
  { name: "Jun", amount: 2390 },
  { name: "Jul", amount: 3490 },
];

export function CurrencyDashboard() {
  const { data: configData, loading: configLoading } = useGetEntityCurrencyConfig();
  const config = configData?.getEntityCurrencyConfig;
  const currencyName = config?.currencyName || "EC";

  const kpis = [
    {
      title: `Total ${currencyName} Earned`,
      value: configLoading ? "—" : "124,500",
      trend: 12,
      icon: Coins,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Redemption Volume",
      value: configLoading ? "—" : "42,100",
      trend: -2,
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Users",
      value: configLoading ? "—" : "1,240",
      trend: 8,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <EcosystemKPI key={i} {...kpi} trendLabel="v. last month" />
        ))}
      </div>

      {/* Chart + Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="lg:col-span-8">
          <EcosystemCard
            title="Currency Flow"
            description="Monthly circulation trajectory"
            icon={TrendingUp}
          >
            <div className="h-[300px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "none",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "11px" }}
                    formatter={(value: any) => [
                      value ? formatNumber(Number(value)) : "0",
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </EcosystemCard>
        </div>

        {/* Config Summary */}
        <div className="lg:col-span-4">
          <EcosystemCard
            title="Registry Parameters"
            description="Active economic variables"
            icon={Settings2}
          >
            <div className="space-y-1 mt-4 overflow-hidden rounded-lg border border-zinc-100">
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/50">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  Currency Node
                </span>
                <span className="text-xs font-bold text-zinc-900 leading-none">
                  {config?.currencyName || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/50">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  Normalization
                </span>
                <span className="text-xs font-bold text-zinc-900 font-mono leading-none">
                  {config?.normalizationFactor || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/50">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  Max Burn Rate
                </span>
                <span className="text-xs font-bold text-zinc-900 leading-none">
                  {config?.maxTcPercentage || 30}%
                </span>
              </div>
            </div>

            {config && (
              <div className="mt-8 px-1">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                    TC Capacity
                  </span>
                  <span className="text-xs font-bold text-zinc-900 leading-none">
                    {config?.maxTcPercentage || 30}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${config?.maxTcPercentage || 30}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100 italic">
               <p className="text-[9px] font-medium text-zinc-400 leading-relaxed">
                  Registry integrity verified at {new Date().toLocaleTimeString()}. Economic parameters are automatically synchronized across all system nodes.
               </p>
            </div>
          </EcosystemCard>
        </div>
      </div>
    </div>
  );
}
