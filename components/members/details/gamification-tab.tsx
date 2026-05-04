"use client";

import React from "react";
import {
  Trophy,
  Star,
  Hash,
  Flame,
  Award,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserActivityLog,
  useGetUserEarnedBadges,
  useGetGamificationSummary,
} from "@/graphql/actions/gamification/gamification-quiries";
import { safeFormatDistanceToNow, safeLocaleDateString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

/* ── Summary Cards ───────────────────────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconClassName?: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-muted", iconClassName)}>
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

/* ── Badges List ─────────────────────────────────────────────────────────── */

function MemberBadgesList({ userId }: { userId: string }) {
  const { data, loading } = useGetUserEarnedBadges(userId, 6);
  const badges = data?.getUserEarnedBadges?.edges || [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        No badges earned yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((edge: any, idx: number) => (
        <Card key={idx} className="border-border">
          <CardContent className="p-3 flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 bg-muted rounded-lg flex items-center justify-center">
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-medium truncate">{edge.node.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {edge.node.description}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {edge.node.userProgress?.createdAt
                  ? safeLocaleDateString(edge.node.userProgress.createdAt)
                  : "Active"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ── Activity Log ────────────────────────────────────────────────────────── */

function MemberActivityLog({ userId }: { userId: string }) {
  const { data, loading } = useGetUserActivityLog(userId, 5);
  const logs = data?.getUserActivityLog || [];

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
        >
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              log.type === "BADGE"
                ? "bg-amber-50 text-amber-600"
                : "bg-primary/10 text-primary",
            )}
          >
            {log.type === "BADGE" ? (
              <Award className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {log.ruleAction || log.type}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {log.ruleDescription || log.badgeName || "Activity recorded"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-primary">+{log.points}</p>
            <p className="text-[10px] text-muted-foreground">
              {safeFormatDistanceToNow(log.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Tab ────────────────────────────────────────────────────────────── */

export function GamificationTab({ userId }: { userId: string }) {
  const { data: gamificationData, loading } = useGetGamificationSummary(userId);
  const summary = gamificationData?.getUserGamificationSummary;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard
          label="Total Points"
          value={loading ? "..." : `${summary?.totalPointsEarned || 0} XP`}
          icon={Trophy}
          iconClassName="text-primary"
        />
        <SummaryCard
          label="Current Rank"
          value={loading ? "..." : `#${summary?.rankPosition || "N/A"}`}
          icon={Hash}
          iconClassName="text-orange-500"
        />
        <SummaryCard
          label="Daily Streak"
          value={loading ? "..." : `${summary?.currentStreak || 0} days`}
          icon={Flame}
          iconClassName="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badges */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Award className="h-4 w-4" /> Earned Badges
          </h3>
          <MemberBadgesList userId={userId} />
        </div>

        {/* Recent Points */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" /> Recent Points
          </h3>
          <MemberActivityLog userId={userId} />
        </div>
      </div>
    </div>
  );
}
