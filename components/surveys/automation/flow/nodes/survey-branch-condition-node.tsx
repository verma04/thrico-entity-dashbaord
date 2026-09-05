"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  GitBranch,
  Plus,
  Copy,
  Trash2,
  Settings2,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SHARED_PALETTE_ACTIONS } from "@/components/shared/automation-flow";
import { cn } from "@/lib/utils";

export const SurveyBranchConditionNode = memo(
  ({ data, selected }: NodeProps<any>) => {
    const conditions = data.conditions || [];
    const operator = data.conditionOperator || "AND";
    const simulation = data.simulationStatus;
    const branchIndex = data.branchIndex ?? 0;
    const actionCount = data.actionCount ?? 0;

    const getBranchTitle = () => {
      if (data.branchTitle) return data.branchTitle;
      if (conditions.length === 0)
        return `Branch #${branchIndex + 1}: Universal (All Answers)`;
      const firstCond = conditions[0];
      const fieldClean = firstCond.field
        .replace("context.", "")
        .replace("response.", "");
      return `Branch #${branchIndex + 1}: If ${fieldClean} ${firstCond.operator} "${String(firstCond.value)}"`;
    };

    return (
      <div
        onClick={data.onSelect}
        className={cn(
          "group relative w-[310px] rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-md",
          selected
            ? "border-cyan-500 ring-2 ring-cyan-500/20 shadow-lg scale-[1.02]"
            : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
          simulation === "passed" &&
            "ring-2 ring-emerald-500/40 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20",
          simulation === "failed" &&
            "ring-2 ring-rose-500/40 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20"
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3.5 !h-3.5 !bg-cyan-500 !border-2 !border-background shadow-xs"
        />

        <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase block">
                  Condition Branch #{branchIndex + 1}
                </span>
                <h4 className="text-xs font-bold text-foreground truncate">
                  {getBranchTitle()}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {data.onDuplicateBranch && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onDuplicateBranch?.();
                  }}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  title="Duplicate Branch"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              )}
              {data.onDeleteBranch && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onDeleteBranch?.();
                  }}
                  className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete Branch"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Condition Chips List */}
          {conditions.length === 0 ? (
            <div className="p-2.5 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 text-center space-y-0.5">
              <p className="text-[11px] font-semibold text-cyan-900 dark:text-cyan-200">
                Universal (Runs for all responses)
              </p>
              <p className="text-[10px] text-muted-foreground">
                No filter criteria applied on this branch.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {conditions.map((cond: any, i: number) => {
                const fieldClean = cond.field
                  .replace("context.", "")
                  .replace("response.", "");
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-1.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-cyan-500/20 text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-foreground capitalize">
                        {fieldClean}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {cond.operator}
                      </span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate max-w-[110px]">
                        "{String(cond.value)}"
                      </span>
                    </div>
                    {i < conditions.length - 1 && (
                      <span className="text-[9px] font-bold text-muted-foreground uppercase shrink-0">
                        {operator}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Simulation Feedback */}
          {simulation && simulation !== "idle" && (
            <div
              className={cn(
                "flex items-center gap-1.5 p-2 rounded-lg text-[10px] font-bold",
                simulation === "passed" &&
                  "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                simulation === "failed" &&
                  "bg-rose-500/10 text-rose-600 border border-rose-500/20",
                simulation === "running" &&
                  "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 animate-pulse"
              )}
            >
              {simulation === "passed" && <Check className="w-3.5 h-3.5" />}
              {simulation === "failed" && <X className="w-3.5 h-3.5" />}
              <span>
                {simulation === "passed" && "Simulation: Branch condition satisfied!"}
                {simulation === "failed" && "Simulation: Branch criteria not met."}
                {simulation === "running" && "Testing branch criteria..."}
              </span>
            </div>
          )}

          {/* Footer with Edit Criteria Indicator & Add Action Dropdown */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400 group-hover:underline">
              <Settings2 className="w-3 h-3" />
              Edit Criteria →
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 text-[10.5px] font-bold text-cyan-700 dark:text-cyan-300 gap-1 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 px-2"
                >
                  <Plus className="w-3 h-3" />
                  Add Action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1.5 shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  Add to Branch #{branchIndex + 1}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SHARED_PALETTE_ACTIONS.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <DropdownMenuItem
                      key={act.type}
                      onClick={() => data.onAddActionToBranch?.(act.type)}
                      className="text-xs gap-2.5 py-1.5 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border",
                          act.badgeBg
                        )}
                      >
                        <ActIcon className="w-3 h-3" />
                      </div>
                      <span className="font-semibold truncate">{act.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-cyan-500 !border-2 !border-background shadow-xs"
        />
      </div>
    );
  }
);

SurveyBranchConditionNode.displayName = "SurveyBranchConditionNode";
