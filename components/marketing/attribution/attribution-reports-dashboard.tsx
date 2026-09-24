"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ADMIN_GET_ATTRIBUTION_OVERVIEW_REPORT } from "@/graphql/actions/utm/admin-utm.graphql";
import {
  AttributionModel,
  AttributionOverviewReport,
  AttributionSummaryKPIs,
  TimeRange,
  DateRangeInput,
} from "@/types/utm";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import {
  BarChart3,
  TrendingUp,
  Target,
  ArrowRight,
  Share2,
  Search,
  Layers,
  Sparkles,
  RotateCcw,
  Flame,
  CheckCircle2,
  Compass,
  Globe,
  Mail,
  PieChart,
  Users,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_SUMMARY: AttributionSummaryKPIs = {
  totalAttributedVisitors: 0,
  totalSignups: 0,
  totalLogins: 0,
  totalConversions: 0,
  overallConversionRate: 0,
};

interface AttributionReportsDashboardProps {
  defaultModel?: AttributionModel;
}

export function AttributionReportsDashboard({
  defaultModel = "FIRST_TOUCH",
}: AttributionReportsDashboardProps) {
  const [model, setModel] = useState<AttributionModel>(defaultModel);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(30);

  // Sync with defaultModel prop if route changes
  React.useEffect(() => {
    setModel(defaultModel);
  }, [defaultModel]);

  // Map timeRange and dateRange safely to GraphQL Enum and DateRangeInput
  const graphqlTimeRange: TimeRange | undefined = useMemo(() => {
    if (timeRange === "24h" || timeRange === "1d") return "LAST_24_HOURS";
    if (timeRange === "7d") return "LAST_7_DAYS";
    if (timeRange === "30d") return "LAST_30_DAYS";
    if (timeRange === "90d") return "LAST_90_DAYS";
    return "LAST_30_DAYS";
  }, [timeRange]);

  const graphqlDateRange: DateRangeInput | undefined = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return {
        startDate: new Date(dateRange.from).toISOString(),
        endDate: new Date(dateRange.to).toISOString(),
      };
    }
    return undefined;
  }, [dateRange]);

  // Query live report from GraphQL
  const { data, loading, refetch } = useQuery(
    ADMIN_GET_ATTRIBUTION_OVERVIEW_REPORT,
    {
      variables: {
        model,
        timeRange: graphqlTimeRange,
        dateRange: graphqlDateRange,
        campaign: selectedCampaign || undefined,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const report: AttributionOverviewReport | null =
    data?.getAttributionOverviewReport || null;

  const summary = report?.summary || EMPTY_SUMMARY;
  const channelPerformance = report?.channelPerformance || [];
  const campaignPerformance = report?.campaignPerformance || [];
  const topJourneys = report?.topJourneys || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={
          model === "FIRST_TOUCH"
            ? "First-Touch Attribution"
            : model === "LAST_TOUCH"
            ? "Last-Touch Attribution"
            : "Multi-Touch Linear Attribution"
        }
        description={
          model === "FIRST_TOUCH"
            ? "Credits 100% of conversion value to the initial marketing touchpoint that first brought the visitor to Thrico."
            : model === "LAST_TOUCH"
            ? "Credits 100% of conversion value to the final marketing campaign or channel immediately preceding conversion."
            : "Evenly distributes conversion credit across every touchpoint experienced throughout the member journey."
        }
        icon={model === "FIRST_TOUCH" ? Compass : Flag}
        badgeText="Attribution 360"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing" },
          { label: "Attribution Reports", href: "/marketing/attribution" },
          {
            label:
              model === "FIRST_TOUCH"
                ? "First-Touch"
                : model === "LAST_TOUCH"
                ? "Last-Touch"
                : "Linear",
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_30_DAYS"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        }
      />

      <EcosystemContainer>
        {/* Model Switcher Segmented Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-1.5 bg-muted/40 rounded-xl border border-border/40 backdrop-blur-sm">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setModel("FIRST_TOUCH")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                model === "FIRST_TOUCH"
                  ? "bg-background text-foreground shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Compass className="h-3.5 w-3.5 text-blue-500" />
              First-Touch Model
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-mono">
                Discovery
              </span>
            </button>

            <button
              onClick={() => setModel("LAST_TOUCH")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                model === "LAST_TOUCH"
                  ? "bg-background text-foreground shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Flag className="h-3.5 w-3.5 text-purple-500" />
              Last-Touch Model
              <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full font-mono">
                Closing CTA
              </span>
            </button>

            <button
              onClick={() => setModel("LINEAR")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                model === "LINEAR"
                  ? "bg-background text-foreground shadow-sm border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Layers className="h-3.5 w-3.5 text-emerald-500" />
              Linear Multi-Touch
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-mono">
                Full Journey
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ClickHouse Attribution Engine</span>
          </div>
        </div>

        {/* High-Level Scorecards with Loaders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Total Attributed */}
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col justify-between hover:border-border transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Attributed Visitors</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-24 rounded-md" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {summary.totalAttributedVisitors.toLocaleString()}
                </div>
              )}
              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span>Across tracked UTM campaigns</span>
              </div>
            </div>
          </div>

          {/* Signups */}
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col justify-between hover:border-border transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Campaign Signups</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {summary.totalSignups.toLocaleString()}
                </div>
              )}
              <div className="text-[11px] text-muted-foreground mt-0.5">
                New accounts created
              </div>
            </div>
          </div>

          {/* Conversions */}
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col justify-between hover:border-border transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Key Conversions</span>
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-20 rounded-md" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {summary.totalConversions.toLocaleString()}
                </div>
              )}
              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="font-semibold text-foreground">
                  {summary.overallConversionRate}%
                </span>{" "}
                conversion rate
              </div>
            </div>
          </div>

          {/* Top Driver */}
          <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col justify-between hover:border-border transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Top Attributed Source</span>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-6 w-28 rounded-md" />
              ) : (
                <div className="text-sm font-bold tracking-tight text-foreground truncate">
                  {summary.topCampaign || "No campaign yet"}
                </div>
              )}
              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                {loading ? (
                  <Skeleton className="h-4 w-20 rounded-md" />
                ) : (
                  <>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono">
                      {summary.topSource || "—"}
                    </Badge>
                    <span className="text-muted-foreground/60">/</span>
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-mono">
                      {summary.topMedium || "—"}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Journey Multi-Touch Paths */}
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Top Converting Attribution Journey Paths
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Multi-touch step sequences leading to registration or checkout
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {loading ? "Analyzing..." : `${topJourneys.length} Paths`}
            </span>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))
            ) : topJourneys.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No multi-touch journey paths recorded in the selected period.
              </div>
            ) : (
              topJourneys.map((journey, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/40 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-muted-foreground/70 w-5">
                      #{idx + 1}
                    </span>
                    {journey.path.map((step, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border/70 text-foreground shadow-2xs">
                          {step}
                        </span>
                        {sIdx < journey.path.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-foreground">
                        {journey.conversions} conversions
                      </span>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {journey.percentage}% of total
                      </div>
                    </div>
                    <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${journey.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Channel Performance Breakdown */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                Channel Performance Matrix ({model.replace("_", " ")})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Conversion contribution and traffic efficiency classified by acquisition channel
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold text-foreground">Channel Group</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Attributed Visits</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Traffic Share</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Signups</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Conv. Rate</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Share of Conversions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="py-3">
                        <Skeleton className="h-5 w-full rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : channelPerformance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                      No channel attribution data available for this timeframe.
                    </TableCell>
                  </TableRow>
                ) : (
                  channelPerformance.map((ch, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-xs text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
                            {ch.channel.includes("Search") ? (
                              <Search className="h-3.5 w-3.5 text-blue-500" />
                            ) : ch.channel.includes("Email") ? (
                              <Mail className="h-3.5 w-3.5 text-amber-500" />
                            ) : ch.channel.includes("Social") ? (
                              <Share2 className="h-3.5 w-3.5 text-purple-500" />
                            ) : (
                              <Globe className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </div>
                          <span>{ch.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-medium">
                        {ch.visits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-muted-foreground">
                        {ch.shareOfTraffic}%
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-foreground font-semibold">
                        {ch.signups.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-foreground font-bold">
                        {ch.conversions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md font-semibold text-[11px]",
                            ch.conversionRate >= 15
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : ch.conversionRate >= 12
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {ch.conversionRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        <div className="flex items-center justify-end gap-2">
                          <span>{ch.shareOfConversions}%</span>
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${ch.shareOfConversions}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Campaign Breakdown Table */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                UTM Campaign Attribution Analysis
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Performance comparison across configured campaign parameters
              </p>
            </div>
            {selectedCampaign && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCampaign(null)}
                className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear filter ({selectedCampaign})
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold text-foreground">Campaign Name</TableHead>
                  <TableHead className="text-xs font-semibold">Source / Medium</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Attributed Visits</TableHead>
                  <TableHead className="text-xs font-semibold text-right">First-Touch Visits</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Last-Touch Visits</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Signups</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Conv. Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={8} className="py-3">
                        <Skeleton className="h-5 w-full rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : campaignPerformance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">
                      No campaign attribution events recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  campaignPerformance.map((c, idx) => (
                    <TableRow
                      key={idx}
                      onClick={() =>
                        setSelectedCampaign(
                          selectedCampaign === c.campaign ? null : c.campaign
                        )
                      }
                      className={cn(
                        "cursor-pointer hover:bg-muted/20 transition-colors",
                        selectedCampaign === c.campaign && "bg-primary/5"
                      )}
                    >
                      <TableCell className="font-semibold text-xs text-foreground font-mono">
                        {c.campaign}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono">
                            {c.source}
                          </Badge>
                          <span className="text-muted-foreground/60">/</span>
                          <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-mono">
                            {c.medium}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-medium">
                        {c.visits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-blue-600 dark:text-blue-400">
                        {c.firstTouchCount?.toLocaleString() || c.visits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-purple-600 dark:text-purple-400">
                        {c.lastTouchCount?.toLocaleString() || c.visits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-foreground">
                        {c.signups.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-bold text-foreground">
                        {c.conversions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {c.conversionRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
