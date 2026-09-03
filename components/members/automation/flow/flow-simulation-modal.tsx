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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  User,
  School,
  Building,
  Mail,
  Zap,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
} from "@/graphql/member-automation";
import { SimulationMemberProfile } from "./types";
import { cn } from "@/lib/utils";

const SAMPLE_PROFILES: {
  label: string;
  badge: string;
  profile: SimulationMemberProfile;
}[] = [
  {
    label: "Stanford Alumni Applicant",
    badge: "Match Alum",
    profile: {
      name: "Alex Rivers",
      email: "alex.rivers@alumni.stanford.edu",
      college: "Stanford University",
      graduationYear: "2024",
      gender: "FEMALE",
      city: "Palo Alto",
      country: "United States",
      company: "Stripe",
      jobTitle: "Product Designer",
      tags: ["verified", "alumni"],
    },
  },
  {
    label: "Corporate Enterprise Member",
    badge: "Match Corp",
    profile: {
      name: "Marcus Vance",
      email: "marcus.vance@company.com",
      college: "MIT",
      graduationYear: "2021",
      gender: "MALE",
      city: "San Francisco",
      country: "United States",
      company: "Google",
      jobTitle: "Software Engineer",
      tags: ["enterprise"],
    },
  },
  {
    label: "Standard Community Member",
    badge: "General",
    profile: {
      name: "Jordan Lee",
      email: "jordan@gmail.com",
      college: "Community College",
      graduationYear: "2025",
      gender: "NON_BINARY",
      city: "Austin",
      country: "United States",
      company: "Freelance",
      jobTitle: "Creator",
      tags: ["general"],
    },
  },
];

interface FlowSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: MemberRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  onSimulationRun: (result: {
    passed: boolean;
    conditionResults: { field: string; passed: boolean }[];
    executedActions: MemberRuleActionInput[];
  }) => void;
}

export const FlowSimulationModal: React.FC<FlowSimulationModalProps> = ({
  open,
  onOpenChange,
  trigger,
  conditionOperator,
  conditions,
  actions,
  onSimulationRun,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<SimulationMemberProfile>(
    SAMPLE_PROFILES[0].profile
  );
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
    cond: MemberRuleConditionInput,
    profile: SimulationMemberProfile
  ): boolean => {
    let actualValue: any = "";
    if (cond.field === "profile.college") actualValue = profile.college || "";
    else if (cond.field === "user.email") actualValue = profile.email || "";
    else if (cond.field === "profile.company") actualValue = profile.company || "";
    else if (cond.field === "profile.jobTitle") actualValue = profile.jobTitle || "";
    else if (cond.field === "profile.city") actualValue = profile.city || "";
    else if (cond.field === "profile.country") actualValue = profile.country || "";
    else if (cond.field === "profile.graduationYear")
      actualValue = profile.graduationYear || "";
    else if (cond.field === "userToEntity.tag")
      actualValue = profile.tags?.join(", ") || "";

    const strActual = String(actualValue).toLowerCase();
    const strExpected = String(cond.value || "").toLowerCase();

    switch (cond.operator) {
      case "equals":
        return strActual === strExpected;
      case "not_equals":
        return strActual !== strExpected;
      case "contains":
        return strActual.includes(strExpected);
      case "is_not_empty":
        return actualValue !== "" && actualValue !== null && actualValue !== undefined;
      case "is_empty":
        return actualValue === "" || actualValue === null || actualValue === undefined;
      case "in":
        return strExpected.split(",").map((s) => s.trim()).includes(strActual);
      default:
        return true;
    }
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationResult(null);

    setTimeout(() => {
      // Step 1: Trigger Evaluation (Always passes in simulation)
      const triggerStep = {
        step: "Trigger",
        title: "Lifecycle Trigger Initiated",
        desc: `Triggered by event: ${trigger} for member ${selectedProfile.name}`,
        passed: true,
      };

      // Step 2: Conditions Evaluation
      const conditionResults = conditions.map((c) => ({
        field: c.field,
        passed: evaluateCondition(c, selectedProfile),
      }));

      let passedConditions = true;
      if (conditions.length > 0) {
        if (conditionOperator === "AND") {
          passedConditions = conditionResults.every((r) => r.passed);
        } else {
          passedConditions = conditionResults.some((r) => r.passed);
        }
      }

      const conditionStep = {
        step: "Conditions",
        title: passedConditions
          ? "Targeting Criteria Satisfied"
          : "Targeting Criteria Not Met",
        desc:
          conditions.length === 0
            ? "No conditions configured — universal match (100%)."
            : `${conditionResults.filter((r) => r.passed).length} of ${conditions.length} condition rules matched (${conditionOperator} mode).`,
        passed: passedConditions,
      };

      // Step 3: Actions Execution
      const actionSteps = actions.map((act, i) => ({
        step: `Action #${i + 1}`,
        title: `${act.type.replace(/_/g, " ")}`,
        desc: passedConditions
          ? "Action dispatched to pipeline."
          : "Action skipped (eligibility criteria was not satisfied).",
        passed: passedConditions,
      }));

      const fullResult = {
        passed: passedConditions,
        steps: [triggerStep, conditionStep, ...actionSteps],
      };

      setSimulationResult(fullResult);
      setIsRunning(false);

      onSimulationRun({
        passed: passedConditions,
        conditionResults,
        executedActions: passedConditions ? actions : [],
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Dry-Run & Flow Test Simulator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Preset Profile Selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground">
              Select Test Member Profile
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_PROFILES.map((sample, idx) => {
                const isSelected = selectedProfile.email === sample.profile.email;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedProfile(sample.profile);
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
                        {sample.profile.name}
                      </span>
                      <Badge variant="outline" className="text-[9px]">
                        {sample.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {sample.profile.college || sample.profile.company || sample.profile.email}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Member Profile Details Box */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Active Candidate Payload
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {selectedProfile.email}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block text-[10px]">College:</span>
                <span className="font-semibold text-foreground truncate block">
                  {selectedProfile.college || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Company:</span>
                <span className="font-semibold text-foreground truncate block">
                  {selectedProfile.company || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Role / Title:</span>
                <span className="font-semibold text-foreground truncate block">
                  {selectedProfile.jobTitle || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Run Button */}
          <Button
            type="button"
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="w-full h-9 text-xs font-bold gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-md cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Simulating Workflow Pipeline...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Flow Dry-Run Simulation
              </>
            )}
          </Button>

          {/* Simulation Output Trace */}
          {simulationResult && (
            <div className="p-4 rounded-xl border border-border bg-card space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
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
                  {simulationResult.passed ? "FLOW SUCCESS (MATCHED)" : "FLOW TERMINATED (NO MATCH)"}
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
