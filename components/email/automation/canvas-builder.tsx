"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight, Users, Play, GitBranch, SlidersHorizontal,
  Zap, Clock, Link2, Pencil, Settings2, X, Mail,
  Repeat, Hash, CheckCircle, Calendar, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WorkflowNode, WorkflowEdge, DragBlock, uid,
  CampaignModule, CampaignStatus,
  CampaignFrequency, CAMPAIGN_MODULES, MODULE_COLORS, CronType,
} from "./types";
import { BlockLibrary } from "./block-library";
import { CanvasNode } from "./canvas-node";
import { EdgeLine, PreviewEdge } from "./edge-line";
import { ConfigPanel } from "./config-panel";
import { useGetEmailCampaign, useUpdateEmailCampaign } from "@/graphql/actions/email";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const NODE_W = 280;
const NODE_H = 88;

const DEFAULT_NODES: WorkflowNode[] = [
  { id: "n1", type: "trigger",   blockKey: "event-registered", label: "Event Registered",
    x: 140, y: 60,  config: { description: "User registers for any event" } },
  { id: "n2", type: "condition", blockKey: "condition",         label: "Condition",
    x: 140, y: 230, config: { description: "City = Pune AND Skills contains React" } },
  { id: "n3", type: "action",    blockKey: "send-email-action", label: "Send Email",
    x: 140, y: 400, config: { description: "Event Reminder template" } },
];
const DEFAULT_EDGES: WorkflowEdge[] = [
  { id: "e1", from: "n1", to: "n2" },
  { id: "e2", from: "n2", to: "n3" },
];

// ── Weekday / date helpers ────────────────────────────────────────────────────
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const MONTH_DATES = Array.from({ length: 28 }, (_, i) => i + 1);

interface CanvasBuilderProps {
  campaignId: string | null;
  onBack: () => void;
}

