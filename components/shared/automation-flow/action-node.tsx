"use client";

import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Copy,
  Trash2,
  Settings2,
  Check,
  X,
  GitBranch,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSharedActionMeta, ACTION_CATEGORIES } from "./action-palette-items";
import { SharedActionNodeData } from "./types";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { cn } from "@/lib/utils";

export const SharedActionNode = memo(({ data, selected }: NodeProps<any>) => {
  const nodeData = data as SharedActionNodeData;
  const action = nodeData.action;
  const index = nodeData.index ?? 0;
  const simulation = nodeData.simulationStatus;
  const actionConditions = action.conditions || [];

  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);
  const isEmailUnverified = action.type === "EMAIL" && !isVerified;

  const meta = getSharedActionMeta(action.type);
  const categoryMeta = ACTION_CATEGORIES[meta.category];
  const Icon = meta.icon;
  const isNoBranch = action.branch === "no" || (typeof action.branch === "string" && action.branch.endsWith("_no"));


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
      case "CUSTOM_WEBHOOK":
      case "WEBHOOK":
        return action.webhook?.url
          ? `${action.webhook.method || "POST"} ${action.webhook.url}`
          : "Configure Webhook";
      case "AWARD_POINTS":
        return action.points ? `+${action.points} Gamification Points` : "Set Points";
      default:
        return action.type;
    }
  };

  return (
    <div
      onClick={nodeData.onSelect}
      className={cn(
        "group relative w-[220px] rounded-xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-sm",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
          : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
        simulation === "executed" &&
          "ring-2 ring-emerald-500/40 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20",
        simulation === "skipped" && "opacity-50 grayscale"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "!w-2.5 !h-2.5 !border-2 !border-background shadow-xs",
          isNoBranch ? "!bg-rose-500" : "!bg-emerald-500"
        )}
      />

      {/* Top Gradient Banner */}
      <div className={cn("h-1.5 w-full rounded-t-xl bg-gradient-to-r", isNoBranch ? "from-rose-500 via-rose-600 to-red-600" : meta.color)} />

      <div className="p-2.5 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs",
                meta.badgeBg
              )}
            >
              <Icon className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[8.5px] font-bold tracking-wider text-muted-foreground uppercase leading-none">
                  #{index + 1}
                </span>
                <span
                  className={cn(
                    "text-[7.5px] font-semibold px-1 py-0 rounded border uppercase tracking-wider",
                    categoryMeta?.color || meta.badgeBg
                  )}
                >
                  {categoryMeta?.badge || meta.badgeLabel}
                </span>
                <span
                  className={cn(
                    "text-[7.5px] font-bold px-1 py-0 rounded border uppercase tracking-wider",
                    isNoBranch
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  )}
                >
                  {isNoBranch ? "NO" : "YES"}
                </span>
              </div>
              <h4 className="text-[11px] font-bold text-foreground truncate mt-0.5">
                {meta.label}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            {nodeData.onDuplicate && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  nodeData.onDuplicate?.();
                }}
                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                title="Duplicate Action"
              >
                <Copy className="w-2.5 h-2.5" />
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
                className="h-5 w-5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Delete Action"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Action Branch Condition Pill (if present) */}
        {actionConditions.length > 0 && (
          <div className="p-1.5 rounded-md bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 space-y-0.5">
            <div className="flex items-center justify-between text-[8.5px] font-bold text-cyan-700 dark:text-cyan-300">
              <span className="flex items-center gap-0.5">
                <GitBranch className="w-2.5 h-2.5" />
                Condition ({action.conditionOperator || "AND"})
              </span>
              <span className="text-[8px] font-mono px-0.5 rounded bg-cyan-500/20">
                {actionConditions.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-0.5">
              {actionConditions.map((c: any, ci: number) => (
                <span
                  key={ci}
                  className="px-1 py-0.2 rounded bg-background text-[8px] font-semibold border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 truncate max-w-[180px]"
                >
                  {c.field.replace("context.", "").replace("userToEntity.", "")} {c.operator} {String(c.value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Box Preview */}
        <div className="p-2 rounded-lg bg-zinc-50/80 dark:bg-zinc-800/80 border border-border/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-foreground">
            <span className="truncate max-w-[130px]">{getSubtitle()}</span>
            {isEmailUnverified ? (
              <Badge
                variant="outline"
                className="text-[8px] font-bold px-1 py-0 h-3.5 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
              >
                Setup Req.
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className={cn("text-[8px] font-bold px-1 py-0 h-3.5", meta.badgeBg)}
              >
                Ready
              </Badge>
            )}
          </div>
          <p className="text-[9px] text-muted-foreground line-clamp-2 leading-snug">
            {isEmailUnverified
              ? "Cannot dispatch emails until sender domain is verified."
              : meta.desc}
          </p>

          {action.type === "ADD_MEMBER_TAG" && action.tags && action.tags.length > 0 && (
            <div className="flex flex-wrap gap-0.5 pt-0.5">
              {action.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[8px] font-bold border border-emerald-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {(action.type === "CUSTOM_WEBHOOK" || action.type === "WEBHOOK") && (
            <div className="flex items-center gap-1 pt-0.5 text-[8.5px] font-mono">
              <span className="px-1 py-0.2 rounded bg-violet-500/15 text-violet-700 dark:text-violet-300 font-bold border border-violet-500/30">
                {action.webhook?.method || "POST"}
              </span>
              <span className="truncate text-muted-foreground max-w-[130px]">
                {action.webhook?.url || "No URL"}
              </span>
            </div>
          )}

          {action.type === "AWARD_POINTS" && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[9.5px] font-bold border border-amber-500/30 flex items-center gap-0.5">
                🪙 +{action.points ?? 0} Pts
              </span>
            </div>
          )}
        </div>

        {/* Email Domain Warning Banner */}
        {isEmailUnverified && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDomainModal(true);
            }}
            className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[9px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              Domain Required
            </span>
            <span className="text-[8.5px] underline text-amber-600 dark:text-amber-300">
              Setup →
            </span>
          </div>
        )}

        {/* Simulation Feedback */}
        {simulation && simulation !== "idle" && (
          <div
            className={cn(
              "flex items-center gap-1 p-1.5 rounded-md text-[9px] font-bold",
              simulation === "executed" &&
                "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
              simulation === "skipped" &&
                "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20",
              simulation === "running" &&
                "bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse"
            )}
          >
            {simulation === "executed" && <Check className="w-3 h-3 shrink-0" />}
            {simulation === "skipped" && <X className="w-3 h-3 shrink-0" />}
            <span className="truncate">
              {simulation === "executed" && "Qualified & executed!"}
              {simulation === "skipped" && "Skipped (filter failed)"}
              {simulation === "running" && "Testing criteria..."}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px]">
          <span className="text-muted-foreground flex items-center gap-0.5">
            <Settings2 className="w-2.5 h-2.5 text-primary" />
            Configure
          </span>
          <span className="font-semibold text-primary group-hover:underline">
            Options →
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-amber-500 !border-2 !border-background shadow-xs"
      />

      <EmailDomainSetupModal
        open={showDomainModal}
        onOpenChange={setShowDomainModal}
      />
    </div>
  );
});

SharedActionNode.displayName = "SharedActionNode";
