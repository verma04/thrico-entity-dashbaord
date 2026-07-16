import React from "react";
import { PointRule, GamificationStats } from "@/graphql/actions";
import { Users, Zap, Award, CheckCircle2 } from "lucide-react";

interface StatsCardsProps {
  pointRules: PointRule[];
  stats?: GamificationStats;
}

const statItems = (pointRules: PointRule[], stats?: GamificationStats) => [
  {
    label: "Total Users",
    value: stats?.totalUsers?.toLocaleString() ?? "0",
    icon: Users,
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Points Awarded",
    value: stats?.totalPointsAwarded?.toLocaleString() ?? "0",
    icon: Zap,
    accent: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Badges Earned",
    value: stats?.totalBadgesEarned?.toLocaleString() ?? "0",
    icon: Award,
    accent: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Active Rules",
    value: (
      stats?.activePointRules ?? pointRules.filter((r) => r.isActive).length
    ).toLocaleString(),
    icon: CheckCircle2,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export function StatsCards({ pointRules, stats }: StatsCardsProps) {
  const items = statItems(pointRules, stats);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
        >
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
            <item.icon className={`h-4 w-4 ${item.accent}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className="text-xl font-bold text-foreground tracking-tight">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
