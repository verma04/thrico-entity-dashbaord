"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useGetMembersStats,
  useGetGrowthStats,
} from "@/graphql/actions/membership/membership-queries";
import { TimeRange } from "@/graphql/actions/dashboard";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import moment from "moment";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function MembersPage() {
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

  const commonVariables = {
    timeRange,
    dateRange:
      dateRange?.from && dateRange?.to
        ? {
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to.toISOString(),
          }
        : undefined,
  };

  const { data, loading, refetch } = useGetMembersStats(
    commonVariables.timeRange,
    commonVariables.dateRange,
  );

  const { data: growthStatsData, loading: growthLoading } = useGetGrowthStats(
    commonVariables.timeRange,
    commonVariables.dateRange,
    {
      refetchQueries: [], // Optional
    },
  );

  const stats = data?.getMembersStats;
  const growthData =
    growthStatsData?.getGrowthStats?.data.map((d: any) => ({
      name: moment(d.date).format("MMM"),
      Members: d.count,
    })) || [];

  const kpis = [
    {
      title: "Total Members",
      value: loading ? "..." : (stats?.totalMembers?.toLocaleString() ?? "0"),
      trend: stats?.totalMembersChange ?? 0,
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Users",
      value: loading ? "..." : (stats?.activeMembers?.toLocaleString() ?? "0"),
      trend: stats?.activeMembersChange ?? 0,
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "New Joins",
      value: loading
        ? "..."
        : (stats?.newMembersThisMonth?.toLocaleString() ?? "0"),
      trend: stats?.newMembersChange ?? 0,
      icon: UserPlus,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Active Rate",
      value: loading ? "..." : `${stats?.activeRate ?? 0}%`,
      trend: stats?.activeRateChange ?? 0,
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const handleRefresh = async () => {
    await Promise.all([refetch()]);
  };
  return (
    <EcosystemWrapper anonymized-1="members-registry">
      <EcosystemHeader
        title="Member List"
        badgeText="Directory"
        description="View and manage all members in your community, track growth, and see activity levels."
        icon={Users}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Node
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-muted mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => handleRefresh()}
            >
              <RotateCcw
                size={14}
                className={cn((loading || growthLoading) && "animate-spin")}
              />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
          <div className="lg:col-span-1">
            <EcosystemCard
              title="Growth Over Time"
              description="New members joining the community"
              icon={TrendingUp}
              decorationIcon={Zap}
            >
              <div className="h-[350px] w-full">
                {growthLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                  </div>
                ) : growthData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground font-black text-[10px] uppercase tracking-widest italic bg-muted/30 rounded-xl border border-dashed border-border">
                    No growth data available for this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient
                          id="colorMembers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
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
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
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
                      />
                      <Area
                        type="monotone"
                        dataKey="members"
                        stroke="#6366f1"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorMembers)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(MembersPage, "NETWORK", "canRead");
