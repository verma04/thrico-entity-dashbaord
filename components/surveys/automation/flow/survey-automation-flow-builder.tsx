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
  RotateCcw,
  ListFilter,
  Save,
  ClipboardList,
  GitBranch,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  SurveyRuleTrigger,
  SurveyRuleConditionInput,
  SurveyRuleActionInput,
  SurveyRuleActionType,
} from "@/graphql/survey-automation";
import {
  SurveyTriggerNode,
  SurveyBranchConditionNode,
  SurveyAddBranchNode,
  SurveyActionNode,
  SurveyAddActionNode,
} from "./custom-nodes";
import { SurveyCustomFlowEdge } from "./custom-edge";
import { SurveyNodeInspector } from "./node-inspector";
import { SurveyNodePalette, SURVEY_TEMPLATE_RECIPES } from "./node-palette";
import { SurveyFlowSimulationModal } from "./flow-simulation-modal";
import { SelectedSurveyNodeInfo } from "./types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { NodeTypes, EdgeTypes } from "@xyflow/react";

const nodeTypes: NodeTypes = {
  trigger: SurveyTriggerNode as any,
  branchCondition: SurveyBranchConditionNode as any,
  addBranch: SurveyAddBranchNode as any,
  action: SurveyActionNode as any,
  addAction: SurveyAddActionNode as any,
};

const edgeTypes: EdgeTypes = {
  custom: SurveyCustomFlowEdge as any,
};

interface SurveyAutomationFlowBuilderProps {
  name: string;
  description?: string;
  surveyId?: string | null;
  surveyName?: string | null;
  trigger: SurveyRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: SurveyRuleConditionInput[];
  actions: SurveyRuleActionInput[];
  isActive: boolean;
  onNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onSurveyIdChange: (surveyId: string | null) => void;
  onTriggerChange: (trigger: SurveyRuleTrigger) => void;
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: SurveyRuleConditionInput[]) => void;
  onActionsChange: (actions: SurveyRuleActionInput[]) => void;
  onIsActiveChange: (active: boolean) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  hasChanged: boolean;
  isSaving?: boolean;
  isEdit?: boolean;
  viewMode: "flow" | "form";
  onViewModeChange: (mode: "flow" | "form") => void;
}

