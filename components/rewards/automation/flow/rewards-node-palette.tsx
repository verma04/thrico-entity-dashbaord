"use client";

import React, { useState } from "react";
import {
  Dices,
  RectangleHorizontal,
  RefreshCw,
  Ticket,
  Coins,
  DollarSign,
  Bell,
  Mail,
  Award,
  Tag,
  Gift,
  Globe,
  Plus,
  GitBranch,
  Filter,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Play,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleActionType,
  RewardRuleConditionInput,
  RewardRuleBranchItem,
} from "@/graphql/rewards-automation";
import { getModuleVisuals } from "./rewards-custom-nodes";
import { ActionBlocksByChannel } from "@/components/shared/automation-flow";
import { cn } from "@/lib/utils";

export const REWARDS_STARTER_RECIPES = [
  {
    title: "Spin Wheel Win & Consolation",
    module: "SPIN_WHEEL" as RewardAutomationModule,
    badge: "Interactive",
    description:
      "Awards +50 bonus points on winning spins; provides 10 free consolation coins on NO_REWARDS outcome.",
    icon: Dices,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    rule: {
      name: "Spin Wheel Win or Consolation Pipeline",
      description:
        "Awards bonus points on win, and gives 10 consolation coins on NO_REWARDS outcome",
      module: "SPIN_WHEEL" as RewardAutomationModule,
      trigger: "SPIN_WHEEL_PLAYED" as RewardRuleTrigger,
      conditionOperator: "AND" as const,
      rewardId: "ALL",
      rewardTitle: "All Spin Wheels",
      branches: [
        {
          id: "branch_1",
          name: "Winning Spin",
          isDefault: true,
          hasNoPath: true,
        },
      ],
      conditions: [
        {
          field: "context.configId",
          operator: "equals",
          value: "ALL",
          branch: "branch_1",
        },
        {
          field: "context.isWinner",
          operator: "equals",
          value: true,
          branch: "branch_1",
        },
      ],
      actions: [
        {
          type: "AWARD_POINTS" as const,
          branch: "branch_1_yes",
          points: { points: 50 },
        },
        {
          type: "NOTIFICATION" as const,
          branch: "branch_1_yes",
          pushTitle: "Winner! 🎡",
          pushBody: "Check your reward wallet for your prize.",
          push: true,
        },
        {
          type: "AWARD_CURRENCY" as const,
          branch: "branch_1_no",
          currency: { amount: 10, currencyType: "TC" },
        },
        {
          type: "NOTIFICATION" as const,
          branch: "branch_1_no",
          pushTitle: "Try Again! 🍀",
          pushBody: "10 TC Coins have been credited to your wallet.",
          push: true,
        },
      ],
    },
  },
  {
    title: "Scratch Card Jackpot VIP",
    module: "SCRATCH_CARD" as RewardAutomationModule,
    badge: "High Value",
    description:
      "Detects scratch card jackpot wins, adds VIP tag, upgrades tier, and sends VIP notification.",
    icon: RectangleHorizontal,
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400",
    rule: {
      name: "Scratch Card Jackpot VIP Allocation",
      description: "Tags jackpot winners as VIP and upgrades membership tier",
      module: "SCRATCH_CARD" as RewardAutomationModule,
      trigger: "SCRATCH_CARD_PLAYED" as RewardRuleTrigger,
      conditionOperator: "AND" as const,
      rewardId: "ALL",
      rewardTitle: "All Scratch Cards",
      branches: [
        {
          id: "branch_1",
          name: "Jackpot Unlocked",
          isDefault: true,
          hasNoPath: true,
        },
      ],
      conditions: [
        {
          field: "context.isWinner",
          operator: "equals",
          value: true,
          branch: "branch_1",
        },
        {
          field: "context.prizeType",
          operator: "equals",
          value: "JACKPOT",
          branch: "branch_1",
        },
      ],
      actions: [
        {
          type: "ADD_MEMBER_TAG" as const,
          branch: "branch_1_yes",
          tags: ["Jackpot Winner", "VIP Rewards"],
        },
        {
          type: "NOTIFICATION" as const,
          branch: "branch_1_yes",
          pushTitle: "Jackpot Winner! 🌟",
          pushBody: "Congratulations on hitting the Grand Scratch Jackpot!",
          push: true,
        },
        {
          type: "AWARD_CURRENCY" as const,
          branch: "branch_1_no",
          currency: { amount: 5, currencyType: "TC" },
        },
      ],
    },
  },
  {
    title: "Voucher Claim Auto-Tagging",
    module: "REWARDS" as RewardAutomationModule,
    badge: "Voucher",
    description:
      "When a member claims an exclusive partner voucher, tag profile and notify via email.",
    icon: Ticket,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    rule: {
      name: "Exclusive Voucher Claim Pipeline",
      description: "Auto-tags members and emails coupon codes upon redemption",
      module: "REWARDS" as RewardAutomationModule,
      trigger: "REWARD_CLAIMED" as RewardRuleTrigger,
      conditionOperator: "AND" as const,
      rewardId: "ALL",
      rewardTitle: "All Vouchers",
      branches: [
        {
          id: "branch_1",
          name: "Standard Voucher Claim",
          isDefault: true,
          hasNoPath: false,
        },
      ],
      conditions: [
        {
          field: "context.rewardId",
          operator: "equals",
          value: "ALL",
          branch: "branch_1",
        },
      ],
      actions: [
        {
          type: "ADD_MEMBER_TAG" as const,
          branch: "branch_1_yes",
          tags: ["Redeemed Partner Offer"],
        },
        {
          type: "NOTIFICATION" as const,
          branch: "branch_1_yes",
          pushTitle: "Voucher Ready 🎟️",
          pushBody: "Your coupon code is ready to copy and redeem.",
          push: true,
        },
      ],
    },
  },
];

