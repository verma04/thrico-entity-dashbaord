"use client";

import React from "react";
import { Activity, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { SubscriptionLimitBanner } from "@/components/members/manage/subscription-alerts";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import {
  useGetMemberKPIDashboard,
  TimeRange,
  type StatValue,
} from "@/graphql/actions/member-kpi-dashboard";
import {
  KPINorthStar,
  KPIPipelineNav,
  KPIMembershipHealth,
  KPIGrowthRetention,
  KPIEngagement,
  KPICommunityHealth,
  KPIAdvocacyGamification,
  KPIMonetisation,
} from "@/components/members/kpi-dashboard";

// ---------------------------------------------------------------------------
// KPI Helpers
// ---------------------------------------------------------------------------
const isDashboardMetricValue = (value: unknown): value is StatValue =>
  typeof value === "object" &&
  value !== null &&
  ("value" in value || "change" in value || "trend" in value);

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
function MembersPage() {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("membership");

  const formattedDateRange = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const {
    data: kpiData,
    loading: loadingKpis,
    refetch: refetchKpis,
  } = useGetMemberKPIDashboard(timeRangeMap[timeRange], formattedDateRange);

  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  const loading = loadingKpis;
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchKpis();
    } finally {
      setIsRefreshing(false);
    }
  };

  const kpis = kpiData?.getCommunityKPIs;

  const getMetric = (key: string): StatValue => {
    if (!kpis || !(key in kpis)) {
      return { value: 0 };
    }
    const metric = kpis[key as keyof typeof kpis];
    return isDashboardMetricValue(metric) ? metric : { value: 0 };
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`kpi-section-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Community KPI Dashboard"
        description="Full-spectrum community health metrics"
        icon={Activity}
        actions={
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
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn((loading || isRefreshing) && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {/* Subscription Limit Warning Banner */}
        <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />

        {/* North Star: Engaged Members */}
        <KPINorthStar loading={loading} metric={getMetric("activeUsers")} />

        {/* Pipeline Navigation */}
        <KPIPipelineNav
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />

        {/* 1. Membership Health (Acquire) */}
        <KPIMembershipHealth loading={loading} getMetric={getMetric} />

        {/* 2. Growth & Retention (Activate) */}
        <KPIGrowthRetention loading={loading} getMetric={getMetric} />

        {/* 3. Engagement (Engage) */}
        <KPIEngagement loading={loading} getMetric={getMetric} />

        {/* 4. Community Health (Retain) */}
        <KPICommunityHealth loading={loading} getMetric={getMetric} />

        {/* 5. Advocacy & Gamification (Advocate) */}
        <KPIAdvocacyGamification loading={loading} getMetric={getMetric} />

        {/* 6. Monetisation (Monetize) */}
        <KPIMonetisation loading={loading} getMetric={getMetric} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(MembersPage, "MEMBERS_ALL", "canRead");
