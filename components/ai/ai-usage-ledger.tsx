"use client";

import React, { useState, useMemo, useTransition } from "react";
import {
  Search,
  RotateCcw,
  Download,
  Filter,
  Eye,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Bot,
  ShieldAlert,
  Users,
  BarChart3,
  MessageSquare,
  Briefcase,
  FileText,
  Clock,
  Layers,
  Coins,
  Cpu,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  useGetAiUsageHistory,
  AiModuleEnum,
  AiActionEnum,
  AiTokenUsageLog,
  AiTokenUsageFilterInput,
} from "@/graphql/actions/ai";
import { cn } from "@/lib/utils";
import moment from "moment";

// ─── Module Configs & Badges ──────────────────────────────────────────────────

const MODULE_OPTIONS: {
  value: string;
  label: string;
  icon: React.ElementType;
  badgeClass: string;
}[] = [
  {
    value: "ALL",
    label: "All Modules",
    icon: Layers,
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  {
    value: AiModuleEnum.CUSTOMER_360,
    label: "Customer 360",
    icon: Users,
    badgeClass:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    value: AiModuleEnum.MODERATION,
    label: "Content Moderation",
    icon: ShieldAlert,
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  {
    value: AiModuleEnum.AGENT,
    label: "AI Agent",
    icon: Bot,
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  {
    value: AiModuleEnum.ANALYTICS,
    label: "Analytics",
    icon: BarChart3,
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    value: AiModuleEnum.COMMUNITY,
    label: "Community",
    icon: MessageSquare,
    badgeClass:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  {
    value: AiModuleEnum.JOB,
    label: "Jobs & Careers",
    icon: Briefcase,
    badgeClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
  {
    value: AiModuleEnum.CONTENT,
    label: "Content Studio",
    icon: FileText,
    badgeClass:
      "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    value: AiModuleEnum.OTHER,
    label: "Other Operations",
    icon: Sparkles,
    badgeClass:
      "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20",
  },
];

const ACTION_MAP: Record<string, { label: string; module: string }> = {
  [AiActionEnum.CUSTOMER_360_SUMMARY]: {
    label: "Customer 360 Summary",
    module: AiModuleEnum.CUSTOMER_360,
  },
  [AiActionEnum.CHURN_ANALYSIS]: {
    label: "Churn Risk Analysis",
    module: AiModuleEnum.CUSTOMER_360,
  },
  [AiActionEnum.COHORT_ANALYSIS]: {
    label: "Cohort Retention Analysis",
    module: AiModuleEnum.CUSTOMER_360,
  },
  [AiActionEnum.MODERATE_POST]: {
    label: "Post Moderation",
    module: AiModuleEnum.MODERATION,
  },
  [AiActionEnum.MODERATE_COMMENT]: {
    label: "Comment Moderation",
    module: AiModuleEnum.MODERATION,
  },
  [AiActionEnum.MODERATE_USER]: {
    label: "User Profile Moderation",
    module: AiModuleEnum.MODERATION,
  },
  [AiActionEnum.MODERATE_CONTENT]: {
    label: "Generic Content Moderation",
    module: AiModuleEnum.MODERATION,
  },
  [AiActionEnum.AGENT_CHAT]: {
    label: "Agent Interactive Chat",
    module: AiModuleEnum.AGENT,
  },
  [AiActionEnum.COMMUNITY_AGENT]: {
    label: "Community Copilot",
    module: AiModuleEnum.AGENT,
  },
  [AiActionEnum.JOB_AGENT]: {
    label: "Job Assistant",
    module: AiModuleEnum.AGENT,
  },
  [AiActionEnum.SUPERVISOR_ROUTING]: {
    label: "Supervisor Routing",
    module: AiModuleEnum.AGENT,
  },
  [AiActionEnum.GENERATE_CONTENT]: {
    label: "Generate Content",
    module: AiModuleEnum.CONTENT,
  },
  [AiActionEnum.GENERATE_BIO]: {
    label: "Generate Bio",
    module: AiModuleEnum.CONTENT,
  },
  [AiActionEnum.SEARCH_EXPANSION]: {
    label: "Search Expansion",
    module: AiModuleEnum.CONTENT,
  },
  [AiActionEnum.EMBEDDING]: {
    label: "Vector Embedding",
    module: AiModuleEnum.CONTENT,
  },
  [AiActionEnum.OTHER]: {
    label: "Miscellaneous Operation",
    module: AiModuleEnum.OTHER,
  },
};

const DATE_PRESETS = [
  { id: "ALL", label: "All Time", days: null },
  { id: "TODAY", label: "Today", days: 0 },
  { id: "7D", label: "Last 7 Days", days: 7 },
  { id: "30D", label: "Last 30 Days", days: 30 },
  { id: "THIS_MONTH", label: "This Month", days: "month" },
];

export interface AiUsageLedgerProps {
  initialModule?: string;
  initialAction?: string;
  className?: string;
  onRefreshParent?: () => void;
}

export function AiUsageLedger({
  initialModule,
  initialAction,
  className,
  onRefreshParent,
}: AiUsageLedgerProps) {
  // ─── Filter States ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>(
    initialModule || "ALL"
  );
  const [selectedAction, setSelectedAction] = useState<string>(
    initialAction || "ALL"
  );
  const [datePreset, setDatePreset] = useState<string>("ALL");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Inspect modal state
  const [selectedLog, setSelectedLog] = useState<AiTokenUsageLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Compute date range based on preset or custom
  const { computedStartDate, computedEndDate } = useMemo(() => {
    if (datePreset === "TODAY") {
      return {
        computedStartDate: moment().startOf("day").toISOString(),
        computedEndDate: moment().endOf("day").toISOString(),
      };
    }
    if (datePreset === "7D") {
      return {
        computedStartDate: moment().subtract(7, "days").startOf("day").toISOString(),
        computedEndDate: moment().endOf("day").toISOString(),
      };
    }
    if (datePreset === "30D") {
      return {
        computedStartDate: moment().subtract(30, "days").startOf("day").toISOString(),
        computedEndDate: moment().endOf("day").toISOString(),
      };
    }
    if (datePreset === "THIS_MONTH") {
      return {
        computedStartDate: moment().startOf("month").toISOString(),
        computedEndDate: moment().endOf("month").toISOString(),
      };
    }
    if (datePreset === "CUSTOM") {
      return {
        computedStartDate: customStartDate
          ? moment(customStartDate).startOf("day").toISOString()
          : undefined,
        computedEndDate: customEndDate
          ? moment(customEndDate).endOf("day").toISOString()
          : undefined,
      };
    }
    return { computedStartDate: undefined, computedEndDate: undefined };
  }, [datePreset, customStartDate, customEndDate]);

  // Build query input
  const queryInput: AiTokenUsageFilterInput = useMemo(() => {
    const input: AiTokenUsageFilterInput = {
      page,
      limit,
    };

    if (selectedModule && selectedModule !== "ALL") {
      input.module = selectedModule;
      input.moduleEnum = selectedModule as AiModuleEnum;
    }

    if (selectedAction && selectedAction !== "ALL") {
      input.action = selectedAction;
      input.actionEnum = selectedAction as AiActionEnum;
    }

    if (debouncedSearch) {
      input.search = debouncedSearch;
    }

    if (computedStartDate) {
      input.startDate = computedStartDate;
    }

    if (computedEndDate) {
      input.endDate = computedEndDate;
    }

    return input;
  }, [
    page,
    limit,
    selectedModule,
    selectedAction,
    debouncedSearch,
    computedStartDate,
    computedEndDate,
  ]);

  const { data, loading, refetch } = useGetAiUsageHistory(queryInput);

  const history = data?.getAiUsageHistory;
  const items = history?.items || [];
  const total = history?.total || 0;
  const totalPages = Math.max(1, history?.totalPages || 1);
  const totalTokens = history?.totalTokens || 0;
  const estimatedCostInr = history?.estimatedCostInr || 0;
  const estimatedCostUsd = history?.estimatedCostUsd || 0;

  // Filter actions based on module selection
  const filteredActionOptions = useMemo(() => {
    return Object.entries(ACTION_MAP).filter(([actionKey, meta]) => {
      if (selectedModule === "ALL") return true;
      const modNorm = selectedModule.toLowerCase().replace(/[^a-z0-9]/g, "");
      const metaModNorm = meta.module.toLowerCase().replace(/[^a-z0-9]/g, "");
      return modNorm === metaModNorm;
    });
  }, [selectedModule]);

  const hasActiveFilters =
    debouncedSearch !== "" ||
    selectedModule !== "ALL" ||
    selectedAction !== "ALL" ||
    datePreset !== "ALL" ||
    customStartDate !== "" ||
    customEndDate !== "";

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedModule("ALL");
    setSelectedAction("ALL");
    setDatePreset("ALL");
    setCustomStartDate("");
    setCustomEndDate("");
    setPage(1);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyJson = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleExportCsv = () => {
    if (items.length === 0) return;
    const headers = [
      "ID",
      "Timestamp",
      "Module",
      "Action",
      "Model",
      "Total Tokens",
      "Prompt Tokens",
      "Completion Tokens",
      "Cost INR",
      "Cost USD",
      "Reference ID",
      "Description",
    ];
    const csvRows = [
      headers.join(","),
      ...items.map((row) =>
        [
          `"${row.id}"`,
          `"${row.createdAt}"`,
          `"${row.module}"`,
          `"${row.action || ""}"`,
          `"${row.model}"`,
          row.tokens,
          row.promptTokens || 0,
          row.completionTokens || 0,
          row.costInr,
          row.costUsd,
          `"${row.referenceId || ""}"`,
          `"${(row.description || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ai-usage-ledger-${moment().format("YYYY-MM-DD-HHmmss")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format module badge
  const getModuleConfig = (mod: string) => {
    const clean = mod?.toUpperCase() || "OTHER";
    return (
      MODULE_OPTIONS.find((m) => m.value === clean) || {
        value: clean,
        label: mod,
        icon: Sparkles,
        badgeClass:
          "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20",
      }
    );
  };

  // Format action label
  const formatActionName = (action?: string) => {
    if (!action) return "Unspecified Operation";
    if (ACTION_MAP[action]) return ACTION_MAP[action].label;
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* ─── Filter & Control Header ────────────────────────────────────────── */}
      <Card className="border-border/60 bg-card shadow-2xs">
        <CardContent className="p-4 space-y-3">
          {/* Top Row: Search & Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter by description, ref ID, action, or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs bg-muted/30 rounded-lg border-border"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Selectors Group */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Module Filter */}
              <Select
                value={selectedModule}
                onValueChange={(val) => {
                  setSelectedModule(val);
                  setSelectedAction("ALL");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 min-w-[150px] text-xs rounded-lg border-border bg-background">
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="h-3 w-3 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="All Modules" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg text-xs">
                  {MODULE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Action Filter */}
              <Select
                value={selectedAction}
                onValueChange={(val) => {
                  setSelectedAction(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 min-w-[160px] text-xs rounded-lg border-border bg-background">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent className="rounded-lg text-xs max-h-60">
                  <SelectItem value="ALL" className="text-xs font-semibold">
                    All Operations
                  </SelectItem>
                  {filteredActionOptions.map(([key, meta]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Presets Dropdown */}
              <Select
                value={datePreset}
                onValueChange={(val) => {
                  setDatePreset(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 min-w-[130px] text-xs rounded-lg border-border bg-background">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Date Range" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg text-xs">
                  {DATE_PRESETS.map((preset) => (
                    <SelectItem
                      key={preset.id}
                      value={preset.id}
                      className="text-xs"
                    >
                      {preset.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="CUSTOM" className="text-xs">
                    Custom Range...
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  refetch();
                  if (onRefreshParent) onRefreshParent();
                }}
                className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg"
                title="Refresh Ledger"
              >
                <RotateCcw
                  className={cn("h-3.5 w-3.5", loading && "animate-spin")}
                />
              </Button>

              {/* Export CSV Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                disabled={items.length === 0}
                className="h-9 text-xs gap-1.5 rounded-lg border-border"
                title="Export Filtered Logs to CSV"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>

          {/* Custom Date Range Row (If selected) */}
          {datePreset === "CUSTOM" && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs flex-wrap">
              <span className="text-muted-foreground font-medium">
                From:
              </span>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  setPage(1);
                }}
                className="h-8 w-36 text-xs bg-muted/30 rounded-lg"
              />
              <span className="text-muted-foreground font-medium">To:</span>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  setPage(1);
                }}
                className="h-8 w-36 text-xs bg-muted/30 rounded-lg"
              />
            </div>
          )}

          {/* Active Filter Chips & Reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-border/40 flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Active Filters:
                </span>
                {debouncedSearch && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 gap-1 font-normal"
                  >
                    Search: &ldquo;{debouncedSearch}&rdquo;
                  </Badge>
                )}
                {selectedModule !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 gap-1 font-normal"
                  >
                    Module: {getModuleConfig(selectedModule).label}
                  </Badge>
                )}
                {selectedAction !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 gap-1 font-normal"
                  >
                    Action: {formatActionName(selectedAction)}
                  </Badge>
                )}
                {datePreset !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 gap-1 font-normal"
                  >
                    Range:{" "}
                    {datePreset === "CUSTOM"
                      ? `${customStartDate || "Start"} to ${
                          customEndDate || "Now"
                        }`
                      : DATE_PRESETS.find((p) => p.id === datePreset)?.label}
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-6 text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 rounded"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Summary Metrics Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/60 bg-card/60 shadow-2xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-indigo-500" />
              Filtered Incurred Tokens
            </span>
            {loading ? (
              <Skeleton className="h-6 w-24 rounded" />
            ) : (
              <p className="text-xl font-black text-foreground tabular-nums tracking-tight">
                {totalTokens.toLocaleString()}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground block">
              Inference across filtered query
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-2xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Estimated Spend (INR)
            </span>
            {loading ? (
              <Skeleton className="h-6 w-20 rounded" />
            ) : (
              <p className="text-xl font-black text-foreground tabular-nums tracking-tight">
                ₹{estimatedCostInr.toFixed(3)}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground block">
              Estimated local currency
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-2xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-500" />
              Estimated Spend (USD)
            </span>
            {loading ? (
              <Skeleton className="h-6 w-20 rounded" />
            ) : (
              <p className="text-xl font-black text-foreground tabular-nums tracking-tight">
                ${estimatedCostUsd.toFixed(4)}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground block">
              Standard compute billing basis
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-2xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-500" />
              Operations Executed
            </span>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded" />
            ) : (
              <p className="text-xl font-black text-foreground tabular-nums tracking-tight">
                {total.toLocaleString()}
              </p>
            )}
            <span className="text-[10px] text-muted-foreground block">
              Logged deduction events
            </span>
          </CardContent>
        </Card>
      </div>

      {/* ─── Ledger Data Table ────────────────────────────────────────────── */}
      <Card className="border-border/60 bg-card overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-3 border-b border-border/40"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground shadow-2xs">
              <Coins className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                No token deduction records found
              </h4>
              <p className="text-xs text-muted-foreground">
                {hasActiveFilters
                  ? "No AI compute executions match the selected filter criteria. Try resetting filters or broadening the date range."
                  : "No AI operations have consumed inference tokens yet. As agents, moderation, or Customer 360 summaries execute, records will populate here in real-time."}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 text-xs font-semibold rounded-lg mt-2"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold tracking-wider border-b border-border select-none">
                <tr>
                  <th className="py-3 px-4 min-w-[150px]">Date & Time</th>
                  <th className="py-3 px-4 min-w-[200px]">Module & Operation</th>
                  <th className="py-3 px-4 min-w-[140px]">Model</th>
                  <th className="py-3 px-4 min-w-[160px]">Tokens Deducted</th>
                  <th className="py-3 px-4 min-w-[110px]">Cost</th>
                  <th className="py-3 px-4 min-w-[130px]">Reference</th>
                  <th className="py-3 px-4 text-right w-[60px]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {items.map((log) => {
                  const modConfig = getModuleConfig(log.module);
                  const ModIcon = modConfig.icon;
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/25 transition-colors group"
                    >
                      {/* 1. Date & Time */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground text-[12px] tabular-nums">
                            {moment(log.createdAt).format("MMM D, YYYY")}
                          </span>
                          <span className="text-[10px] text-muted-foreground tabular-nums flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {moment(log.createdAt).format("HH:mm:ss")}
                            <span className="text-border">•</span>
                            <span>{moment(log.createdAt).fromNow()}</span>
                          </span>
                        </div>
                      </td>

                      {/* 2. Module & Operation */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col gap-1 min-w-0 max-w-[280px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                modConfig.badgeClass
                              )}
                            >
                              <ModIcon className="h-2.5 w-2.5" />
                              {modConfig.label}
                            </span>
                          </div>
                          <p className="text-[12px] font-bold text-foreground leading-tight truncate">
                            {formatActionName(log.action)}
                          </p>
                          {log.description && (
                            <p
                              className="text-[10px] text-muted-foreground leading-tight truncate"
                              title={log.description}
                            >
                              {log.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 3. Model */}
                      <td className="py-3 px-4 align-middle">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-muted/60 text-foreground border border-border/60">
                          <Cpu className="h-3 w-3 text-muted-foreground" />
                          {log.model || "default"}
                        </span>
                      </td>

                      {/* 4. Tokens Deducted & Breakdown */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-[13px] text-indigo-600 dark:text-indigo-400 tabular-nums">
                            - {log.tokens.toLocaleString()}{" "}
                            <span className="text-[10px] font-normal text-muted-foreground">
                              tokens
                            </span>
                          </span>
                          {(log.promptTokens !== undefined ||
                            log.completionTokens !== undefined) && (
                            <span className="text-[9.5px] text-muted-foreground font-mono tabular-nums">
                              P: {(log.promptTokens || 0).toLocaleString()} · C:{" "}
                              {(log.completionTokens || 0).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Cost */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-foreground text-[12px] tabular-nums">
                            ₹{(log.costInr || 0).toFixed(4)}
                          </span>
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            ${(log.costUsd || 0).toFixed(5)}
                          </span>
                        </div>
                      </td>

                      {/* 6. Reference ID */}
                      <td className="py-3 px-4 align-middle">
                        {log.referenceId ? (
                          <div className="inline-flex items-center gap-1 bg-muted/40 hover:bg-muted/70 px-2 py-0.5 rounded border border-border/60 transition-colors">
                            <span
                              className="font-mono text-[10px] text-foreground truncate max-w-[90px]"
                              title={log.referenceId}
                            >
                              {log.referenceId}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(log.referenceId!, `ref-${log.id}`)
                              }
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy Reference ID"
                            >
                              {copiedId === `ref-${log.id}` ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60">
                            —
                          </span>
                        )}
                      </td>

                      {/* 7. Details */}
                      <td className="py-3 px-4 align-middle text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                          title="Inspect Execution Telemetry"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Pagination Footer ────────────────────────────────────────────── */}
        {total > 0 && (
          <div className="p-3 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
              <span>
                Showing{" "}
                <strong className="text-foreground font-semibold">
                  {(page - 1) * limit + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground font-semibold">
                  {Math.min(page * limit, total)}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground font-semibold">
                  {total.toLocaleString()}
                </strong>{" "}
                deductions
              </span>

              <span className="text-border">•</span>

              <div className="flex items-center gap-1">
                <span>Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-transparent border border-border rounded px-1.5 py-0.5 text-[11px] text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="h-7 px-2 text-xs rounded-md border-border gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Prev</span>
              </Button>

              <span className="px-2 text-xs font-medium tabular-nums text-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="h-7 px-2 text-xs rounded-md border-border gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ─── Detailed Log Inspector Modal ─────────────────────────────────── */}
      <Dialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="sm:max-w-[650px] rounded-2xl p-0 overflow-hidden border-border shadow-2xl">
          {selectedLog && (
            <>
              <DialogHeader className="bg-muted/40 border-b border-border/60 p-6 flex flex-row items-center gap-4">
                <div className="h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background border border-border flex text-indigo-600 dark:text-indigo-400 shadow-2xs">
                  <Coins className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-base font-bold text-foreground truncate">
                      {formatActionName(selectedLog.action)}
                    </DialogTitle>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase",
                        getModuleConfig(selectedLog.module).badgeClass
                      )}
                    >
                      {selectedLog.module}
                    </span>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground truncate">
                    Record ID: {selectedLog.id}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Primary Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Total Tokens
                    </span>
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {selectedLog.tokens.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Prompt Tokens
                    </span>
                    <p className="text-lg font-bold text-foreground font-mono">
                      {(selectedLog.promptTokens || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Completion Tokens
                    </span>
                    <p className="text-lg font-bold text-foreground font-mono">
                      {(selectedLog.completionTokens || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Model / Engine
                    </span>
                    <p className="text-sm font-bold text-foreground font-mono truncate">
                      {selectedLog.model}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Cost (INR)
                    </span>
                    <p className="text-sm font-bold text-foreground font-mono">
                      ₹{(selectedLog.costInr || 0).toFixed(5)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Cost (USD)
                    </span>
                    <p className="text-sm font-bold text-foreground font-mono">
                      ${(selectedLog.costUsd || 0).toFixed(6)}
                    </p>
                  </div>
                </div>

                {/* Information rows */}
                <div className="space-y-2 border-t border-border/50 pt-4 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="font-medium text-foreground tabular-nums">
                      {moment(selectedLog.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}{" "}
                      ({moment(selectedLog.createdAt).fromNow()})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Entity ID:</span>
                    <span className="font-mono text-foreground">
                      {selectedLog.entityId}
                    </span>
                  </div>

                  {selectedLog.referenceId && (
                    <div className="flex items-center justify-between py-1 border-b border-border/30">
                      <span className="text-muted-foreground">
                        Reference ID:
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-foreground">
                        <span>{selectedLog.referenceId}</span>
                        <button
                          onClick={() =>
                            handleCopy(selectedLog.referenceId!, "modal-ref")
                          }
                          className="text-muted-foreground hover:text-foreground"
                          title="Copy reference ID"
                        >
                          {copiedId === "modal-ref" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedLog.description && (
                    <div className="py-2 space-y-1 border-b border-border/30">
                      <span className="text-muted-foreground block">
                        Description / Prompt Summary:
                      </span>
                      <p className="text-foreground bg-muted/30 p-2.5 rounded-lg text-xs leading-relaxed">
                        {selectedLog.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Metadata JSON Viewer */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Execution Metadata & Parameters
                    </span>
                    {selectedLog.metadata && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyJson(selectedLog.metadata)}
                        className="h-6 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
                      >
                        {copiedJson ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy JSON
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {selectedLog.metadata &&
                  Object.keys(selectedLog.metadata).length > 0 ? (
                    <div className="rounded-xl border border-border/60 bg-zinc-950 p-3.5 text-zinc-100 overflow-x-auto max-h-56">
                      <pre className="text-[11px] font-mono leading-relaxed">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic bg-muted/20 p-3 rounded-lg border border-border/40">
                      No additional JSON metadata attached to this execution record.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
