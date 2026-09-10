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
  X,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
  Lock,
  Globe,
  Coins,
  Check,
  UserPlus,
  CheckCircle2,
  UserX,
  UserMinus,
  Ban,
  MapPin,
  Briefcase,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MemberRuleTrigger,
  MemberRuleActionType,
  MemberRuleConditionInput,
} from "@/graphql/member-automation";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import {
  MEMBER_PALETTE_ACTIONS,
  getCategorizedActions,
} from "@/components/shared/automation-flow/action-palette-items";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface MemberTriggerPaletteItem {
  type: MemberRuleTrigger;
  label: string;
  desc: string;
  badge: string;
  icon: any;
  color: string;
  badgeBg: string;
}

export const MEMBER_TRIGGER_PALETTE: MemberTriggerPaletteItem[] = [
  {
    type: "MEMBER_JOINED",
    label: "Member Joined",
    desc: "Evaluated on signup or invitation",
    badge: "Join",
    icon: UserPlus,
    color: "from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    type: "MEMBER_VERIFIED",
    label: "Member Verified",
    desc: "Triggered on KYC or email approval",
    badge: "KYC",
    icon: ShieldCheck,
    color: "from-purple-500 to-pink-600 text-purple-600 bg-purple-500/10 border-purple-500/20",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    type: "MEMBER_APPROVED",
    label: "Member Approved",
    desc: "Triggered when admin approves profile",
    badge: "Approval",
    icon: CheckCircle2,
    color: "from-blue-500 to-indigo-600 text-blue-600 bg-blue-500/10 border-blue-500/20",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    type: "MEMBER_REJECTED",
    label: "Member Rejected",
    desc: "Triggered when application is declined",
    badge: "Declined",
    icon: UserX,
    color: "from-rose-500 to-red-600 text-rose-600 bg-rose-500/10 border-rose-500/20",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  {
    type: "MEMBER_DISABLED",
    label: "Account Disabled",
    desc: "Triggered when profile is deactivated",
    badge: "Deactivated",
    icon: UserMinus,
    color: "from-amber-500 to-orange-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    type: "MEMBER_BLOCKED",
    label: "Member Blocked",
    desc: "Triggered when user is banned/blocked",
    badge: "Restricted",
    icon: Ban,
    color: "from-red-600 to-rose-700 text-red-600 bg-red-500/10 border-red-500/20",
    badgeBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
];

export interface TargetFilterPaletteItem {
  field: string;
  label: string;
  desc: string;
  badge: string;
  icon: any;
  badgeBg: string;
}

export const TARGET_FILTER_PALETTE: TargetFilterPaletteItem[] = [
  {
    field: "profile.college",
    label: "College / University",
    desc: "Match student/alumni university or school",
    badge: "Education",
    icon: School,
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    field: "profile.company",
    label: "Company / Employer",
    desc: "Target members by workplace or enterprise",
    badge: "Career",
    icon: Building,
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    field: "user.email",
    label: "Email Domain / Pattern",
    desc: "Filter corporate or institutional domains",
    badge: "Domain",
    icon: Mail,
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    field: "userToEntity.tag",
    label: "Current Member Tag",
    desc: "Segment members with existing tags or status",
    badge: "Tag",
    icon: Tag,
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    field: "profile.city",
    label: "City / Location",
    desc: "Filter by member residence or regional hub",
    badge: "Location",
    icon: MapPin,
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  {
    field: "profile.jobTitle",
    label: "Job Title / Role",
    desc: "Target members by job title, role, or seniority",
    badge: "Role",
    icon: Briefcase,
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
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
  currentTrigger?: MemberRuleTrigger;
  onSelectTrigger?: (trigger: MemberRuleTrigger) => void;
  conditions?: MemberRuleConditionInput[];
  branches?: Array<{ id: string; name: string }>;
  onAddCondition?: (field: string, branchId?: string) => void;
  onSelectConditionField?: (field: string) => void;
  onAddAction: (type: MemberRuleActionType, branchId?: string, path?: "yes" | "no") => void;
  onAddBranch?: (initialField?: string) => void;
  onDeleteBranch?: (branchId: string) => void;
  onApplyRecipe: (recipe: (typeof TEMPLATE_RECIPES)[0]) => void;
  onSelectTriggerNode: (trigger?: MemberRuleTrigger) => void;
  onSelectConditionNode: () => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({
  currentTrigger,
  onSelectTrigger,
  conditions = [],
  branches = [{ id: "branch_1", name: "Branch 1 (Primary)" }],
  onAddCondition,
  onSelectConditionField,
  onAddAction,
  onAddBranch,
  onDeleteBranch,
  onApplyRecipe,
  onSelectTriggerNode,
  onSelectConditionNode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"nodes" | "recipes">("nodes");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("branch_1");
  const [targetBranch, setTargetBranch] = useState<"yes" | "no">("yes");
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);

  const handleAddActionWithCheck = (type: MemberRuleActionType) => {
    if (type === "EMAIL" && !isVerified) {
      setShowDomainModal(true);
      toast.error("Email domain setup required before adding email actions.");
      return;
    }
    onAddAction(type, selectedBranchId, targetBranch);
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
        isCollapsed ? "w-14" : "w-80"
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
              Workflow Nodes
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
                {/* 1. Trigger Events (When this happens) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Trigger Events
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {MEMBER_TRIGGER_PALETTE.length} Events
                    </span>
                  </div>

                  {/* Trigger Node Inspector Selector Card */}
                  <button
                    type="button"
                    onClick={() => onSelectTriggerNode(currentTrigger)}
                    className="w-full p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          Trigger Event Node
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {MEMBER_TRIGGER_PALETTE.find((t) => t.type === currentTrigger)?.label || "Lifecycle trigger initiating flow"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[8.5px] px-1.5 py-0 h-4 font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
                    >
                      Inspect
                    </Badge>
                  </button>

                  {/* Multi-Branch Creator Button */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddBranch) {
                          onAddBranch();
                        } else {
                          toast.success("Created new decision branch from trigger.");
                        }
                      }}
                      className="w-full p-2 rounded-xl border border-dashed border-purple-300 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100/50 text-purple-700 dark:text-purple-300 text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-600 flex items-center justify-center">
                          <GitBranch className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold">
                          + Add Condition Branch
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[8px] px-1 py-0 border-purple-500/30 text-purple-600">
                        Filter Branch
                      </Badge>
                    </button>

                    {/* Active Decision Branches List (Only shown with delete when > 1 branch) */}
                    {branches && branches.length > 1 && (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                            Branches ({branches.length})
                          </span>
                          <span className="text-[8.5px] text-muted-foreground">
                            Delete enabled
                          </span>
                        </div>
                        {branches.map((b, idx) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-muted/40 border border-border/80 text-xs"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                              <span className="truncate text-[10.5px] font-semibold text-foreground">
                                {b.name}
                              </span>
                              {idx === 0 && (
                                <Badge variant="outline" className="text-[7.5px] px-1 py-0 border-purple-500/30 text-purple-600 bg-purple-500/10 shrink-0">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            {branches.length > 1 && b.id !== "branch_1" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteBranch?.(b.id);
                                }}
                                className="h-5 w-5 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                title={`Delete ${b.name}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {MEMBER_TRIGGER_PALETTE.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTrigger === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => {
                            onSelectTrigger?.(item.type);
                            onSelectTriggerNode(item.type);
                          }}
                          className={cn(
                            "p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 group cursor-pointer relative",
                            isActive
                              ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                              : "border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div
                              className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs",
                                item.badgeBg
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            {isActive ? (
                              <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[8px] px-1 py-0 h-3.5 font-semibold text-muted-foreground border-border/80"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="min-w-0 w-full">
                            <span className="text-xs font-bold text-foreground block truncate leading-tight">
                              {item.label}
                            </span>
                            <span className="text-[9.5px] text-muted-foreground truncate block leading-tight mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Flow Conditions / Target Filters */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Target Filters & Rules
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {conditions.length} Active
                    </span>
                  </div>

                  {/* Condition Node Inspector Selector Card */}
                  <button
                    type="button"
                    onClick={() => {
                      if (conditions.length === 0 && onAddCondition) {
                        onAddCondition("profile.college", selectedBranchId);
                      } else {
                        onSelectConditionNode();
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Filter className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          Targeting Filter Node
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {conditions.length === 0
                            ? "+ Click to Add Filter"
                            : `${conditions.length} rule${conditions.length === 1 ? "" : "s"} configured`}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[8.5px] px-1.5 py-0 h-4 font-semibold text-blue-600 dark:text-blue-400 border-blue-500/30 shrink-0"
                    >
                      {conditions.length === 0 ? "+ Add" : "Inspect"}
                    </Badge>
                  </button>

                  {/* Individual Target Filter Items */}
                  <div className="grid grid-cols-2 gap-2">
                    {TARGET_FILTER_PALETTE.map((item) => {
                      const Icon = item.icon;
                      const activeMatches = conditions.filter(
                        (c) => c.field === item.field
                      );
                      const isFiltered = activeMatches.length > 0;

                      return (
                        <button
                          key={item.field}
                          type="button"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("application/reactflow/type", "filter");
                            e.dataTransfer.setData("application/reactflow/field", item.field);
                            e.dataTransfer.setData("application/reactflow/branch", selectedBranchId);
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onClick={() => {
                            if (onAddCondition) {
                              onAddCondition(item.field, selectedBranchId);
                            }
                            if (onSelectConditionField) {
                              onSelectConditionField(item.field);
                            }
                          }}
                          className={cn(
                            "p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 group cursor-pointer active:cursor-grabbing",
                            isFiltered
                              ? "bg-blue-500/5 border-blue-500/30 dark:border-blue-500/40 shadow-xs"
                              : "border-border/60 hover:border-blue-500/40 hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div
                              className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105",
                                item.badgeBg
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            {isFiltered ? (
                              <Badge
                                variant="outline"
                                className="text-[8px] px-1 py-0 h-3.5 font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              >
                                {activeMatches.length} set
                              </Badge>
                            ) : (
                              <div className="w-4 h-4 rounded-md border border-dashed border-border/80 text-muted-foreground flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                                <Plus className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 w-full">
                            <span className="text-xs font-bold text-foreground block truncate leading-tight">
                              {item.label}
                            </span>
                            <span className="text-[9.5px] text-muted-foreground truncate block leading-tight mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Action Nodes Grouped by Sub-Category / Channel */}
                <div className="space-y-3 pt-2">
                  {/* Branch & Path Target Selector */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Add to Branch & Path
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0 h-4",
                          targetBranch === "no"
                            ? "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                            : "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10"
                        )}
                      >
                        {branches.find((b) => b.id === selectedBranchId)?.name || selectedBranchId} · {targetBranch.toUpperCase()}
                      </Badge>
                    </div>

                    {branches && branches.length > 1 && (
                      <div className="flex flex-wrap gap-1">
                        {branches.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBranchId(b.id)}
                            className={cn(
                              "px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer",
                              selectedBranchId === b.id
                                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                : "bg-card border-border hover:bg-muted text-muted-foreground"
                            )}
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Outcome Path Toggle (YES vs NO) */}
                    <div className="pt-0.5 space-y-1">
                      <span className="text-[9.5px] font-semibold text-muted-foreground block">
                        Target Outcome Path:
                      </span>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setTargetBranch("yes")}
                          className={cn(
                            "py-1 px-2 text-[10.5px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer",
                            targetBranch === "yes"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                          )}
                        >
                          <Check className="w-3 h-3" />
                          YES (Matches)
                        </button>

                        <button
                          type="button"
                          onClick={() => setTargetBranch("no")}
                          className={cn(
                            "py-1 px-2 text-[10.5px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer",
                            targetBranch === "no"
                              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
                          )}
                        >
                          <X className="w-3 h-3" />
                          NO (Else)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Action Blocks by Channel
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {MEMBER_PALETTE_ACTIONS.length} Actions
                    </span>
                  </div>

                  {getCategorizedActions(MEMBER_PALETTE_ACTIONS).map((group) => {
                    const CategoryIcon = group.category.icon;
                    return (
                      <div key={group.category.id} className="space-y-1.5">
                        <div className="flex items-center justify-between px-1 pt-1">
                          <span className="text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <span
                              className={cn(
                                "w-4 h-4 rounded flex items-center justify-center border",
                                group.category.color
                              )}
                            >
                              <CategoryIcon className="w-2.5 h-2.5" />
                            </span>
                            {group.category.label}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-mono">
                            {group.items.length}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const isEmailLocked =
                              item.type === "EMAIL" && !isVerified;
                            return (
                              <button
                                key={item.type}
                                type="button"
                                draggable={!isEmailLocked}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("application/reactflow/type", "action");
                                  e.dataTransfer.setData("application/reactflow/action", item.type);
                                  e.dataTransfer.setData("application/reactflow/branch", selectedBranchId);
                                  e.dataTransfer.setData("application/reactflow/path", targetBranch);
                                  e.dataTransfer.effectAllowed = "move";
                                }}
                                onClick={() => handleAddActionWithCheck(item.type)}
                                className={cn(
                                  "p-2 rounded-xl border border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/30 text-left transition-all flex flex-col justify-between gap-1.5 group cursor-pointer active:cursor-grabbing",
                                  isEmailLocked &&
                                    "hover:border-amber-300 dark:hover:border-amber-800"
                                )}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div
                                    className={cn(
                                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border",
                                      item.badgeBg
                                    )}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div
                                    className={cn(
                                      "w-4 h-4 rounded-full flex items-center justify-center transition-colors shrink-0",
                                      isEmailLocked
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                                    )}
                                  >
                                    {isEmailLocked ? (
                                      <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                    ) : (
                                      <Plus className="w-2.5 h-2.5" />
                                    )}
                                  </div>
                                </div>
                                <div className="min-w-0 w-full">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-foreground block truncate leading-tight">
                                      {item.label}
                                    </span>
                                  </div>
                                  <span className="text-[9.5px] text-muted-foreground truncate block leading-tight mt-0.5">
                                    {isEmailLocked
                                      ? "Requires domain setup"
                                      : item.desc}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Starter Recipes */
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  1-Click Automation Recipes
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATE_RECIPES.map((recipe, i) => {
                    const Icon = recipe.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyRecipeWithCheck(recipe)}
                        className="p-2.5 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 text-left transition-all flex flex-col justify-between gap-2 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">
                            {recipe.badge}
                          </Badge>
                        </div>
                        <div className="min-w-0 w-full">
                          <span className="text-xs font-bold text-foreground block truncate leading-tight">
                            {recipe.title}
                          </span>
                          <span className="text-[9.5px] text-muted-foreground block truncate leading-tight mt-0.5">
                            {recipe.actions.length} actions configured
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Collapsed Icon Bar */
        <div className="flex-1 py-3 flex flex-col items-center gap-1.5 overflow-y-auto">
          <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Trig</span>
          {MEMBER_TRIGGER_PALETTE.map((item) => {
            const Icon = item.icon;
            const isActive = currentTrigger === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  onSelectTrigger?.(item.type);
                  onSelectTriggerNode(item.type);
                }}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform border relative",
                  item.badgeBg,
                  isActive && "ring-2 ring-primary border-primary shadow-xs"
                )}
                title={`Trigger: ${item.label}`}
              >
                <Icon className="w-4 h-4" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                )}
              </button>
            );
          })}

          <div className="w-6 h-px bg-border my-1" />

          <button
            type="button"
            onClick={() => onSelectConditionNode()}
            className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center hover:scale-105 transition-transform"
            title="Targeting Filter"
          >
            <Filter className="w-4 h-4" />
          </button>

          <div className="w-6 h-px bg-border my-1" />

          <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Act</span>
          {MEMBER_PALETTE_ACTIONS.map((item) => {
            const Icon = item.icon;
            const isEmailLocked = item.type === "EMAIL" && !isVerified;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleAddActionWithCheck(item.type)}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center hover:scale-105 transition-transform border relative",
                  item.badgeBg,
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
