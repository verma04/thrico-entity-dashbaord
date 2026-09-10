import { create } from "zustand";
import {
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
  MemberRuleActionType,
  MemberAutomationRule,
} from "@/graphql/member-automation";
import { CONDITION_FIELDS } from "@/components/members/settings/rules/condition-builder";
import { SelectedNodeInfo } from "@/components/members/automation/flow/types";
import { toast } from "sonner";

export interface BranchItem {
  id: string;
  name: string;
  isDefault?: boolean;
  hasNoPath?: boolean;
}

export const getActionBranchId = (
  action?: MemberRuleActionInput | null
): string => {
  const b = action?.branch;
  if (!b || b === "yes" || b === "no") return "branch_1";
  if (b.endsWith("_yes")) return b.replace(/_yes$/, "");
  if (b.endsWith("_no")) return b.replace(/_no$/, "");
  return b;
};

export const getActionPath = (
  action?: MemberRuleActionInput | null
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
  if (branchId === "branch_1") {
    return path;
  }
  return `${branchId}_${path}`;
};

export interface AutomationStoreState {
  name: string;
  description: string;
  trigger: MemberRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  isActive: boolean;
  branches: BranchItem[];
  selectedNode: SelectedNodeInfo | null;
  viewMode: "flow" | "form";
  hasChanged: boolean;
  simulationState: {
    isRunning: boolean;
    passed?: boolean;
    reason?: string;
  } | null;

  // Actions
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setTrigger: (trigger: MemberRuleTrigger) => void;
  setConditionOperator: (op: "AND" | "OR") => void;
  setConditions: (conditions: MemberRuleConditionInput[]) => void;
  addCondition: (field?: string, branchId?: string) => void;
  removeCondition: (index: number) => void;
  removeAllConditions: (branchId?: string) => void;
  setActions: (actions: MemberRuleActionInput[]) => void;
  addAction: (
    type: MemberRuleActionType,
    branchId?: string,
    path?: "yes" | "no"
  ) => void;
  updateAction: (index: number, updates: Partial<MemberRuleActionInput>) => void;
  deleteAction: (index: number) => void;
  duplicateAction: (index: number) => void;
  setIsActive: (active: boolean) => void;
  setBranches: (branches: BranchItem[]) => void;
  addBranch: (initialField?: string) => void;
  duplicateBranch: (branchId: string) => void;
  updateBranchName: (branchId: string, name: string) => void;
  deleteBranch: (branchId: string) => void;
  toggleNoPath: (branchId: string, enabled?: boolean) => void;
  setSelectedNode: (node: SelectedNodeInfo | null) => void;
  setViewMode: (mode: "flow" | "form") => void;
  setSimulationState: (sim: AutomationStoreState["simulationState"]) => void;
  applyRecipe: (recipe: any) => void;
  initFromRule: (rule?: Partial<MemberAutomationRule> | null) => void;
  reset: () => void;
}

const DEFAULT_BRANCHES: BranchItem[] = [
  { id: "branch_1", name: "Branch 1 (Primary)", isDefault: true, hasNoPath: false },
];

