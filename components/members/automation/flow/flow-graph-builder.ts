import { Node, Edge, MarkerType } from "@xyflow/react";
import {
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import {
  BranchItem,
  getActionBranchId,
  getActionPath,
  formatActionBranch,
} from "@/store/useAutomationStore";
import { SelectedNodeInfo } from "./types";

export interface GenerateGraphParams {
  trigger: MemberRuleTrigger;
  branches: BranchItem[];
  conditions: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  conditionOperator: "AND" | "OR";
  simulationState: {
    isRunning: boolean;
    passed?: boolean;
    executedActionIndices?: number[];
  } | null;
  onAddBranch: (initialField?: string) => void;
  onDeleteBranch: (branchId: string) => void;
  onDuplicateBranch?: (branchId: string) => void;
  onToggleNoPath?: (branchId: string, enabled?: boolean) => void;
  onAddCondition: (field?: string, branchId?: string) => void;
  onDeleteCondition: (globalIndex: number) => void;
  onRemoveAllConditions: (branchId: string) => void;
  onSelectNode: (node: SelectedNodeInfo | null) => void;
  onOperatorChange: (op: "AND" | "OR") => void;
  onAddAction: (
    type: MemberRuleActionType,
    branchId: string,
    path?: "yes" | "no"
  ) => void;
  onDeleteAction: (index: number) => void;
  onDuplicateAction: (index: number) => void;
}

export const generateAutomationGraph = ({
  trigger,
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
  onRemoveAllConditions,
  onSelectNode,
  onOperatorChange,
  onAddAction,
  onDeleteAction,
  onDuplicateAction,
}: GenerateGraphParams): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const startX = 50;
  const columnGap = 40;
  const branchY = 170;

  let currentX = startX;

  // Generate each branch column independently
  branches.forEach((br, bIdx) => {
    const condNodeId = `node-condition-${br.id}`;

    // Conditions belonging to this branch
    const branchConditions = conditions.filter(
      (c) => (c.branch || "branch_1") === br.id
    );

    // Actions belonging to this branch, separated by YES and NO
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

    // NO path is enabled if marked on branch or if NO actions exist
    const hasNoPath = Boolean(br.hasNoPath || branchNoActions.length > 0);

    const singleColWidth = 230;
    const subLaneWidth = 220;
    const subLaneGap = 20;
    const splitBranchWidth = subLaneWidth * 2 + subLaneGap; // 460px

    const branchWidth = hasNoPath ? splitBranchWidth : singleColWidth;
    const condNodeWidth = hasNoPath ? 260 : 230;
    const condNodeX = hasNoPath
      ? currentX + (branchWidth - condNodeWidth) / 2
      : currentX;

    // ── Branch Condition Node ──────────────────────────────────────────
    nodes.push({
      id: condNodeId,
      type: "condition",
      position: { x: condNodeX, y: branchY },
      data: {
        title: br.name,
        branchId: br.id,
        branchIndex: bIdx,
        branchName: br.name,
        isDefaultBranch: br.id === "branch_1",
        canDeleteBranch: branches.length > 1 && br.id !== "branch_1",
        conditions: branchConditions,
        conditionOperator,
        actionCount: branchYesActions.length + branchNoActions.length,
        hasNoPath,
        onToggleNoPath: (enabled?: boolean) => {
          onToggleNoPath?.(br.id, enabled);
        },
        onOperatorChange,
        onDeleteCondition: (condIdx: number) => {
          const condToRemove = branchConditions[condIdx];
          if (condToRemove) {
            const globalIdx = conditions.indexOf(condToRemove);
            if (globalIdx !== -1) {
              onDeleteCondition(globalIdx);
            }
          }
        },
        onRemoveAllConditions: () => {
          onRemoveAllConditions(br.id);
        },
        onDeleteBranch:
          branches.length > 1 && br.id !== "branch_1"
            ? () => onDeleteBranch(br.id)
            : undefined,
        onDuplicateBranch: onDuplicateBranch
          ? () => onDuplicateBranch(br.id)
          : undefined,
        onAddActionToBranch: (type: MemberRuleActionType, path: "yes" | "no" = "yes") => {
          onAddAction(type, br.id, path);
        },
        onSelect: () =>
          onSelectNode({
            type: "condition",
            data: {
              branchId: br.id,
              branchIndex: bIdx,
              branchName: br.name,
              conditions: branchConditions,
              conditionOperator,
              hasNoPath,
            },
          }),
        onSelectConditionField: (field: string) =>
          onSelectNode({
            type: "condition",
            data: {
              branchId: br.id,
              branchIndex: bIdx,
              branchName: br.name,
              conditions: branchConditions,
              conditionOperator,
              focusedField: field,
              hasNoPath,
            },
          }),
        simulationStatus: simulationState
          ? simulationState.passed
            ? "passed"
            : "failed"
          : "idle",
      },
    });

    // ── Edge: Trigger -> Branch Condition Node ────────────────────────
    edges.push({
      id: `edge-trigger-${br.id}`,
      source: "node-trigger",
      target: condNodeId,
      type: "custom",
      animated: true,
      data: {
        label: `Branch #${bIdx + 1}: ${br.name}`,
        isSimulating: simulationState?.isRunning,
        simulationSuccess: simulationState?.passed,
      },
      style: { stroke: bIdx === 0 ? "#3b82f6" : "#8b5cf6" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: bIdx === 0 ? "#3b82f6" : "#8b5cf6",
      },
    });

    // ── 1. YES Action Chain ───────────────────────────────────────────
    const yesLaneX = hasNoPath ? currentX : currentX;
    let prevYesNodeId = condNodeId;
    let currentYesY = branchY + 175;

    branchYesActions.forEach(({ act, originalIndex }, actIdx) => {
      const actId = `node-action-${originalIndex}`;
      const isExecuted =
        simulationState?.executedActionIndices?.includes(originalIndex);

      nodes.push({
        id: actId,
        type: "action",
        position: { x: yesLaneX, y: currentYesY },
        data: {
          action: act,
          index: originalIndex,
          branchId: br.id,
          branchName: br.name,
          branchIndex: bIdx,
          path: "yes",
          onSelect: () =>
            onSelectNode({
              type: "action",
              data: {
                action: act,
                index: originalIndex,
                branchId: br.id,
                branchName: br.name,
                branchIndex: bIdx,
                path: "yes",
              },
              index: originalIndex,
            }),
          onDelete: () => onDeleteAction(originalIndex),
          onDuplicate: () => onDuplicateAction(originalIndex),
          simulationStatus: simulationState
            ? isExecuted ?? simulationState.passed
              ? "executed"
              : "skipped"
            : "idle",
        },
      });

      edges.push({
        id: `edge-${prevYesNodeId}-${actId}`,
        source: prevYesNodeId,
        sourceHandle: prevYesNodeId === condNodeId ? "yes" : undefined,
        target: actId,
        type: "custom",
        animated: true,
        data: {
          label:
            actIdx === 0
              ? branchConditions.length > 0
                ? "YES: Matches"
                : "Always Execute"
              : "Then",
          branch: "yes",
        },
        style: { stroke: "#10b981" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
      });

      prevYesNodeId = actId;
      currentYesY += 175;
    });

    // Add Action Node at end of YES chain
    const addYesActionId = `node-add-action-${br.id}-yes`;
    nodes.push({
      id: addYesActionId,
      type: "addAction",
      position: { x: yesLaneX + 20, y: currentYesY },
      draggable: false,
      data: {
        moduleType: "member",
        branch: formatActionBranch(br.id, "yes"),
        label: hasNoPath ? "+ Add Action (YES)" : `+ Add Action (${br.name})`,
        onAddAction: (type: MemberRuleActionType) =>
          onAddAction(type, br.id, "yes"),
      },
    });

    edges.push({
      id: `edge-${prevYesNodeId}-${addYesActionId}`,
      source: prevYesNodeId,
      sourceHandle: prevYesNodeId === condNodeId ? "yes" : undefined,
      target: addYesActionId,
      type: "custom",
      animated: false,
      data: {
        label: prevYesNodeId === condNodeId ? "YES: Direct Actions" : undefined,
        branch: "yes",
      },
      style: { stroke: "#10b981", strokeDasharray: "4,4" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
    });

    // ── 2. NO Action Chain (Rendered when hasNoPath is true) ───────────
    if (hasNoPath) {
      const noLaneX = currentX + subLaneWidth + subLaneGap;
      let prevNoNodeId = condNodeId;
      let currentNoY = branchY + 175;

      branchNoActions.forEach(({ act, originalIndex }, actIdx) => {
        const actId = `node-action-${originalIndex}`;
        const isExecuted =
          simulationState?.executedActionIndices?.includes(originalIndex);

        nodes.push({
          id: actId,
          type: "action",
          position: { x: noLaneX, y: currentNoY },
          data: {
            action: act,
            index: originalIndex,
            branchId: br.id,
            branchName: br.name,
            branchIndex: bIdx,
            path: "no",
            onSelect: () =>
              onSelectNode({
                type: "action",
                data: {
                  action: act,
                  index: originalIndex,
                  branchId: br.id,
                  branchName: br.name,
                  branchIndex: bIdx,
                  path: "no",
                },
                index: originalIndex,
              }),
            onDelete: () => onDeleteAction(originalIndex),
            onDuplicate: () => onDuplicateAction(originalIndex),
            simulationStatus: simulationState
              ? !simulationState.passed && (isExecuted ?? true)
                ? "executed"
                : "skipped"
              : "idle",
          },
        });

        edges.push({
          id: `edge-${prevNoNodeId}-${actId}`,
          source: prevNoNodeId,
          sourceHandle: prevNoNodeId === condNodeId ? "no" : undefined,
          target: actId,
          type: "custom",
          animated: true,
          data: {
            label: actIdx === 0 ? "NO: Else / Fallback" : "Then",
            branch: "no",
          },
          style: { stroke: "#f43f5e" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#f43f5e" },
        });

        prevNoNodeId = actId;
        currentNoY += 175;
      });

      // Add Action Node at end of NO chain
      const addNoActionId = `node-add-action-${br.id}-no`;
      nodes.push({
        id: addNoActionId,
        type: "addAction",
        position: { x: noLaneX + 20, y: currentNoY },
        draggable: false,
        data: {
          moduleType: "member",
          branch: formatActionBranch(br.id, "no"),
          label: "+ Add Action (NO / Else)",
          onAddAction: (type: MemberRuleActionType) =>
            onAddAction(type, br.id, "no"),
        },
      });

      edges.push({
        id: `edge-${prevNoNodeId}-${addNoActionId}`,
        source: prevNoNodeId,
        sourceHandle: prevNoNodeId === condNodeId ? "no" : undefined,
        target: addNoActionId,
        type: "custom",
        animated: false,
        data: {
          label: prevNoNodeId === condNodeId ? "NO: Else Actions" : undefined,
          branch: "no",
        },
        style: { stroke: "#f43f5e", strokeDasharray: "4,4" },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#f43f5e" },
      });
    }

    currentX += branchWidth + columnGap;
  });

  // ── Add Condition Branch Node ──────────────────────────────────────
  const addBranchX = currentX;
  nodes.push({
    id: "node-add-branch",
    type: "addBranch",
    position: { x: addBranchX, y: branchY },
    draggable: false,
    data: {
      onAddBranch: () => onAddBranch("profile.college"),
    },
  });

  edges.push({
    id: "edge-trigger-add-branch",
    source: "node-trigger",
    target: "node-add-branch",
    type: "custom",
    animated: false,
    data: {
      label: "+ New Branch",
    },
    style: { stroke: "#a855f7", strokeDasharray: "4,4" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" },
  });

  // ── Trigger Node (Centered above all branches) ─────────────────────
  const totalSpan = currentX - startX;
  const triggerCenterX = startX + totalSpan / 2;
  const triggerX = Math.max(startX, triggerCenterX - 105);
  const triggerY = 20;

  nodes.unshift({
    id: "node-trigger",
    type: "trigger",
    position: { x: triggerX, y: triggerY },
    data: {
      trigger,
      branchCount: branches.length,
      branches,
      hasConditions: conditions.length > 0,
      conditionCount: conditions.length,
      onAddCondition: () => onAddCondition("profile.college", "branch_1"),
      onAddBranch: () => onAddBranch("profile.college"),
      onSelect: () => onSelectNode({ type: "trigger", data: { trigger } }),
    },
  });

  return { nodes, edges };
};