const FlowCanvasInternal: React.FC<SurveyAutomationFlowBuilderProps> = ({
  name,
  description,
  surveyId,
  surveyName,
  trigger,
  conditionOperator,
  conditions,
  actions,
  isActive,
  onNameChange,
  onDescriptionChange,
  onSurveyIdChange,
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

  const [selectedNode, setSelectedNode] = useState<SelectedSurveyNodeInfo>({
    type: "trigger",
    data: { trigger, surveyId, surveyName },
  });
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [simulationState, setSimulationState] = useState<{
    isRunning: boolean;
    passed?: boolean;
    executedActionIndices?: number[];
  } | null>(null);

  // Group actions into branches
  const branches = useMemo(() => {
    const branchMap = new Map<
      string,
      {
        conditions: SurveyRuleConditionInput[];
        conditionOperator: "AND" | "OR";
        actionsWithIndices: { action: SurveyRuleActionInput; originalIndex: number }[];
      }
    >();

    actions.forEach((act, originalIndex) => {
      const condKey =
        act.conditions && act.conditions.length > 0
          ? JSON.stringify(act.conditions) + `|${act.conditionOperator || "AND"}`
          : "universal_default_branch";

      if (!branchMap.has(condKey)) {
        branchMap.set(condKey, {
          conditions: act.conditions || [],
          conditionOperator: (act.conditionOperator as "AND" | "OR") || "AND",
          actionsWithIndices: [],
        });
      }
      branchMap.get(condKey)!.actionsWithIndices.push({ action: act, originalIndex });
    });

    // If no actions, show an empty default branch
    if (branchMap.size === 0) {
      branchMap.set("universal_default_branch", {
        conditions: [],
        conditionOperator: "AND",
        actionsWithIndices: [],
      });
    }

    return Array.from(branchMap.values());
  }, [actions]);

  const generateGraph = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const columnWidth = 330;
    const columnGap = 40;
    const totalColumns = branches.length;
    const totalWidth = totalColumns * columnWidth + (totalColumns - 1) * columnGap;

    const startX = 80;
    const triggerX = startX + totalWidth / 2 - 160;
    const triggerY = 30;

    // Trigger Node
    nodes.push({
      id: "node-trigger",
      type: "trigger",
      position: { x: triggerX, y: triggerY },
      data: {
        trigger,
        surveyId,
        surveyName,
        onSelect: () =>
          setSelectedNode({
            type: "trigger",
            data: { trigger, surveyId, surveyName },
          }),
      },
    });

    const branchY = 220;

    // Generate each branch column
    branches.forEach((branch, bIdx) => {
      const branchX = startX + bIdx * (columnWidth + columnGap);
      const branchId = `node-branch-${bIdx}`;

      // Branch Condition Node (Column Header)
      nodes.push({
        id: branchId,
        type: "branchCondition",
        position: { x: branchX, y: branchY },
        data: {
          branchIndex: bIdx,
          conditions: branch.conditions,
          conditionOperator: branch.conditionOperator,
          actionCount: branch.actionsWithIndices.length,
          onSelect: () =>
            setSelectedNode({
              type: "branchCondition",
              branchIndex: bIdx,
              data: {
                branchIndex: bIdx,
                conditions: branch.conditions,
                conditionOperator: branch.conditionOperator,
                actionCount: branch.actionsWithIndices.length,
              },
            }),
          onAddActionToBranch: (type: SurveyRuleActionType) => {
            let newAct: SurveyRuleActionInput;
            switch (type) {
              case "ASSIGN_MEMBERSHIP_TIER":
                newAct = {
                  type: "ASSIGN_MEMBERSHIP_TIER",
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "EMAIL":
                newAct = {
                  type: "EMAIL",
                  emailSubject: "Thank you for completing our survey! 🎉",
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "COMMUNITY_JOIN":
                newAct = {
                  type: "COMMUNITY_JOIN",
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "NOTIFICATION":
                newAct = {
                  type: "NOTIFICATION",
                  pushTitle: "Survey Reward ✨",
                  pushBody: "Thanks for submitting your feedback!",
                  push: true,
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "ADD_MEMBER_TAG":
                newAct = {
                  type: "ADD_MEMBER_TAG",
                  tags: ["Survey Completed"],
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              default:
                newAct = {
                  type,
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
            }
            onActionsChange([...actions, newAct]);
            toast.success(`Action added to Branch #${bIdx + 1}`);
          },
          onDuplicateBranch: () => {
            const clonedActions = branch.actionsWithIndices.map((a) => ({
              ...a.action,
              conditions: branch.conditions.map((c) => ({ ...c })),
            }));
            onActionsChange([...actions, ...clonedActions]);
            toast.success(`Duplicated Branch #${bIdx + 1}`);
          },
          onDeleteBranch: () => {
            const indicesToRemove = new Set(
              branch.actionsWithIndices.map((a) => a.originalIndex)
            );
            const updated = actions.filter((_, i) => !indicesToRemove.has(i));
            onActionsChange(updated);
            toast.info(`Deleted Branch #${bIdx + 1}`);
            setSelectedNode(null);
          },
          simulationStatus: simulationState
            ? simulationState.passed
              ? "passed"
              : "failed"
            : "idle",
        },
      });

      // Edge: Trigger -> Branch Condition Node
      edges.push({
        id: `edge-trigger-branch-${bIdx}`,
        source: "node-trigger",
        target: branchId,
        type: "custom",
        animated: true,
        data: {
          label: `Branch #${bIdx + 1}`,
          isSimulating: simulationState?.isRunning,
          simulationSuccess: simulationState?.passed,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#06b6d4" },
      });

      // Vertical action stack within branch
      let prevNodeId = branchId;
      branch.actionsWithIndices.forEach(({ action: act, originalIndex }, actIdxInBranch) => {
        const actNodeId = `node-action-${originalIndex}`;
        const actY = branchY + 230 + actIdxInBranch * 260;

        const isExecuted =
          simulationState?.executedActionIndices?.includes(originalIndex);

        nodes.push({
          id: actNodeId,
          type: "action",
          position: { x: branchX, y: actY },
          data: {
            action: act,
            index: originalIndex,
            branchIndex: bIdx,
            onSelect: () =>
              setSelectedNode({
                type: "action",
                data: { action: act, index: originalIndex, branchIndex: bIdx },
                index: originalIndex,
              }),
            onDelete: () => {
              const updated = actions.filter((_, i) => i !== originalIndex);
              onActionsChange(updated);
              if (
                selectedNode?.type === "action" &&
                selectedNode.index === originalIndex
              ) {
                setSelectedNode(null);
              }
            },
            onDuplicate: () => {
              onActionsChange([...actions, { ...act }]);
              toast.success("Action duplicated.");
            },
            simulationStatus: simulationState
              ? isExecuted
                ? "executed"
                : "skipped"
              : "idle",
          },
        });

        // Vertical Edge
        edges.push({
          id: `edge-${prevNodeId}-${actNodeId}`,
          source: prevNodeId,
          target: actNodeId,
          type: "custom",
          animated: true,
          data: {
            label: `Step #${actIdxInBranch + 1}`,
            isSimulating: simulationState?.isRunning,
            simulationSuccess: isExecuted,
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
        });

        prevNodeId = actNodeId;
      });

      // Add Action Node at bottom of this branch
      const addActionY =
        branchY + 230 + branch.actionsWithIndices.length * 260;
      const addActionNodeId = `node-add-action-branch-${bIdx}`;

      nodes.push({
        id: addActionNodeId,
        type: "addAction",
        position: { x: branchX + 35, y: addActionY },
        data: {
          branchIndex: bIdx,
          onAddAction: (type: SurveyRuleActionType) => {
            let newAct: SurveyRuleActionInput;
            switch (type) {
              case "ASSIGN_MEMBERSHIP_TIER":
                newAct = {
                  type: "ASSIGN_MEMBERSHIP_TIER",
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "EMAIL":
                newAct = {
                  type: "EMAIL",
                  emailSubject: "Thank you for completing our survey! 🎉",
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "COMMUNITY_JOIN":
                newAct = {
                  type: "COMMUNITY_JOIN",
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "NOTIFICATION":
                newAct = {
                  type: "NOTIFICATION",
                  pushTitle: "Survey Reward ✨",
                  pushBody: "Thanks for submitting your feedback!",
                  push: true,
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              case "ADD_MEMBER_TAG":
                newAct = {
                  type: "ADD_MEMBER_TAG",
                  tags: ["Survey Completed"],
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
                break;
              default:
                newAct = {
                  type,
                  conditions: [...branch.conditions],
                  conditionOperator: branch.conditionOperator,
                };
            }
            onActionsChange([...actions, newAct]);
            toast.success(`Action appended to Branch #${bIdx + 1}`);
          },
        },
      });

      edges.push({
        id: `edge-${prevNodeId}-${addActionNodeId}`,
        source: prevNodeId,
        target: addActionNodeId,
        type: "custom",
        animated: false,
        style: { strokeDasharray: "4,4" },
      });
    });

    // Add New Branch Node (Placed to the right of branches)
    const addBranchX = startX + totalColumns * (columnWidth + columnGap);
    const addBranchY = branchY;

    nodes.push({
      id: "node-add-branch",
      type: "addBranch",
      position: { x: addBranchX, y: addBranchY },
      data: {
        onAddBranch: () => {
          const newBranchCondition: SurveyRuleConditionInput = {
            field: "context.selectedOptions",
            operator: "contains",
            value: "Option Name",
          };
          const newAction: SurveyRuleActionInput = {
            type: "EMAIL",
            emailSubject: "Welcome to our cohort! 🎉",
            conditions: [newBranchCondition],
            conditionOperator: "AND",
          };
          onActionsChange([...actions, newAction]);
          toast.success("Created new condition branch column.");
        },
      },
    });

    edges.push({
      id: "edge-trigger-add-branch",
      source: "node-trigger",
      target: "node-add-branch",
      type: "custom",
      animated: false,
      style: { strokeDasharray: "4,4" },
      data: { label: "+ Branch" },
    });

    return { nodes, edges };
  }, [
    trigger,
    surveyId,
    surveyName,
    branches,
    actions,
    simulationState,
    onActionsChange,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const hasFitViewRef = useRef(false);

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

  useEffect(() => {
    if (!hasFitViewRef.current && nodes.length > 0) {
      hasFitViewRef.current = true;
      const timer = setTimeout(() => {
        fitView({ padding: 0.15, duration: 400 });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [fitView, nodes.length]);

  const handleActionUpdate = (
    index: number,
    updates: Partial<SurveyRuleActionInput>
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

  const handleBranchConditionsChange = (
    branchIndex: number,
    newConditions: SurveyRuleConditionInput[],
    newOp: "AND" | "OR"
  ) => {
    const targetBranch = branches[branchIndex];
    if (!targetBranch) return;

    if (targetBranch.actionsWithIndices.length === 0) {
      const newAction: SurveyRuleActionInput = {
        type: "EMAIL",
        emailSubject: "Welcome! 🎉",
        conditions: newConditions,
        conditionOperator: newOp,
      };
      onActionsChange([...actions, newAction]);
    } else {
      const indicesToUpdate = new Set(
        targetBranch.actionsWithIndices.map((a) => a.originalIndex)
      );
      const updated = actions.map((act, i) => {
        if (indicesToUpdate.has(i)) {
          return {
            ...act,
            conditions: newConditions.map((c) => ({ ...c })),
            conditionOperator: newOp,
          };
        }
        return act;
      });
      onActionsChange(updated);
    }
  };

  const handleAddActionToBranch = (
    branchIndex: number,
    type: SurveyRuleActionType
  ) => {
    const targetBranch = branches[branchIndex];
    const conds = targetBranch ? targetBranch.conditions : [];
    const op = targetBranch ? targetBranch.conditionOperator : "AND";

    let newAct: SurveyRuleActionInput;
    switch (type) {
      case "ASSIGN_MEMBERSHIP_TIER":
        newAct = {
          type: "ASSIGN_MEMBERSHIP_TIER",
          conditions: [...conds],
          conditionOperator: op,
        };
        break;
      case "EMAIL":
        newAct = {
          type: "EMAIL",
          emailSubject: "Thank you for completing our survey! 🎉",
          conditions: [...conds],
          conditionOperator: op,
        };
        break;
      case "COMMUNITY_JOIN":
        newAct = {
          type: "COMMUNITY_JOIN",
          conditions: [...conds],
          conditionOperator: op,
        };
        break;
      case "NOTIFICATION":
        newAct = {
          type: "NOTIFICATION",
          pushTitle: "Survey Reward ✨",
          pushBody: "Thanks for submitting your feedback!",
          push: true,
          conditions: [...conds],
          conditionOperator: op,
        };
        break;
      case "ADD_MEMBER_TAG":
        newAct = {
          type: "ADD_MEMBER_TAG",
          tags: ["Survey Completed"],
          conditions: [...conds],
          conditionOperator: op,
        };
        break;
      default:
        newAct = {
          type,
          conditions: [...conds],
          conditionOperator: op,
        };
    }
    onActionsChange([...actions, newAct]);
    toast.success(`Action added to Branch #${branchIndex + 1}`);
  };

  const handleDuplicateBranch = (branchIndex: number) => {
    const targetBranch = branches[branchIndex];
    if (!targetBranch) return;
    const clonedActions = targetBranch.actionsWithIndices.map((a) => ({
      ...a.action,
      conditions: targetBranch.conditions.map((c) => ({ ...c })),
    }));
    onActionsChange([...actions, ...clonedActions]);
    toast.success(`Duplicated Branch #${branchIndex + 1}`);
  };

  const handleDeleteBranch = (branchIndex: number) => {
    const targetBranch = branches[branchIndex];
    if (!targetBranch) return;
    const indicesToRemove = new Set(
      targetBranch.actionsWithIndices.map((a) => a.originalIndex)
    );
    const updated = actions.filter((_, i) => !indicesToRemove.has(i));
    onActionsChange(updated);
    toast.info(`Deleted Branch #${branchIndex + 1}`);
    setSelectedNode(null);
  };

  const handleApplyRecipe = (recipe: (typeof SURVEY_TEMPLATE_RECIPES)[0]) => {
    onNameChange(recipe.title);
    onTriggerChange(recipe.trigger);
    onConditionOperatorChange(recipe.conditionOperator);
    onConditionsChange(recipe.conditions);
    onActionsChange(recipe.actions as any);
    toast.success(`Applied ${recipe.title} blueprint to canvas.`);
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 500 });
    }, 100);
  };

  const handleSimulationResult = (res: {
    passed: boolean;
    executedActions: SurveyRuleActionInput[];
  }) => {
    const executedIndices = res.executedActions.map((act) =>
      actions.indexOf(act)
    );
    setSimulationState({
      isRunning: false,
      passed: res.passed,
      executedActionIndices: executedIndices,
    });
    toast.info(
      res.passed
        ? `Simulation complete: ${res.executedActions.length} actions in matching branches executed!`
        : "Simulation finished: Response did not qualify for any branch."
    );
  };

  const clearSimulation = () => {
    setSimulationState(null);
    toast.info("Simulation feedback cleared.");
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[680px] flex flex-col bg-background rounded-2xl border border-border overflow-hidden shadow-xl">
      {/* Top Canvas Toolbar */}
      <header className="h-14 px-4 bg-card border-b border-border flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0">
            <ClipboardList className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Rule Name (e.g. Comprehensive Survey Multi-Option Pipeline)"
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
            className="h-8 text-xs gap-1.5 font-bold border-cyan-500/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10"
          >
            <Play className="w-3.5 h-3.5 fill-current text-cyan-600" />
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

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <SurveyNodePalette
          onAddAction={(type) => {
            let newAction: SurveyRuleActionInput;
            switch (type) {
              case "ASSIGN_MEMBERSHIP_TIER":
                newAction = { type: "ASSIGN_MEMBERSHIP_TIER" };
                break;
              case "EMAIL":
                newAction = {
                  type: "EMAIL",
                  emailSubject: "Thank you for completing our survey! 🎉",
                };
                break;
              case "COMMUNITY_JOIN":
                newAction = { type: "COMMUNITY_JOIN" };
                break;
              case "NOTIFICATION":
                newAction = {
                  type: "NOTIFICATION",
                  pushTitle: "Survey Reward ✨",
                  pushBody: "Your survey perks have been granted.",
                  push: true,
                };
                break;
              case "ADD_MEMBER_TAG":
                newAction = {
                  type: "ADD_MEMBER_TAG",
                  tags: ["Survey Respondent"],
                };
                break;
              default:
                newAction = { type };
            }
            onActionsChange([...actions, newAction]);
            toast.success("Action added to canvas.");
          }}
          onApplyRecipe={handleApplyRecipe}
          onSelectTriggerNode={() =>
            setSelectedNode({
              type: "trigger",
              data: { trigger, surveyId, surveyName },
            })
          }
          onSelectConditionNode={() =>
            setSelectedNode({
              type: "condition",
              data: { conditions, conditionOperator },
            })
          }
          onSelectBranchConditionNode={(bIdx = 0) => {
            const targetBranch = branches[bIdx] || branches[0];
            if (targetBranch) {
              setSelectedNode({
                type: "branchCondition",
                branchIndex: bIdx,
                data: {
                  branchIndex: bIdx,
                  conditions: targetBranch.conditions,
                  conditionOperator: targetBranch.conditionOperator,
                  actionCount: targetBranch.actionsWithIndices.length,
                },
              });
            } else {
              setSelectedNode({
                type: "condition",
                data: { conditions, conditionOperator },
              });
            }
          }}
          branchCount={branches.length}
        />

        <div className="flex-1 h-full relative bg-zinc-50/60 dark:bg-zinc-950/40">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_event, node) => {
              if (node.type === "trigger") {
                setSelectedNode({
                  type: "trigger",
                  data: { trigger, surveyId, surveyName },
                });
              } else if (node.type === "condition") {
                setSelectedNode({
                  type: "condition",
                  data: { conditions, conditionOperator },
                });
              } else if (node.type === "branchCondition") {
                const bData = node.data as any;
                setSelectedNode({
                  type: "branchCondition",
                  branchIndex: bData.branchIndex,
                  data: bData,
                });
              } else if (node.type === "action") {
                const aData = node.data as any;
                setSelectedNode({
                  type: "action",
                  index: aData.index,
                  data: aData,
                });
              }
            }}
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
                if (n.type === "trigger") return "#06b6d4";
                if (n.type === "branchCondition") return "#38bdf8";
                if (n.type === "action") return "#f59e0b";
                return "#94a3b8";
              }}
              zoomable
              pannable
            />

            <Panel position="bottom-center">
              <div className="px-3.5 py-1.5 rounded-full bg-card/90 dark:bg-zinc-900/90 backdrop-blur border border-border shadow-lg flex items-center gap-2 text-[11px] text-muted-foreground">
                <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
                <span>
                  Multi-Branch Visual Canvas · Click any branch condition or action block to inspect
                </span>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        <SurveyNodeInspector
          selectedNode={selectedNode}
          surveyId={surveyId}
          trigger={trigger}
          conditionOperator={conditionOperator}
          conditions={conditions}
          actions={actions}
          branches={branches}
          onSurveyIdChange={onSurveyIdChange}
          onTriggerChange={onTriggerChange}
          onConditionOperatorChange={onConditionOperatorChange}
          onConditionsChange={onConditionsChange}
          onActionUpdate={handleActionUpdate}
          onActionDelete={handleActionDelete}
          onBranchConditionsChange={handleBranchConditionsChange}
          onAddActionToBranch={handleAddActionToBranch}
          onDuplicateBranch={handleDuplicateBranch}
          onDeleteBranch={handleDeleteBranch}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      <SurveyFlowSimulationModal
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

export const SurveyAutomationFlowBuilder: React.FC<
  SurveyAutomationFlowBuilderProps
> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInternal {...props} />
    </ReactFlowProvider>
  );
};
