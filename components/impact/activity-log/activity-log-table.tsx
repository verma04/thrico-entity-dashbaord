"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";

// Make sure to define the type, matching the GraphQL response
export type ImpactActivityEntry = {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  oldScore: number;
  newScore: number;
  changeAmount: number;
  changeReason: string;
  createdAt: string;
};

interface ActivityLogTableProps {
  logs: ImpactActivityEntry[];
  isLoading: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  const columns = [
    {
      key: "user",
      header: "Member",
      cell: (log: ImpactActivityEntry) => {
        const user = log.user;
        const hoverUser: UserProfileHoverData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatarUrl || "",
        };
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div>
              <AdminTableItem
                avatar={user.avatarUrl}
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
      key: "reason",
      header: "Reason",
      cell: (log: ImpactActivityEntry) => {
        const isDecay = log.changeReason.toLowerCase().includes("decay");
        return (
          <AdminTableTag variant={isDecay ? "rose" : "indigo"}>
            {log.changeReason.replace(/_/g, " ").toLowerCase()}
          </AdminTableTag>
        );
      },
    },
    {
      key: "scores",
      header: "Score Change",
      cell: (log: ImpactActivityEntry) => {
        return (
          <div className="flex items-center gap-1.5 font-mono text-[12px]">
            <span className="text-muted-foreground line-through decoration-muted-foreground/30">
              {log.oldScore}
            </span>
            <span className="text-muted-foreground opacity-60">→</span>
            <span className="font-semibold text-foreground">
              {log.newScore}
            </span>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Delta",
      cell: (log: ImpactActivityEntry) => {
        const isPositive = log.changeAmount > 0;
        const isZero = log.changeAmount === 0;
        return (
          <AdminTableMetric
            value={`${isPositive ? "+" : ""}${log.changeAmount}`}
            variant={isPositive ? "emerald" : isZero ? "default" : "rose"}
          />
        );
      },
    },
    {
      key: "date",
      header: "Date & Time",
      cell: (log: ImpactActivityEntry) => (
        <AdminTableDate date={log.createdAt} />
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={logs || []}
      loading={isLoading}
      keyExtractor={(log) => log.id}
      emptyTitle="No activity recorded"
      emptyDescription="Member impact score modifications and decay events will be listed here."
      size="sm"
    />
  );
}
