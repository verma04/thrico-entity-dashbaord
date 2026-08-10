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
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const kpis = [
  {
    title: "New Members (30d)",
    key: "newMembers" as const,
    icon: UserPlus,
    tooltip: "COUNT(members WHERE created_at ≥ today − 30d)",
    colorScheme: "sky" as const,
  },
  {
    title: "Member Growth Rate",
    key: "memberGrowthRate" as const,
    icon: TrendingUp,
    suffix: "%",
    tooltip: "((Members_end − Members_start) ÷ Members_start) × 100",
    colorScheme: "indigo" as const,
  },
  {
    title: "Activation Rate",
    key: "memberActivationRate" as const,
    icon: Target,
    suffix: "%",
    tooltip: "(New members reaching activation milestone within 7d ÷ Total new members) × 100",
    colorScheme: "lime" as const,
  },
  {
    title: "Churn Rate",
    key: "churnRate" as const,
    icon: TrendingDown,
    suffix: "%",
    tooltip: "(Members lost ÷ Members at period start) × 100",
    colorScheme: "rose" as const,
  },
  {
    title: "Retention Rate (90d)",
    key: "retentionRate" as const,
    icon: Heart,
    suffix: "%",
    tooltip: "(90d cohort still active ÷ Original cohort size) × 100",
    colorScheme: "purple" as const,
  },
  {
    title: "Referrals Joined",
    key: "referralsJoined" as const,
    icon: Users,
    tooltip: "COUNT(members WHERE signup_source = 'referral')",
    colorScheme: "orange" as const,
    href: "/members/referrals",
  },
  {
    title: "Onboarding Rate",
    key: "onboardingCompletionRate" as const,
    icon: CheckCircle,
    suffix: "%",
    tooltip: "Percentage of new members who completed onboarding",
    colorScheme: "sky" as const,
  },
  {
    title: "Re-engagement Rate",
    key: "reEngagementRecoveryRate" as const,
    icon: RefreshCw,
    suffix: "%",
    tooltip: "Dormant members who became active again",
    colorScheme: "indigo" as const,
  },
];

interface KPIGrowthRetentionProps {
  loading: boolean;
  data: Record<string, StatValue | undefined>;
}

export function KPIGrowthRetention({ loading, data }: KPIGrowthRetentionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const metric = data[kpi.key];
        return (
          <EcosystemKPI
            key={kpi.key}
            title={kpi.title}
            value={loading ? "..." : (metric?.value ?? "0")}
            trend={metric?.change ?? 0}
            trendData={metric?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
            icon={kpi.icon}
            colorScheme={kpi.colorScheme}
            suffix={(kpi as any).suffix}
            tooltip={kpi.tooltip}
            href={(kpi as any).href}
          />
        );
      })}
    </div>
  );
}
