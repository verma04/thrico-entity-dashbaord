"use client";

import React, { useState, useEffect } from "react";
import {
  Search, GripVertical, Play, Zap, GitBranch, Clock,
  Mail, Bell, Tag, ChevronRight, Cpu, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DragBlock, BLOCK_MODULES, COMMON_BLOCKS, SMART_SUGGESTIONS,
  MODULE_BLOCKS, MODULE_COLORS, CampaignModule, Block,
} from "./types";

interface BlockLibraryProps {
  onDragStart: (block: DragBlock) => void;
  module?: CampaignModule | "";
}

// Tab definition
type LibTab = "triggers" | "actions" | "logic";
const TABS: { key: LibTab; label: string; icon: React.ReactNode }[] = [
  { key: "triggers", label: "Triggers", icon: <Play size={11} /> },
  { key: "actions",  label: "Actions",  icon: <Zap size={11} /> },
  { key: "logic",    label: "Logic",    icon: <GitBranch size={11} /> },
];

// Module key → label lookup (same direction as before)
const MODULE_KEY_TO_LABEL: Record<string, string> = {
  communities: "Communities",
  events:      "Events",
  shop:        "Shop",
  jobs:        "Jobs",
  listings:    "Listings",
  surveys:     "Surveys",
  users:       "Users",
};

// Common logic blocks (tab 3)
const LOGIC_BLOCKS = [
  { key: "condition", label: "Condition (AND / OR)", type: "condition" as const, icon: <GitBranch size={13} />, desc: "Branch the flow based on user data" },
  { key: "delay",     label: "Delay (Wait)",         type: "delay"     as const, icon: <Clock size={13} />,    desc: "Pause before the next step" },
];

// Module-specific smart suggestions
const MODULE_SUGGESTIONS: Record<string, string[]> = {
  Communities: ["Send welcome email when user joins", "Re-engage users who left", "Celebrate member milestones"],
  Events:      ["Send reminder 1 day before event", "Follow up with survey after attendance", "Alert waitlisted users"],
  Shop:        ["Send order confirmation on purchase", "Recover abandoned carts", "Request review 3 days post-delivery"],
  Jobs:        ["Alert recruiter on new applicant", "Send job match alert to candidates", "Follow up after shortlisting"],
  Listings:    ["Notify seller when listing hits 10 views", "Remind seller before expiry", "Auto-reply to inquiries"],
  Users:       ["Happy birthday email to members", "Onboarding series for new signups", "Re-engage members with low login streak"],
};

