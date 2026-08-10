import React from "react";
import { Target, Heart, Star, Users, Zap, Trophy } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

const acquisitionRet = [
  {
    title: "Member Activation",
    key: "memberActivationRate",
    icon: Target,
    suffix: "%",
    tooltip: "((New Members who posted) / New Members) × 100",
  },
  {
    title: "Advocacy Index",
    key: "communityAdvocacyIndex",
    icon: Heart,
    tooltip: "(New Members / DAU) × 10",
  },
  {
    title: "Superfan Count",
    key: "superfanRatio",
    icon: Star,
    suffix: "%",
    tooltip: "((DAU × 0.12) / Total Members) × 100",
    href: "/members",
  },
  {
    title: "Referrals Joined",
    key: "referralsJoined",
    icon: Users,
    tooltip: "Members who joined via a referral link",
    href: "/members/referrals",
  },
  {
    title: "Gamification Points",
    key: "gamificationPointsEarned",
    icon: Zap,
    tooltip: "Total gamification points earned by members",
    href: "/gamification/points-and-badges/points",
  },
  {
    title: "Badges Earned",
    key: "badgesEarned",
    icon: Trophy,
    tooltip: "Total badges earned by members",
  },
  {
    title: "Leaderboard Players",
    key: "leaderboardParticipants",
    icon: Trophy,
    tooltip: "Total participants actively competing on the leaderboard",
    href: "/gamification/points-and-badges/leaderboard",
  },
  {
    title: "Coins",
    key: "totalCurrencyPayouts",
    icon: Zap,
    tooltip: "Total currency payouts distributed to members",
    href: "/gamification/currency",
  },
];

interface DashboardAcquisitionProps {
  loading: boolean;
  getMetric: (key: string) => any;
  DashboardSectionHeading: React.FC<{
    title: string;
    action?: React.ReactNode;
    tooltip?: string;
  }>;
}

export function DashboardAcquisition({
  loading,
  getMetric,
  DashboardSectionHeading,
}: DashboardAcquisitionProps) {
  return (
    <section className="space-y-3 mt-20">
      <DashboardSectionHeading title="COMMUNITY GROWTH MATRIX" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {acquisitionRet.map((v) => {
          const item = getMetric(v.key);
          return (
            <EcosystemKPI
              key={v.key}
              title={v.title}
              value={loading ? "..." : (item?.value ?? "0")}
              trend={item?.change ?? 0}
              trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
              icon={v.icon}
              suffix={(v as any).suffix}
              tooltip={(v as any).tooltip}
              href={(v as any).href}
            />
          );
        })}
      </div>
    </section>
  );
}
