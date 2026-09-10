"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
} from "@xyflow/react";
import { MemberRuleActionType } from "@/graphql/member-automation";
import { useAutomationStore } from "@/store/useAutomationStore";
import { FlowHeader } from "./flow-header";
import { FlowCanvas } from "./flow-canvas";
import { NodePalette, TEMPLATE_RECIPES } from "./node-palette";
import { NodeInspector } from "./node-inspector";
import { generateAutomationGraph } from "./flow-graph-builder";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";

export {
  getActionBranchId,
  getActionPath,
  formatActionBranch,
} from "@/store/useAutomationStore";

export interface AutomationFlowBuilderProps {
  onSave?: () => Promise<void> | void;
  onReset?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  isEdit?: boolean;
  saved?: boolean;
  viewMode?: "flow" | "form";
  onViewModeChange?: (mode: "flow" | "form") => void;
  hasChanged?: boolean;
  name?: string;
  description?: string;
  trigger?: any;
  conditionOperator?: any;
  conditions?: any;
  actions?: any;
  isActive?: boolean;
  onNameChange?: (name: string) => void;
  onDescriptionChange?: (desc: string) => void;
  onTriggerChange?: (trigger: any) => void;
  onConditionOperatorChange?: (op: any) => void;
  onConditionsChange?: (conditions: any) => void;
  onActionsChange?: (actions: any) => void;
  onIsActiveChange?: (active: boolean) => void;
}

