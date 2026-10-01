"use client";

import React from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  FileCode,
  Layers,
  Sparkles,
  Map,
  WrapText,
  Copy,
  Check,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActiveCodeTab, DomOutlineItem } from "./vscode-studio-types";

interface VscodeEditorPaneProps {
  fileName?: string;
  activeTab: ActiveCodeTab;
  onSelectCodeTab: (tab: ActiveCodeTab) => void;
  customCss: string;
  htmlCode: string;
  onChangeHtml: (code: string) => void;
  onChangeCss: (css: string) => void;
  onFormatCode: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  isCopied: boolean;
  onCopyCode: () => void;
  onDownloadFile: () => void;
  domOutline: DomOutlineItem[];
  fontSize: number;
  onMountEditor: OnMount;
  splitRatio?: number;
  viewMode: "split" | "code" | "preview";
}

export const VscodeEditorPane: React.FC<VscodeEditorPaneProps> = ({
  fileName,
  activeTab,
  onSelectCodeTab,
  customCss,
  htmlCode,
  onChangeHtml,
  onChangeCss,
  onFormatCode,
  showMinimap,
  onToggleMinimap,
  wordWrap,
  onToggleWordWrap,
  isCopied,
  onCopyCode,
  onDownloadFile,
  domOutline,
  fontSize,
  onMountEditor,
  splitRatio = 50,
  viewMode,
}) => {
  if (viewMode === "preview") return null;

  return (
    <div
      className="flex flex-col bg-[#1e1e1e] border-r border-[#2b2b2b] overflow-hidden relative"
      style={{
        width: viewMode === "split" ? `${splitRatio}%` : "100%",
      }}
    >
      {/* Editor Tab Bar */}
      <div className="h-9 bg-[#252526] border-b border-[#2b2b2b] flex items-center justify-between px-2 shrink-0 select-none">
        {/* File Tabs */}
        <div className="flex items-center h-full">
          {/* index.html Tab */}
          <button
            type="button"
            onClick={() => onSelectCodeTab("html")}
            className={cn(
              "h-full px-3.5 flex items-center gap-2 text-xs border-r border-[#2b2b2b] transition-all relative font-mono",
              activeTab === "html"
                ? "bg-[#1e1e1e] text-white font-medium before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#007acc]"
                : "text-[#969696] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
            )}
          >
            <FileCode className="h-3.5 w-3.5 text-[#e34c26]" />
            <span>{fileName || "index.html"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#007acc]" />
          </button>

          {/* styles.css Tab */}
          <button
            type="button"
            onClick={() => onSelectCodeTab("css")}
            className={cn(
              "h-full px-3.5 flex items-center gap-2 text-xs border-r border-[#2b2b2b] transition-all relative font-mono",
              activeTab === "css"
                ? "bg-[#1e1e1e] text-white font-medium before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#007acc]"
                : "text-[#969696] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
            )}
          >
            <Layers className="h-3.5 w-3.5 text-[#264de4]" />
            <span>styles.css</span>
            {customCss.trim() && (
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            )}
          </button>
        </div>

        {/* Editor Right Toolbar Action Icons */}
        <div className="flex items-center gap-1">
          {/* Format with Monaco / Prettier */}
          <button
            type="button"
            onClick={onFormatCode}
            className="p-1 rounded text-[#858585] hover:text-white hover:bg-[#333333] transition-colors"
            title="Format Document (Shift+Alt+F)"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </button>

          {/* Minimap toggle */}
          <button
            type="button"
            onClick={onToggleMinimap}
            className={cn(
              "p-1 rounded transition-colors",
              showMinimap
                ? "text-[#007acc] bg-[#007acc]/20"
                : "text-[#858585] hover:text-white hover:bg-[#333333]"
            )}
            title={showMinimap ? "Minimap: Visible" : "Minimap: Hidden"}
          >
            <Map className="h-3.5 w-3.5" />
          </button>

          {/* Word wrap toggle */}
          <button
            type="button"
            onClick={onToggleWordWrap}
            className={cn(
              "p-1 rounded transition-colors",
              wordWrap
                ? "text-[#007acc] bg-[#007acc]/20"
                : "text-[#858585] hover:text-white hover:bg-[#333333]"
            )}
            title={wordWrap ? "Word Wrap: On (Alt+Z)" : "Word Wrap: Off (Alt+Z)"}
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={onCopyCode}
            className="p-1 rounded text-[#858585] hover:text-white hover:bg-[#333333] transition-colors"
            title="Copy Code"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={onDownloadFile}
            className="p-1 rounded text-[#858585] hover:text-white hover:bg-[#333333] transition-colors"
            title="Export File"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="h-6 bg-[#1e1e1e] border-b border-[#2b2b2b] px-3 flex items-center gap-1.5 text-[11px] text-[#858585] font-mono select-none">
        <span>thrico</span>
        <ChevronRight className="h-3 w-3" />
        <span>src</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#cccccc]">
          {activeTab === "html" ? fileName || "index.html" : "styles.css"}
        </span>
        {domOutline.length > 0 && activeTab === "html" && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#569cd6]">
              &lt;{domOutline[0]?.tag || "section"}&gt;
            </span>
          </>
        )}
      </div>

      {/* Real Microsoft Monaco Editor */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          width="100%"
          language={activeTab === "html" ? "html" : "css"}
          theme="vs-dark"
          value={activeTab === "html" ? htmlCode : customCss}
          onChange={(value) => {
            const nextVal = value ?? "";
            if (activeTab === "html") {
              onChangeHtml(nextVal);
            } else {
              onChangeCss(nextVal);
            }
          }}
          onMount={onMountEditor}
          loading={
            <div className="flex items-center justify-center h-full text-[#858585] text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#007acc]" />
              <span>Loading Monaco Editor...</span>
            </div>
          }
          options={{
            fontSize: fontSize,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace",
            wordWrap: wordWrap ? "on" : "off",
            minimap: { enabled: showMinimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            renderLineHighlight: "all",
            padding: { top: 10, bottom: 10 },
            bracketPairColorization: { enabled: true },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
};
