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
import { RewardRuleActionType } from "@/graphql/rewards-automation";
import { useRewardsAutomationStore } from "@/store/useRewardsAutomationStore";
import { RewardsFlowHeader } from "./rewards-flow-header";
import { RewardsFlowCanvas } from "./rewards-flow-canvas";
import {
  RewardsNodePalette,
  REWARDS_STARTER_RECIPES,
} from "./rewards-node-palette";
import { RewardsNodeInspector } from "./rewards-node-inspector";
import { RewardsFlowSimulationModal } from "./rewards-flow-simulation-modal";
import { generateRewardsGraph } from "./rewards-flow-graph-builder";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";

export interface RewardsFlowBuilderProps {
  onSave?: () => Promise<void> | void;
  onReset?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  isEdit?: boolean;
  saved?: boolean;
  viewMode?: "flow" | "form";
  onViewModeChange?: (mode: "flow" | "form") => void;
  hasChanged?: boolean;
}

const RewardsFlowCanvasInternal: React.FC<RewardsFlowBuilderProps> = ({
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

  // Store selectors
  const storeHasChanged = useRewardsAutomationStore((s) => s.hasChanged);
  const resetStore = useRewardsAutomationStore((s) => s.reset);
  const hasChanged = propHasChanged !== undefined ? propHasChanged : storeHasChanged;
  const handleReset = onReset ?? resetStore;

  const module = useRewardsAutomationStore((s) => s.module);
  const setModule = useRewardsAutomationStore((s) => s.setModule);
  const trigger = useRewardsAutomationStore((s) => s.trigger);
  const setTrigger = useRewardsAutomationStore((s) => s.setTrigger);
  const rewardId = useRewardsAutomationStore((s) => s.rewardId);
  const rewardTitle = useRewardsAutomationStore((s) => s.rewardTitle);
  const setRewardId = useRewardsAutomationStore((s) => s.setRewardId);
  const conditionOperator = useRewardsAutomationStore((s) => s.conditionOperator);
  const setConditionOperator = useRewardsAutomationStore((s) => s.setConditionOperator);
  const conditions = useRewardsAutomationStore((s) => s.conditions);
  const setConditions = useRewardsAutomationStore((s) => s.setConditions);
  const actions = useRewardsAutomationStore((s) => s.actions);
  const setActions = useRewardsAutomationStore((s) => s.setActions);
  const branches = useRewardsAutomationStore((s) => s.branches);
  const selectedNode = useRewardsAutomationStore((s) => s.selectedNode);
  const setSelectedNode = useRewardsAutomationStore((s) => s.setSelectedNode);
  const storeViewMode = useRewardsAutomationStore((s) => s.viewMode);
  const setStoreViewMode = useRewardsAutomationStore((s) => s.setViewMode);
  const simulationState = useRewardsAutomationStore((s) => s.simulationState);
  const setSimulationState = useRewardsAutomationStore((s) => s.setSimulationState);

  // Store actions
  const addAction = useRewardsAutomationStore((s) => s.addAction);
  const updateAction = useRewardsAutomationStore((s) => s.updateAction);
  const deleteAction = useRewardsAutomationStore((s) => s.deleteAction);
  const duplicateAction = useRewardsAutomationStore((s) => s.duplicateAction);
  const addBranch = useRewardsAutomationStore((s) => s.addBranch);
  const deleteBranch = useRewardsAutomationStore((s) => s.deleteBranch);
  const duplicateBranch = useRewardsAutomationStore((s) => s.duplicateBranch);
  const updateBranchName = useRewardsAutomationStore((s) => s.updateBranchName);
  const toggleNoPath = useRewardsAutomationStore((s) => s.toggleNoPath);
  const addCondition = useRewardsAutomationStore((s) => s.addCondition);
  const removeCondition = useRewardsAutomationStore((s) => s.removeCondition);
  const applyRecipe = useRewardsAutomationStore((s) => s.applyRecipe);

  const viewMode = propViewMode ?? storeViewMode;
  const onViewModeChange = propOnViewModeChange ?? setStoreViewMode;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [showSimModal, setShowSimModal] = useState(false);
  const hasFitViewRef = useRef(false);
  const prevBranchesSigRef = useRef<string>("");

  // Sync graph whenever state changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateRewardsGraph({
      module,
      trigger,
      rewardId,
      rewardTitle,
      branches,
      conditions,
      actions,
      conditionOperator,
      simulationState,
      onAddBranch: (initialField) => addBranch(initialField),
      onDeleteBranch: (branchId) => deleteBranch(branchId),
      onDuplicateBranch: (branchId) => duplicateBranch(branchId),
      onToggleNoPath: (branchId, enabled) => toggleNoPath(branchId, enabled),
      onAddCondition: (branchId, field) => addCondition(field, branchId),
      onDeleteCondition: (globalIndex) => removeCondition(globalIndex),
      onSelectNode: (node) => setSelectedNode(node),
      onOperatorChange: (op) => setConditionOperator(op),
      onAddAction: (type, branchId, path) => addAction(type, branchId, path),
      onDeleteAction: (index) => deleteAction(index),
      onDuplicateAction: (index) => duplicateAction(index),
    });

    const currentBranchSig = branches
      .map((b) => `${b.id}:${Boolean(b.hasNoPath)}`)
      .join("|");
    const isFirstRun = prevBranchesSigRef.current === "";
    const branchesStructureChanged =
      !isFirstRun && prevBranchesSigRef.current !== currentBranchSig;
    prevBranchesSigRef.current = currentBranchSig;

    setNodes((prevNodes) => {
      if (prevNodes.length === 0 || branchesStructureChanged) {
        return newNodes;
      }
      const prevPosMap = new Map(prevNodes.map((n) => [n.id, n.position]));
      return newNodes.map((node) => {
        if (
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
        fitView({ padding: 0.18, duration: 400 });
      }, 80);
    }
  }, [
    module,
    trigger,
    rewardId,
    rewardTitle,
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
    setSelectedNode,
    setConditionOperator,
    addAction,
    deleteAction,
    duplicateAction,
    setNodes,
    setEdges,
    fitView,
  ]);

  // Initial fit view
  useEffect(() => {
    if (!hasFitViewRef.current && nodes.length > 0) {
      hasFitViewRef.current = true;
      const timer = setTimeout(() => {
        fitView({ padding: 0.18, duration: 400 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [fitView, nodes.length]);

  // Auto Layout / Beautify Flow handler
  const handleAutoLayout = useCallback(() => {
    const { nodes: freshNodes, edges: freshEdges } = generateRewardsGraph({
      module,
      trigger,
      rewardId,
      rewardTitle,
      branches,
      conditions,
      actions,
      conditionOperator,
      simulationState,
      onAddBranch: (initialField) => addBranch(initialField),
      onDeleteBranch: (branchId) => deleteBranch(branchId),
      onDuplicateBranch: (branchId) => duplicateBranch(branchId),
      onToggleNoPath: (branchId, enabled) => toggleNoPath(branchId, enabled),
      onAddCondition: (branchId, field) => addCondition(field, branchId),
      onDeleteCondition: (globalIndex) => removeCondition(globalIndex),
      onSelectNode: (node) => setSelectedNode(node),
      onOperatorChange: (op) => setConditionOperator(op),
      onAddAction: (type, branchId, path) => addAction(type, branchId, path),
      onDeleteAction: (index) => deleteAction(index),
      onDuplicateAction: (index) => duplicateAction(index),
    });

    setNodes(freshNodes);
    setEdges(freshEdges);

    setTimeout(() => {
      fitView({ padding: 0.18, duration: 500 });
    }, 50);

    toast.success("Beautified and aligned all branches and lanes!");
  }, [
    module,
    trigger,
    rewardId,
    rewardTitle,
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
    (recipe: any) => {
      applyRecipe(recipe);
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 500 });
      }, 100);
      toast.success(`Loaded "${recipe.name}" template into canvas.`);
    },
    [applyRecipe, fitView]
  );

  return (
    <div className="relative w-full h-screen h-full flex flex-col bg-background overflow-hidden">
      {/* Top Header */}
      <RewardsFlowHeader
        onSave={onSave}
        onCancel={onCancel}
        isSaving={isSaving}
        isEdit={isEdit}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onFitView={() => fitView({ padding: 0.2, duration: 400 })}
        onAutoLayout={handleAutoLayout}
        onOpenSimulation={() => setShowSimModal(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Palette */}
        <RewardsNodePalette
          module={module}
          onSelectModule={setModule}
          trigger={trigger}
          onSelectTrigger={setTrigger}
          branches={branches}
          onAddBranch={addBranch}
          onAddCondition={(bId, f) => addCondition(f, bId)}
          onAddAction={(t, bId, p) => addAction(t, bId, p)}
          onApplyRecipe={handleApplyRecipe}
          onSelectTriggerNode={() =>
            setSelectedNode({
              type: "trigger",
              data: { module, trigger, rewardId, rewardTitle },
            })
          }
        />

        {/* Center Canvas */}
        <RewardsFlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onDropAction={(type, branchId, path) =>
            addAction(type, branchId, path)
          }
          onAutoLayout={handleAutoLayout}
        />

        {/* Right Inspector */}
        {selectedNode && (
          <RewardsNodeInspector
            selectedNode={selectedNode}
            module={module}
            trigger={trigger}
            rewardId={rewardId}
            rewardTitle={rewardTitle}
            conditionOperator={conditionOperator}
            conditions={conditions}
            actions={actions}
            branches={branches}
            onModuleChange={setModule}
            onTriggerChange={setTrigger}
            onRewardTargetChange={setRewardId}
            onConditionOperatorChange={setConditionOperator}
            onConditionsChange={setConditions}
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

      {/* Live Simulation Modal */}
      <RewardsFlowSimulationModal
        open={showSimModal}
        onOpenChange={setShowSimModal}
        module={module}
        trigger={trigger}
        conditionOperator={conditionOperator}
        conditions={conditions}
        actions={actions}
        branches={branches}
      />

      {/* Floating Save Panel */}
      <FloatingSavePanel
        hasChanged={Boolean(hasChanged)}
        saved={Boolean(saved)}
        isSaving={isSaving}
        onSave={() => onSave?.()}
        onReset={handleReset}
        title={
          isEdit
            ? "Unsaved rewards automation updates"
            : "Unsaved rewards automation rule"
        }
        buttonText={isEdit ? "Update Rule" : "Create Rule"}
      />
    </div>
  );
};

export const RewardsFlowBuilder: React.FC<RewardsFlowBuilderProps> = (
  props
) => {
  return (
    <ReactFlowProvider>
      <RewardsFlowCanvasInternal {...props} />
    </ReactFlowProvider>
  );
};
