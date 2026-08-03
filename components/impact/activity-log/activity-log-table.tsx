"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
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
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatarUrl}`}
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
      key: "reason",
      header: "Reason",
      cell: (log: ImpactActivityEntry) => {
        const isDecay = log.changeReason.toLowerCase().includes("decay");
        return (
          <Badge variant={isDecay ? "destructive" : "secondary"} className="font-medium text-[11px] capitalize">
            {log.changeReason.replace(/_/g, " ").toLowerCase()}
          </Badge>
        );
      },
    },
    {
      key: "scores",
      header: "Score Change",
      cell: (log: ImpactActivityEntry) => {
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/30">{log.oldScore}</span>
            <span className="text-muted-foreground text-xs">→</span>
            <span className="text-xs font-semibold text-foreground">{log.newScore}</span>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Amount",
      cell: (log: ImpactActivityEntry) => {
        const isPositive = log.changeAmount > 0;
        const isZero = log.changeAmount === 0;
        return (
          <span
            className={`font-mono text-sm font-semibold ${
              isPositive ? "text-emerald-600" : isZero ? "text-muted-foreground" : "text-rose-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {log.changeAmount}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      cell: (log: ImpactActivityEntry) => (
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
      emptyTitle="No impact activity logged yet"
      emptyDescription="Impact scores will change once members start performing actions."
    />
  );
}
