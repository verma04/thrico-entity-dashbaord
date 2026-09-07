"use client";

import React from "react";
import {
  Sparkles,
  Filter,
  Plus,
} from "lucide-react";
import {
  PolarisFormCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { Button } from "@/components/ui/button";
import {
  SurveyRuleActionInput,
} from "@/graphql/survey-automation";
import { MemberRuleActionInput } from "@/graphql/member-automation";
import { ActionBuilder } from "@/components/members/settings/rules/action-builder";
import { toast } from "sonner";

interface SurveyActionPipelineCardProps {
  actions: SurveyRuleActionInput[];
  onActionsChange: (actions: SurveyRuleActionInput[]) => void;
}

/**
 * Converts SurveyRuleActionInput[] to MemberRuleActionInput[] for ActionBuilder.
 * The two types share identical fields; survey actions additionally carry
 * conditionOperator / conditions for branch filters.
 */
function toMemberActions(actions: SurveyRuleActionInput[]): MemberRuleActionInput[] {
  return actions.map(({ conditionOperator: _co, conditions: _c, ...rest }) => rest as MemberRuleActionInput);
}

/**
 * Merges back MemberRuleActionInput[] from ActionBuilder with the original
 * SurveyRuleActionInput[] to preserve branch-filter fields.
 */
function mergeSurveyActions(
  prev: SurveyRuleActionInput[],
  next: MemberRuleActionInput[]
): SurveyRuleActionInput[] {
  // ActionBuilder uses a toggle model (one per type).
  // We rebuild the survey action list to match the new member action list,
  // preserving per-type branch conditions from the previous state.
  return next.map((memberAction) => {
    const existing = prev.find((a) => a.type === memberAction.type);
    return {
      ...memberAction,
      conditionOperator: existing?.conditionOperator ?? "AND",
      conditions: existing?.conditions ?? [],
    } as SurveyRuleActionInput;
  });
}

export const SurveyActionPipelineCard: React.FC<
  SurveyActionPipelineCardProps
> = ({ actions, onActionsChange }) => {
  const handleMemberActionsChange = (memberActions: MemberRuleActionInput[]) => {
    onActionsChange(mergeSurveyActions(actions, memberActions));
  };

  const handleAddBranchFilter = (actIdx: number) => {
    const updated = [...actions];
    const currentConds = updated[actIdx].conditions || [];
    updated[actIdx] = {
      ...updated[actIdx],
      conditions: [
        ...currentConds,
        {
          field: "context.selectedOptions",
          operator: "contains",
          value: "Mentorship",
        },
      ],
      conditionOperator: updated[actIdx].conditionOperator ?? "AND",
    };
    onActionsChange(updated);
  };

  const handleRemoveBranchCondition = (actIdx: number, condIdx: number) => {
    const updated = [...actions];
    const currentConds = [...(updated[actIdx].conditions || [])];
    currentConds.splice(condIdx, 1);
    updated[actIdx] = { ...updated[actIdx], conditions: currentConds };
    onActionsChange(updated);
  };

  const handleAddActionBlock = () => {
    onActionsChange([
      ...actions,
      {
        type: "EMAIL",
        emailSubject: "Thank you for completing our survey! 🎉",
        conditionOperator: "AND",
        conditions: [],
      },
    ]);
    toast.info("New action block added.");
  };

  return (
    <PolarisFormCard
      step={3}
      title="Multi-Branch Action Pipeline"
      description="Configure ordered action blocks with optional branch filters. Reuses the full Member Automation action builder for rich tier, email, circle, tag, and notification actions."
      icon={Sparkles}
    >
      <div className="space-y-6">
        {/* Rich ActionBuilder reused from /members/automation/create */}
        <ActionBuilder
          actions={toMemberActions(actions)}
          onChange={handleMemberActionsChange}
        />

        {/* Per-action Branch Execution Filters (survey-specific) */}
        {actions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-border">
              <Filter className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-xs font-bold text-foreground">
                Branch Execution Filters
              </span>
              <span className="text-[11px] text-muted-foreground">
                Optionally restrict each action to specific survey respondent conditions
              </span>
            </div>

            {actions.map((act, actIdx) => {
              const actConds = act.conditions || [];
              return (
                <div
                  key={actIdx}
                  className="p-3 rounded-lg bg-muted/40 border border-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {act.type}
                      </span>
                      <Filter className="w-3 h-3 text-cyan-600" />
                      Branch Filter
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBranchFilter(actIdx)}
                      className="h-6 text-[11px] font-bold gap-1 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      + Filter
                    </Button>
                  </div>

                  {actConds.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">
                      ⚡ Runs unconditionally for all survey respondents.
                    </p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      {actConds.map((c, ci) => (
                        <div
                          key={ci}
                          className="flex items-center justify-between gap-2 p-2 rounded-md bg-background border border-cyan-500/30 text-xs"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[10px] font-bold uppercase text-cyan-700 dark:text-cyan-300">
                              🎯 Only run if:
                            </span>
                            <span className="font-semibold text-foreground">
                              [{c.field.replace("context.", "")}]
                            </span>
                            <span className="text-muted-foreground font-mono">
                              [{c.operator}]
                            </span>
                            <span className="font-bold text-cyan-600 dark:text-cyan-400">
                              ["{String(c.value)}"]
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveBranchCondition(actIdx, ci)
                            }
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Action Block button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddActionBlock}
          className="w-full h-10 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs font-bold gap-2 text-foreground cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ➕ Add Action Block
        </Button>
      </div>
    </PolarisFormCard>
  );
};
