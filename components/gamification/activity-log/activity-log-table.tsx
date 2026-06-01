"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { GamificationActivityLogEntry } from "@/graphql/actions/gamification/gamification-quiries";
import { Badge } from "@/components/ui/badge";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";

interface ActivityLogTableProps {
  logs: GamificationActivityLogEntry[];
  isLoading: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  const columns = [
    {
      key: "user",
      header: "Member",
      cell: (log: GamificationActivityLogEntry) => {
        const user = log.user;
        const hoverUser: UserProfileHoverData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        };
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                <AvatarImage
                  src={`https://cdn.thrico.network/${user.avatar}`}
                  alt={user.firstName}
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-medium">
                  {user.firstName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground leading-tight hover:underline">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ID: {user.id.substring(0, 8)}
                </span>
              </div>
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "activity",
      header: "Activity",
      cell: (log: GamificationActivityLogEntry) => (
        <Badge variant="secondary" className="font-medium text-xs capitalize">
          {log.type.replace(/_/g, " ").toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "details",
      header: "Details",
      cell: (log: GamificationActivityLogEntry) => {
        if (log.badgeName) {
          return (
            <div className="flex flex-col max-w-[280px]">
              <div className="flex items-center gap-1.5">
                {log.badgeIcon && (
                  <img
                    src={`https://cdn.thrico.network/${log.badgeIcon}`}
                    alt={log.badgeName}
                    className="h-4 w-4"
                  />
                )}
                <span className="text-xs font-semibold text-blue-600">
                  {log.badgeName}
                </span>
              </div>
              {log.badgeDescription && (
                <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {log.badgeDescription}
                </span>
              )}
            </div>
          );
        }
        if (log.ruleAction) {
          return (
            <div className="flex flex-col max-w-[280px]">
              <span className="text-xs font-medium text-foreground capitalize">
                {log.ruleAction.replace(/_/g, " ").toLowerCase()}
              </span>
              {log.ruleDescription && (
                <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {log.ruleDescription}
                </span>
              )}
            </div>
          );
        }
        return <span className="text-xs text-muted-foreground">—</span>;
      },
    },
    {
      key: "points",
      header: "Points",
      cell: (log: GamificationActivityLogEntry) => {
        const points = log.points;
        const isPositive = points > 0;
        return (
          <span
            className={`font-mono text-sm font-semibold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {points}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      cell: (log: GamificationActivityLogEntry) => (
        <div className="flex flex-col">
          <span className="text-xs text-foreground">
            {format(new Date(log.createdAt), "MMM d, yyyy")}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {format(new Date(log.createdAt), "hh:mm a")}
          </span>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={logs || []}
      loading={isLoading}
      keyExtractor={(log) => log.id}
      emptyTitle="No activity logged yet"
      emptyDescription="Activity will appear here once members start earning points and badges."
    />
  );
}
