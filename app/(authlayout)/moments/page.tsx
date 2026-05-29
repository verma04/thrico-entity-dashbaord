"use client";

import React from "react";
import {
  Video,
  Plus,
  Loader2,
  Heart,
  Eye,
  Users,
  TrendingUp,
  Zap,
  ShieldCheck,
  Activity,
  Share2,
  Sparkles,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMomentDashboardKPIs } from "@/graphql/actions/moments";
import { TimeRange } from "@/graphql/actions/dashboard";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
  EcosystemStatusIndicator,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MomentsDashboardPage() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(TimeRange.LAST_30_DAYS);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
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

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const {
    data: statsData,
    loading: statsLoading,
    refetch,
  } = useGetMomentDashboardKPIs(timeRange, formattedDateRange);
  const stats = statsData?.getMomentAnalytics;

  const kpis = [
    {
      title: "Total Moments",
      value: stats?.totalMoments ?? 0,
      icon: Video,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Total Views",
      value: stats?.totalViews?.toLocaleString() ?? 0,
      icon: Eye,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Engagement",
      value: (
        (stats?.totalReactions ?? 0) + (stats?.totalComments ?? 0)
      ).toLocaleString(),
      icon: Heart,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Active Creators",
      value: stats?.activeCreators ?? 0,
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Moment Analytics"
        badgeText="Moments"
        description="Monitor video performance, engagement trends, and content growth across the platform."
        icon={Video}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Reality Stream: Active"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Verified Node</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_30_DAYS"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-lg transition-all bg-white border-slate-200"
              onClick={() => refetch()}
            >
              <RotateCcw
                className={cn("h-4 w-4", statsLoading && "animate-spin")}
              />
            </Button>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Link href="/moments/create">
              <Button className="h-10 px-6 rounded-lg bg-slate-900 border-none font-bold text-xs uppercase tracking-wide gap-2 shadow-sm hover:bg-black transition-all active:scale-95 group">
                <Plus className="h-4 w-4" />
                Create Moment
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Growth" />
          ))}
        </div>

        {/* Status Placeholder / Future Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Historical Manifest"
              description="Temporal video propagation & engagement telemetry"
              icon={TrendingUp}
              decorationIcon={Zap}
            >
              <div className="h-[320px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.growth || []}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                      dy={10} 
                      tickFormatter={(val) => {
                        if (!val) return "";
                        return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "12px" }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "11px" }}
                      labelStyle={{ display: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorGrowth)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Engagement Mix"
              description="Interaction distribution"
              icon={Activity}
            >
              <div className="h-[320px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.engagement || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: '11px' }}
                      labelStyle={{ display: "none" }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40} 
                    >
                      {
                        (stats?.engagement || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#8b5cf6" : "#ec4899"} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
