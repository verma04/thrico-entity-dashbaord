"use client";

import React from "react";
import {
  Code2,
  Eye,
  Columns2,
  Search,
  PanelLeft,
  PanelBottom,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewMode, SidebarTab } from "./vscode-studio-types";

interface VscodeTitlebarProps {
  fileName?: string;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  activeSidebarTab: SidebarTab;
  onToggleSidebar: () => void;
  showDevTools: boolean;
  onToggleDevTools: () => void;
  hasProblems: boolean;
  onOpenCommandPalette: () => void;
  onClose: () => void;
}

export const VscodeTitlebar: React.FC<VscodeTitlebarProps> = ({
  fileName,
  viewMode,
  onSetViewMode,
  activeSidebarTab,
  onToggleSidebar,
  showDevTools,
  onToggleDevTools,
  hasProblems,
  onOpenCommandPalette,
  onClose,
}) => {
  return (
    <header className="h-10 bg-[#181818] border-b border-[#2b2b2b] px-3 flex items-center justify-between shrink-0 gap-3 text-xs select-none">
      {/* Left: macOS Window Controls & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 transition-opacity"
            title="Close Studio (Esc)"
          />
          <button
            type="button"
            onClick={() => onSetViewMode(viewMode === "preview" ? "split" : "preview")}
            className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:opacity-80 transition-opacity"
            title="Toggle Full Preview"
          />
          <button
            type="button"
            onClick={() => onSetViewMode(viewMode === "code" ? "split" : "code")}
            className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:opacity-80 transition-opacity"
            title="Toggle Full Code"
          />
        </div>

        <div className="h-4 w-[1px] bg-[#333333] mx-1" />

        {/* VS Code Brand Badge */}
        <div className="flex items-center gap-1.5 font-medium text-[#cccccc] truncate">
          <Code2 className="h-4 w-4 text-[#007acc] shrink-0" />
          <span className="font-semibold text-white truncate">VS Code HTML Studio</span>
          <span className="text-[#858585] text-[11px] truncate hidden md:inline">
            — {fileName || "index.html"} (Monaco Powered)
          </span>
        </div>
      </div>

      {/* Center: Command Palette Search Bar (Cmd+P) */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="flex items-center justify-between gap-3 px-3 py-1 bg-[#252526] hover:bg-[#2d2d2d] border border-[#3c3c3c] hover:border-[#007acc]/60 rounded-md text-[11px] text-[#999999] hover:text-[#cccccc] transition-all w-72 md:w-96 shadow-inner"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="h-3.5 w-3.5 text-[#858585]" />
          <span className="truncate">
            thrico &gt; src &gt; {fileName || "index.html"}
          </span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[10px] text-[#aaaaaa] font-mono shrink-0">
          ⌘P
        </kbd>
      </button>

      {/* Right: Window Layout Actions */}
      <div className="flex items-center gap-1.5">
        {/* Split Mode Toggle */}
        <div className="flex items-center bg-[#252526] p-0.5 rounded border border-[#333333]">
          <button
            type="button"
            onClick={() => onSetViewMode("split")}
            className={cn(
              "p-1 rounded transition-colors text-[11px] flex items-center gap-1",
              viewMode === "split"
                ? "bg-[#007acc] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Split View (Monaco + Live Preview)"
          >
            <Columns2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode("code")}
            className={cn(
              "p-1 rounded transition-colors text-[11px] flex items-center gap-1",
              viewMode === "code"
                ? "bg-[#007acc] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Code Editor Only"
          >
            <Code2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode("preview")}
            className={cn(
              "p-1 rounded transition-colors text-[11px] flex items-center gap-1",
              viewMode === "preview"
                ? "bg-[#007acc] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Live Preview Only"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#333333] mx-0.5" />

        {/* Toggle Side Bar (Cmd+B) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={cn(
            "p-1.5 rounded transition-colors",
            activeSidebarTab
              ? "text-white bg-[#252526]"
              : "text-[#858585] hover:text-white hover:bg-[#252526]"
          )}
          title="Toggle Primary Side Bar (⌘B)"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        {/* Toggle DevTools Drawer (Cmd+J) */}
        <button
          type="button"
          onClick={onToggleDevTools}
          className={cn(
            "p-1.5 rounded transition-colors relative",
            showDevTools
              ? "text-white bg-[#252526]"
              : "text-[#858585] hover:text-white hover:bg-[#252526]"
          )}
          title="Toggle Developer Drawer (⌘J)"
        >
          <PanelBottom className="h-4 w-4" />
          {hasProblems && (
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
          )}
        </button>

        {/* Close Studio */}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded text-[#858585] hover:text-white hover:bg-[#c42b1c] transition-colors ml-1"
          title="Close Window (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
