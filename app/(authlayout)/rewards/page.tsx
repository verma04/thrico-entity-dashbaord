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
  RotateCcw,
  BarChart3,
  Gift,
  Users,
  Sparkles,
  AlertTriangle,
  Zap,
  Gamepad2,
  ChevronRight,
  Clock,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  useGetRewardStats,
  useGetRedemptions,
  useGetRewards,
} from "@/graphql/actions/rewards";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
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

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { TimeRange } from "@/graphql/actions/rewards";

export default function RewardsDashboard() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
  };

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  const {
    data: statsData,
    loading: statsLoading,
    refetch,
  } = useGetRewardStats(timeRange, formattedDateRange);
  const { data: redemptionsData, loading: redemptionsLoading } =
    useGetRedemptions({
      pagination: { page: 1, limit: 6 },
    });
  const { data: rewardsData, loading: rewardsLoading } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });

  const stats = statsData?.getRewardStats;
  const redemptions = redemptionsData?.getRedemptions || [];
  const allRewards = rewardsData?.getRewards || [];

  // Inventory computed
  const inventoryRewards = allRewards.filter((r: any) => r.inventoryRequired);
  const lowStockRewards = inventoryRewards.filter(
    (r: any) => r.remainingVouchers !== undefined && r.remainingVouchers <= 10,
  );
  const healthyRewards = inventoryRewards.filter(
    (r: any) => r.remainingVouchers === undefined || r.remainingVouchers > 10,
  );

  const kpis = [
    {
      title: "Total Redemptions",
      value: statsLoading ? "..." : stats?.totalRedemptions || "0",
      icon: Ticket,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trendLabel: "All time records",
    },
    {
      title: "Points Distributed",
      value: statsLoading
        ? "..."
        : stats?.totalTcBurned?.toLocaleString() || "0",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trendLabel: "Value given back",
    },
    {
      title: "Low Stock Items",
      value: statsLoading ? "..." : stats?.lowInventoryItems || "0",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trendLabel: "Needs attention",
    },
    {
      title: "Success Rate",
      value: statsLoading ? "..." : "94.2%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trendLabel: "Fulfillment health",
    },
  ];

  const chartData =
    stats?.redemptionTrend?.map((t: any) => ({
      name: moment(t.date).format("ddd"),
      val: t.value || 0,
    })) || [];

  const navCards = [
    {
      title: "Rewards & Codes",
      desc: "Manage offers, vouchers & inventory",
      icon: Ticket,
      link: "/rewards/coupons",
      color: "indigo",
      stat: stats?.activeCoupons || 0,
      statLabel: "active",
    },
    {
      title: "Interactions",
      desc: "Spin wheel, scratch card & match games",
      icon: Gamepad2,
      link: "/rewards/interactions",
      color: "violet",
      stat: null,
      statLabel: "3 types",
    },
    {
      title: "History",
      desc: "Full log of all claimed rewards",
      icon: History,
      link: "rewards/redemptions ",
      color: "emerald",
      stat: stats?.totalRedemptions || 0,
      statLabel: "total",
    },
    {
      title: "Security",
      desc: "Fraud rules & redemption limits",
      icon: ShieldCheck,
      link: "/rewards/fraud",
      color: "rose",
      stat: null,
      statLabel: "protected",
    },
    {
      title: "Analytics",
      desc: "Deep insights into reward performance",
      icon: BarChart3,
      link: "/rewards/analytics",
      color: "sky",
      stat: null,
      statLabel: "live data",
    },
  ];

  const colorMap: Record<
    string,
    { icon: string; badge: string; ring: string; dot: string }
  > = {
    indigo: {
      icon: "text-indigo-600",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
      ring: "group-hover:ring-indigo-200",
      dot: "bg-indigo-500",
    },
    amber: {
      icon: "text-amber-600",
      badge: "bg-amber-50 text-amber-700 border-amber-100",
      ring: "group-hover:ring-amber-200",
      dot: "bg-amber-500",
    },
    violet: {
      icon: "text-violet-600",
      badge: "bg-violet-50 text-violet-700 border-violet-100",
      ring: "group-hover:ring-violet-200",
      dot: "bg-violet-500",
    },
    emerald: {
      icon: "text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
      ring: "group-hover:ring-emerald-200",
      dot: "bg-emerald-500",
    },
    rose: {
      icon: "text-rose-600",
      badge: "bg-rose-50 text-rose-700 border-rose-100",
      ring: "group-hover:ring-rose-200",
      dot: "bg-rose-500",
    },
    sky: {
      icon: "text-sky-600",
      badge: "bg-sky-50 text-sky-700 border-sky-100",
      ring: "group-hover:ring-sky-200",
      dot: "bg-sky-500",
    },
  };

  const getStockColor = (remaining: number | undefined) => {
    if (remaining === undefined)
      return {
        text: "text-slate-500",
        bg: "bg-slate-100",
        bar: "bg-slate-300",
      };
    if (remaining <= 5)
      return { text: "text-rose-600", bg: "bg-rose-50", bar: "bg-rose-500" };
    if (remaining <= 10)
      return { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" };
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      bar: "bg-emerald-500",
    };
  };

  return (
    <EcosystemWrapper data-section="rewards-dashboard">
      <EcosystemHeader
        title="Rewards"
        description="Inspire engagement with high-value rewards and interactive gamification."
        badgeText="Rewards Center"
        icon={Gift}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Rewards active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/rewards/analytics">
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="h-3.5 w-3.5" />
                Analytics
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
              title="Refresh data"
            >
              <RotateCcw
                className={cn("h-3.5 w-3.5", statsLoading && "animate-spin")}
              />
            </Button>
            <Link href="/rewards/coupons/create">
              <Button size="sm" className="gap-2">
                <Plus className="h-3.5 w-3.5" />
                Create Reward
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {/* Gamification Feature Banner */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 md:p-8 shadow-xl shadow-indigo-500/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnpNMzYgMjR2NmgxMnYtNkgzNnpNMjQgMzR2NmgxMnYtNkgyNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/8 blur-3xl transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Interactive Rewards
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight max-w-lg">
                Scratch Cards, Spin Wheels
                <br />
                <span className="text-white/70">&amp; Match-to-Win Games</span>
              </h2>
              <p className="text-white/55 text-sm leading-relaxed max-w-sm">
                Boost engagement by up to 3× with gamified rewards. Members love
                instant-reveal experiences.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link href="/rewards/coupons/create">
                  <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-5 rounded-full text-xs h-9 gap-2 shadow-lg shadow-indigo-900/30 group/btn">
                    Get Started
                    <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/rewards/analytics">
                  <Button
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10 font-medium text-xs h-9 rounded-full px-4"
                  >
                    View analytics
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-end gap-3">
              {[
                {
                  icon: Gamepad2,
                  label: "Match",
                  delay: "200ms",
                  rotate: "-6deg",
                  size: "h-20 w-20",
                },
                {
                  icon: RotateCcw,
                  label: "Spin",
                  delay: "0ms",
                  rotate: "0deg",
                  size: "h-24 w-24 -translate-y-2",
                },
                {
                  icon: Zap,
                  label: "Scratch",
                  delay: "100ms",
                  rotate: "6deg",
                  size: "h-20 w-20",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    rotate: item.rotate,
                    transitionDelay: item.delay,
                  }}
                  className={cn(
                    "rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center gap-2 group-hover:rotate-0 transition-all duration-500",
                    item.size,
                  )}
                >
                  <item.icon className="h-7 w-7 text-white opacity-80" />
                  <span className="text-[8px] font-bold text-white/50 tracking-widest uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} />
          ))}
        </div>

        {/* Chart + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Area Chart */}
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Redemption Activity"
              description="Daily reward claims across your community"
              icon={TrendingUp}
            >
              <div className="h-[300px] w-full mt-4">
                {statsLoading ? (
                  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-border">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <div className="h-14 w-14 bg-muted rounded-2xl flex items-center justify-center border border-border">
                      <TrendingUp className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        No activity yet
                      </p>
                      <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                        Redemption trends will appear here once members start
                        claiming rewards
                      </p>
                    </div>
                    <Link href="/rewards/coupons/create">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        Create first reward
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 8, right: 0, left: -16, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="rewardGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="100%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 600,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 600,
                          fill: "#94a3b8",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "12px",
                          padding: "10px 14px",
                        }}
                        itemStyle={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                        labelStyle={{ display: "none" }}
                        formatter={(v: any) => [`${v} redemptions`, ""]}
                      />
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#rewardGrad)"
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: "#6366f1",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        animationDuration={1200}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          {/* Recent Redemptions */}
          <div className="lg:col-span-4">
            <EcosystemCard
              title="Recent Activity"
              description="Latest rewards claimed"
              icon={Users}
            >
              <div className="space-y-1 mt-3">
                {redemptionsLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-2.5 rounded-lg animate-pulse"
                    >
                      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2.5 w-32" />
                      </div>
                    </div>
                  ))
                ) : redemptions.length > 0 ? (
                  redemptions.map((act: any, i: number) => {
                    const hoverUser: UserProfileHoverData = {
                      id: act.user?.id,
                      firstName: act.user?.firstName,
                      lastName: act.user?.lastName,
                      avatar: act.user?.avatar,
                    };
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors group/item cursor-default"
                      >
                        <UserProfileHoverCard user={hoverUser}>
                          <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                            <Avatar className="h-8 w-8 border border-border shrink-0 group-hover/item:border-indigo-200 transition-colors">
                              <AvatarImage
                                src={
                                  act.user?.avatar
                                    ? `https://cdn.thrico.network/${act.user.avatar}`
                                    : ""
                                }
                                alt={act.user?.firstName}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-semibold group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
                                {act.user?.firstName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold text-foreground truncate leading-none hover:underline">
                                {act.user?.firstName} {act.user?.lastName}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate leading-none mt-0.5">
                                {act.reward?.title}
                              </p>
                            </div>
                          </div>
                        </UserProfileHoverCard>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium shrink-0">
                          <Clock className="h-3 w-3" />
                          {moment(act.createdAt).fromNow(true)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center space-y-3">
                    <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center mx-auto border border-border">
                      <History className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        No activity yet
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 max-w-[150px] mx-auto leading-relaxed">
                        Activity appears when members start redeeming
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Link href="rewards/redemptions ">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 rounded-lg"
                  >
                    View full history
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>
          </div>
        </div>

        {/* ── Inventory Snapshot ────────────────────────────────────── */}
        <EcosystemCard
          title="Inventory at a Glance"
          description="Stock levels for rewards with inventory tracking"
          icon={Package}
        >
          {rewardsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border animate-pulse"
                >
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : inventoryRewards.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center mt-2">
              <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center border border-border">
                <Package className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No inventory-tracked rewards
                </p>
                <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
                  Enable inventory tracking on a reward to monitor stock levels
                  here
                </p>
              </div>
              <Link href="/rewards/coupons/create">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full text-xs mt-1"
                >
                  <Plus className="h-3 w-3" />
                  Create reward
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="flex items-center gap-4 mt-4 mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-foreground font-bold tabular-nums">
                    {healthyRewards.length}
                  </span>
                  <span className="text-muted-foreground">healthy</span>
                </div>
                {lowStockRewards.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-foreground font-bold tabular-nums">
                      {lowStockRewards.length}
                    </span>
                    <span className="text-muted-foreground">low stock</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground font-bold tabular-nums">
                    {inventoryRewards.length}
                  </span>
                  <span className="text-muted-foreground">tracked</span>
                </div>
              </div>

              {/* Reward inventory cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Show low stock first, then healthy */}
                {[...lowStockRewards, ...healthyRewards]
                  .slice(0, 9)
                  .map((reward: any) => {
                    const remaining = reward.remainingVouchers;
                    const total = reward.totalVouchers || 0;
                    const pct =
                      total > 0
                        ? Math.round((remaining / total) * 100)
                        : remaining > 0
                          ? 100
                          : 0;
                    const colors = getStockColor(remaining);

                    return (
                      <div
                        key={reward.id}
                        className="group flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card hover:border-indigo-200/60 hover:shadow-sm transition-all"
                      >
                        {/* Thumbnail */}
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 border border-border/50 overflow-hidden shrink-0 flex items-center justify-center">
                          {reward.image ? (
                            <img
                              src={reward.image}
                              alt={reward.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Ticket className="h-4 w-4 text-muted-foreground/30" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-foreground truncate leading-tight">
                              {reward.title}
                            </h4>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0",
                                remaining !== undefined && remaining <= 10
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-100",
                              )}
                            >
                              {remaining !== undefined && remaining <= 5 ? (
                                <>
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                  Critical
                                </>
                              ) : remaining !== undefined && remaining <= 10 ? (
                                <>
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                  Low
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  OK
                                </>
                              )}
                            </span>
                          </div>

                          {/* Stock bar */}
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-700",
                                  colors.bar,
                                )}
                                style={{
                                  width: `${Math.max(pct, 2)}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span
                                className={cn(
                                  "font-bold tabular-nums",
                                  colors.text,
                                )}
                              >
                                {remaining ?? "∞"} remaining
                              </span>
                              {total > 0 && (
                                <span className="text-muted-foreground/60 tabular-nums">
                                  of {total}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* View all link */}
              {inventoryRewards.length > 9 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/rewards/coupons">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 rounded-lg"
                    >
                      View all {inventoryRewards.length} tracked rewards
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </EcosystemCard>

        {/* Navigation Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Trophy className="h-4 w-4 text-foreground/60" />
            <h2 className="text-sm font-semibold text-foreground">
              Manage your rewards program
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {navCards.map((item, i) => {
              const colors = colorMap[item.color];
              return (
                <Link key={i} href={item.link}>
                  <div
                    className={cn(
                      "group relative p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col gap-3",
                      "ring-2 ring-transparent",
                      colors.ring,
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-lg bg-muted border border-border/60 flex items-center justify-center transition-colors group-hover:bg-white group-hover:shadow-sm">
                        <item.icon
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-colors",
                            `group-hover:${colors.icon.replace("text-", "text-")}`,
                          )}
                          size={16}
                        />
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground leading-none">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground/70 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                    {item.stat !== null && (
                      <div
                        className={cn(
                          "inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide",
                          colors.badge,
                        )}
                      >
                        <span
                          className={cn("h-1 w-1 rounded-full", colors.dot)}
                        />
                        {item.stat} {item.statLabel}
                      </div>
                    )}
                    {item.stat === null && (
                      <div
                        className={cn(
                          "inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide",
                          colors.badge,
                        )}
                      >
                        <span
                          className={cn("h-1 w-1 rounded-full", colors.dot)}
                        />
                        {item.statLabel}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
