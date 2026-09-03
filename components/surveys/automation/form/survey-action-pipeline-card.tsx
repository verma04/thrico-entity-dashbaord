"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  ShieldAlert,
  Filter,
  Plus,
} from "lucide-react";
import {
  PolarisFormCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SurveyRuleActionInput,
  SurveyRuleActionType,
} from "@/graphql/survey-automation";
import { toast } from "sonner";

interface SurveyActionPipelineCardProps {
  actions: SurveyRuleActionInput[];
  onActionsChange: (actions: SurveyRuleActionInput[]) => void;
}

export const SurveyActionPipelineCard: React.FC<
  SurveyActionPipelineCardProps
> = ({ actions, onActionsChange }) => {
  return (
    <PolarisFormCard
      step={3}
      title="Multi-Branch Action Pipeline"
      description="Configure ordered action cards with optional branch filters (e.g. Option contains 'Mentorship', Rating >= 4, or Universal)."
      icon={Sparkles}
    >
      <div className="space-y-4">
        {actions.map((act, actIdx) => {
          const actConds = act.conditions || [];

          return (
            <div
              key={actIdx}
              className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3.5 relative"
            >
              {/* Action Header */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Action #{actIdx + 1}
                  </span>
                  <Select
                    value={act.type}
                    onValueChange={(val) => {
                      const updated = [...actions];
                      updated[actIdx] = {
                        ...updated[actIdx],
                        type: val as SurveyRuleActionType,
                      };
                      onActionsChange(updated);
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs font-bold bg-background min-w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="ASSIGN_MEMBERSHIP_TIER"
                        className="text-xs"
                      >
                        🏆 Assign Membership Tier
                      </SelectItem>
                      <SelectItem value="EMAIL" className="text-xs">
                        ✉️ Send Transactional Email
                      </SelectItem>
                      <SelectItem value="COMMUNITY_JOIN" className="text-xs">
                        👥 Auto-Join Community Circle
                      </SelectItem>
                      <SelectItem value="NOTIFICATION" className="text-xs">
                        🔔 Mobile Push Notification
                      </SelectItem>
                      <SelectItem value="ADD_MEMBER_TAG" className="text-xs">
                        🏷️ Assign Member Tags
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const cloned = { ...act };
                      const updated = [...actions];
                      updated.splice(actIdx + 1, 0, cloned);
                      onActionsChange(updated);
                      toast.success("Action duplicated.");
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Duplicate Action"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onActionsChange(actions.filter((_, i) => i !== actIdx));
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Delete Action"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Action Specific Fields */}
              {act.type === "EMAIL" && (
                <div className="space-y-2">
                  <PolarisLabel>Email Subject Line</PolarisLabel>
                  <PolarisInput
                    id={`email-subj-${actIdx}`}
                    placeholder="e.g. Welcome to the Mentorship Cohort! 🎓"
                    value={act.emailSubject || ""}
                    onChange={(e) => {
                      const updated = [...actions];
                      updated[actIdx] = {
                        ...updated[actIdx],
                        emailSubject: e.target.value,
                      };
                      onActionsChange(updated);
                    }}
                  />
                </div>
              )}

              {act.type === "ASSIGN_MEMBERSHIP_TIER" && (
                <div className="space-y-2">
                  <PolarisLabel>Target Membership Tier</PolarisLabel>
                  <PolarisInput
                    id={`tier-id-${actIdx}`}
                    placeholder="e.g. Gold Tier / VIP"
                    value={act.tierId || ""}
                    onChange={(e) => {
                      const updated = [...actions];
                      updated[actIdx] = {
                        ...updated[actIdx],
                        tierId: e.target.value,
                      };
                      onActionsChange(updated);
                    }}
                  />
                </div>
              )}

              {act.type === "ADD_MEMBER_TAG" && (
                <div className="space-y-2">
                  <PolarisLabel>Member Tags (comma-separated)</PolarisLabel>
                  <PolarisInput
                    id={`tags-${actIdx}`}
                    placeholder="e.g. Mentorship Seeker, Cohort 2026"
                    value={act.tags?.join(", ") || ""}
                    onChange={(e) => {
                      const updated = [...actions];
                      updated[actIdx] = {
                        ...updated[actIdx],
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      };
                      onActionsChange(updated);
                    }}
                  />
                </div>
              )}

              {act.type === "COMMUNITY_JOIN" && (
                <div className="space-y-2">
                  <PolarisLabel>Community Circle ID</PolarisLabel>
                  <PolarisInput
                    id={`community-${actIdx}`}
                    placeholder="e.g. Developers & Hackers Hub"
                    value={act.communityId || ""}
                    onChange={(e) => {
                      const updated = [...actions];
                      updated[actIdx] = {
                        ...updated[actIdx],
                        communityId: e.target.value,
                      };
                      onActionsChange(updated);
                    }}
                  />
                </div>
              )}

              {act.type === "NOTIFICATION" && (
                <div className="space-y-2">
                  <PolarisLabel>Push Notification Title</PolarisLabel>
                  <PolarisInput
                    id={`push-${actIdx}`}
                    placeholder="e.g. Mentorship Cohort Active 🎓"
                    value={act.pushTitle || ""}
                    onChange={(e) => {
                      const updated = [...actions];
                      updated[actIdx] = {
                        ...updated[actIdx],
                        pushTitle: e.target.value,
                        push: true,
                      };
                      onActionsChange(updated);
                    }}
                  />
                </div>
              )}

              {/* Inline Condition Filter Footer */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-cyan-600" />
                    Branch Execution Filter
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
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
                        conditionOperator: "AND",
                      };
                      onActionsChange(updated);
                    }}
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
                          onClick={() => {
                            const updated = [...actions];
                            const currentConds = [
                              ...(updated[actIdx].conditions || []),
                            ];
                            currentConds.splice(ci, 1);
                            updated[actIdx] = {
                              ...updated[actIdx],
                              conditions: currentConds,
                            };
                            onActionsChange(updated);
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onActionsChange([
              ...actions,
              {
                type: "EMAIL",
                emailSubject: "Thank you for completing our survey! 🎉",
              },
            ]);
          }}
          className="w-full h-10 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs font-bold gap-2 text-foreground cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ➕ Add Action Block
        </Button>
      </div>
    </PolarisFormCard>
  );
};
