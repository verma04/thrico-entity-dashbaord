"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  Terminal,
  User,
  Eye,
  Activity,
  RotateCcw,
  Globe,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Upload,
  Tag,
  Layers,
  ArrowRight,
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
import { Badge } from "@/components/ui/badge";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { cn } from "@/lib/utils";
import moment from "moment";
import { useModuleStore } from "@/store/useModuleStore";
import { toast } from "sonner";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

export default function OfferAuditLogPage() {
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";
  const params = useParams();
  const id = params?.id as string;
  const [page, setPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { data: logDetailsData, loading: logDetailsLoading } =
    useGetAuditLogById(
      { auditLogByIdId: selectedLogId || "" },
      { skip: !selectedLogId, fetchPolicy: "network-only" }
    );

  const {
    data: logData,
    loading: logLoading,
    refetch,
  } = useGetAuditLogs({
    pagination: { page, limit: 15 },
    resourceId: id,
    module: "OFFERS",
  });

  const logs = logData?.auditLogs?.data || [];
  const meta = logData?.auditLogs?.meta || { totalItems: 0, totalPages: 0 };

  const handleExportLogs = () => {
    if (logs.length === 0) {
      toast.error("No audit logs to export");
      return;
    }

    const csv = buildCsv(logs, [
      { header: "Log ID", getValue: (l: any) => l.id },
      { header: "Action", getValue: (l: any) => l.action },
      { header: "Module", getValue: (l: any) => l.module || "OFFERS" },
      {
        header: "Admin",
        getValue: (l: any) =>
          l.admin
            ? `${l.admin.firstName || ""} ${l.admin.lastName || ""}`.trim()
            : "System",
      },
      { header: "IP Address", getValue: (l: any) => l.ipAddress || "Internal" },
      {
        header: "Target ID",
        getValue: (l: any) => l.resourceId || l.targetUserId || id,
      },
      {
        header: "Timestamp",
        getValue: (l: any) =>
          moment(l.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);

    downloadCsv(csv, `offer-audit-${moment().format("YYYY-MM-DD")}`);
    toast.success(`Exported ${logs.length} audit records`);
  };

  const renderStateFields = (statePayload: any, isRed: boolean) => {
    let parsedState = statePayload;
    if (!parsedState)
      return (
        <span className="text-xs text-muted-foreground italic block mt-2">
          No state recorded
        </span>
      );

    if (typeof parsedState === "string") {
      try {
        parsedState = JSON.parse(parsedState);
      } catch {
        return (
          <span className="text-[11px] font-mono text-foreground break-all block mt-2 p-3 bg-muted/40 border border-border/60 rounded-xl shadow-xs">
            {parsedState}
          </span>
        );
      }
    }

    if (typeof parsedState !== "object" || parsedState === null) {
      return (
        <span className="text-[11px] font-mono text-foreground break-all block mt-2 p-3 bg-muted/40 border border-border/60 rounded-xl shadow-xs">
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
                "flex flex-col gap-1 p-2.5 rounded-lg border shadow-2xs",
                isRed
                  ? "bg-red-50/40 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/40"
                  : "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/40"
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider",
                  isRed
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold truncate",
                  isRed
                    ? "text-red-950 dark:text-red-200"
                    : "text-emerald-950 dark:text-emerald-200",
                  displayVal === "—" && "opacity-40"
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
      header: "Timestamp",
      cell: (log: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {moment(log.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground ml-4.5 tabular-nums font-mono">
            {moment(log.createdAt).format("HH:mm:ss")}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action / Event",
      cell: (log: any) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-muted border border-border/60 flex items-center justify-center shrink-0 shadow-2xs">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">
              {log.action}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border/60">
                {log.module || "OFFERS"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "admin",
      header: "Operator",
      cell: (log: any) => {
        const hasAdmin = !!log?.admin?.firstName;
        return (
          <div className="flex items-center gap-2.5">
            {hasAdmin && log?.admin?.id ? (
              <UserProfileHoverCard user={log.admin}>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-2xs group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-none">
                      {log.admin.firstName} {log.admin?.lastName || ""}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-mono">
                      {log?.ipAddress || "Internal"}
                    </span>
                  </div>
                </div>
              </UserProfileHoverCard>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-muted border border-border/60 flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-foreground leading-none">
                    {hasAdmin
                      ? `${log.admin.firstName} ${log.admin?.lastName || ""}`
                      : "System Automation"}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-mono">
                    {log?.ipAddress || "Internal"}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "target",
      header: "Target Perk",
      cell: (log: any) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-medium text-muted-foreground truncate max-w-[140px] bg-muted/40 px-2 py-0.5 rounded-md border border-border/60 shadow-2xs">
            {log.resourceId || log.targetUserId || id}
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
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-all"
            title="Inspect state details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* ── Subheader Action Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Audit Trail & Operational History
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {meta.totalItems} Recorded Events
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographically recorded mutations, partner redemptions, discount changes, and status adjustments for this {singularName.toLowerCase()}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={logLoading}
            className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
            title="Refresh logs"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", logLoading && "animate-spin text-primary")}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportLogs}
            className="h-8 text-xs font-medium gap-1.5 border-border/60 rounded-lg shadow-2xs hover:bg-muted/60"
          >
            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ── Main Logs Table Container ───────────────────────────────────── */}
      <div className="bg-card rounded-xl border border-border/60 shadow-2xs overflow-hidden">
        <div className="p-1">
          <AdminTable
            columns={columns}
            data={logs}
            loading={logLoading}
            keyExtractor={(log) => log.id}
            emptyTitle="No audit logs found"
            emptyDescription={`No activity has been recorded for this ${singularName.toLowerCase()} yet.`}
            pagination={{
              pageIndex: page - 1,
              pageSize: 15,
              pageCount: meta.totalPages,
              onPageChange: (i) => setPage(i + 1),
            }}
          />
        </div>
      </div>

      {/* ── Detailed State Diff Modal ────────────────────────────────────── */}
      <Dialog
        open={!!selectedLogId}
        onOpenChange={(open) => !open && setSelectedLogId(null)}
      >
        <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden border border-border/60 shadow-2xl">
          <DialogHeader className="bg-muted/30 border-b border-border/60 p-6 flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background border border-border/60 text-foreground shadow-2xs">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <DialogTitle className="text-base font-bold text-foreground tracking-tight">
                Log Event Details
              </DialogTitle>
              <p className="text-[10px] font-mono text-muted-foreground">
                Log ID: {selectedLogId}
              </p>
            </div>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
            {logDetailsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <RotateCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  Fetching state payload…
                </p>
              </div>
            ) : logDetailsData?.auditLogById ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Action",
                      val: logDetailsData.auditLogById.action,
                      icon: Terminal,
                    },
                    {
                      label: "Module",
                      val: logDetailsData.auditLogById.module || "OFFERS",
                      icon: Globe,
                    },
                    {
                      label: "Time",
                      val: moment(logDetailsData.auditLogById.createdAt).format(
                        "MMM D, YYYY · HH:mm:ss"
                      ),
                      icon: Clock,
                    },
                    {
                      label: "Target ID",
                      val:
                        logDetailsData.auditLogById.resourceId ||
                        logDetailsData.auditLogById.targetUserId ||
                        id,
                      icon: Fingerprint,
                      mono: true,
                    },
                    {
                      label: "Performed By",
                      val: logDetailsData.auditLogById.admin?.firstName
                        ? `${logDetailsData.auditLogById.admin.firstName} ${logDetailsData.auditLogById.admin?.lastName || ""}`
                        : logDetailsData.auditLogById.adminId || "System Automation",
                      icon: User,
                    },
                    {
                      label: "IP Address",
                      val: logDetailsData.auditLogById.ipAddress || "Internal",
                      icon: Activity,
                      mono: true,
                    },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </span>
                      <div className="flex items-center gap-2.5 px-3 py-2 bg-muted/30 rounded-lg border border-border/60 shadow-2xs">
                        <s.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span
                          className={cn(
                            "text-xs font-semibold text-foreground truncate",
                            s.mono && "font-mono text-[11px]"
                          )}
                        >
                          {s.val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {logDetailsData.auditLogById.reason && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Administrative Note / Reason
                    </span>
                    <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 shadow-2xs text-xs font-medium text-foreground italic">
                      &ldquo;{logDetailsData.auditLogById.reason}&rdquo;
                    </div>
                  </div>
                )}

                {(logDetailsData.auditLogById.previousState ||
                  logDetailsData.auditLogById.newState) && (
                  <div className="pt-4 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {logDetailsData.auditLogById.previousState && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/50 border border-red-200/50 dark:border-red-900/40 px-2.5 py-1 w-fit rounded-md shadow-2xs">
                          <ShieldAlert className="h-3 w-3" /> Previous State
                        </span>
                        {renderStateFields(
                          logDetailsData.auditLogById.previousState,
                          true
                        )}
                      </div>
                    )}
                    {logDetailsData.auditLogById.newState && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-900/40 px-2.5 py-1 w-fit rounded-md shadow-2xs">
                          <ShieldCheck className="h-3 w-3" /> New State
                        </span>
                        {renderStateFields(
                          logDetailsData.auditLogById.newState,
                          false
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="bg-muted/30 p-4 flex items-center justify-end border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs font-semibold px-6 shadow-2xs h-8"
              onClick={() => setSelectedLogId(null)}
            >
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
