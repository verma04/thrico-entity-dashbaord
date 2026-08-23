"use client";

import React from "react";
import Link from "next/link";
import { Trophy, ArrowRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useGetImpactUsers } from "@/graphql/actions/impact";

export function ImpactLeaderboardWidget() {
  const { data, loading } = useGetImpactUsers({
    variables: {
      input: { limit: 5, offset: 0 },
    },
  });

  const users = data?.getImpactUsers?.nodes || [];
  const rankMedals = ["🥇", "🥈", "🥉"];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-3 sm:px-4 pt-3 sm:pt-3.5">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <Trophy className="h-3 w-3 text-emerald-500" />
            Top Impact Rankers
          </span>
          <p className="text-[10px] text-muted-foreground">
            Members with highest overall reputation
          </p>
        </div>

        <Link href="/gamification/impact-score/members">
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] text-primary font-bold h-6 px-2 rounded hover:bg-muted"
          >
            All members <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-0 divide-y divide-border/50">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 px-3 sm:px-4 py-2 animate-pulse">
              <div className="h-3.5 w-3.5 rounded bg-muted" />
              <div className="h-7 w-7 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 w-24 rounded bg-muted" />
                <div className="h-2 w-14 rounded bg-muted" />
              </div>
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Users className="h-6 w-6 mb-1.5 opacity-30" />
            <span className="text-[10px] font-medium">No impact score data yet</span>
          </div>
        ) : (
          users.map((node: any, index: number) => {
            const user = node?.user;
            const rank = index + 1;

            return (
              <div
                key={`${user?.id}-${rank}`}
                className="flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[10px] font-bold tabular-nums w-4 text-center shrink-0">
                    {rank <= 3 ? rankMedals[rank - 1] : `#${rank}`}
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
                      className="flex items-center gap-2 group min-w-0 flex-1"
                    >
                      <Avatar className="h-6.5 w-6.5 border border-border/70 shrink-0">
                        <AvatarImage
                          src={
                            user?.avatarUrl || user?.avatar
                              ? `https://cdn.thrico.network/${user.avatarUrl || user.avatar}`
                              : ""
                          }
                          alt={user?.firstName}
                        />
                        <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">
                          {user?.firstName?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-foreground truncate block group-hover:text-primary transition-colors">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                          {node?.tier || "Active"}
                        </span>
                      </div>
                    </Link>
                  </UserProfileHoverCard>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-black text-foreground tabular-nums block">
                    {node.score.toLocaleString()}
                    <span className="text-[9px] text-muted-foreground font-normal ml-0.5">
                      pts
                    </span>
                  </span>
                  <span className="text-[8px] text-muted-foreground/70 font-medium block">
                    Impact
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
