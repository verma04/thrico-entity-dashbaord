"use client";

import React from "react";
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
  LayoutGrid,
  Activity,
  TrendingUp,
  Zap,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import Link from "next/link";
import {
  useGetFeedIntelligenceKPI,
  useGetFeedYieldVelocity,
  useGetFeedInterestMatrix,
  useGetPromotedNodeEvents,
  TimeRange,
} from "@/graphql/actions/feed";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function FeedPage() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>(TimeRange.LAST_7_DAYS);
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

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data: kpiData } = useGetFeedIntelligenceKPI(timeRange, formattedDateRange);
  const { data: yieldData } = useGetFeedYieldVelocity(timeRange, formattedDateRange);
  const { data: interestData } = useGetFeedInterestMatrix(timeRange, formattedDateRange);
  const { data: eventsData } = useGetPromotedNodeEvents({
    variables: { timeRange, dateRange: formattedDateRange }
  });

  const kpis = kpiData?.getFeedIntelligenceKPI;

  const chartData = yieldData?.getFeedYieldVelocity;
  const matrixData = interestData?.getFeedInterestMatrix;
  const promotedEvents = eventsData?.getPromotedNodeEvents;

  return (
    <EcosystemWrapper anonymized-1="feed-intelligence">
      <EcosystemHeader
        title="Dialogue Intelligence"
        badgeText="Feed Registry"
        description="Monitor community engagement velocity, content protocols, and architectural network expansion across the global feed registry."
        icon={Share2}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Dialogue Stream: Operational"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Content Registry</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Link href="/feed/settings">
              <Button className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all active:scale-95 group">
                Feed Protocol
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Aggregate Reach",
              value: kpis?.aggregateReach,
              trend: kpis?.reachTrend,
              icon: LayoutGrid,
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
            },
            {
              title: "Active Dialogue",
              value: kpis?.activeDialogue,
              trend: kpis?.dialogueTrend,
              icon: Activity,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              title: "Network Velocity",
              value: kpis?.networkVelocity,
              trend: kpis?.velocityTrend,
              icon: TrendingUp,
              color: "text-violet-500",
              bg: "bg-violet-500/10",
            },
            {
              title: "Engagement Yield",
              value: kpis?.engagementYield,
              trend: kpis?.yieldTrend,
              icon: Zap,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
          ].map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Yield" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Chart Section */}
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Yield Velocity"
              description="Temporal signup instantiation cycles"
              icon={TrendingUp}
              decorationIcon={Zap}
            >
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "16px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      itemStyle={{
                        color: "#fff",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: "10px",
                      }}
                      labelStyle={{ display: "none" }}
                    />
                    <Bar
                      dataKey="signups"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                      barSize={40}
                      animationDuration={1500}
                    >
                      {chartData?.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#6366f1" : "#10b981"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          {/* Interest Matrix Section */}
          <div className="lg:col-span-4">
            <EcosystemCard
              title="Interest Matrix"
              description="Registry tier allocation"
              icon={Sparkles}
              decorationIcon={LayoutGrid}
              className="min-h-fit"
            >
              <div className="h-[250px] w-full mb-8 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={matrixData as any[]}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {matrixData?.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">
                    100%
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Matrix
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {matrixData?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="group/item flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2.5 w-2.5 rounded-full shadow-lg transition-transform group-hover/item:scale-150"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.name} Protocol
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </EcosystemCard>
          </div>
        </div>

        {/* Promoted Events Registry */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
                Promoted Node Events
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">
                Registry level event propagation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotedEvents?.map((event: any, i: number) => (
              <div
                key={i}
                className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                  <Calendar className="h-24 w-24" />
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 px-4 flex items-center bg-indigo-50 border border-indigo-100 rounded-xl text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-2 group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed uppercase tracking-tight mb-8">
                  {event.description}
                </p>
                <div className="space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-8">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
