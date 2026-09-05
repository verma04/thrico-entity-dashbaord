"use client";

import React, { useState } from "react";
import {
  Zap,
  Filter,
  Award,
  Mail,
  Users,
  Bell,
  Tag,
  Sparkles,
  Plus,
  Star,
  ShieldAlert,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  ClipboardList,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SurveyRuleTrigger,
  SurveyRuleActionType,
} from "@/graphql/survey-automation";
import { cn } from "@/lib/utils";

const SURVEY_PALETTE_ACTIONS: {
  type: SurveyRuleActionType;
  label: string;
  desc: string;
  icon: any;
  color: string;
  badge: string;
}[] = [
  {
    type: "ASSIGN_MEMBERSHIP_TIER",
    label: "Assign Tier",
    desc: "Reward tier upgrade",
    icon: Award,
    color: "from-amber-500 to-amber-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
    badge: "Reward",
  },
  {
    type: "EMAIL",
    label: "Send Email",
    desc: "Email Studio template",
    icon: Mail,
    color: "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    badge: "Email",
  },
  {
    type: "COMMUNITY_JOIN",
    label: "Join Circle",
    desc: "Auto-enroll respondent",
    icon: Users,
    color: "from-blue-500 to-blue-600 text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "Community",
  },
  {
    type: "NOTIFICATION",
    label: "Push Alert",
    desc: "Mobile & bell alert",
    icon: Bell,
    color: "from-purple-500 to-purple-600 text-purple-600 bg-purple-500/10 border-purple-500/20",
    badge: "Alert",
  },
  {
    type: "ADD_MEMBER_TAG",
    label: "Member Tags",
    desc: "Tag respondent profile",
    icon: Tag,
    color: "from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badge: "Tagging",
  },
];

export const SURVEY_TEMPLATE_RECIPES = [
  {
    title: "Multi-Option Survey Branching Pipeline",
    badge: "3 Branches",
    icon: GitBranch,
    trigger: "SURVEY_SUBMITTED" as SurveyRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [],
    actions: [
      // Branch 1: Mentorship
      {
        type: "EMAIL" as const,
        emailSubject: "Welcome to Mentorship Circle! 🎓",
        emailBody: "<p>Hi {{firstName}}, your mentor matches are ready.</p>",
        conditions: [
          { field: "context.selectedOptions", operator: "contains", value: "Mentorship" },
        ],
      },
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Mentorship Seeker"],
        conditions: [
          { field: "context.selectedOptions", operator: "contains", value: "Mentorship" },
        ],
      },
      {
        type: "NOTIFICATION" as const,
        pushTitle: "Mentorship Cohort Active 🎓",
        push: true,
        conditions: [
          { field: "context.selectedOptions", operator: "contains", value: "Mentorship" },
        ],
      },

      // Branch 2: Developer
      {
        type: "EMAIL" as const,
        emailSubject: "Developer Community Access 💻",
        emailBody: "<p>Hi {{firstName}}, here is your invite to the dev workspace.</p>",
        conditions: [
          { field: "context.selectedOptions", operator: "contains", value: "Developer" },
        ],
      },
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Dev Contributor", "Open Source"],
        conditions: [
          { field: "context.selectedOptions", operator: "contains", value: "Developer" },
        ],
      },
      {
        type: "COMMUNITY_JOIN" as const,
        conditions: [
          { field: "context.selectedOptions", operator: "contains", value: "Developer" },
        ],
      },

      // Branch 3: High Rating (>=4)
      {
        type: "ASSIGN_MEMBERSHIP_TIER" as const,
        conditions: [
          { field: "context.rating", operator: "gte", value: 4 },
        ],
      },
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Community Champion", "NPS Promoter"],
        conditions: [
          { field: "context.rating", operator: "gte", value: 4 },
        ],
      },
    ],
  },
  {
    title: "Promoter Gold Tier & Recognition",
    badge: "Promoter NPS",
    icon: Star,
    trigger: "SURVEY_SUBMITTED" as SurveyRuleTrigger,
    conditionOperator: "OR" as const,
    conditions: [
      {
        field: "context.rating",
        operator: "gte",
        value: 4,
      },
      {
        field: "context.isPromoter",
        operator: "eq",
        value: true,
      },
    ],
    actions: [
      { type: "ASSIGN_MEMBERSHIP_TIER" as const },
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Survey Completed", "Community Champion", "NPS Promoter"],
      },
      {
        type: "NOTIFICATION" as const,
        notificationMessage: "Thank you for the top rating! You have unlocked Gold Member status.",
        pushTitle: "Champion Perk Unlocked ✨",
        pushBody: "Your 5-star review upgraded your membership to Gold Tier!",
        push: true,
      },
      {
        type: "EMAIL" as const,
        emailSubject: "Special Recognition: Gold Status Unlocked! 🏆",
        emailBody: "<p>Hi {{firstName}},</p><p>Thank you for submitting your survey response. We are thrilled to upgrade you to Gold Tier!</p>",
      },
    ],
  },
  {
    title: "Detractor Support & Alert",
    badge: "Support Escalation",
    icon: ShieldAlert,
    trigger: "SURVEY_SUBMITTED" as SurveyRuleTrigger,
    conditionOperator: "OR" as const,
    conditions: [
      {
        field: "context.rating",
        operator: "lte",
        value: 2,
      },
      {
        field: "context.isDetractor",
        operator: "eq",
        value: true,
      },
    ],
    actions: [
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Needs Follow-Up", "NPS Detractor"],
      },
      {
        type: "NOTIFICATION" as const,
        pushTitle: "We Received Your Feedback 🤝",
        pushBody: "Thank you for letting us know. Our team is looking into your concerns right now.",
        push: true,
      },
    ],
  },
  {
    title: "Universal Survey Completion",
    badge: "General",
    icon: CheckCircle2,
    trigger: "SURVEY_COMPLETED" as SurveyRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [],
    actions: [
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Survey Completed"],
      },
      {
        type: "NOTIFICATION" as const,
        pushTitle: "Survey Received ✨",
        pushBody: "Thanks for completing the survey! Your responses help improve our community.",
        push: true,
      },
    ],
  },
];

