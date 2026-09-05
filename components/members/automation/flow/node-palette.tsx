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
  School,
  Building,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MemberRuleTrigger,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import { cn } from "@/lib/utils";

const PALETTE_ACTIONS: {
  type: MemberRuleActionType;
  label: string;
  desc: string;
  icon: any;
  color: string;
  badge: string;
}[] = [
  {
    type: "ASSIGN_MEMBERSHIP_TIER",
    label: "Assign Tier",
    desc: "Grant rank & perks",
    icon: Award,
    color: "from-amber-500 to-amber-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
    badge: "Privilege",
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
    desc: "Auto-enroll into group",
    icon: Users,
    color: "from-blue-500 to-blue-600 text-blue-600 bg-blue-500/10 border-blue-500/20",
    badge: "Community",
  },
  {
    type: "NOTIFICATION",
    label: "Push Alert",
    desc: "Mobile & bell notice",
    icon: Bell,
    color: "from-purple-500 to-purple-600 text-purple-600 bg-purple-500/10 border-purple-500/20",
    badge: "Notice",
  },
  {
    type: "ADD_MEMBER_TAG",
    label: "Member Tags",
    desc: "Segment profile tags",
    icon: Tag,
    color: "from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badge: "Tagging",
  },
];

export const TEMPLATE_RECIPES = [
  {
    title: "Alumni Welcome & Tier",
    badge: "Education",
    icon: School,
    trigger: "MEMBER_JOINED" as MemberRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [
      {
        field: "profile.college",
        operator: "contains",
        value: "Stanford",
      },
    ],
    actions: [
      { type: "ASSIGN_MEMBERSHIP_TIER" as const },
      {
        type: "ADD_MEMBER_TAG" as const,
        tags: ["Stanford Alumni", "Class of 2026"],
      },
      {
        type: "EMAIL" as const,
        emailSubject: "Welcome Stanford Alumni! 🎓",
        emailBody:
          "<p>Hi <strong>{{firstName}}</strong>,</p><p>Welcome to our community! Your alumni membership perks have been automatically activated.</p>",
      },
      {
        type: "NOTIFICATION" as const,
        pushTitle: "Alumni Membership Activated ✨",
        pushBody: "Welcome! Your exclusive alumni perks are ready to explore.",
        push: true,
      },
    ],
  },
  {
    title: "Corporate Auto-Access",
    badge: "Enterprise",
    icon: Building,
    trigger: "MEMBER_JOINED" as MemberRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [
      {
        field: "user.email",
        operator: "contains",
        value: "@company.com",
      },
    ],
    actions: [
      { type: "ASSIGN_MEMBERSHIP_TIER" as const },
      { type: "ADD_MEMBER_TAG" as const, tags: ["Corporate Partner"] },
    ],
  },
  {
    title: "Verified Member VIP",
    badge: "Verification",
    icon: ShieldCheck,
    trigger: "MEMBER_VERIFIED" as MemberRuleTrigger,
    conditionOperator: "AND" as const,
    conditions: [],
    actions: [
      { type: "ADD_MEMBER_TAG" as const, tags: ["Verified", "VIP"] },
      {
        type: "NOTIFICATION" as const,
        pushTitle: "Identity Verified 🛡️",
        pushBody:
          "Your profile is officially verified. Enjoy elevated privileges across the platform.",
        push: true,
      },
    ],
  },
];

interface NodePaletteProps {
  onAddAction: (type: MemberRuleActionType) => void;
  onApplyRecipe: (recipe: (typeof TEMPLATE_RECIPES)[0]) => void;
  onSelectTriggerNode: () => void;
  onSelectConditionNode: () => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({
  onAddAction,
  onApplyRecipe,
  onSelectTriggerNode,
  onSelectConditionNode,
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
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-foreground">
              Canvas Library
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
          title={isCollapsed ? "Expand Palette" : "Collapse Palette"}
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
          {/* Tab Switcher */}
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
              Action Blocks
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {activeTab === "nodes" ? (
              <div className="space-y-4">
                {/* Core Workflow Steps */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Flow Nodes
                  </span>
                  <button
                    type="button"
                    onClick={onSelectTriggerNode}
                    className="w-full p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        Trigger Event
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Configure when flow runs
                      </span>
                    </div>
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
                        Targeting Filter
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Match rules & logic
                      </span>
                    </div>
                  </button>
                </div>

                {/* Available Action Nodes */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Add Action Block
                  </span>
                  <div className="space-y-1.5">
                    {PALETTE_ACTIONS.map((item) => {
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
              /* Starter Recipes */
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  1-Click Automation Recipes
                </span>
                {TEMPLATE_RECIPES.map((recipe, i) => {
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
        /* Collapsed Icon Bar */
        <div className="flex-1 py-3 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onSelectTriggerNode}
            className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:scale-105 transition-transform"
            title="Trigger Event"
          >
            <Zap className="w-4 h-4" />
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
          {PALETTE_ACTIONS.map((item) => {
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
