"use client";

import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  RotateCcw,
  Filter,
  History,
  Search,
  Clock,
  User,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAuditLogs,
  useGetAuditLogModules,
  useGetAuditLogById,
} from "@/graphql/actions/audit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemStatusIndicator,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import moment from "moment";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { data: logDetailsData, loading: logDetailsLoading } = useGetAuditLogById(
    { auditLogByIdId: selectedLogId || "" },
    { skip: !selectedLogId, fetchPolicy: "network-only" }
  );

  const queryModule = selectedModule === "ALL" ? undefined : selectedModule;

  const {
    data: logData,
    loading: logLoading,
    refetch,
  } = useGetAuditLogs({
    pagination: { page, limit: 12 },
    module: queryModule,
  });

  const { data: moduleData } = useGetAuditLogModules();

  const modules = moduleData?.auditLogModules || [];
  const logs = logData?.auditLogs?.data || [];
  const meta = logData?.auditLogs?.meta || { totalItems: 0, totalPages: 0 };

  const kpis = [
    {
      title: "Recent Actions",
      value: meta.totalItems ?? "0",
      icon: Terminal,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Protocols",
      value: modules.length ?? "0",
      icon: History,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Persistence",
      value: "Enabled",
      icon: ShieldCheck,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
  ];

  const renderStateFields = (statePayload: any, isRed: boolean) => {
    let parsedState = statePayload;
    if (!parsedState) return <span className="text-xs text-slate-500 italic block mt-2">No state data</span>;

    if (typeof parsedState === "string") {
      try {
        parsedState = JSON.parse(parsedState);
      } catch {
        return <span className="text-xs text-slate-700 break-all block mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">{parsedState}</span>;
      }
    }

    if (typeof parsedState !== "object" || parsedState === null) {
      return <span className="text-xs text-slate-700 break-all block mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">{String(parsedState)}</span>;
    }

    return (
      <div className="grid grid-cols-1 gap-2 mt-3 w-full pr-1 overflow-x-hidden">
        {Object.entries(parsedState).map(([key, value]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          let displayVal = value;
          
          if (typeof value === "boolean") {
            displayVal = value ? "True" : "False";
          } else if (typeof value === "object" && value !== null) {
            displayVal = JSON.stringify(value);
          } else if (value === null || value === undefined || value === "") {
            displayVal = "—";
          }

          return (
            <div key={key} className={cn("flex flex-col gap-1 p-2.5 rounded-xl border", isRed ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100")}>
              <span className={cn("text-[9px] font-bold uppercase tracking-widest", isRed ? "text-red-400" : "text-emerald-500")}>{label}</span>
              <span className={cn("text-xs font-semibold truncate", isRed ? "text-red-900" : "text-emerald-900", displayVal === "—" && "opacity-50")} title={String(displayVal)}>
                {String(displayVal)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Audit logs"
        badgeText="Immutable Trace"
        description="Review system-level administrative actions, security modifications, and protocol executions across the network nodes."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Log Stream: Active"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Audit Stream</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={selectedModule}
              onValueChange={(val) => {
                setSelectedModule(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-[220px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm">
                <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                <SelectValue placeholder="Select Module" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                <SelectItem
                  value="ALL"
                  className="font-bold uppercase text-[10px]"
                >
                  All System Modules
                </SelectItem>
                {modules.map((mod) => (
                  <SelectItem
                    key={mod}
                    value={mod}
                    className="font-bold uppercase text-[10px]"
                  >
                    {mod} Trace
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all bg-white border-slate-200"
              onClick={() => refetch()}
            >
              <RotateCcw
                className={cn("h-4 w-4", logLoading && "animate-spin")}
              />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Integrity" />
          ))}
        </div>

        <EcosystemCard
          title="Sequence Manifest"
          description="Chronological record of administrative protocols"
          icon={Terminal}
          decorationIcon={Zap}
        >
          {logLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Hydrating manifest nodes...
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="inline-flex p-4 rounded-3xl bg-slate-50 border border-slate-100 mb-4 text-slate-300">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Empty Flux
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-10">
                No audit records detected within this module parameter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log?.id}
                  onClick={() => setSelectedLogId(log?.id)}
                  className="cursor-pointer group relative flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                          {log?.action}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          <span>{log?.module || "SYSTEM"}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {moment(log.createdAt).format(
                              "MMM dd, yyyy · HH:mm:ss",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase text-slate-600">
                        <User className="h-3 w-3 text-slate-400" />
                        {log?.admin?.firstName || log?.adminId || "System"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Target Resource
                      </span>
                      <span className="text-xs font-medium text-slate-700 font-mono truncate">
                        {log?.resourceId || log?.targetUserId || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Network Info
                      </span>
                      <span className="text-xs font-medium text-slate-700 font-mono truncate">
                        {log?.ipAddress || "Unknown IP"}
                      </span>
                    </div>
                    {(log?.reason || log?.userAgent) && (
                      <div className="col-span-2 flex flex-col gap-1 border-t border-slate-200 mt-2 pt-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {log?.reason ? "Protocol Reason" : "User Agent"}
                        </span>
                        <span className="text-xs text-slate-600 leading-relaxed">
                          {log?.reason || log?.userAgent}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {meta.totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    className="px-6 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-2 px-4 bg-slate-50 rounded-lg border border-slate-100 italic">
                    Node {page} <span className="mx-1 text-slate-300">/</span>{" "}
                    {meta.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    className="px-6 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page === meta.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </EcosystemCard>
      </EcosystemContainer>

      <Dialog open={!!selectedLogId} onOpenChange={(open) => !open && setSelectedLogId(null)}>
        <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden border-slate-100">
          <DialogHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-sm">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Audit Manifest Detail
              </DialogTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                System Level Sequence Details
              </p>
            </div>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-slate-200">
            {logDetailsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting payload...</p>
              </div>
            ) : logDetailsData?.auditLogById ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Action Type</span>
                    <p className="text-sm font-semibold text-slate-900 border border-slate-100 bg-slate-50 p-2 rounded-lg">{logDetailsData.auditLogById.action}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Module</span>
                    <p className="text-sm font-semibold text-slate-900 border border-slate-100 bg-slate-50 p-2 rounded-lg">{logDetailsData.auditLogById.module || "SYSTEM"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timestamp</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2 border border-slate-100 bg-slate-50 p-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {moment(logDetailsData.auditLogById.createdAt).format("MMM DD, YYYY · HH:mm:ss")}
                    </p>
                  </div>
                  <div className="space-y-1.5 col-span-2 lg:col-span-1 border border-slate-100 bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Resource</span>
                    <p className="font-semibold text-slate-900 font-mono text-xs truncate" title={logDetailsData.auditLogById.resourceId || logDetailsData.auditLogById.targetUserId || "N/A"}>
                      {logDetailsData.auditLogById.resourceId || logDetailsData.auditLogById.targetUserId || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1.5 col-span-2 lg:col-span-1 border border-slate-100 bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Authorizing Entity</span>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2 truncate">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {logDetailsData.auditLogById.admin?.firstName ? `${logDetailsData.auditLogById.admin.firstName} ${logDetailsData.auditLogById.admin?.lastName || ""}` : logDetailsData.auditLogById.adminId || "System"}
                    </p>
                  </div>
                  <div className="space-y-1.5 col-span-2 lg:col-span-1 border border-slate-100 bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Network Info</span>
                    <p className="font-semibold text-slate-900 font-mono text-xs truncate">
                      {logDetailsData.auditLogById.ipAddress || logDetailsData.auditLogById.userAgent || "Unknown"}
                    </p>
                  </div>
                </div>

                {logDetailsData.auditLogById.reason && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 bg-slate-50 px-2.5 py-1 rounded-lg">Protocol Reason / Origin</span>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                      {logDetailsData.auditLogById.reason}
                    </p>
                  </div>
                )}

                {(logDetailsData.auditLogById.previousState || logDetailsData.auditLogById.newState) && (
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {logDetailsData.auditLogById.previousState && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-2 bg-red-50 border border-red-100 px-2.5 py-1 w-fit rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Previous State
                        </span>
                        {renderStateFields(logDetailsData.auditLogById.previousState, true)}
                      </div>
                    )}
                    {logDetailsData.auditLogById.newState && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-2.5 py-1 w-fit rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> New State
                        </span>
                        {renderStateFields(logDetailsData.auditLogById.newState, false)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 uppercase tracking-widest text-[10px] font-bold">
                Failed to decrypt payload
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