interface NodePaletteProps {
  onAddAction: (type: SurveyRuleActionType) => void;
  onApplyRecipe: (recipe: (typeof SURVEY_TEMPLATE_RECIPES)[0]) => void;
  onSelectTriggerNode: () => void;
  onSelectConditionNode: () => void;
  onSelectBranchConditionNode?: (branchIndex?: number) => void;
  branchCount?: number;
}

export const SurveyNodePalette: React.FC<NodePaletteProps> = ({
  onAddAction,
  onApplyRecipe,
  onSelectTriggerNode,
  onSelectConditionNode,
  onSelectBranchConditionNode,
  branchCount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"nodes" | "recipes">("nodes");

  return (
    <aside
      className={cn(
        "h-full bg-card border-r border-border flex flex-col shadow-md transition-all duration-200 z-10",
        isCollapsed ? "w-14" : "w-64"
      )}
    >
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-foreground">
              Survey Blocks
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <Layers className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {!isCollapsed ? (
        <>
          <div className="p-2 border-b border-border/80 bg-muted/20 flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("nodes")}
              className={cn(
                "flex-1 py-1 text-xs font-semibold rounded-md transition-all",
                activeTab === "nodes"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Actions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recipes")}
              className={cn(
                "flex-1 py-1 text-xs font-semibold rounded-md transition-all",
                activeTab === "recipes"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Recipes
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {activeTab === "nodes" ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Flow Nodes
                  </span>
                  <button
                    type="button"
                    onClick={onSelectTriggerNode}
                    className="w-full p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-left transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        Survey Trigger
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Configure survey scope
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectBranchConditionNode?.(0)}
                    className="w-full p-2.5 rounded-xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                        <GitBranch className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          Condition Branches
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Inspect & edit branch criteria
                        </span>
                      </div>
                    </div>
                    {branchCount !== undefined && branchCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[9px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30"
                      >
                        {branchCount}
                      </Badge>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onSelectConditionNode}
                    className="w-full p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-left transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Filter className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        Global Criteria
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Filter rating & promoter
                      </span>
                    </div>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Add Action Block
                  </span>
                  <div className="space-y-1.5">
                    {SURVEY_PALETTE_ACTIONS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => onAddAction(item.type)}
                          className="w-full p-2 rounded-xl border border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border",
                                item.color
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-foreground block truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate block">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                            <Plus className="w-3 h-3" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  1-Click Survey Blueprints
                </span>
                {SURVEY_TEMPLATE_RECIPES.map((recipe, i) => {
                  const Icon = recipe.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onApplyRecipe(recipe)}
                      className="w-full p-3 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 text-left transition-all space-y-1.5 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {recipe.title}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[9px]">
                          {recipe.badge}
                        </Badge>
                      </div>
                      <span className="text-[10.5px] text-muted-foreground block">
                        {recipe.actions.length} automated actions configured
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 py-3 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onSelectTriggerNode}
            className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center hover:scale-105 transition-transform"
            title="Survey Trigger"
          >
            <ClipboardList className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSelectConditionNode}
            className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center hover:scale-105 transition-transform"
            title="Conditions"
          >
            <Filter className="w-4 h-4" />
          </button>
          <div className="w-6 h-px bg-border my-1" />
          {SURVEY_PALETTE_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onAddAction(item.type)}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform border",
                  item.color
                )}
                title={`Add ${item.label}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
};
