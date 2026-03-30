"use client";

import React, { useState } from "react";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Heart, 
  Star, 
  FileText, 
  Repeat, 
  Eye, 
  Shield, 
  MessageSquare, 
  Trophy, 
  Calendar, 
  ShoppingBag, 
  Target, 
  Sparkles,
  RefreshCcw,
  LucideIcon,
  Circle,
  Users
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
} from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useGetCommunityKPIs, TimeRange } from "@/graphql/actions/dashboard";

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------
interface CommunityKPICardProps {
  title: string;
  value: string | number;
  change: number;
  trend: number[];
  icon?: LucideIcon;
  statusColor?: string;
  subtext?: string;
}

const CommunityKPICard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  statusColor = "bg-emerald-500",
  subtext = "vs last period"
}: CommunityKPICardProps) => {
  const isPositive = change >= 0;
  const chartData = trend.map((val, i) => ({ value: val, id: i }));

  return (
    <div className="group relative bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-none">
          {title}
        </span>
        {Icon ? (
          <Icon className="h-4 w-4 text-muted-foreground/60" />
        ) : (
          <div className={cn("h-2 w-2 rounded-full", statusColor)} />
        )}
      </div>

      {/* Main Value & Change */}
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-foreground tracking-tight mb-1.5 tabular-nums">
          {value}
        </h3>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
            isPositive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          )}>
            {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {isPositive ? "+" : ""}{change}%
          </div>
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            {subtext}
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-9 -mx-5 -mb-5 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.08}/>
                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#10b981" : "#f43f5e"} 
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Module Performance Card
// ---------------------------------------------------------------------------
const ModulePerformanceCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon,
  color = "text-primary"
}: { 
  title: string; 
  value: string; 
  subtext: string; 
  icon: LucideIcon;
  color?: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all duration-200 group">
    <div className="flex items-center gap-3.5">
      <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
        <Icon className={cn("h-4.5 w-4.5", color)} />
      </div>
      <div className="min-w-0">
        <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-none mb-1">
          {title}
        </h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold text-foreground tracking-tight tabular-nums">{value}</span>
          <span className="text-[10px] text-muted-foreground/60 truncate">{subtext}</span>
        </div>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, refetch } = useGetCommunityKPIs(timeRange);

  const kpis = data?.getCommunityKPIs;

  const vitals = [
    { title: "Daily Active Users", key: "dailyActiveUsers", color: "bg-emerald-500" },
    { title: "Monthly Active Users", key: "monthlyActiveUsers", color: "bg-blue-500" },
    { title: "Engagement Rate", key: "engagementRate", color: "bg-amber-400" },
    { title: "Retention Rate", key: "retentionRate", color: "bg-indigo-500" },
    { title: "New Members", key: "newMembers", color: "bg-cyan-500" },
    { title: "Churn Rate", key: "churnRate", color: "bg-rose-500" },
    { title: "Community Health", key: "healthIndex", color: "bg-red-500" },
    { title: "Member Happiness", key: "communityNPS", color: "bg-yellow-400" },
  ];

  const contentFeed = [
    { title: "Total Posts", key: "totalPosts", icon: FileText },
    { title: "Post Frequency", key: "contributionFrequency", icon: Zap },
    { title: "Reply Rate", key: "interactionReciprocity", icon: Repeat },
    { title: "Post Views", key: "contentReach", icon: Eye },
  ];

  const acquisitionRet = [
    { title: "Member Activation", key: "memberActivationRate", icon: Target },
    { title: "Word of Mouth", key: "communityAdvocacyIndex", icon: Heart },
    { title: "Superfan Count", key: "superfanRatio", icon: Star },
  ];

  const modulePerformanceList = [
    { title: "Communities", icon: Users, color: "text-blue-600" },
    { title: "Events", icon: Calendar, color: "text-orange-600" },
    { title: "Jobs", icon: Target, color: "text-emerald-600" },
    { title: "Shop & Listings", icon: ShoppingBag, color: "text-purple-600" },
    { title: "Polls & Surveys", icon: FileText, color: "text-yellow-600" },
    { title: "Discussions", icon: MessageSquare, color: "text-pink-600" },
    { title: "Gamification", icon: Trophy, color: "text-amber-600" },
    { title: "Leaderboard", icon: Trophy, color: "text-yellow-600" },
    { title: "Offers", icon: Target, color: "text-rose-600" },
    { title: "Stories", icon: Sparkles, color: "text-violet-600" },
    { title: "Mentorship", icon: Users, color: "text-cyan-600" },
    { title: "Moderation", icon: Shield, color: "text-red-600" },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Community Overview"
        badgeText="Live Stats"
        description="Track how your community is growing, engaging, and interacting in real-time."
        icon={Activity}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-muted-foreground">
                All systems running normally
              </span>
            </div>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Item>
            <Select 
              value={timeRange} 
              onValueChange={(val: any) => setTimeRange(val)}
            >
              <SelectTrigger className="w-[170px] h-9 rounded-lg bg-card border-border text-foreground text-xs font-medium">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-lg">
                <SelectItem value={TimeRange.LAST_24_HOURS}>Last 24 Hours</SelectItem>
                <SelectItem value={TimeRange.LAST_7_DAYS}>Last 7 Days</SelectItem>
                <SelectItem value={TimeRange.LAST_30_DAYS}>Last 30 Days</SelectItem>
                <SelectItem value={TimeRange.LAST_90_DAYS}>Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-3.5 rounded-lg text-xs gap-2"
            onClick={() => refetch()}
          >
            <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button 
            size="sm"
            className="h-9 px-3.5 rounded-lg text-xs gap-2"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Insights
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 py-8 px-4 lg:px-6 border-none bg-transparent shadow-none ring-0">
        
        {/* 1. Core Stats */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Core Community Stats</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {vitals.map((v) => {
              const item = kpis?.[v.key as keyof typeof kpis] as any;
              return (
                <CommunityKPICard
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  change={item?.change ?? 0}
                  trend={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  statusColor={v.color}
                />
              );
            })}
          </div>
        </section>

        {/* 2. Content & Feed */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Content & Feed</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {contentFeed.map((v) => {
                const item = kpis?.[v.key as keyof typeof kpis] as any;
                return (
                  <CommunityKPICard
                    key={v.key}
                    title={v.title}
                    value={loading ? "..." : (item?.value ?? "0")}
                    change={item?.change ?? 0}
                    trend={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                    icon={v.icon}
                  />
                );
              })}
            </div>
            
            {/* Content Type Breakdown */}
            <div className="lg:col-span-4 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">What members are posting</h3>
                <Button variant="link" className="text-[10px] text-muted-foreground font-medium p-0 h-auto">View all →</Button>
              </div>
              <div className="space-y-5">
                {kpis?.contentTypeBreakdown?.map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-medium">{item.type}</span>
                      <span className="text-foreground font-semibold tabular-nums">{item.percentage}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          i === 0 ? "bg-indigo-500" : 
                          i === 1 ? "bg-purple-500" : 
                          i === 2 ? "bg-pink-500" : 
                          i === 3 ? "bg-amber-500" : 
                          "bg-muted-foreground/30"
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                )) || (
                  <div className="flex flex-col items-center justify-center h-36 text-muted-foreground/40 text-[11px]">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Moderation Overview & Module Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Moderation */}
          <section className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-rose-500" />
                <h2 className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Safety & Moderation</h2>
              </div>
              <div className="text-rose-600 dark:text-rose-400 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                7 pending
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Count</th>
                    <th className="px-4 py-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kpis?.moderationStats?.map((stat, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-[12px] text-foreground/80">{stat.type}</td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-foreground tabular-nums">{stat.count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Circle className={cn(
                            "h-1.5 w-1.5 fill-current",
                            stat.status === "Urgent" ? "text-rose-500" : stat.status === "Review" ? "text-amber-500" : "text-emerald-500"
                          )} />
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{stat.status}</span>
                        </div>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-[11px] text-muted-foreground/50">No active alerts</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Module Performance Grid */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">How people use features</span>
              <div className="h-px bg-border flex-1" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {modulePerformanceList.map((mod, i) => {
                const dataItem = kpis?.modulePerformance?.find(m => m.module === mod.title);
                return (
                  <ModulePerformanceCard
                    key={mod.title}
                    title={mod.title}
                    icon={mod.icon}
                    value={dataItem?.value?.toString() ?? "0"}
                    subtext={dataItem?.subtext ?? "Initializing..."}
                    color={mod.color}
                  />
                );
              })}
            </div>
          </section>
        </div>

        {/* 4. Acquisition & Retention */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Growing & Keeping Members</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {acquisitionRet.map((v) => {
              const item = kpis?.[v.key as keyof typeof kpis] as any;
              return (
                <CommunityKPICard
                  key={v.key}
                  title={v.title}
                  value={loading ? "..." : (item?.value ?? "0")}
                  change={item?.change ?? 0}
                  trend={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                  icon={v.icon}
                />
              );
            })}
          </div>
        </section>

      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
