import { Node, Edge, MarkerType } from "@xyflow/react";
import {
  RewardAutomationModule,
  RewardRuleTrigger,
  RewardRuleConditionInput,
  RewardRuleActionInput,
  RewardRuleActionType,
  RewardRuleBranchItem,
} from "@/graphql/rewards-automation";
import {
  getActionBranchId,
  getActionPath,
} from "@/store/useRewardsAutomationStore";
import { SelectedNodeInfo } from "./types";

export interface GenerateRewardsGraphParams {
  module: RewardAutomationModule;
  trigger: RewardRuleTrigger;
  rewardId: string | null;
  rewardTitle: string | null;
  branches: RewardRuleBranchItem[];
  conditions: RewardRuleConditionInput[];
  actions: RewardRuleActionInput[];
  conditionOperator: "AND" | "OR";
  simulationState?: any;
  onAddBranch: (initialField?: string) => void;
  onDeleteBranch: (branchId: string) => void;
  onDuplicateBranch?: (branchId: string) => void;
  onToggleNoPath?: (branchId: string, enabled?: boolean) => void;
  onAddCondition: (branchId: string, field?: string) => void;
  onDeleteCondition: (globalIndex: number) => void;
  onSelectNode: (node: SelectedNodeInfo | null) => void;
  onOperatorChange: (op: "AND" | "OR") => void;
  onAddAction: (
    type: RewardRuleActionType,
    branchId: string,
    path?: "yes" | "no"
  ) => void;
  onDeleteAction: (index: number) => void;
  onDuplicateAction: (index: number) => void;
}

