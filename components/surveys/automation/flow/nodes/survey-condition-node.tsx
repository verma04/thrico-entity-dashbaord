"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Filter, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const SurveyConditionNode = memo(({ data, selected }: NodeProps<any>) => {
  const conditions = data.conditions || [];
  const operator = data.conditionOperator || "AND";
  const simulation = data.simulationStatus;

  return (
    <div
      onClick={data.onSelect}
      className={cn(
        "group relative w-[320px] rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-md",
        selected
          ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg scale-[1.02]"
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
        className="!w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-background shadow-xs"
      />

      <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500" />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Global Rule Filter
              </span>
              <h4 className="text-xs font-bold text-foreground">
                Targeting Criteria
              </h4>
            </div>
          </div>

          {conditions.length > 1 ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                data.onOperatorChange?.(operator === "AND" ? "OR" : "AND");
              }}
              className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-border text-[10px] font-bold cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Click to toggle between Match ALL (AND) and Match ANY (OR)"
            >
              <span className={operator === "AND" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                AND
              </span>
              <span className="text-muted-foreground">/</span>
              <span className={operator === "OR" ? "text-cyan-600 dark:text-cyan-400" : "text-muted-foreground"}>
                OR
              </span>
            </div>
          ) : (
            <Badge variant="outline" className="text-[9px] font-bold text-blue-600 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40">
              {conditions.length === 0 ? "All Responses" : "1 Filter"}
            </Badge>
          )}
        </div>

        {/* Condition Chips List */}
        {conditions.length === 0 ? (
          <div className="p-3 rounded-xl border border-dashed border-border/80 bg-zinc-50/50 dark:bg-zinc-900/50 text-center space-y-1">
            <p className="text-[11px] font-medium text-foreground">
              Pass All Responses (100%)
            </p>
            <p className="text-[10px] text-muted-foreground">
              Evaluates branching conditions on individual actions directly.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {conditions.map((cond: any, i: number) => {
              const fieldClean = cond.field.replace("context.", "").replace("response.", "");
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-[11px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-foreground capitalize">
                      {fieldClean}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {cond.operator}
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400 truncate max-w-[100px]">
                      {String(cond.value)}
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
                "bg-blue-500/10 text-blue-600 border border-blue-500/20 animate-pulse"
            )}
          >
            {simulation === "passed" && <Check className="w-3.5 h-3.5" />}
            {simulation === "failed" && <X className="w-3.5 h-3.5" />}
            <span>
              {simulation === "passed" && "Simulation: Top criteria matched!"}
              {simulation === "failed" && "Simulation: Global criteria not met."}
              {simulation === "running" && "Evaluating survey criteria..."}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">
            {conditions.length} rule{conditions.length === 1 ? "" : "s"} active
          </span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
            Manage Criteria →
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-background shadow-xs"
      />
    </div>
  );
});

SurveyConditionNode.displayName = "SurveyConditionNode";