export function CanvasBuilder({ campaignId, onBack }: CanvasBuilderProps) {
  const { data, loading } = useGetEmailCampaign(campaignId || "");
  const [updateCampaign, { loading: isSaving }] = useUpdateEmailCampaign();

  const existing = data?.getEmailCampaign;
  const isEditMode = !!campaignId;

  // ── Core canvas state ─────────────────────────────────────────────────────
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState("Untitled Campaign");
  const [isEditingName, setIsEditingName] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // ── Campaign settings (lives IN the builder) ──────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [status, setStatus]       = useState<CampaignStatus>("draft");
  const [frequency, setFrequency] = useState<CampaignFrequency>("one-time");
  const [cronType, setCronType]   = useState<CronType>("weekly");
  const [cronDay, setCronDay]     = useState("MON");
  const [cronDate, setCronDate]   = useState(1);
  const [module, setModule]       = useState<CampaignModule | "">("");

  // Sync state when data loads
  useEffect(() => {
    if (existing) {
      setCampaignName(existing.name);
      setStatus(existing.status as CampaignStatus);
      setFrequency(existing.frequency as CampaignFrequency);
      setModule(existing.module as CampaignModule);
      if (existing.cronType) setCronType(existing.cronType as CronType);
      if (existing.cronDay) setCronDay(existing.cronDay);
      if (existing.cronDate) setCronDate(existing.cronDate);

      // Load nodes & edges if plural JSON strings exist
      if (existing.canvasNodes) {
        try {
          setNodes(JSON.parse(existing.canvasNodes));
        } catch (e) {
          console.error("Failed to parse canvasNodes", e);
          setNodes(DEFAULT_NODES);
        }
      } else {
        setNodes(DEFAULT_NODES);
      }

      if (existing.canvasEdges) {
        try {
          setEdges(JSON.parse(existing.canvasEdges));
        } catch (e) {
          console.error("Failed to parse canvasEdges", e);
          setEdges(DEFAULT_EDGES);
        }
      } else {
        setEdges(DEFAULT_EDGES);
      }
    } else if (!loading && !campaignId) {
      // New campaign fallback (if somehow reached without ID, though wizard creates it)
      setNodes(DEFAULT_NODES);
      setEdges(DEFAULT_EDGES);
    }
  }, [existing, loading, campaignId]);

  // ── Connection wire state ─────────────────────────────────────────────────
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [wireStart, setWireStart]   = useState<{ x: number; y: number } | null>(null);
  const [wireCursor, setWireCursor] = useState<{ x: number; y: number } | null>(null);

  const canvasRef    = useRef<HTMLDivElement>(null);
  const dragBlockRef = useRef<DragBlock | null>(null);
  const panRef       = useRef({ dragging: false, startX: 0, startY: 0, startOff: { x: 0, y: 0 } });

  const selectedNode = nodes.find((n) => n.id === selectedId);
  // When settings panel is open, close node config
  const showNodeConfig = !!selectedNode && !showSettings;

  // ── When module changes: update the first trigger node to reflect module ──
  useEffect(() => {
    if (!module) return;
    const triggerLabels: Record<string, { blockKey: string; label: string; desc: string }> = {
      Communities: { blockKey: "user-joined-community", label: "User Joined Community", desc: "Fires when a user joins any community" },
      Events:      { blockKey: "event-registered",      label: "Event Registered",      desc: "Fires when a user registers for an event" },
      Shop:        { blockKey: "product-purchased",     label: "Product Purchased",     desc: "Fires when a product is purchased" },
      Jobs:        { blockKey: "job-applied",           label: "Job Applied",           desc: "Fires when a user applies for a job" },
      Listings:    { blockKey: "listing-created",       label: "Listing Created",       desc: "Fires when a new listing is posted" },
      Users:       { blockKey: "user-registered",       label: "New Member Joined",     desc: "Fires when a new member joins the platform" },
    };
    const meta = triggerLabels[module];
    if (!meta) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === "n1"
          ? { ...n, blockKey: meta.blockKey, label: meta.label, config: { description: meta.desc } }
          : n
      )
    );
  }, [module]);

  // ── Drag from library ─────────────────────────────────────────────────────
  const handleDragStart = useCallback((block: DragBlock) => {
    dragBlockRef.current = block;
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dragBlockRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newNode: WorkflowNode = {
      id: uid(), type: dragBlockRef.current.type,
      blockKey: dragBlockRef.current.key, label: dragBlockRef.current.label,
      x: Math.max(10, e.clientX - rect.left - canvasOffset.x - NODE_W / 2),
      y: Math.max(10, e.clientY - rect.top  - canvasOffset.y - NODE_H / 2),
      config: {},
    };
    setNodes((p) => [...p, newNode]);
    setSelectedId(newNode.id);
    setShowSettings(false);
    dragBlockRef.current = null;
  }, [canvasOffset]);

  // ── Node move ─────────────────────────────────────────────────────────────
  const handleNodeDragMove = useCallback((id: string, dx: number, dy: number) => {
    setNodes((p) => p.map((n) => n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n));
  }, []);

  // ── Node / edge delete ────────────────────────────────────────────────────
  const handleDeleteNode = useCallback((id: string) => {
    setNodes((p) => p.filter((n) => n.id !== id));
    setEdges((p) => p.filter((e) => e.from !== id && e.to !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((p) => p.filter((e) => e.id !== edgeId));
  }, []);

  // ── Config update ─────────────────────────────────────────────────────────
  const handleUpdateConfig = useCallback((id: string, config: Record<string, any>) => {
    setNodes((p) => p.map((n) => n.id === id ? { ...n, config } : n));
  }, []);

  // ── Port: start connecting ────────────────────────────────────────────────
  const handlePortDragStart = useCallback((fromId: string, portX: number, portY: number) => {
    setConnectingFrom(fromId);
    setWireStart({ x: portX, y: portY });
    setWireCursor({ x: portX, y: portY });
    setSelectedId(null);
  }, []);

  // ── Port: drop on target ──────────────────────────────────────────────────
  const handlePortDrop = useCallback((toId: string) => {
    if (!connectingFrom || connectingFrom === toId) {
      setConnectingFrom(null); setWireStart(null); setWireCursor(null);
      return;
    }
    setEdges((prev) => {
      if (prev.some((e) => e.from === connectingFrom && e.to === toId)) return prev;
      return [...prev, { id: uid(), from: connectingFrom, to: toId }];
    });
    setConnectingFrom(null); setWireStart(null); setWireCursor(null);
  }, [connectingFrom]);

  // ── Track cursor while wiring ─────────────────────────────────────────────
  useEffect(() => {
    if (!connectingFrom || !canvasRef.current) return;
    const onMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      setWireCursor({ x: e.clientX - rect.left - canvasOffset.x, y: e.clientY - rect.top - canvasOffset.y });
    };
    const onUp = () => { setConnectingFrom(null); setWireStart(null); setWireCursor(null); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [connectingFrom, canvasOffset]);

  // ── Canvas pan ────────────────────────────────────────────────────────────
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (connectingFrom) return;
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    panRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startOff: canvasOffset };
    setSelectedId(null);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!panRef.current.dragging) return;
      setCanvasOffset({ x: panRef.current.startOff.x + (e.clientX - panRef.current.startX), y: panRef.current.startOff.y + (e.clientY - panRef.current.startY) });
    };
    const onUp = () => { panRef.current.dragging = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const svgW = Math.max(2000, ...nodes.map((n) => n.x + NODE_W + 100));
  const svgH = Math.max(1500, ...nodes.map((n) => n.y + NODE_H + 200));

  const handleSave = async (newStatus?: CampaignStatus) => {
    if (!campaignId) return;
    try {
      const input = {
        name: campaignName,
        status: newStatus || status,
        frequency,
        module,
        cronType,
        cronDay,
        cronDate,
        canvasNodes: JSON.stringify(nodes),
        canvasEdges: JSON.stringify(edges),
      };
      await updateCampaign({ variables: { id: campaignId, input } });
      toast.success(newStatus === "released" ? "Campaign Activated!" : "Draft Saved!");
      if (newStatus) setStatus(newStatus);
    } catch (err: any) {
      toast.error(err.message || "Failed to save campaign");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="h-8 w-8 text-[#5B6CFF] animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading campaign flow...</p>
      </div>
    );
  }

  const statusMeta: Record<CampaignStatus, { label: string; color: string; bg: string; border: string }> = {
    draft:    { label: "Draft",    color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
    released: { label: "Released", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    finished: { label: "Finished", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  };
  const sm = statusMeta[status];
  const moduleColor = module ? MODULE_COLORS[module] : "#5B6CFF";
  const selCls = "w-full bg-white border border-slate-200 rounded-xl text-[12px] text-slate-700 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/15 focus:border-[#5B6CFF]/50";

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-200 bg-white shrink-0">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-[#5B6CFF] transition-colors mr-1">
          <ChevronRight size={13} className="rotate-180" /> Campaigns
        </button>
        <div className="w-px h-4 bg-slate-200" />

        {/* Mode badge */}
        {isEditMode ? (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
            <Pencil size={11} /> Editing
          </span>
        ) : (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            New Campaign
          </span>
        )}
        <div className="w-px h-4 bg-slate-200" />

        {/* Campaign name */}
        {isEditingName ? (
          <input autoFocus value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
            className="text-[14px] font-semibold text-slate-800 bg-transparent border-b border-[#5B6CFF]/50 focus:outline-none px-1 min-w-0 max-w-[180px]" />
        ) : (
          <button onClick={() => setIsEditingName(true)}
            className="text-[14px] font-semibold text-slate-800 hover:text-[#5B6CFF] transition-colors truncate max-w-[180px]">
            {campaignName}
          </button>
        )}

        {/* Status pill */}
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold", sm.color, sm.bg, sm.border)}>
          <span className={cn("h-1.5 w-1.5 rounded-full",
            status === "released" ? "bg-emerald-500" : status === "finished" ? "bg-blue-400" : "bg-slate-400")} />
          {sm.label}
        </div>

        {/* Module pill */}
        {module && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold"
            style={{ color: moduleColor, backgroundColor: `${moduleColor}10`, borderColor: `${moduleColor}30` }}>
            {module}
          </div>
        )}

        <div className="flex-1" />

        {/* Wire hint */}
        {connectingFrom && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5B6CFF]/10 border border-[#5B6CFF]/30 text-[12px] text-[#5B6CFF] font-semibold animate-pulse">
            <Link2 size={12} /> Drop on another node to connect
          </div>
        )}

        {/* Node type counters */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
          {([
            { icon: <Play size={9} className="text-blue-500" />,    count: nodes.filter((n) => n.type === "trigger").length,   color: "text-blue-600" },
            { icon: <GitBranch size={9} className="text-amber-500" />, count: nodes.filter((n) => n.type === "condition").length, color: "text-amber-600" },
            { icon: <Zap size={9} className="text-emerald-500" />,   count: nodes.filter((n) => n.type === "action").length,    color: "text-emerald-600" },
            { icon: <Clock size={9} className="text-purple-500" />,  count: nodes.filter((n) => n.type === "delay").length,     color: "text-purple-600" },
          ] as { icon: React.ReactNode; count: number; color: string }[]).map((s, i) => (
            <span key={i} className={cn("flex items-center gap-0.5 text-[11px] font-bold", s.color, s.count === 0 ? "opacity-30" : "")}>
              {s.icon}{s.count}
            </span>
          ))}
        </div>

        {/* Live audience */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
          <Users size={12} className="text-[#5B6CFF]" />
          <span className="text-[11px] font-semibold text-slate-600"><span className="text-slate-900 font-bold">2,340</span> match</span>
        </div>

        {/* Settings button */}
        <button
          onClick={() => { setShowSettings((p) => !p); setSelectedId(null); }}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-xl border text-[12px] font-semibold transition-all",
            showSettings
              ? "bg-[#5B6CFF] border-[#5B6CFF] text-white"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
          )}
        >
          <Settings2 size={13} /> Settings
        </button>

        <button 
          onClick={() => handleSave()}
          disabled={isSaving}
          className="flex items-center gap-2 h-8 px-3 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-50 text-slate-600 text-[12px] font-semibold rounded-xl transition-all">
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : null}
          Save Draft
        </button>
        <button 
          onClick={() => handleSave("released")}
          disabled={isSaving}
          className="flex items-center gap-2 h-8 px-4 bg-[#5B6CFF] hover:bg-[#4a5ce8] disabled:opacity-50 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm shadow-[#5B6CFF]/20">
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} 
          Activate
        </button>
      </div>

      {/* ── 3-column layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <BlockLibrary onDragStart={handleDragStart} module={module} />

        {/* ── Canvas ── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-[#f7f8fc]"
          style={{ cursor: connectingFrom ? "crosshair" : "default", backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          onDrop={handleCanvasDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseDown={handleCanvasMouseDown}
        >
          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-300 mx-auto">
                  <GitBranch size={26} />
                </div>
                <div>
                  <p className="text-slate-600 text-[14px] font-semibold">Build your workflow</p>
                  <p className="text-slate-400 text-[12px] mt-1">Drag blocks from the left panel onto the canvas</p>
                </div>
              </div>
            </div>
          )}

          {/* Panned viewport */}
          <div style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`, position: "absolute", inset: 0 }}>
            <svg style={{ position: "absolute", top: 0, left: 0, width: svgW, height: svgH, overflow: "visible" }}>
              {edges.map((e) => (
                <EdgeLine key={e.id} edgeId={e.id} from={e.from} to={e.to} nodes={nodes} onDelete={handleDeleteEdge} />
              ))}
              {connectingFrom && wireStart && wireCursor && (
                <PreviewEdge x1={wireStart.x} y1={wireStart.y} x2={wireCursor.x} y2={wireCursor.y} />
              )}
            </svg>

            {nodes.map((node) => (
              <div key={node.id} data-node="true">
                <CanvasNode
                  node={node}
                  isSelected={selectedId === node.id}
                  isConnecting={!!connectingFrom}
                  isConnectTarget={!!connectingFrom && connectingFrom !== node.id}
                  onSelect={(id) => { setSelectedId(id); setShowSettings(false); }}
                  onDelete={handleDeleteNode}
                  onDragMove={handleNodeDragMove}
                  onPortDragStart={handlePortDragStart}
                  onPortDrop={handlePortDrop}
                />
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
            {["+", "−"].map((s) => (
              <button key={s} className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center justify-center transition-all hover:shadow-md">{s}</button>
            ))}
            <button onClick={() => setCanvasOffset({ x: 0, y: 0 })} title="Reset view"
              className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all hover:shadow-md">
              <SlidersHorizontal size={13} />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="text-[11px] text-slate-400 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
              {nodes.length} nodes · {edges.length} connections
            </div>
            <div className="text-[11px] text-slate-400 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#5B6CFF]" /> Drag blue dot to connect
            </div>
          </div>
        </div>

        {/* ── Right panel: Settings OR Node Config ── */}
        <AnimatePresence>

          {/* Campaign Settings Panel */}
          {showSettings && (
            <motion.div
              key="settings-panel"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 35 }}
              className="w-[300px] border-l border-slate-200 bg-white flex flex-col overflow-hidden shrink-0"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 bg-slate-50">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#5B6CFF]">
                  <Settings2 size={15} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-800">Campaign Settings</p>
                  <p className="text-[10px] text-slate-400">Status, module & schedule</p>
                </div>
                <button onClick={() => setShowSettings(false)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* ── Status ── */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Status</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["draft", "released", "finished"] as CampaignStatus[]).map((s) => {
                      const m = statusMeta[s];
                      return (
                        <button key={s} onClick={() => setStatus(s)}
                          className={cn("flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-center transition-all text-[11px] font-semibold",
                            status === s ? `${m.color} ${m.bg} ${m.border} ring-1 ring-offset-1 ring-[#5B6CFF]/20` : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
                          {s === "draft" ? <Hash size={13} /> : s === "released" ? <Play size={13} /> : <CheckCircle size={13} />}
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Module ── */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Module</label>
                  <div className="space-y-1.5">
                    {CAMPAIGN_MODULES.map((mod) => (
                      <button key={mod.value} onClick={() => setModule(mod.value)}
                        className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
                          module === mod.value ? "ring-1 ring-offset-1" : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50")}
                        style={module === mod.value ? { backgroundColor: `${mod.color}0e`, borderColor: mod.color } : {}}>
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>
                          {mod.icon}
                        </div>
                        <span className="text-[12px] font-semibold"
                          style={{ color: module === mod.value ? mod.color : "#475569" }}>
                          {mod.label}
                        </span>
                        {module === mod.value && (
                          <CheckCircle size={13} className="ml-auto shrink-0" style={{ color: mod.color }} />
                        )}
                      </button>
                    ))}
                  </div>
                  {module && (
                    <p className="text-[10px] text-[#5B6CFF] font-medium mt-2 flex items-center gap-1">
                      ✓ Condition fields now filtered for <strong>{module}</strong>
                    </p>
                  )}
                </div>

                {/* ── Frequency ── */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Frequency</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {([
                      { value: "one-time" as CampaignFrequency,  label: "One Time",  icon: <Play size={13} /> },
                      { value: "recurring" as CampaignFrequency, label: "Recurring", icon: <Repeat size={13} /> },
                    ]).map((opt) => (
                      <button key={opt.value} onClick={() => setFrequency(opt.value)}
                        className={cn("flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-semibold transition-all",
                          frequency === opt.value
                            ? "bg-indigo-50 border-[#5B6CFF] text-[#5B6CFF] ring-1 ring-[#5B6CFF]/20 ring-offset-1"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Cron options */}
                  {frequency === "recurring" && (
                    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3 space-y-3">
                      <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Schedule</label>
                      <div className="flex gap-1.5">
                        {([
                          { value: "weekly" as CronType,  label: "Weekly",  icon: <Calendar size={10} /> },
                          { value: "monthly" as CronType, label: "Monthly", icon: <Hash size={10} /> },
                          { value: "custom" as CronType,  label: "Custom",  icon: <Globe size={10} /> },
                        ]).map((t) => (
                          <button key={t.value} onClick={() => setCronType(t.value)}
                            className={cn("flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all",
                              cronType === t.value ? "bg-[#5B6CFF] border-[#5B6CFF] text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
                            {t.icon} {t.label}
                          </button>
                        ))}
                      </div>

                      {cronType === "weekly" && (
                        <div>
                          <p className="text-[10px] text-indigo-600 font-medium mb-1.5">Day of week</p>
                          <div className="flex flex-wrap gap-1">
                            {WEEKDAYS.map((d) => (
                              <button key={d} onClick={() => setCronDay(d)}
                                className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all",
                                  cronDay === d ? "bg-[#5B6CFF] border-[#5B6CFF] text-white" : "bg-white border-slate-200 text-slate-500")}>
                                {d}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-indigo-500 mt-1.5">Every {cronDay} at midnight UTC</p>
                        </div>
                      )}

                      {cronType === "monthly" && (
                        <div>
                          <p className="text-[10px] text-indigo-600 font-medium mb-1.5">Day of month</p>
                          <div className="flex flex-wrap gap-1">
                            {MONTH_DATES.map((d) => (
                              <button key={d} onClick={() => setCronDate(d)}
                                className={cn("h-6 w-6 rounded-md text-[10px] font-bold border transition-all",
                                  cronDate === d ? "bg-[#5B6CFF] border-[#5B6CFF] text-white" : "bg-white border-slate-200 text-slate-500")}>
                                {d}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-indigo-500 mt-1.5">Day {cronDate} of each month</p>
                        </div>
                      )}

                      {cronType === "custom" && (
                        <div>
                          <p className="text-[10px] text-indigo-600 font-medium mb-1.5">Cron expression</p>
                          <input className="w-full font-mono bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 px-2.5 py-2 focus:outline-none focus:border-[#5B6CFF]/50"
                            placeholder="0 9 * * 1" />
                          <p className="text-[10px] text-slate-400 mt-1">min · hour · day · month · weekday</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Channel ── */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Channel Type</label>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#5B6CFF] bg-indigo-50 text-[#5B6CFF] text-[12px] font-bold">
                    <Mail size={14} /> Email
                    <CheckCircle size={13} className="ml-auto text-[#5B6CFF]" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">More channels coming soon.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100">
                <button onClick={() => setShowSettings(false)}
                  className="w-full h-9 bg-[#5B6CFF] hover:bg-[#4a5ce8] text-white text-[12px] font-bold rounded-xl transition-all">
                  Apply Settings
                </button>
              </div>
            </motion.div>
          )}

          {/* Node Config Panel */}
          {showNodeConfig && (
            <ConfigPanel
              key={selectedNode!.id}
              node={selectedNode!}
              module={module}
              onUpdate={handleUpdateConfig}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
