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
  ListFilter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserActivityLog,
  useGetUserEarnedBadges,
  useGetGamificationSummary,
} from "@/graphql/actions/gamification/gamification-quiries";
import { safeFormatDistanceToNow, safeLocaleDateString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export function GamificationTab({ userId }: { userId: string }) {
  const { data: gamificationData } = useGetGamificationSummary(userId);
  const summary = gamificationData?.getUserGamificationSummary;

  return (
    <div className="space-y-6 mt-0 border-none p-0 outline-none">
      {/* Gamification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 border-primary/20 bg-linear-to-br from-primary/5 via-background to-background relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Trophy className="h-32 w-32 text-primary" />
          </div>
          <CardContent className="p-6 relative">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary/70 mb-1">
              Total Impact Points
            </h4>
            <div className="text-4xl font-black text-primary flex items-baseline gap-2">
              {summary?.totalPointsEarned || 0}
              <span className="text-xs font-bold text-muted-foreground tracking-normal uppercase">
                XP
              </span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center"
                  >
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Level 4 Contributor
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 flex flex-col justify-center border-border/40">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
            Current Rank
          </p>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Hash className="h-5 w-5 text-orange-500" />#
            {summary?.rankPosition || "N/A"}
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center border-border/40">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">
            Daily Streak
          </p>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            {summary?.currentStreak || 0} Days
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Badge History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Earned Badges
            </h3>
            <Button variant="ghost" size="sm" className="text-xs h-8">
              View All
            </Button>
          </div>
          <MemberBadgesList userId={userId} />
        </div>

        {/* Point Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Recent Points
            </h3>
            <ListFilter className="h-4 w-4 text-muted-foreground" />
          </div>
          <MemberActivityLog userId={userId} />
        </div>
      </div>
    </div>
  );
}

function MemberBadgesList({ userId }: { userId: string }) {
  const { data, loading } = useGetUserEarnedBadges(userId, 6);
  const badges = data?.getUserEarnedBadges?.edges || [];

  if (loading)
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );

  if (badges.length === 0)
    return (
      <Card className="p-8 border-dashed flex flex-col items-center justify-center text-center">
        <Star className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs text-muted-foreground">No badges earned yet.</p>
      </Card>
    );

  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((edge: any, idx: number) => (
        <Card
          key={idx}
          className="p-3 border-border/40 bg-linear-to-b from-background to-muted/10 group hover:border-primary/20 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 group-hover:rotate-12 transition-transform">
              <>{edge.node.icon}</>
            </div>
            <div className="overflow-hidden">
              <h5 className="text-sm font-black truncate">{edge.node.name}</h5>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {edge.node.description}
              </p>
              <p className="text-[9px] font-bold text-primary uppercase mt-1">
                {edge.node.userProgress?.createdAt
                  ? safeLocaleDateString(edge.node.userProgress.createdAt)
                  : "Active"}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { AdminTable, AdminTableColumn } from "@/components/shared/admin-table/admin-table";

function MemberActivityLog({ userId }: { userId: string }) {
  const { data, loading } = useGetUserActivityLog(userId, 5);
  const logs = data?.getUserActivityLog || [];

  const columns: AdminTableColumn<any>[] = [
    {
      key: "activity",
      header: "Activity",
      cell: (log) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
              log.type === "BADGE"
                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                : "bg-primary/10 border-primary/20 text-primary",
            )}
          >
            {log.type === "BADGE" ? (
              <Award className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-tight leading-tight">
              {log.ruleAction || log.type}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {log.ruleDescription || log.badgeName || "Activity recorded"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (log) => (
        <span className="text-[10px] font-medium text-muted-foreground">
          {safeFormatDistanceToNow(log.createdAt, { addSuffix: true })}
        </span>
      ),
    },
    {
      key: "points",
      header: "Points",
      className: "text-right",
      cell: (log) => (
        <span className="text-xs font-black text-primary">
          +{log.points} XP
        </span>
      ),
    },
  ];

  return (
    <div className="pt-2">
      <AdminTable
        data={logs}
        columns={columns}
        loading={loading}
        keyExtractor={(_, idx) => idx.toString()}
        pageSize={5}
        emptyIcon={Clock}
        emptyTitle="No activity found"
        emptyDescription="This member hasn't earned any points yet."
        className="border-none shadow-none bg-transparent"
      />
    </div>
  );
}
