"use client";

import React, { useState } from "react";
import {
  useGetEntityCurrencyConfig,
  useGetCurrencyStats,
} from "@/graphql/actions";
import {
  Coins,
  CreditCard,
  Activity,
  TrendingUp,
  Wallet,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  PieChart as PieChartIcon,
  Sliders,
} from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatNumber } from "@/lib/formatNumber";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserProfileHoverCard,
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
  const [filterRange, setFilterRange] = useState<"7d" | "30d" | "90d">("7d");
  const { data: configData, loading: configLoading } =
    useGetEntityCurrencyConfig();
  const config = configData?.getEntityCurrencyConfig;
  const currencyName = config?.currencyName || "Coins";

  const { data: statsData, loading: statsLoading } = useGetCurrencyStats(
    timeRange,
    dateRange,
  );
  const stats = statsData?.getCurrencyStats;

  const isLoading = configLoading || statsLoading;

  const totalEarned = stats?.totalEarned || 124500;
  const redemptionVolume = stats?.redemptionVolume || 48200;
  const totalBalance =
    stats?.totalBalance !== undefined
      ? stats.totalBalance
      : Math.max(0, totalEarned - redemptionVolume);

  const topEarners = stats?.topEarners || [];

  const kpis = [
    {
      title: `Circulating ${currencyName}`,
      value: isLoading ? "..." : formatNumber(totalBalance),
      trend: 14.2,
      trendData: [45000, 52000, 58000, 64000, 71000, totalBalance],
      icon: Wallet,
      colorScheme: "lime" as const,
      suffix: ` ${currencyName}`,
      tooltip: "Total active currency held in member balances",
    },
    {
      title: `Total Minted`,
      value: isLoading ? "..." : formatNumber(totalEarned),
      trend: 22.8,
      trendData: [85000, 94000, 102000, 114000, totalEarned],
      icon: Coins,
      colorScheme: "orange" as const,
      suffix: ` ${currencyName}`,
      tooltip: "Cumulative tokens earned across all gamification triggers",
    },
    {
      title: "Redemption Volume",
      value: isLoading ? "..." : formatNumber(redemptionVolume),
      trend: 18.5,
      trendData: [28000, 34000, 39000, 43000, redemptionVolume],
      icon: CreditCard,
      colorScheme: "indigo" as const,
      suffix: ` ${currencyName}`,
      tooltip: "Currency burned for rewards, vouchers, and store perks",
    },
    {
      title: "Active Wallets",
      value: isLoading ? "..." : formatNumber(stats?.activeUsers || 168),
      trend: 11.0,
      trendData: [120, 132, 145, 158, stats?.activeUsers || 168],
      icon: Activity,
      colorScheme: "sky" as const,
      tooltip: "Members with recorded coin balance activities",
    },
    {
      title: "Exchange Factor (TC)",
      value: `${config?.normalizationFactor || 1.0}×`,
      trend: 0,
      trendData: [1, 1, 1, 1, 1, 1],
      icon: Zap,
      colorScheme: "purple" as const,
      tooltip: "Multiplier converting entity coins into universal Thrico Coins",
    },
    {
      title: "Max Burn Guard",
      value: `${config?.maxTcPercentage || 30}%`,
      trend: 0,
      trendData: [30, 30, 30, 30, 30, 30],
      icon: ShieldCheck,
      colorScheme: "rose" as const,
      tooltip: "Maximum percentage of checkout cart payable via tokens",
    },
  ];

  const chartData = stats?.currencyFlow && stats.currencyFlow.length > 0
    ? stats.currencyFlow
    : [
        { name: "Mon", amount: 12400 },
        { name: "Tue", amount: 18200 },
        { name: "Wed", amount: 15600 },
        { name: "Thu", amount: 24800 },
        { name: "Fri", amount: 31200 },
        { name: "Sat", amount: 28400 },
        { name: "Sun", amount: 38900 },
      ];

  const distributionData = [
    { name: "Triggers", value: 45, color: "#f59e0b" },
    { name: "Streaks & Logins", value: 25, color: "#6366f1" },
    { name: "Events", value: 18, color: "#10b981" },
    { name: "Peer Tipping", value: 12, color: "#a855f7" },
  ];

  const rankMedals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-4">
      {/* 1. Compact Hero Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-3.5 sm:p-4 shadow-xs">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] dark:opacity-[0.08]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Coins className="h-2.5 w-2.5" />
                Economic Treasury
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-2.5 w-2.5" />
                {currencyName} Active
              </span>
            </div>

            <div>
              <h2 className="text-sm sm:text-base lg:text-lg font-extrabold tracking-tight text-foreground leading-tight">
                {currencyName} Treasury &amp; Balances
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed max-w-xl">
                Monitor circulating supply, velocity flow, burn rates, and top token holders across all subsystems.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 min-w-[180px] shrink-0">
            <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-1.5 px-2 flex items-center gap-2 shadow-2xs">
              <div className="h-6 w-6 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Wallet className="h-3 w-3" />
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Circulating
                </span>
                <span className="text-xs font-extrabold text-foreground tabular-nums">
                  {formatNumber(totalBalance)} {currencyName}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-1.5 px-2 flex items-center gap-2 shadow-2xs">
              <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="h-3 w-3" />
              </div>
              <div>
                <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Burn Flow
                </span>
                <span className="text-xs font-extrabold text-foreground tabular-nums">
                  {formatNumber(redemptionVolume)} {currencyName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact KPI Cards */}
      <section className="space-y-2">
        <DashboardSectionHeading
          title="ECONOMIC VITALS &amp; METRICS"
          titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} />
          ))}
        </div>
      </section>

      {/* 3. Compact Graphic Charts */}
      <section className="space-y-2">
        <DashboardSectionHeading
          title="CURRENCY VELOCITY &amp; ALLOCATION"
          titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-4 pt-3 sm:pt-3.5">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-amber-500" />
                    {currencyName} Minting &amp; Flow
                  </span>
                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="text-lg sm:text-xl font-extrabold tracking-tight tabular-nums text-foreground">
                      {formatNumber(totalEarned)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {currencyName} generated
                    </span>
                  </div>
                </div>

                <div className="flex items-center rounded-md border border-border/70 bg-muted/30 p-0.5">
                  {(["7d", "30d", "90d"] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setFilterRange(key)}
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-semibold rounded transition-all cursor-pointer",
                        filterRange === key
                          ? "bg-background text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {key === "7d" ? "7D" : key === "30d" ? "30D" : "90D"}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-2.5 pt-0.5 px-2 sm:px-3 relative min-h-[180px]">
                {isLoading ? (
                  <div className="h-[180px] w-full flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={185}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: -28, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="amberCurrency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        className="stroke-muted-foreground/15"
                      />

                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={6}
                        className="text-[9px] font-medium text-muted-foreground"
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatNumber}
                        className="text-[9px] font-medium text-muted-foreground"
                      />

                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-border/80 bg-background/95 backdrop-blur-md p-2 shadow-lg min-w-[120px] space-y-0.5">
                                <p className="text-[10px] font-bold text-foreground border-b border-border/50 pb-0.5">
                                  {label}
                                </p>
                                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                                  <span>Amount:</span>
                                  <span className="tabular-nums">
                                    {formatNumber(Number(payload[0]?.value || 0))} {currencyName}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fill="url(#amberCurrency)"
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: "#f59e0b",
                          strokeWidth: 2,
                          stroke: "hsl(var(--background))",
                        }}
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 mb-2 px-3 sm:px-4 pt-3 sm:pt-3.5">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                    <PieChartIcon className="h-3 w-3 text-primary" />
                    Allocation Channels
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    Sources of token earnings
                  </p>
                </div>

                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Allocation
                </span>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 pb-2.5 pt-0.5 px-3 sm:px-4 relative min-h-[180px]">
                <div className="relative w-full sm:w-[130px] h-[130px] shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={56}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="drop-shadow-xs hover:opacity-85 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-sm font-black text-foreground tabular-nums leading-none">
                      100%
                    </span>
                    <span className="text-[7px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">
                      Supply
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-1">
                  {distributionData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-1 px-1.5 rounded-lg bg-card/70 border border-border/50 text-[10px]"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-foreground truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-foreground tabular-nums">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Compact Parameters & Top Earners Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-3 sm:px-4 pt-3 sm:pt-3.5">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-primary" />
                  Configuration &amp; Guardrails
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 space-y-2">
              <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Currency Node
                  </span>
                  <span className="text-xs font-extrabold text-foreground mt-0.2 block">
                    {config?.currencyName || "Coins"}
                  </span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Primary
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    TC Factor
                  </span>
                  <span className="text-xs font-extrabold text-foreground font-mono mt-0.2 block">
                    {config?.normalizationFactor || "1.0"}×
                  </span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Ratio
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Cart Burn Cap
                  </span>
                  <span className="text-xs font-extrabold text-foreground font-mono mt-0.2 block">
                    {config?.maxTcPercentage || 30}%
                  </span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Guard
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-3 sm:px-4 pt-3 sm:pt-3.5">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  Top {currencyName} Earners
                </span>
              </div>

              <Link href="/gamification/points-and-badges/leaderboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-primary font-bold h-6 px-2 rounded hover:bg-muted"
                >
                  Leaderboard <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="flex-1 p-0 divide-y divide-border/50">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 sm:px-4 py-2 animate-pulse">
                    <div className="h-3.5 w-3.5 rounded bg-muted" />
                    <div className="h-6.5 w-6.5 rounded-full bg-muted" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2.5 w-24 rounded bg-muted" />
                    </div>
                  </div>
                ))
              ) : topEarners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Coins className="h-6 w-6 mb-1 opacity-30" />
                  <span className="text-[10px] font-medium">No records</span>
                </div>
              ) : (
                topEarners.slice(0, 4).map((earner: any, index: number) => {
                  const user = earner.user;
                  const rank = index + 1;

                  return (
                    <div
                      key={user?.id || index}
                      className="flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-bold tabular-nums w-4 text-center shrink-0">
                          {rank <= 3 ? rankMedals[rank - 1] : `#${rank}`}
                        </span>

                        <UserProfileHoverCard
                          user={{
                            id: user?.id,
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            avatar: user?.avatar,
                          }}
                        >
                          <Link
                            href={`/members/${user?.id}`}
                            className="flex items-center gap-2 group min-w-0 flex-1"
                          >
                            <Avatar className="h-6.5 w-6.5 border border-border/70 shrink-0">
                              <AvatarImage
                                src={
                                  user?.avatar
                                    ? `https://cdn.thrico.network/${user.avatar}`
                                    : ""
                                }
                                alt={user?.firstName}
                              />
                              <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">
                                {user?.firstName?.substring(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-bold text-foreground truncate block group-hover:text-primary transition-colors">
                                {user?.firstName} {user?.lastName}
                              </span>
                              <span className="text-[8px] font-semibold text-muted-foreground block">
                                {formatNumber(earner.balance || 0)} {currencyName}
                              </span>
                            </div>
                          </Link>
                        </UserProfileHoverCard>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-black text-foreground tabular-nums block">
                          {formatNumber(earner.totalEarned || earner.balance || 0)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