export const useAutomationStore = create<AutomationStoreState>((set, get) => ({
  name: "",
  description: "",
  trigger: "MEMBER_JOINED",
  conditionOperator: "AND",
  conditions: [],
  actions: [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
  isActive: true,
  branches: DEFAULT_BRANCHES,
  selectedNode: null,
  viewMode: "flow",
  hasChanged: false,
  simulationState: null,

  setName: (name) => set({ name, hasChanged: true }),
  setDescription: (description) => set({ description, hasChanged: true }),
  setTrigger: (trigger) => set({ trigger, hasChanged: true }),
  setConditionOperator: (conditionOperator) =>
    set({ conditionOperator, hasChanged: true }),
  setConditions: (conditions) => set({ conditions, hasChanged: true }),

  addCondition: (field = "profile.college", branchId = "branch_1") => {
    const { conditions, branches, conditionOperator } = get();
    const fieldMeta = CONDITION_FIELDS.find((f) => f.value === field);
    const isBool = fieldMeta?.type === "boolean";
    const newCond: MemberRuleConditionInput = {
      field,
      operator: isBool ? "equals" : "contains",
      value: isBool ? "true" : "",
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
          conditionOperator,
          focusedField: field,
        },
      },
    });
    toast.success(`Added filter: ${fieldMeta?.label || field}`);
  },

  removeCondition: (index) => {
    const { conditions } = get();
    const updated = conditions.filter((_, i) => i !== index);
    set({ conditions: updated, hasChanged: true });
  },

  removeAllConditions: (branchId = "branch_1") => {
    const { conditions, branches } = get();
    const updated = conditions.filter(
      (c) => (c.branch || "branch_1") !== branchId
    );
    const bName =
      branches.find((b) => b.id === branchId)?.name || "Branch 1 (Primary)";
    set({ conditions: updated, hasChanged: true });
    toast.info(`Removed filters for ${bName}.`);
  },

  setActions: (actions) => set({ actions, hasChanged: true }),

  addAction: (type, branchId = "branch_1", path = "yes") => {
    const { actions, branches } = get();
    const branchString = formatActionBranch(branchId, path);
    let newAction: MemberRuleActionInput;

    switch (type) {
      case "ASSIGN_MEMBERSHIP_TIER":
        newAction = { type: "ASSIGN_MEMBERSHIP_TIER", branch: branchString };
        break;
      case "COMMUNITY_JOIN":
        newAction = { type: "COMMUNITY_JOIN", branch: branchString };
        break;
      case "EMAIL":
        newAction = {
          type: "EMAIL",
          emailSubject:
            path === "no"
              ? "Membership update regarding your application"
              : "Welcome to our community! 🎉",
          branch: branchString,
        };
        break;
      case "NOTIFICATION":
        newAction = {
          type: "NOTIFICATION",
          pushTitle:
            path === "no"
              ? "Membership notice"
              : "Welcome to our community! ✨",
          pushBody:
            path === "no"
              ? "Your application did not match criteria."
              : "Your membership tier has been automatically updated.",
          notificationMessage:
            path === "no"
              ? "Your application did not match criteria."
              : "Your membership tier has been automatically updated.",
          push: true,
          branch: branchString,
        };
        break;
      case "ADD_MEMBER_TAG":
        newAction = {
          type: "ADD_MEMBER_TAG",
          tags:
            path === "no"
              ? ["Unmatched", "Fallback-Review"]
              : ["VIP", "Auto-Assigned"],
          branch: branchString,
        };
        break;
      case "CUSTOM_WEBHOOK":
      case "WEBHOOK":
        newAction = {
          type: "CUSTOM_WEBHOOK",
          webhook: {
            url: "",
            method: "POST",
            authType: "NONE",
            mapping: [],
          },
          branch: branchString,
        };
        break;
      case "AWARD_POINTS":
        newAction = {
          type: "AWARD_POINTS",
          points: path === "no" ? 10 : 50,
          branch: branchString,
        };
        break;
      default:
        newAction = { type, branch: branchString };
    }

    const updatedBranches = branches.map((b) =>
      b.id === branchId && path === "no" && !b.hasNoPath
        ? { ...b, hasNoPath: true }
        : b
    );

    const updated = [...actions, newAction];
    const bObj = branches.find((b) => b.id === branchId);
    const bLabel = bObj ? bObj.name : branchId;

    set({
      actions: updated,
      branches: updatedBranches,
      hasChanged: true,
      selectedNode: {
        type: "action",
        data: { action: newAction, index: actions.length },
        index: actions.length,
      },
    });

    toast.success(
      `Added action to ${bLabel} [${path === "no" ? "NO (Fallback)" : "YES"} path].`
    );
  },

  updateAction: (index, updates) => {
    const { actions, selectedNode } = get();
    const updated = actions.map((a, i) =>
      i === index ? { ...a, ...updates } : a
    );
    let nextSelected = selectedNode;
    if (selectedNode?.type === "action" && selectedNode.index === index) {
      nextSelected = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          action: { ...selectedNode.data?.action, ...updates },
        },
      };
    }
    set({ actions: updated, selectedNode: nextSelected, hasChanged: true });
  },

  deleteAction: (index) => {
    const { actions, selectedNode } = get();
    const updated = actions.filter((_, i) => i !== index);
    const nextSelected =
      selectedNode?.type === "action" && selectedNode.index === index
        ? null
        : selectedNode;
    set({ actions: updated, selectedNode: nextSelected, hasChanged: true });
  },

  duplicateAction: (index) => {
    const { actions } = get();
    const actToDup = actions[index];
    if (actToDup) {
      const duplicated = { ...actToDup };
      set({ actions: [...actions, duplicated], hasChanged: true });
      toast.success("Action duplicated.");
    }
  },

  setIsActive: (isActive) => set({ isActive, hasChanged: true }),
  setBranches: (branches) => set({ branches }),

  addBranch: (initialField = "profile.college") => {
    const { branches, conditions, actions, conditionOperator } = get();
    const nextIdx = branches.length + 1;
    const nextId = `branch_${nextIdx}`;
    const nextName = `Branch ${nextIdx}`;

    const fieldMeta = CONDITION_FIELDS.find((f) => f.value === initialField);
    const isBool = fieldMeta?.type === "boolean";
    const newCond: MemberRuleConditionInput = {
      field: initialField,
      operator: isBool ? "equals" : "contains",
      value: isBool ? "true" : "",
      branch: nextId,
    };

    const newAction: MemberRuleActionInput = {
      type: "ASSIGN_MEMBERSHIP_TIER",
      branch: formatActionBranch(nextId, "yes"),
    };

    const updatedBranches: BranchItem[] = [
      ...branches,
      { id: nextId, name: nextName, hasNoPath: false },
    ];
    const updatedConditions = [...conditions, newCond];
    const updatedActions = [...actions, newAction];

    set({
      branches: updatedBranches,
      conditions: updatedConditions,
      actions: updatedActions,
      hasChanged: true,
      selectedNode: {
        type: "condition",
        data: {
          branchId: nextId,
          branchName: nextName,
          conditions: [newCond],
          conditionOperator,
          focusedField: initialField,
        },
      },
    });
    toast.success(`Created ${nextName} based on filter: ${fieldMeta?.label || initialField}`);
  },

  duplicateBranch: (branchId: string) => {
    const { branches, conditions, actions, conditionOperator } = get();
    const sourceBranch = branches.find((b) => b.id === branchId);
    if (!sourceBranch) return;

    const nextIdx = branches.length + 1;
    const nextId = `branch_${nextIdx}`;
    const nextName = `${sourceBranch.name} (Copy)`;

    const branchConditions = conditions
      .filter((c) => (c.branch || "branch_1") === branchId)
      .map((c) => ({ ...c, branch: nextId }));

    const branchActions = actions
      .filter((a) => getActionBranchId(a) === branchId)
      .map((a) => ({
        ...a,
        branch: formatActionBranch(nextId, getActionPath(a)),
      }));

    set({
      branches: [
        ...branches,
        {
          id: nextId,
          name: nextName,
          hasNoPath: Boolean(sourceBranch.hasNoPath),
        },
      ],
      conditions: [...conditions, ...branchConditions],
      actions: [...actions, ...branchActions],
      hasChanged: true,
      selectedNode: {
        type: "condition",
        data: {
          branchId: nextId,
          branchName: nextName,
          conditions: branchConditions,
          conditionOperator,
        },
      },
    });
    toast.success(`Duplicated ${sourceBranch.name} to ${nextName}`);
  },

  toggleNoPath: (branchId: string, enabled?: boolean) => {
    const { branches, actions } = get();
    const targetBranch = branches.find((b) => b.id === branchId);
    if (!targetBranch) return;

    const nextHasNoPath =
      enabled !== undefined ? enabled : !targetBranch.hasNoPath;

    const nextBranches = branches.map((b) =>
      b.id === branchId ? { ...b, hasNoPath: nextHasNoPath } : b
    );

    let nextActions = actions;
    if (!nextHasNoPath) {
      nextActions = actions.filter(
        (a) =>
          !(
            getActionBranchId(a) === branchId && getActionPath(a) === "no"
          )
      );
    }

    set({
      branches: nextBranches,
      actions: nextActions,
      hasChanged: true,
    });

    if (nextHasNoPath) {
      toast.success(`Enabled NO (Else) path for ${targetBranch.name}`);
    } else {
      toast.info(`Disabled NO (Else) path for ${targetBranch.name}`);
    }
  },

  updateBranchName: (branchId: string, name: string) => {
    const { branches, selectedNode } = get();
    const updated = branches.map((b) =>
      b.id === branchId ? { ...b, name } : b
    );
    let nextSelected = selectedNode;
    if (
      selectedNode?.type === "condition" &&
      (selectedNode.data as any)?.branchId === branchId
    ) {
      nextSelected = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          branchName: name,
        },
      };
    }
    set({ branches: updated, selectedNode: nextSelected, hasChanged: true });
  },

  deleteBranch: (branchId) => {
    if (branchId === "branch_1") {
      toast.error("Cannot delete the primary branch.");
      return;
    }
    const { branches, conditions, actions, trigger } = get();
    const nextBranches = branches.filter((b) => b.id !== branchId);
    const nextConditions = conditions.filter(
      (c) => (c.branch || "branch_1") !== branchId
    );
    const nextActions = actions.filter((a) => getActionBranchId(a) !== branchId);

    set({
      branches: nextBranches,
      conditions: nextConditions,
      actions: nextActions,
      selectedNode: { type: "trigger", data: { trigger } },
      hasChanged: true,
    });
    toast.info("Branch and its filters/rules removed.");
  },

  setSelectedNode: (selectedNode) => set({ selectedNode }),
  setViewMode: (viewMode) => set({ viewMode }),

  setSimulationState: (simulationState) => set({ simulationState }),

  applyRecipe: (recipe) => {
    const detectedBranches = new Set<string>(["branch_1"]);
    recipe.conditions?.forEach((c: any) => {
      if (c.branch) detectedBranches.add(c.branch);
    });
    recipe.actions?.forEach((a: any) => {
      const bId = getActionBranchId(a);
      if (bId) detectedBranches.add(bId);
    });

    const branchesList: BranchItem[] = Array.from(detectedBranches).map(
      (id, idx) => ({
        id,
        name: id === "branch_1" ? "Branch 1 (Primary)" : `Branch ${idx + 1}`,
        isDefault: id === "branch_1",
        hasNoPath: (recipe.actions || []).some(
          (a: any) => getActionBranchId(a) === id && getActionPath(a) === "no"
        ),
      })
    );

    set({
      name: recipe.title,
      description: `Automated rule: ${recipe.title}`,
      trigger: recipe.trigger,
      conditionOperator: recipe.conditionOperator,
      conditions: recipe.conditions || [],
      actions: recipe.actions || [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
      branches: branchesList,
      hasChanged: true,
    });
    toast.success(`Applied template recipe: "${recipe.title}"`);
  },

  initFromRule: (rule) => {
    if (!rule) {
      set({
        name: "",
        description: "",
        trigger: "MEMBER_JOINED",
        conditionOperator: "AND",
        conditions: [],
        actions: [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
        isActive: true,
        branches: DEFAULT_BRANCHES,
        selectedNode: null,
        hasChanged: false,
      });
      return;
    }

    const detectedBranches = new Set<string>(["branch_1"]);
    rule.conditions?.forEach((c: any) => {
      if (c.branch) detectedBranches.add(c.branch);
    });
    rule.actions?.forEach((a: any) => {
      const bId = getActionBranchId(a);
      if (bId) detectedBranches.add(bId);
    });

    const branchesList: BranchItem[] =
      (rule as any).branches && (rule as any).branches.length > 0
        ? (rule as any).branches.map((b: any, idx: number) => ({
            id: b.id,
            name:
              b.name ||
              (b.id === "branch_1" ? "Branch 1 (Primary)" : `Branch ${idx + 1}`),
            isDefault: b.isDefault ?? (b.id === "branch_1"),
            hasNoPath:
              Boolean(b.hasNoPath) ||
              (rule.actions || []).some(
                (a: any) =>
                  getActionBranchId(a) === b.id && getActionPath(a) === "no"
              ),
          }))
        : Array.from(detectedBranches).map((id, idx) => ({
            id,
            name: id === "branch_1" ? "Branch 1 (Primary)" : `Branch ${idx + 1}`,
            isDefault: id === "branch_1",
            hasNoPath: (rule.actions || []).some(
              (a: any) =>
                getActionBranchId(a) === id && getActionPath(a) === "no"
            ),
          }));

    set({
      name: rule.name || "",
      description: rule.description || "",
      trigger: (rule.trigger as MemberRuleTrigger) || "MEMBER_JOINED",
      conditionOperator:
        (rule.conditionOperator as "AND" | "OR") || "AND",
      conditions: rule.conditions
        ? rule.conditions.map((c) => ({
            field: c.field,
            operator: c.operator,
            value: c.value,
            branch: (c as any).branch || "branch_1",
          }))
        : [],
      actions: rule.actions
        ? rule.actions.map((a) => ({
            type: a.type,
            branch: (a as any).branch || "yes",
            tierId: a.tierId,
            templateId: a.templateId,
            emailSubject: a.emailSubject,
            emailBody: a.emailBody,
            communityId: a.communityId,
            tags: a.tags,
            notificationMessage: a.notificationMessage,
            pushTitle: a.pushTitle,
            pushBody: a.pushBody,
            push: a.push,
            points: a.points,
            webhook: a.webhook
              ? {
                  url: a.webhook.url || "",
                  method: a.webhook.method || "POST",
                  authType: a.webhook.authType || "NONE",
                  authToken: a.webhook.authToken,
                  authHeaderKey: a.webhook.authHeaderKey,
                  authHeaderValue: a.webhook.authHeaderValue,
                  mapping: a.webhook.mapping
                    ? a.webhook.mapping.map((m: any) => ({
                        field: m.field,
                        value: m.value,
                      }))
                    : [],
                }
              : undefined,
          }))
        : [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
      isActive: rule.isActive !== undefined ? rule.isActive : true,
      branches: branchesList,
      selectedNode: null,
      hasChanged: false,
    });
  },

  reset: () =>
    set({
      name: "",
      description: "",
      trigger: "MEMBER_JOINED",
      conditionOperator: "AND",
      conditions: [],
      actions: [{ type: "ASSIGN_MEMBERSHIP_TIER" }],
      isActive: true,
      branches: DEFAULT_BRANCHES,
      selectedNode: null,
      hasChanged: false,
      simulationState: null,
    }),
}));
