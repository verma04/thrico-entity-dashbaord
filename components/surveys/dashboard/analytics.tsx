"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  Timer,
  ArrowRight,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

import { useGetSurveyStats, TimeRange } from "@/graphql/surveys/survey-queries";
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
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

export default function SurveyAnalytics() {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);
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

  const { data, loading, refetch } = useGetSurveyStats(
    timeRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined
  );

  const stats = data?.getSurveyStats;

  const kpis = [
    {
      title: `Total ${moduleName}`,
      value: loading ? "..." : (stats?.totalSurveys?.toLocaleString() ?? "0"),
      trend: stats?.totalSurveysChange ?? 0,
      icon: ClipboardList,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: `Active ${moduleName}`,
      value: loading ? "..." : (stats?.activeSurveys?.toLocaleString() ?? "0"),
      trend: stats?.activeSurveysChange ?? 0,
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Total Responses",
      value: loading ? "..." : (stats?.totalResponses?.toLocaleString() ?? "0"),
      trend: stats?.totalResponsesChange ?? 0,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Completion Rate",
      value: loading ? "..." : `${stats?.completionRate?.toFixed(1) ?? "0"}%`,
      trend: stats?.completionRateChange ?? 0,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const responseTrendData =
    stats?.responseTrend?.map((item: { date: string; count: number }) => ({
      name: item.date,
      responses: item.count,
    })) || [];

  const surveyStatusData =
    stats?.statusDistribution?.map(
      (item: { status: string; count: number }) => ({
        name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
        value: item.count,
        color:
          item.status === "PUBLISHED"
            ? "#18181b"
            : item.status === "DRAFT"
              ? "#6366f1"
              : "#a1a1aa",
      }),
    ) || [];

  return (
    <EcosystemWrapper anonymized-1="surveys-analytics">
      <EcosystemHeader
        title="Feedback Analytics"
        description={`Monitor response rates, ${singularName.toLowerCase()} status distribution, and engagement trends.`}
        badgeText="Overview"
        icon={BarChart3}
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

            <div className="h-4 w-px bg-zinc-200 mx-1" />

            <Link href="/surveys/all">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                All {moduleName}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetch()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="v. last period" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Response Activity"
              description="Real-time feedback velocity"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTrendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                      />
                      <Tooltip
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
                      <Line
                        type="monotone"
                        dataKey="responses"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#fff", strokeWidth: 2, stroke: "#6366f1" }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Status Distribution"
              description={`${singularName} lifecycle breakdown`}
              icon={Sparkles}
            >
              <div className="h-[250px] w-full mb-6 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={surveyStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {surveyStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                    {stats?.totalSurveys || "0"}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                    Total
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {surveyStatusData.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">
                      {item.value}
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
