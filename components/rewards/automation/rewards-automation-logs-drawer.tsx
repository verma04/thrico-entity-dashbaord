"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_REWARDS_AUTOMATION_RULE_STATS,
  GET_REWARDS_AUTOMATION_RULE_LOGS,
  RewardsAutomationRuleLog,
  RewardsAutomationRuleStats,
} from "@/graphql/rewards-automation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  RefreshCw,
  AlertTriangle,
  User,
  GitBranch,
  Calendar,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardsAutomationLogsDrawerProps {
  ruleId: string | null;
  ruleName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RewardsAutomationLogsDrawer: React.FC<
  RewardsAutomationLogsDrawerProps
> = ({ ruleId, ruleName, open, onOpenChange }) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery(GET_REWARDS_AUTOMATION_RULE_STATS, {
    variables: { ruleId: ruleId || "" },
    skip: !ruleId || !open,
    fetchPolicy: "cache-and-network",
  });

  const {
    data: logsData,
    loading: logsLoading,
    refetch: refetchLogs,
  } = useQuery(GET_REWARDS_AUTOMATION_RULE_LOGS, {
    variables: {
      ruleId: ruleId || "",
      limit: 50,
    },
    skip: !ruleId || !open,
    fetchPolicy: "cache-and-network",
  });

  const stats: RewardsAutomationRuleStats | undefined =
    statsData?.getRewardsAutomationRuleStats;
  const rawLogs = logsData?.getRewardsAutomationRuleLogs;
  const logs: RewardsAutomationRuleLog[] = Array.isArray(rawLogs)
    ? rawLogs
    : rawLogs?.logs || [];
  const totalLogs = logs.length;

  const handleRefresh = () => {
    refetchStats();
    refetchLogs();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl bg-card border-border p-0 flex flex-col overflow-hidden shadow-2xl">
        {/* Drawer Header */}
        <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-foreground">
                Execution Analytics & Logs
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate max-w-sm">
                {ruleName || "Rule Audit Trail"}
              </SheetDescription>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5",
                (statsLoading || logsLoading) && "animate-spin"
              )}
            />
            Refresh
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-border bg-background space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Total Runs
              </span>
              <h4 className="text-lg font-black text-foreground">
                {stats?.totalRuns ?? (logs.length || 0)}
              </h4>
            </div>

            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Success
              </span>
              <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {stats?.successRuns ??
                  logs.filter((l) => l.status === "SUCCESS").length}
              </h4>
            </div>

            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                Failed
              </span>
              <h4 className="text-lg font-black text-rose-600 dark:text-rose-400">
                {stats?.failedRuns ??
                  logs.filter((l) => l.status === "FAILED").length}
              </h4>
            </div>

            <div className="p-3 rounded-xl border border-border bg-background space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Last Run
              </span>
              <h4 className="text-[11px] font-bold text-foreground truncate mt-1">
                {stats?.lastRunAt
                  ? new Date(stats.lastRunAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : logs[0]?.executedAt
                  ? new Date(logs[0].executedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "None yet"}
              </h4>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
            <span className="text-xs font-bold text-foreground">
              Action Execution History ({totalLogs})
            </span>

            <div className="flex rounded-lg bg-muted p-0.5 text-[10.5px] font-bold">
              {["ALL", "SUCCESS", "FAILED", "SKIPPED"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2 py-0.5 rounded transition-all",
                    statusFilter === st
                      ? "bg-card text-foreground shadow-2xs font-extrabold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Logs List */}
          {logsLoading && logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading execution logs…
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center space-y-2 border border-dashed border-border rounded-xl">
              <Zap className="w-6 h-6 text-muted-foreground mx-auto" />
              <h5 className="text-xs font-bold text-foreground">
                No execution logs recorded yet
              </h5>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                Logs will appear automatically whenever members trigger this automation rule in games or rewards.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const isSuccess = log.status === "SUCCESS";
                const isFailed = log.status === "FAILED";
                const isNoBranch = String(log.branch || "").endsWith("_no");

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-border/80 bg-background hover:border-border transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {isSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : isFailed ? (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}

                        <span className="font-bold text-foreground truncate">
                          {log.actionType}
                        </span>

                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-extrabold px-1.5 py-0 h-4 uppercase",
                            isNoBranch
                              ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          )}
                        >
                          {isNoBranch ? "NO (Else) Track" : "YES Track"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {log.durationMs !== undefined && log.durationMs !== null && (
                          <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {log.durationMs}ms
                          </span>
                        )}

                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-bold px-1.5 py-0 h-4",
                            isSuccess
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : isFailed
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          )}
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Metadata & User info */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-muted-foreground" />
                        {log.userName || log.userEmail || "Anonymous Participant"}
                      </span>

                      <span>
                        {log.executedAt
                          ? new Date(log.executedAt).toLocaleString()
                          : "Just now"}
                      </span>
                    </div>

                    {/* Error trace if failed */}
                    {log.errorMessage && (
                      <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-[10.5px] font-mono text-destructive">
                        {log.errorMessage}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
