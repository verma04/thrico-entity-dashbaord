"use client";

import React, { useState } from "react";
import { useGetCommunitiesStats, TopCommunity, TopCreator, StatusDistributionPoint } from "@/graphql/actions/communities";
import { TimeRange } from "@/graphql/actions/dashboard";
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
  Search,
  Users2
} from "lucide-react";
import {
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { 
  EcosystemKPI,
  EcosystemCard
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import moment from "moment";

const STATUS_COLORS = ["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#e4e4e7"];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <div className="h-6 w-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      <p className="text-xs font-medium text-zinc-400">
        Syncing data...
      </p>
    </div>
  </div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
    <div className="flex flex-col items-center gap-2">
      <Search size={20} className="text-zinc-200" />
      <p className="text-xs font-medium text-zinc-400 text-center px-6">
        {message}
      </p>
    </div>
  </div>
);

export default function CommunitiesAnalytics() {
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

  const { data, loading, refetch } = useGetCommunitiesStats(
    timeRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined
  );
  const stats = data?.getCommunitiesStats;

  const kpis = [
    {
      title: "Total Communities",
      value: loading ? "..." : (stats?.totalCommunities?.toLocaleString() ?? "0"),
      trend: stats?.totalCommunitiesChange ?? 0,
      icon: LayoutGrid,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Nodes",
      value: loading ? "..." : (stats?.activeCommunities?.toLocaleString() ?? "0"),
      trend: stats?.activeCommunitiesChange ?? 0,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Member Growth",
      value: loading ? "..." : (stats?.totalEnrollments?.toLocaleString() ?? "0"),
      trend: stats?.enrollmentsChange ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Global Reach",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Globe,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const statusDistribution = stats?.statusDistribution ?? [];
  const totalStatusCount = statusDistribution.reduce((acc: number, item: StatusDistributionPoint) => acc + item.value, 0);
  const topCommunities = stats?.topCommunities ?? [];
  const topCreators = stats?.topCreators ?? [];

  return (
    <EcosystemWrapper anonymized-1="communities-analytics">
       <EcosystemHeader
        title="Community Analytics"
        description="Monitor network expansion, member engagement, and ecosystem health metrics."
        badgeText="Overview"
        icon={Users2}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 px-1">
               <Activity className="h-4 w-4 text-emerald-500" />
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
                  Network Status: Operational
               </span>
            </div>

            <div className="flex items-center gap-3">
              <DateRangePicker 
                date={dateRange}
                onDateChange={handleDateChange}
                defaultValue="LAST_7_DAYS"
              />
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                variant="outline"
                className="h-9 px-4 rounded-xl border-slate-200 font-bold hover:bg-slate-50 transition-all gap-2"
                onClick={() => refetch()}
              >
                <RotateCcw className={cn("h-3.5 w-3.5 text-emerald-500", loading && "animate-spin")} />
                Refresh
              </Button>
            </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} trendLabel="v. last period" />
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
               <EcosystemCard
                  title="Top Performing Communities"
                  description="Member acquisition and visibility ranking"
                  icon={BarChart3}
               >
                  {loading ? (
                  <div className="h-72"><ChartSkeleton /></div>
                  ) : topCommunities.length === 0 ? (
                  <div className="h-72"><EmptyChart message="No community data available for this period." /></div>
                  ) : (
                  <div className="space-y-1">
                     {topCommunities.slice(0, 6).map((community: TopCommunity, idx: number) => {
                        const maxMembers = topCommunities[0]?.members || 1;
                        const barWidth = Math.round((community.members / maxMembers) * 100);

                        return (
                        <div
                           key={community.name}
                           className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                        >
                           <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-400">
                              {idx + 1}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-semibold text-zinc-900 truncate">
                                 {community.name}
                              </span>
                              <div className="flex items-center gap-4 text-zinc-500">
                                 <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                                    <Users size={12} className="text-zinc-400" />
                                    {community.members.toLocaleString()}
                                 </span>
                                 <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                                    <Eye size={10} />
                                    {community.views.toLocaleString()}
                                 </span>
                              </div>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
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
               </EcosystemCard>

               <EcosystemCard
                  title="Ecosystem Architects"
                  description="Leading community creators"
                  icon={Crown}
               >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topCreators.slice(0, 6).map((creator: TopCreator, idx: number) => (
                     <div
                        key={creator.name}
                        className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="h-9 w-9 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 overflow-hidden">
                           {creator.avatar ? (
                              <img src={creator.avatar} alt="" className="w-full h-full object-cover" />
                           ) : (
                              creator.name.charAt(0)
                           )}
                           </div>
                           <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-zinc-900 truncate">{creator.name}</p>
                           <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                              {creator.communitiesCreated} Communities
                           </p>
                           </div>
                        </div>
                        <div className="text-xs font-bold text-zinc-300 group-hover:text-zinc-400 transition-colors">
                           #{idx + 1}
                        </div>
                     </div>
                  ))}
                  </div>
               </EcosystemCard>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <EcosystemCard
                  title="Status Flow"
                  description="Distribution by lifecycle"
                  icon={Sparkles}
               >
                  <div className="flex flex-col items-center gap-6">
                  <div className="relative h-48 w-full flex items-center justify-center">
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
                              innerRadius={60}
                              outerRadius={85}
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
                               <span className="text-2xl font-bold text-zinc-900 block leading-none">
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
                     {statusDistribution.map((item: StatusDistributionPoint, i: number) => (
                        <div
                        key={item.name}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/50 border border-zinc-100"
                        >
                        <div className="flex items-center gap-2.5">
                           <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                           />
                           <span className="text-xs font-semibold text-zinc-600">
                              {item.name}
                           </span>
                        </div>
                        <span className="text-xs font-bold text-zinc-900 tabular-nums">
                           {item.value}
                        </span>
                        </div>
                     ))}
                  </div>
                  </div>
               </EcosystemCard>

               <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <TrendingUp size={48} />
                  </div>
                  <h4 className="text-base font-bold tracking-tight mb-2">Platform Growth</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
                     Community-driven nodes are expanding the ecosystem utility reach by 12.4% year-over-year.
                  </p>
                  <Button 
                     size="sm"
                     className="w-full font-bold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
                  >
                     Review Expansion Pack
                  </Button>
               </div>
            </div>
         </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

