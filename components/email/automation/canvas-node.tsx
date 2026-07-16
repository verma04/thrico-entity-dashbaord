"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowNode, NODE_STYLES, NODE_ICONS } from "./types";

interface CanvasNodeProps {
  node: WorkflowNode;
  isSelected: boolean;
  isConnecting: boolean; // are we in "draw wire" mode?
  isConnectTarget: boolean; // is this node a valid connection target?
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragMove: (id: string, dx: number, dy: number) => void;
  /** Called when user starts dragging from the output port */
  onPortDragStart: (fromId: string, portX: number, portY: number) => void;
  /** Called when user drops onto the input port of this node */
  onPortDrop: (toId: string) => void;
}

const NODE_W = 280;

export function CanvasNode({
  node,
  isSelected,
  isConnecting,
  isConnectTarget,
  onSelect,
  onDelete,
  onDragMove,
  onPortDragStart,
  onPortDrop,
}: CanvasNodeProps) {
  const s = NODE_STYLES[node.type];
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // ── Node drag (move) ───────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start a node-move if clicking a port
    if ((e.target as HTMLElement).closest("[data-port]")) return;
    e.stopPropagation();
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      onDragMove(
        node.id,
        ev.clientX - last.current.x,
        ev.clientY - last.current.y,
      );
      last.current = { x: ev.clientX, y: ev.clientY };
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Output port (bottom) drag start ───────────────────────────────────────
  const handleOutputPortMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Port center in canvas-local coords
    const portX = node.x + NODE_W / 2;
    const portY = node.y + 88; // approx node height
    onPortDragStart(node.id, portX, portY);
  };

  // ── Input port (top) mouse-up = complete connection ────────────────────────
  const handleInputPortMouseUp = (e: React.MouseEvent) => {
    if (!isConnecting) return;
    e.stopPropagation();
    onPortDrop(node.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: NODE_W,
        cursor: "grab",
        zIndex: isSelected ? 10 : 1,
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      {/* ── Input port (top centre) ── */}
      <div
        data-port="input"
        onMouseUp={handleInputPortMouseUp}
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: isConnectTarget ? "#5B6CFF" : "white",
          border: `2px solid ${isConnectTarget ? "#5B6CFF" : "var(--border)"}`,
          cursor: isConnecting ? "crosshair" : "default",
          zIndex: 20,
          transition: "all 0.15s",
          boxShadow: isConnectTarget ? "0 0 0 4px #5B6CFF22" : undefined,
        }}
        title="Drop here to connect"
      />

      {/* ── Card ── */}
      <div
        className={cn(
          " border shadow-sm transition-all duration-200 select-none overflow-visible",
          s.bg,
          s.border,
          isSelected
            ? "ring-2 ring-[#5B6CFF] ring-offset-1 shadow-lg shadow-[#5B6CFF]/10"
            : isConnectTarget
              ? "ring-2 ring-[#5B6CFF]/60 ring-offset-1"
              : "hover:shadow-md",
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center gap-2.5 px-3 py-2", s.headerBg)}>
          <span
            className={cn(
              "text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1",
              s.badgeBg,
              s.badgeText,
            )}
          >
            {NODE_ICONS[node.type]}
            {s.badgeLabel}
          </span>
          <div className="flex-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X size={11} />
          </button>
        </div>

        {/* Body */}
        <div className="px-3 py-3 flex items-center gap-3 bg-card">
          <div
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
              s.iconBg,
            )}
          >
            <span className={s.iconColor}>{NODE_ICONS[node.type]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
              {node.label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {node.config?.description || "Click to configure"}
            </p>
          </div>
          <GripVertical size={13} className="text-muted-foreground shrink-0" />
        </div>

        {/* Bottom: output port */}
        <div className="flex justify-center py-2 bg-card relative">
          <div
            data-port="output"
            onMouseDown={handleOutputPortMouseDown}
            title="Drag to connect to another node"
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#5B6CFF",
              border: "2.5px solid white",
              cursor: "crosshair",
              boxShadow: "0 0 0 1.5px #5B6CFF88",
              zIndex: 20,
              position: "relative",
              transition: "transform 0.15s",
            }}
            className="hover:scale-125"
          />
        </div>
      </div>
    </motion.div>
  );
}
