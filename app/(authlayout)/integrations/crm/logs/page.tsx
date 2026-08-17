"use client";

import React, { useState } from "react";
import {
  FileText,
  RefreshCw,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useGetCRMSyncLogs,
  useTriggerCRMSync,
  CRMProvider,
  CRMSyncType,
  CRMSyncStatus,
  CRMSyncLog,
  CRM_PROVIDERS_CONFIG,
} from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CRMSyncLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [viewingLog, setViewingLog] = useState<CRMSyncLog | null>(null);

  const { data, loading, refetch } = useGetCRMSyncLogs({
    provider: selectedProvider !== "ALL" ? (selectedProvider as CRMProvider) : undefined,
    input: { page, limit: 15 },
  });

  const [triggerSync, { loading: syncing }] = useTriggerCRMSync();

  const logs = data?.getCRMSyncLogs?.logs || [];
  const totalCount = data?.getCRMSyncLogs?.totalCount || 0;
  const totalPages = data?.getCRMSyncLogs?.totalPages || 1;

  const handleManualSync = async () => {
    try {
      const targetProvider =
        selectedProvider !== "ALL"
          ? (selectedProvider as CRMProvider)
          : CRMProvider.SALESFORCE;

      const res = await triggerSync({
        variables: {
          provider: targetProvider,
          syncType: CRMSyncType.MANUAL,
          async: true,
        },
      });

      if (res.data?.triggerCRMSync?.success) {
        toast.success(`Triggered sync job (${res.data.triggerCRMSync.syncId || "Queued"})`);
        refetch();
      } else {
        toast.error(res.data?.triggerCRMSync?.message || "Failed to trigger sync");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to trigger sync");
    }
  };

  const renderStatusBadge = (status: CRMSyncStatus) => {
    switch (status) {
      case CRMSyncStatus.SUCCESS:
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
          >
            Success
          </Badge>
        );
      case CRMSyncStatus.PARTIAL_SUCCESS:
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]"
          >
            Partial
          </Badge>
        );
      case CRMSyncStatus.FAILED:
        return (
          <Badge variant="destructive" className="text-[10px]">
            Failed
          </Badge>
        );
      case CRMSyncStatus.IN_PROGRESS:
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] animate-pulse"
          >
            Running
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="CRM Sync Audit Trail"
        description="Chronological log history of automated, incremental, and manual CRM sync jobs with itemized error traces."
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "CRM Hub", href: "/integrations/crm" },
          { label: "Sync Logs" },
        ]}
        icon={FileText}
        badgeText={`${totalCount} Total Jobs`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleManualSync}
              disabled={syncing}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
              {syncing ? "Queueing..." : "Trigger Manual Sync"}
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 shadow-sm text-xs">
            <span className="text-muted-foreground font-medium">Filter by Platform:</span>
            <div className="flex items-center gap-2">
              <Select
                value={selectedProvider}
                onValueChange={(val) => {
                  setSelectedProvider(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs w-[160px] bg-background/60">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Providers</SelectItem>
                  {Object.values(CRMProvider).map((p) => (
                    <SelectItem key={p} value={p}>
                      {CRM_PROVIDERS_CONFIG[p]?.name || p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-medium">
                    <th className="py-3 px-4">Provider / Job ID</th>
                    <th className="py-3 px-4">Sync Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Read</th>
                    <th className="py-3 px-4 text-center">Created</th>
                    <th className="py-3 px-4 text-center">Updated</th>
                    <th className="py-3 px-4 text-center">Failed</th>
                    <th className="py-3 px-4">Started At</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 opacity-50" />
                        Loading sync audit logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-muted-foreground">
                        No synchronization audit logs found for the selected provider.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const pConfig = CRM_PROVIDERS_CONFIG[log.provider];
                      return (
                        <tr key={log.id || log.syncId} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: pConfig?.color || "#555" }}
                              />
                              <div>
                                <span className="font-semibold text-foreground">
                                  {pConfig?.name || log.provider}
                                </span>
                                <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">
                                  {log.syncId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-[10px] font-mono">
                              {log.syncType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{renderStatusBadge(log.status)}</td>
                          <td className="py-3 px-4 text-center font-medium text-foreground">
                            {log.readCount}
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-emerald-600 dark:text-emerald-400">
                            +{log.createdCount}
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-blue-600 dark:text-blue-400">
                            ~{log.updatedCount}
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {log.failedCount > 0 ? (
                              <span className="text-destructive">!{log.failedCount}</span>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-[11px]">
                            {new Date(log.startedAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2 gap-1"
                              onClick={() => setViewingLog(log)}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-3 border-t border-border/40 text-xs text-muted-foreground bg-muted/10">
              <div>
                Showing Page <strong className="text-foreground">{page}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong> ({totalCount} total jobs)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5 gap-1"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5 gap-1"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Log Details Modal */}
      <Dialog open={!!viewingLog} onOpenChange={(open) => !open && setViewingLog(null)}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <DialogTitle className="text-sm">Sync Job Log Details</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Audit execution trace for {viewingLog?.provider} job {viewingLog?.syncId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border text-[11px]">
              <div>
                <span className="text-muted-foreground">Provider:</span>
                <p className="font-semibold text-foreground">{viewingLog?.provider}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Sync Type:</span>
                <p className="font-semibold text-foreground">{viewingLog?.syncType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Started:</span>
                <p className="text-foreground">
                  {viewingLog ? new Date(viewingLog.startedAt).toLocaleString() : ""}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Completed:</span>
                <p className="text-foreground">
                  {viewingLog?.completedAt
                    ? new Date(viewingLog.completedAt).toLocaleString()
                    : "Running / Aborted"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2 rounded bg-muted/30 border">
                <span className="text-muted-foreground">Read</span>
                <p className="font-bold text-foreground">{viewingLog?.readCount}</p>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span>Created</span>
                <p className="font-bold">+{viewingLog?.createdCount}</p>
              </div>
              <div className="p-2 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <span>Updated</span>
                <p className="font-bold">~{viewingLog?.updatedCount}</p>
              </div>
              <div className="p-2 rounded bg-destructive/10 text-destructive border border-destructive/20">
                <span>Failed</span>
                <p className="font-bold">!{viewingLog?.failedCount}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                Raw Execution Log Details
              </p>
              <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[220px] border border-slate-800 leading-relaxed">
                {viewingLog?.details
                  ? typeof viewingLog.details === "string"
                    ? viewingLog.details
                    : JSON.stringify(viewingLog.details, null, 2)
                  : "// No runtime diagnostic errors reported"}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
