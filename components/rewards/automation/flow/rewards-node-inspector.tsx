"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  X,
  Zap,
  Filter,
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
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleActionType,
  RewardRuleConditionInput,
  RewardRuleActionInput,
  RewardRuleBranchItem,
  GET_AUTOMATION_METADATA,
} from "@/graphql/rewards-automation";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { useGetEntity } from "@/graphql/actions";
import { SelectedNodeInfo } from "./types";
import { getModuleVisuals, getActionVisuals } from "./rewards-custom-nodes";
import {
  getActionBranchId,
  getActionPath,
  formatActionBranch,
} from "@/store/useRewardsAutomationStore";
import { cn } from "@/lib/utils";

interface RewardsNodeInspectorProps {
  selectedNode: SelectedNodeInfo;
  module: RewardAutomationModule;
  trigger: RewardRuleTrigger;
  rewardId: string | null;
  rewardTitle: string | null;
  conditionOperator: "AND" | "OR";
  conditions: RewardRuleConditionInput[];
  actions: RewardRuleActionInput[];
  branches: RewardRuleBranchItem[];
  onModuleChange: (mod: RewardAutomationModule) => void;
  onTriggerChange: (trig: RewardRuleTrigger) => void;
  onRewardTargetChange: (id: string | null, title?: string | null) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: RewardRuleConditionInput[]) => void;
  onActionUpdate: (index: number, updates: Partial<RewardRuleActionInput>) => void;
  onActionDelete: (index: number) => void;
  onDeleteBranch: (branchId: string) => void;
  onDuplicateBranch?: (branchId: string) => void;
  onRenameBranch: (branchId: string, name: string) => void;
  onToggleNoPath: (branchId: string, enabled?: boolean) => void;
  onClose: () => void;
}

const CONDITION_FIELDS = [
  { value: "context.isWinner", label: "Outcome: Is Winner?", type: "boolean" },
  { value: "context.prizeType", label: "Prize Type", type: "select", options: ["JACKPOT", "COINS", "VOUCHER", "POINTS", "NO_REWARDS"] },
  { value: "context.faceValue", label: "Face Value / Points Amount", type: "number" },
  { value: "context.configId", label: "Game Config ID", type: "text" },
  { value: "context.rewardId", label: "Voucher / Reward ID", type: "text" },
  { value: "member.pointsBalance", label: "Member Points Balance", type: "number" },
  { value: "member.streakDays", label: "Member Activity Streak", type: "number" },
  { value: "member.tier", label: "Member Current Tier", type: "text" },
  { value: "profile.isVerified", label: "Profile Verified?", type: "boolean" },
];

const OPERATORS = [
  { value: "equals", label: "equals (=)" },
  { value: "not_equals", label: "not equals (≠)" },
  { value: "greater_than", label: "greater than (>)" },
  { value: "greater_than_or_equal", label: "greater than or equal (≥)" },
  { value: "less_than", label: "less than (<)" },
  { value: "less_than_or_equal", label: "less than or equal (≤)" },
  { value: "contains", label: "contains" },
];

