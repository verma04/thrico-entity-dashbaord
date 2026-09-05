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

export const SharedCustomFlowEdge = memo(
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
    const isSimulating = Boolean(customData.isSimulating);
    const isSuccess = customData.simulationSuccess as boolean | undefined;
    const label = typeof customData.label === "string" ? customData.label : undefined;

    return (
      <>
        {(selected || isSimulating) && (
          <path
            d={edgePath}
            fill="none"
            className={cn(
              "stroke-primary/30 transition-all duration-300",
              isSuccess === true && "stroke-emerald-500/40",
              isSuccess === false && "stroke-rose-500/40"
            )}
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
            stroke:
              isSuccess === true
                ? "#10b981"
                : isSuccess === false
                ? "#f43f5e"
                : selected
                ? "#3b82f6"
                : undefined,
          }}
          className={cn(
            "stroke-zinc-300 dark:stroke-zinc-700 transition-all duration-200",
            (isSimulating || selected) && "stroke-primary animate-pulse"
          )}
        />

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan group flex items-center gap-1"
          >
            {label && (
              <span className="px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[9px] font-bold text-muted-foreground shadow-2xs">
                {label}
              </span>
            )}

            {customData.onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => customData.onDelete?.(id)}
                className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded-full bg-background border border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all shadow-xs"
                title="Disconnect edge"
              >
                <X className="w-2.5 h-2.5" />
              </Button>
            )}
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

SharedCustomFlowEdge.displayName = "SharedCustomFlowEdge";
