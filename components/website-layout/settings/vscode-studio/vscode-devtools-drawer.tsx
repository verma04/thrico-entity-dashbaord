"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  Terminal,
  FileCode,
  Sliders,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DevToolsTab,
  HtmlProblem,
  ConsoleLog,
  DomOutlineItem,
  DocStats,
} from "./vscode-studio-types";

interface VscodeDevtoolsDrawerProps {
  showDevTools: boolean;
  onClose: () => void;
  activeDevTab: DevToolsTab;
  onSelectTab: (tab: DevToolsTab) => void;
  problems: HtmlProblem[];
  onJumpToLine: (line: number) => void;
  consoleLogs: ConsoleLog[];
  onClearConsole: () => void;
  domOutline: DomOutlineItem[];
  docStats: DocStats;
}

export const VscodeDevtoolsDrawer: React.FC<VscodeDevtoolsDrawerProps> = ({
  showDevTools,
  onClose,
  activeDevTab,
  onSelectTab,
  problems,
  onJumpToLine,
  consoleLogs,
  onClearConsole,
  domOutline,
  docStats,
}) => {
  if (!showDevTools) return null;

  return (
    <div className="h-52 bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col shrink-0 overflow-hidden font-mono z-20">
      {/* DevTools Tab Bar */}
      <div className="h-8 bg-[#252526] border-b border-[#2b2b2b] px-3 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-1 h-full">
          {/* Problems Tab */}
          <button
            type="button"
            onClick={() => onSelectTab("problems")}
            className={cn(
              "h-full px-3 flex items-center gap-1.5 text-xs transition-colors relative",
              activeDevTab === "problems"
                ? "text-white font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#007acc]"
                : "text-[#858585] hover:text-[#cccccc]"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>PROBLEMS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#333333] text-[10px] text-[#aaaaaa]">
              {problems.length}
            </span>
          </button>

          {/* Console Tab */}
          <button
            type="button"
            onClick={() => onSelectTab("console")}
            className={cn(
              "h-full px-3 flex items-center gap-1.5 text-xs transition-colors relative",
              activeDevTab === "console"
                ? "text-white font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#007acc]"
                : "text-[#858585] hover:text-[#cccccc]"
            )}
          >
            <Terminal className="h-3.5 w-3.5 text-sky-400" />
            <span>OUTPUT / CONSOLE</span>
          </button>

          {/* DOM Tree Tab */}
          <button
            type="button"
            onClick={() => onSelectTab("dom")}
            className={cn(
              "h-full px-3 flex items-center gap-1.5 text-xs transition-colors relative",
              activeDevTab === "dom"
                ? "text-white font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#007acc]"
                : "text-[#858585] hover:text-[#cccccc]"
            )}
          >
            <FileCode className="h-3.5 w-3.5 text-emerald-400" />
            <span>DOM TREE</span>
          </button>

          {/* Stats Tab */}
          <button
            type="button"
            onClick={() => onSelectTab("stats")}
            className={cn(
              "h-full px-3 flex items-center gap-1.5 text-xs transition-colors relative",
              activeDevTab === "stats"
                ? "text-white font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#007acc]"
                : "text-[#858585] hover:text-[#cccccc]"
            )}
          >
            <Sliders className="h-3.5 w-3.5 text-purple-400" />
            <span>STATS</span>
          </button>
        </div>

        {/* DevTools Right Controls */}
        <div className="flex items-center gap-1">
          {activeDevTab === "console" && (
            <button
              type="button"
              onClick={onClearConsole}
              className="p-1 rounded text-[#858585] hover:text-white"
              title="Clear Console"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#858585] hover:text-white"
            title="Close Drawer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* DevTools Body */}
      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {/* PROBLEMS TAB */}
        {activeDevTab === "problems" && (
          <div className="space-y-1">
            {problems.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 py-2">
                <Check className="h-4 w-4" />
                <span>No problems have been detected in the workspace.</span>
              </div>
            ) : (
              problems.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onJumpToLine(p.line)}
                  className="w-full flex items-center justify-between p-1.5 rounded hover:bg-[#2a2d2e] text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {p.severity === "error" ? (
                      <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className="text-[#cccccc]">{p.message}</span>
                  </div>
                  <span className="text-[11px] text-[#858585] font-mono shrink-0">
                    index.html [{p.line}, 1]
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {/* CONSOLE TAB */}
        {activeDevTab === "console" && (
          <div className="space-y-1 text-[11px]">
            {consoleLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 py-0.5">
                <span className="text-[#666666] shrink-0 font-mono">
                  [{log.time}]
                </span>
                <span
                  className={cn(
                    "font-mono",
                    log.level === "info" && "text-[#9cdcfe]",
                    log.level === "success" && "text-emerald-400",
                    log.level === "warn" && "text-amber-400",
                    log.level === "error" && "text-red-400"
                  )}
                >
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* DOM TREE TAB */}
        {activeDevTab === "dom" && (
          <div className="space-y-1 text-xs">
            {domOutline.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2 rounded hover:bg-[#2a2d2e] cursor-pointer"
                onClick={() => onJumpToLine(item.line)}
              >
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[#569cd6] font-semibold">
                    &lt;{item.tag}&gt;
                  </span>
                  {item.className && (
                    <span className="text-[#9cdcfe] text-[11px]">
                      class=&quot;{item.className}&quot;
                    </span>
                  )}
                  {item.id && (
                    <span className="text-[#ce9178] text-[11px]">
                      id=&quot;{item.id}&quot;
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#858585]">
                  Line {item.line}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* STATS TAB */}
        {activeDevTab === "stats" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <span className="text-[10px] text-[#858585] block">
                Total Lines
              </span>
              <span className="text-base font-bold text-white">
                {docStats.totalLines}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <span className="text-[10px] text-[#858585] block">
                Characters
              </span>
              <span className="text-base font-bold text-white">
                {docStats.charCount}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <span className="text-[10px] text-[#858585] block">
                DOM Nodes
              </span>
              <span className="text-base font-bold text-white">
                {docStats.domNodes}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <span className="text-[10px] text-[#858585] block">
                Images / Styles
              </span>
              <span className="text-base font-bold text-white">
                {docStats.imageCount} img / {docStats.styleTags} css
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
