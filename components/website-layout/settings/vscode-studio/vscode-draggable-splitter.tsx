"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VscodeDraggableSplitterProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onResetSplit: () => void;
  isDragging: boolean;
}

export const VscodeDraggableSplitter: React.FC<VscodeDraggableSplitterProps> = ({
  onMouseDown,
  onResetSplit,
  isDragging,
}) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={onResetSplit}
      className={cn(
        "w-1 hover:w-1.5 bg-[#2b2b2b] hover:bg-[#007acc] cursor-col-resize shrink-0 z-30 transition-all select-none",
        isDragging && "w-1.5 bg-[#007acc]"
      )}
      title="Drag to resize split view (double-click to reset 50/50)"
    />
  );
};
