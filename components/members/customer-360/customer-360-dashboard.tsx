"use client";

import React, { useState, useMemo } from "react";
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
} from "@/components/layout/ecosystem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import {
  useAnalytics360,
  TimeRange,
} from "@/graphql/analytics/analytics360";
import { Customer360OverviewTab } from "./customer-360-overview-tab";
import { Customer360SessionsTab } from "./customer-360-sessions-tab";
import { Customer360CohortsTab } from "./customer-360-cohorts-tab";
import { Customer360ChurnTab } from "./customer-360-churn-tab";
import { Customer360FunnelsTab } from "./customer-360-funnels-tab";
import { Customer360LiveFeedTab } from "./customer-360-live-feed-tab";
import { Customer360TimelineModal } from "./customer-360-timeline-modal";
import {
  Radar,
  Activity,
  BarChart3,
  Users,
  Grid3X3,
  AlertTriangle,
  Filter,
  Radio,
  RotateCcw,
  Sparkles,
  Calendar,
} from "lucide-react";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": "LAST_24_HOURS",
  "7d": "LAST_7_DAYS",
  "30d": "LAST_30_DAYS",
  "90d": "LAST_90_DAYS",
};

export function Customer360Dashboard() {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(30);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format custom date picker range
  const formattedDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const selectedTimeRange: TimeRange =
    timeRangeMap[timeRange] || "LAST_30_DAYS";

  // Unified single-call query for the full page
  const { data, loading, error, refetch } = useAnalytics360({
    timeRange: formattedDateRange ? undefined : selectedTimeRange,
    dateRange: formattedDateRange,
  });

  const analytics = data?.getAnalytics360;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInspectMember = (userId: string) => {
    setSelectedUserId(userId);
    setIsTimelineOpen(true);
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Customer 360 Analytics"
        description="Unified intelligence hub across member activity, retention, churn risk & digital sessions"
        icon={Radar}
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            {/* Live active users pill */}
            {analytics?.sessions?.activeUsersNow !== undefined && (
              <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  <strong>{analytics.sessions.activeUsersNow}</strong> active now
                </span>
              </div>
            )}

            {/* Date Range Picker */}
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_30_DAYS"
            />

            <div className="h-4 w-px bg-border mx-1" />

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-primary rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
            >
              <RotateCcw
                className={`w-3.5 h-3.5 ${
                  loading || isRefreshing ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="border-b border-border/80 pb-px">
            <TabsList className="bg-transparent h-auto p-0 flex gap-6 overflow-x-auto no-scrollbar justify-start">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-xs font-medium flex items-center gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Overview & KPIs
              </TabsTrigger>

              <TabsTrigger
                value="sessions"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-xs font-medium flex items-center gap-2"
              >
                <Activity className="w-3.5 h-3.5" />
                Sessions & Traffic
              </TabsTrigger>

              <TabsTrigger
                value="cohorts"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-xs font-medium flex items-center gap-2"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                Cohort Retention
              </TabsTrigger>

              <TabsTrigger
                value="churn"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-xs font-medium flex items-center gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Churn Risk & Interventions
                {analytics?.churnRiskMembers && analytics.churnRiskMembers.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] font-mono px-1.5 py-0 rounded-full"
                  >
                    {analytics.churnRiskMembers.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="funnels"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-xs font-medium flex items-center gap-2"
              >
                <Filter className="w-3.5 h-3.5" />
                Conversion Funnels
              </TabsTrigger>

              <TabsTrigger
                value="live"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-xs font-medium flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                Live Feed
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="outline-none space-y-6">
            <Customer360OverviewTab
              stats={analytics?.dashboard}
              topEventTypes={analytics?.topEventTypes}
              loading={loading}
            />
          </TabsContent>

          {/* Tab 2: Sessions */}
          <TabsContent value="sessions" className="outline-none space-y-6">
            <Customer360SessionsTab
              sessions={analytics?.sessions}
              loading={loading}
            />
          </TabsContent>

          {/* Tab 3: Cohort Retention */}
          <TabsContent value="cohorts" className="outline-none space-y-6">
            <Customer360CohortsTab
              initialCohortData={analytics?.cohortRetention}
            />
          </TabsContent>

          {/* Tab 4: Churn Risk */}
          <TabsContent value="churn" className="outline-none space-y-6">
            <Customer360ChurnTab
              initialMembers={analytics?.churnRiskMembers}
              onInspectMember={handleInspectMember}
            />
          </TabsContent>

          {/* Tab 5: Conversion Funnels */}
          <TabsContent value="funnels" className="outline-none space-y-6">
            <Customer360FunnelsTab
              initialFunnel={analytics?.conversionFunnel}
            />
          </TabsContent>

          {/* Tab 6: Live Activity Feed */}
          <TabsContent value="live" className="outline-none space-y-6">
            <Customer360LiveFeedTab
              onInspectMember={handleInspectMember}
            />
          </TabsContent>
        </Tabs>
      </EcosystemContainer>

      {/* Member Activity Timeline Drill-down Modal */}
      <Customer360TimelineModal
        userId={selectedUserId}
        isOpen={isTimelineOpen}
        onClose={() => {
          setIsTimelineOpen(false);
          setSelectedUserId(null);
        }}
      />
    </EcosystemWrapper>
  );
}
