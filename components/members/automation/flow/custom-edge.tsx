"use client";

import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
} from "@xyflow/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CustomFlowEdge = memo(
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
        {/* Glow halo when simulating or selected */}
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

        {/* Base Edge Path */}
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

        {/* Label and Delete Controls */}
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
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full border text-[9px] font-bold shadow-2xs transition-all flex items-center gap-1",
                  customData.branch === "yes"
                    ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                    : customData.branch === "no"
                    ? "bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-muted-foreground"
                )}
              >
                {customData.branch === "yes" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                {customData.branch === "no" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
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

CustomFlowEdge.displayName = "CustomFlowEdge";
