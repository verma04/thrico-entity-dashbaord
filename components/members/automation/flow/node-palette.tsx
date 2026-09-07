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
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MemberRuleTrigger,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { toast } from "sonner";
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
    desc: "Send automated email",
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
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);

  const handleAddActionWithCheck = (type: MemberRuleActionType) => {
    if (type === "EMAIL" && !isVerified) {
      setShowDomainModal(true);
      toast.error("Email domain setup required before adding email actions.");
      return;
    }
    onAddAction(type);
  };

  const handleApplyRecipeWithCheck = (recipe: (typeof TEMPLATE_RECIPES)[0]) => {
    const hasEmail = recipe.actions.some((a) => a.type === "EMAIL");
    if (hasEmail && !isVerified) {
      const filteredRecipe = {
        ...recipe,
        actions: recipe.actions.filter((a) => a.type !== "EMAIL"),
      };
      onApplyRecipe(filteredRecipe);
      toast.info(
        "Applied recipe without email action. Please configure and verify your email domain to enable automated emails."
      );
      setShowDomainModal(true);
      return;
    }
    onApplyRecipe(recipe);
  };

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
                      const isEmailLocked =
                        item.type === "EMAIL" && !isVerified;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleAddActionWithCheck(item.type)}
                          className={cn(
                            "w-full p-2 rounded-xl border border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/30 text-left transition-all flex items-center justify-between group cursor-pointer",
                            isEmailLocked &&
                              "hover:border-amber-300 dark:hover:border-amber-800"
                          )}
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
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-foreground block truncate">
                                  {item.label}
                                </span>
                                {isEmailLocked && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] font-bold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-1 py-0 h-4"
                                  >
                                    Setup Req.
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground truncate block">
                                {isEmailLocked
                                  ? "Requires verified email domain"
                                  : item.desc}
                              </span>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0",
                              isEmailLocked
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                            )}
                          >
                            {isEmailLocked ? (
                              <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
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
                      onClick={() => handleApplyRecipeWithCheck(recipe)}
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
            title="Targeting Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
          <div className="w-6 h-px bg-border my-1" />
          {PALETTE_ACTIONS.map((item) => {
            const Icon = item.icon;
            const isEmailLocked = item.type === "EMAIL" && !isVerified;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleAddActionWithCheck(item.type)}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform border relative",
                  item.color,
                  isEmailLocked && "opacity-80"
                )}
                title={
                  isEmailLocked
                    ? `Add ${item.label} (Domain Setup Required)`
                    : `Add ${item.label}`
                }
              >
                <Icon className="w-4 h-4" />
                {isEmailLocked && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px] font-bold shadow-xs">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Email Domain Setup Modal */}
      <EmailDomainSetupModal
        open={showDomainModal}
        onOpenChange={setShowDomainModal}
      />
    </aside>
  );
};
