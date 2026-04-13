"use client";

import React from "react";
import { 
  Eye, 
  Terminal, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";
import moment from "moment";

interface AuditLog {
  id: string;
  entity: { name: string; type: string };
  action: string;
  status: string;
  performedBy: { name: string; role: string };
  reason: string | null;
  createdAt: string;
}

export function AuditLogTable({
  data,
  onViewDetails,
  isLoading = false,
}: {
  data: AuditLog[];
  onViewDetails?: (log: AuditLog) => void;
  isLoading?: boolean;
}) {
  const columns = [
    {
      key: "createdAt",
      header: "Timestamp",
      cell: (log: AuditLog) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">
              {moment(log.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium ml-5">
            {moment(log.createdAt).format("HH:mm:ss [UTC]")}
          </span>
        </div>
      ),
    },
    {
      key: "entity",
      header: "Target Entity",
      cell: (log: AuditLog) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
             <Terminal className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
               <span className="text-sm font-black text-foreground uppercase tracking-tight">
                  {log.entity.name}
               </span>
               <span className="inline-flex h-4 items-center px-1.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200/50">
                  {log.entity.type}
               </span>
            </div>
            {log.reason && (
               <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px] mt-0.5">
                  {log.reason}
               </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action Logic",
      cell: (log: AuditLog) => {
        const action = log.action.toUpperCase();
        const isDestructive = ["REMOVE", "DELETE", "REJECTED"].includes(action);
        const isUpdate = ["UPDATE", "STATUS"].includes(action);
        
        return (
          <div className="flex items-center gap-2">
             <div className={cn(
                "h-2 w-2 rounded-full",
                isDestructive ? "bg-rose-500" : isUpdate ? "bg-amber-500" : "bg-emerald-500"
             )} />
             <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
                {log.action}
             </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Registry State",
      cell: (log: AuditLog) => {
        const status = log.status.toUpperCase();
        const badgeStatus = status === "APPROVED" ? "APPROVED" : status === "REJECTED" ? "BLOCKED" : "PENDING";
        return (
          <AdminStatusBadge status={badgeStatus}>
            {log.status}
          </AdminStatusBadge>
        );
      },
    },
    {
      key: "performedBy",
      header: "Authority",
      cell: (log: AuditLog) => (
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
             <User className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground leading-none">
              {log.performedBy.name}
            </span>
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter mt-1">
              {log.performedBy.role}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (log: AuditLog) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails?.(log)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <AdminTable
        columns={columns}
        data={data}
        loading={isLoading}
        keyExtractor={(l) => l.id}
        emptyTitle="No Audit Signals"
        emptyDescription="System tranquility detected. No activity logs have been recorded for this entity scope."
      />
    </div>
  );
}
