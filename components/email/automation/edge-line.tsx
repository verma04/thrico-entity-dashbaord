"use client";

import React, { useRef } from "react";
import { WorkflowNode } from "./types";

interface EdgeLineProps {
  edgeId: string;
  from: string;
  to: string;
  nodes: WorkflowNode[];
  onDelete: (id: string) => void;
}

const NODE_W = 280;
const NODE_H = 88; // approx total node height (header + body + dot)

export function EdgeLine({ edgeId, from, to, nodes, onDelete }: EdgeLineProps) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode   = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  // Output port = bottom-centre of source node
  const x1 = fromNode.x + NODE_W / 2;
  const y1 = fromNode.y + NODE_H;
  // Input port = top-centre of target node
  const x2 = toNode.x + NODE_W / 2;
  const y2 = toNode.y;

  const midY = (y1 + y2) / 2;
  const d = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;

  // Midpoint for delete button
  const mx = (x1 + x2) / 2;
  const my = midY;

  const markerId = `arr-${from}-${to}`;

  return (
    <g className="group/edge">
      <defs>
        <marker
          id={markerId}
          markerWidth="7" markerHeight="7"
          refX="5" refY="3" orient="auto"
        >
          <path d="M0,0 L7,3 L0,6 Z" fill="#5B6CFF" />
        </marker>
      </defs>

      {/* Invisible thick hit-area for hover */}
      <path
        d={d}
        stroke="transparent"
        strokeWidth="14"
        fill="none"
        style={{ pointerEvents: "stroke", cursor: "pointer" }}
      />

      {/* Visible edge */}
      <path
        d={d}
        stroke="#5B6CFF"
        strokeWidth="1.5"
        strokeOpacity="0.45"
        fill="none"
        strokeDasharray="5 3"
        markerEnd={`url(#${markerId})`}
        style={{ pointerEvents: "none" }}
      />

      {/* Delete button – appears on hover */}
      <g
        transform={`translate(${mx}, ${my})`}
        style={{ pointerEvents: "all", cursor: "pointer" }}
        className="opacity-0 group-hover/edge:opacity-100 transition-opacity"
        onClick={() => onDelete(edgeId)}
      >
        <circle r="9" fill="hsl(var(--card))" stroke="var(--border)" strokeWidth="1" />
        {/* × icon */}
        <line x1="-4" y1="-4" x2="4" y2="4" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="-4" x2="-4" y2="4" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

// ── Live preview line while dragging ─────────────────────────────────────────
interface PreviewLineProps {
  x1: number; y1: number;
  x2: number; y2: number;
}

export function PreviewEdge({ x1, y1, x2, y2 }: PreviewLineProps) {
  const midY = (y1 + y2) / 2;
  const d = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
  return (
    <path
      d={d}
      stroke="#5B6CFF"
      strokeWidth="2"
      strokeOpacity="0.6"
      fill="none"
      strokeDasharray="6 3"
    />
  );
}
