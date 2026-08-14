"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { GamificationActivityLogEntry } from "@/graphql/actions/gamification/gamification-quiries";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { Activity } from "lucide-react";
import { format } from "date-fns";

interface ActivityLogTableProps {
  logs: GamificationActivityLogEntry[];
  isLoading?: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  const columns = [
    {
      key: "user",
      header: "Member",
      cell: (log: GamificationActivityLogEntry) => {
        const user = log.user;
        if (!user) return <span className="text-[12px] text-muted-foreground">Unknown</span>;

        const hoverUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        };
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div>
              <AdminTableItem
                avatar={user.avatar}
                title={`${user.firstName || ""} ${user.lastName || ""}`}
                subtitle={`ID: ${user.id.substring(0, 8)}`}
                fallbackText={user.firstName?.substring(0, 2).toUpperCase()}
                onClick={() => {}}
              />
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "activity",
      header: "Activity",
      cell: (log: GamificationActivityLogEntry) => (
        <AdminTableTag variant="indigo">
          {log.type.replace(/_/g, " ").toLowerCase()}
        </AdminTableTag>
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
                  <BadgeIcon
                    icon={log.badgeIcon}
                    className="h-4 w-4 shrink-0 text-xs"
                    imageClassName="h-full w-full object-contain"
                  />
                )}
                <span className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {log.badgeName}
                </span>
              </div>
              {log.badgeDescription && (
                <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  {log.badgeDescription}
                </span>
              )}
            </div>
          );
        }
        if (log.ruleAction) {
          return (
            <div className="flex flex-col max-w-[280px]">
              <span className="text-[12px] font-medium text-foreground capitalize">
                {log.ruleAction.replace(/_/g, " ").toLowerCase()}
              </span>
              {log.ruleDescription && (
                <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  {log.ruleDescription}
                </span>
              )}
            </div>
          );
        }
        return <span className="text-[10px] text-muted-foreground">—</span>;
      },
    },
    {
      key: "points",
      header: "Points",
      cell: (log: GamificationActivityLogEntry) => {
        const points = log.points;
        const isPositive = points > 0;
        return (
          <AdminTableMetric
            value={`${isPositive ? "+" : ""}${points}`}
            variant={isPositive ? "emerald" : "rose"}
          />
        );
      },
    },
    {
      key: "date",
      header: "Date",
      cell: (log: GamificationActivityLogEntry) => (
        <AdminTableDate
          date={log.createdAt}
          time={format(new Date(log.createdAt), "hh:mm a")}
        />
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={logs || []}
      loading={isLoading}
      keyExtractor={(log) => log.id}
      emptyIcon={Activity}
      emptyTitle="No activity recorded"
      emptyDescription="Member points and badge achievements will appear here in real-time."
      size="sm"
    />
  );
}
