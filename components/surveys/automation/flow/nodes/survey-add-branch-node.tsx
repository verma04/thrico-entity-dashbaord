"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";

export const SurveyAddBranchNode = memo(({ data }: NodeProps<any>) => {
  return (
    <div className="group relative w-[220px]">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background shadow-xs"
      />

      <button
        type="button"
        onClick={() => data.onAddBranch?.()}
        className="w-full p-3.5 rounded-2xl border-2 border-dashed border-cyan-400 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/20 hover:border-cyan-500 hover:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:scale-[1.02]"
      >
        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold">+ New Condition Branch</span>
      </button>
    </div>
  );
});

SurveyAddBranchNode.displayName = "SurveyAddBranchNode";
