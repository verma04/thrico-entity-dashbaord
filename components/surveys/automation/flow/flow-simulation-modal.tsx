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
  User,
  Star,
  RefreshCw,
  ClipboardList,
  GitBranch,
} from "lucide-react";
import {
  SurveyRuleTrigger,
  SurveyRuleConditionInput,
  SurveyRuleActionInput,
} from "@/graphql/survey-automation";
import { SimulationSurveyResponse } from "./types";
import { cn } from "@/lib/utils";

const SAMPLE_SURVEY_RESPONSES: {
  label: string;
  badge: string;
  response: SimulationSurveyResponse;
}[] = [
  {
    label: "Mentorship Seeker (5-Star)",
    badge: "Mentorship",
    response: {
      respondentName: "Elena Rostova",
      respondentEmail: "elena@example.com",
      rating: 5,
      isPromoter: true,
      npsScore: 10,
      completionTimeSeconds: 45,
      answers: {
        satisfaction: "Extremely Satisfied",
        selectedOptions: ["Mentorship", "Alumni Networking"],
      },
      memberTags: ["alumni", "active"],
    },
  },
  {
    label: "Developer Contributor (3-Star)",
    badge: "Developer",
    response: {
      respondentName: "Alex Chen",
      respondentEmail: "alex@example.com",
      rating: 3,
      isPromoter: false,
      npsScore: 7,
      completionTimeSeconds: 75,
      answers: {
        satisfaction: "Neutral",
        selectedOptions: ["Developer", "Open Source"],
      },
      memberTags: ["dev"],
    },
  },
  {
    label: "Dissatisfied Detractor (1-Star)",
    badge: "Detractor 1★",
    response: {
      respondentName: "Devon Clark",
      respondentEmail: "devon@example.com",
      rating: 1,
      isPromoter: false,
      npsScore: 2,
      completionTimeSeconds: 120,
      answers: {
        satisfaction: "Dissatisfied",
        selectedOptions: ["General Feedback"],
      },
      memberTags: ["enterprise"],
    },
  },
];

interface FlowSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: SurveyRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: SurveyRuleConditionInput[];
  actions: SurveyRuleActionInput[];
  onSimulationRun: (result: {
    passed: boolean;
    conditionResults: { field: string; passed: boolean }[];
    executedActions: SurveyRuleActionInput[];
  }) => void;
}

