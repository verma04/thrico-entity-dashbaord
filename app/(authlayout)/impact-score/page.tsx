"use client";

import React from "react";
import {
  Trophy,
  Activity,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetImpactTemplates } from "@/graphql/actions/impact";
import { TemplateForm } from "@/components/impact/template-form";

export default function ImpactScoreOverview() {
  const { data, loading } = useGetImpactTemplates();

  const templates = data?.impactTemplates || [];
  const activeTemplate = templates.find((t: any) => t.isActive);

  const kpis = [
    {
      title: "Avg Community Score",
      value: loading ? "—" : "620", // Placeholder for actual calculation
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Templates",
      value: loading
        ? "—"
        : templates.filter((t: any) => t.isActive).length.toString(),
      icon: Layers,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Platinum Members",
      value: loading ? "—" : "12", // Placeholder
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Total Events",
      value: loading ? "—" : "1.2k", // Placeholder
      icon: Activity,
      color: "text-zinc-900",
      bg: "bg-zinc-100",
    },
  ];

  const modules = [
    {
      title: "Impact Templates",
      desc: "Configure scoring thresholds, decay rates, and category weights.",
      count: templates.length,
      icon: Layers,
      link: "/impact-score/templates",
    },
    {
      title: "Scoring Rules",
      desc: "Set points and daily limits for actions across all modules.",
      count: "12", // Would normally come from a rules query
      icon: Activity,
      link: "/impact-score/rules",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="impact-score-analytics">
      <EcosystemHeader
        title="Impact Score Engine"
        description="A dynamic trust and contribution score to measure user reputation."
        badgeText="Overview"
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5 px-1">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                activeTemplate
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-zinc-300",
              )}
            />
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              {activeTemplate ? "Engine Active" : "Engine Inactive"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/impact-score/templates">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-semibold text-xs text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <Settings className="h-4 w-4 text-indigo-500" />
                Configure
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {!activeTemplate && !loading ? (
          <div className="max-w-3xl mx-auto">
            <EcosystemCard
              title="Create Template"
              description="Set up the foundational rules for impact scoring."
              icon={Layers}
            >
              <div className="mt-6">
                <TemplateForm />
              </div>
            </EcosystemCard>
          </div>
        ) : (
          <>
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Real-time" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Modules Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((mod, i) => (
                <Link key={i} href={mod.link}>
                  <div className="p-6 rounded-xl bg-white border border-zinc-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group relative overflow-hidden h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="h-12 w-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                          <mod.icon size={22} />
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-zinc-900 tracking-tight">
                            {mod.count}
                          </span>
                          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                            Items
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-[15px] font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                          {mod.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-50">
                      <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-amber-600 transition-colors">
                        Manage
                      </span>
                      <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar / Settings */}
          <div className="lg:col-span-4 space-y-6">
            <EcosystemCard
              title="Active Template Details"
              description="Current configuration for the community"
              icon={ShieldCheck}
            >
              {activeTemplate ? (
                <div className="space-y-1.5 mt-4 overflow-hidden rounded-xl border border-zinc-100">
                  {[
                    {
                      label: "Score Range",
                      value: `${activeTemplate.minScore} - ${activeTemplate.maxScore}`,
                      color: "text-zinc-900 bg-zinc-50/50",
                    },
                    {
                      label: "Decay Engine",
                      value: activeTemplate.decayEnabled
                        ? "Enabled"
                        : "Disabled",
                      color: activeTemplate.decayEnabled
                        ? "text-rose-600 bg-rose-50/50"
                        : "text-zinc-500 bg-zinc-50/50",
                    },
                    {
                      label: "Refresh Frequency",
                      value: activeTemplate.refreshFrequency,
                      color: "text-indigo-600 bg-indigo-50/50",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 bg-white border-b last:border-0 border-zinc-50"
                    >
                      <span className="text-[11px] font-semibold text-zinc-500">
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
                  <p className="text-sm text-zinc-500">
                    No active template found.
                  </p>
                  <Link
                    href="/impact-score/templates"
                    className="text-xs text-indigo-600 font-medium hover:underline mt-2 inline-block"
                  >
                    Create Template &rarr;
                  </Link>
                </div>
              )}
            </EcosystemCard>
          </div>
        </div>
        </>
      )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
