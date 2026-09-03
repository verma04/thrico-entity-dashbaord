"use client";

import React, { useState, useMemo } from "react";
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
  CurrencyRuleTrigger,
  CurrencyRuleActionType,
  GamificationActionInputPayload,
  GamificationRuleConditionInput,
} from "@/graphql/gamification-automation";
import {
  CurrencyTriggerNode,
  CurrencyConditionNode,
  CurrencyActionNode,
  CurrencyAddActionNode,
} from "./currency-custom-nodes";
import { GamificationCustomFlowEdge } from "@/components/gamification/automation/flow/gamification-custom-edge";
import {
  CurrencyNodeInspector,
  SelectedCurrencyNode,
} from "./currency-node-inspector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save, FileText, Coins } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const nodeTypes: NodeTypes = {
  trigger: CurrencyTriggerNode as any,
  condition: CurrencyConditionNode as any,
  action: CurrencyActionNode as any,
  addAction: CurrencyAddActionNode as any,
};

const edgeTypes: EdgeTypes = {
  custom: GamificationCustomFlowEdge as any,
};

interface CurrencyFlowBuilderProps {
  name: string;
  description?: string;
  trigger: CurrencyRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
  isActive: boolean;
  priority: number;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onTriggerChange: (trigger: CurrencyRuleTrigger) => void;
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

const CurrencyFlowCanvasInternal: React.FC<CurrencyFlowBuilderProps> = ({
  name,
  trigger,
  conditionOperator,
  conditions,
  actions,
  isActive,
  onNameChange,
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
  const [selectedNode, setSelectedNode] = useState<SelectedCurrencyNode>(null);

  const handleAddAction = (type?: CurrencyRuleActionType) => {
    const defaultType = type || "AWARD_CURRENCY";
    const newAct: GamificationActionInputPayload = {
      type: defaultType,
      currency:
        defaultType === "AWARD_CURRENCY"
          ? { amount: 50, currencyType: "TC" }
          : undefined,
      currencyAmount: defaultType === "AWARD_CURRENCY" ? 50 : undefined,
      currencyType: defaultType === "AWARD_CURRENCY" ? "TC" : undefined,
    };
    onActionsChange([...actions, newAct]);
    setSelectedNode({ type: "action", index: actions.length });
    toast.success("Action added to pipeline.");
  };

  const handleDuplicateAction = (index: number) => {
    const act = actions[index];
    if (!act) return;
    const cloned = { ...act };
    const updated = [...actions];
    updated.splice(index + 1, 0, cloned);
    onActionsChange(updated);
    toast.success("Action duplicated.");
  };

  const handleDeleteAction = (index: number) => {
    onActionsChange(actions.filter((_, i) => i !== index));
    if (selectedNode?.type === "action" && selectedNode.index === index) {
      setSelectedNode(null);
    }
    toast.info("Action removed.");
  };

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
        trigger,
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
  }, [trigger, conditionOperator, conditions, actions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] w-full rounded-2xl border border-border bg-card overflow-hidden shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md gap-4 z-10">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange("form")}
            className="h-8 gap-1.5 text-xs font-semibold cursor-pointer border-border hover:bg-muted"
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            Switch to Form View
          </Button>

          <div className="h-4 w-px bg-border" />

          <div className="flex-1">
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Currency Rule Name (e.g. High EC Earner TC Bonus)"
              className="h-8 text-xs font-bold border-transparent hover:border-border focus:border-amber-500 px-2 bg-transparent"
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
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs cursor-pointer bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Save className="w-3.5 h-3.5" />
            {isEdit ? "Update Currency Rule" : "Create Currency Rule"}
          </Button>
        </div>
      </div>

      {/* Main Flow Canvas & Inspector */}
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
              nodeColor={() => "#f59e0b"}
            />
          </ReactFlow>
        </div>

        {selectedNode && (
          <CurrencyNodeInspector
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
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

export const CurrencyFlowBuilder: React.FC<CurrencyFlowBuilderProps> = (
  props
) => {
  return (
    <ReactFlowProvider>
      <CurrencyFlowCanvasInternal {...props} />
    </ReactFlowProvider>
  );
};
