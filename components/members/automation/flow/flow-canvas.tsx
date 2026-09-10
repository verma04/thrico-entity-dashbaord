"use client";

import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TriggerNode,
  ConditionNode,
  AddBranchNode,
  ActionNode,
  AddActionNode,
  ExitNode,
} from "./custom-nodes";
import { CustomFlowEdge } from "./custom-edge";
import { MemberRuleActionType } from "@/graphql/member-automation";

export const nodeTypes: NodeTypes = {
  trigger: TriggerNode as any,
  condition: ConditionNode as any,
  addBranch: AddBranchNode as any,
  action: ActionNode as any,
  addAction: AddActionNode as any,
  exit: ExitNode as any,
};

export const edgeTypes: EdgeTypes = {
  custom: CustomFlowEdge as any,
};

export interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onDropAction: (
    type: MemberRuleActionType,
    branchId: string,
    path: "yes" | "no"
  ) => void;
  onDropFilter: (field: string, branchId: string) => void;
  onAutoLayout?: () => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onDropAction,
  onDropFilter,
  onAutoLayout,
}) => {
  return (
    <div
      className="flex-1 h-full relative bg-zinc-50/60 dark:bg-zinc-950/40"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const itemType = e.dataTransfer.getData("application/reactflow/type");
        if (itemType === "action") {
          const actionType = e.dataTransfer.getData(
            "application/reactflow/action"
          ) as MemberRuleActionType;
          const branchId =
            e.dataTransfer.getData("application/reactflow/branch") || "branch_1";
          const path = (e.dataTransfer.getData("application/reactflow/path") ||
            "yes") as "yes" | "no";
          if (actionType) {
            onDropAction(actionType, branchId, path);
          }
        } else if (itemType === "filter") {
          const field = e.dataTransfer.getData("application/reactflow/field");
          const branchId =
            e.dataTransfer.getData("application/reactflow/branch") || "branch_1";
          if (field) {
            onDropFilter(field, branchId);
          }
        }
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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

        {/* Top-Right Floating Quick Action: Beautify Flow */}
        {onAutoLayout && (
          <Panel position="top-right" className="m-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAutoLayout}
              className="h-8 px-3 text-xs font-bold gap-1.5 bg-card/90 dark:bg-zinc-900/90 backdrop-blur border-border hover:bg-card text-foreground shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer hover:border-purple-500/50 group"
              title="Auto-align and beautify all branches neatly"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform" />
              <span>Beautify Flow</span>
            </Button>
          </Panel>
        )}

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
  );
};