export const SurveyFlowSimulationModal: React.FC<FlowSimulationModalProps> = ({
  open,
  onOpenChange,
  trigger,
  conditionOperator,
  conditions,
  actions,
  onSimulationRun,
}) => {
  const [selectedResponse, setSelectedResponse] =
    useState<SimulationSurveyResponse>(SAMPLE_SURVEY_RESPONSES[0].response);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    passed: boolean;
    steps: {
      step: string;
      title: string;
      desc: string;
      passed: boolean;
    }[];
  } | null>(null);

  const evaluateCondition = (
    cond: SurveyRuleConditionInput,
    res: SimulationSurveyResponse
  ): boolean => {
    let actualValue: any = "";
    if (cond.field === "context.rating") actualValue = res.rating;
    else if (cond.field === "context.isPromoter") actualValue = res.isPromoter;
    else if (cond.field === "context.npsScore") actualValue = res.npsScore;
    else if (cond.field === "context.isDetractor")
      actualValue = (res.rating ?? 5) <= 2;
    else if (cond.field === "context.selectedOptions")
      actualValue = res.answers?.selectedOptions?.join(", ") || "";
    else if (cond.field === "user.email") actualValue = res.respondentEmail;
    else if (cond.field === "userToEntity.tag")
      actualValue = res.memberTags?.join(", ") || "";

    const strActual = String(actualValue).toLowerCase();
    const strExpected = String(cond.value ?? "").toLowerCase();

    switch (cond.operator) {
      case "gte":
        return Number(actualValue) >= Number(cond.value);
      case "lte":
        return Number(actualValue) <= Number(cond.value);
      case "eq":
      case "equals":
        return strActual === strExpected;
      case "not_equals":
        return strActual !== strExpected;
      case "contains":
        return strActual.includes(strExpected);
      case "is_not_empty":
        return actualValue !== null && actualValue !== undefined && actualValue !== "";
      case "is_empty":
        return actualValue === null || actualValue === undefined || actualValue === "";
      default:
        return true;
    }
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationResult(null);

    setTimeout(() => {
      const triggerStep = {
        step: "Trigger",
        title: "Survey Response Captured",
        desc: `Triggered by event: ${trigger} from respondent ${selectedResponse.respondentName} (${selectedResponse.rating}-Star Rating, Answers: ${selectedResponse.answers?.selectedOptions?.join(", ") || "None"})`,
        passed: true,
      };

      const globalConditionResults = conditions.map((c) => ({
        field: c.field,
        passed: evaluateCondition(c, selectedResponse),
      }));

      let passedGlobal = true;
      if (conditions.length > 0) {
        if (conditionOperator === "AND") {
          passedGlobal = globalConditionResults.every((r) => r.passed);
        } else {
          passedGlobal = globalConditionResults.some((r) => r.passed);
        }
      }

      const globalConditionStep = {
        step: "Global Criteria",
        title: passedGlobal
          ? "Targeting Criteria Satisfied"
          : "Targeting Criteria Not Met",
        desc:
          conditions.length === 0
            ? "No global filters — evaluated all actions and branches."
            : `${globalConditionResults.filter((r) => r.passed).length} of ${conditions.length} global condition rules matched.`,
        passed: passedGlobal,
      };

      const executedActions: SurveyRuleActionInput[] = [];

      const actionSteps = actions.map((act, i) => {
        let actionPassed = passedGlobal;

        if (actionPassed && act.conditions && act.conditions.length > 0) {
          const actCondResults = act.conditions.map((c) =>
            evaluateCondition(c, selectedResponse)
          );
          if ((act.conditionOperator || "AND") === "AND") {
            actionPassed = actCondResults.every(Boolean);
          } else {
            actionPassed = actCondResults.some(Boolean);
          }
        }

        if (actionPassed) {
          executedActions.push(act);
        }

        const branchInfo =
          act.conditions && act.conditions.length > 0
            ? ` [Branch: ${act.conditions.map((c) => `${c.field.replace("context.", "")} ${c.operator} ${c.value}`).join(", ")}]`
            : "";

        return {
          step: `Action #${i + 1}`,
          title: `${act.type.replace(/_/g, " ")}${branchInfo}`,
          desc: actionPassed
            ? "Branch criteria matched -> Action dispatched to pipeline!"
            : "Action skipped (branch condition not met).",
          passed: actionPassed,
        };
      });

      const fullResult = {
        passed: executedActions.length > 0,
        steps: [triggerStep, globalConditionStep, ...actionSteps],
      };

      setSimulationResult(fullResult);
      setIsRunning(false);

      onSimulationRun({
        passed: executedActions.length > 0,
        conditionResults: globalConditionResults,
        executedActions,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Survey Flow & Branching Dry-Run Simulator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Preset Selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground">
              Select Sample Survey Submission
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_SURVEY_RESPONSES.map((sample, idx) => {
                const isSelected =
                  selectedResponse.respondentEmail === sample.response.respondentEmail;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedResponse(sample.response);
                      setSimulationResult(null);
                    }}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground truncate">
                        {sample.response.respondentName}
                      </span>
                      <Badge variant="outline" className="text-[9px]">
                        {sample.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {sample.response.rating} Stars · {sample.response.answers?.selectedOptions?.join(", ")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Payload Box */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Active Test Payload
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {selectedResponse.respondentEmail}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">Rating:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {selectedResponse.rating} / 5 Stars
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Selected Options:</span>
                <span className="font-semibold text-foreground truncate block">
                  {selectedResponse.answers?.selectedOptions?.join(", ") || "None"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">NPS Score:</span>
                <span className="font-semibold text-foreground">
                  {selectedResponse.npsScore} / 10
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="w-full h-9 text-xs font-bold gap-2 bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-700 text-primary-foreground shadow-md cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Simulating Multi-Branch Pipeline...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Multi-Branch Pipeline Simulation
              </>
            )}
          </Button>

          {/* Trace */}
          {simulationResult && (
            <div className="p-4 rounded-xl border border-border bg-card space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
                  Simulation Execution Trace
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5",
                    simulationResult.passed
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                  )}
                >
                  {simulationResult.passed ? "BRANCHES EXECUTED" : "NO BRANCH MATCHED"}
                </Badge>
              </div>

              <div className="space-y-2">
                {simulationResult.steps.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/60 text-xs"
                  >
                    {st.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{st.step}:</span>
                        <span className="font-medium text-foreground">{st.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Close & View on Canvas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