interface RewardsNodePaletteProps {
  module: RewardAutomationModule;
  onSelectModule: (mod: RewardAutomationModule) => void;
  trigger: RewardRuleTrigger;
  onSelectTrigger: (t: RewardRuleTrigger) => void;
  branches: RewardRuleBranchItem[];
  onAddBranch: (initialField?: string) => void;
  onAddCondition: (branchId: string, field?: string) => void;
  onAddAction: (
    type: RewardRuleActionType,
    branchId: string,
    path: "yes" | "no"
  ) => void;
  onApplyRecipe: (recipe: any) => void;
  onSelectTriggerNode?: () => void;
}

export const RewardsNodePalette: React.FC<RewardsNodePaletteProps> = ({
  module,
  onSelectModule,
  trigger,
  onSelectTrigger,
  branches,
  onAddBranch,
  onAddCondition,
  onAddAction,
  onApplyRecipe,
  onSelectTriggerNode,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "recipes">("library");

  const primaryBranchId = branches[0]?.id || "branch_1";
  const modMeta = getModuleVisuals(module);

  const MODULE_TABS: {
    id: RewardAutomationModule;
    label: string;
    icon: any;
  }[] = [
    { id: "SPIN_WHEEL", label: "Spin Wheel", icon: Dices },
    { id: "SCRATCH_CARD", label: "Scratch", icon: RectangleHorizontal },
    { id: "MATCH_WIN", label: "Match & Win", icon: RefreshCw },
    { id: "REWARDS", label: "Rewards", icon: Ticket },
  ];

  const MODULE_TRIGGERS: Record<
    RewardAutomationModule,
    { value: RewardRuleTrigger; label: string; desc: string }[]
  > = {
    SPIN_WHEEL: [
      {
        value: "SPIN_WHEEL_PLAYED",
        label: "Spin Wheel Played",
        desc: "Fires every time a member spins the wheel.",
      },
      {
        value: "PRIZE_WON",
        label: "Prize Won",
        desc: "Fires when pointer lands on any prize segment.",
      },
      {
        value: "NO_REWARDS",
        label: "No Rewards (Consolation)",
        desc: "Fires when pointer lands on no-reward segment.",
      },
    ],
    SCRATCH_CARD: [
      {
        value: "SCRATCH_CARD_PLAYED",
        label: "Scratch Card Scratched",
        desc: "Fires when scratch coating is revealed.",
      },
      {
        value: "PRIZE_WON",
        label: "Prize Won",
        desc: "Fires when card reveals a prize.",
      },
      {
        value: "NO_REWARDS",
        label: "No Rewards (Consolation)",
        desc: "Fires when scratch card reveals no prize.",
      },
    ],
    MATCH_WIN: [
      {
        value: "MATCH_WIN_PLAYED",
        label: "Match & Win Played",
        desc: "Fires when player reveals tile combination.",
      },
      {
        value: "PRIZE_WON",
        label: "Match Won",
        desc: "Fires when matching pairs are solved.",
      },
      {
        value: "NO_REWARDS",
        label: "No Match (Consolation)",
        desc: "Fires when player runs out of turns.",
      },
    ],
    REWARDS: [
      {
        value: "REWARD_CLAIMED",
        label: "Reward Claimed",
        desc: "Fires upon redemption or voucher generation.",
      },
      {
        value: "REWARD_REDEEMED",
        label: "Reward Redeemed",
        desc: "Fires when merchant or store validates voucher.",
      },
      {
        value: "REWARD_EXPIRED",
        label: "Reward Expired",
        desc: "Fires when voucher claim window lapses.",
      },
    ],
  };

  const QUICK_CONDITIONS = [
    { field: "context.isWinner", label: "Outcome: Winner?", value: true },
    { field: "context.prizeType", label: "Prize Type Equals", value: "JACKPOT" },
    { field: "context.faceValue", label: "Face Value / Points >=", value: 50 },
    { field: "member.pointsBalance", label: "Member Points Balance >=", value: 200 },
    { field: "member.streakDays", label: "Daily Streak Count >=", value: 7 },
  ];

  const ACTION_PALETTE: {
    type: RewardRuleActionType;
    label: string;
    desc: string;
    icon: any;
    color: string;
  }[] = [
    {
      type: "AWARD_POINTS",
      label: "Award Points",
      desc: "Credit bonus points to wallet",
      icon: Coins,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      type: "AWARD_CURRENCY",
      label: "Credit Currency",
      desc: "Award TC or custom tokens",
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      type: "NOTIFICATION",
      label: "Push Notification",
      desc: "Send mobile lock screen & bell alert",
      icon: Bell,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      type: "EMAIL",
      label: "Send Email",
      desc: "Send personalized voucher or notification",
      icon: Mail,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      type: "ISSUE_COUPON",
      label: "Issue Voucher",
      desc: "Generate discount coupon code",
      icon: Gift,
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      type: "ADD_MEMBER_TAG",
      label: "Assign Tag",
      desc: "Segment member with custom tags",
      icon: Tag,
      color: "text-teal-500 bg-teal-500/10",
    },
    {
      type: "ASSIGN_MEMBERSHIP_TIER",
      label: "Upgrade Tier",
      desc: "Elevate member rank and perks",
      icon: Award,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      type: "AWARD_BADGE",
      label: "Unlock Badge",
      desc: "Award gamification achievement badge",
      icon: Sparkles,
      color: "text-violet-500 bg-violet-500/10",
    },
    {
      type: "CUSTOM_WEBHOOK",
      label: "Call Webhook",
      desc: "Notify external CRM, Shopify, or API",
      icon: Globe,
      color: "text-zinc-500 bg-zinc-500/10",
    },
  ];

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-card border-r border-border flex flex-col items-center py-3 gap-3 z-10 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(false)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Expand Palette"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          <Zap className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[300px] h-full bg-card border-r border-border flex flex-col z-10 shrink-0 select-none overflow-hidden">
      {/* Palette Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-foreground">
            Node Palette
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex rounded-md bg-muted p-0.5 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={cn(
                "px-2 py-0.5 rounded transition-all",
                activeTab === "library"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Blocks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recipes")}
              className={cn(
                "px-2 py-0.5 rounded transition-all",
                activeTab === "recipes"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Recipes
            </button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
            className="h-6 w-6 text-muted-foreground hover:text-foreground ml-1"
            title="Collapse Palette"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {activeTab === "recipes" ? (
        /* Recipes Tab */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pre-built Automation Recipes
            </h4>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Instant multi-branch pipelines tailored for engagement games and rewards.
            </p>
          </div>

          <div className="space-y-2.5">
            {REWARDS_STARTER_RECIPES.map((recipe, idx) => {
              const Icon = recipe.icon;
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-border/80 bg-background hover:border-primary/40 transition-all space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-[11px] font-bold text-foreground leading-tight truncate">
                        {recipe.title}
                      </h5>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[8px] font-semibold px-1 py-0 h-4 shrink-0"
                    >
                      {recipe.badge}
                    </Badge>
                  </div>

                  <p className="text-[9.5px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onApplyRecipe(recipe.rule)}
                    className="w-full h-7 text-[10px] font-bold gap-1 cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                  >
                    <Plus className="w-3 h-3" />
                    Load Recipe into Canvas
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Blocks Tab */
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Module Selector Chips */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider block">
              Active Module Engine
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {MODULE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = module === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelectModule(tab.id)}
                    className={cn(
                      "h-8 px-2 rounded-lg border flex items-center gap-1.5 text-[10px] font-bold transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-2xs"
                        : "bg-background border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Triggers List */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider block">
              Lifecycle Triggers
            </span>
            <div className="space-y-1">
              {(MODULE_TRIGGERS[module] || []).map((trig) => {
                const isCurrent = trigger === trig.value;
                return (
                  <button
                    key={trig.value}
                    type="button"
                    onClick={() => onSelectTrigger(trig.value)}
                    className={cn(
                      "w-full p-2 rounded-lg border text-left transition-all cursor-pointer space-y-0.5",
                      isCurrent
                        ? "bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-2xs"
                        : "bg-background border-border/70 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10.5px] font-bold leading-none">
                        {trig.label}
                      </h5>
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-[7.5px] font-extrabold px-1 py-0 h-3.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 border-none"
                        >
                          ACTIVE
                        </Badge>
                      )}
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-tight">
                      {trig.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Conditions / Branching */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider">
                Filters & Branches
              </span>
              <button
                type="button"
                onClick={() => onAddBranch()}
                className="text-[9px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                New Branch
              </button>
            </div>

            <div className="space-y-1">
              {QUICK_CONDITIONS.map((cond, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onAddCondition(primaryBranchId, cond.field)}
                  className="w-full h-7 px-2 rounded-md border border-border/70 bg-background hover:bg-muted/40 hover:border-border text-[9.5px] font-semibold text-foreground flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="truncate flex items-center gap-1">
                    <Filter className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                    {cond.label}
                  </span>
                  <Plus className="w-2.5 h-2.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Reusable Action Blocks Grouped by Channel */}
          <ActionBlocksByChannel
            selectedBranchId={primaryBranchId}
            moduleType="rewards"
            showDualPathButtons={true}
            onAddAction={(type, branchId, path) =>
              onAddAction(
                type as RewardRuleActionType,
                branchId || primaryBranchId,
                path || "yes"
              )
            }
          />
        </div>
      )}
    </div>
  );
};
