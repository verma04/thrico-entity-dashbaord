"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  Eye,
  MousePointer,
  TrendingUp,
  Zap,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  RotateCcw,
  Globe,
  ArrowRight,
  Timer,
  Layout,
  Layers,
  Search,
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
  PieChart,
  Pie,
} from "recharts";
import { useGetDashboardStats, TimeRange } from "@/graphql/actions";
import { PlatformModules } from "./platform-modules";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleActivityChart } from "./module-activity-chart";
import { PlatformModuleChart } from "./platform-module-chart";
import { AiModerationDashboardWidget } from "@/components/moderation/ai-moderation-dashboard-widget";
import { ModerationSummaryWidget } from "@/components/moderation/moderation-summary-widget";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
  EcosystemStatusIndicator,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );
  const { data, loading, refetch } = useGetDashboardStats(timePeriod);

  const stats = data?.getDashboardStats;

  const kpis = [
    {
      title: "Aggregate Nodes (Users)",
      value: loading ? "..." : (stats?.totalUsers?.toLocaleString() ?? "0"),
      trend: stats?.totalUsersChange ?? 0,
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Real-time Presence",
      value: loading ? "..." : (stats?.activeUsers?.toLocaleString() ?? "0"),
      trend: stats?.activeUsersChange ?? 0,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Network Propagation",
      value: loading ? "..." : (stats?.pageViews?.toLocaleString() ?? "0"),
      trend: stats?.pageViewsChange ?? 0,
      icon: Eye,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Engagement Velocity",
      value: loading ? "..." : `${stats?.engagementRate ?? 0}%`,
      trend: stats?.engagementRateChange ?? 0,
      icon: MousePointer,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="platform-intelligence">
      <EcosystemHeader
        title="Command Intelligence"
        badgeText="Global Presence"
        description="Monitor architectural node expansion, propagation velocity, and cross-module telemetry across the global platform registry."
        icon={LayoutGrid}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Reality Core: Operational"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Network Integrity</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={timePeriod}
              onValueChange={(val) => setTimePeriod(val as TimeRange)}
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm">
                <Timer className="h-4 w-4 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                {Object.values(TimeRange).map((tr) => (
                  <SelectItem
                    key={tr}
                    value={tr}
                    className="font-bold uppercase text-[10px]"
                  >
                    {tr.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white"
              onClick={() => refetch()}
            >
              <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-4 lg:p-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry" />
          ))}
        </div>

        {/* Moderation Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <ModerationSummaryWidget />
          </div>
          <div className="lg:col-span-6">
            <AiModerationDashboardWidget />
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-12">
          {/* Main Analytics Grid */}
          <div className="grid  gap-10">
            {/* Platform Engagement Matrix - 8 columns */}
            <div className="lg:col-span-8">
              <EcosystemCard
                title="Cross-Module Velocity"
                description="Temporal engagement propagation across registry tiers"
                icon={TrendingUp}
                decorationIcon={Layers}
              >
                <div className="h-[400px] w-full p-0 pr-0 mb-10">
                  <PlatformModuleChart />
                </div>
              </EcosystemCard>
            </div>
          </div>

          {/* Module Registry Section */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 shadow-lg shadow-slate-200 flex items-center justify-center text-white ring-8 ring-slate-50">
                  <Layout className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                    Foundational Modules
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1.5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Registry Level Module Telemetry & Control
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                    Systems Online
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 shadow-sm p-2">
              <PlatformModules />
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
