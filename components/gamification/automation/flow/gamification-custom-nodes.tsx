"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  GamificationModuleType,
  AnyGamificationTrigger,
  AnyGamificationActionType,
  GamificationRuleConditionInput,
  GamificationActionInputPayload,
} from "@/graphql/gamification-automation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Coins,
  Medal,
  Crown,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// 1. TRIGGER NODE
// ─────────────────────────────────────────────────────────────────────────────

export interface TriggerNodeData {
  module: GamificationModuleType;
  trigger: AnyGamificationTrigger;
  targetId?: string | null;
  targetName?: string | null;
  onSelect?: () => void;
}

export const GamificationTriggerNode = memo(
  ({ data, selected }: NodeProps<any>) => {
    const nodeData = data as TriggerNodeData;

    const getModuleMeta = (mod: GamificationModuleType) => {
      switch (mod) {
        case "POINTS":
          return {
            label: "Points Engine",
            icon: Coins,
            color: "from-amber-500 to-amber-600",
            textColor: "text-amber-600 dark:text-amber-400",
            bgLight: "bg-amber-500/10",
            border: "border-amber-500/30",
          };
        case "BADGES":
          return {
            label: "Badges Engine",
            icon: Medal,
            color: "from-emerald-500 to-emerald-600",
            textColor: "text-emerald-600 dark:text-emerald-400",
            bgLight: "bg-emerald-500/10",
            border: "border-emerald-500/30",
          };
        case "RANKS":
          return {
            label: "Ranks Engine",
            icon: Crown,
            color: "from-purple-500 to-purple-600",
            textColor: "text-purple-600 dark:text-purple-400",
            bgLight: "bg-purple-500/10",
            border: "border-purple-500/30",
          };
        case "LEADERBOARD":
          return {
            label: "Leaderboard Engine",
            icon: Trophy,
            color: "from-blue-500 to-blue-600",
            textColor: "text-blue-600 dark:text-blue-400",
            bgLight: "bg-blue-500/10",
            border: "border-blue-500/30",
          };
        case "CURRENCY":
          return {
            label: "Currency Engine",
            icon: Coins,
            color: "from-yellow-500 to-amber-600",
            textColor: "text-amber-600 dark:text-amber-400",
            bgLight: "bg-amber-500/10",
            border: "border-amber-500/30",
          };
      }
    };

    const meta = getModuleMeta(nodeData.module);
    const ModIcon = meta.icon;

    return (
      <div
        onClick={nodeData.onSelect}
        className={cn(
          "w-[310px] rounded-2xl bg-card border transition-all duration-200 cursor-pointer select-none shadow-md",
          selected
            ? "border-primary ring-2 ring-primary/30 shadow-lg scale-[1.02]"
            : "border-border hover:border-primary/50"
        )}
      >
        {/* Top Gradient Banner */}
        <div
          className={cn("h-2.5 w-full rounded-t-2xl bg-gradient-to-r", meta.color)}
        />

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border",
                meta.bgLight,
                meta.textColor,
                meta.border
              )}
            >
              <ModIcon className="w-3.5 h-3.5" />
              {meta.label}
            </span>
            <Badge variant="outline" className="text-[10px] uppercase font-bold">
              Trigger
            </Badge>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Event Trigger
            </div>
            <h4 className="text-sm font-bold text-foreground mt-0.5">
              {nodeData.trigger.replace(/_/g, " ")}
            </h4>
            {nodeData.targetName && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
                Target: {nodeData.targetName}
              </p>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs"
        />
      </div>
    );
  }
);

GamificationTriggerNode.displayName = "GamificationTriggerNode";

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONDITION / CRITERIA NODE
// ─────────────────────────────────────────────────────────────────────────────

export interface ConditionNodeData {
  conditionOperator: "AND" | "OR";
  conditions: GamificationRuleConditionInput[];
  onSelect?: () => void;
}

