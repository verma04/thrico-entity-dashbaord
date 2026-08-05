"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

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
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetMomentDashboardKPIs,
  useGetAllMoments,
} from "@/graphql/actions/moments";
import { TimeRange } from "@/graphql/actions/dashboard";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useModuleStore } from "@/store/useModuleStore";
import { CtaButton } from "@/components/ui/cta-button";

function MomentsDashboardPage() {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);
  const [timeRange, setTimeRange] = React.useState<TimeRange>(
    TimeRange.LAST_30_DAYS,
  );
  const [currentViewPage, setCurrentViewPage] = React.useState(1);
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
    refetch: refetchStats,
  } = useGetMomentDashboardKPIs(timeRange, formattedDateRange);
  const stats = statsData?.getMomentAnalytics;

  const {
    data: momentsData,
    loading: momentsLoading,
    refetch: refetchMoments,
  } = useGetAllMoments({
    pagination: { page: currentViewPage, limit: 5 },
    sortBy: "totalViews",
    sortOrder: "desc",
  });
  const topMoments = momentsData?.getAllMoments?.data || [];
  const topMomentsMeta = momentsData?.getAllMoments?.meta;

  const handleRefetch = () => {
    refetchStats();
    refetchMoments();
  };

  const watchHours = Math.floor((stats?.totalWatchTime ?? 0) / 3600);
  const watchMinutes = Math.floor(((stats?.totalWatchTime ?? 0) % 3600) / 60);

  const kpis = [
    {
      title: `Total ${moduleName}`,
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
    {
      title: "Total View Time",
      value: `${watchHours}h ${watchMinutes}m`,
      icon: Clock,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${singularName} Analytics`}
        badgeText={moduleName}
        description="Monitor video performance, engagement trends, and content growth across the platform."
        icon={Video}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_30_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => handleRefetch()}
            >
              <RotateCcw
                size={14}
                className={cn(
                  (statsLoading || momentsLoading) && "animate-spin",
                )}
              />
            </Button>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/moments/create">
              <CtaButton>
                <Plus className="h-4 w-4" />
                Create {singularName}
              </CtaButton>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="space-y-10 p-8 lg:p-10">
        {/* KPI Grid */}
        <DashboardSectionHeading
          title="Overview"
          titleClassName="normal-case tracking-normal text-sm text-foreground"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Growth" />
          ))}
        </div>

        {/* Status Placeholder / Future Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <section className="space-y-4">
              <DashboardSectionHeading
                title="Historical Manifest"
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
                <div className="h-[320px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.growth || []}>
                      <defs>
                        <linearGradient
                          id="colorGrowth"
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
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 600,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                        tickFormatter={(val) => {
                          if (!val) return "";
                          return new Date(val).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
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
                      <RechartsTooltip
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
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="space-y-4">
              <DashboardSectionHeading
                title="Engagement Mix"
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
                <div className="h-[320px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.engagement || []}>
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
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
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
                        dataKey="value"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      >
                        {(stats?.engagement || []).map(
                          (entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#8b5cf6" : "#ec4899"}
                            />
                          ),
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <section className="space-y-4">
              <DashboardSectionHeading
                title={`Most Viewed ${moduleName}`}
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
                <div className="mt-6 rounded-xl border border-zinc-100 overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-50/50 border-b border-zinc-100">
                      <tr>
                        <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">
                          {singularName}
                        </th>
                        <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">
                          Creator
                        </th>
                        <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">
                          Date
                        </th>
                        <th className="px-6 py-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {momentsLoading ? (
                        Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <tr key={i}>
                              <td className="px-6 py-4">
                                <div className="h-4 w-32 bg-zinc-100 animate-pulse rounded" />
                              </td>
                              <td className="px-6 py-4">
                                <div className="h-4 w-24 bg-zinc-100 animate-pulse rounded" />
                              </td>
                              <td className="px-6 py-4">
                                <div className="h-4 w-20 bg-zinc-100 animate-pulse rounded" />
                              </td>
                              <td className="px-6 py-4">
                                <div className="h-4 w-12 bg-zinc-100 animate-pulse rounded ml-auto" />
                              </td>
                            </tr>
                          ))
                      ) : topMoments.length > 0 ? (
                        topMoments.map((moment) => (
                          <tr
                            key={moment.id}
                            className="hover:bg-zinc-50/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-8 bg-zinc-100 rounded overflow-hidden shrink-0">
                                  {moment.thumbnailUrl ? (
                                    <img
                                      src={`https://cdn.thrico.network${moment.thumbnailUrl}`}
                                      alt="Thumbnail"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-white">
                                      <Video size={12} />{" "}
                                    </div>
                                  )}
                                </div>
                                <span className="font-bold text-zinc-900 text-xs truncate max-w-[200px]">
                                  {moment.caption ||
                                    `Untitled ${singularName}`}{" "}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-zinc-600 text-xs">
                                {moment.owner?.firstName}{" "}
                                {moment.owner?.lastName}{" "}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-zinc-400 text-xs tabular-nums">
                                {new Date(
                                  moment.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-black text-indigo-600 text-xs tabular-nums bg-indigo-50 px-2 py-1 rounded">
                                {moment.totalViews?.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-zinc-400 text-xs font-medium italic"
                          >
                            No {moduleName.toLowerCase()} found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {topMomentsMeta && topMomentsMeta.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                    <span className="text-xs font-medium text-zinc-400">
                      Showing {(currentViewPage - 1) * 5 + 1} to{" "}
                      {Math.min(currentViewPage * 5, topMomentsMeta.totalItems)}{" "}
                      of {topMomentsMeta.totalItems} entries
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        disabled={!topMomentsMeta.hasPreviousPage}
                        onClick={() =>
                          setCurrentViewPage((p) => Math.max(1, p - 1))
                        }
                      >
                        <ChevronLeft size={14} />
                      </Button>
                      <span className="text-xs font-bold text-zinc-900 px-2">
                        Page {currentViewPage} of {topMomentsMeta.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        disabled={!topMomentsMeta.hasNextPage}
                        onClick={() =>
                          setCurrentViewPage((p) =>
                            Math.min(topMomentsMeta.totalPages, p + 1),
                          )
                        }
                      >
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsDashboardPage, "MOMENTS", "canRead"),
  "moments",
);
