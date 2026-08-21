import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Briefcase,
  Tag,
  Wallet,
  BarChart3,
  GraduationCap,
  ClipboardList,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModulePerformanceCard } from "@/components/layout/ecosystem/module-performance-card";

const modulePerformanceList = [
  {
    title: "Members",
    icon: Users,
    color: "text-blue-600",
    href: "/members",
    stats: ["0 registered", "0 approved"],
  },
  {
    title: "Wallet",
    icon: Wallet,
    color: "text-amber-600",
    href: "/gamification/currency",
    stats: ["0 Total", "0 Active"],
  },
  {
    title: "Referrals",
    icon: Users,
    color: "text-cyan-600",
    href: "/members/referrals",
    stats: ["0 referrers", "0 referees"],
  },
  {
    title: "Discussions",
    icon: MessageSquare,
    color: "text-indigo-600",
    href: "/forums",
    stats: ["0 topics", "0 comments"],
  },
  {
    title: "Polls",
    icon: BarChart3,
    color: "text-cyan-600",
    href: "/polls",
    stats: ["0 total", "0 active"],
  },
  {
    title: "Offers",
    icon: Tag,
    color: "text-red-600",
    href: "/offers",
    stats: ["0 total", "0 active"],
  },
  {
    title: "Events",
    icon: Calendar,
    color: "text-rose-600",
    href: "/events",
    stats: ["0 total", "0 upcoming"],
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    color: "text-amber-600",
    href: "/listing",
    stats: ["0 total", "0 active"],
  },
  {
    title: "Jobs",
    icon: Briefcase,
    color: "text-violet-600",
    href: "/jobs",
    stats: ["0 total", "0 active"],
  },
  {
    title: "Communities",
    icon: Users,
    color: "text-emerald-600",
    href: "/communities",
    stats: ["0 total", "0 active"],
  },
  {
    title: "Surveys",
    icon: ClipboardList,
    color: "text-teal-600",
    href: "/surveys",
    stats: ["0 total", "0 active"],
  },
  {
    title: "Mentorship",
    icon: GraduationCap,
    color: "text-purple-600",
    href: "/mentorship",
    stats: ["0 applied", "0 approved"],
  },
  {
    title: "Moments",
    icon: Video,
    color: "text-pink-600",
    href: "/moments",
    stats: ["0 total", "0 active"],
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
          const modTitle = mod.title.toLowerCase();
          const dataItem = featureModules?.find((m: any) => {
            if (!m?.module) return false;
            const name = m.module.toLowerCase();
            if (name === modTitle) return true;
            if (
              modTitle === "marketplace" &&
              (name === "shop" || name === "listings" || name === "marketplace")
            )
              return true;
            if (
              modTitle === "discussions" &&
              (name === "forums" ||
                name === "discussion forum" ||
                name === "discussions")
            )
              return true;
            if (
              modTitle === "wallet" &&
              (name === "currency" ||
                name === "gamification" ||
                name === "wallet")
            )
              return true;
            if (
              modTitle === "mentorship" &&
              (name === "mentors" || name === "mentorship")
            )
              return true;
            return name.includes(modTitle) || modTitle.includes(name);
          });

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