export const GamificationConditionNode = memo(
  ({ data, selected }: NodeProps<any>) => {
    const nodeData = data as ConditionNodeData;
    const conds = nodeData.conditions || [];

    return (
      <div
        onClick={nodeData.onSelect}
        className={cn(
          "w-[310px] rounded-2xl bg-card border transition-all duration-200 cursor-pointer select-none shadow-md",
          selected
            ? "border-primary ring-2 ring-primary/30 shadow-lg scale-[1.02]"
            : "border-border hover:border-primary/50"
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs"
        />

        {/* Top Banner */}
        <div className="h-2 w-full rounded-t-2xl bg-gradient-to-r from-amber-500 to-indigo-500" />

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-muted text-foreground border border-border">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              Criteria Gate
            </span>
            <Badge variant="outline" className="text-[10px] font-bold">
              {nodeData.conditionOperator} ({conds.length})
            </Badge>
          </div>

          {conds.length === 0 ? (
            <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground italic">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Unconditional: Always passes</span>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {conds.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-muted/60 border border-border/80 text-[11px] font-mono"
                >
                  <span className="font-medium text-foreground">{c.field}</span>
                  <span className="font-bold text-primary">{c.operator}</span>
                  <span className="font-bold text-foreground">
                    {String(c.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs"
        />
      </div>
    );
  }
);

GamificationConditionNode.displayName = "GamificationConditionNode";

// ─────────────────────────────────────────────────────────────────────────────
// 3. ACTION NODE
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionNodeData {
  index: number;
  action: GamificationActionInputPayload;
  onSelect?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export const GamificationActionNode = memo(
  ({ data, selected }: NodeProps<any>) => {
    const nodeData = data as ActionNodeData;
    const action = nodeData.action;

    const getActionMeta = (type: AnyGamificationActionType) => {
      switch (type) {
        case "ASSIGN_MEMBERSHIP_TIER":
          return {
            label: "Membership Tier",
            icon: Award,
            color: "from-amber-500 to-amber-600",
            badgeClass:
              "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          };
        case "EMAIL":
          return {
            label: "Send Email",
            icon: Mail,
            color: "from-violet-500 to-purple-600",
            badgeClass:
              "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
          };
        case "NOTIFICATION":
          return {
            label: "Push Alert",
            icon: Bell,
            color: "from-sky-500 to-blue-600",
            badgeClass:
              "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
          };
        case "COMMUNITY_JOIN":
          return {
            label: "Circle Access",
            icon: Users,
            color: "from-blue-500 to-indigo-600",
            badgeClass:
              "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          };
        case "ADD_MEMBER_TAG":
          return {
            label: "Member Tags",
            icon: Tag,
            color: "from-emerald-500 to-teal-600",
            badgeClass:
              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          };
        case "AWARD_POINTS":
          return {
            label: "Award Points",
            icon: Coins,
            color: "from-amber-400 to-orange-500",
            badgeClass:
              "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
          };
        case "AWARD_BADGE":
          return {
            label: "Award Badge",
            icon: Medal,
            color: "from-rose-500 to-pink-600",
            badgeClass:
              "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          };
        case "AWARD_CURRENCY":
          return {
            label: "Award Currency",
            icon: Coins,
            color: "from-yellow-400 to-amber-500",
            badgeClass:
              "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/25",
          };
        default:
          return {
            label: type,
            icon: Sparkles,
            color: "from-indigo-500 to-purple-600",
            badgeClass: "bg-muted text-muted-foreground",
          };
      }
    };

    const meta = getActionMeta(action.type);
    const Icon = meta.icon;

    const getSubtitle = () => {
      switch (action.type) {
        case "ASSIGN_MEMBERSHIP_TIER":
          return action.tier?.tierId ? "Tier Assigned" : "Select Tier";
        case "EMAIL":
          return action.email?.subject || "Email Notification";
        case "NOTIFICATION":
          return action.notification?.pushTitle || "Push Alert";
        case "COMMUNITY_JOIN":
          return action.community?.communityId ? "Circle Selected" : "Select Circle";
        case "ADD_MEMBER_TAG":
          const tags = action.tag?.tags || action.tags || [];
          return tags.length > 0 ? tags.join(", ") : "Add Tags";
        case "AWARD_POINTS":
          return `+${action.points?.points || 100} pts`;
        case "AWARD_BADGE":
          return action.badge?.badgeId ? "Badge Awarded" : "Select Badge";
        case "AWARD_CURRENCY":
          return `+${action.currency?.amount || action.currencyAmount || 50} ${action.currency?.currencyType || action.currencyType || "TC"}`;
        default:
          return "";
      }
    };

    return (
      <div
        onClick={nodeData.onSelect}
        className={cn(
          "w-[310px] rounded-2xl bg-card border transition-all duration-200 cursor-pointer select-none shadow-md",
          selected
            ? "border-primary ring-2 ring-primary/30 shadow-lg scale-[1.02]"
            : "border-border hover:border-primary/50"
        )}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs"
        />

        {/* Top Banner */}
        <div
          className={cn("h-2 w-full rounded-t-2xl bg-gradient-to-r", meta.color)}
        />

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border",
                meta.badgeClass
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {meta.label}
            </span>

            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                Step #{nodeData.index + 1}
              </span>

              {nodeData.onDuplicate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    nodeData.onDuplicate?.();
                  }}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
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
                  className="h-6 w-6 text-muted-foreground hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-foreground line-clamp-1">
              {getSubtitle()}
            </h5>
            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
              Click to configure action payload
            </p>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-primary !border-2 !border-background shadow-xs"
        />
      </div>
    );
  }
);

GamificationActionNode.displayName = "GamificationActionNode";

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADD ACTION NODE
// ─────────────────────────────────────────────────────────────────────────────

export interface AddActionNodeData {
  onAddAction: (type?: AnyGamificationActionType) => void;
}

export const GamificationAddActionNode = memo(
  ({ data }: NodeProps<any>) => {
    const nodeData = data as AddActionNodeData;

    return (
      <div className="w-[310px] flex items-center justify-center">
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-primary !border-2 !border-background shadow-xs"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => nodeData.onAddAction()}
          className="w-full h-11 rounded-2xl border-dashed border-2 border-border/80 hover:border-primary/60 hover:bg-primary/5 text-xs font-semibold gap-2 shadow-2xs cursor-pointer text-muted-foreground hover:text-primary transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Action Step to Pipeline
        </Button>
      </div>
    );
  }
);

GamificationAddActionNode.displayName = "GamificationAddActionNode";
