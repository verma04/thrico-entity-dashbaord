"use client";

import React from "react";
import {
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Grid,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HtmlPreviewRenderer,
  PreviewDevice,
  PreviewBg,
} from "../html-preview-renderer";

interface VscodePreviewPaneProps {
  fileName?: string;
  htmlCode: string;
  customCss: string;
  renderMode: "direct" | "iframe";
  previewDevice: PreviewDevice;
  onSetPreviewDevice: (device: PreviewDevice) => void;
  previewBg: PreviewBg;
  onSetPreviewBg: (bg: PreviewBg) => void;
  refreshKey: number;
  onReloadPreview: () => void;
  showDevTools: boolean;
  onToggleDevTools: () => void;
  viewMode: "split" | "code" | "preview";
  splitRatio?: number;
}

export const VscodePreviewPane: React.FC<VscodePreviewPaneProps> = ({
  fileName,
  htmlCode,
  customCss,
  renderMode,
  previewDevice,
  onSetPreviewDevice,
  previewBg,
  onSetPreviewBg,
  refreshKey,
  onReloadPreview,
  showDevTools,
  onToggleDevTools,
  viewMode,
  splitRatio = 50,
}) => {
  if (viewMode === "code") return null;

  return (
    <div
      className="flex flex-col bg-[#181818] overflow-hidden relative"
      style={{
        width: viewMode === "split" ? `${100 - splitRatio}%` : "100%",
      }}
    >
      {/* Live Preview Tab Header */}
      <div className="h-9 bg-[#252526] border-b border-[#2b2b2b] flex items-center justify-between px-3 shrink-0 select-none">
        {/* Tab Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-white font-medium">
            <Eye className="h-3.5 w-3.5 text-[#007acc]" />
            <span>Preview {fileName || "index.html"}</span>
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] text-emerald-400 font-semibold tracking-wider uppercase ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Preview Actions */}
        <div className="flex items-center gap-1.5">
          {/* External Browser Window */}
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
            }}
            className="p-1 rounded text-[#858585] hover:text-white hover:bg-[#333333] transition-colors"
            title="Open Preview in External Browser"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* VS Code Browser Navigation & Address Bar */}
      <div className="h-10 bg-[#1e1e1e] border-b border-[#2b2b2b] px-3 flex items-center justify-between gap-2 shrink-0 select-none text-xs">
        {/* Back / Forward / Refresh */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="p-1 rounded text-[#555555] hover:text-[#888888] cursor-not-allowed"
            title="Back"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded text-[#555555] hover:text-[#888888] cursor-not-allowed"
            title="Forward"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onReloadPreview}
            className="p-1 rounded text-[#aaaaaa] hover:text-white hover:bg-[#333333] transition-colors"
            title="Reload Live Server (Port 5500)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Integrated Address Bar */}
        <div className="flex-1 max-w-xl flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#333333] border border-[#3c3c3c] rounded px-2.5 py-1 text-[11px] font-mono transition-colors">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-[#858585] shrink-0">http://127.0.0.1:5500/</span>
          <span className="text-white truncate">
            {fileName || "index.html"}
          </span>
          <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-[#1e1e1e] text-[#aaaaaa] shrink-0">
            Port: 5500
          </span>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 shrink-0 bg-[#2d2d2d] p-0.5 rounded border border-[#3c3c3c]">
          <button
            type="button"
            onClick={() => onSetPreviewDevice("desktop")}
            className={cn(
              "p-1 rounded transition-colors",
              previewDevice === "desktop"
                ? "bg-[#007acc] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Desktop (100% Responsive)"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetPreviewDevice("tablet")}
            className={cn(
              "p-1 rounded transition-colors",
              previewDevice === "tablet"
                ? "bg-[#007acc] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Tablet (iPad 768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetPreviewDevice("mobile")}
            className={cn(
              "p-1 rounded transition-colors",
              previewDevice === "mobile"
                ? "bg-[#007acc] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Mobile (iPhone 375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Background Theme Switcher */}
        <div className="flex items-center gap-1 shrink-0 bg-[#2d2d2d] p-0.5 rounded border border-[#3c3c3c]">
          <button
            type="button"
            onClick={() => onSetPreviewBg("light")}
            className={cn(
              "p-1 rounded transition-colors",
              previewBg === "light"
                ? "bg-[#3c3c3c] text-amber-300"
                : "text-[#858585] hover:text-white"
            )}
            title="White Canvas"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetPreviewBg("dark")}
            className={cn(
              "p-1 rounded transition-colors",
              previewBg === "dark"
                ? "bg-[#3c3c3c] text-sky-300"
                : "text-[#858585] hover:text-white"
            )}
            title="Dark Canvas"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSetPreviewBg("checker")}
            className={cn(
              "p-1 rounded transition-colors",
              previewBg === "checker"
                ? "bg-[#3c3c3c] text-white"
                : "text-[#858585] hover:text-white"
            )}
            title="Transparency Checkerboard"
          >
            <Grid className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Toggle Bottom DevTools Drawer */}
        <button
          type="button"
          onClick={onToggleDevTools}
          className={cn(
            "p-1.5 rounded transition-colors",
            showDevTools
              ? "bg-[#007acc] text-white"
              : "text-[#aaaaaa] hover:text-white hover:bg-[#333333]"
          )}
          title="Toggle DevTools / Problems Drawer (⌘J)"
        >
          <Terminal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preview Canvas Area */}
      <div className="flex-1 overflow-auto p-4 flex flex-col justify-start items-center bg-[#181818]">
        <HtmlPreviewRenderer
          html={htmlCode}
          customCss={customCss}
          renderMode={renderMode}
          previewDevice={previewDevice}
          background={previewBg}
          minHeight={250}
          refreshKey={refreshKey}
          className="w-full"
        />
      </div>
    </div>
  );
};
