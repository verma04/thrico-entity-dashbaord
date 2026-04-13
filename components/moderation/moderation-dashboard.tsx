"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShieldCheck,
  AlertTriangle,
  Flag,
  Link2,
  Clock,
  Inbox,
  ChevronRight,
  Activity,
  Ban,
  ShieldAlert,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  useGetModerationStats,
  useGetContentReports,
  TimeRange,
  DateRangeInput
} from "@/graphql/moderation/hooks";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { AiModerationDashboardWidget } from "./ai-moderation-dashboard-widget";
import { ModerationSummaryWidget } from "./moderation-summary-widget";
import { HistorySection } from "./history-section";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";

const SectionCard = ({
  title,
  description,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon: any;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="rounded-lg border border-border bg-card overflow-hidden h-full flex flex-col shadow-sm">
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground uppercase tracking-tight">
            {title}
          </p>
          {description && (
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5 flex-1">{children}</div>
  </div>
);

export function ModerationDashboard() {
  const [timeRangeStr, setTimeRangeStr] = React.useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRangeStr(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRangeStr(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRangeStr(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRangeStr(TimeRange.LAST_90_DAYS);
  };

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data: statsData, loading: statsLoading } = useGetModerationStats(timeRangeStr, formattedDateRange);
  const { data: reportsData, loading: reportsLoading } = useGetContentReports({
    status: "PENDING",
    limit: 5,
  });


  const recentReports = reportsData?.getContentReports.items || [];

  return (
    <EcosystemWrapper anonymized-1="moderation-analytics">
      <EcosystemHeader
        title="Safety Dashboard"
        description="Monitor automated filtering velocity, pending review queues, and architectural safety protocols."
        badgeText="Moderation Hub"
        icon={ShieldCheck}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
              Automated Protection Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-border mx-1" />
            <Link href="/moderation/reported-content">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-border font-bold text-[10px] uppercase tracking-widest text-muted-foreground gap-2 hover:bg-muted transition-all shadow-sm"
              >
                <Flag className="h-3.5 w-3.5 text-indigo-500" />
                Review Queue
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* Overview Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModerationSummaryWidget 
            statsData={statsData} 
            loading={statsLoading} 
          />
          <AiModerationDashboardWidget 
            timeRange={timeRangeStr} 
            dateRange={formattedDateRange} 
          />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Pending Reports */}
          <div className="lg:col-span-8">
            <SectionCard
              title="Awaiting Review"
              description="High-priority manual intervention"
              icon={Clock}
              action={
                <Link href="/moderation/reported-content">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-indigo-600 gap-1.5"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              }
            >
              {reportsLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                  <div className="h-6 w-6 rounded-full border-2 border-muted border-t-foreground animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Syncing Queue...
                  </span>
                </div>
              ) : recentReports.length > 0 ? (
                <div className="divide-y divide-border -mx-5 -my-5">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8 border border-border shadow-sm rounded-lg">
                          <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground uppercase">
                            {report.reportedBy.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground capitalize">
                              {report.contentType.toLowerCase()}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] uppercase font-bold border-rose-100 text-rose-600 bg-rose-50 px-1.5 h-4 tracking-tighter"
                            >
                              {report.reason}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate max-w-xs md:max-w-md">
                            {report.contentPreview || "No preview available..."}
                          </p>
                        </div>
                      </div>
                      <Link href={`/moderation/reported-content?id=${report.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-300 hover:text-zinc-600 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      Queue Sanitized
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-2">
                      All content reports have been resolved.
                    </p>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Action Center / Quick Settings */}
          <div className="lg:col-span-4">
            <SectionCard
              title="System Hygiene"
              description="Hygiene protocols & filters"
              icon={Activity}
            >
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50/30 border border-emerald-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Zap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Auto-Mod Active
                      </p>
                      <p className="text-[9px] font-medium text-emerald-700/60 uppercase tracking-tighter">
                        Sanitizing interaction nodes
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1 mt-6">
                    Registry Tools
                  </p>
                  {[
                    {
                      label: "Banned Words",
                      icon: Ban,
                      href: "/moderation/banned-words",
                    },
                    {
                      label: "Blocked Links",
                      icon: Link2,
                      href: "/moderation/blocked-links",
                    },
                    {
                      label: "Safety Settings",
                      icon: ShieldAlert,
                      href: "/moderation/settings",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background hover:bg-muted hover:border-indigo-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded bg-muted border border-border text-muted-foreground flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Audit Trail Section */}
        <HistorySection />

      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
