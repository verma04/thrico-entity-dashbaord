"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Zap,
  Gamepad2,
  Dices,
  RectangleHorizontal,
  RefreshCw,
  Ticket,
  Coins,
  DollarSign,
  Bell,
  Mail,
  Award,
  Tag,
  Gift,
  Globe,
  Plus,
  Trash2,
  Copy,
  GitBranch,
  CheckCircle2,
  XCircle,
  Filter,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleActionType,
} from "@/graphql/rewards-automation";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

export const getModuleVisuals = (module: RewardAutomationModule) => {
  switch (module) {
    case "SPIN_WHEEL":
      return {
        label: "Spin the Wheel",
        icon: Dices,
        color: "from-amber-500 to-orange-600",
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        accent: "amber",
      };
    case "SCRATCH_CARD":
      return {
        label: "Scratch Card",
        icon: RectangleHorizontal,
        color: "from-pink-500 to-rose-600",
        bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
        border: "border-pink-500/30",
        accent: "rose",
      };
    case "MATCH_WIN":
      return {
        label: "Match & Win",
        icon: RefreshCw,
        color: "from-cyan-500 to-blue-600",
        bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        accent: "cyan",
      };
    case "REWARDS":
    default:
      return {
        label: "Rewards & Coupons",
        icon: Ticket,
        color: "from-emerald-500 to-teal-600",
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        accent: "emerald",
      };
  }
};

export const getActionVisuals = (type: RewardRuleActionType | string) => {
  switch (type) {
    case "AWARD_POINTS":
      return {
        label: "Award Points",
        icon: Coins,
        color: "from-amber-500 to-yellow-600",
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
      };
    case "AWARD_CURRENCY":
      return {
        label: "Credit Currency",
        icon: DollarSign,
        color: "from-emerald-500 to-teal-600",
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20",
      };
    case "NOTIFICATION":
      return {
        label: "Send Push Alert",
        icon: Bell,
        color: "from-purple-500 to-indigo-600",
        bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20",
      };
    case "EMAIL":
      return {
        label: "Send Email",
        icon: Mail,
        color: "from-blue-500 to-indigo-600",
        bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
      };
    case "ASSIGN_MEMBERSHIP_TIER":
      return {
        label: "Tier Upgrade",
        icon: Award,
        color: "from-orange-500 to-red-600",
        bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        border: "border-orange-500/20",
      };
    case "ADD_MEMBER_TAG":
      return {
        label: "Assign Tags",
        icon: Tag,
        color: "from-teal-500 to-emerald-600",
        bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
        border: "border-teal-500/20",
      };
    case "ISSUE_COUPON":
      return {
        label: "Issue Voucher / Coupon",
        icon: Gift,
        color: "from-rose-500 to-pink-600",
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        border: "border-rose-500/20",
      };
    case "AWARD_BADGE":
      return {
        label: "Unlock Badge",
        icon: Sparkles,
        color: "from-violet-500 to-purple-600",
        bg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        border: "border-violet-500/20",
      };
    case "CUSTOM_WEBHOOK":
    case "WEBHOOK":
      return {
        label: "Call Webhook",
        icon: Globe,
        color: "from-zinc-600 to-slate-700",
        bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
        border: "border-zinc-500/20",
      };
    default:
      return {
        label: "Automated Action",
        icon: Zap,
        color: "from-primary to-primary/80",
        bg: "bg-primary/10 text-primary",
        border: "border-primary/20",
      };
  }
};

// ── Trigger Node ─────────────────────────────────────────────────────────────

