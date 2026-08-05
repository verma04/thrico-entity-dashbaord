"use client";

import React from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
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
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  BarChart,
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
        breadcrumbs={[{ label: "Feed", href: "/feed" }, { label: "Analytics" }]}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
          </div>
        }
      />

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <section className="space-y-4">
          <DashboardSectionHeading
            title="Core Feed Stats"
            titleClassName="normal-case tracking-normal text-sm text-foreground"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Total Reach",
                value: kpis?.aggregateReach ?? "0",
                trend: kpis?.reachTrend ?? 0,
                icon: LayoutGrid,
                color: "text-indigo-500",
                bg: "bg-indigo-500",
                tooltip:
                  "Estimated reach based on total posts, shares, and interactions",
              },
              {
                title: "Active Posts",
                value: kpis?.activeDialogue ?? "0",
                trend: kpis?.dialogueTrend ?? 0,
                icon: Activity,
                color: "text-emerald-500",
                bg: "bg-emerald-500",
                tooltip:
                  "Total number of interactions (likes + comments) in this period",
              },
              {
                title: "Network Velocity",
                value: kpis?.networkVelocity?.toFixed(2) ?? "0",
                trend: kpis?.velocityTrend ?? 0,
                icon: TrendingUp,
                color: "text-violet-500",
                bg: "bg-violet-500",
                tooltip: "Average interactions per post",
              },
              {
                title: "Engagement Yield",
                value: kpis?.engagementYield?.toFixed(2) ?? "0",
                trend: kpis?.yieldTrend ?? 0,
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-500",
                suffix: "%",
                tooltip: "Percentage of reach that resulted in interaction",
              },
            ].map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} trendLabel="vs last period" />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Chart Section */}
          <section className="lg:col-span-8 space-y-4">
            <DashboardSectionHeading
              title="Engagement Timeline"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="h-[350px] w-full p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <ResponsiveContainer>
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
          </section>

          {/* Interest Matrix Section */}
          <section className="lg:col-span-4 space-y-4">
            <DashboardSectionHeading
              title="Content Types"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="min-h-fit p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <div className="h-[250px] w-full mb-8 relative flex items-center justify-center">
                <ResponsiveContainer>
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
            </div>
          </section>
        </div>

        {/* Promoted Events Section */}
        {promotedEvents && promotedEvents.length > 0 && (
          <section className="mt-4 space-y-4">
            <DashboardSectionHeading
              title="Promoted Events"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <div className="flex flex-col gap-2">
                {promotedEvents.map((event: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 rounded-xl border border-border/40 bg-gradient-to-r from-muted/30 to-transparent hover:bg-muted/60 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-[10px] font-bold uppercase leading-none mb-0.5">
                          {event.date ? event.date.split(" ")[0] : "TBA"}
                        </span>
                        <span className="text-sm font-black leading-none">
                          {event.date
                            ? event.date.split(" ")[1]?.replace(",", "")
                            : ""}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:ml-auto shrink-0 pl-14 sm:pl-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        <span className="max-w-[120px] truncate">
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