// ─── Drag block card ──────────────────────────────────────────────────────────
function BlockCard({
  block, color, onDragStart,
}: {
  block: { key: string; label: string; icon: React.ReactNode; type: string };
  color: string;
  onDragStart: (b: DragBlock) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart({ key: block.key, label: block.label, type: block.type as any })}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group border border-transparent hover:border-slate-200"
    >
      <span style={{ color }} className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
        {block.icon}
      </span>
      <span className="text-[11.5px] text-slate-500 group-hover:text-slate-800 transition-colors flex-1 leading-tight">
        {block.label}
      </span>
      <GripVertical size={11} className="text-slate-200 group-hover:text-slate-400 shrink-0" />
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHead({
  label, color, count, pinned,
}: {
  label: string; color?: string; count?: number; pinned?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-1 pt-3 pb-1.5">
      {pinned && <Sparkles size={10} style={{ color }} className="shrink-0" />}
      <span
        className="text-[10px] font-bold uppercase tracking-wider leading-none"
        style={{ color: pinned ? color : "#94a3b8" }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[9px] text-slate-400 font-medium ml-0.5">({count})</span>
      )}
      {!pinned && <div className="flex-1 h-px bg-slate-100 ml-1" />}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function BlockLibrary({ onDragStart, module }: BlockLibraryProps) {
  const [tab, setTab]       = useState<LibTab>("triggers");
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const activeColor     = module ? MODULE_COLORS[module] : "#5B6CFF";
  const activeBlocks    = module ? (MODULE_BLOCKS[module] ?? []) : [];
  const activeTriggers  = activeBlocks.filter((b) => b.type === "trigger");
  const activeActions   = activeBlocks.filter((b) => b.type === "action");

  // Reset to Triggers tab when module changes
  useEffect(() => { setTab("triggers"); }, [module]);

  const q = search.toLowerCase();
  const flt = (label: string) => !q || label.toLowerCase().includes(q);
  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  // ── Triggers tab ─────────────────────────────────────────────────────────
  const renderTriggersTab = () => (
    <div className="space-y-0.5">
      {/* Active module triggers */}
      {module && activeTriggers.filter((b) => flt(b.label)).length > 0 && (
        <>
          <SectionHead
            label={module}
            color={activeColor}
            count={activeTriggers.filter((b) => flt(b.label)).length}
            pinned
          />
          {activeTriggers.filter((b) => flt(b.label)).map((b) => (
            <BlockCard key={b.key} block={b} color={activeColor} onDragStart={onDragStart} />
          ))}
        </>
      )}

      {/* Other modules (collapsible) */}
      {BLOCK_MODULES
        .filter((m) => !module || MODULE_KEY_TO_LABEL[m.key] !== module)
        .map((mod) => {
          const blocks = mod.blocks.filter((b) => flt(b.label));
          if (q && blocks.length === 0) return null;
          const isCollapsed = collapsed[`trig-${mod.key}`] ?? true; // default collapsed
          return (
            <div key={mod.key}>
              <button
                onClick={() => toggle(`trig-${mod.key}`)}
                className="w-full flex items-center gap-2 px-1 pt-2 pb-1 group"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 flex-1 text-left">
                  {mod.label}
                </span>
                <span className="text-[9px] text-slate-300">({mod.blocks.length})</span>
                <ChevronRight size={10} className={cn("text-slate-300 transition-transform", !isCollapsed && "rotate-90")} />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {(q ? blocks : mod.blocks).map((b) => (
                    <BlockCard key={b.key} block={b} color={mod.color} onDragStart={onDragStart} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );

  // ── Actions tab ──────────────────────────────────────────────────────────
  const renderActionsTab = () => {
    // Combined common actions
    const commonActions = COMMON_BLOCKS.filter((b) => b.type === "action" && flt(b.label));
    const filteredActive = activeActions.filter((b) => flt(b.label));
    return (
      <div className="space-y-0.5">
        {/* Active module actions */}
        {module && filteredActive.length > 0 && (
          <>
            <SectionHead label={module} color={activeColor} count={filteredActive.length} pinned />
            {filteredActive.map((b) => (
              <BlockCard key={b.key} block={b} color={activeColor} onDragStart={onDragStart} />
            ))}
          </>
        )}

        {/* Common email/notification actions */}
        {commonActions.length > 0 && (
          <>
            <SectionHead label="General" />
            {commonActions.map((b) => {
              const colors: Record<string, string> = {
                "send-email-action": "#5B6CFF",
                "send-notification": "#F59E0B",
                "add-tag":           "#10B981",
              };
              return (
                <BlockCard key={b.key} block={b} color={colors[b.key] ?? "#5B6CFF"} onDragStart={onDragStart} />
              );
            })}
          </>
        )}
      </div>
    );
  };

  // ── Logic tab ────────────────────────────────────────────────────────────
  const renderLogicTab = () => (
    <div className="space-y-2">
      {LOGIC_BLOCKS.filter((b) => flt(b.label)).map((b) => (
        <div
          key={b.key}
          draggable
          onDragStart={() => onDragStart({ key: b.key, label: b.label, type: b.type })}
          className={cn(
            "flex items-start gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all group",
            b.type === "condition"
              ? "border-amber-200 bg-amber-50 hover:bg-amber-100/60 hover:border-amber-300"
              : "border-purple-200 bg-purple-50 hover:bg-purple-100/60 hover:border-purple-300",
          )}
        >
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
            b.type === "condition" ? "bg-amber-100 text-amber-600" : "bg-purple-100 text-purple-600",
          )}>
            {b.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[12px] font-semibold leading-tight",
              b.type === "condition" ? "text-amber-800" : "text-purple-800",
            )}>
              {b.label}
            </p>
            <p className={cn(
              "text-[11px] mt-0.5 leading-tight",
              b.type === "condition" ? "text-amber-600" : "text-purple-600",
            )}>
              {b.desc}
            </p>
          </div>
          <GripVertical size={12} className={cn(
            "shrink-0 mt-1 opacity-40 group-hover:opacity-70 transition-opacity",
            b.type === "condition" ? "text-amber-500" : "text-purple-500",
          )} />
        </div>
      ))}

      <div className="px-1 pt-2">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Drag <span className="font-semibold text-amber-600">Condition</span> or{" "}
          <span className="font-semibold text-purple-600">Delay</span> between any two nodes to add branching or timing logic.
        </p>
      </div>
    </div>
  );

  // ── Suggestions (shown when no search) ───────────────────────────────────
  const suggestions = module && MODULE_SUGGESTIONS[module]
    ? MODULE_SUGGESTIONS[module]
    : SMART_SUGGESTIONS.map((s) => s.label);

  return (
    <div className="w-[248px] border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden shrink-0">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-0 border-b border-slate-200 shrink-0">
        {/* Module banner */}
        {module ? (
          <div
            className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: `${activeColor}10`, border: `1px solid ${activeColor}28` }}
          >
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: activeColor }} />
            <p className="text-[11px] font-bold leading-none" style={{ color: activeColor }}>
              {module}
            </p>
            <span className="text-[9px] text-slate-400 ml-auto font-medium">Module</span>
          </div>
        ) : (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Block Library</p>
        )}

        {/* Search */}
        <div className="relative mb-3">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks…"
            className="w-full bg-white border border-slate-200 rounded-lg text-[12px] text-slate-700 pl-8 pr-3 py-2 focus:outline-none focus:border-[#5B6CFF]/50 placeholder-slate-400"
          />
        </div>

        {/* Tab bar */}
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold border-b-2 transition-all",
                tab === t.key
                  ? "border-[#5B6CFF] text-[#5B6CFF]"
                  : "border-transparent text-slate-400 hover:text-slate-600",
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {tab === "triggers" && renderTriggersTab()}
        {tab === "actions"  && renderActionsTab()}
        {tab === "logic"    && renderLogicTab()}

        {/* Smart suggestions — only on Triggers tab with no search */}
        {tab === "triggers" && !q && (
          <div
            className="mt-3 rounded-xl overflow-hidden border"
            style={{ borderColor: `${activeColor}22`, backgroundColor: `${activeColor}07` }}
          >
            <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
              <Cpu size={11} style={{ color: activeColor }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: activeColor }}>
                {module ? `${module} Ideas` : "Suggestions"}
              </p>
            </div>
            {suggestions.map((label, i) => (
              <button
                key={i}
                className="w-full text-left text-[11px] text-slate-500 hover:text-slate-700 px-3 py-1.5 flex items-start gap-2 transition-colors hover:bg-black/5"
              >
                <Zap size={10} className="mt-0.5 shrink-0" style={{ color: activeColor }} />
                {label}
              </button>
            ))}
            <div className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
}