export const RewardsTriggerNode = memo(({ data, selected }: NodeProps<any>) => {
  const modMeta = getModuleVisuals(data.module || "SPIN_WHEEL");
  const ModIcon = modMeta.icon;

  const formatTriggerLabel = (trigger: RewardRuleTrigger | string) => {
    switch (trigger) {
      case "SPIN_WHEEL_PLAYED":
        return "Spin Wheel Played";
      case "SCRATCH_CARD_PLAYED":
        return "Scratch Card Scratched";
      case "MATCH_WIN_PLAYED":
        return "Match & Win Played";
      case "PRIZE_WON":
        return "Prize Won (Winner)";
      case "NO_REWARDS":
        return "No Rewards (Consolation)";
      case "REWARD_CLAIMED":
        return "Reward Claimed";
      case "REWARD_REDEEMED":
        return "Reward Redeemed";
      case "REWARD_EXPIRED":
        return "Reward Expired";
      default:
        return String(trigger || "Trigger Event").replace(/_/g, " ");
    }
  };


  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        data?.onSelect?.();
      }}
      className={cn(
        "group relative w-[240px] rounded-xl bg-card border transition-all duration-200 cursor-pointer select-none shadow-sm",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
          : "border-border/80 hover:border-border hover:shadow-md"
      )}
    >
      {/* Top Accent Strip */}
      <div
        className={cn(
          "h-1.5 w-full rounded-t-xl bg-gradient-to-r",
          modMeta.color
        )}
      />

      <div className="p-3 space-y-2.5">
        {/* Module Badge & Headline */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs",
                modMeta.bg
              )}
            >
              <ModIcon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-bold tracking-wider text-muted-foreground uppercase block leading-none">
                Trigger Event
              </span>
              <h4 className="text-[11.5px] font-bold text-foreground leading-tight truncate">
                {formatTriggerLabel(data.trigger)}
              </h4>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[8px] font-bold px-1 py-0 h-4 shrink-0",
              modMeta.bg,
              modMeta.border
            )}
          >
            {modMeta.label}
          </Badge>
        </div>

        {/* Parent Selector Target Pill */}
        <div className="px-2 py-1.5 rounded-lg bg-muted/60 border border-border/40 flex items-center justify-between text-[9.5px]">
          <span className="text-muted-foreground font-medium truncate flex items-center gap-1">
            <Layers className="w-3 h-3 text-muted-foreground shrink-0" />
            Target:
          </span>
          <span className="font-bold text-foreground truncate max-w-[120px]">
            {data.rewardTitle || (data.rewardId === "ALL" ? "All Active" : "Selected Item")}
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[9px]">
          <div className="flex items-center gap-1 font-medium text-muted-foreground">
            <GitBranch className="w-2.5 h-2.5 text-purple-500 shrink-0" />
            <span>{data.branchCount || 1} Branch{data.branchCount === 1 ? "" : "es"}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data?.onAddBranch?.();
            }}
            className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline flex items-center gap-0.5 cursor-pointer"
            title="Add another decision branch"
          >
            <Plus className="w-2.5 h-2.5" />
            Add Branch
          </button>
        </div>
      </div>

      {/* Output Handle to Condition Nodes */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="trigger-out"
        className="w-2.5 h-2.5 !bg-purple-500 border-2 border-background"
      />
    </div>
  );
});
RewardsTriggerNode.displayName = "RewardsTriggerNode";

// ── Condition / Branch Node ──────────────────────────────────────────────────

