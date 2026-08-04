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
  Area,
  AreaChart,
} from "recharts";

import {
  Flame,
  Ticket,
  Activity,
  Package,
  Trophy,
  TrendingUp,
  BarChart3,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import {
  useGetRewardStats,
  TimeRange,
} from "@/graphql/actions/rewards";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { Skeleton } from "@/components/ui/skeleton";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

const TOP_REWARDS = [
  { name: "Amazon ₹100", value: 124, pct: 100 },
  { name: "Premium 10%", value: 86, pct: 69 },
  { name: "Starbucks", value: 72, pct: 58 },
  { name: "Event Ticket", value: 45, pct: 36 },
  { name: "Zomato Pro", value: 38, pct: 31 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f43f5e", "#f97316"];

export default function AnalyticsPage() {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);
  const [timeRange, setTimeRange] = React.useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
  };

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? { startDate: dateRange.from.toISOString(), endDate: dateRange.to.toISOString() }
    : undefined;

  const { data, loading } = useGetRewardStats(timeRange, formattedDateRange);
  const stats = data?.getRewardStats;

  const chartData =
    stats?.redemptionTrend?.map((t: any) => ({
      name: new Date(t.date).toLocaleDateString("en-US", { weekday: "short" }),
      value: t.count || 0,
      tc: t.value || 0,
    })) || [];

  const kpis = [
    {
      title: "Points Used",
      value: loading
        ? "..."
        : stats
          ? stats.totalTcBurned > 1000
            ? `${(stats.totalTcBurned / 1000).toFixed(1)}k`
            : stats.totalTcBurned
          : "0",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
      desc: "Total points spent on rewards",
      trend: 12.4,
    },
    {
      title: "Redemptions",
      value: loading ? "..." : stats?.totalRedemptions?.toLocaleString() || "0",
      icon: Ticket,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      desc: "Total rewards claimed",
      trend: 8.1,
    },
    {
      title: "Active Rewards",
      value: loading ? "..." : stats?.activeCoupons?.toString() || "0",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      desc: "Currently available to members",
      trend: 0,
    },
    {
      title: "Low Stock",
      value: loading ? "..." : stats?.lowInventoryItems?.toString() || "0",
      icon: Package,
      color: "text-rose-600",
      bg: "bg-rose-50",
      desc: "Items needing restock",
      trend: -3.2,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-zinc-900 text-white rounded-xl px-4 py-3 shadow-xl text-xs">
        <p className="font-semibold">{payload[0]?.value?.toLocaleString()} {payload[0]?.name === "tc" ? "points" : "redemptions"}</p>
      </div>
    );
  };

  return (
    <EcosystemWrapper data-section="rewards-analytics">
      <EcosystemHeader
        title={`${rewardsModuleName} Analytics`}
        badgeText="Analytics"
        description={`Track redemptions, points usage, and which ${rewardsModuleName.toLowerCase()} your members love most.`}
        icon={BarChart3}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Rewards", href: "/gamification/rewards" }, { label: "Analytics" }]}
        actions={
          <EcosystemActionBar shadow="none" className="p-0 border-none bg-transparent">
            <div className="flex items-center gap-3 flex-wrap">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateChange}
                defaultValue="LAST_7_DAYS"
              />
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live data
              </div>
            </div>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="space-y-6 p-6 lg:p-8">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 overflow-hidden hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.title}</span>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border border-border/50", kpi.bg)}>
                  <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                </div>
              </div>

              <div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                    {kpi.value}
                  </span>
                  {kpi.trend !== 0 && (
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-0.5",
                      kpi.trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {kpi.trend > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                      {Math.abs(kpi.trend)}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{kpi.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Redemptions Area Chart */}
          <EcosystemCard
            title="Daily Redemptions"
            description="How many rewards were claimed each day"
            icon={TrendingUp}
          >
            <div className="h-[260px] w-full mt-4">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                  <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center border border-border">
                    <TrendingUp className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">No data yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] leading-relaxed">
                      Trends appear once members start redeeming
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="redemptGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} dy={8} />
                    <YAxis fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#redemptGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </EcosystemCard>

          {/* Points Spent Line Chart */}
          <EcosystemCard
            title="Points Spent Over Time"
            description="Total points used by members per day"
            icon={Flame}
          >
            <div className="h-[260px] w-full mt-4">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                  <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center border border-border">
                    <Flame className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">No data yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] leading-relaxed">
                      Points data appears once members start redeeming
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} dy={8} />
                    <YAxis fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="tc"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </EcosystemCard>
        </div>

        {/* Most Popular Rewards — horizontal bar as custom list */}
        <EcosystemCard
          title="Most Popular Rewards"
          description="The rewards your members redeem the most often"
          icon={Trophy}
        >
          <div className="space-y-4 mt-4">
            {TOP_REWARDS.map((r, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn(
                      "shrink-0 h-5 w-5 rounded-full text-[10px] font-black flex items-center justify-center",
                      i === 0 ? "bg-yellow-100 text-yellow-700" : "bg-muted text-muted-foreground"
                    )}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-foreground tabular-nums">{r.value}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">claims</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${r.pct}%`, backgroundColor: COLORS[i] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </EcosystemCard>

        {/* Dummy engagement breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Avg. redemptions per user", value: "2.4", icon: Ticket, sub: "per month" },
            { label: "Points per redemption", value: "183", icon: Zap, sub: "average cost" },
            { label: "Repeat claimers", value: "61%", icon: Activity, sub: "of redeemers" },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
              <div className="h-10 w-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{m.value}</p>
                <p className="text-[11px] text-muted-foreground/60">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
