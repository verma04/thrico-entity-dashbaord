"use client";

import React, { useState } from "react";
import { useGetCommunitiesStats } from "@/graphql/actions/communities";
import { TimeRange } from "@/graphql/actions";
import {
  Users,
  LayoutGrid,
  Activity,
  RotateCcw,
  BarChart3,
  Globe,
  Timer,
  Sparkles,
  Eye,
  Crown,
  TrendingUp,
  Search
} from "lucide-react";
import {
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { PlatformHeader } from "@/components/ui/platform/header";
import { PlatformGrid, PlatformContainer } from "@/components/ui/platform/container";
import { PlatformCard } from "@/components/ui/platform/card";
import { PlatformButton } from "@/components/ui/platform/button";
import { 
  EcosystemKPI,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_COLORS = ["#18181b", "#71717a", "#a1a1aa", "#d4d4d8", "#f4f4f5"];

// ─── Shared helpers ─────────────────────────────────────────────────────────

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-[20px] border border-dashed border-zinc-200">
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <div className="h-8 w-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      <p className="text-[11px] font-medium text-zinc-400">
        Loading intelligence...
      </p>
    </div>
  </div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-[20px] border border-dashed border-zinc-200">
    <div className="flex flex-col items-center gap-2">
      <Search size={24} className="text-zinc-200" />
      <p className="text-[11px] font-medium text-zinc-400 text-center px-6">
        {message}
      </p>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CommunitiesAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, refetch } = useGetCommunitiesStats(timeRange);
  const stats = data?.getCommunitiesStats;

  // KPI cards
  const kpis = [
    {
      title: "Total Communities",
      value: loading
        ? "..."
        : (stats?.totalCommunities?.toLocaleString() ?? "0"),
      trend: stats?.totalCommunitiesChange ?? 0,
      icon: LayoutGrid,
      color: "text-zinc-900",
      bg: "bg-zinc-50",
    },
    {
      title: "Active Communities",
      value: loading
        ? "..."
        : (stats?.activeCommunities?.toLocaleString() ?? "0"),
      trend: stats?.activeCommunitiesChange ?? 0,
      icon: Activity,
      color: "text-zinc-900",
      bg: "bg-zinc-50",
    },
    {
      title: "New Members",
      value: loading
        ? "..."
        : (stats?.totalEnrollments?.toLocaleString() ?? "0"),
      trend: stats?.enrollmentsChange ?? 0,
      icon: Users,
      color: "text-zinc-900",
      bg: "bg-zinc-50",
    },
    {
      title: "Total Views",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Globe,
      color: "text-zinc-900",
      bg: "bg-zinc-50",
    },
  ];

  // Derived chart data
  const statusDistribution = stats?.statusDistribution ?? [];
  const totalStatusCount = statusDistribution.reduce((s, i) => s + i.value, 0);

  const topCommunities = stats?.topCommunities ?? [];
  const topCreators = stats?.topCreators ?? [];

  return (
    <EcosystemWrapper anonymized-1="communities-analytics">
      <PlatformContainer>
        <PlatformHeader
          title="Community Overview"
          description="Analyze the growth and engagement metrics across your community ecosystem."
          icon={LayoutGrid}
          actions={
            <div className="flex items-center gap-3">
              <Select
                value={timeRange}
                onValueChange={(v) => setTimeRange(v as TimeRange)}
              >
                <SelectTrigger className="h-9 w-[160px] rounded-[10px] border-zinc-200 bg-white text-[13px] font-medium transition-all hover:bg-zinc-50">
                  <Timer size={14} className="mr-2 text-zinc-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[12px] border-zinc-100 shadow-xl">
                  <SelectItem value={TimeRange.LAST_24_HOURS} className="text-[13px] font-medium">Today</SelectItem>
                  <SelectItem value={TimeRange.LAST_7_DAYS} className="text-[13px] font-medium">Last 7 Days</SelectItem>
                  <SelectItem value={TimeRange.LAST_30_DAYS} className="text-[13px] font-medium">Last 30 Days</SelectItem>
                  <SelectItem value={TimeRange.LAST_90_DAYS} className="text-[13px] font-medium">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <PlatformButton
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                icon={RotateCcw}
                className={cn("h-9 w-9 text-zinc-400", loading && "animate-spin")}
              />
            </div>
          }
        />

        {/* ── KPI Grid ── */}
        <PlatformGrid cols={4} gap="md">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Period growth" />
          ))}
        </PlatformGrid>

        <PlatformGrid cols={12} gap="lg">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <PlatformCard
              title="Top Performing Communities"
              description="Ranked by member acquisition and engagement views."
              icon={BarChart3}
            >
              {loading ? (
                <div className="h-64"><ChartSkeleton /></div>
              ) : topCommunities.length === 0 ? (
                <div className="h-64"><EmptyChart message="No active communities found for this period." /></div>
              ) : (
                <div className="space-y-1">
                  {topCommunities.slice(0, 6).map((community, idx) => {
                    const maxMembers = topCommunities[0]?.members || 1;
                    const barWidth = Math.round((community.members / maxMembers) * 100);

                    return (
                      <div
                        key={community.name}
                        className="flex items-center gap-4 p-4 rounded-[14px] hover:bg-zinc-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-[8px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[12px] font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[14px] font-semibold text-zinc-900 truncate">
                              {community.name}
                            </span>
                            <div className="flex items-center gap-4 text-zinc-500">
                              <span className="flex items-center gap-1 text-[12px] font-medium tabular-nums">
                                <Users size={12} className="text-zinc-300" />
                                {community.members.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-[12px] font-medium tabular-nums px-2 py-0.5 rounded-full bg-zinc-100/50 uppercase tracking-wider text-zinc-400">
                                <Eye size={10} />
                                {community.views.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className="h-full bg-zinc-900 rounded-full transition-all duration-1000"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </PlatformCard>

            {/* Creators Section */}
            <PlatformCard
               title="Top Ecosystem Creators"
               description="The most influential community architects."
               icon={Crown}
            >
              <PlatformGrid cols={2} gap="md">
                {topCreators.slice(0, 6).map((creator, idx) => (
                  <div
                    key={creator.name}
                    className="flex items-center gap-3 p-3 rounded-[12px] border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all"
                  >
                    <div className="h-10 w-10 rounded-[10px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[12px] font-bold text-zinc-500 overflow-hidden">
                      {creator.avatar ? (
                        <img src={creator.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        creator.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-900 truncate">{creator.name}</p>
                      <p className="text-[11px] font-medium text-zinc-400">
                        {creator.communitiesCreated} active communities
                      </p>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-zinc-50 flex items-center justify-center text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </PlatformGrid>
            </PlatformCard>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <PlatformCard
              title="Status Distribution"
              description="Breakdown by lifecycle status"
              icon={Sparkles}
            >
              <div className="flex flex-col items-center gap-8 py-4">
                <div className="relative h-[180px] w-full flex items-center justify-center">
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
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1000}
                          >
                            {statusDistribution.map((_, i) => (
                              <Cell
                                key={i}
                                fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #f4f4f5",
                              borderRadius: "12px",
                              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <span className="text-2xl font-semibold text-zinc-900 tracking-tight block leading-none">
                            {totalStatusCount}
                          </span>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                            TOTAL
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="w-full space-y-2">
                  {statusDistribution.map((item, i) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 rounded-[10px] bg-zinc-50 border border-zinc-100/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                        />
                        <span className="text-[12px] font-medium text-zinc-500">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-zinc-900 tabular-nums">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </PlatformCard>

            {/* Quick Actions / Link */}
            <div className="bg-zinc-900 rounded-[24px] p-8 text-white space-y-4 shadow-xl">
               <div className="flex flex-col gap-1">
                 <h4 className="text-[16px] font-semibold tracking-tight">Expand Connectivity</h4>
                 <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
                   Deployment of new community nodes increases network utility by approximately 14% on average.
                 </p>
               </div>
               <PlatformButton 
                  variant="default" 
                  className="w-full justify-between bg-white text-zinc-900 hover:bg-zinc-100"
                  icon={TrendingUp}
               >
                  New Deployment
               </PlatformButton>
            </div>
          </div>
        </PlatformGrid>
      </PlatformContainer>
    </EcosystemWrapper>
  );
}
