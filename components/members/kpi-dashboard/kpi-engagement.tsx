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
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const kpis = [
  {
    title: "Total Posts",
    key: "totalPosts" as const,
    icon: FileText,
    tooltip: "Total feed entries, stories, and discussions",
    colorScheme: "indigo" as const,
  },
  {
    title: "Post Frequency",
    key: "contributionFrequency" as const,
    icon: Zap,
    suffix: "/wk",
    tooltip: "(Total Posts / Active Members / Days) × 7",
    colorScheme: "sky" as const,
  },
  {
    title: "Reply Rate",
    key: "interactionReciprocity" as const,
    icon: Reply,
    suffix: "%",
    tooltip: "Comment-to-Post ratio: (Total Comments ÷ Total Posts) × 100",
    colorScheme: "purple" as const,
  },
  {
    title: "Content Reach",
    key: "contentReach" as const,
    icon: Eye,
    tooltip: "Total impressions / views on community content",
    colorScheme: "lime" as const,
  },
  {
    title: "Virality Rate",
    key: "contentViralityRate" as const,
    icon: Flame,
    suffix: "%",
    tooltip: "Content that reached beyond the immediate audience",
    colorScheme: "orange" as const,
  },
  {
    title: "Content/Member",
    key: "contentToMemberRatio" as const,
    icon: BarChart3,
    tooltip: "Posts per active member",
    colorScheme: "rose" as const,
  },
  {
    title: "Event Participation",
    key: "eventParticipationRate" as const,
    icon: Calendar,
    suffix: "%",
    tooltip: "Event attendance rate",
    colorScheme: "sky" as const,
  },
  {
    title: "Feature Adoption",
    key: "featureAdoptionRate" as const,
    icon: Layers,
    suffix: "%",
    tooltip: "Usage of platform features",
    colorScheme: "indigo" as const,
  },
];

interface KPIEngagementProps {
  loading: boolean;
  data: Record<string, StatValue | undefined>;
}

export function KPIEngagement({ loading, data }: KPIEngagementProps) {
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
          />
        );
      })}
    </div>
  );
}
