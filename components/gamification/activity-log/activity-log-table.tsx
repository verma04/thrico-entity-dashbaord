"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { GamificationActivityLogEntry } from "@/graphql/actions/gamification/gamification-quiries";
import { History, Activity } from "lucide-react";

interface ActivityLogTableProps {
  logs: GamificationActivityLogEntry[];
  isLoading: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  const columns = [
    {
      key: "user",
      header: "Member Participant",
      cell: (log: GamificationActivityLogEntry) => {
        const user = log.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border bg-white shadow-sm shrink-0 rounded-xl">
              <AvatarImage
                src={`https://cdn.thrico.network/${user.avatar}`}
                alt={user.firstName}
                className="object-cover"
              />
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-bold uppercase">
                {user.firstName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground leading-none">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[9px] text-muted-foreground font-mono mt-1 tracking-tight">
                IDENTITY: {user.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "activity",
      header: "Event Protocol",
      cell: (log: GamificationActivityLogEntry) => (
        <div className="flex items-center gap-2">
           <div className="h-5 w-5 rounded bg-muted flex items-center justify-center">
              <Activity className="h-2.5 w-2.5 text-muted-foreground" />
           </div>
           <span className="text-[11px] font-black text-foreground uppercase tracking-widest italic">
             {log.type.replace(/_/g, " ").toLowerCase()}
           </span>
        </div>
      ),
    },
    {
      key: "delta",
      header: "Yield Impact",
      cell: (log: GamificationActivityLogEntry) => {
        const points = log.points;
        const isPositive = points > 0;
        return (
          <div className="flex items-center gap-2 pr-4">
             <div className="flex items-center gap-1.5 font-mono text-[13px] font-black leading-none">
               <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                 {isPositive ? "+" : ""}{points}
               </span>
               <span className="text-[9px] text-zinc-400 font-black tracking-widest">PTS</span>
             </div>
          </div>
        );
      },
    },
    {
      key: "timeline",
      header: "Temporal Log",
      cell: (log: GamificationActivityLogEntry) => (
        <div className="flex flex-col">
           <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">
             {format(new Date(log.createdAt), "MMM d, yyyy")}
           </span>
           <span className="text-[9px] text-muted-foreground/60 font-medium">
             {format(new Date(log.createdAt), "hh:mm a")} — Node Logged
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
      emptyTitle="No activity signals detected"
      emptyDescription="The system audit log will reflect all gamification state changes once interaction begins."
    />
  );
}
