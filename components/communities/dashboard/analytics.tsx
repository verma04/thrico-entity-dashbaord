"use client";

import React, { useState } from "react";
import {
  useGetCommunitiesStats,
  TopCommunity,
  TopCreator,
  StatusDistributionPoint,
} from "@/graphql/actions/communities";
import { TimeRange } from "@/graphql/actions/dashboard";
import {
  Users,
  LayoutGrid,
  Activity,
  RotateCcw,
  Globe,
  Eye,
  Search,
  Users2,
} from "lucide-react";
import { Tooltip, Cell, PieChart, Pie } from "recharts";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { AccessDeniedAlert } from "@/components/shared/access-denied-alert";
import { useModuleStore } from "@/store/useModuleStore";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";

const STATUS_COLORS = ["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#e4e4e7"];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <div className="h-6 w-6 border-2 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-medium text-muted-foreground">
        Getting info...
      </p>
    </div>
  </div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
    <div className="flex flex-col items-center gap-2">
      <Search size={20} className="text-zinc-200" />
      <p className="text-xs font-medium text-muted-foreground text-center px-6">
        {message}
      </p>
    </div>
  </div>
);

export default function CommunitiesAnalytics() {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
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

  const { data, loading, refetch, error } = useGetCommunitiesStats(
    timeRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined,
  );
  const stats = data?.getCommunitiesStats;

  if (error) {
    return (
      <EcosystemWrapper anonymized-1="communities-analytics">
        <EcosystemHeader
          title={`${singularName} Stats`}
          description="Check your growth, members, and health."
          badgeText="Overview"
          icon={Users2}
          actions={
            <div className="flex items-center gap-3">
              <DateRangePicker
                date={dateRange}
                onDateChange={() => {}}
                defaultValue="LAST_7_DAYS"
                actions={
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
                      onClick={() => refetch()}
                    >
                      <RotateCcw
                        size={14}
                        className={cn(loading && "animate-spin")}
                      />
                    </Button>
                  </div>
                }
              />
              <div className="h-4 w-px bg-muted mx-1" />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-muted-foreground rounded-lg"
                disabled
              >
                <RotateCcw size={14} />
              </Button>
            </div>
          }
        />

        <EcosystemContainer className="">
          <div className="max-w-3xl space-y-4">
            <DashboardSectionHeading
              title="Access Restricted"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
              <div className="p-2">
                <AccessDeniedAlert
                  message={
                    error.message ||
                    `You do not have permission to view ${singularName.toLowerCase()} analytics.`
                  }
                />
              </div>
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  const kpis = [
    {
      title: "All Groups",
      value: loading
        ? "..."
        : (stats?.totalCommunities?.toLocaleString() ?? "0"),
      trend: stats?.totalCommunitiesChange ?? 0,
      icon: LayoutGrid,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Live Now",
      value: loading
        ? "..."
        : (stats?.activeCommunities?.toLocaleString() ?? "0"),
      trend: stats?.activeCommunitiesChange ?? 0,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Members",
      value: loading
        ? "..."
        : (stats?.totalEnrollments?.toLocaleString() ?? "0"),
      trend: stats?.enrollmentsChange ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Globe,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const statusDistribution = stats?.statusDistribution ?? [];
  const totalStatusCount = statusDistribution.reduce(
    (acc: number, item: StatusDistributionPoint) => acc + item.value,
    0,
  );
  const topCommunities = stats?.topCommunities ?? [];
  const topCreators = stats?.topCreators ?? [];

  return (
    <EcosystemWrapper anonymized-1="communities-analytics">
      <EcosystemHeader
        title={`${singularName} Stats`}
        description="Check your growth, members, and health."
        badgeText="Overview"
        icon={Users2}
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <section className="space-y-4">
          <DashboardSectionHeading
            title="Metrics Overview"
            titleClassName="normal-case tracking-normal text-sm text-foreground"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} trendLabel="vs before" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="space-y-4">
              <DashboardSectionHeading
                title={`Best ${moduleName}`}
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="w-full overflow-x-auto">
                <div className="rounded-[20px] border border-transparent bg-muted/30 p-5 min-w-[500px]">
                  {loading ? (
                    <div className="h-72">
                      <ChartSkeleton />
                    </div>
                  ) : topCommunities.length === 0 ? (
                    <div className="h-72">
                      <EmptyChart message="No info to show for this time." />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {topCommunities
                      .slice(0, 6)
                      .map((community: TopCommunity, idx: number) => {
                        const maxMembers = topCommunities[0]?.members || 1;
                        const barWidth = Math.round(
                          (community.members / maxMembers) * 100,
                        );

                        return (
                          <div
                            key={community.name}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-semibold text-foreground truncate">
                                  {community.name}
                                </span>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                                    <Users
                                      size={12}
                                      className="text-muted-foreground"
                                    />
                                    {community.members.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                    <Eye size={10} />
                                    {community.views.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-1000"
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <DashboardSectionHeading
                title="Top Creators"
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topCreators
                    .slice(0, 6)
                    .map((creator: TopCreator, idx: number) => (
                      <div
                        key={creator.name}
                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-border hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden">
                            {creator.avatar ? (
                              <img
                                src={getPreferredMediaUrl(creator?.avatar)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              creator.name.charAt(0)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {creator.name}
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              {creator.communitiesCreated} {moduleName}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground group-hover:text-muted-foreground transition-colors">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="space-y-4">
              <DashboardSectionHeading
                title={`${singularName} Status`}
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="flex flex-col gap-6">
                <div className="relative h-64 w-full flex items-center justify-center">
                  {loading ? (
                    <ChartSkeleton />
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1000}
                          >
                            {statusDistribution.map((_: any, i: number) => (
                              <Cell
                                key={i}
                                fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e4e4e7",
                              borderRadius: "12px",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center translate-y-1">
                          <span className="text-2xl font-bold text-foreground block leading-none">
                            {totalStatusCount}
                          </span>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            TOTAL
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="w-full space-y-2">
                  {statusDistribution.map(
                    (item: StatusDistributionPoint, i: number) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 rounded-[20px] bg-muted/30 border border-transparent"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[i % STATUS_COLORS.length],
                            }}
                          />
                          <span className="text-xs font-semibold text-muted-foreground capitalize">
                            {item.name.toLowerCase()}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-foreground tabular-nums">
                          {item.value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
