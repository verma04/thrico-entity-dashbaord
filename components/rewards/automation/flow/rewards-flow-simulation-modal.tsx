"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  Coins,
  Bell,
  Mail,
  Gift,
  Award,
} from "lucide-react";
import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleConditionInput,
  RewardRuleActionInput,
  RewardRuleBranchItem,
} from "@/graphql/rewards-automation";
import {
  getActionBranchId,
  getActionPath,
} from "@/store/useRewardsAutomationStore";
import { RewardsSimulationProfile, SimulationResult } from "./types";
import { cn } from "@/lib/utils";

const SAMPLE_PROFILES: {
  label: string;
  badge: string;
  profile: RewardsSimulationProfile;
}[] = [
  {
    label: "Winning Spin Participant (Jackpot)",
    badge: "Win Match",
    profile: {
      name: "Marcus Vance",
      email: "marcus.vance@example.com",
      pointsBalance: 320,
      currencyBalance: 45,
      currentTier: "VIP Gold",
      isWinner: true,
      gameConfigId: "sp_wheel_vip_01",
      gameTitle: "VIP High Roller Spin Wheel",
      prizeType: "JACKPOT",
      faceValue: 100,
      streakCount: 14,
      tags: ["VIP", "Frequent Player"],
    },
  },
  {
    label: "Consolation Spin Participant (No Win)",
    badge: "Consolation Match",
    profile: {
      name: "Alex Rivers",
      email: "alex.rivers@example.com",
      pointsBalance: 15,
      currencyBalance: 2,
      currentTier: "Member",
      isWinner: false,
      gameConfigId: "sp_wheel_daily_02",
      gameTitle: "Daily Free Spin Wheel",
      prizeType: "NO_REWARDS",
      faceValue: 0,
      streakCount: 2,
      tags: ["Casual"],
    },
  },
  {
    label: "High-Tier Voucher Redeemer",
    badge: "Voucher Claim",
    profile: {
      name: "Sophia Chen",
      email: "sophia.chen@example.com",
      pointsBalance: 1250,
      currencyBalance: 180,
      currentTier: "Platinum VIP",
      isWinner: true,
      prizeType: "VOUCHER",
      faceValue: 150,
      streakCount: 30,
      tags: ["High Spender", "VIP"],
    },
  },
];

interface RewardsFlowSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: RewardAutomationModule;
  trigger: RewardRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: RewardRuleConditionInput[];
  actions: RewardRuleActionInput[];
  branches: RewardRuleBranchItem[];
  onSimulationRun?: (result: SimulationResult) => void;
}

export const RewardsFlowSimulationModal: React.FC<
  RewardsFlowSimulationModalProps
