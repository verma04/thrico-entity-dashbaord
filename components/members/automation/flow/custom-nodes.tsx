"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Zap,
  Users,
  CheckCircle2,
  ShieldCheck,
  Filter,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberRuleTrigger } from "@/graphql/member-automation";
import { cn } from "@/lib/utils";

// ── Trigger Node ─────────────────────────────────────────────────────────────
export const TriggerNode = memo(({ data, selected }: NodeProps<any>) => {
  const trigger = (data.trigger as MemberRuleTrigger) || "MEMBER_JOINED";

  const getTriggerMeta = () => {
    switch (trigger) {
      case "MEMBER_JOINED":
        return {
          title: "Member Registration",
          desc: "Evaluated when a member registers or is invited.",
          icon: Users,
          color: "from-emerald-500 to-teal-600",
          border: "border-emerald-500/40 dark:border-emerald-500/30",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          badge: "Join Event",
        };
      case "MEMBER_APPROVED":
        return {
          title: "Member Approval",
          desc: "Triggered when an admin approves applicant profile.",
          icon: CheckCircle2,
          color: "from-blue-500 to-indigo-600",
          border: "border-blue-500/40 dark:border-blue-500/30",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          badge: "Approval Event",
        };
      case "MEMBER_VERIFIED":
        return {
          title: "Identity Verified",
          desc: "Triggered upon institutional or KYC document approval.",
          icon: ShieldCheck,
          color: "from-purple-500 to-pink-600",
          border: "border-purple-500/40 dark:border-purple-500/30",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
          badge: "Trust Badge",
        };
      default:
        return {
          title: "Trigger Event",
          desc: "Lifecycle trigger initiating this workflow.",
          icon: Zap,
          color: "from-amber-500 to-orange-600",
          border: "border-amber-500/40 dark:border-amber-500/30",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          badge: "Event",
        };
    }
  };

  const meta = getTriggerMeta();
  const Icon = meta.icon;

  return (
    <div
      onClick={data.onSelect}
      className={cn(
        "group relative w-[280px] rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-md",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]"
          : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      {/* Top Accent Bar */}
      <div className={cn("h-2 w-full rounded-t-2xl bg-gradient-to-r", meta.color)} />

      <div className="p-4 space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shadow-xs",
                meta.bg
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Trigger Event
              </span>
              <h4 className="text-xs font-bold text-foreground leading-tight">
                {meta.title}
              </h4>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-[9px] font-bold px-1.5 py-0.5", meta.bg, meta.border)}
          >
            {meta.badge}
          </Badge>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {meta.desc}
        </p>

        {/* Quick Trigger Switcher */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <Zap className="w-3 h-3 text-amber-500" />
            Runs in Real-Time
          </span>
          <span className="font-semibold text-primary group-hover:underline">
            Click to configure →
          </span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs transition-transform group-hover:scale-125"
      />
    </div>
  );
});

TriggerNode.displayName = "TriggerNode";

// ── Condition / Filter Node ──────────────────────────────────────────────────
export const ConditionNode = memo(({ data, selected }: NodeProps<any>) => {
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
        simulation === "passed" && "ring-2 ring-emerald-500/40 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20",
        simulation === "failed" && "ring-2 ring-rose-500/40 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20"
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-background shadow-xs"
      />

      {/* Top Accent Bar */}
      <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Filter & Branching
              </span>
              <h4 className="text-xs font-bold text-foreground">
                Targeting Conditions
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
              <span className={operator === "OR" ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"}>
                OR
              </span>
            </div>
          ) : (
            <Badge variant="outline" className="text-[9px] font-bold text-blue-600 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40">
              {conditions.length === 0 ? "No Filters" : "1 Condition"}
            </Badge>
          )}
        </div>

        {/* Condition Chips List */}
        {conditions.length === 0 ? (
          <div className="p-3 rounded-xl border border-dashed border-border/80 bg-zinc-50/50 dark:bg-zinc-900/50 text-center space-y-1">
            <p className="text-[11px] font-medium text-foreground">
              Universal Cohort (100% Match)
            </p>
            <p className="text-[10px] text-muted-foreground">
              Executes for all joining members unconditionally.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {conditions.map((cond: any, i: number) => {
              const fieldClean = cond.field.replace("profile.", "").replace("user.", "");
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
                      {String(cond.value || "is set")}
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
              simulation === "passed" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
              simulation === "failed" && "bg-rose-500/10 text-rose-600 border border-rose-500/20",
              simulation === "running" && "bg-blue-500/10 text-blue-600 border border-blue-500/20 animate-pulse"
            )}
          >
            {simulation === "passed" && <Check className="w-3.5 h-3.5" />}
            {simulation === "failed" && <X className="w-3.5 h-3.5" />}
            <span>
              {simulation === "passed" && "Simulation: Member matches all conditions!"}
              {simulation === "failed" && "Simulation: Member did not match criteria."}
              {simulation === "running" && "Evaluating candidate profile..."}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">
            {conditions.length} rule{conditions.length === 1 ? "" : "s"} applied
          </span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
            Manage Rules →
          </span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !bg-blue-500 !border-2 !border-background shadow-xs"
      />
    </div>
  );
});

ConditionNode.displayName = "ConditionNode";

// ── Reusable Action & Add Action Nodes ───────────────────────────────────────
export {
  SharedActionNode as ActionNode,
  SharedAddActionNode as AddActionNode,
} from "@/components/shared/automation-flow";
