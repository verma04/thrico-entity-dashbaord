"use client";

import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AppDataTable } from "@/components/ui/app-data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { GamificationActivityLogEntry } from "@/graphql/actions/gamification/gamification-quiries";
import { History } from "lucide-react";

interface ActivityLogTableProps {
  logs: GamificationActivityLogEntry[];
  isLoading: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  const columns = useMemo<ColumnDef<GamificationActivityLogEntry>[]>(() => [
    {
      id: "user",
      accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-white shadow-sm shrink-0 rounded-xl">
              <AvatarImage
                src={`https://cdn.thrico.network/${user.avatar}`}
                alt={user.firstName}
              />
              <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                {user.firstName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono opacity-60">
                ID: {user.id.substring(0, 8)}...
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Activity Type",
      cell: ({ row }) => (
        <span className="text-[11px] font-semibold text-foreground capitalize tracking-tight px-2 py-0.5 bg-muted/50 rounded-md border border-border/30">
          {row.original.type.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => {
        const points = row.original.points;
        const isPositive = points > 0;
        return (
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
            <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
              {isPositive ? "+" : ""}
              {points}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase">pts</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {format(new Date(row.original.createdAt), "MMM d, yyyy · hh:mm a")}
        </span>
      ),
    },
  ], []);

  return (
    <AppDataTable
      columns={columns}
      data={logs}
      isLoading={isLoading}
      isShowExportButtons={true}
      searchableColumns={[{ id: "user", placeholder: "Search member activity..." }]}
    />
  );
}