export const RewardsConditionNode = memo(({ data, selected }: NodeProps<any>) => {
  const conditions = data.conditions || [];
  const hasNoPath = Boolean(data.hasNoPath);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        data?.onSelect?.();
      }}
      className={cn(
        "group relative w-[250px] rounded-xl bg-card border transition-all duration-200 cursor-pointer select-none shadow-sm",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-md scale-[1.01]"
          : "border-border/80 hover:border-border hover:shadow-md"
      )}
    >
      {/* Top Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="branch-in"
        className="w-2.5 h-2.5 !bg-purple-500 border-2 border-background"
      />

      {/* Accent strip */}
      <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-blue-500 to-indigo-600" />

      <div className="p-3 space-y-2.5">
        {/* Branch Title & Menu */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Filter className="w-3 h-3" />
            </div>
            <h4 className="text-[11px] font-bold text-foreground truncate">
              {data.branchName || "Branch 1 (Primary)"}
            </h4>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Badge
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                data?.onToggleOperator?.();
              }}
              className="text-[8px] font-bold px-1 py-0 h-4 bg-muted/60 text-foreground cursor-pointer hover:bg-muted"
              title="Click to toggle AND/OR"
            >
              {data.conditionOperator || "AND"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  •••
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuLabel>Branch Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    data?.onDuplicateBranch?.();
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="w-3 h-3" /> Duplicate Branch
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    data?.onToggleNoPath?.();
                  }}
                  className="gap-1.5 text-xs"
                >
                  <XCircle className="w-3 h-3" />
                  {hasNoPath ? "Disable NO Path" : "Enable NO Path (Else)"}
                </DropdownMenuItem>
                {data.canDeleteBranch && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      data?.onDeleteBranch?.();
                    }}
                    className="gap-1.5 text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" /> Delete Branch
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Conditions List */}
        <div className="space-y-1">
          {conditions.length === 0 ? (
            <div className="p-2 rounded-lg bg-muted/40 border border-dashed border-border/80 text-center">
              <span className="text-[9px] text-muted-foreground font-medium">
                No filters set (All participants match)
              </span>
            </div>
          ) : (
            conditions.map((cond: any, i: number) => (
              <div
                key={i}
                className="px-2 py-1 rounded bg-muted/50 border border-border/40 flex items-center justify-between text-[9px]"
              >
                <span className="font-medium text-foreground truncate max-w-[170px]">
                  <code className="text-primary font-bold">
                    {cond.field.replace(/^context\./, "")}
                  </code>{" "}
                  {cond.operator} {String(cond.value)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    data?.onDeleteCondition?.(i);
                  }}
                  className="text-muted-foreground hover:text-destructive ml-1"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Add Condition */}
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data?.onAddCondition?.();
            }}
            className="font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-2.5 h-2.5" />
            Add Filter
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data?.onToggleNoPath?.();
            }}
            className={cn(
              "text-[8px] font-bold px-1.5 py-0.5 rounded border transition-colors",
              hasNoPath
                ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
                : "bg-muted text-muted-foreground border-border hover:text-foreground"
            )}
            title="Toggle Else / NO Path fallback"
          >
            {hasNoPath ? "NO Path Active" : "+ Add Else Track"}
          </button>
        </div>
      </div>

      {/* Dual Outcome Output Handles */}
      {/* Left: YES Path Handle */}
      <div className="absolute -bottom-2 left-[30%] -translate-x-1/2 flex flex-col items-center">
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${data.branchId}_yes`}
          className="w-3 h-3 !bg-emerald-500 border-2 border-background"
        />
        <span className="text-[7.5px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter mt-1 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20 pointer-events-none">
          YES (Win)
        </span>
      </div>

      {/* Right: NO Path Handle (if active) */}
      {hasNoPath && (
        <div className="absolute -bottom-2 right-[30%] translate-x-1/2 flex flex-col items-center">
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${data.branchId}_no`}
            className="w-3 h-3 !bg-violet-500 border-2 border-background"
          />
          <span className="text-[7.5px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-tighter mt-1 bg-violet-500/10 px-1 py-0.5 rounded border border-violet-500/20 pointer-events-none">
            NO (Else)
          </span>
        </div>
      )}
    </div>
  );
});
RewardsConditionNode.displayName = "RewardsConditionNode";

// ── Action Node ──────────────────────────────────────────────────────────────

