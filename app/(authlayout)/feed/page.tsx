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

  const { data: kpiData } = useGetFeedIntelligenceKPI(
    timeRange,
    formattedDateRange,
  );
  const { data: yieldData } = useGetFeedYieldVelocity(
    timeRange,
    formattedDateRange,
  );
  const { data: interestData } = useGetFeedInterestMatrix(
    timeRange,
    formattedDateRange,
  );
  const { data: eventsData } = useGetPromotedNodeEvents({
    variables: { timeRange, dateRange: formattedDateRange },
  });

  const kpis = kpiData?.getFeedIntelligenceKPI;

  const chartData = yieldData?.getFeedYieldVelocity;
  const matrixData = interestData?.getFeedInterestMatrix;
  const promotedEvents = eventsData?.getPromotedNodeEvents;

  return (
    <EcosystemWrapper anonymized-1="feed">
      <EcosystemHeader
        title="Feed Analytics"
        badgeText="Overview"
        description="Monitor feed engagement, content trends, and user activity."
        icon={Share2}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Feed Status: Active"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified System</span>
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
                Feed Settings
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
              title: "Total Reach",
              value: kpis?.aggregateReach,
              trend: kpis?.reachTrend,
              icon: LayoutGrid,
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
            },
            {
              title: "Active Posts",
              value: kpis?.activeDialogue,
              trend: kpis?.dialogueTrend,
              icon: Activity,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              title: "Engagement Rate",
              value: kpis?.networkVelocity?.toFixed(2),
              trend: kpis?.velocityTrend,
              icon: TrendingUp,
              color: "text-violet-500",
              bg: "bg-violet-500/10",
            },
            {
              title: "Total Interactions",
              value: kpis?.engagementYield?.toFixed(2),
              trend: kpis?.yieldTrend,
              icon: Zap,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
          ].map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Change" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Chart Section */}
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Engagement Timeline"
              description="Daily engagement and activity"
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
              title="Content Types"
              description="Distribution of post categories"
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
                    Total
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
                        {item.name}
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
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
