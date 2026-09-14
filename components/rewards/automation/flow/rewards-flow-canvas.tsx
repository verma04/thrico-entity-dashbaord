"use client";

import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  ConnectionMode,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  RewardsTriggerNode,
  RewardsConditionNode,
  RewardsActionNode,
  RewardsAddActionNode,
} from "./rewards-custom-nodes";
import { RewardRuleActionType } from "@/graphql/rewards-automation";

export const rewardsNodeTypes: any = {
  trigger: RewardsTriggerNode as any,
  condition: RewardsConditionNode as any,
  action: RewardsActionNode as any,
  addAction: RewardsAddActionNode as any,
};

interface RewardsFlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onDropAction?: (type: RewardRuleActionType, branchId: string, path: "yes" | "no") => void;
  onDropFilter?: (field: string, branchId: string) => void;
  onAutoLayout?: () => void;
}

export const RewardsFlowCanvas: React.FC<RewardsFlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onDropAction,
  onDropFilter,
}) => {
  const nodeTypes = useMemo(() => rewardsNodeTypes, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const actionType = event.dataTransfer.getData("application/reactflow-action") as RewardRuleActionType;
      const branchId = event.dataTransfer.getData("application/reactflow-branch") || "branch_1";
      const path = (event.dataTransfer.getData("application/reactflow-path") || "yes") as "yes" | "no";

      if (actionType && onDropAction) {
        onDropAction(actionType, branchId, path);
      }
    },
    [onDropAction]
  );

  return (
    <div className="flex-1 h-full w-full relative bg-muted/10 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.18, duration: 400 }}
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        deleteKeyCode={["Backspace", "Delete"]}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          className="opacity-40"
        />
        <Controls
          showInteractive={false}
          className="!bottom-4 !left-4 !bg-card !border-border !shadow-md !rounded-lg overflow-hidden"
        />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bottom-4 !right-4 !bg-card/90 !border-border !shadow-lg !rounded-xl overflow-hidden hidden sm:block"
        />
      </ReactFlow>
    </div>
  );
};
