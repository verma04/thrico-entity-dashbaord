import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Award,
  Calendar,
  ShoppingBag,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModulePerformanceCard } from "@/components/layout/ecosystem/module-performance-card";

const modulePerformanceList = [
  {
    title: "Members",
    icon: Users,
    color: "text-blue-600",
    href: "/members",
    stats: ["106 registered", "107 approved"],
  },
  {
    title: "Referrals",
    icon: Users,
    color: "text-cyan-600",
    href: "/referrals",
    stats: ["106 registered", "107 approved"],
  },
  {
    title: "Discussions",
    icon: MessageSquare,
    color: "text-indigo-600",
    href: "/content/discussions",
    stats: ["230 topics", "1.2k comments"],
  },
  {
    title: "Polls",
    icon: MessageSquare,
    color: "text-cyan-600",
    href: "/content/polls",
    stats: ["45 active", "3.2k votes"],
  },
  {
    title: "Courses",
    icon: Award,
    color: "text-emerald-600",
    href: "/content/courses",
    stats: ["12 published", "450 enrolled"],
  },
  {
    title: "Events",
    icon: Calendar,
    color: "text-rose-600",
    href: "/content/events",
    stats: ["8 upcoming", "250 RSVPs"],
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    color: "text-amber-600",
    href: "/marketplace",
    stats: ["45 listings", "$1.2k volume"],
  },
  {
    title: "Jobs",
    icon: Briefcase,
    color: "text-violet-600",
    href: "/jobs",
    stats: ["12 open", "85 applied"],
  },
  {
    title: "Offers",
    icon: AlertTriangle,
    color: "text-red-600",
    href: "/content/offers",
    stats: ["5 active", "120 claimed"],
  },
];

interface DashboardQuickStatsProps {
  featureModules: any[];
  DashboardSectionHeading: React.FC<{
    title: string;
    rightElement?: React.ReactNode;
  }>;
}

export function DashboardQuickStats({
  featureModules,
  DashboardSectionHeading,
}: DashboardQuickStatsProps) {
  const [showAllFeatureModules, setShowAllFeatureModules] = useState(false);

  const visibleFeatureModules = showAllFeatureModules
    ? modulePerformanceList
    : modulePerformanceList.slice(0, 9);

  return (
    <section className="lg:col-span-8 space-y-3">
      <DashboardSectionHeading
        title="QUICK STATS"
        rightElement={
          modulePerformanceList.length > 9 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
              onClick={() => setShowAllFeatureModules((prev) => !prev)}
            >
              {showAllFeatureModules ? "View less" : "View More"}
            </Button>
          )
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {visibleFeatureModules.map((mod) => {
          const dataItem = featureModules?.find(
            (m: any) =>
              m.module.toLowerCase() === mod.title.toLowerCase() ||
              m.module.includes(mod.title) ||
              mod.title.includes(m.module),
          );
          const card = (
            <ModulePerformanceCard
              title={mod.title}
              icon={mod.icon}
              stats={dataItem?.stats ?? mod.stats}
              color={mod.color}
            />
          );

          return mod.href ? (
            <Link href={mod.href} key={mod.title} className="block">
              {card}
            </Link>
          ) : (
            <div key={mod.title}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
