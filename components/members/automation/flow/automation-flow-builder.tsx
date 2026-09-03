"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  useReactFlow,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Zap,
  Play,
  Maximize2,
  Sparkles,
  Sliders,
  RotateCcw,
  Layers,
  LayoutGrid,
  CheckCircle2,
  ListFilter,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  MemberRuleTrigger,
  MemberRuleConditionInput,
  MemberRuleActionInput,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import { TriggerNode, ConditionNode, ActionNode, AddActionNode } from "./custom-nodes";
import { CustomFlowEdge } from "./custom-edge";
import { NodeInspector } from "./node-inspector";
import { NodePalette, TEMPLATE_RECIPES } from "./node-palette";
import { FlowSimulationModal } from "./flow-simulation-modal";
import { SelectedNodeInfo, FlowNodeType } from "./types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { NodeTypes, EdgeTypes } from "@xyflow/react";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode as any,
  condition: ConditionNode as any,
  action: ActionNode as any,
  addAction: AddActionNode as any,
};

const edgeTypes: EdgeTypes = {
  custom: CustomFlowEdge as any,
};

interface AutomationFlowBuilderProps {
  name: string;
  description?: string;
  trigger: MemberRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  isActive: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onTriggerChange: (trigger: MemberRuleTrigger) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: MemberRuleConditionInput[]) => void;
  onActionsChange: (actions: MemberRuleActionInput[]) => void;
  onIsActiveChange: (active: boolean) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  hasChanged: boolean;
  isSaving?: boolean;
  isEdit?: boolean;
  viewMode: "flow" | "form";
  onViewModeChange: (mode: "flow" | "form") => void;
}

