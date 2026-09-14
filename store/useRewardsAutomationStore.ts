import { create } from "zustand";
import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleConditionInput,
  RewardRuleActionInput,
  RewardRuleActionType,
  RewardRuleBranchItem,
  RewardsAutomationRule,
  CanvasNodeState,
  CanvasEdgeState,
  deserializeActionFromConfig,
} from "@/graphql/rewards-automation";


export interface SelectedNodeInfo {
  type: "trigger" | "condition" | "action";
  data?: any;
}

export const getActionBranchId = (
  action?: RewardRuleActionInput | null
): string => {
  const b = action?.branch;
  if (!b || b === "yes" || b === "no") return "branch_1";
  if (b.endsWith("_yes")) return b.replace(/_yes$/, "");
  if (b.endsWith("_no")) return b.replace(/_no$/, "");
  return b;
};

export const getActionPath = (
  action?: RewardRuleActionInput | null
): "yes" | "no" => {
  const b = action?.branch;
  if (!b || b === "yes") return "yes";
  if (b === "no") return "no";
  if (b.endsWith("_no")) return "no";
  if (b.endsWith("_yes")) return "yes";
  return "yes";
};

export const formatActionBranch = (
  branchId: string,
  path: "yes" | "no"
): string => {
  return `${branchId}_${path}`;
};

export interface RewardsAutomationStoreState {
  name: string;
  description: string;
  module: RewardAutomationModule;
  trigger: RewardRuleTrigger;
  rewardId: string | null;
  rewardTitle: string | null;
  conditionOperator: "AND" | "OR";
  conditions: RewardRuleConditionInput[];
  actions: RewardRuleActionInput[];
  isActive: boolean;
  priority: number;
  branches: RewardRuleBranchItem[];
  selectedNode: SelectedNodeInfo | null;
  viewMode: "flow" | "form";
  hasChanged: boolean;
  canvasNodes: CanvasNodeState[];
  canvasEdges: CanvasEdgeState[];
  simulationState: {
    isRunning: boolean;
    passed?: boolean;
    reason?: string;
    executedActionIndices?: number[];
  } | null;

  // Setters & Actions
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setModule: (mod: RewardAutomationModule) => void;
  setTrigger: (trigger: RewardRuleTrigger) => void;
  setRewardId: (rewardId: string | null, rewardTitle?: string | null) => void;
  setConditionOperator: (op: "AND" | "OR") => void;
  setConditions: (conditions: RewardRuleConditionInput[]) => void;
  addCondition: (
    field?: string,
    branchId?: string,
    operator?: string,
    value?: any
  ) => void;
  removeCondition: (index: number) => void;
  removeAllConditions: (branchId?: string) => void;
  setActions: (actions: RewardRuleActionInput[]) => void;
  addAction: (
    type: RewardRuleActionType,
    branchId?: string,
    path?: "yes" | "no"
  ) => void;
  updateAction: (index: number, updates: Partial<RewardRuleActionInput>) => void;
  deleteAction: (index: number) => void;
  duplicateAction: (index: number) => void;
  setIsActive: (active: boolean) => void;
  setPriority: (priority: number) => void;
  setBranches: (branches: RewardRuleBranchItem[]) => void;
  addBranch: (initialField?: string) => void;
  duplicateBranch: (branchId: string) => void;
  updateBranchName: (branchId: string, name: string) => void;
  deleteBranch: (branchId: string) => void;
  toggleNoPath: (branchId: string, enabled?: boolean) => void;
  setSelectedNode: (node: SelectedNodeInfo | null) => void;
  setViewMode: (mode: "flow" | "form") => void;
  setCanvasState: (nodes: CanvasNodeState[], edges: CanvasEdgeState[]) => void;
  setSimulationState: (
    sim: RewardsAutomationStoreState["simulationState"]
  ) => void;
  applyRecipe: (recipe: any) => void;
  initFromRule: (rule?: Partial<RewardsAutomationRule> | null) => void;
  reset: () => void;
}

const DEFAULT_BRANCHES: RewardRuleBranchItem[] = [
  { id: "branch_1", name: "Branch 1 (Primary)", isDefault: true, hasNoPath: true },
];