const FlowCanvasInternal: React.FC<AutomationFlowBuilderProps> = ({
  onSave,
  onReset,
  isSaving = false,
  isEdit = false,
  saved = false,
  hasChanged: propHasChanged,
  viewMode: propViewMode,
  onViewModeChange: propOnViewModeChange,
  onCancel,
}) => {
  const { fitView } = useReactFlow();

  // Zustand Store selectors
  const storeHasChanged = useAutomationStore((s) => s.hasChanged);
  const resetStore = useAutomationStore((s) => s.reset);
  const hasChanged = propHasChanged !== undefined ? propHasChanged : storeHasChanged;
  const handleReset = onReset ?? resetStore;
  const trigger = useAutomationStore((s) => s.trigger);
  const conditionOperator = useAutomationStore((s) => s.conditionOperator);
  const conditions = useAutomationStore((s) => s.conditions);
  const actions = useAutomationStore((s) => s.actions);
  const branches = useAutomationStore((s) => s.branches);
  const selectedNode = useAutomationStore((s) => s.selectedNode);
  const setSelectedNode = useAutomationStore((s) => s.setSelectedNode);
  const storeViewMode = useAutomationStore((s) => s.viewMode);
  const setStoreViewMode = useAutomationStore((s) => s.setViewMode);
  const simulationState = useAutomationStore((s) => s.simulationState);
  const setSimulationState = useAutomationStore((s) => s.setSimulationState);

  // Store actions
  const setTrigger = useAutomationStore((s) => s.setTrigger);
  const setConditionOperator = useAutomationStore((s) => s.setConditionOperator);
  const setConditions = useAutomationStore((s) => s.setConditions);
  const setActions = useAutomationStore((s) => s.setActions);
  const addAction = useAutomationStore((s) => s.addAction);
  const updateAction = useAutomationStore((s) => s.updateAction);
  const deleteAction = useAutomationStore((s) => s.deleteAction);
  const duplicateAction = useAutomationStore((s) => s.duplicateAction);
  const addBranch = useAutomationStore((s) => s.addBranch);
  const deleteBranch = useAutomationStore((s) => s.deleteBranch);
  const duplicateBranch = useAutomationStore((s) => s.duplicateBranch);
  const updateBranchName = useAutomationStore((s) => s.updateBranchName);
  const toggleNoPath = useAutomationStore((s) => s.toggleNoPath);
  const addCondition = useAutomationStore((s) => s.addCondition);
  const removeCondition = useAutomationStore((s) => s.removeCondition);
  const removeAllConditions = useAutomationStore((s) => s.removeAllConditions);
  const applyRecipe = useAutomationStore((s) => s.applyRecipe);

  const viewMode = propViewMode ?? storeViewMode;
  const onViewModeChange = propOnViewModeChange ?? setStoreViewMode;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const hasFitViewRef = useRef(false);
  const prevBranchesSigRef = useRef<string>("");

  // Sync graph whenever inputs change - preserve existing node positions!
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateAutomationGraph({
      trigger,
      branches,
      conditions,
      actions,
      conditionOperator,
      simulationState,
      onAddBranch: addBranch,
      onDeleteBranch: deleteBranch,
      onDuplicateBranch: duplicateBranch,
      onToggleNoPath: toggleNoPath,
      onAddCondition: addCondition,
      onDeleteCondition: removeCondition,
      onRemoveAllConditions: removeAllConditions,
      onSelectNode: setSelectedNode,
      onOperatorChange: setConditionOperator,
      onAddAction: addAction,
      onDeleteAction: deleteAction,
      onDuplicateAction: duplicateAction,
    });

    const currentBranchSig = branches
      .map((b) => `${b.id}:${Boolean(b.hasNoPath)}`)
      .join("|");
    const isFirstRun = prevBranchesSigRef.current === "";
    const branchesStructureChanged =
      !isFirstRun && prevBranchesSigRef.current !== currentBranchSig;
    prevBranchesSigRef.current = currentBranchSig;

    setNodes((prevNodes) => {
      // If branch structure changed (added/deleted or NO path toggled),
      // use the calculated clean non-overlapping layout
      if (prevNodes.length === 0 || branchesStructureChanged) {
        return newNodes;
      }
      const prevPosMap = new Map(prevNodes.map((n) => [n.id, n.position]));
      return newNodes.map((node) => {
        // Special structural nodes must always take their calculated positions!
        if (
          node.id === "node-add-branch" ||
          node.id === "node-trigger" ||
          node.type === "addAction"
        ) {
          return node;
        }
        const existingPos = prevPosMap.get(node.id);
        if (existingPos) {
          return {
            ...node,
            position: existingPos,
          };
        }
        return node;
      });
    });
    setEdges(newEdges);

    if (branchesStructureChanged) {
      setTimeout(() => {
        fitView({ padding: 0.15, duration: 400 });
      }, 80);
    }
  }, [
    trigger,
    branches,
    conditions,
    actions,
    conditionOperator,
    simulationState,
    addBranch,
    deleteBranch,
    duplicateBranch,
    toggleNoPath,
    addCondition,
    removeCondition,
    removeAllConditions,
    setSelectedNode,
    setConditionOperator,
    addAction,
    deleteAction,
    duplicateAction,
    setNodes,
    setEdges,
    fitView,
  ]);

  // Initial Auto fit - only runs ONCE on initial mount when nodes exist
  useEffect(() => {
    if (!hasFitViewRef.current && nodes.length > 0) {
      hasFitViewRef.current = true;
      const timer = setTimeout(() => {
        fitView({ padding: 0.15, duration: 400 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [fitView, nodes.length > 0]);

  // Beautify Flow / Auto Align handler - snaps all branches & nodes into perfect alignment
  const handleAutoLayout = useCallback(() => {
    const { nodes: freshNodes, edges: freshEdges } = generateAutomationGraph({
      trigger,
      branches,
      conditions,
      actions,
      conditionOperator,
      simulationState,
      onAddBranch: addBranch,
      onDeleteBranch: deleteBranch,
      onDuplicateBranch: duplicateBranch,
      onToggleNoPath: toggleNoPath,
      onAddCondition: addCondition,
      onDeleteCondition: removeCondition,
      onRemoveAllConditions: removeAllConditions,
      onSelectNode: setSelectedNode,
      onOperatorChange: setConditionOperator,
      onAddAction: addAction,
      onDeleteAction: deleteAction,
      onDuplicateAction: duplicateAction,
    });

    setNodes(freshNodes);
    setEdges(freshEdges);

    setTimeout(() => {
      fitView({ padding: 0.15, duration: 500 });
    }, 50);

    toast.success("Beautified & aligned all branches neatly!");
  }, [
    trigger,
    branches,
    conditions,
    actions,
    conditionOperator,
    simulationState,
    addBranch,
    deleteBranch,
    duplicateBranch,
    toggleNoPath,
    addCondition,
    removeCondition,
    removeAllConditions,
    setSelectedNode,
    setConditionOperator,
    addAction,
    deleteAction,
    duplicateAction,
    setNodes,
    setEdges,
    fitView,
  ]);

  const handleApplyRecipe = useCallback(
    (recipe: (typeof TEMPLATE_RECIPES)[0]) => {
      applyRecipe(recipe);
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 500 });
      }, 100);
    },
    [applyRecipe, fitView]
  );

  return (
    <div className="relative w-full h-screen h-full flex flex-col bg-background overflow-hidden">
      {/* Top Action Toolbar */}
      <FlowHeader
        onSave={onSave}
        onCancel={onCancel}
        isSaving={isSaving}
        isEdit={isEdit}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onFitView={() => fitView({ padding: 0.2, duration: 400 })}
        onAutoLayout={handleAutoLayout}
      />

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Node Palette */}
        <NodePalette
          conditions={conditions}
          branches={branches}
          onAddCondition={addCondition}
          onSelectConditionField={(field) => addCondition(field, "branch_1")}
          onAddAction={(type, branchId, path) =>
            addAction(type, branchId || "branch_1", path || "yes")
          }
          onAddBranch={addBranch}
          onDeleteBranch={deleteBranch}
          onApplyRecipe={handleApplyRecipe}
          onSelectTriggerNode={() =>
            setSelectedNode({ type: "trigger", data: { trigger } })
          }
          onSelectConditionNode={() => {
            if (conditions.length === 0) {
              addCondition("profile.college", "branch_1");
            } else {
              setSelectedNode({
                type: "condition",
                data: {
                  branchId: "branch_1",
                  branchName: "Branch 1 (Primary)",
                  conditions,
                  conditionOperator,
                },
              });
            }
          }}
        />

        {/* Center: Interactive React Flow Canvas */}
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onDropAction={(type, branchId, path) =>
            addAction(type, branchId, path)
          }
          onDropFilter={(field, branchId) => addCondition(field, branchId)}
          onAutoLayout={handleAutoLayout}
        />

        {/* Right Node Inspector */}
        {selectedNode && (
          <NodeInspector
            selectedNode={selectedNode}
            trigger={trigger}
            conditionOperator={conditionOperator}
            conditions={conditions}
            actions={actions}
            branches={branches}
            onTriggerChange={setTrigger}
            onConditionOperatorChange={setConditionOperator}
            onConditionsChange={setConditions}
            onActionsChange={setActions}
            onActionUpdate={updateAction}
            onActionDelete={deleteAction}
            onDeleteBranch={deleteBranch}
            onDuplicateBranch={duplicateBranch}
            onRenameBranch={updateBranchName}
            onToggleNoPath={toggleNoPath}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
 
      {/* ── Floating Save Panel ─────────────────────────────────────────── */}
      <FloatingSavePanel
        hasChanged={Boolean(hasChanged)}
        saved={Boolean(saved)}
        isSaving={isSaving}
        onSave={() => onSave?.()}
        onReset={handleReset}
        title={isEdit ? "Unsaved member automation updates" : "Unsaved member automation rule"}
        buttonText={isEdit ? "Update Rule" : "Create Rule"}
      />
    </div>
  );
};

export const AutomationFlowBuilder: React.FC<AutomationFlowBuilderProps> = (
  props
) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInternal {...props} />
    </ReactFlowProvider>
  );
};