const FlowCanvasInternal: React.FC<AutomationFlowBuilderProps> = ({
  name,
  description,
  trigger,
  conditionOperator,
  conditions,
  actions,
  isActive,
  onNameChange,
  onDescriptionChange,
  onTriggerChange,
  onConditionOperatorChange,
  onConditionsChange,
  onActionsChange,
  onIsActiveChange,
  onSave,
  onReset,
  hasChanged,
  isSaving,
  isEdit,
  viewMode,
  onViewModeChange,
}) => {
  const { fitView } = useReactFlow();

  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo>({
    type: "trigger",
    data: { trigger },
  });
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [simulationState, setSimulationState] = useState<{
    isRunning: boolean;
    passed?: boolean;
  } | null>(null);

  // ── Layout calculation for nodes and edges ───────────────────────────────
  const generateGraph = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Trigger Node (Top Center)
    const triggerX = 350;
    const triggerY = 40;
    nodes.push({
      id: "node-trigger",
      type: "trigger",
      position: { x: triggerX, y: triggerY },
      data: {
        trigger,
        onSelect: () => setSelectedNode({ type: "trigger", data: { trigger } }),
      },
    });

    // Condition Node (Middle Center)
    const conditionX = 330;
    const conditionY = 220;
    nodes.push({
      id: "node-condition",
      type: "condition",
      position: { x: conditionX, y: conditionY },
      data: {
        conditions,
        conditionOperator,
        onOperatorChange: onConditionOperatorChange,
        onSelect: () =>
          setSelectedNode({
            type: "condition",
            data: { conditions, conditionOperator },
          }),
        simulationStatus: simulationState
          ? simulationState.passed
            ? "passed"
            : "failed"
          : "idle",
      },
    });

    // Edge: Trigger -> Condition
    edges.push({
      id: "edge-trigger-condition",
      source: "node-trigger",
      target: "node-condition",
      type: "custom",
      animated: true,
      data: {
        label: "Evaluates",
        isSimulating: simulationState?.isRunning,
        simulationSuccess: simulationState?.passed,
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
    });

    // Action Nodes (Arranged horizontally below condition node)
    const totalActions = actions.length;
    const actionCardWidth = 320;
    const actionCardGap = 30;
    const totalWidth =
      totalActions * actionCardWidth + (totalActions - 1) * actionCardGap;
    const startX = Math.max(80, triggerX + 140 - totalWidth / 2);
    const actionY = 480;

    actions.forEach((act, idx) => {
      const actX = startX + idx * (actionCardWidth + actionCardGap);
      const actId = `node-action-${idx}`;

      nodes.push({
        id: actId,
        type: "action",
        position: { x: actX, y: actionY },
        data: {
          action: act,
          index: idx,
          onSelect: () =>
            setSelectedNode({
              type: "action",
              data: { action: act, index: idx },
              index: idx,
            }),
          onDelete: () => {
            const updated = actions.filter((_, i) => i !== idx);
            onActionsChange(updated);
            if (selectedNode?.type === "action" && selectedNode.index === idx) {
              setSelectedNode(null);
            }
          },
          onDuplicate: () => {
            const duplicated = { ...act };
            onActionsChange([...actions, duplicated]);
            toast.success("Action duplicated.");
          },
          simulationStatus: simulationState
            ? simulationState.passed
              ? "executed"
              : "skipped"
            : "idle",
        },
      });

      // Edge: Condition -> Action
      edges.push({
        id: `edge-condition-action-${idx}`,
        source: "node-condition",
        target: actId,
        type: "custom",
        animated: true,
        data: {
          label: `Action #${idx + 1}`,
          isSimulating: simulationState?.isRunning,
          simulationSuccess: simulationState?.passed,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
      });
    });

    // Add Action Node placeholder
    const addActionY = actionY + 280;
    const addActionX = triggerX + 20;
    nodes.push({
      id: "node-add-action",
      type: "addAction",
      position: { x: addActionX, y: addActionY },
      data: {
        onAddAction: (type: MemberRuleActionType) => {
          let newAction: MemberRuleActionInput;
          switch (type) {
            case "ASSIGN_MEMBERSHIP_TIER":
              newAction = { type: "ASSIGN_MEMBERSHIP_TIER" };
              break;
            case "EMAIL":
              newAction = {
                type: "EMAIL",
                emailSubject: "Welcome to our community! 🎉",
              };
              break;
            case "COMMUNITY_JOIN":
              newAction = { type: "COMMUNITY_JOIN" };
              break;
            case "NOTIFICATION":
              newAction = {
                type: "NOTIFICATION",
                pushTitle: "Welcome! ✨",
                pushBody: "Your membership perks have been activated.",
                push: true,
              };
              break;
            case "ADD_MEMBER_TAG":
              newAction = {
                type: "ADD_MEMBER_TAG",
                tags: ["New Member"],
              };
              break;
            default:
              newAction = { type };
          }
          const updated = [...actions, newAction];
          onActionsChange(updated);
          setSelectedNode({
            type: "action",
            data: { action: newAction, index: actions.length },
            index: actions.length,
          });
          toast.success("Added new action block to canvas.");
        },
      },
    });

    return { nodes, edges };
  }, [
    trigger,
    conditionOperator,
    conditions,
    actions,
    simulationState,
    onConditionOperatorChange,
    onActionsChange,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const hasFitViewRef = useRef(false);

  // Sync graph whenever form inputs change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateGraph();
    setNodes((prevNodes) => {
      const prevPosMap = new Map(prevNodes.map((n) => [n.id, n.position]));
      return newNodes.map((node) => {
        const existingPos = prevPosMap.get(node.id);
        return {
          ...node,
          position: existingPos || node.position,
        };
      });
    });
    setEdges(newEdges);
  }, [generateGraph, setNodes, setEdges]);

  // Initial Auto fit
  useEffect(() => {
    if (!hasFitViewRef.current && nodes.length > 0) {
      hasFitViewRef.current = true;
      const timer = setTimeout(() => {
        fitView({ padding: 0.15, duration: 400 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [fitView, nodes.length]);

  // Action update handler for inspector
  const handleActionUpdate = (
    index: number,
    updates: Partial<MemberRuleActionInput>
  ) => {
    const updated = actions.map((a, i) =>
      i === index ? { ...a, ...updates } : a
    );
    onActionsChange(updated);
  };

  const handleActionDelete = (index: number) => {
    const updated = actions.filter((_, i) => i !== index);
    onActionsChange(updated);
    setSelectedNode(null);
  };

  // Recipe apply handler
  const handleApplyRecipe = (recipe: (typeof TEMPLATE_RECIPES)[0]) => {
    onNameChange(recipe.title);
    onTriggerChange(recipe.trigger);
    onConditionOperatorChange(recipe.conditionOperator);
    onConditionsChange(recipe.conditions);
    onActionsChange(recipe.actions as any);
    toast.success(`Applied ${recipe.title} template to canvas.`);
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
  };

  const handleSimulationResult = (res: { passed: boolean }) => {
    setSimulationState({ isRunning: false, passed: res.passed });
    toast.info(
      res.passed
        ? "Simulation finished: Member qualified and actions triggered!"
        : "Simulation finished: Member did not meet condition criteria."
    );
  };

  const clearSimulation = () => {
    setSimulationState(null);
    toast.info("Simulation feedback cleared.");
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[680px] flex flex-col bg-background rounded-2xl border border-border overflow-hidden shadow-xl">
      {/* ── Top Canvas Action Toolbar ────────────────────────────────────── */}
      <header className="h-14 px-4 bg-card border-b border-border flex items-center justify-between gap-3 shrink-0 z-10">
        {/* Left: Rule Name Input & Active Status */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Zap className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Rule Name (e.g. Stanford Alumni Gold Tier Flow)"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="h-8 text-xs font-bold bg-background border-border"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
            <Switch
              checked={isActive}
              onCheckedChange={onIsActiveChange}
              className="data-[state=checked]:bg-emerald-600 h-4 w-8"
            />
            <span
              className={cn(
                "text-[11px] font-bold",
                isActive ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {isActive ? "Active Rule" : "Paused"}
            </span>
          </div>
        </div>

        {/* Right: Simulation, Layout, Switcher, and Save */}
        <div className="flex items-center gap-2 shrink-0">
          {simulationState && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSimulation}
              className="h-8 text-xs gap-1.5 border-amber-500/30 text-amber-600 bg-amber-500/5 hover:bg-amber-500/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSimModalOpen(true)}
            className="h-8 text-xs gap-1.5 font-bold border-primary/30 text-primary hover:bg-primary/5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Dry-Run Test
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fitView({ padding: 0.2, duration: 400 })}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            title="Recenter and Fit View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Fit View</span>
          </Button>

          {/* View Switcher: Canvas <-> Form */}
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onViewModeChange("flow")}
              className={cn(
                "px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "flow"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("form")}
              className={cn(
                "px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "form"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Step Form</span>
            </button>
          </div>

          {/* Primary Save Button */}
          <Button
            type="button"
            size="sm"
            disabled={isSaving}
            onClick={onSave}
            className="h-8 px-3 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      </header>

      {/* ── Main Canvas Workspace (Palette + React Flow + Inspector) ───────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Node Palette */}
        <NodePalette
          onAddAction={(type) => {
            let newAction: MemberRuleActionInput;
            switch (type) {
              case "ASSIGN_MEMBERSHIP_TIER":
                newAction = { type: "ASSIGN_MEMBERSHIP_TIER" };
                break;
              case "EMAIL":
                newAction = {
                  type: "EMAIL",
                  emailSubject: "Welcome to our community! 🎉",
                };
                break;
              case "COMMUNITY_JOIN":
                newAction = { type: "COMMUNITY_JOIN" };
                break;
              case "NOTIFICATION":
                newAction = {
                  type: "NOTIFICATION",
                  pushTitle: "Welcome! ✨",
                  pushBody: "Your membership perks have been activated.",
                  push: true,
                };
                break;
              case "ADD_MEMBER_TAG":
                newAction = {
                  type: "ADD_MEMBER_TAG",
                  tags: ["VIP"],
                };
                break;
              default:
                newAction = { type };
            }
            onActionsChange([...actions, newAction]);
            setSelectedNode({
              type: "action",
              data: { action: newAction, index: actions.length },
              index: actions.length,
            });
            toast.success("Action added to canvas.");
          }}
          onApplyRecipe={handleApplyRecipe}
          onSelectTriggerNode={() =>
            setSelectedNode({ type: "trigger", data: { trigger } })
          }
          onSelectConditionNode={() =>
            setSelectedNode({
              type: "condition",
              data: { conditions, conditionOperator },
            })
          }
        />

        {/* Center: React Flow Canvas */}
        <div className="flex-1 h-full relative bg-zinc-50/60 dark:bg-zinc-950/40">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            className="w-full h-full"
          >
            <Background color="#94a3b8" gap={20} size={1} />
            <Controls className="bg-card border border-border shadow-md rounded-xl p-1 fill-foreground" />
            <MiniMap
              className="bg-card border border-border shadow-md rounded-xl overflow-hidden"
              nodeColor={(n) => {
                if (n.type === "trigger") return "#10b981";
                if (n.type === "condition") return "#3b82f6";
                if (n.type === "action") return "#f59e0b";
                return "#94a3b8";
              }}
              zoomable
              pannable
            />

            {/* Quick Helper Floating Badge */}
            <Panel position="bottom-center">
              <div className="px-3 py-1.5 rounded-full bg-card/90 dark:bg-zinc-900/90 backdrop-blur border border-border shadow-lg flex items-center gap-2 text-[11px] text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>
                  Click any node to configure in the inspector · Drag to reposition
                </span>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Node Inspector */}
        <NodeInspector
          selectedNode={selectedNode}
          trigger={trigger}
          conditionOperator={conditionOperator}
          conditions={conditions}
          actions={actions}
          onTriggerChange={onTriggerChange}
          onConditionOperatorChange={onConditionOperatorChange}
          onConditionsChange={onConditionsChange}
          onActionUpdate={handleActionUpdate}
          onActionDelete={handleActionDelete}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      {/* ── Test Simulator Modal ─────────────────────────────────────────── */}
      <FlowSimulationModal
        open={isSimModalOpen}
        onOpenChange={setIsSimModalOpen}
        trigger={trigger}
        conditionOperator={conditionOperator}
        conditions={conditions}
        actions={actions}
        onSimulationRun={handleSimulationResult}
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