> = ({
  open,
  onOpenChange,
  module,
  trigger,
  conditionOperator,
  conditions,
  actions,
  branches,
  onSimulationRun,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<RewardsSimulationProfile>(
    SAMPLE_PROFILES[0].profile
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const evaluateRule = (profile: RewardsSimulationProfile): SimulationResult => {
    const primaryBranchId = branches[0]?.id || "branch_1";
    const branchConditions = conditions.filter(
      (c) => (c.branch || "branch_1") === primaryBranchId
    );

    if (branchConditions.length === 0) {
      const yesActions = actions.filter(
        (a) => getActionBranchId(a) === primaryBranchId && getActionPath(a) === "yes"
      );
      return {
        passed: true,
        conditionResults: [],
        executedActions: yesActions,
        branchPathTaken: "yes",
        reason: "No condition filters configured — all participants routed to YES path.",
      };
    }

    const conditionResults = branchConditions.map((cond) => {
      let actualValue: any;
      if (cond.field === "context.isWinner") actualValue = profile.isWinner;
      else if (cond.field === "context.prizeType") actualValue = profile.prizeType;
      else if (cond.field === "context.faceValue") actualValue = profile.faceValue;
      else if (cond.field === "context.configId") actualValue = profile.gameConfigId;
      else if (cond.field === "member.pointsBalance") actualValue = profile.pointsBalance;
      else if (cond.field === "member.streakDays") actualValue = profile.streakCount;
      else if (cond.field === "member.tier") actualValue = profile.currentTier;
      else actualValue = (profile as any)[cond.field] ?? true;

      let passed = false;
      const targetVal = cond.value;

      switch (cond.operator) {
        case "equals":
          passed =
            String(actualValue).toLowerCase() === String(targetVal).toLowerCase() ||
            actualValue === "ALL" ||
            targetVal === "ALL";
          break;
        case "not_equals":
          passed = String(actualValue).toLowerCase() !== String(targetVal).toLowerCase();
          break;
        case "greater_than":
          passed = Number(actualValue) > Number(targetVal);
          break;
        case "greater_than_or_equal":
          passed = Number(actualValue) >= Number(targetVal);
          break;
        case "less_than":
          passed = Number(actualValue) < Number(targetVal);
          break;
        case "less_than_or_equal":
          passed = Number(actualValue) <= Number(targetVal);
          break;
        case "contains":
          passed = String(actualValue)
            .toLowerCase()
            .includes(String(targetVal).toLowerCase());
          break;
        default:
          passed = true;
      }

      return {
        field: cond.field,
        passed,
        actualValue,
      };
    });

    const overallPassed =
      conditionOperator === "AND"
        ? conditionResults.every((r) => r.passed)
        : conditionResults.some((r) => r.passed);

    const pathTaken: "yes" | "no" = overallPassed ? "yes" : "no";

    const executedActions = actions.filter(
      (a) =>
        getActionBranchId(a) === primaryBranchId &&
        getActionPath(a) === pathTaken
    );

    return {
      passed: overallPassed,
      conditionResults,
      executedActions,
      branchPathTaken: pathTaken,
      reason: overallPassed
        ? `Matched ${conditionResults.length} criteria in ${conditionOperator} evaluation.`
        : `Criteria failed — routing to ${pathTaken.toUpperCase()} (Consolation / Fallback) Track.`,
    };
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setResult(null);

    setTimeout(() => {
      const simResult = evaluateRule(selectedProfile);
      setResult(simResult);
      setIsRunning(false);
      onSimulationRun?.(simResult);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Automation Flow Simulator
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                Test decision paths (YES vs NO) with sample game & participant states.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Sample Persona Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Select Test Participant State
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {SAMPLE_PROFILES.map((sample, i) => {
                const isSelected = selectedProfile.name === sample.profile.name;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedProfile(sample.profile);
                      setResult(null);
                    }}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer space-y-1.5",
                      isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                        : "bg-background border-border/70 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-[8px] font-bold px-1 py-0 h-4"
                      >
                        {sample.badge}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {sample.profile.isWinner ? "Winner" : "No Win"}
                      </span>
                    </div>
                    <h5 className="text-[11px] font-bold text-foreground truncate">
                      {sample.profile.name}
                    </h5>
                    <p className="text-[9.5px] text-muted-foreground truncate">
                      {sample.profile.prizeType} • {sample.profile.pointsBalance} pts
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Result Box */}
          {result && (
            <div className="space-y-3 p-4 rounded-xl border border-border bg-muted/20 animate-in fade-in duration-200">
              {/* Outcome Header Banner */}
              <div
                className={cn(
                  "p-3 rounded-lg border flex items-center justify-between",
                  result.branchPathTaken === "yes"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300"
                )}
              >
                <div className="flex items-center gap-2">
                  {result.branchPathTaken === "yes" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-violet-500 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      {result.branchPathTaken === "yes"
                        ? "Evaluated TRUE ➔ YES Track Executed"
                        : "Evaluated FALSE ➔ NO (Consolation) Track Executed"}
                    </h4>
                    <p className="text-[10px] opacity-90 leading-tight">
                      {result.reason}
                    </p>
                  </div>
                </div>

                <Badge
                  className={cn(
                    "text-[9px] font-extrabold px-2 py-0.5 uppercase",
                    result.branchPathTaken === "yes"
                      ? "bg-emerald-500 text-white"
                      : "bg-violet-500 text-white"
                  )}
                >
                  {result.branchPathTaken === "yes" ? "YES Path" : "NO Path"}
                </Badge>
              </div>

              {/* Conditions Breakdown */}
              {result.conditionResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10.5px] font-bold text-foreground block">
                    Criteria Breakdown
                  </span>
                  <div className="space-y-1">
                    {result.conditionResults.map((cr, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 rounded-lg border border-border/60 bg-card flex items-center justify-between text-[10px]"
                      >
                        <div className="flex items-center gap-1.5">
                          {cr.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          )}
                          <span className="font-semibold text-foreground">
                            {cr.field}: Actual value ={" "}
                            <code>{String(cr.actualValue)}</code>
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-bold px-1.5 py-0 h-4",
                            cr.passed
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                          )}
                        >
                          {cr.passed ? "PASSED" : "FAILED"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Executed Actions List */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-bold text-foreground block">
                  Actions Executed in this Run ({result.executedActions.length})
                </span>
                {result.executedActions.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">
                    No actions configured on the {result.branchPathTaken.toUpperCase()} track.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {result.executedActions.map((act, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-lg border border-border/80 bg-background flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-bold text-foreground">
                            {act.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {act.pushTitle ||
                              (act.points ? `+${act.points.points} pts` : "") ||
                              (act.currency
                                ? `+${act.currency.amount} ${act.currency.currencyType}`
                                : "")}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[8px] font-bold text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                        >
                          FIRED ✓
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-3.5 border-t border-border bg-card flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close Simulator
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isRunning}
            onClick={handleRunSimulation}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Run Test Pipeline
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
