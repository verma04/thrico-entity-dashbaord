"use client";

import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GamificationCustomFlowEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected,
  }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const customData = (data || {}) as Record<string, any>;
    const label =
      typeof customData.label === "string" ? customData.label : undefined;

    return (
      <>
        {selected && (
          <path
            d={edgePath}
            fill="none"
            className="stroke-primary/30 transition-all duration-300"
            strokeWidth={10}
            strokeLinecap="round"
          />
        )}

        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            ...style,
            strokeWidth: selected ? 2.5 : 2,
            stroke: selected ? "#6366f1" : undefined,
          }}
          className={cn(
            "stroke-zinc-300 dark:stroke-zinc-700 transition-all duration-200",
            selected && "stroke-primary animate-pulse"
          )}
        />

        {label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              className="nodrag nopan group flex items-center gap-1"
            >
              <span className="px-2 py-0.5 rounded-full bg-card border border-border text-[9px] font-bold text-muted-foreground shadow-2xs">
                {label}
              </span>
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  }
);

GamificationCustomFlowEdge.displayName = "GamificationCustomFlowEdge";
