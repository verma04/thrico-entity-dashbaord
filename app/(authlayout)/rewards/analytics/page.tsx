"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Flame,
  Ticket,
  Activity,
  Package,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useGetRewardStats } from "@/graphql/actions/rewards";
import { Skeleton } from "@/components/ui/skeleton";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

const TOP_COUPONS = [
  { name: "Amazon ₹100", value: 124, color: "#2563eb" },
  { name: "Premium 10%", value: 86, color: "#7c3aed" },
  { name: "Starbucks", value: 72, color: "#059669" },
  { name: "Event Ticket", value: 45, color: "#db2777" },
  { name: "Zomato Pro", value: 38, color: "#ea580c" },
];

export default function AnalyticsPage() {
  const { data, loading } = useGetRewardStats();
  const stats = data?.getRewardStats;

  const chartData =
    stats?.redemptionTrend.map((t: any) => ({
      name: new Date(t.date).toLocaleDateString("en-US", { weekday: "short" }),
      value: t.count,
      tc: t.value || 0,
    })) || [];

  const STAT_CARDS = [
     {
        title: "TC Burned",
        value: stats
          ? stats.totalTcBurned > 1000
            ? `${(stats.totalTcBurned / 1000).toFixed(1)}k`
            : stats.totalTcBurned
          : "0",
        icon: <Flame className="h-4 w-4" />,
        change: "+12.5%",
        color: "text-orange-600 bg-orange-50",
      },
      {
        title: "Total Redeemed",
        value: stats?.totalRedemptions?.toLocaleString() || "0",
        icon: <Ticket className="h-4 w-4" />,
        change: "+8.2%",
        color: "text-blue-600 bg-blue-50",
      },
      {
        title: "Active Rewards",
        value: stats?.activeCoupons?.toString() || "0",
        icon: <Activity className="h-4 w-4" />,
        change: "Stable",
        color: "text-emerald-600 bg-emerald-50",
      },
      {
        title: "Conversion rate",
        value: "64.2%",
        icon: <Zap className="h-4 w-4" />,
        change: "+2.4%",
        color: "text-indigo-600 bg-indigo-50",
      },
      {
        title: "Stock Alert",
        value: stats?.lowInventoryItems?.toString() || "0",
        icon: <Package className="h-4 w-4" />,
        change: "Critical",
        color: "text-rose-600 bg-rose-50",
      },
  ];

  return (
    <EcosystemWrapper anonymized-1="rewards-analytics">
      <EcosystemHeader
        title="Economy Insights"
        badgeText="Advanced Analytics"
        description="Deep-dive into your reward ecosystem's performance, currency velocity, and inventory dynamics."
        icon={BarChart3}
      />

      <EcosystemActionBar shadow="none">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Activity className="h-4 w-4 text-slate-400" />
              <span>Real-time Ingestion Active</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Currency Velocity: +14% Week-over-Week</span>
            </div>
         </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        {/* Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           {STAT_CARDS.map((stat, i) => (
             <div key={i} className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                   <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500", stat.color)}>
                      {stat.icon}
                   </div>
                   <div className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
                      stat.change.startsWith("+") ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                   )}>
                      {stat.change}
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                      {stat.title}
                   </p>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {loading ? "..." : stat.value}
                   </h3>
                </div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Redemptions Chart */}
          <Card className="border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight italic flex items-center gap-2">
                    Redemption Frequency
                  </CardTitle>
                  <CardDescription className="text-sm font-semibold text-slate-500">Daily claim distribution for active reward campaigns.</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-8">
               {loading ? (
                  <Skeleton className="h-full w-full rounded-2xl" />
               ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis
                      dataKey="name"
                      fontSize={11}
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <YAxis fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                      cursor={{ fill: "rgba(99, 102, 241, 0.05)", radius: 12 }}
                      contentStyle={{
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                        padding: "16px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#colorFreq)"
                      radius={[12, 12, 0, 0]}
                      barSize={40}
                    />
                    <defs>
                      <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
               )}
            </CardContent>
          </Card>

          {/* TC Burn Trend */}
          <Card className="border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden">
             <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight italic flex items-center gap-2">
                    Currency Consumption
                  </CardTitle>
                  <CardDescription className="text-sm font-semibold text-slate-500">Weekly TC burn velocity and economy health.</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] p-8">
               {loading ? (
                  <Skeleton className="h-full w-full rounded-2xl" />
               ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis
                      dataKey="name"
                      fontSize={11}
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <YAxis fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                    <Tooltip
                       contentStyle={{
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                        padding: "16px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tc"
                      stroke="#f97316"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#f97316",
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
               )}
            </CardContent>
          </Card>

          {/* Popular Coupons */}
          <Card className="border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 rounded-[2.5rem] lg:col-span-2 overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight italic flex items-center gap-2">
                    Top Fulfillment Performance
                  </CardTitle>
                  <CardDescription className="text-sm font-semibold text-slate-500">Most popular rewards by aggregate claim volume.</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={TOP_COUPONS}
                  margin={{ left: 60, right: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.05} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    fontSize={11}
                    fontWeight={800}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    tick={{ fill: "#1e293b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.02)", radius: 12 }}
                    contentStyle={{
                      borderRadius: "20px",
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                      padding: "16px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={32}>
                    {TOP_COUPONS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
