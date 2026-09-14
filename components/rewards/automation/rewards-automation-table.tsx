"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  RewardsAutomationRule,
  RewardAutomationModule,
} from "@/graphql/rewards-automation";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Activity,
  GitBranch,
  Zap,
} from "lucide-react";
import { getModuleVisuals } from "./flow/rewards-custom-nodes";
import { cn } from "@/lib/utils";

export const rewardsTableColumns = [
  { key: "priority", header: "Order" },
  { key: "rule", header: "Rule & Module" },
  { key: "trigger", header: "Trigger & Scope" },
  { key: "branches", header: "Branches" },
  { key: "conditions", header: "Target Conditions" },
  { key: "actions", header: "Automated Actions" },
  { key: "status", header: "Status" },
  { key: "executions", header: "Runs" },
  { key: "lastRunAt", header: "Last Run" },
  { key: "actionsMenu", header: "Actions" },
];

interface RewardsAutomationTableProps {
  rules: RewardsAutomationRule[];
  loading?: boolean;
  onEdit: (rule: RewardsAutomationRule) => void;
  onViewLogs: (rule: RewardsAutomationRule) => void;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate?: (rule: RewardsAutomationRule) => void;
  togglingId?: string | null;
  visibleColumns?: Record<string, boolean>;
}

export const RewardsAutomationTable: React.FC<RewardsAutomationTableProps> = ({
  rules,
  loading = false,
  onEdit,
  onViewLogs,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  togglingId,
  visibleColumns = {},
}) => {
  const inferModule = (r: RewardsAutomationRule): RewardAutomationModule => {
    if (r.module) return r.module;
    const trig = r.trigger;
    if (trig.startsWith("SPIN_WHEEL")) return "SPIN_WHEEL";
    if (trig.startsWith("SCRATCH_CARD")) return "SCRATCH_CARD";
    if (trig.startsWith("MATCH_WIN")) return "MATCH_WIN";
    return "REWARDS";
  };

  const columns: AdminTableColumn<RewardsAutomationRule>[] = [
    {
      key: "priority",
      header: "Order",
      headerClassName: "w-16",
      className: "w-16 font-mono text-xs",
      cell: (row, index) => (
        <div className="flex items-center gap-1">
          <span className="font-bold text-xs text-muted-foreground w-4">
            {index + 1}
          </span>
          <div className="flex flex-col">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onMoveUp(index)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Move Up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={index === rules.length - 1}
              onClick={() => onMoveDown(index)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              title="Move Down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "rule",
      header: "Rule & Module",
      headerClassName: "min-w-[220px]",
      cell: (row) => {
        const mod = inferModule(row);
        const modMeta = getModuleVisuals(mod);
        const ModIcon = modMeta.icon;

        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                modMeta.bg
              )}
            >
              <ModIcon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  onClick={() => onEdit(row)}
                  className="font-bold text-xs text-foreground hover:text-primary cursor-pointer truncate"
                >
                  {row.name}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[8px] font-bold px-1 py-0 h-3.5 shrink-0",
                    modMeta.bg,
                    modMeta.border
                  )}
                >
                  {modMeta.label}
                </Badge>
              </div>
              {row.description && (
                <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                  {row.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "trigger",
      header: "Trigger Scope",
      headerClassName: "w-44",
      cell: (row) => (
        <div className="space-y-0.5">
          <Badge
            variant="outline"
            className="text-[8.5px] font-bold px-1.5 py-0 h-4 bg-muted/60"
          >
            {row.trigger.replace(/_/g, " ")}
          </Badge>
          <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">
            Target: {row.rewardTitle || (row.rewardId === "ALL" ? "All Active" : "Item")}
          </span>
        </div>
      ),
    },
    {
      key: "branches",
      header: "Branches",
      headerClassName: "w-28 text-center",
      className: "text-center",
      cell: (row) => {
        const count = row.branches?.length || 1;
        const hasNo = Boolean(
          row.branches?.some((b) => b.hasNoPath) ||
          row.actions?.some((a) => String(a.branch || "").endsWith("_no"))
        );

        return (
          <div className="flex items-center justify-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono border",
                count > 1
                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              <GitBranch className="w-3 h-3 text-purple-500 shrink-0" />
              <span>{count} {count === 1 ? "Branch" : "Branches"}</span>
            </span>
            {hasNo && (
              <span className="text-[8.5px] font-extrabold px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                YES/NO
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "conditions",
      header: "Criteria",
      headerClassName: "w-48",
      cell: (row) => {
        const conds = row.conditions || [];
        if (conds.length === 0) {
          return (
            <span className="text-[10px] text-muted-foreground italic">
              All participants
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {conds.slice(0, 2).map((c, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[8px] font-medium px-1 py-0 h-4 truncate max-w-[130px] bg-background"
              >
                {c.field.replace(/^context\./, "")} {c.operator} {String(c.value)}
              </Badge>
            ))}
            {conds.length > 2 && (
              <span className="text-[9px] text-muted-foreground font-bold">
                +{conds.length - 2} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions (YES / NO)",
      headerClassName: "w-48",
      cell: (row) => {
        const yesActions = (row.actions || []).filter(
          (a) => !String(a.branch || "").endsWith("_no")
        );
        const noActions = (row.actions || []).filter((a) =>
          String(a.branch || "").endsWith("_no")
        );

        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {yesActions.length > 0 && (
              <Badge
                variant="outline"
                className="text-[8.5px] font-extrabold px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                YES: {yesActions.length}
              </Badge>
            )}
            {noActions.length > 0 && (
              <Badge
                variant="outline"
                className="text-[8.5px] font-extrabold px-1.5 py-0 h-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
              >
                NO: {noActions.length}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "w-28",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            disabled={togglingId === row.id}
            onCheckedChange={(checked) => onToggle(row.id, checked)}
          />
          <span className="text-[10px] font-bold text-muted-foreground">
            {row.isActive ? "Active" : "Paused"}
          </span>
        </div>
      ),
    },
    {
      key: "executions",
      header: "Runs",
      headerClassName: "w-20 text-center",
      className: "text-center",
      cell: (row) => (
        <span className="font-bold text-xs text-foreground font-mono">
          {(row.executionCount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "lastRunAt",
      header: "Last Run",
      headerClassName: "w-28",
      cell: (row) => <AdminTableDate date={row.lastRunAt || null} />,
    },
    {
      key: "actionsMenu",
      header: "Actions",
      headerClassName: "w-16 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (row, index) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs w-44">
            <DropdownMenuItem
              onClick={() => onEdit(row)}
              className="gap-2 text-xs font-medium cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-primary" /> Edit Workflow
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onViewLogs(row)}
              className="gap-2 text-xs font-medium cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-purple-500" />
              View Logs & Stats
            </DropdownMenuItem>

            {onDuplicate && (
              <DropdownMenuItem
                onClick={() => onDuplicate(row)}
                className="gap-2 text-xs font-medium cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-blue-500" /> Duplicate
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(row.id)}
              className="gap-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (col) => visibleColumns[col.key] !== false
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
      <AdminTable
        columns={filteredColumns}
        data={rules}
        loading={loading}
        keyExtractor={(row) => row.id}
        emptyTitle="No rewards automation rules configured yet"
        emptyDescription="Create a rule or load a starter recipe to automate game and reward outcomes."
        emptyIcon={Zap}
        size="sm"
      />
    </div>
  );
};
