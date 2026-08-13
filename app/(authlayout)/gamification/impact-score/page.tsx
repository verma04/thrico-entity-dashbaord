"use client";

import React, { useMemo } from "react";
import {
  Trophy,
  Activity,
  Layers,
  Settings,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { CtaButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";
import {
  useGetImpactTemplates,
  useGetImpactUsers,
  useGetImpactRules,
  useGetImpactActivityLog,
} from "@/graphql/actions/impact";
import { TemplateForm } from "@/components/impact/template-form";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";

export default function ImpactScoreOverview() {
  const { dateRange, handleDateChange } = useUrlDateRange(7);
  const { data, loading: templateLoading } = useGetImpactTemplates();
  const { data: usersData, loading: usersLoading } = useGetImpactUsers();
  const { data: rulesData, loading: rulesLoading } = useGetImpactRules();
  const { data: activityData, loading: activityLoading } =
    useGetImpactActivityLog();

  const templates = data?.impactTemplates || [];
  const activeTemplate = templates.find((t: any) => t.isActive);

  const users = usersData?.getImpactUsers?.nodes || [];

  const avgScore = useMemo(() => {
    if (users.length === 0) return 0;
    const sum = users.reduce(
      (acc: number, user: any) => acc + (user.score || 0),
      0,
    );
    return Math.round(sum / users.length);
  }, [users]);

  const maxScore = useMemo(() => {
    if (users.length === 0) return 0;
    return Math.max(...users.map((u: any) => u.score || 0));
  }, [users]);

  const maxScoreMembers = useMemo(() => {
    if (users.length === 0) return 0;
    return users.filter((u: any) => (u.score || 0) === maxScore).length;
  }, [users, maxScore]);

  const minScore = useMemo(() => {
    if (users.length === 0) return 0;
    return Math.min(...users.map((u: any) => u.score || 0));
  }, [users]);

  const minScoreMembers = useMemo(() => {
    if (users.length === 0) return 0;
    return users.filter((u: any) => (u.score || 0) === minScore).length;
  }, [users, minScore]);
  const totalRulesCount = rulesData?.impactRules?.length || 0;

  const isLoading =
    templateLoading || usersLoading || rulesLoading || activityLoading;

  const kpis = [
    {
      title: "Avg. Impact Score",
      value: isLoading ? "—" : avgScore.toString(),
      icon: TrendingUp,
      colorScheme: "lime" as const,
      tooltip: "Formula: Total Score of all users / Number of users",
    },
    {
      title: "Max Impact Score",
      value: isLoading ? (
        "—"
      ) : (
        <span className="flex items-baseline gap-1.5">
          {maxScore}
          <span className="text-[11px] text-muted-foreground font-semibold lowercase tracking-widest leading-none">
            / {maxScoreMembers} members
          </span>
        </span>
      ),
      icon: Trophy,
      colorScheme: "indigo" as const,
      tooltip: "Highest score achieved by members",
    },
    {
      title: "Min Impact Score",
      value: isLoading ? (
        "—"
      ) : (
        <span className="flex items-baseline gap-1.5">
          {minScore}
          <span className="text-[11px] text-muted-foreground font-semibold lowercase tracking-widest leading-none">
            / {minScoreMembers} members
          </span>
        </span>
      ),
      icon: Activity,
      colorScheme: "rose" as const,
      tooltip: "Lowest score achieved by members",
    },
  ];

  const modules = [
    {
      title: "Impact Templates",
      desc: "Configure scoring thresholds, decay rates, and category weights.",
      count: templates.length.toString(),
      icon: Layers,
      link: "/gamification/impact-score/settings",
    },
    {
      title: "Scoring Rules",
      desc: "Set points and daily limits for actions across all modules.",
      count: totalRulesCount.toString(),
      icon: Activity,
      link: "/impact-score/rules",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="impact-score-analytics">
      <EcosystemHeader
        title="Impact Score Engine"
        description="A realtime engagement activities based Impact Score Insights"
        badgeText="Overview"
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Impact Score" },
        ]}
        actions={
          <div className="flex items-center gap-4">
            <Link href="/gamification/impact-score/settings">
              <CtaButton
                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-semibold text-xs text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <Settings className="h-4 w-4 text-indigo-500" />
                Configure
              </CtaButton>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {!activeTemplate && !isLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <DashboardSectionHeading
              title="Create Template"
              titleClassName="normal-case tracking-normal text-sm text-foreground"
            />
            <div className="p-5 rounded-[20px] bg-muted/30 border border-transparent">
              <div className="mt-2">
                <TemplateForm />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Grid */}
            <section className="space-y-4">
              <DashboardSectionHeading
                title="Impact Score Overview"
                titleClassName="normal-case tracking-normal text-sm text-foreground"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                  <EcosystemKPI key={i} {...kpi} trendLabel="Real-time" />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Modules Grid */}
              <section className="lg:col-span-8 space-y-4">
                <DashboardSectionHeading
                  title="Impact Modules"
                  titleClassName="normal-case tracking-normal text-sm text-foreground"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modules.map((mod, i) => (
                    <Link key={i} href={mod.link}>
                      <div className="p-6 rounded-xl bg-white dark:bg-background border border-zinc-200 dark:border-neutral-800 hover:border-zinc-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-zinc-500/5 transition-all group relative overflow-hidden h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-5">
                            <div className="h-12 w-12 rounded-xl bg-zinc-50 dark:bg-neutral-900 border border-zinc-100 dark:border-neutral-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-neutral-800 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:border-zinc-200 dark:group-hover:border-neutral-700 transition-colors">
                              <mod.icon size={22} />
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                {mod.count}
                              </span>
                              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                                Items
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                              {mod.title}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                              {mod.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-50 dark:border-neutral-800">
                          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                            Manage
                          </span>
                          <ArrowRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Sidebar / Settings */}
              <section className="lg:col-span-4 space-y-4">
                <DashboardSectionHeading
                  title="Active Template Details"
                  titleClassName="normal-case tracking-normal text-sm text-foreground"
                />
                <div className="p-5 rounded-[20px] bg-muted/30 border border-transparent">
                  {activeTemplate ? (
                    <div className="space-y-1.5 mt-4 overflow-hidden rounded-xl border border-zinc-100 dark:border-neutral-800">
                      {[
                        {
                          label: "Score Range",
                          value: `${activeTemplate.minScore} - ${activeTemplate.maxScore}`,
                          color:
                            "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800",
                        },
                        {
                          label: "Decay Engine",
                          value: activeTemplate.decayEnabled
                            ? "Enabled"
                            : "Disabled",
                          color: activeTemplate.decayEnabled
                            ? "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800"
                            : "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
                        },
                        {
                          label: "Refresh Frequency",
                          value: activeTemplate.refreshFrequency,
                          color:
                            "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800",
                        },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900/50 border-b last:border-0 border-zinc-50 dark:border-neutral-800"
                        >
                          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                            {row.label}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider",
                              row.color,
                            )}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        No active template found.
                      </p>
                      <Link
                        href="/gamification/impact-score/settings"
                        className="text-xs text-zinc-900 dark:text-zinc-100 font-medium hover:underline mt-2 inline-block"
                      >
                        Create Template &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
