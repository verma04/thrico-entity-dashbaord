"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetUserStats } from "@/graphql/actions";
import { useMemberDetails } from "./member-context";
import {
  Layout,
  Users,
  UsersRound,
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  Briefcase,
  Lightbulb,
  Clock,
  Network,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ── Color Palette for stat cards ────────────────────────────────────────── */

const STAT_COLORS = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/40",
    hover: "hover:border-blue-200 dark:hover:border-blue-800/60",
    ring: "hover:ring-blue-100 dark:hover:ring-blue-900/30",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    icon: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/40",
    hover: "hover:border-violet-200 dark:hover:border-violet-800/60",
    ring: "hover:ring-violet-100 dark:hover:ring-violet-900/30",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/40",
    hover: "hover:border-emerald-200 dark:hover:border-emerald-800/60",
    ring: "hover:ring-emerald-100 dark:hover:ring-emerald-900/30",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/40",
    hover: "hover:border-amber-200 dark:hover:border-amber-800/60",
    ring: "hover:ring-amber-100 dark:hover:ring-amber-900/30",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    icon: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900/40",
    hover: "hover:border-rose-200 dark:hover:border-rose-800/60",
    ring: "hover:ring-rose-100 dark:hover:ring-rose-900/30",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    icon: "text-sky-600 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-900/40",
    hover: "hover:border-sky-200 dark:hover:border-sky-800/60",
    ring: "hover:ring-sky-100 dark:hover:ring-sky-900/30",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900/40",
    hover: "hover:border-orange-200 dark:hover:border-orange-800/60",
    ring: "hover:ring-orange-100 dark:hover:ring-orange-900/30",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/30",
    icon: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-900/40",
    hover: "hover:border-teal-200 dark:hover:border-teal-800/60",
    ring: "hover:ring-teal-100 dark:hover:ring-teal-900/30",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    icon: "text-pink-600 dark:text-pink-400",
    border: "border-pink-100 dark:border-pink-900/40",
    hover: "hover:border-pink-200 dark:hover:border-pink-800/60",
    ring: "hover:ring-pink-100 dark:hover:ring-pink-900/30",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    icon: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/40",
    hover: "hover:border-indigo-200 dark:hover:border-indigo-800/60",
    ring: "hover:ring-indigo-100 dark:hover:ring-indigo-900/30",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    icon: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900/40",
    hover: "hover:border-cyan-200 dark:hover:border-cyan-800/60",
    ring: "hover:ring-cyan-100 dark:hover:ring-cyan-900/30",
  },
} as const;

type ColorKey = keyof typeof STAT_COLORS;

/* ── Stat Card ───────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: ColorKey;
  onClick?: () => void;
}) {
  const palette = STAT_COLORS[color];

  return (
    <Card
      className={cn(
        "border transition-all duration-200 cursor-pointer group",
        palette.border,
        palette.hover,
        "hover:ring-2",
        palette.ring,
        "hover:shadow-sm",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl", palette.bg)}>
          <Icon className={cn("h-4 w-4", palette.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold tracking-tight">{value}</p>
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      </CardContent>
    </Card>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export function StatsTab({ userId }: { userId: string }) {
  const router = useRouter();
  const { member } = useMemberDetails();
  const { data: statsData } = useGetUserStats(userId);
  const stats = statsData?.getUserStats;

  const basePath = `/members/${member?.id || userId}`;

  const statItems: {
    label: string;
    value: number;
    icon: React.ElementType;
    color: ColorKey;
    tab: string;
  }[] = [
    {
      label: "Posts",
      value: stats?.totalPosts || 0,
      icon: Layout,
      color: "blue",
      tab: "feed",
    },
    {
      label: "Connections",
      value: stats?.totalConnections || 46,
      icon: Users,
      color: "violet",
      tab: "connections",
    },
    {
      label: "Communities",
      value: 0,
      icon: UsersRound,
      color: "emerald",
      tab: "communities",
    },
    {
      label: "Events",
      value: stats?.totalEvents || 0,
      icon: CalendarIcon,
      color: "amber",
      tab: "events",
    },
    {
      label: "Listings",
      value: stats?.totalListings || 0,
      icon: FileText,
      color: "sky",
      tab: "listings",
    },
    {
      label: "Offers",
      value: stats?.totalOffers || 0,
      icon: TrendingUp,
      color: "rose",
      tab: "offers",
    },
    {
      label: "Jobs",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "orange",
      tab: "jobs",
    },
    {
      label: "Opportunities",
      value: 0,
      icon: Lightbulb,
      color: "teal",
      tab: "opportunities",
    },
    {
      label: "Moments",
      value: 0,
      icon: Clock,
      color: "pink",
      tab: "moments",
    },
    {
      label: "Referrals",
      value: 0,
      icon: Network,
      color: "indigo",
      tab: "referrals",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {statItems.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
            onClick={() => router.push(`${basePath}/${item.tab}`)}
          />
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="py-10 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Activity visualization coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
