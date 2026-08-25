"use client";

import React from "react";
import {
  FileText,
  Zap,
  Reply,
  Eye,
  Flame,
  BarChart3,
  Calendar,
  Layers,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const engagementKPIs = [
  {
    title: "Total Posts",
    key: "totalPosts",
    icon: FileText,
    color: "bg-indigo-500",
    tooltip: "Total feed entries, stories, and discussions",
  },
  {
    title: "Post Frequency",
    key: "contributionFrequency",
    icon: Zap,
    color: "bg-cyan-500",
    suffix: "/wk",
    tooltip: "(Total Posts / Active Members / Days) × 7",
  },
  {
    title: "Reply Rate",
    key: "interactionReciprocity",
    icon: Reply,
    color: "bg-violet-500",
    suffix: "%",
    tooltip: "Comment-to-Post ratio: (Total Comments ÷ Total Posts) × 100",
  },
  {
    title: "Content Reach",
    key: "contentReach",
    icon: Eye,
    color: "bg-emerald-500",
    tooltip: "Total impressions / views on community content",
  },
  {
    title: "Virality Rate",
    key: "contentViralityRate",
    icon: Flame,
    color: "bg-orange-500",
    suffix: "%",
    tooltip: "Content that reached beyond the immediate audience",
  },
  {
    title: "Content / Member",
    key: "contentToMemberRatio",
    icon: BarChart3,
    color: "bg-rose-500",
    tooltip: "Posts per active member",
  },
  {
    title: "Event Participation",
    key: "eventParticipationRate",
    icon: Calendar,
    color: "bg-blue-500",
    suffix: "%",
    tooltip: "Event attendance rate",
  },
  {
    title: "Feature Adoption",
    key: "featureAdoptionRate",
    icon: Layers,
    color: "bg-purple-500",
    suffix: "%",
    tooltip: "Usage of platform features",
  },
];

interface KPIEngagementProps {
  loading: boolean;
  getMetric: (key: string) => StatValue;
}

export function KPIEngagement({ loading, getMetric }: KPIEngagementProps) {
  return (
    <section
      id="kpi-section-engagement"
      className="space-y-3 mt-20 scroll-mt-24"
    >
      <DashboardSectionHeading title="ENGAGEMENT" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementKPIs.map((v) => {
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
            />
          );
        })}
      </div>
    </section>
  );
}
