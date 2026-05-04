"use client";

import React from "react";
import { useGetUserStats } from "@/graphql/actions";
import {
  Layout,
  MessageSquare,
  Users,
  Hash,
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ── Stat Card ───────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export function StatsTab({ userId }: { userId: string }) {
  const { data: statsData } = useGetUserStats(userId);
  const stats = statsData?.getUserStats;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Posts" value={stats?.totalPosts || 0} icon={Layout} />
        <StatCard label="Comments" value={stats?.totalComments || 0} icon={MessageSquare} />
        <StatCard label="Connections" value={stats?.totalConnections || 0} icon={Users} />
        <StatCard label="Groups" value={stats?.totalGroups || 0} icon={Hash} />
        <StatCard label="Events" value={stats?.totalEvents || 0} icon={CalendarIcon} />
        <StatCard label="Listings" value={stats?.totalListings || 0} icon={FileText} />
        <StatCard label="Offers" value={stats?.totalOffers || 0} icon={TrendingUp} />
        <StatCard label="Jobs" value={stats?.totalJobs || 0} icon={Briefcase} />
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
