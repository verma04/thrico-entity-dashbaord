"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  Terminal,
  User,
  Fingerprint,
  Activity,
  Globe,
  RotateCcw,
  Eye,
  ShieldX,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAuditLogs, useGetAuditLogById } from "@/graphql/actions/audit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";
import moment from "moment";

export default function ShopAuditLog() {
  const params = useParams();
  const id = params?.id as string;
  const [page, setPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { data: logDetailsData, loading: logDetailsLoading } =
    useGetAuditLogById(
      { auditLogByIdId: selectedLogId || "" },
      { skip: !selectedLogId, fetchPolicy: "network-only" },
    );

  const {
    data: logData,
    loading: logLoading,
    refetch,
  } = useGetAuditLogs({
    pagination: { page, limit: 12 },
    resourceId: id,
    module: "SHOP",
  });

  const logs = logData?.auditLogs?.data || [];
  const meta = logData?.auditLogs?.meta || { totalItems: 0, totalPages: 0 };

  const renderStateFields = (statePayload: any, isRed: boolean) => {
    let parsedState = statePayload;
    if (!parsedState)
      return (
        <span className="text-xs text-zinc-400 italic block mt-2">No data</span>
      );

    if (typeof parsedState === "string") {
      try {
        parsedState = JSON.parse(parsedState);
      } catch {
        return (
          <span className="text-[11px] font-mono text-zinc-700 break-all block mt-2 p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl shadow-sm">
            {parsedState}
          </span>
        );
      }
    }

    if (typeof parsedState !== "object" || parsedState === null) {
      return (
        <span className="text-[11px] font-mono text-zinc-700 break-all block mt-2 p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl shadow-sm">
          {String(parsedState)}
        </span>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-2 mt-3 w-full pr-1">
        {Object.entries(parsedState).map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          let displayVal = value;
          if (typeof value === "boolean") displayVal = value ? "True" : "False";
          else if (typeof value === "object" && value !== null)
            displayVal = JSON.stringify(value);
          else if (value === null || value === undefined || value === "")
            displayVal = "—";

          return (
            <div
              key={key}
              className={cn(
                "flex flex-col gap-1 p-3 rounded-xl border shadow-sm",
                isRed
                  ? "bg-red-50/50 border-red-100"
                  : "bg-emerald-50/50 border-emerald-100",
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-widest",
                  isRed ? "text-red-400" : "text-emerald-500",
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "text-xs font-medium truncate",
                  isRed ? "text-red-900" : "text-emerald-900",
                  displayVal === "—" && "opacity-50",
                )}
                title={String(displayVal)}
              >
                {String(displayVal)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    {
      key: "createdAt",
      header: "Date & Time",
      cell: (log: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-sm font-medium text-foreground">
              {moment(log.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 ml-5.5 tabular-nums font-medium">
            {moment(log.createdAt).format("HH:mm:ss")}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (log: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center shrink-0">
            <Terminal className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {log.action}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex h-4 items-center px-1.5 rounded-md text-[9px] font-semibold uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200/50">
                {log.module || "SYSTEM"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "admin",
      header: "Performed By",
      cell: (log: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-none">
              {log?.admin?.firstName
                ? `${log.admin.firstName} ${log.admin?.lastName || ""}`
                : "System"}
            </span>
            <span className="text-[10px] font-medium text-zinc-400 mt-1 uppercase tracking-tighter">
              {log?.ipAddress || "Internal"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "target",
      header: "Target ID",
      cell: (log: any) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-zinc-600 truncate max-w-[140px] bg-zinc-100/50 px-2.5 py-1 rounded-lg border border-zinc-200 shadow-sm">
            {log.resourceId || log.targetUserId || "System"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (log: any) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedLogId(log.id)}
            className="h-8 w-8 text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg transition-all"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Audit Log
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Track all activity and administrative changes made to this product.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2 rounded-xl h-10 shadow-sm">
          <RotateCcw className={cn("h-4 w-4", logLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="bg-card rounded-2xl border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden">
        <div className="p-1">
          <AdminTable
            columns={columns}
            data={logs}
            loading={logLoading}
            keyExtractor={(log: any) => log.id}
            emptyTitle="No logs found"
            emptyDescription="No activity has been recorded for this product yet."
            pagination={{
              pageIndex: page - 1,
              pageSize: 12,
              pageCount: meta.totalPages,
              onPageChange: (i) => setPage(i + 1),
            }}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedLogId}
        onOpenChange={(open) => !open && setSelectedLogId(null)}
      >
        <DialogContent className="sm:max-w-[700px] rounded-3xl p-0 overflow-hidden border-border/60 shadow-2xl">
          <DialogHeader className="bg-zinc-50 border-b border-border/50 p-6 flex flex-row items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-border/60 text-zinc-900 shadow-sm">
              <Terminal className="h-6 w-6" />
            </div>
            <div className="space-y-1 mt-2">
              <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
                Log Details
              </DialogTitle>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                ID: {selectedLogId}
              </p>
            </div>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
            {logDetailsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <RotateCcw className="h-8 w-8 animate-spin text-zinc-300" />
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  Loading Details...
                </p>
              </div>
            ) : logDetailsData?.auditLogById ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      label: "Action",
                      val: logDetailsData.auditLogById.action,
                      icon: Terminal,
                    },
                    {
                      label: "Module",
                      val: logDetailsData.auditLogById.module || "System",
                      icon: Globe,
                    },
                    {
                      label: "Time",
                      val: moment(logDetailsData.auditLogById.createdAt).format(
                        "MMM D, YYYY · HH:mm:ss",
                      ),
                      icon: Clock,
                    },
                    {
                      label: "Target",
                      val:
                        logDetailsData.auditLogById.resourceId ||
                        logDetailsData.auditLogById.targetUserId ||
                        "System",
                      icon: Fingerprint,
                      mono: true,
                    },
                    {
                      label: "Performed By",
                      val: logDetailsData.auditLogById.admin?.firstName
                        ? `${logDetailsData.auditLogById.admin.firstName} ${logDetailsData.auditLogById.admin?.lastName || ""}`
                        : logDetailsData.auditLogById.adminId || "System",
                      icon: User,
                    },
                    {
                      label: "IP Address",
                      val: logDetailsData.auditLogById.ipAddress || "Internal",
                      icon: Activity,
                      mono: true,
                    },
                  ].map((s, i) => (
                    <div key={i} className="space-y-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 ml-1">
                        {s.label}
                      </span>
                      <div className="flex items-center gap-3 px-3.5 py-2.5 bg-zinc-50 rounded-xl border border-zinc-200/60 shadow-sm">
                        <s.icon className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span
                          className={cn(
                            "text-sm font-semibold text-foreground truncate",
                            s.mono && "font-mono text-xs",
                          )}
                        >
                          {s.val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {logDetailsData.auditLogById.reason && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 ml-1">
                      Reason
                    </span>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 shadow-sm text-sm font-medium text-zinc-700 leading-relaxed italic">
                      "{logDetailsData.auditLogById.reason}"
                    </div>
                  </div>
                )}

                {(logDetailsData.auditLogById.previousState ||
                  logDetailsData.auditLogById.newState) && (
                  <div className="pt-8 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {logDetailsData.auditLogById.previousState && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-2 bg-red-50 border border-red-200/50 px-3 py-1.5 w-fit rounded-lg shadow-sm">
                          <ShieldX className="h-3.5 w-3.5" /> Previous State
                        </span>
                        {renderStateFields(
                          logDetailsData.auditLogById.previousState,
                          true,
                        )}
                      </div>
                    )}
                    {logDetailsData.auditLogById.newState && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 px-3 py-1.5 w-fit rounded-lg shadow-sm">
                          <ShieldCheck className="h-3.5 w-3.5" /> New State
                        </span>
                        {renderStateFields(
                          logDetailsData.auditLogById.newState,
                          false,
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="bg-zinc-50/80 p-5 flex items-center justify-end border-t border-border/50 backdrop-blur-sm">
            <Button
              variant="outline"
              className="rounded-xl text-xs font-bold uppercase tracking-widest px-8 shadow-sm h-11"
              onClick={() => setSelectedLogId(null)}
            >
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
