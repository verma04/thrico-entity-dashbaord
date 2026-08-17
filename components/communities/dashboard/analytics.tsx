"use client";

import React, { useState, useMemo } from "react";
import { RotateCcw, Users2 } from "lucide-react";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { useGetCommunitiesStats, TimeRange } from "@/graphql/actions/communities";
import { useModuleStore } from "@/store/useModuleStore";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { AccessDeniedAlert } from "@/components/shared/access-denied-alert";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

import { CommunitiesKPIOverview } from "./communities-kpi-overview";
import { TopCommunitiesCard } from "./top-communities-card";
import { TopCreatorsCard } from "./top-creators-card";
import { CommunityStatusDistribution } from "./community-status-distribution";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function CommunitiesAnalytics() {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formattedDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const { data, loading: loadingStats, refetch, error } = useGetCommunitiesStats(
    timeRangeMap[timeRange] || TimeRange.LAST_7_DAYS,
    formattedDateRange,
  );
  const stats = data?.getCommunitiesStats;
  const loading = loadingStats || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <EcosystemWrapper data-testid="communities-analytics">
        <EcosystemHeader
          title={`${moduleName || "Communities"} Insights`}
          description={`${moduleName || "Communities"} overview and insights`}
          badgeText="Overview"
          icon={Users2}
          actions={
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
                onClick={handleRefresh}
                disabled={loading}
              >
                <RotateCcw
                  size={14}
                  className={cn(loading && "animate-spin")}
                />
              </Button>
            </div>
          }
        />

        <EcosystemContainer className="">
          <div className="max-w-3xl space-y-4">
            <DashboardSectionHeading
              title="Access Restricted"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="rounded-[20px] border border-transparent bg-muted/30 p-5">
              <div className="p-2">
                <AccessDeniedAlert
                  message={
                    error.message ||
                    `You do not have permission to view ${singularName.toLowerCase()} analytics.`
                  }
                />
              </div>
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  const topCommunities = stats?.topCommunities ?? [];
  const topCreators = stats?.topCreators ?? [];
  const statusDistribution = stats?.statusDistribution ?? [];

  return (
    <EcosystemWrapper data-testid="communities-analytics">
      <EcosystemHeader
        title={`${moduleName || "Communities"} Insights`}
        description={`${moduleName || "Communities"} overview and insights`}
        badgeText="Overview"
        icon={Users2}
        actions={
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
              onClick={handleRefresh}
              disabled={loading}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <CommunitiesKPIOverview loading={loading} stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <TopCommunitiesCard
              loading={loading}
              moduleName={moduleName}
              topCommunities={topCommunities}
            />

            <TopCreatorsCard
              loading={loading}
              moduleName={moduleName}
              topCreators={topCreators}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <CommunityStatusDistribution
              loading={loading}
              singularName={singularName}
              statusDistribution={statusDistribution}
            />
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