export const generateRewardsGraph = ({
  module,
  trigger,
  rewardId,
  rewardTitle,
  branches,
  conditions,
  actions,
  conditionOperator,
  simulationState,
  onAddBranch,
  onDeleteBranch,
  onDuplicateBranch,
  onToggleNoPath,
  onAddCondition,
  onDeleteCondition,
  onSelectNode,
  onOperatorChange,
  onAddAction,
  onDeleteAction,
  onDuplicateAction,
}: GenerateRewardsGraphParams): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const startX = 60;
  const columnGap = 50;
  const branchY = 190;
  const actionStepY = 115;

  let currentX = startX;

  // Track overall bounds for centering trigger node
  let minBranchX = currentX;
  let maxBranchX = currentX;

  // ── 1. Generate Branch Columns ─────────────────────────────────────────────
  branches.forEach((br, bIdx) => {
    const condNodeId = `node-condition-${br.id}`;

    // Conditions in this branch
    const branchConditions = conditions.filter(
      (c) => (c.branch || "branch_1") === br.id
    );

    // Actions in this branch with original index preserved
    const branchActionsWithIdx = actions.map((act, originalIndex) => ({
      act,
      originalIndex,
    }));

    const branchYesActions = branchActionsWithIdx.filter(
      ({ act }) =>
        getActionBranchId(act) === br.id && getActionPath(act) === "yes"
    );

    const branchNoActions = branchActionsWithIdx.filter(
      ({ act }) =>
        getActionBranchId(act) === br.id && getActionPath(act) === "no"
    );

    const hasNoPath = Boolean(br.hasNoPath || branchNoActions.length > 0);

    const singleColWidth = 240;
    const subLaneWidth = 220;
    const subLaneGap = 24;
    const splitBranchWidth = subLaneWidth * 2 + subLaneGap; // 464px

    const branchWidth = hasNoPath ? splitBranchWidth : singleColWidth;
    const condNodeWidth = 250;
    const condNodeX = hasNoPath
      ? currentX + (branchWidth - condNodeWidth) / 2
      : currentX;

    // ── Branch Condition Node ──────────────────────────────────────────
    nodes.push({
      id: condNodeId,
      type: "condition",
      position: { x: condNodeX, y: branchY },
      data: {
        branchId: br.id,
        branchIndex: bIdx,
        branchName: br.name,
        isDefaultBranch: br.id === "branch_1",
        canDeleteBranch: branches.length > 1 && br.id !== "branch_1",
        conditions: branchConditions,
        conditionOperator,
        actionCount: branchYesActions.length + branchNoActions.length,
        hasNoPath,
        onToggleNoPath: (enabled?: boolean) => onToggleNoPath?.(br.id, enabled),
        onToggleOperator: () =>
          onOperatorChange(conditionOperator === "AND" ? "OR" : "AND"),
        onAddCondition: () => onAddCondition(br.id),
        onDeleteCondition: (condIdx: number) => {
          const target = branchConditions[condIdx];
          if (target) {
            const globalIdx = conditions.indexOf(target);
            if (globalIdx !== -1) onDeleteCondition(globalIdx);
          }
        },
        onDeleteBranch: () => onDeleteBranch(br.id),
        onDuplicateBranch: () => onDuplicateBranch?.(br.id),
        onSelect: () =>
          onSelectNode({
            type: "condition",
            data: {
              branchId: br.id,
              branchName: br.name,
              conditions: branchConditions,
              conditionOperator,
              hasNoPath,
            },
          }),
      },
    });

    // ── Connect Trigger -> Condition Node ──────────────────────────────
    edges.push({
      id: `edge-trigger-${condNodeId}`,
      source: "node-trigger",
      sourceHandle: "trigger-out",
      target: condNodeId,
      targetHandle: "branch-in",
      type: "smoothstep",
      style: { stroke: "#8b5cf6", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
    });

    // ── YES Actions Lane ───────────────────────────────────────────────
    const yesLaneX = hasNoPath ? currentX : currentX;
    let currentYesY = branchY + 140;

    let prevYesNodeId = condNodeId;
    let prevYesSourceHandle = `${br.id}_yes`;

    branchYesActions.forEach(({ act, originalIndex }) => {
      const actNodeId = `node-action-${originalIndex}`;
      nodes.push({
        id: actNodeId,
        type: "action",
        position: { x: yesLaneX, y: currentYesY },
        data: {
          action: act,
          index: originalIndex,
          branchId: br.id,
          path: "yes",
          onSelect: () =>
            onSelectNode({
              type: "action",
              data: {
                action: act,
                index: originalIndex,
                branchId: br.id,
                path: "yes",
              },
            }),
          onDelete: () => onDeleteAction(originalIndex),
          onDuplicate: () => onDuplicateAction(originalIndex),
        },
      });

      edges.push({
        id: `edge-${prevYesNodeId}-${actNodeId}`,
        source: prevYesNodeId,
        sourceHandle: prevYesSourceHandle,
        target: actNodeId,
        targetHandle: "action-in",
        type: "smoothstep",
        animated: true,
        style: { stroke: "#10b981", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      });

      prevYesNodeId = actNodeId;
      prevYesSourceHandle = "action-out";
      currentYesY += actionStepY;
    });

    // Tail Add Action for YES Lane
    const addYesNodeId = `node-add-action-${br.id}-yes`;
    nodes.push({
      id: addYesNodeId,
      type: "addAction",
      position: { x: yesLaneX, y: currentYesY },
      data: {
        branchId: br.id,
        path: "yes",
        onAddAction: (type: RewardRuleActionType) =>
          onAddAction(type, br.id, "yes"),
      },
    });

    edges.push({
      id: `edge-${prevYesNodeId}-${addYesNodeId}`,
      source: prevYesNodeId,
      sourceHandle: prevYesSourceHandle,
      target: addYesNodeId,
      targetHandle: "add-action-in",
      type: "smoothstep",
      style: { stroke: "#10b981", strokeWidth: 1.5, strokeDasharray: "4 4" },
    });

    // ── NO Actions Lane (Else / Consolation) ────────────────────────────
    if (hasNoPath) {
      const noLaneX = currentX + subLaneWidth + subLaneGap;
      let currentNoY = branchY + 140;

      let prevNoNodeId = condNodeId;
      let prevNoSourceHandle = `${br.id}_no`;

      branchNoActions.forEach(({ act, originalIndex }) => {
        const actNodeId = `node-action-${originalIndex}`;
        nodes.push({
          id: actNodeId,
          type: "action",
          position: { x: noLaneX, y: currentNoY },
          data: {
            action: act,
            index: originalIndex,
            branchId: br.id,
            path: "no",
            onSelect: () =>
              onSelectNode({
                type: "action",
                data: {
                  action: act,
                  index: originalIndex,
                  branchId: br.id,
                  path: "no",
                },
              }),
            onDelete: () => onDeleteAction(originalIndex),
            onDuplicate: () => onDuplicateAction(originalIndex),
          },
        });

        edges.push({
          id: `edge-${prevNoNodeId}-${actNodeId}`,
          source: prevNoNodeId,
          sourceHandle: prevNoSourceHandle,
          target: actNodeId,
          targetHandle: "action-in",
          type: "smoothstep",
          animated: true,
          style: { stroke: "#8b5cf6", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
        });

        prevNoNodeId = actNodeId;
        prevNoSourceHandle = "action-out";
        currentNoY += actionStepY;
      });

      // Tail Add Action for NO Lane
      const addNoNodeId = `node-add-action-${br.id}-no`;
      nodes.push({
        id: addNoNodeId,
        type: "addAction",
        position: { x: noLaneX, y: currentNoY },
        data: {
          branchId: br.id,
          path: "no",
          onAddAction: (type: RewardRuleActionType) =>
            onAddAction(type, br.id, "no"),
        },
      });

      edges.push({
        id: `edge-${prevNoNodeId}-${addNoNodeId}`,
        source: prevNoNodeId,
        sourceHandle: prevNoSourceHandle,
        target: addNoNodeId,
        targetHandle: "add-action-in",
        type: "smoothstep",
        style: { stroke: "#8b5cf6", strokeWidth: 1.5, strokeDasharray: "4 4" },
      });
    }

    maxBranchX = currentX + branchWidth;
    currentX += branchWidth + columnGap;
  });

  // ── 2. Position Trigger Node Centered Above Branches ───────────────────────
  const triggerWidth = 240;
  const triggerCenterX = (minBranchX + maxBranchX) / 2 - triggerWidth / 2;

  nodes.unshift({
    id: "node-trigger",
    type: "trigger",
    position: { x: Math.max(triggerCenterX, 50), y: 30 },
    data: {
      module,
      trigger,
      rewardId,
      rewardTitle,
      branchCount: branches.length,
      onAddBranch: () => onAddBranch(),
      onSelect: () =>
        onSelectNode({
          type: "trigger",
          data: { module, trigger, rewardId, rewardTitle },
        }),
    },
  });

  return { nodes, edges };
};
