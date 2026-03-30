"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  RotateCcw,
  BarChart3,
  Globe,
  ArrowRight,
  Timer,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
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
import { Button } from "@/components/ui/button";
// import { useGetMembersStats } from "@/graphql/actions";

export default function MembersPage() {
  let loading = true;
  const data = {
    getMembersStats: {
      totalMembers: 0,
      activeMembers: 0,
      newMembersThisMonth: 0,
    },
  };

  const kpis = [
    {
      title: "Aggregate Population",
      value: loading
        ? "..."
        : (data?.getMembersStats?.totalMembers?.toLocaleString() ?? "0"),
      trend: 12, // Placeholder
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Verified Nodes",
      value: loading
        ? "..."
        : (data?.getMembersStats?.activeMembers?.toLocaleString() ?? "0"),
      trend: 8, // Placeholder
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Instantiation Velocity",
      value: loading
        ? "..."
        : (data?.getMembersStats?.newMembersThisMonth?.toLocaleString() ?? "0"),
      trend: 24, // Placeholder
      icon: UserPlus,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Engagement Ratio",
      value: "94.2%",
      trend: 2, // Placeholder
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const growthData = [
    { name: "JAN", members: 4000 },
    { name: "FEB", members: 4500 },
    { name: "MAR", members: 4800 },
    { name: "APR", members: 5200 },
    { name: "MAY", members: 5800 },
    { name: "JUN", members: 6300 },
  ];

  const roleData = [
    { name: "ENGINEERING", value: 455, color: "#6366f1" },
    { name: "DESIGN", value: 320, color: "#a78bfa" },
    { name: "PRODUCT", value: 240, color: "#10b981" },
    { name: "MARKETING", value: 180, color: "#f59e0b" },
  ];

  return (
    <EcosystemWrapper anonymized-1="members-registry">
      <EcosystemHeader
        title="Network Population"
        badgeText="Identity Registry"
        description="Monitor community growth velocity, node verification protocols, and architectural identity expansion across the global registry."
        icon={Users}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemStatusIndicator
              status="active"
              label="Identity Stream: Operational"
            />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Node Registry</span>
            </div>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-slate-200 font-bold hover:bg-slate-50 transition-all gap-2"
            >
              <Activity className="h-4 w-4 text-emerald-500" />
              Live telemetry
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Population Growth"
              description="Temporal identity instantiation cycles"
              icon={TrendingUp}
              decorationIcon={Zap}
            >
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient
                        id="colorMembers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
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
                      }}
                      itemStyle={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "10px",
                      }}
                      labelStyle={{ display: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="members"
                      stroke="#6366f1"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorMembers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Archetype Matrix"
              description="Registry role distribution"
              icon={Sparkles}
              decorationIcon={LayoutGrid}
              className="min-h-fit"
            >
              <div className="h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "16px",
                      }}
                      itemStyle={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "10px",
                      }}
                      labelStyle={{ display: "none" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {roleData.map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.name}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 italic">
                      <div
                        className="h-full rounded-full transition-all duration-1000 group-hover/item:scale-x-105 origin-left"
                        style={{
                          width: `${(item.value / 500) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
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
