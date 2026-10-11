"use client";

import React from "react";
import Link from "next/link";
import { Trophy, History, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import {
  useGetLeaderboard,
  useGetGamificationActivityLog,
} from "@/graphql/actions/gamification/gamification-quiries";
import { useGetImpactUsers } from "@/graphql/actions";

interface DashboardGamificationSectionProps {
  DashboardSectionHeading: React.FC<{
    title: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
  }>;
}

interface ImpactUserNode {
  user?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    avatar?: string;
  };
  tier?: string;
  score: number;
}

export function DashboardGamificationSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((col) => (
        <div key={col} className="space-y-3 flex flex-col h-full">
          <div className="h-5 w-36 rounded bg-muted animate-pulse" />
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border flex-1 min-h-[350px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                  <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardGamificationSection({
  DashboardSectionHeading,
}: DashboardGamificationSectionProps) {
  const { data: leaderboardData, loading: loadingLeaderboard } =
    useGetLeaderboard({
      variables: {
        pagination: { limit: 7, offset: 0 },
      },
    });

  const { data: activityLogData, loading: loadingActivityLog } =
    useGetGamificationActivityLog({
      variables: {
        input: { limit: 9, offset: 0 },
      },
    });

  const { data: impactData, loading: loadingImpact } = useGetImpactUsers({
    variables: {
      input: { limit: 7, offset: 0 },
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Leaderboard */}
      <section className="space-y-3 flex flex-col h-full">
        <DashboardSectionHeading
          title="Gamification Leaderboard"
          icon={<Trophy className="h-3.5 w-3.5 text-muted-foreground" />}
          rightElement={
            <Link href="/gamification/points-and-badges/leaderboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
              >
                View all
              </Button>
            </Link>
          }
        />
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05)] flex-1">
          {loadingLeaderboard ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                    <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : (leaderboardData?.getLeaderboard?.entries?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Trophy className="h-8 w-8 mb-2 opacity-30" />
              <span className="text-xs">No leaderboard data yet</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {leaderboardData?.getLeaderboard?.entries?.map((entry) => {
                const user = entry?.user;
                const rankColors: Record<number, string> = {
                  1: "text-yellow-500",
                  2: "text-slate-400",
                  3: "text-amber-600",
                };
                return (
                  <div
                    key={`${user?.id}-${entry.rank}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums w-6 text-center shrink-0",
                        rankColors[entry.rank] || "text-muted-foreground/50",
                      )}
                    >
                      {entry.rank <= 3
                        ? ["🥇", "🥈", "🥉"][entry.rank - 1]
                        : `#${entry.rank}`}
                    </span>

                    <UserProfileHoverCard
                      user={{
                        id: user?.id,
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        avatar: user?.avatar,
                      }}
                    >
                      <Link
                        href={`/members/${user?.id}`}
                        className="flex items-center gap-2.5 group min-w-0 flex-1"
                      >
                        <Avatar className="h-8 w-8 border border-border shrink-0">
                          <AvatarImage
                            src={`https://cdn.thrico.network/${user?.avatar}`}
                            alt={user?.firstName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                            {user?.firstName?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <span className="text-[13px] font-medium text-foreground truncate block group-hover:text-primary transition-colors">
                            {user?.firstName} {user?.lastName}
                          </span>
                          {entry?.currentRank && (
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider"
                              style={{ color: entry.currentRank.color }}
                            >
                              {entry.currentRank.icon} {entry.currentRank.name}
                            </span>
                          )}
                        </div>
                      </Link>
                    </UserProfileHoverCard>

                    <span className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                      {entry.totalPoints.toLocaleString()}
                      <span className="text-xs text-muted-foreground ml-0.5 font-normal">
                        pts
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Activity Log */}
      <section className="space-y-3 flex flex-col h-full">
        <DashboardSectionHeading
          title="Activity Log"
          icon={<History className="h-3.5 w-3.5 text-muted-foreground" />}
          rightElement={
            <Link href="/gamification/points-and-badges/leaderboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
              >
                View all
              </Button>
            </Link>
          }
        />
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05)] flex-1">
          {loadingActivityLog ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-3 w-10 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : (activityLogData?.getGamificationActivityLog?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="h-8 w-8 mb-2 opacity-30" />
              <span className="text-xs">No activity logged yet</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activityLogData?.getGamificationActivityLog?.map((log) => {
                const user = log.user;
                const isBadge = log.type === "BADGE";
                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors"
                  >
                    <UserProfileHoverCard
                      user={{
                        id: user?.id,
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        avatar: user?.avatar,
                      }}
                    >
                      <Link href={`/members/${user?.id}`} className="shrink-0">
                        <Avatar className="h-7 w-7 border border-border">
                          <AvatarImage
                            src={`https://cdn.thrico.network/${user?.avatar}`}
                            alt={user?.firstName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-medium uppercase">
                            {user?.firstName?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </UserProfileHoverCard>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <UserProfileHoverCard
                          user={{
                            id: user?.id,
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            avatar: user?.avatar,
                          }}
                        >
                          <Link
                            href={`/members/${user?.id}`}
                            className="text-[13px] font-medium text-foreground hover:text-primary transition-colors truncate"
                          >
                            {user?.firstName} {user?.lastName}
                          </Link>
                        </UserProfileHoverCard>
                        <span className="text-xs text-muted-foreground/50">
                          ·
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {(() => {
                            try {
                              return formatDistanceToNow(
                                new Date(log.createdAt),
                                { addSuffix: true },
                              );
                            } catch {
                              return "";
                            }
                          })()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                        {isBadge ? (
                          <>
                            <Award className="inline h-3 w-3 text-indigo-500 mr-0.5 -mt-0.5" />
                            Earned{" "}
                            <span className="font-medium text-foreground/80">
                              {log.badgeName || "badge"}
                            </span>
                          </>
                        ) : (
                          <>
                            {log.ruleDescription
                              ?.replace(/_/g, " ")
                              ?.toLowerCase() ||
                              log.ruleDescription ||
                              "Earned points"}
                          </>
                        )}
                      </p>
                    </div>

                    {log.points !== 0 && (
                      <span
                        className={cn(
                          "text-xs font-semibold tabular-nums shrink-0 px-1.5 py-0.5 rounded-full",
                          log.points > 0
                            ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
                            : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30",
                        )}
                      >
                        {log.points > 0 ? "+" : ""}
                        {log.points}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Impact Score */}
      <section className="space-y-3 flex flex-col h-full">
        <DashboardSectionHeading
          title="Impact Score"
          icon={<Users className="h-3.5 w-3.5 text-muted-foreground" />}
          rightElement={
            <Link href="/gamification/impact-score/members">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
              >
                View all
              </Button>
            </Link>
          }
        />
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.05)] flex-1">
          {loadingImpact ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                    <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : (impactData?.getImpactUsers?.nodes?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-8 w-8 mb-2 opacity-30" />
              <span className="text-xs">No impact data yet</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {impactData?.getImpactUsers?.nodes?.map(
                (node: ImpactUserNode, index: number) => {
                  const user = node?.user;
                  const rankColors: Record<number, string> = {
                    1: "text-yellow-500",
                    2: "text-slate-400",
                    3: "text-amber-600",
                  };
                  const rank = index + 1;
                  return (
                    <div
                      key={`${user?.id}-${rank}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors",
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-bold tabular-nums w-6 text-center shrink-0",
                          rankColors[rank] || "text-muted-foreground/50",
                        )}
                      >
                        {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                      </span>

                      <UserProfileHoverCard
                        user={{
                          id: user?.id,
                          firstName: user?.firstName,
                          lastName: user?.lastName,
                          avatar: user?.avatarUrl || user?.avatar,
                        }}
                      >
                        <Link
                          href={`/members/${user?.id}`}
                          className="flex items-center gap-2.5 group min-w-0 flex-1"
                        >
                          <Avatar className="h-8 w-8 border border-border shrink-0">
                            <AvatarImage
                              src={`https://cdn.thrico.network/${user?.avatarUrl || user?.avatar}`}
                              alt={user?.firstName}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                              {user?.firstName?.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <span className="text-[13px] font-medium text-foreground truncate block group-hover:text-primary transition-colors">
                              {user?.firstName} {user?.lastName}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground">
                              {node?.tier}
                            </span>
                          </div>
                        </Link>
                      </UserProfileHoverCard>

                      <span className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                        {node.score.toLocaleString()}
                        <span className="text-xs text-muted-foreground ml-0.5 font-normal">
                          pts
                        </span>
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
