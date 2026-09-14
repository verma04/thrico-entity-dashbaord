"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  RewardsAutomationRule,
  CreateRewardsAutomationRuleInput,
  UpdateRewardsAutomationRuleInput,
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleConditionInput,
  RewardRuleActionInput,
  formatRewardsActionInput,
  GET_AUTOMATION_METADATA,
} from "@/graphql/rewards-automation";

import { useGetEntity } from "@/graphql/actions";
import { useRewardsAutomationStore } from "@/store/useRewardsAutomationStore";
import { RewardsFlowBuilder } from "./flow/rewards-flow-builder";
import { RewardsActionPipelineCard } from "./rewards-action-pipeline-card";
import { REWARDS_STARTER_RECIPES } from "./flow/rewards-node-palette";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ConditionBuilder } from "@/components/members/settings/rules/condition-builder";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Zap,
  Filter,
  Sparkles,
  TrendingUp,
  Dices,
  RectangleHorizontal,
  RefreshCw,
  Ticket,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RewardsAutomationFormProps {
  initialValues?: RewardsAutomationRule | null;
  loading?: boolean;
  onSave: (
    input: CreateRewardsAutomationRuleInput | UpdateRewardsAutomationRuleInput
  ) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const MODULE_OPTIONS: {
  value: RewardAutomationModule;
  label: string;
  badge: string;
  icon: any;
  color: string;
}[] = [
  {
    value: "SPIN_WHEEL",
    label: "Spin the Wheel",
    badge: "Interactive Wheel",
    icon: Dices,
    color: "from-amber-500 to-orange-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    value: "SCRATCH_CARD",
    label: "Scratch Card",
    badge: "Instant Win",
    icon: RectangleHorizontal,
    color: "from-pink-500 to-rose-600 text-pink-600 bg-pink-500/10 border-pink-500/20",
  },
  {
    value: "MATCH_WIN",
    label: "Match & Win",
    badge: "Memory Game",
    icon: RefreshCw,
    color: "from-cyan-500 to-blue-600 text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    value: "REWARDS",
    label: "Rewards & Coupons",
    badge: "Catalog Offers",
    icon: Ticket,
    color: "from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
];

const MODULE_TRIGGERS: Record<
  RewardAutomationModule,
  { value: RewardRuleTrigger; label: string; desc: string }[]
> = {
  SPIN_WHEEL: [
    {
      value: "SPIN_WHEEL_PLAYED",
      label: "Spin Wheel Played",
      desc: "Triggered whenever a participant completes a spin on the wheel.",
    },
  ],
  SCRATCH_CARD: [
    {
      value: "SCRATCH_CARD_PLAYED",
      label: "Scratch Card Scratched",
      desc: "Triggered when a member scratches all active panels.",
    },
  ],
  MATCH_WIN: [
    {
      value: "MATCH_WIN_PLAYED",
      label: "Match & Win Finished",
      desc: "Triggered upon finishing a match-and-win card game.",
    },
  ],
  REWARDS: [
    {
      value: "REWARD_CLAIMED",
      label: "Reward Voucher Claimed",
      desc: "Triggered when a member claims or unlocks a coupon.",
    },
    {
      value: "POINTS_REDEEMED",
      label: "Points Redeemed",
      desc: "Triggered when points are exchanged for a store reward.",
    },
  ],
};

export const RewardsAutomationForm: React.FC<RewardsAutomationFormProps> = ({
  initialValues,
  loading = false,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { data: entityData } = useGetEntity();
  const entityId = entityData?.getEntity?.id || "default";

  // Metadata query for dynamic triggers & configs
  const { data: metaData } = useQuery(GET_AUTOMATION_METADATA, {
    variables: { entityId },
    skip: !entityId || entityId === "default",
  });

  const viewMode = useRewardsAutomationStore((s) => s.viewMode);
  const setViewMode = useRewardsAutomationStore((s) => s.setViewMode);
  const name = useRewardsAutomationStore((s) => s.name);
  const setName = useRewardsAutomationStore((s) => s.setName);
  const description = useRewardsAutomationStore((s) => s.description);
  const setDescription = useRewardsAutomationStore((s) => s.setDescription);
  const module = useRewardsAutomationStore((s) => s.module);
  const setModule = useRewardsAutomationStore((s) => s.setModule);
  const trigger = useRewardsAutomationStore((s) => s.trigger);
  const setTrigger = useRewardsAutomationStore((s) => s.setTrigger);
  const rewardId = useRewardsAutomationStore((s) => s.rewardId);
  const setRewardId = useRewardsAutomationStore((s) => s.setRewardId);
  const conditionOperator = useRewardsAutomationStore((s) => s.conditionOperator);
  const setConditionOperator = useRewardsAutomationStore((s) => s.setConditionOperator);
  const conditions = useRewardsAutomationStore((s) => s.conditions);
  const setConditions = useRewardsAutomationStore((s) => s.setConditions);
  const actions = useRewardsAutomationStore((s) => s.actions);
  const setActions = useRewardsAutomationStore((s) => s.setActions);
  const branches = useRewardsAutomationStore((s) => s.branches);
  const isActive = useRewardsAutomationStore((s) => s.isActive);
  const setIsActive = useRewardsAutomationStore((s) => s.setIsActive);
  const hasChanged = useRewardsAutomationStore((s) => s.hasChanged);
  const initFromRule = useRewardsAutomationStore((s) => s.initFromRule);
  const reset = useRewardsAutomationStore((s) => s.reset);
  const applyRecipe = useRewardsAutomationStore((s) => s.applyRecipe);

  const [savedState, setSavedState] = useState(false);
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);

  // Initialize store on mount
  useEffect(() => {
    if (initialValues) {
      initFromRule(initialValues);
    } else {
      if (!isEdit && typeof window !== "undefined") {
        const draftStr = sessionStorage.getItem("rewards_automation_draft");
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            initFromRule(draft);
            sessionStorage.removeItem("rewards_automation_draft");
            toast.info("Applied template recipe to form.");
            return;
          } catch (e) {
            console.error("Failed to parse draft", e);
          }
        }
      }
      initFromRule(null);
    }
  }, [initialValues, isEdit, initFromRule]);

  const handleReset = () => {
    if (initialValues) {
      initFromRule(initialValues);
    } else {
      reset();
    }
  };

  const handleApplyRecipe = (recipeRule: any) => {
    const hasEmail = recipeRule.actions?.some((a: any) => a.type === "EMAIL");
    if (hasEmail && !isVerified) {
      const sanitized = {
        ...recipeRule,
        actions: recipeRule.actions.filter((a: any) => a.type !== "EMAIL"),
      };
      applyRecipe(sanitized);
      toast.info(
        `Applied recipe without email action (sender domain unverified).`
      );
      setShowDomainModal(true);
      return;
    }
    applyRecipe(recipeRule);
    toast.success(`Applied ${recipeRule.name || "recipe"} template.`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const state = useRewardsAutomationStore.getState();

    if (!state.name.trim()) {
      toast.error("Please enter a rule name.");
      return;
    }

    if (state.actions.length === 0) {
      toast.error("Please configure at least one automated action.");
      return;
    }

    // Check if rule contains EMAIL action while domain is unverified
    const hasEmailAction = state.actions.some((a) => a.type === "EMAIL");
    if (hasEmailAction && !isVerified) {
      setShowDomainModal(true);
      toast.error(
        "Cannot save automation rule: Email actions require a configured and verified sender domain."
      );
      return;
    }

    // Clean conditions
    const validConditions = state.conditions
      .filter((c) => {
        if (typeof c.value === "string") return c.value.trim().length > 0;
        return c.value !== null && c.value !== undefined;
      })
      .map((c) => ({
        field: c.field,
        operator: c.operator,
        value: c.value,
        branch: c.branch || "branch_1",
      }));

    const payload: CreateRewardsAutomationRuleInput = {
      name: state.name.trim(),
      description: state.description?.trim() || undefined,
      rewardId:
        state.rewardId && state.rewardId !== "ALL"
          ? state.rewardId
          : undefined,
      trigger: state.trigger,
      conditionOperator: state.conditionOperator || "AND",
      branches: (state.branches || []).map((b) => ({
        id: b.id,
        name: b.name,
        isDefault: Boolean(b.isDefault),
        hasNoPath: Boolean(b.hasNoPath),
      })),
      conditions: validConditions,
      actions: state.actions.map(formatRewardsActionInput),
      canvasNodes: state.canvasNodes,
      canvasEdges: state.canvasEdges,
      isActive: state.isActive,
      priority: state.priority || 1,
    };

    try {
      await onSave(payload);
      setSavedState(true);
      setTimeout(() => setSavedState(false), 3000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save rewards rule.");
    }
  };

  const selectedModuleMeta = useMemo(() => {
    return MODULE_OPTIONS.find((m) => m.value === module) || MODULE_OPTIONS[0];
  }, [module]);

  const currentTriggers = MODULE_TRIGGERS[module] || MODULE_TRIGGERS.SPIN_WHEEL;

  // Flow Canvas View Mode (Default: Interactive ReactFlow)
  if (viewMode === "flow") {
    return (
      <div className="w-full h-full h-screen flex flex-col overflow-hidden bg-background">
        <RewardsFlowBuilder
          onSave={handleSubmit}
          onReset={handleReset}
          onCancel={onCancel}
          isSaving={loading}
          isEdit={isEdit}
          saved={savedState}
          hasChanged={hasChanged}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <EmailDomainSetupModal
          open={showDomainModal}
          onOpenChange={setShowDomainModal}
        />
      </div>
    );
  }

  // Classic Step Form Mode (Reusing ActionBuilder from /members/automation/create)
  return (
    <div className="w-full h-full h-screen flex flex-col overflow-hidden bg-background">
      {/* Top Navbar */}
      <header className="h-14 px-4 bg-card border-b border-border flex items-center justify-between gap-3 shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {onCancel && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title="Back to Rules"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-4 w-px bg-border shrink-0" />
            </>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase leading-none">
                  Rewards Automation
                </span>
                <Badge
                  variant="outline"
                  className="text-[8.5px] font-bold px-1 py-0 h-3.5 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30"
                >
                  Step Form Mode
                </Badge>
              </div>
              <span className="text-[11px] font-semibold text-foreground/80 leading-tight">
                {name || "Untitled Workflow"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViewMode("flow")}
            className="h-8 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Switch to Canvas
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => handleSubmit()}
            className="h-8 px-3 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {loading ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
          </Button>

          {onCancel && (
            <>
              <div className="h-4 w-px bg-border shrink-0 ml-0.5" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg shrink-0 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <PolarisFormLayout
              sidebar={
                <div className="space-y-4">
                  {/* Live Pipeline Flow Preview */}
                  <PolarisSidebarCard
                    title="Workflow Pipeline"
                    badge="Live Summary"
                    icon={Sparkles}
                  >
                    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
                      <div className="p-3 rounded-[6px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-800 space-y-2">
                        {/* Step 1: Trigger */}
                        <div className="flex items-center gap-2 text-[12.5px]">
                          <div className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-[10px]">
                            1
                          </div>
                          <span className="font-semibold text-[#303030] dark:text-zinc-100">
                            {selectedModuleMeta.label} ({trigger})
                          </span>
                        </div>

                        <div className="pl-2.5">
                          <div className="w-px h-2.5 bg-[#d2d5d9] dark:bg-zinc-700" />
                        </div>

                        {/* Step 2: Conditions */}
                        <div className="flex items-center gap-2 text-[12.5px]">
                          <div className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">
                            2
                          </div>
                          <span className="font-semibold text-[#303030] dark:text-zinc-100">
                            {conditions.length > 0
                              ? `${conditions.length} Condition${conditions.length > 1 ? "s" : ""} (${conditionOperator})`
                              : "All Plays (Default Win / Loss Paths)"}
                          </span>
                        </div>

                        <div className="pl-2.5">
                          <div className="w-px h-2.5 bg-[#d2d5d9] dark:bg-zinc-700" />
                        </div>

                        {/* Step 3: Actions */}
                        <div className="flex items-center gap-2 text-[12.5px]">
                          <div className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-[10px]">
                            3
                          </div>
                          <span className="font-semibold text-[#303030] dark:text-zinc-100">
                            {actions.length} Action{actions.length === 1 ? "" : "s"} Configured
                          </span>
                        </div>
                      </div>

                      {/* Summary Table Breakdown */}
                      <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                        <PolarisSummaryRow
                          label="Rule Name"
                          value={
                            <span className="truncate max-w-[140px] inline-block font-semibold">
                              {name || "Untitled Rule"}
                            </span>
                          }
                        />
                        <PolarisSummaryRow
                          label="Game Engine"
                          value={selectedModuleMeta.label}
                        />
                        <PolarisSummaryRow
                          label="Target Game"
                          value={rewardId === "ALL" || !rewardId ? "All Configurations" : "Specific Item"}
                        />
                        <PolarisSummaryRow
                          label="Actions Total"
                          value={`${actions.length} Configured`}
                        />
                        <PolarisSummaryRow
                          label="Status"
                          value={
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.2 rounded-[4px]",
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                                  : "bg-zinc-100 text-zinc-600 border-zinc-300"
                              )}
                            >
                              {isActive ? "Active" : "Paused"}
                            </Badge>
                          }
                          isLast
                        />
                      </div>
                    </div>
                  </PolarisSidebarCard>

                  {/* 1-Click Template Recipes */}
                  <PolarisSidebarCard
                    title="Starter Recipes"
                    badge="1-Click"
                    icon={Sparkles}
                  >
                    <div className="space-y-1.5">
                      {REWARDS_STARTER_RECIPES.map((recipe, idx) => {
                        const Icon = recipe.icon;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyRecipe(recipe.rule)}
                            className="w-full p-2.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9] bg-white dark:bg-zinc-900 hover:bg-[#f6f6f7] text-left transition-all flex items-start gap-2.5 group cursor-pointer"
                          >
                            <div className="w-6 h-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5 text-[#616161] group-hover:text-[#303030]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block truncate">
                                {recipe.title}
                              </span>
                              <span className="text-[11px] text-[#616161] dark:text-zinc-400 truncate block">
                                {recipe.badge} · {recipe.rule.actions?.length || 0} Actions
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </PolarisSidebarCard>

                  {/* Automation Execution Logic Tip */}
                  <PolarisTipCard title="Gamification Best Practices" icon={TrendingUp}>
                    <div className="space-y-1.5 text-[12px] text-[#616161] leading-[16px]">
                      <p>
                        <strong>Dual-Outcome:</strong> Always provide a consolation coin or point reward on losing spins to keep retention high.
                      </p>
                      <p>
                        <strong>Automated Delivery:</strong> Connect in-app push alerts so winners get immediate feedback on prize credits.
                      </p>
                    </div>
                  </PolarisTipCard>
                </div>
              }
            >
              {/* ── Step 1: Basic Information & Game Module ───────────────────── */}
              <PolarisFormCard
                step={1}
                title="Rule Identification & Game Engine"
                description="Select the gamification module (Wheel, Scratch, Match, Rewards) and lifecycle trigger."
                icon={Zap}
              >
                <div className="space-y-3.5">
                  <PolarisInput
                    id="rule-name"
                    label="Rule Name"
                    required
                    placeholder="e.g. Spin Wheel Winner Points & Consolation Flow"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    prefix={<Trophy className="h-3.5 w-3.5" />}
                  />

                  <PolarisTextarea
                    id="rule-description"
                    label="Description"
                    placeholder="Describe what game outcome triggers this rule and what prizes or consolations are fulfilled..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    helperText="Optional context explaining target criteria or promotion schedule."
                  />

                  {/* Module Engine Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <PolarisLabel required>Gamification Engine Module</PolarisLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {MODULE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = module === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setModule(opt.value);
                              const newTrigs = MODULE_TRIGGERS[opt.value];
                              if (newTrigs?.[0]) setTrigger(newTrigs[0].value);
                            }}
                            className={cn(
                              "p-2.5 rounded-[8px] border text-left flex flex-col justify-between transition-all cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]"
                            )}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="text-[12px] font-bold text-foreground">
                                {opt.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {opt.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Trigger Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <PolarisLabel required>Trigger Lifecycle Event (WHEN)</PolarisLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentTriggers.map((trig) => {
                        const isSelected = trigger === trig.value;
                        return (
                          <button
                            key={trig.value}
                            type="button"
                            onClick={() => setTrigger(trig.value)}
                            className={cn(
                              "p-2.5 rounded-[8px] border text-left transition-all cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]"
                            )}
                          >
                            <span className="text-[12px] font-bold text-foreground block">
                              {trig.label}
                            </span>
                            <span className="text-[10.5px] text-muted-foreground block mt-0.5">
                              {trig.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Reward / Game Config Filter */}
                  <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1.5">
                    <PolarisLabel>Target Game Configuration / Voucher</PolarisLabel>
                    <Select
                      value={rewardId || "ALL"}
                      onValueChange={(val) => setRewardId(val === "ALL" ? null : val)}
                    >
                      <SelectTrigger className="h-9 text-xs bg-background">
                        <SelectValue placeholder="All Game Instances" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL" className="text-xs font-semibold">
                          🌐 All {selectedModuleMeta.label} Configurations
                        </SelectItem>
                        <SelectItem value="config_primary" className="text-xs">
                          Primary Live Game
                        </SelectItem>
                        <SelectItem value="config_weekend" className="text-xs">
                          Weekend Jackpot Edition
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Switch */}
                  <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#f6f6f7]/50 dark:bg-zinc-900/40 border border-[#d2d5d9] dark:border-zinc-800 mt-2">
                    <div>
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                        Rule Active Status
                      </span>
                      <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                        When active, this rule automatically evaluates game plays in real time.
                      </span>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </div>
              </PolarisFormCard>

              {/* ── Step 2: Targeting Conditions ──────────────────────────────── */}
              <PolarisFormCard
                step={2}
                title="Targeting Conditions & Match Criteria"
                description="Filter which participants qualify for winner vs consolation outcomes (e.g., isWinner, prizeType, faceValue)."
                icon={Filter}
              >
                <div className="space-y-3">
                  <ConditionBuilder
                    conditions={conditions as any}
                    conditionOperator={conditionOperator}
                    onConditionOperatorChange={setConditionOperator}
                    onChange={(conds) => setConditions(conds as RewardRuleConditionInput[])}
                  />
                </div>
              </PolarisFormCard>

              {/* ── Step 3: Reusable Action Pipeline Card (Reused from /members/automation) ── */}
              <RewardsActionPipelineCard
                actions={actions}
                onActionsChange={setActions}
                trigger={trigger}
              />
            </PolarisFormLayout>

            {/* Floating Save Panel */}
            <FloatingSavePanel
              hasChanged={hasChanged}
              saved={savedState}
              isSaving={loading}
              onSave={() => handleSubmit()}
              onReset={handleReset}
              title="Unsaved rewards rule changes"
              buttonText={isEdit ? "Update Rule" : "Create Rule"}
            />

            <EmailDomainSetupModal
              open={showDomainModal}
              onOpenChange={setShowDomainModal}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
