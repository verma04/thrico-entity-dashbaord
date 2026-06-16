"use client";

import React, { useState } from "react";
import { useGetOfferStats, TimeRange } from "@/graphql/actions/offers";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Tag,
  Check,
  Zap,
  Eye,
  Activity,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Globe,
  ArrowRight,
  Timer,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

import { useModuleStore } from "@/store/useModuleStore";

export default function OffersAnalytics() {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);
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

  const { data, loading, refetch } = useGetOfferStats(
    timeRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined
  );

  const stats = data?.getOfferStats;

  const kpis = [
    {
      title: `Aggregate ${moduleName}`,
      value: loading ? "..." : (stats?.totalOffers?.toLocaleString() ?? "0"),
      trend: stats?.totalOffersChange ?? 0,
      icon: Tag,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
    {
      title: "Active Now",
      value: loading ? "..." : (stats?.activeOffers?.toLocaleString() ?? "0"),
      trend: stats?.activeOffersChange ?? 0,
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Claim Yield",
      value: loading ? "..." : (stats?.claims?.toLocaleString() ?? "0"),
      trend: stats?.claimsChange ?? 0,
      icon: Check,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Views",
      value: loading ? "..." : (stats?.views?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange ?? 0,
      icon: Eye,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const claimsTrendData = stats?.trend || [];
  const matrixData = stats?.matrix || [];

  return (
    <EcosystemWrapper anonymized-1="offers-analytics">
      <EcosystemHeader
        title={`${moduleName} Analytics`}
        description={`Monitor ${singularName.toLowerCase()} velocity, claim trends, and customer conversion cycles.`}
        badgeText="Overview"
        icon={ShoppingBag}
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
            <EcosystemKPI key={i} {...kpi} trendLabel="Period stats" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Claim Velocity"
              description="Temporal conversion cycles"
              icon={TrendingUp}
            >
              <div className="h-[350px] w-full mt-6">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={claimsTrendData} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                        dy={10}
                        tickFormatter={(val) => {
                          if (!val) return "";
                          return new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        }}
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
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar
                        dataKey="claims"
                        fill="#18181b"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        animationDuration={1500}
                      >
                        {claimsTrendData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === claimsTrendData.length - 1 ? "#6366f1" : "#18181b"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Commerce Matrix"
              description="Category yield allocation"
              icon={BarChart3}
            >
              <div className="space-y-5 mt-4">
                {matrixData.map((item: any, i: number) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                        {item.name}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 leading-none">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden border border-zinc-100">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Yield Rate
                  </p>
                  <p className="text-xl font-bold text-zinc-900 tracking-tight">
                    {stats?.yieldRate ?? 0}%
                  </p>
                </div>
                <Link href="/offers/all">
                  <Button
                    variant="outline"
                    className="h-10 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
                  >
                    Manage
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </EcosystemCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
