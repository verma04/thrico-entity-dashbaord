import React, { useState } from "react";
import {
  History,
  Clock,
  User,
  Terminal,
  Globe,
  Activity,
  Eye,
  RotateCcw,
  Fingerprint,
  ShieldX,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAuditLogs, useGetAuditLogById } from "@/graphql/actions/audit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { cn } from "@/lib/utils";
import moment from "moment";

export interface ModuleAuditLogProps {
  moduleKey: string;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
  tableSize?: "sm" | "md";
}

export function ModuleAuditLog({
  moduleKey,
  title,
  description,
  breadcrumbs,
  tableSize,
}: ModuleAuditLogProps) {
  const [page, setPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { dateRange, handleDateChange } = useUrlDateRange(7);
  
  // Use debounced search to avoid too many requests
  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    module: moduleKey,
    search: debouncedSearch || undefined,
    startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
    endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
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
          <span className="text-[11px] font-mono text-zinc-700 break-all block mt-2 p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
            {parsedState}
          </span>
        );
      }
    }

    if (typeof parsedState !== "object" || parsedState === null) {
      return (
        <span className="text-[11px] font-mono text-zinc-700 break-all block mt-2 p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
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
                "flex flex-col gap-1 p-2.5 rounded-xl border",
                isRed
                  ? "bg-red-50/50 border-red-100"
                  : "bg-emerald-50/50 border-emerald-100",
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-medium uppercase tracking-widest",
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
            <span className="text-sm text-foreground">
              {moment(log.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 ml-5.5 tabular-nums">
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
          <div className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
            <Terminal className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {log.action}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex h-4 items-center px-1.5 rounded-md text-[8px] font-medium uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200/50">
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
          <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground leading-none">
              {log?.admin?.firstName
                ? `${log.admin.firstName} ${log.admin?.lastName || ""}`
                : "System"}
            </span>
            <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-tighter">
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
          <span className="font-mono text-[11px] text-zinc-500 truncate max-w-[140px] bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-200/50">
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
    <EcosystemWrapper>
      <EcosystemHeader
        title={title}
        badgeText="History"
        description={description}
        icon={History}
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-zinc-400 hover:text-foreground rounded-xl transition-all bg-white border-zinc-200 shadow-sm"
                onClick={() => refetch()}
              >
                <RotateCcw
                  className={cn("h-4 w-4", logLoading && "animate-spin")}
                />
              </Button>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-card border border-border rounded-lg text-[10px] uppercase font-bold tracking-wider text-muted-foreground whitespace-nowrap shadow-sm h-9">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    logs.length > 0
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-muted-foreground/30",
                  )}
                />
                {meta.totalItems} Records
              </div>
            </div>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-md">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, rule, or action..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden border border-zinc-200 shadow-sm rounded-xl bg-white mt-4">
        <div className="px-0 py-0">
          <AdminTable
            columns={columns}
            data={logs}
            loading={logLoading}
            keyExtractor={(log) => log.id}
            size={tableSize}
            emptyTitle="No logs found"
            emptyDescription="No activity has been recorded yet."
            pagination={{
              pageIndex: page - 1,
              pageSize: 12,
              pageCount: meta.totalPages,
              onPageChange: (i) => setPage(i + 1),
            }}
          />
        </div>
      </EcosystemContainer>

      <Dialog
        open={!!selectedLogId}
        onOpenChange={(open) => !open && setSelectedLogId(null)}
      >
        <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden border-border shadow-2xl">
          <DialogHeader className="bg-zinc-50 border-b border-border/50 p-6 flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-border text-zinc-900 shadow-sm">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Log Details
              </DialogTitle>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                ID: {selectedLogId}
              </p>
            </div>
          </DialogHeader>

          <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
            {logDetailsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <RotateCcw className="h-6 w-6 animate-spin text-zinc-300" />
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  Loading...
                </p>
              </div>
            ) : logDetailsData?.auditLogById ? (
              <div className="space-y-6">
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
                    <div key={i} className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 ml-0.5">
                        {s.label}
                      </span>
                      <div className="flex items-center gap-2.5 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200/50">
                        <s.icon className="h-3.5 w-3.5 text-zinc-400" />
                        <span
                          className={cn(
                            "text-xs font-medium text-foreground truncate",
                            s.mono && "font-mono",
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
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 ml-0.5">
                      Reason
                    </span>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/50 text-sm font-normal text-zinc-600 leading-relaxed italic">
                      {logDetailsData.auditLogById.reason}
                    </div>
                  </div>
                )}

                {(logDetailsData.auditLogById.previousState ||
                  logDetailsData.auditLogById.newState) && (
                  <div className="pt-6 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {logDetailsData.auditLogById.previousState && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-red-600 flex items-center gap-2 bg-red-50 border border-red-100/50 px-2.5 py-1 w-fit rounded-lg">
                          <ShieldX className="h-3 w-3" /> Previous State
                        </span>
                        {renderStateFields(
                          logDetailsData.auditLogById.previousState,
                          true,
                        )}
                      </div>
                    )}
                    {logDetailsData.auditLogById.newState && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-600 flex items-center gap-2 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 w-fit rounded-lg">
                          <ShieldCheck className="h-3 w-3" /> New State
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

          <div className="bg-zinc-50 p-6 flex items-center justify-end border-t border-border/50">
            <Button
              variant="ghost"
              className="rounded-xl text-xs uppercase tracking-widest px-8"
              onClick={() => setSelectedLogId(null)}
            >
              Close
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
    </EcosystemWrapper>
  );
}