export const RewardsNodeInspector: React.FC<RewardsNodeInspectorProps> = ({
  selectedNode,
  module,
  trigger,
  rewardId,
  rewardTitle,
  conditionOperator,
  conditions,
  actions,
  branches,
  onModuleChange,
  onTriggerChange,
  onRewardTargetChange,
  onConditionOperatorChange,
  onConditionsChange,
  onActionUpdate,
  onActionDelete,
  onDeleteBranch,
  onDuplicateBranch,
  onRenameBranch,
  onToggleNoPath,
  onClose,
}) => {
  const { data: entityData } = useGetEntity();
  const entityId = entityData?.getEntity?.id;

  const { data: metaData } = useQuery(GET_AUTOMATION_METADATA, {
    variables: { entityId },
    skip: !entityId,
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });


  const { data: tiersData } = useQuery(GET_MEMBERSHIP_TIERS, {
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });

  const membershipTiers = tiersData?.getMembershipTiers || [];

  // ── Render: Trigger Inspector ──────────────────────────────────────────────
  if (selectedNode.type === "trigger") {
    const modMeta = getModuleVisuals(module);

    return (
      <div className="w-[340px] h-full bg-card border-l border-border flex flex-col z-20 shrink-0 select-none overflow-hidden shadow-lg animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center font-bold", modMeta.bg)}>
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                Inspector
              </span>
              <h4 className="text-xs font-bold text-foreground truncate">
                Trigger Configuration
              </h4>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Module Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Module Engine
            </label>
            <Select value={module} onValueChange={(val) => onModuleChange(val as RewardAutomationModule)}>
              <SelectTrigger className="h-8 text-xs font-semibold">
                <SelectValue placeholder="Select Module" />
              </SelectTrigger>
              <SelectContent className="text-xs font-medium">
                <SelectItem value="SPIN_WHEEL">Spin the Wheel (Games)</SelectItem>
                <SelectItem value="SCRATCH_CARD">Scratch Card (Games)</SelectItem>
                <SelectItem value="MATCH_WIN">Match & Win (Games)</SelectItem>
                <SelectItem value="REWARDS">Rewards & Coupons (Vouchers)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trigger Event Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Trigger Event
            </label>
            <Select value={trigger} onValueChange={(val) => onTriggerChange(val as RewardRuleTrigger)}>
              <SelectTrigger className="h-8 text-xs font-semibold">
                <SelectValue placeholder="Select Trigger" />
              </SelectTrigger>
              <SelectContent className="text-xs font-medium">
                {module === "SPIN_WHEEL" && (
                  <>
                    <SelectItem value="SPIN_WHEEL_PLAYED">Spin Wheel Played</SelectItem>
                    <SelectItem value="PRIZE_WON">Prize Won</SelectItem>
                    <SelectItem value="NO_REWARDS">No Rewards (Consolation)</SelectItem>
                  </>
                )}
                {module === "SCRATCH_CARD" && (
                  <>
                    <SelectItem value="SCRATCH_CARD_PLAYED">Scratch Card Scratched</SelectItem>
                    <SelectItem value="PRIZE_WON">Prize Won</SelectItem>
                    <SelectItem value="NO_REWARDS">No Rewards (Consolation)</SelectItem>
                  </>
                )}
                {module === "MATCH_WIN" && (
                  <>
                    <SelectItem value="MATCH_WIN_PLAYED">Match & Win Played</SelectItem>
                    <SelectItem value="PRIZE_WON">Match Won</SelectItem>
                    <SelectItem value="NO_REWARDS">No Match (Consolation)</SelectItem>
                  </>
                )}
                {module === "REWARDS" && (
                  <>
                    <SelectItem value="REWARD_CLAIMED">Reward Claimed</SelectItem>
                    <SelectItem value="REWARD_REDEEMED">Reward Redeemed</SelectItem>
                    <SelectItem value="REWARD_EXPIRED">Reward Expired</SelectItem>
                  </>
                )}

              </SelectContent>
            </Select>
          </div>

          {/* Target Parent Selector */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Target Parent Scope
              </label>
              <Badge variant="outline" className="text-[8px] font-bold">
                context.configId
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Scope this automation to ALL active {modMeta.label.toLowerCase()} items, or bind to a specific one.
            </p>

            <Select
              value={rewardId || "ALL"}
              onValueChange={(val) =>
                onRewardTargetChange(val, val === "ALL" ? "All Active" : `Item ${val}`)
              }
            >
              <SelectTrigger className="h-8 text-xs font-semibold">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent className="text-xs font-medium">
                <SelectItem value="ALL">All Active Items (Wildcard)</SelectItem>
                <SelectItem value="sp_wheel_vip_01">VIP High Roller Spin Wheel</SelectItem>
                <SelectItem value="sp_wheel_daily_02">Daily Free Spin Wheel</SelectItem>
                <SelectItem value="sc_card_gold_01">Gold Fortune Scratch Card</SelectItem>
                <SelectItem value="sc_card_silver_02">Silver Scratch Card</SelectItem>
                <SelectItem value="mw_game_classic_01">Classic 3x3 Match & Win</SelectItem>
                <SelectItem value="rw_coupon_partner_10">Partner Discount Voucher ($10)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Condition / Branch Inspector ───────────────────────────────────
  if (selectedNode.type === "condition") {
    const branchId = selectedNode.data?.branchId || "branch_1";
    const branch = branches.find((b) => b.id === branchId) || branches[0];
    const branchConditions = conditions.filter(
      (c) => (c.branch || "branch_1") === branchId
    );
    const hasNoPath = Boolean(branch?.hasNoPath);

    const handleUpdateCond = (condIdx: number, updates: Partial<RewardRuleConditionInput>) => {
      const targetCond = branchConditions[condIdx];
      if (!targetCond) return;
      const globalIdx = conditions.indexOf(targetCond);
      if (globalIdx === -1) return;

      const next = [...conditions];
      next[globalIdx] = { ...next[globalIdx], ...updates };
      onConditionsChange(next);
    };

    const handleAddCond = () => {
      const newCond: RewardRuleConditionInput = {
        field: "context.isWinner",
        operator: "equals",
        value: true,
        branch: branchId,
      };
      onConditionsChange([...conditions, newCond]);
    };

    const handleDeleteCond = (condIdx: number) => {
      const targetCond = branchConditions[condIdx];
      if (!targetCond) return;
      const globalIdx = conditions.indexOf(targetCond);
      if (globalIdx === -1) return;
      onConditionsChange(conditions.filter((_, i) => i !== globalIdx));
    };

    return (
      <div className="w-[360px] h-full bg-card border-l border-border flex flex-col z-20 shrink-0 select-none overflow-hidden shadow-lg animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                Branch Inspector
              </span>
              <h4 className="text-xs font-bold text-foreground truncate">
                {branch?.name || "Branch 1"}
              </h4>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Branch Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Branch Name
            </label>
            <Input
              value={branch?.name || ""}
              onChange={(e) => onRenameBranch(branchId, e.target.value)}
              className="h-8 text-xs font-semibold"
              placeholder="e.g. Winning Spin, High Value Claim"
            />
          </div>

          {/* Logic Operator Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block leading-tight">
                Evaluation Operator
              </span>
              <p className="text-[9.5px] text-muted-foreground">
                Match {conditionOperator === "AND" ? "ALL criteria" : "ANY criterion"}
              </p>
            </div>
            <div className="flex rounded-md bg-muted p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => onConditionOperatorChange("AND")}
                className={cn(
                  "px-2 py-1 rounded transition-all",
                  conditionOperator === "AND"
                    ? "bg-card text-foreground shadow-2xs font-extrabold"
                    : "text-muted-foreground"
                )}
              >
                AND
              </button>
              <button
                type="button"
                onClick={() => onConditionOperatorChange("OR")}
                className={cn(
                  "px-2 py-1 rounded transition-all",
                  conditionOperator === "OR"
                    ? "bg-card text-foreground shadow-2xs font-extrabold"
                    : "text-muted-foreground"
                )}
              >
                OR
              </button>
            </div>
          </div>

          {/* Else / NO Path Switcher */}
          <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  Else / NO Path (Consolation)
                </span>
                <p className="text-[9.5px] text-muted-foreground leading-tight">
                  Enables alternate actions when criteria evaluate to false.
                </p>
              </div>
              <Switch
                checked={hasNoPath}
                onCheckedChange={(checked) => onToggleNoPath(branchId, checked)}
              />
            </div>
          </div>

          {/* Conditions List */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground">
                Target Conditions ({branchConditions.length})
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddCond}
                className="h-6 px-2 text-[10px] font-bold gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {branchConditions.map((cond, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-border/80 bg-background space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <Select
                      value={cond.field}
                      onValueChange={(val) => handleUpdateCond(i, { field: val })}
                    >
                      <SelectTrigger className="h-7 text-[10.5px] font-semibold flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        {CONDITION_FIELDS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCond(i)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <Select
                      value={cond.operator}
                      onValueChange={(val) => handleUpdateCond(i, { operator: val })}
                    >
                      <SelectTrigger className="h-7 text-[10px] font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                        {OPERATORS.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {cond.field === "context.isWinner" || cond.field === "profile.isVerified" ? (
                      <Select
                        value={String(cond.value)}
                        onValueChange={(val) =>
                          handleUpdateCond(i, { value: val === "true" })
                        }
                      >
                        <SelectTrigger className="h-7 text-[10px] font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                          <SelectItem value="true">True (Yes)</SelectItem>
                          <SelectItem value="false">False (No)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={cond.value ?? ""}
                        onChange={(e) =>
                          handleUpdateCond(i, {
                            value: isNaN(Number(e.target.value)) || e.target.value === ""
                              ? e.target.value
                              : Number(e.target.value),
                          })
                        }
                        className="h-7 text-[10.5px] font-medium"
                        placeholder="Value"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Action Inspector ───────────────────────────────────────────────
  if (selectedNode.type === "action") {
    const actionIndex = selectedNode.data?.index ?? 0;
    const action = actions[actionIndex] || selectedNode.data?.action || {};
    const meta = getActionVisuals(action.type);
    const Icon = meta.icon;
    const branchId = getActionBranchId(action);
    const path = getActionPath(action);

    const handleTogglePath = () => {
      const nextPath = path === "yes" ? "no" : "yes";
      onActionUpdate(actionIndex, {
        branch: formatActionBranch(branchId, nextPath),
      });
    };

    return (
      <div className="w-[360px] h-full bg-card border-l border-border flex flex-col z-20 shrink-0 select-none overflow-hidden shadow-lg animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center font-bold", meta.bg)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                Action Inspector
              </span>
              <h4 className="text-xs font-bold text-foreground truncate">
                {meta.label}
              </h4>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Action Type Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground">
              Action Type
            </label>
            <Select
              value={action.type}
              onValueChange={(val) =>
                onActionUpdate(actionIndex, { type: val as RewardRuleActionType })
              }
            >
              <SelectTrigger className="h-8 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs font-medium">
                <SelectItem value="AWARD_POINTS">Award Points</SelectItem>
                <SelectItem value="AWARD_CURRENCY">Credit Currency</SelectItem>
                <SelectItem value="NOTIFICATION">Send Push Alert</SelectItem>
                <SelectItem value="EMAIL">Send Email</SelectItem>
                <SelectItem value="ISSUE_COUPON">Issue Voucher / Coupon</SelectItem>
                <SelectItem value="ADD_MEMBER_TAG">Assign Member Tags</SelectItem>
                <SelectItem value="ASSIGN_MEMBERSHIP_TIER">Upgrade Membership Tier</SelectItem>
                <SelectItem value="AWARD_BADGE">Unlock Achievement Badge</SelectItem>
                <SelectItem value="CUSTOM_WEBHOOK">Fire Custom Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Track Placement (YES vs NO) */}
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                Execution Path
              </span>
              <p className="text-[9.5px] text-muted-foreground">
                Run on criteria match or consolation fallback
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleTogglePath}
              className={cn(
                "h-7 text-[10px] font-extrabold uppercase",
                path === "yes"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
              )}
            >
              {path === "yes" ? "YES Track (Win)" : "NO Track (Else)"}
            </Button>
          </div>

          {/* Action Specific Fields */}
          {action.type === "AWARD_POINTS" && (
            <div className="space-y-1.5 p-3 rounded-lg border border-border bg-background">
              <label className="text-[11px] font-bold text-foreground">
                Bonus Points Amount
              </label>
              <Input
                type="number"
                value={action.points?.points || 0}
                onChange={(e) =>
                  onActionUpdate(actionIndex, {
                    points: { points: Math.max(0, parseInt(e.target.value) || 0) },
                  })
                }
                className="h-8 text-xs font-bold"
                placeholder="e.g. 50"
              />
            </div>
          )}

          {action.type === "AWARD_CURRENCY" && (
            <div className="space-y-2 p-3 rounded-lg border border-border bg-background">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Currency Amount
                </label>
                <Input
                  type="number"
                  value={action.currency?.amount || 0}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, {
                      currency: {
                        amount: Math.max(0, parseInt(e.target.value) || 0),
                        currencyType: action.currency?.currencyType || "TC",
                      },
                    })
                  }
                  className="h-8 text-xs font-bold"
                  placeholder="e.g. 10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Currency Code
                </label>
                <Input
                  value={action.currency?.currencyType || "TC"}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, {
                      currency: {
                        amount: action.currency?.amount || 0,
                        currencyType: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  className="h-8 text-xs font-bold uppercase"
                  placeholder="e.g. TC, COINS"
                />
              </div>
            </div>
          )}

          {action.type === "NOTIFICATION" && (
            <div className="space-y-2.5 p-3 rounded-lg border border-border bg-background">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Push Title
                </label>
                <Input
                  value={action.pushTitle || ""}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, { pushTitle: e.target.value })
                  }
                  className="h-8 text-xs font-semibold"
                  placeholder="e.g. Winner! 🎡"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Notification Body
                </label>
                <Textarea
                  value={action.pushBody || action.notificationMessage || ""}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, {
                      pushBody: e.target.value,
                      notificationMessage: e.target.value,
                    })
                  }
                  rows={3}
                  className="text-xs"
                  placeholder="Your prize has been credited to your wallet."
                />
              </div>
            </div>
          )}

          {action.type === "EMAIL" && (
            <div className="space-y-2.5 p-3 rounded-lg border border-border bg-background">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Email Subject
                </label>
                <Input
                  value={action.emailSubject || ""}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, { emailSubject: e.target.value })
                  }
                  className="h-8 text-xs font-semibold"
                  placeholder="Congratulations on your reward! 🎁"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Email Body (HTML / Text)
                </label>
                <Textarea
                  value={action.emailBody || ""}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, { emailBody: e.target.value })
                  }
                  rows={4}
                  className="text-xs font-mono"
                  placeholder="<p>Hi {{firstName}}, you unlocked a reward!</p>"
                />
              </div>
            </div>
          )}

          {action.type === "ASSIGN_MEMBERSHIP_TIER" && (
            <div className="space-y-1.5 p-3 rounded-lg border border-border bg-background">
              <label className="text-[11px] font-bold text-foreground">
                Target Membership Tier
              </label>
              <Select
                value={action.tierId || ""}
                onValueChange={(val) => {
                  const target = membershipTiers.find((t: any) => t.id === val);
                  onActionUpdate(actionIndex, {
                    tierId: val,
                    tierName: target?.name || "Selected Tier",
                  });
                }}
              >
                <SelectTrigger className="h-8 text-xs font-semibold">
                  <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {membershipTiers.map((tier: any) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      {tier.name}
                    </SelectItem>
                  ))}
                  {membershipTiers.length === 0 && (
                    <SelectItem value="tier_vip">VIP Gold Member</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {action.type === "ADD_MEMBER_TAG" && (
            <div className="space-y-1.5 p-3 rounded-lg border border-border bg-background">
              <label className="text-[11px] font-bold text-foreground">
                Member Tags (comma separated)
              </label>
              <Input
                value={(action.tags || []).join(", ")}
                onChange={(e) =>
                  onActionUpdate(actionIndex, {
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="h-8 text-xs font-medium"
                placeholder="VIP Rewards, Spin Winner, High Spender"
              />
            </div>
          )}

          {action.type === "ISSUE_COUPON" && (
            <div className="space-y-1.5 p-3 rounded-lg border border-border bg-background">
              <label className="text-[11px] font-bold text-foreground">
                Reward / Voucher Title
              </label>
              <Input
                value={action.reward?.rewardTitle || ""}
                onChange={(e) =>
                  onActionUpdate(actionIndex, {
                    reward: {
                      rewardId: action.reward?.rewardId || "rw_custom",
                      rewardTitle: e.target.value,
                    },
                  })
                }
                className="h-8 text-xs font-semibold"
                placeholder="20% Off Store Voucher"
              />
            </div>
          )}

          {action.type === "AWARD_BADGE" && (
            <div className="space-y-1.5 p-3 rounded-lg border border-border bg-background">
              <label className="text-[11px] font-bold text-foreground">
                Badge Name
              </label>
              <Input
                value={action.badge?.badgeName || ""}
                onChange={(e) =>
                  onActionUpdate(actionIndex, {
                    badge: {
                      badgeId: action.badge?.badgeId || "badge_custom",
                      badgeName: e.target.value,
                    },
                  })
                }
                className="h-8 text-xs font-semibold"
                placeholder="Jackpot Champion"
              />
            </div>
          )}

          {action.type === "CUSTOM_WEBHOOK" && (
            <div className="space-y-2 p-3 rounded-lg border border-border bg-background">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Webhook Endpoint URL
                </label>
                <Input
                  value={action.webhook?.url || ""}
                  onChange={(e) =>
                    onActionUpdate(actionIndex, {
                      webhook: {
                        ...(action.webhook || {}),
                        url: e.target.value,
                        method: action.webhook?.method || "POST",
                      },
                    })
                  }
                  className="h-8 text-xs font-mono"
                  placeholder="https://api.merchant.com/v1/gamification"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  HTTP Method
                </label>
                <Select
                  value={action.webhook?.method || "POST"}
                  onValueChange={(val) =>
                    onActionUpdate(actionIndex, {
                      webhook: {
                        ...(action.webhook || {}),
                        url: action.webhook?.url || "",
                        method: val,
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Delete Action CTA */}
          <div className="pt-3 border-t border-border">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onActionDelete(actionIndex)}
              className="w-full h-8 text-xs font-bold gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Action
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
