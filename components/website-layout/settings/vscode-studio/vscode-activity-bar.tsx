"use client";

import React from "react";
import {
  FileCode,
  Search,
  ImageIcon,
  Sparkles,
  Settings2,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTab } from "./vscode-studio-types";

interface VscodeActivityBarProps {
  activeSidebarTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  uploadedCount: number;
  onOpenShortcuts: () => void;
}

export const VscodeActivityBar: React.FC<VscodeActivityBarProps> = ({
  activeSidebarTab,
  onSelectTab,
  uploadedCount,
  onOpenShortcuts,
}) => {
  const toggleTab = (tab: SidebarTab) => {
    onSelectTab(activeSidebarTab === tab ? null : tab);
  };

  return (
    <aside className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 shrink-0 z-30 select-none">
      {/* Top Navigation Rail Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Explorer */}
        <button
          type="button"
          onClick={() => toggleTab("explorer")}
          className={cn(
            "w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors relative",
            activeSidebarTab === "explorer" &&
              "text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#007acc]"
          )}
          title="Explorer (Files, Templates, Outline)"
        >
          <FileCode className="h-5 w-5" />
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={() => toggleTab("search")}
          className={cn(
            "w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors relative",
            activeSidebarTab === "search" &&
              "text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#007acc]"
          )}
          title="Search and Replace"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Media Assets Library */}
        <button
          type="button"
          onClick={() => toggleTab("media")}
          className={cn(
            "w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors relative",
            activeSidebarTab === "media" &&
              "text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#007acc]"
          )}
          title="Media Assets & CDN Upload"
        >
          <ImageIcon className="h-5 w-5" />
          {uploadedCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Snippets */}
        <button
          type="button"
          onClick={() => toggleTab("snippets")}
          className={cn(
            "w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors relative",
            activeSidebarTab === "snippets" &&
              "text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#007acc]"
          )}
          title="HTML Component Snippets"
        >
          <Sparkles className="h-5 w-5" />
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={() => toggleTab("settings")}
          className={cn(
            "w-full h-11 flex items-center justify-center text-[#858585] hover:text-white transition-colors relative",
            activeSidebarTab === "settings" &&
              "text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#007acc]"
          )}
          title="Monaco Editor & Render Settings"
        >
          <Settings2 className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Icons: Shortcuts */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="w-full h-10 flex items-center justify-center text-[#858585] hover:text-white transition-colors"
          title="Keyboard Shortcuts Cheat Sheet"
        >
          <Keyboard className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};
