"use client";

import React from "react";
import { Radio, AlertCircle, AlertTriangle, Check, Keyboard } from "lucide-react";
import { ActiveCodeTab } from "./vscode-studio-types";

interface VscodeStatusBarProps {
  onSyncServer: () => void;
  problemsCount: number;
  onOpenProblems: () => void;
  cursorPos: { line: number; col: number };
  activeTab: ActiveCodeTab;
  onToggleActiveTab: () => void;
  onFormatCode: () => void;
  onOpenShortcuts: () => void;
}

export const VscodeStatusBar: React.FC<VscodeStatusBarProps> = ({
  onSyncServer,
  problemsCount,
  onOpenProblems,
  cursorPos,
  activeTab,
  onToggleActiveTab,
  onFormatCode,
  onOpenShortcuts,
}) => {
  return (
    <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-mono select-none shrink-0 z-30">
      {/* Left Side Info */}
      <div className="flex items-center gap-3">
        {/* Live Server Port */}
        <button
          type="button"
          onClick={onSyncServer}
          className="flex items-center gap-1 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
          title="Live Server Port: 5500 (Click to re-sync)"
        >
          <Radio className="h-3 w-3 animate-pulse text-emerald-300" />
          <span>Port: 5500</span>
        </button>

        {/* Git Branch */}
        <span className="flex items-center gap-1 opacity-90">
          <span>git(main*)</span>
        </span>

        {/* Problems Counter */}
        <button
          type="button"
          onClick={onOpenProblems}
          className="flex items-center gap-1.5 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
          title="Problems in document"
        >
          <AlertCircle className="h-3 w-3" />
          <span>0</span>
          <AlertTriangle className="h-3 w-3" />
          <span>{problemsCount}</span>
        </button>
      </div>

      {/* Right Side Info */}
      <div className="flex items-center gap-3">
        <span>
          Ln {cursorPos.line}, Col {cursorPos.col}
        </span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>CRLF</span>
        <button
          type="button"
          onClick={onToggleActiveTab}
          className="hover:underline font-semibold"
        >
          {activeTab === "html" ? "HTML5" : "CSS3"}
        </button>
        <button
          type="button"
          onClick={onFormatCode}
          className="flex items-center gap-1 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
          title="Monaco Prettier Formatter"
        >
          <Check className="h-3 w-3 text-emerald-300" />
          <span>Prettier</span>
        </button>
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="hover:bg-white/20 p-0.5 rounded transition-colors"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="h-3 w-3" />
        </button>
      </div>
    </footer>
  );
};
