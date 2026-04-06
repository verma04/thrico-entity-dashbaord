"use client";

import React from "react";
import {
  Flame,
  Ticket,
  Package,
  Plus,
  ArrowRight,
  TrendingUp,
  History,
  ShieldCheck,
  Trophy,
  Activity,
  Zap,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { useGetRewardStats, useGetRedemptions } from "@/graphql/actions/rewards";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

export default function RewardsDashboard() {
  const {
    data: statsData,
    loading: statsLoading,
    refetch,
  } = useGetRewardStats();
  const { data: redemptionsData, loading: redemptionsLoading } =
    useGetRedemptions({
      pagination: { page: 1, limit: 5 },
    });

  const stats = statsData?.getRewardStats;
  const redemptions = redemptionsData?.getRedemptions || [];

  const kpis = [
    {
      title: "Total Redemptions",
      value: statsLoading ? "..." : (stats?.totalRedemptions || "0"),
      icon: Ticket,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "TC Distributed",
      value: statsLoading
        ? "..."
        : (stats?.totalTcBurned?.toLocaleString() || "0"),
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Low Inventory",
      value: statsLoading ? "..." : (stats?.lowInventoryItems || "0"),
      icon: Package,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trendLabel: "Critical Items",
    },
    {
      title: "Success Rate",
      value: "92.4%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const chartData =
    stats?.redemptionTrend?.map((t: any) => ({
      name: moment(t.date).format("ddd"),
      val: t.value || 0,
    })) || [];

  return (
    <EcosystemWrapper anonymized-1="rewards-dashboard">
      <EcosystemHeader
        title="Rewards Intelligence"
        description="Monitor redemption velocity, track voucher inventory levels, and analyze ecosystem performance."
        badgeText="Economy Hub"
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Rewards Node
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/rewards/analytics">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                Analytics
              </Button>
            </Link>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetch()}
            >
              <RotateCcw
                size={14}
                className={cn(statsLoading && "animate-spin")}
              />
            </Button>
            <Link href="/rewards/vouchers/coupons/create">
              <Button className="h-9 px-4 rounded-lg bg-zinc-900 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-zinc-800 transition-all">
                <Plus className="h-3.5 w-3.5" />
                Create Reward
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel={kpi.trendLabel || "Period"} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Redemption Trend"
              description="Daily interaction volume"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {statsLoading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
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
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "12px",
                        }}
                        itemStyle={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                        labelStyle={{ display: "none" }}
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar
                        dataKey="val"
                        fill="#18181b"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        animationDuration={1500}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === chartData.length - 1 ? "#6366f1" : "#18181b"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Recent Activity"
              description="Live redemption stream"
              icon={Activity}
            >
              <div className="space-y-3 mt-4">
                {redemptionsLoading
                  ? [1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-3 rounded-xl border border-zinc-100 animate-pulse"
                      >
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2 w-28" />
                        </div>
                      </div>
                    ))
                  : redemptions.length > 0
                    ? redemptions.map((act: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-all group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center font-bold text-zinc-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                              {act.user?.firstName?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-zinc-900 truncate tracking-tight leading-none mb-1">
                                {act.user?.firstName} {act.user?.lastName}
                              </p>
                              <p className="text-[10px] font-bold text-zinc-400 truncate uppercase tracking-widest leading-none">
                                {act.reward?.title}
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-indigo-500 whitespace-nowrap px-2">
                            {moment(act.claimedAt).fromNow(true)}
                          </p>
                        </div>
                      ))
                    : (
                      <div className="py-12 text-center space-y-3">
                        <div className="h-12 w-12 bg-zinc-50 rounded-xl flex items-center justify-center mx-auto border border-zinc-100">
                          <History className="h-6 w-6 text-zinc-200" />
                        </div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Registry Empty
                        </p>
                      </div>
                    )}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                <Link href="/rewards/vouchers/redemptions">
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
                  >
                    View History
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <LayoutGrid className="h-4 w-4 text-zinc-900" />
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em]">
              Management Registry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Coupons",
                desc: "Logic & distribution",
                icon: Ticket,
                link: "/rewards/vouchers/coupons",
              },
              {
                title: "Inventory",
                desc: "Registry of assets",
                icon: Package,
                link: "/rewards/vouchers/inventory",
              },
              {
                title: "Redemptions",
                desc: "Audit trial history",
                icon: History,
                link: "/rewards/vouchers/redemptions",
              },
              {
                title: "Governance",
                desc: "Fraud protection",
                icon: ShieldCheck,
                link: "/rewards/fraud",
              },
            ].map((item, i) => (
              <Link key={i} href={item.link}>
                <div className="p-6 rounded-lg bg-white border border-zinc-200 hover:border-indigo-200 hover:shadow-md transition-all group">
                  <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 mb-4 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Initialize
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
