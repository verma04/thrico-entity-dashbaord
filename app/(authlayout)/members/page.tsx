"use client";

import React from "react";
import {
  Users,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/users/subscription-alerts";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import {
  useGetMemberKPIDashboard,
  TimeRange,
} from "@/graphql/actions/member-kpi-dashboard";

// KPI Section components
import { KPIPipelineNav } from "@/components/members/kpi-dashboard/kpi-pipeline-nav";
import { KPINorthStar } from "@/components/members/kpi-dashboard/kpi-north-star";
import { KPIMembershipHealth } from "@/components/members/kpi-dashboard/kpi-membership-health";
import { KPIGrowthRetention } from "@/components/members/kpi-dashboard/kpi-growth-retention";
import { KPIEngagement } from "@/components/members/kpi-dashboard/kpi-engagement";
import { KPIAdvocacyGamification } from "@/components/members/kpi-dashboard/kpi-advocacy-gamification";
import { KPIMonetisation } from "@/components/members/kpi-dashboard/kpi-monetisation";
import { KPICommunityHealth } from "@/components/members/kpi-dashboard/kpi-community-health";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

function MembersPage() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [activeSection, setActiveSection] = React.useState("membership");

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRange("24h");
    else if (diffDays <= 7) setTimeRange("7d");
    else if (diffDays <= 30) setTimeRange("30d");
    else setTimeRange("90d");
  };

  const formattedDateRange = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const { data, loading, refetch } = useGetMemberKPIDashboard(
    timeRangeMap[timeRange],
    formattedDateRange,
  );

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const kpis = data?.getCommunityKPIs;

  // Build a flat record for easy access by key
  const kpiData: Record<string, any> = React.useMemo(() => {
    if (!kpis) return {};
    return { ...kpis } as Record<string, any>;
  }, [kpis]);

  const handleRefresh = async () => {
    await refetch();
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`kpi-section-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <EcosystemWrapper anonymized-1="members-kpi-dashboard">
      <EcosystemHeader
        title="Community KPI Dashboard"
        badgeText="Analytics"
        description="Full-spectrum community health metrics — Acquire, Activate, Engage, Retain, Advocate, Monetize."
        icon={BarChart3}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-border mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-indigo-600 rounded-lg transition-all border-border shadow-sm bg-background"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="space-y-10 p-6 lg:p-10">
        {/* Subscription Limit Warning Banner */}
        <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />

        {/* Pipeline Navigation */}
        <KPIPipelineNav
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />

        {/* ── North Star ── */}
        <KPINorthStar
          loading={loading}
          value={kpis?.activeUsers?.value ?? 0}
          change={kpis?.activeUsers?.change}
          trend={kpis?.activeUsers?.trend}
        />

        {/* ── 1. Membership Health ── */}
        <section id="kpi-section-membership" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading
            title="Membership Health"
            icon={<Users className="h-3.5 w-3.5 text-cyan-500" />}
            description="Baseline membership vitals and activity rates"
          />
          <KPIMembershipHealth loading={loading} data={kpiData} />
        </section>

        {/* ── 2. Growth & Retention ── */}
        <section id="kpi-section-growth" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading
            title="Growth & Retention"
            icon={<BarChart3 className="h-3.5 w-3.5 text-blue-500" />}
            description="Acquisition, activation milestones, and cohort retention"
          />
          <KPIGrowthRetention loading={loading} data={kpiData} />
        </section>

        {/* ── 3. Engagement ── */}
        <section id="kpi-section-engagement" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading
            title="Engagement"
            icon={<BarChart3 className="h-3.5 w-3.5 text-violet-500" />}
            description="Depth of participation, content quality, and stickiness"
          />
          <KPIEngagement loading={loading} data={kpiData} />
        </section>

        {/* ── 4. Community Health ── */}
        <section id="kpi-section-health" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading
            title="Community Health"
            icon={<BarChart3 className="h-3.5 w-3.5 text-emerald-500" />}
            description="Overall community wellbeing, satisfaction, and churn signals"
          />
          <KPICommunityHealth loading={loading} data={kpiData} />
        </section>

        {/* ── 5. Advocacy & Gamification ── */}
        <section id="kpi-section-advocacy" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading
            title="Advocacy & Gamification"
            icon={<BarChart3 className="h-3.5 w-3.5 text-pink-500" />}
            description="Superfans, gamification rewards, and advocacy scoring"
          />
          <KPIAdvocacyGamification loading={loading} data={kpiData} />
        </section>

        {/* ── 6. Monetisation ── */}
        <section id="kpi-section-monetisation" className="space-y-3 scroll-mt-24">
          <DashboardSectionHeading
            title="Monetisation"
            icon={<BarChart3 className="h-3.5 w-3.5 text-rose-500" />}
            description="Connecting community engagement to economic value"
          />
          <KPIMonetisation loading={loading} data={kpiData} />
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(MembersPage, "NETWORK", "canRead");
