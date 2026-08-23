"use client";

import React from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useGetImpactActivityLog } from "@/graphql/actions/impact";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function ImpactActivityWidget() {
  const { data, loading } = useGetImpactActivityLog();
  const logs = data?.getImpactActivityLog || [];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-3 sm:px-4 pt-3 sm:pt-3.5">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <History className="h-3 w-3 text-primary" />
            Live Impact Activity
          </span>
          <p className="text-[10px] text-muted-foreground">
            Real-time score adjustments and triggers
          </p>
        </div>

        <Link href="/gamification/impact-score/activity-log">
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] text-primary font-bold h-6 px-2 rounded hover:bg-muted"
          >
            All logs <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-0 divide-y divide-border/50">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 px-3 sm:px-4 py-2 animate-pulse">
              <div className="h-6.5 w-6.5 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 w-24 rounded bg-muted" />
                <div className="h-2 w-32 rounded bg-muted" />
              </div>
              <div className="h-3 w-10 rounded bg-muted" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <History className="h-6 w-6 mb-1.5 opacity-30" />
            <span className="text-[10px] font-medium">No activity logged yet</span>
          </div>
        ) : (
          logs.slice(0, 5).map((log: any) => {
            const user = log.user;

            return (
              <div
                key={log.id}
                className="flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <UserProfileHoverCard
                    user={{
                      id: user?.id,
                      firstName: user?.firstName,
                      lastName: user?.lastName,
                      avatar: user?.avatar,
                    }}
                  >
                    <Link href={`/members/${user?.id}`} className="shrink-0">
                      <Avatar className="h-6.5 w-6.5 border border-border/70">
                        <AvatarImage
                          src={
                            user?.avatar
                              ? `https://cdn.thrico.network/${user.avatar}`
                              : ""
                          }
                          alt={user?.firstName}
                        />
                        <AvatarFallback className="text-[9px] font-bold bg-muted text-muted-foreground">
                          {user?.firstName?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </UserProfileHoverCard>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
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
                          className="text-[11px] font-bold text-foreground hover:text-primary transition-colors truncate"
                        >
                          {user?.firstName} {user?.lastName}
                        </Link>
                      </UserProfileHoverCard>
                      <span className="text-[9px] text-muted-foreground/50">•</span>
                      <span className="text-[9px] text-muted-foreground shrink-0">
                        {(() => {
                          try {
                            return formatDistanceToNow(new Date(log.createdAt), {
                              addSuffix: true,
                            });
                          } catch {
                            return "";
                          }
                        })()}
                      </span>
                    </div>

                    <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.2">
                      {log.actionName || log.description || "Completed action"}
                    </p>
                  </div>
                </div>

                {log.scoreDelta !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-black tabular-nums shrink-0 px-1.5 py-0.2 rounded-full border",
                      log.scoreDelta >= 0
                        ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-500/20"
                        : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40 border-rose-500/20"
                    )}
                  >
                    {log.scoreDelta >= 0 ? "+" : ""}
                    {log.scoreDelta} pts
                  </span>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
