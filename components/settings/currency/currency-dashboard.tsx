"use client";

import React from "react";
import {
  useGetEntityCurrencyConfig,
  useGetCurrencyStats,
} from "@/graphql/actions";
import {
  Coins,
  CreditCard,
  Activity,
  Settings2,
  TrendingUp,
  BarChart3,
  Wallet,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatNumber } from "@/lib/formatNumber";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CurrencyDashboard({
  timeRange,
  dateRange,
}: {
  timeRange?: any;
  dateRange?: any;
}) {
  const { data: configData, loading: configLoading } =
    useGetEntityCurrencyConfig();
  const config = configData?.getEntityCurrencyConfig;
  const currencyName = config?.currencyName || "EC";

  const { data: statsData, loading: statsLoading } = useGetCurrencyStats(
    timeRange,
    dateRange,
  );
  const stats = statsData?.getCurrencyStats;

  const isLoading = configLoading || statsLoading;

  const totalEarned = stats?.totalEarned || 0;
  const redemptionVolume = stats?.redemptionVolume || 0;
  const totalBalance =
    stats?.totalBalance !== undefined
      ? stats.totalBalance
      : Math.max(0, totalEarned - redemptionVolume);

  const topEarners = stats?.topEarners || [];

  const kpis = [
    {
      title: `Total ${currencyName} Balance`,
      value: isLoading ? "—" : formatNumber(totalBalance),
      trend: 10,
      icon: Wallet,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      title: `Total ${currencyName} Earned`,
      value: isLoading ? "—" : formatNumber(totalEarned),
      trend: 12,
      icon: Coins,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      title: "Redemption Volume",
      value: isLoading ? "—" : formatNumber(redemptionVolume),
      trend: -2,
      icon: CreditCard,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      title: "Active Users (Earners)",
      value: isLoading ? "—" : formatNumber(stats?.activeUsers || 0),
      trend: 8,
      icon: Activity,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
  ];

  const chartData = stats?.currencyFlow || [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section className="space-y-4">
        <DashboardSectionHeading
          title="Currency Overview"
          titleClassName="normal-case tracking-normal text-sm text-foreground"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="v. last month" />
          ))}
        </div>
      </section>

      {/* Main Grid: Flow & Registry on Left, Top Earners Leaderboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Chart & Parameters */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chart */}
          <section className="space-y-4">
            <DashboardSectionHeading
              title="Currency Flow"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <div className="h-[280px] w-full">
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorAmount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#71717a"
                          stopOpacity={0.08}
                        />
                        <stop
                          offset="95%"
                          stopColor="#71717a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e4e4e7"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: "#a1a1aa",
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: "#a1a1aa",
                      }}
                      tickFormatter={formatNumber}
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
                      formatter={(value: any) => [
                        value ? formatNumber(Number(value)) : "0",
                        "Amount",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#52525b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Config Summary */}
          <section className="space-y-4">
            <DashboardSectionHeading
              title="Registry Parameters"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Currency Node
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {config?.currencyName || "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Normalization
                  </span>
                  <span className="text-sm font-bold text-foreground font-mono">
                    {config?.normalizationFactor || "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Max Burn Rate
                  </span>
                  <span className="text-sm font-bold text-foreground font-mono">
                    {config?.maxTcPercentage || 30}%
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Users Coins Earned Leaderboard */}
        <section className="lg:col-span-5 space-y-4">
          <DashboardSectionHeading
            title={`Users ${currencyName} Earned`}
            icon={<Trophy className="h-4 w-4 text-amber-500" />}
            rightElement={
              <Link href="/gamification/currency/trace">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted gap-1"
                >
                  View trace
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            }
          />
          <div className="rounded-[20px] border border-border bg-card overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="divide-y divide-border/40">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 px-4 py-3.5"
                  >
                    <Skeleton className="h-5 w-6" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : topEarners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/60 text-center px-4">
                <Trophy className="h-8 w-8 mb-2 opacity-30 text-amber-500" />
                <p className="text-xs font-semibold text-foreground">
                  No member earnings recorded yet
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
                  Members will appear on this leaderboard as they earn{" "}
                  {currencyName.toLowerCase()}.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {topEarners.map((earner: any) => {
                  const user = earner.userBasicInfo;
                  const firstName = user?.firstName || "Member";
                  const lastName = user?.lastName || "";
                  const fullName = `${firstName} ${lastName}`.trim();
                  const avatarUrl = user?.avatar || "";
                  const fullAvatar = avatarUrl.startsWith("http")
                    ? avatarUrl
                    : avatarUrl
                      ? `https://cdn.thrico.network/${avatarUrl}`
                      : "";
                  const initials = firstName.substring(0, 2).toUpperCase();

                  const rankMedals: Record<number, string> = {
                    1: "🥇",
                    2: "🥈",
                    3: "🥉",
                  };

                  const hoverUser: UserProfileHoverData = {
                    id: earner.userId,
                    firstName,
                    lastName,
                    avatar: avatarUrl,
                  };

                  return (
                    <div
                      key={earner.userId}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 hover:bg-muted/30 transition-colors",
                        earner.rank === 1 && "bg-amber-500/[0.03]",
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-bold tabular-nums w-6 text-center shrink-0">
                          {rankMedals[earner.rank] || (
                            <span className="text-xs font-mono text-muted-foreground">
                              #{earner.rank}
                            </span>
                          )}
                        </span>

                        <UserProfileHoverCard user={hoverUser}>
                          <div className="flex items-center gap-2.5 cursor-pointer">
                            <Avatar className="h-8 w-8 border border-border shrink-0">
                              <AvatarImage
                                src={fullAvatar}
                                alt={fullName}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-medium">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-foreground leading-tight hover:underline truncate max-w-[130px] sm:max-w-[160px]">
                                {fullName}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                ID: {earner.userId.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                        </UserProfileHoverCard>
                      </div>

                      <div className="flex items-center gap-1.5 pl-3 shrink-0">
                        <Coins className="h-3.5 w-3.5 text-amber-500" />
                        <span className="font-mono text-xs font-bold text-foreground">
                          {formatNumber(earner.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
