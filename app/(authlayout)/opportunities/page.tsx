"use client";

import React, { useState } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import {
  Briefcase,
  TrendingUp,
  Target,
  Users,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useAdminOpportunities } from "@/graphql/actions/opportunities";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

function OpportunitiesDashboard() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const { data } = useAdminOpportunities({
    variables: {
      input: {
        pagination: {
          limit: 100,
          offset: 0,
        },
      },
    },
    fetchPolicy: "network-only",
  });

  const opportunities = data?.adminGetOpportunities.data || [];
  const totalOpportunities = data?.adminGetOpportunities.meta.totalItems || 0;

  const totalViews = opportunities.reduce(
    (acc, curr) => acc + (curr.viewsCount || 0),
    0,
  );
  const totalSaved = opportunities.reduce(
    (acc, curr) => acc + (curr.savedCount || 0),
    0,
  );
  const totalInterested = opportunities.reduce(
    (acc, curr) => acc + (curr.interestedCount || 0),
    0,
  );

  const kpis = [
    {
      title: "Total Opportunities",
      value: totalOpportunities.toLocaleString(),
      trend: 12,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Total Interested",
      value: totalInterested.toLocaleString(),
      trend: 24,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Saved",
      value: totalSaved.toLocaleString(),
      trend: 5,
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Views",
      value:
        totalViews > 1000
          ? (totalViews / 1000).toFixed(1) + "K"
          : totalViews.toString(),
      trend: 18,
      icon: Target,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  // Group by date for the last 7 days
  const trendDataMap = new Map();
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i).toISOString().split("T")[0];
    trendDataMap.set(d, { date: d, posts: 0 });
  }

  opportunities.forEach((opp) => {
    if (opp.createdAt) {
      try {
        const d = new Date(Number(opp.createdAt)).toISOString().split("T")[0];
        if (trendDataMap.has(d)) {
          trendDataMap.get(d).posts += 1;
        }
      } catch (e) {
        const d = new Date(opp.createdAt).toISOString().split("T")[0];
        if (trendDataMap.has(d)) {
          trendDataMap.get(d).posts += 1;
        }
      }
    }
  });
  const trendData = Array.from(trendDataMap.values());

  const categoryCount = opportunities.reduce((acc: any, curr: any) => {
    const cat = curr.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#14b8a6",
  ];
  const categoryData =
    Object.keys(categoryCount).length > 0
      ? Object.keys(categoryCount).map((key, i) => ({
          name: key.replace(/_/g, " "),
          value: categoryCount[key],
          color: COLORS[i % COLORS.length],
        }))
      : [{ name: "No Data", value: 100, color: "#cbd5e1" }];

  return (
    <EcosystemWrapper anonymized-1="opportunities">
      <EcosystemHeader
        title="Opportunities Analytics"
        description="Monitor opportunity trends, application velocity, and engagement."
        badgeText="Overview"
        icon={Briefcase}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/opportunities/settings">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 text-xs font-bold border-zinc-200 group"
              >
                Settings
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <DashboardSectionHeading
          title="Overview"
          titleClassName="normal-case tracking-normal text-sm text-foreground"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="v. last period" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <section className="space-y-4">
              <DashboardSectionHeading
                title="Growth Pulse"
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
                <div className="h-[350px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="colorPosts"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.08}
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
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                      dy={10}
                      tickFormatter={(val) => {
                        if (!val) return "";
                        return new Date(val).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    />
                    <RechartsTooltip
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
                    <Area
                      type="monotone"
                      dataKey="posts"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPosts)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="space-y-4">
              <DashboardSectionHeading
                title="Category Mix"
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
                <div className="h-64 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 px-2 mt-4">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </section>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(OpportunitiesDashboard, "OPPORTUNITIES", "canRead"),
  "opportunities",
);
