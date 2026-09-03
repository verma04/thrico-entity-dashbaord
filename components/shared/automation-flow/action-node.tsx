"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Copy,
  Trash2,
  Settings2,
  Check,
  X,
  GitBranch,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSharedActionMeta } from "./action-palette-items";
import { SharedActionNodeData } from "./types";
import { cn } from "@/lib/utils";

export const SharedActionNode = memo(({ data, selected }: NodeProps<any>) => {
  const nodeData = data as SharedActionNodeData;
  const action = nodeData.action;
  const index = nodeData.index ?? 0;
  const simulation = nodeData.simulationStatus;
  const actionConditions = action.conditions || [];

  const meta = getSharedActionMeta(action.type);
  const Icon = meta.icon;

  const getSubtitle = () => {
    switch (action.type) {
      case "ASSIGN_MEMBERSHIP_TIER":
        return action.tierName || "Select Tier";
      case "EMAIL":
        return action.emailSubject || "Email Notification";
      case "COMMUNITY_JOIN":
        return action.communityName || "Select Circle";
      case "NOTIFICATION":
        return action.pushTitle || "Push Notification";
      case "ADD_MEMBER_TAG":
        return action.tags?.join(", ") || "No tags set";
      case "WHATSAPP_TEMPLATE":
        return action.whatsAppTemplateName || "Select Template";
      default:
        return action.type;
    }
  };

  return (
    <div
      onClick={nodeData.onSelect}
      className={cn(
        "group relative w-[310px] rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-md",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]"
          : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
        simulation === "executed" &&
          "ring-2 ring-emerald-500/40 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20",
        simulation === "skipped" && "opacity-50 grayscale"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3.5 !h-3.5 !bg-amber-500 !border-2 !border-background shadow-xs"
      />

      {/* Top Gradient Banner */}
      <div className={cn("h-2 w-full rounded-t-2xl bg-gradient-to-r", meta.color)} />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                meta.badgeBg
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block truncate">
                Action #{index + 1} · {meta.badgeLabel}
              </span>
              <h4 className="text-xs font-bold text-foreground truncate">
                {meta.label}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            {nodeData.onDuplicate && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  nodeData.onDuplicate?.();
                }}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Duplicate Action"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            )}
            {nodeData.onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  nodeData.onDelete?.();
                }}
                className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Delete Action"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Action Branch Condition Pill (if present) */}
        {actionConditions.length > 0 && (
          <div className="p-2 rounded-lg bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Branch Condition ({action.conditionOperator || "AND"})
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20">
                {actionConditions.length} rule{actionConditions.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {actionConditions.map((c: any, ci: number) => (
                <span
                  key={ci}
                  className="px-1.5 py-0.5 rounded bg-background text-[9.5px] font-semibold border border-cyan-500/30 text-cyan-900 dark:text-cyan-200"
                >
                  {c.field.replace("context.", "").replace("userToEntity.", "")} {c.operator} {String(c.value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Box Preview */}
        <div className="p-2.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/80 border border-border/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
            <span className="truncate max-w-[200px]">{getSubtitle()}</span>
            <Badge variant="outline" className={cn("text-[9px] font-bold px-1.5 py-0", meta.badgeBg)}>
              Ready
            </Badge>
          </div>
          <p className="text-[10.5px] text-muted-foreground line-clamp-2 leading-relaxed">
            {meta.desc}
          </p>

          {action.type === "ADD_MEMBER_TAG" && action.tags && action.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {action.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9.5px] font-bold border border-emerald-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Simulation Feedback */}
        {simulation && simulation !== "idle" && (
          <div
            className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg text-[10px] font-bold",
              simulation === "executed" &&
                "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
              simulation === "skipped" &&
                "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20",
              simulation === "running" &&
                "bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse"
            )}
          >
            {simulation === "executed" && <Check className="w-3.5 h-3.5" />}
            {simulation === "skipped" && <X className="w-3.5 h-3.5" />}
            <span>
              {simulation === "executed" && "Simulation: Action qualified & executed!"}
              {simulation === "skipped" && "Simulation: Skipped (condition not met)"}
              {simulation === "running" && "Testing criteria..."}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground flex items-center gap-1">
            <Settings2 className="w-3 h-3 text-primary" />
            Click to configure
          </span>
          <span className="font-semibold text-primary group-hover:underline">
            Inspect Options →
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !bg-amber-500 !border-2 !border-background shadow-xs"
      />
    </div>
  );
});

SharedActionNode.displayName = "SharedActionNode";
