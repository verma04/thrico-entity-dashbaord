"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  GamificationModuleType,
  AnyGamificationTrigger,
  AnyGamificationActionType,
  GamificationActionInputPayload,
  GamificationRuleConditionInput,
} from "@/graphql/gamification-automation";
import {
  GamificationTriggerNode,
  GamificationConditionNode,
  GamificationActionNode,
  GamificationAddActionNode,
} from "./gamification-custom-nodes";
import { GamificationCustomFlowEdge } from "./gamification-custom-edge";
import {
  GamificationNodeInspector,
  SelectedGamificationNode,
} from "./gamification-node-inspector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Sliders,
  Sparkles,
  Zap,
  RotateCcw,
  LayoutTemplate,
  Coins,
  Medal,
  Crown,
  Trophy,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const nodeTypes: NodeTypes = {
  trigger: GamificationTriggerNode as any,
  condition: GamificationConditionNode as any,
  action: GamificationActionNode as any,
  addAction: GamificationAddActionNode as any,
};

const edgeTypes: EdgeTypes = {
  custom: GamificationCustomFlowEdge as any,
};

interface GamificationFlowBuilderProps {
  name: string;
  description?: string;
  module: GamificationModuleType;
  targetId?: string | null;
  targetName?: string | null;
  trigger: AnyGamificationTrigger;
  conditionOperator: "AND" | "OR";
  conditions: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive: boolean;
  priority: number;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onModuleChange: (mod: GamificationModuleType) => void;
  onTargetIdChange: (id: string | null) => void;
  onTriggerChange: (trigger: AnyGamificationTrigger) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: GamificationRuleConditionInput[]) => void;
  onActionsChange: (actions: GamificationActionInputPayload[]) => void;
  onIsActiveChange: (active: boolean) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  loading?: boolean;
  isEdit?: boolean;
  onViewModeChange: (mode: "flow" | "form") => void;
}

const FlowCanvasInternal: React.FC<GamificationFlowBuilderProps> = ({
  name,
  description,
  module,
  targetId,
  targetName,
  trigger,
  conditionOperator,
  conditions,
  actions,
  isActive,
  priority,
  onNameChange,
  onDescriptionChange,
  onModuleChange,
  onTargetIdChange,
  onTriggerChange,
  onConditionOperatorChange,
  onConditionsChange,
  onActionsChange,
  onIsActiveChange,
  onSave,
  onReset,
  loading = false,
  isEdit = false,
  onViewModeChange,
}) => {
  const [selectedNode, setSelectedNode] =
    useState<SelectedGamificationNode>(null);

  // Add Action helper
  const handleAddAction = (type?: AnyGamificationActionType) => {
    const defaultType = type || "NOTIFICATION";
    const newAct: GamificationActionInputPayload = { type: defaultType };
    onActionsChange([...actions, newAct]);
    setSelectedNode({ type: "action", index: actions.length });
    toast.success("Action added to pipeline.");
  };

  // Duplicate Action helper
  const handleDuplicateAction = (index: number) => {
    const act = actions[index];
    if (!act) return;
    const cloned = { ...act };
    const updated = [...actions];
    updated.splice(index + 1, 0, cloned);
    onActionsChange(updated);
    toast.success("Action duplicated.");
  };

  // Delete Action helper
  const handleDeleteAction = (index: number) => {
    onActionsChange(actions.filter((_, i) => i !== index));
    if (selectedNode?.type === "action" && selectedNode.index === index) {
      setSelectedNode(null);
    }
    toast.info("Action removed.");
  };

  // Build Graph Nodes & Edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const centerX = 350;

    // 1. Trigger Node
    nodes.push({
      id: "node-trigger",
      type: "trigger",
      position: { x: centerX, y: 50 },
      data: {
        module,
        trigger,
        targetId,
        targetName,
        onSelect: () => setSelectedNode({ type: "trigger" }),
      },
    });

    // 2. Condition Node
    nodes.push({
      id: "node-condition",
      type: "condition",
      position: { x: centerX, y: 220 },
      data: {
        conditionOperator,
        conditions,
        onSelect: () => setSelectedNode({ type: "condition" }),
      },
    });

    // Edge: Trigger -> Condition
    edges.push({
      id: "edge-trigger-condition",
      source: "node-trigger",
      target: "node-condition",
      type: "custom",
    });

    // 3. Action Nodes
    let currentY = 390;
    let prevNodeId = "node-condition";

    actions.forEach((act, idx) => {
      const actId = `node-action-${idx}`;

      nodes.push({
        id: actId,
        type: "action",
        position: { x: centerX, y: currentY },
        data: {
          index: idx,
          action: act,
          onSelect: () => setSelectedNode({ type: "action", index: idx }),
          onDuplicate: () => handleDuplicateAction(idx),
          onDelete: () => handleDeleteAction(idx),
        },
      });

      edges.push({
        id: `edge-${prevNodeId}-${actId}`,
        source: prevNodeId,
        target: actId,
        type: "custom",
      });

      prevNodeId = actId;
      currentY += 160;
    });

    // 4. Add Action Node
    nodes.push({
      id: "node-add-action",
      type: "addAction",
      position: { x: centerX, y: currentY },
      data: {
        onAddAction: handleAddAction,
      },
    });

    edges.push({
      id: `edge-${prevNodeId}-add-action`,
      source: prevNodeId,
      target: "node-add-action",
      type: "custom",
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    module,
    trigger,
    targetId,
    targetName,
    conditionOperator,
    conditions,
    actions,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when props change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] w-full rounded-2xl border border-border bg-card overflow-hidden shadow-md">
      {/* Top Flow Header & Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md gap-4 z-10">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange("form")}
            className="h-8 gap-1.5 text-xs font-semibold cursor-pointer border-border hover:bg-muted"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            Switch to Form View
          </Button>

          <div className="h-4 w-px bg-border" />

          <div className="flex-1">
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Rule Name (e.g. Milestone Bonus Points)"
              className="h-8 text-xs font-bold border-transparent hover:border-border focus:border-primary px-2 bg-transparent"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-border">
            <Switch
              checked={isActive}
              onCheckedChange={onIsActiveChange}
              className="data-[state=checked]:bg-emerald-600"
            />
            <span
              className={cn(
                "text-xs font-semibold select-none",
                isActive ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {isActive ? "Active" : "Paused"}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={onSave}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {isEdit ? "Update Automation" : "Create Automation"}
          </Button>
        </div>
      </div>

      {/* Main Interactive Flow Canvas & Inspector */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.3}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            onPaneClick={() => setSelectedNode(null)}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              className="opacity-60 dark:opacity-30"
            />
            <Controls className="!bg-card !border-border !shadow-sm" />
            <MiniMap
              className="!bg-card !border-border !rounded-xl overflow-hidden !shadow-md"
              nodeColor={() => "#6366f1"}
            />
          </ReactFlow>
        </div>

        {/* Slide-in Node Inspector */}
        {selectedNode && (
          <GamificationNodeInspector
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
            module={module}
            onModuleChange={onModuleChange}
            targetId={targetId}
            onTargetIdChange={onTargetIdChange}
            trigger={trigger}
            onTriggerChange={onTriggerChange}
            conditionOperator={conditionOperator}
            onConditionOperatorChange={onConditionOperatorChange}
            conditions={conditions}
            onConditionsChange={onConditionsChange}
            actions={actions}
            onActionsChange={onActionsChange}
          />
        )}
      </div>
    </div>
  );
};

export const GamificationFlowBuilder: React.FC<
  GamificationFlowBuilderProps
> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInternal {...props} />
    </ReactFlowProvider>
  );
};