export const RewardsActionNode = memo(({ data, selected }: NodeProps<any>) => {
  const action = data.action || {};
  const meta = getActionVisuals(action.type);
  const Icon = meta.icon;
  const isNoPath = String(action.branch || "").endsWith("_no");

  const renderActionSummary = () => {
    switch (action.type) {
      case "AWARD_POINTS":
        return `+${action.points?.points || 0} Points`;
      case "AWARD_CURRENCY":
        return `+${action.currency?.amount || 0} ${action.currency?.currencyType || "Coins"}`;
      case "NOTIFICATION":
        return action.pushTitle || action.notificationMessage || "Push Alert";
      case "EMAIL":
        return action.emailSubject || "Automated Email";
      case "ASSIGN_MEMBERSHIP_TIER":
        return action.tierName || "Assign Membership Tier";
      case "ADD_MEMBER_TAG":
        return (action.tags || []).join(", ") || "Member Tags";
      case "ISSUE_COUPON":
        return action.reward?.rewardTitle || "Reward Voucher";
      case "AWARD_BADGE":
        return action.badge?.badgeName || "Gamification Badge";
      case "CUSTOM_WEBHOOK":
      case "WEBHOOK":
        return action.webhook?.url || "HTTP Webhook";
      default:
        return meta.label;
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        data?.onSelect?.();
      }}
      className={cn(
        "group relative w-[210px] rounded-xl bg-card border transition-all duration-200 cursor-pointer select-none shadow-sm",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
          : "border-border/80 hover:border-border hover:shadow-md"
      )}
    >
      {/* Top Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="action-in"
        className={cn(
          "w-2.5 h-2.5 border-2 border-background",
          isNoPath ? "!bg-violet-500" : "!bg-emerald-500"
        )}
      />

      {/* Top Accent Strip */}
      <div className={cn("h-1 w-full rounded-t-xl bg-gradient-to-r", meta.color)} />

      <div className="p-2.5 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs",
                meta.bg
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                Action
              </span>
              <h5 className="text-[11px] font-bold text-foreground truncate">
                {meta.label}
              </h5>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-[7.5px] font-extrabold px-1 py-0 h-4 uppercase",
              isNoPath
                ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            )}
          >
            {isNoPath ? "NO Track" : "YES Track"}
          </Badge>
        </div>

        {/* Action Payload Preview */}
        <div className="p-1.5 rounded-lg bg-muted/60 border border-border/40 text-[9.5px] font-semibold text-foreground truncate">
          {renderActionSummary()}
        </div>

        {/* Quick Toolbar */}
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px]">
          <span className="text-muted-foreground font-medium flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-amber-500" />
            Automated
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                data?.onDuplicate?.();
              }}
              className="text-muted-foreground hover:text-foreground p-0.5"
              title="Duplicate Action"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                data?.onDelete?.();
              }}
              className="text-muted-foreground hover:text-destructive p-0.5"
              title="Delete Action"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Output Handle to Next Action */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="action-out"
        className={cn(
          "w-2.5 h-2.5 border-2 border-background",
          isNoPath ? "!bg-violet-500" : "!bg-emerald-500"
        )}
      />
    </div>
  );
});
RewardsActionNode.displayName = "RewardsActionNode";

// ── Add Action Node ──────────────────────────────────────────────────────────

export const RewardsAddActionNode = memo(({ data }: NodeProps<any>) => {
  const isNoPath = data.path === "no";

  return (
    <div className="w-[210px] flex items-center justify-center select-none">
      <Handle
        type="target"
        position={Position.Top}
        id="add-action-in"
        className={cn(
          "w-2 h-2 border border-background",
          isNoPath ? "!bg-violet-500" : "!bg-emerald-500"
        )}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full h-8 rounded-xl border border-dashed flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all shadow-2xs hover:shadow-xs",
              isNoPath
                ? "border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/5 hover:bg-violet-500/10"
                : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
            )}
          >
            <Plus className="w-3 h-3" />
            Add {isNoPath ? "Consolation" : "Reward"} Action
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 text-xs">
          <DropdownMenuLabel>
            Select Action for {isNoPath ? "NO (Else)" : "YES"} Path
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("AWARD_POINTS")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" /> Award Points
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("AWARD_CURRENCY")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Credit Currency
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("NOTIFICATION")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-purple-500" /> Send Push Notification
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("EMAIL")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-500" /> Send Email
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("ISSUE_COUPON")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-rose-500" /> Issue Voucher / Coupon
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("ADD_MEMBER_TAG")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-teal-500" /> Add Member Tag
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("ASSIGN_MEMBERSHIP_TIER")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-orange-500" /> Upgrade Tier
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => data?.onAddAction?.("CUSTOM_WEBHOOK")}
            className="gap-2 text-xs font-medium cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-500" /> Trigger Webhook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
RewardsAddActionNode.displayName = "RewardsAddActionNode";
