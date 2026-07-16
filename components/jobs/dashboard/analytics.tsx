"use client";

import React, { useState } from "react";
import { 
  useJobStats, 
  TimeRange,
  useJobApplicationTrend,
  useJobTypeDistribution
} from "@/graphql/actions/jobs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Briefcase,
  Users,
  Eye,
  FileText,
  Activity,
  Zap,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Globe,
  ArrowRight,
  Timer,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function JobsAnalytics() {
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

  const dateRangeParam = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data, loading, refetch: refetchStats } = useJobStats(
    timeRange,
    dateRangeParam
  );

  const { data: trendData, refetch: refetchTrend } = useJobApplicationTrend(
    timeRange,
    dateRangeParam
  );

  const { data: typeData, refetch: refetchType } = useJobTypeDistribution(
    timeRange,
    dateRangeParam
  );

  const handleRefetch = () => {
    refetchStats();
    refetchTrend();
    refetchType();
  };

  const stats = data?.getJobStats;

  const kpis = [
    {
      title: "Total Jobs",
      value: loading ? "..." : (stats?.totalJobs?.toLocaleString() ?? "0"),
      trend: stats?.totalJobsChange ?? 0,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Jobs",
      value: loading ? "..." : (stats?.activeJobs?.toLocaleString() ?? "0"),
      trend: stats?.activeJobsChange ?? 0,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Applications",
      value: loading ? "..." : (stats?.totalApplications?.toLocaleString() ?? "0"),
      trend: stats?.applicationsChange ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Visibility",
      value: loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const applicationsData = trendData?.getJobApplicationTrend || [];
  
  const jobMatrixData = typeData?.getJobTypeDistribution || [];

  return (
    <EcosystemWrapper anonymized-1="jobs-analytics">
      <EcosystemHeader
        title="Jobs Overview"
        badgeText="Job Stats"
        description="Track job postings, applications, and growth across your platform."
        icon={Briefcase}
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
              onClick={handleRefetch}
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
              title="Application Velocity"
              description="Daily response cycle"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-xl border border-dashed border-border">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={applicationsData}>
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
                      <Tooltip
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
                        dataKey="applications" 
                        fill="#6366f1" 
                        radius={[4, 4, 0, 0]} 
                        barSize={32} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <EcosystemCard
              title="Job Matrix"
              description="Department distribution"
              icon={BarChart3}
            >
              <div className="space-y-5 mt-4">
                {jobMatrixData.map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        {item.name.replace("-", " ")}
                      </span>
                      <span className="text-xs font-bold text-foreground leading-none">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((item.value / Math.max(...jobMatrixData.map(d => d.value), 1)) * 100, 100)}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Candidates</p>
                  <p className="text-xl font-bold text-foreground tracking-tight">{stats?.totalApplications?.toLocaleString() ?? "0"}</p>
                </div>
                <Link href="/jobs/all">
                  <Button variant="outline" className="h-10 px-4 rounded-lg border-border font-bold text-[10px] uppercase tracking-widest text-muted-foreground gap-2 hover:bg-muted/50 transition-all shadow-sm">
                    All Jobs
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>

            <div className="p-8 rounded-2xl bg-primary text-primary-foreground text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-400/20">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Growth Signal</h4>
                </div>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  Platform hiring velocity has increased by 18% in the current cycle.
                </p>
                <Button
                  variant="link"
                  className="text-[10px] font-bold text-orange-400 uppercase tracking-widest p-0 group-hover:translate-x-1 transition-transform"
                >
                  View Market Report <ArrowRight size={10} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