export const useRewardsAutomationStore = create<RewardsAutomationStoreState>(
  (set, get) => ({
    name: "",
    description: "",
    module: "SPIN_WHEEL",
    trigger: "SPIN_WHEEL_PLAYED",
    rewardId: "ALL",
    rewardTitle: "All Active Games",
    conditionOperator: "AND",
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
        type: "AWARD_POINTS",
        branch: "branch_1_yes",
        points: { points: 50 },
      },
      {
        type: "NOTIFICATION",
        branch: "branch_1_yes",
        pushTitle: "Winner! 🎡",
        pushBody: "Check your reward wallet for your prize.",
        push: true,
      },
      {
        type: "AWARD_CURRENCY",
        branch: "branch_1_no",
        currency: { amount: 10, currencyType: "TC" },
      },
      {
        type: "NOTIFICATION",
        branch: "branch_1_no",
        pushTitle: "Try Again! 🍀",
        pushBody: "10 TC Coins have been credited to your wallet.",
        push: true,
      },
    ],
    isActive: true,
    priority: 1,
    branches: DEFAULT_BRANCHES,
    selectedNode: null,
    viewMode: "flow",
    hasChanged: false,
    canvasNodes: [],
    canvasEdges: [],
    simulationState: null,

    setName: (name) => set({ name, hasChanged: true }),
    setDescription: (description) => set({ description, hasChanged: true }),
    setModule: (module) => {
      let defaultTrigger: RewardRuleTrigger = "SPIN_WHEEL_PLAYED";
      if (module === "REWARDS") defaultTrigger = "REWARD_CLAIMED";
      if (module === "SCRATCH_CARD") defaultTrigger = "SCRATCH_CARD_PLAYED";
      if (module === "MATCH_WIN") defaultTrigger = "MATCH_WIN_PLAYED";
      set({ module, trigger: defaultTrigger, hasChanged: true });
    },
    setTrigger: (trigger) => set({ trigger, hasChanged: true }),
    setRewardId: (rewardId, rewardTitle) =>
      set({
        rewardId,
        rewardTitle: rewardTitle || (rewardId === "ALL" ? "All Active" : null),
        hasChanged: true,
      }),
    setConditionOperator: (conditionOperator) =>
      set({ conditionOperator, hasChanged: true }),
    setConditions: (conditions) => set({ conditions, hasChanged: true }),

    addCondition: (
      field = "context.isWinner",
      branchId = "branch_1",
      operator = "equals",
      value = true
    ) => {
      const { conditions, branches } = get();
      const newCond: RewardRuleConditionInput = {
        field,
        operator,
        value,
        branch: branchId,
      };
      const updated = [...conditions, newCond];
      const bName =
        branches.find((b) => b.id === branchId)?.name || "Branch 1 (Primary)";

      set({
        conditions: updated,
        hasChanged: true,
        selectedNode: {
          type: "condition",
          data: {
            branchId,
            branchName: bName,
            conditions: updated.filter(
              (c) => (c.branch || "branch_1") === branchId
            ),
          },
        },
      });
    },

    removeCondition: (index) => {
      const { conditions } = get();
      const updated = conditions.filter((_, i) => i !== index);
      set({ conditions: updated, hasChanged: true });
    },

    removeAllConditions: (branchId = "branch_1") => {
      const { conditions } = get();
      const updated = conditions.filter(
        (c) => (c.branch || "branch_1") !== branchId
      );
      set({ conditions: updated, hasChanged: true });
    },

    setActions: (actions) => set({ actions, hasChanged: true }),

    addAction: (type, branchId = "branch_1", path = "yes") => {
      const { actions } = get();
      const formattedBranch = formatActionBranch(branchId, path);

      const newAction: RewardRuleActionInput = {
        type,
        branch: formattedBranch,
        points: type === "AWARD_POINTS" ? { points: 25 } : undefined,
        currency:
          type === "AWARD_CURRENCY"
            ? { amount: 10, currencyType: "TC" }
            : undefined,
        pushTitle:
          type === "NOTIFICATION"
            ? path === "yes"
              ? "Congratulations! 🎉"
              : "Keep playing! 💫"
            : undefined,
        pushBody:
          type === "NOTIFICATION"
            ? path === "yes"
              ? "You unlocked an exclusive reward benefit."
              : "Better luck next time! Free entry credited."
            : undefined,
        push: type === "NOTIFICATION" ? true : undefined,
      };

      const updated = [...actions, newAction];
      set({
        actions: updated,
        hasChanged: true,
        selectedNode: {
          type: "action",
          data: {
            action: newAction,
            index: updated.length - 1,
            branchId,
            path,
          },
        },
      });
    },

    updateAction: (index, updates) => {
      const { actions } = get();
      if (index < 0 || index >= actions.length) return;
      const updated = [...actions];
      updated[index] = { ...updated[index], ...updates };
      set({ actions: updated, hasChanged: true });
    },

    deleteAction: (index) => {
      const { actions, selectedNode } = get();
      const updated = actions.filter((_, i) => i !== index);
      const isSelected =
        selectedNode?.type === "action" && selectedNode.data?.index === index;
      set({
        actions: updated,
        hasChanged: true,
        selectedNode: isSelected ? null : selectedNode,
      });
    },

    duplicateAction: (index) => {
      const { actions } = get();
      if (index < 0 || index >= actions.length) return;
      const target = actions[index];
      const copy: RewardRuleActionInput = JSON.parse(JSON.stringify(target));
      const updated = [...actions];
      updated.splice(index + 1, 0, copy);
      set({ actions: updated, hasChanged: true });
    },

    setIsActive: (isActive) => set({ isActive, hasChanged: true }),
    setPriority: (priority) => set({ priority, hasChanged: true }),

    setBranches: (branches) => set({ branches, hasChanged: true }),

    addBranch: (initialField = "context.isWinner") => {
      const { branches, conditions } = get();
      const newIndex = branches.length + 1;
      const newBranchId = `branch_${Date.now()}`;
      const newBranch: RewardRuleBranchItem = {
        id: newBranchId,
        name: `Branch ${newIndex}`,
        isDefault: false,
        hasNoPath: true,
      };

      const newCond: RewardRuleConditionInput = {
        field: initialField,
        operator: "equals",
        value: true,
        branch: newBranchId,
      };

      set({
        branches: [...branches, newBranch],
        conditions: [...conditions, newCond],
        hasChanged: true,
        selectedNode: {
          type: "condition",
          data: {
            branchId: newBranchId,
            branchName: newBranch.name,
            conditions: [newCond],
          },
        },
      });
    },

    duplicateBranch: (branchId) => {
      const { branches, conditions, actions } = get();
      const sourceBranch = branches.find((b) => b.id === branchId);
      if (!sourceBranch) return;

      const newBranchId = `branch_${Date.now()}`;
      const newBranch: RewardRuleBranchItem = {
        id: newBranchId,
        name: `${sourceBranch.name} (Copy)`,
        isDefault: false,
        hasNoPath: Boolean(sourceBranch.hasNoPath),
      };

      const sourceConditions = conditions.filter(
        (c) => (c.branch || "branch_1") === branchId
      );
      const clonedConditions = sourceConditions.map((c) => ({
        ...c,
        branch: newBranchId,
      }));

      const sourceActions = actions.filter(
        (a) => getActionBranchId(a) === branchId
      );
      const clonedActions = sourceActions.map((a) => {
        const path = getActionPath(a);
        return {
          ...a,
          branch: formatActionBranch(newBranchId, path),
        };
      });

      set({
        branches: [...branches, newBranch],
        conditions: [...conditions, ...clonedConditions],
        actions: [...actions, ...clonedActions],
        hasChanged: true,
      });
    },

    updateBranchName: (branchId, name) => {
      const { branches } = get();
      const updated = branches.map((b) =>
        b.id === branchId ? { ...b, name } : b
      );
      set({ branches: updated, hasChanged: true });
    },

    deleteBranch: (branchId) => {
      const { branches, conditions, actions, selectedNode } = get();
      if (branchId === "branch_1") return; // cannot delete default
      const updatedBranches = branches.filter((b) => b.id !== branchId);
      const updatedConditions = conditions.filter(
        (c) => (c.branch || "branch_1") !== branchId
      );
      const updatedActions = actions.filter(
        (a) => getActionBranchId(a) !== branchId
      );

      const isSelected =
        selectedNode?.type === "condition" &&
        selectedNode.data?.branchId === branchId;

      set({
        branches: updatedBranches,
        conditions: updatedConditions,
        actions: updatedActions,
        hasChanged: true,
        selectedNode: isSelected ? null : selectedNode,
      });
    },

    toggleNoPath: (branchId, enabled) => {
      const { branches } = get();
      const updated = branches.map((b) => {
        if (b.id === branchId) {
          const next = enabled !== undefined ? enabled : !b.hasNoPath;
          return { ...b, hasNoPath: next };
        }
        return b;
      });
      set({ branches: updated, hasChanged: true });
    },

    setSelectedNode: (selectedNode) => set({ selectedNode }),
    setViewMode: (viewMode) => set({ viewMode }),

    setCanvasState: (canvasNodes, canvasEdges) =>
      set({ canvasNodes, canvasEdges, hasChanged: true }),

    setSimulationState: (simulationState) => set({ simulationState }),

    applyRecipe: (recipe) => {
      set({
        name: recipe.name || "",
        description: recipe.description || "",
        module: recipe.module || "SPIN_WHEEL",
        trigger: recipe.trigger || "SPIN_WHEEL_PLAYED",
        rewardId: recipe.rewardId || "ALL",
        rewardTitle: recipe.rewardTitle || "All Active",
        conditionOperator: recipe.conditionOperator || "AND",
        branches: recipe.branches || DEFAULT_BRANCHES,
        conditions: recipe.conditions ? [...recipe.conditions] : [],
        actions: recipe.actions ? [...recipe.actions] : [],
        isActive: true,
        hasChanged: true,
        selectedNode: null,
      });
    },

    initFromRule: (rule) => {
      if (!rule) {
        get().reset();
        return;
      }

      // Infer trigger and module
      const trig = (rule.trigger || (rule as any).triggerType || "SPIN_WHEEL_PLAYED") as RewardRuleTrigger;
      let mod: RewardAutomationModule = rule.module || "SPIN_WHEEL";
      if (!rule.module) {
        if (
          trig === "REWARD_CLAIMED" ||
          trig === "REWARD_REDEEMED" ||
          trig === "REWARD_EXPIRED"
        ) {
          mod = "REWARDS";
        } else if (trig === "SCRATCH_CARD_PLAYED") {
          mod = "SCRATCH_CARD";
        } else if (trig === "MATCH_WIN_PLAYED") {
          mod = "MATCH_WIN";
        }
      }

      const parentId =
        rule.rewardId ||
        (rule as any).triggerConfig?.spinWheelId ||
        (rule as any).triggerConfig?.cardId ||
        (rule as any).triggerConfig?.rewardId ||
        (rule as any).triggerConfig?.configId ||
        "ALL";

      const branches =
        rule.branches && rule.branches.length > 0
          ? rule.branches.map((b) => ({
              id: b.id,
              name: b.name,
              isDefault: Boolean(b.isDefault),
              hasNoPath: Boolean(b.hasNoPath),
            }))
          : DEFAULT_BRANCHES;

      const actions = (rule.actions || []).map((a) => {
        const deserialized = (a as any).config ? deserializeActionFromConfig(a) : a;
        return {
          ...deserialized,
          branch: deserialized.branch || "branch_1_yes",
        };
      });

      const isActive =
        (rule as any).status !== undefined
          ? (rule as any).status === "ACTIVE"
          : (rule.isActive ?? true);

      set({
        name: rule.name || "",
        description: rule.description || "",
        module: mod,
        trigger: trig,
        rewardId: parentId,
        rewardTitle: rule.rewardTitle || (parentId === "ALL" ? "All Active" : parentId),
        conditionOperator:
          (rule.conditionOperator as "AND" | "OR") || "AND",
        branches,
        conditions: (rule.conditions || []).map((c) => ({
          field: c.field,
          operator: c.operator,
          value: c.value,
          branch: c.branch || "branch_1",
        })),
        actions,
        isActive,
        priority: rule.priority ?? (rule as any).triggerConfig?.priority ?? 1,
        canvasNodes: rule.canvasNodes || [],
        canvasEdges: rule.canvasEdges || [],
        hasChanged: false,
        selectedNode: null,
        simulationState: null,
      });
    },

    reset: () => {
      set({
        name: "",
        description: "",
        module: "SPIN_WHEEL",
        trigger: "SPIN_WHEEL_PLAYED",
        rewardId: "ALL",
        rewardTitle: "All Active Games",
        conditionOperator: "AND",
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
            type: "AWARD_POINTS",
            branch: "branch_1_yes",
            points: { points: 50 },
          },
          {
            type: "NOTIFICATION",
            branch: "branch_1_yes",
            pushTitle: "Winner! 🎡",
            pushBody: "Check your reward wallet for your prize.",
            push: true,
          },
          {
            type: "AWARD_CURRENCY",
            branch: "branch_1_no",
            currency: { amount: 10, currencyType: "TC" },
          },
          {
            type: "NOTIFICATION",
            branch: "branch_1_no",
            pushTitle: "Try Again! 🍀",
            pushBody: "10 TC Coins have been credited to your wallet.",
            push: true,
          },
        ],
        isActive: true,
        priority: 1,
        branches: DEFAULT_BRANCHES,
        selectedNode: null,
        viewMode: "flow",
        hasChanged: false,
        canvasNodes: [],
        canvasEdges: [],
        simulationState: null,
      });
    },
  })
);
