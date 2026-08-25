"use client";

import React from "react";
import {
  UserPlus,
  TrendingUp,
  Target,
  TrendingDown,
  Heart,
  Users,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const growthRetentionKPIs = [
  {
    title: "New Members (30d)",
    key: "newMembers",
    icon: UserPlus,
    color: "bg-cyan-500",
    tooltip: "COUNT(members WHERE created_at ≥ today − 30d)",
  },
  {
    title: "Member Growth Rate",
    key: "memberGrowthRate",
    icon: TrendingUp,
    color: "bg-indigo-500",
    suffix: "%",
    tooltip: "((Members_end − Members_start) ÷ Members_start) × 100",
  },
  {
    title: "Activation Rate",
    key: "memberActivationRate",
    icon: Target,
    color: "bg-emerald-500",
    suffix: "%",
    tooltip:
      "(New members reaching activation milestone within 7d ÷ Total new members) × 100",
  },
  {
    title: "Churn Rate",
    key: "churnRate",
    icon: TrendingDown,
    color: "bg-rose-500",
    suffix: "%",
    tooltip: "(Members lost ÷ Members at period start) × 100",
  },
  {
    title: "Retention Rate (90d)",
    key: "retentionRate",
    icon: Heart,
    color: "bg-indigo-500",
    suffix: "%",
    tooltip: "(90d cohort still active ÷ Original cohort size) × 100",
  },
  {
    title: "Referrals Joined",
    key: "referralsJoined",
    icon: Users,
    color: "bg-amber-500",
    tooltip: "COUNT(members WHERE signup_source = 'referral')",
    href: "/members/referrals",
  },
  {
    title: "Onboarding Rate",
    key: "onboardingCompletionRate",
    icon: CheckCircle,
    color: "bg-blue-500",
    suffix: "%",
    tooltip: "Percentage of new members who completed onboarding",
  },
  {
    title: "Re-engagement",
    key: "reEngagementRecoveryRate",
    icon: RefreshCw,
    color: "bg-violet-500",
    suffix: "%",
    tooltip: "Dormant members who became active again",
  },
];

interface KPIGrowthRetentionProps {
  loading: boolean;
  getMetric: (key: string) => StatValue;
}

export function KPIGrowthRetention({
  loading,
  getMetric,
}: KPIGrowthRetentionProps) {
  return (
    <section id="kpi-section-growth" className="space-y-3 mt-20 scroll-mt-24">
      <DashboardSectionHeading title="GROWTH & RETENTION" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {growthRetentionKPIs.map((v) => {
          const item = getMetric(v.key);
          return (
            <EcosystemKPI
              key={v.key}
              title={v.title}
              value={loading ? "..." : (item?.value ?? "0")}
              trend={item?.change ?? 0}
              trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
              icon={v.icon}
              color={v.color}
              suffix={(v as any).suffix}
              tooltip={v.tooltip}
              href={(v as any).href}
            />
          );
        })}
      </div>
    </section>
  );
}
