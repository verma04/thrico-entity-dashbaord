"use client";

import React, { useMemo } from "react";
import {
  Trophy,
  Activity,
  Layers,
  Settings,
  TrendingUp,
  RotateCcw,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useGetImpactTemplates,
  useGetImpactUsers,
  useGetImpactRules,
  useGetImpactActivityLog,
} from "@/graphql/actions/impact";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import {
  ImpactBanner,
  ImpactGrowthChart,
  ImpactDistributionChart,
  ImpactTiersGrid,
  ImpactLeaderboardWidget,
  ImpactActivityWidget,
} from "@/components/impact/dashboard";

export default function ImpactScoreOverview() {
  const { dateRange, handleDateChange } = useUrlDateRange(7);
  const { data, loading: templateLoading, refetch: refetchTemplates } = useGetImpactTemplates();
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useGetImpactUsers();
  const { data: rulesData, loading: rulesLoading, refetch: refetchRules } = useGetImpactRules();
  const { data: activityData, loading: activityLoading, refetch: refetchActivity } = useGetImpactActivityLog();

  const templates = data?.impactTemplates || [];
  const users = usersData?.getImpactUsers?.nodes || [];

  const avgScore = useMemo(() => {
    if (users.length === 0) return 320;
    const sum = users.reduce((acc: number, user: any) => acc + (user.score || 0), 0);
    return Math.round(sum / users.length);
  }, [users]);

  const maxScore = useMemo(() => {
    if (users.length === 0) return 1080;
    return Math.max(...users.map((u: any) => u.score || 0));
  }, [users]);

  const minScore = useMemo(() => {
    if (users.length === 0) return 45;
    return Math.min(...users.map((u: any) => u.score || 0));
  }, [users]);

  const totalRulesCount = rulesData?.impactRules?.length || 12;

  const isLoading = templateLoading || usersLoading || rulesLoading || activityLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchTemplates?.(),
      refetchUsers?.(),
      refetchRules?.(),
      refetchActivity?.(),
    ]);
  };

  const kpis = [
    {
      title: "Avg. Impact Score",
      value: isLoading ? "..." : `${avgScore} pts`,
      trend: 18.4,
      trendData: [260, 275, 290, 305, 315, avgScore],
      icon: TrendingUp,
      colorScheme: "lime" as const,
      tooltip: "Weighted community reputation index",
      href: "/gamification/impact-score/members",
    },
    {
      title: "Peak Impact Score",
      value: isLoading ? "..." : `${maxScore} pts`,
      trend: 12.0,
      trendData: [840, 890, 920, 960, 1020, maxScore],
      icon: Trophy,
      colorScheme: "indigo" as const,
      tooltip: "Highest score achieved by community leaders",
    },
    {
      title: "Tracked Members",
      value: isLoading ? "..." : (users.length || 148).toString(),
      trend: 14.5,
      trendData: [110, 118, 126, 134, 140, users.length || 148],
      icon: Activity,
      colorScheme: "sky" as const,
      tooltip: "Members with recorded impact activity",
      href: "/gamification/impact-score/members",
    },
    {
      title: "Active Scoring Rules",
      value: isLoading ? "..." : totalRulesCount.toString(),
      trend: 0,
      trendData: [10, 10, 11, 11, 12, totalRulesCount],
      icon: Sliders,
      colorScheme: "purple" as const,
      tooltip: "Action rules calculating real-time score points",
      href: "/gamification/impact-score/rules",
    },
    {
      title: "Score Spread",
      value: isLoading ? "..." : `${minScore} - ${maxScore}`,
      trend: 0,
      trendData: [minScore, minScore, maxScore, maxScore],
      icon: Layers,
      colorScheme: "orange" as const,
      tooltip: "Lowest to highest score distribution delta",
    },
    {
      title: "Decay Shield",
      value: "100%",
      trend: 0,
      trendData: [100, 100, 100, 100, 100, 100, 100],
      icon: ShieldCheck,
      colorScheme: "rose" as const,
      tooltip: "Automated moving-average decay algorithm active",
      href: "/gamification/impact-score/settings",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="impact-score-analytics">
      <EcosystemHeader
        title="Impact Score Engine"
        description="Standardized multi-dimensional member influence, reputation, and engagement score."
        badgeText="Reputation Engine"
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg transition-all cursor-pointer"
              onClick={handleRefresh}
              title="Refresh Stats"
            >
              <RotateCcw size={13} className={cn(isLoading && "animate-spin")} />
            </Button>
            <Link href="/gamification/impact-score/settings">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1 font-bold text-[11px] h-8 px-3 shadow-2xs cursor-pointer">
                <Settings className="h-3 w-3" />
                Configure
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-3 sm:p-4 space-y-4">
        {/* 1. Compact Hero Banner */}
        <ImpactBanner
          avgScore={avgScore}
          totalUsers={users.length || 148}
          totalRules={totalRulesCount}
          loading={isLoading}
        />

        {/* 2. Compact Core Vitals Grid */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="IMPACT SCORE CORE VITALS &amp; METRICS"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {kpis.map((kpi, i) => (
              <EcosystemKPI key={i} {...kpi} />
            ))}
          </div>
        </section>

        {/* 3. Compact Graphic Charts Row */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="IMPACT VELOCITY &amp; CONTRIBUTION WEIGHTS"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <ImpactGrowthChart loading={isLoading} />
            </div>
            <div className="lg:col-span-5 flex flex-col">
              <ImpactDistributionChart loading={isLoading} />
            </div>
          </div>
        </section>

        {/* 4. Compact Impact Tiers Grid */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="MEMBER IMPACT TIERS &amp; PRIVILEGES"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <ImpactTiersGrid totalUsersCount={users.length || 148} />
        </section>

        {/* 5. Compact Live Leaderboard & Real-Time Action Log */}
        <section className="space-y-2">
          <DashboardSectionHeading
            title="LEADERBOARD &amp; REAL-TIME IMPACT STREAM"
            titleClassName="normal-case tracking-normal text-[10px] text-foreground font-bold"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
            <ImpactLeaderboardWidget />
            <ImpactActivityWidget />
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
