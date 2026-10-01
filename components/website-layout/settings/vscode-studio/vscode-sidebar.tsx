"use client";

import React, { useRef, useState } from "react";
import {
  FileCode,
  Layers,
  ChevronDown,
  X,
  CornerDownLeft,
  Loader2,
  ImagePlus,
  ImageIcon,
  Check,
  Link2,
  Code2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SidebarTab,
  ActiveCodeTab,
  StarterTemplate,
  DomOutlineItem,
  UploadedImage,
  HtmlSnippet,
} from "./vscode-studio-types";
import { HTML_SNIPPETS } from "../html-editor-utils";

interface VscodeSidebarProps {
  activeSidebarTab: SidebarTab;
  onCloseSidebar: () => void;
  fileName?: string;
  activeTab: ActiveCodeTab;
  onSelectCodeTab: (tab: ActiveCodeTab) => void;
  customCss: string;
  starterTemplates: StarterTemplate[];
  onApplyTemplate: (template: StarterTemplate) => void;
  domOutline: DomOutlineItem[];
  onJumpToLine: (line: number) => void;
  currentCode: string;
  onReplaceAllText: (search: string, replace: string) => void;
  uploadedImages: UploadedImage[];
  isUploadingImage: boolean;
  onUploadImageFile: (file: File) => void;
  onInsertImageTag: (url: string) => void;
  onCopyImageUrl: (url: string) => void;
  onRemoveUploadedImage: (index: number) => void;
  copiedUrl: string | null;
  onInsertSnippet: (snippet: HtmlSnippet) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  renderMode: "direct" | "iframe";
  onChangeRenderMode: (mode: "direct" | "iframe") => void;
}

export const VscodeSidebar: React.FC<VscodeSidebarProps> = ({
  activeSidebarTab,
  onCloseSidebar,
  fileName,
  activeTab,
  onSelectCodeTab,
  customCss,
  starterTemplates,
  onApplyTemplate,
  domOutline,
  onJumpToLine,
  currentCode,
  onReplaceAllText,
  uploadedImages,
  isUploadingImage,
  onUploadImageFile,
  onInsertImageTag,
  onCopyImageUrl,
  onRemoveUploadedImage,
  copiedUrl,
  onInsertSnippet,
  fontSize,
  onChangeFontSize,
  wordWrap,
  onToggleWordWrap,
  showMinimap,
  onToggleMinimap,
  renderMode,
  onChangeRenderMode,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");

  if (!activeSidebarTab) return null;

  return (
    <aside className="w-64 bg-[#252526] border-r border-[#2b2b2b] flex flex-col shrink-0 overflow-hidden z-20 select-none">
      {/* Side Bar Header */}
      <div className="h-9 px-3 border-b border-[#2b2b2b] flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#bbbbbb]">
        <span>
          {activeSidebarTab === "explorer" && "Explorer"}
          {activeSidebarTab === "search" && "Search & Replace"}
          {activeSidebarTab === "media" && "CDN Media Library"}
          {activeSidebarTab === "snippets" && "HTML Snippets"}
          {activeSidebarTab === "settings" && "Editor Settings"}
        </span>
        <button
          type="button"
          onClick={onCloseSidebar}
          className="text-[#858585] hover:text-white p-0.5 rounded transition-colors"
          title="Close Side Bar (⌘B)"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Side Bar Content Panes */}
      <div className="flex-1 overflow-y-auto text-xs">
        {/* 1. EXPLORER */}
        {activeSidebarTab === "explorer" && (
          <div className="py-2">
            {/* Workspace Files */}
            <div className="px-3 py-1 text-[10px] font-bold text-[#858585] uppercase tracking-wider flex items-center gap-1">
              <ChevronDown className="h-3 w-3" />
              <span>Open Editors</span>
            </div>
            <div className="flex flex-col py-1">
              {/* index.html */}
              <button
                type="button"
                onClick={() => onSelectCodeTab("html")}
                className={cn(
                  "px-4 py-1.5 flex items-center justify-between text-left transition-colors",
                  activeTab === "html"
                    ? "bg-[#37373d] text-white font-medium"
                    : "text-[#cccccc] hover:bg-[#2a2d2e]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="h-4 w-4 text-[#e34c26]" />
                  <span className="truncate">{fileName || "index.html"}</span>
                </div>
                <span className="text-[10px] text-[#858585] font-mono">HTML5</span>
              </button>

              {/* styles.css */}
              <button
                type="button"
                onClick={() => onSelectCodeTab("css")}
                className={cn(
                  "px-4 py-1.5 flex items-center justify-between text-left transition-colors",
                  activeTab === "css"
                    ? "bg-[#37373d] text-white font-medium"
                    : "text-[#cccccc] hover:bg-[#2a2d2e]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="h-4 w-4 text-[#264de4]" />
                  <span className="truncate">styles.css</span>
                </div>
                {customCss.trim() && (
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                )}
              </button>
            </div>

            {/* Starter Templates */}
            {starterTemplates.length > 0 && (
              <div className="mt-3">
                <div className="px-3 py-1 text-[10px] font-bold text-[#858585] uppercase tracking-wider flex items-center gap-1 border-t border-[#2b2b2b] pt-2">
                  <ChevronDown className="h-3 w-3" />
                  <span>Starter Templates ({starterTemplates.length})</span>
                </div>
                <div className="flex flex-col py-1">
                  {starterTemplates.map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => onApplyTemplate(t)}
                      className="px-4 py-1.5 flex items-center justify-between text-left hover:bg-[#2a2d2e] transition-colors group"
                    >
                      <span className="truncate text-[#cccccc] group-hover:text-white">
                        {t.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#333333] text-[#aaaaaa]">
                        {t.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Document DOM Outline */}
            <div className="mt-3">
              <div className="px-3 py-1 text-[10px] font-bold text-[#858585] uppercase tracking-wider flex items-center justify-between border-t border-[#2b2b2b] pt-2">
                <div className="flex items-center gap-1">
                  <ChevronDown className="h-3 w-3" />
                  <span>Outline ({domOutline.length})</span>
                </div>
                <span className="text-[9px] text-[#858585]">Jump to Line</span>
              </div>
              <div className="flex flex-col py-1 max-h-60 overflow-y-auto">
                {domOutline.length === 0 ? (
                  <p className="px-4 py-2 text-[11px] text-[#858585] italic">
                    No HTML tags found yet.
                  </p>
                ) : (
                  domOutline.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSelectCodeTab("html");
                        onJumpToLine(item.line);
                      }}
                      className="px-4 py-1 flex items-center justify-between text-left hover:bg-[#2a2d2e] text-[#cccccc] hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[#569cd6] font-mono text-[11px] font-bold">
                          &lt;{item.tag}&gt;
                        </span>
                        {item.className && (
                          <span className="text-[#9cdcfe] text-[10px] font-mono truncate">
                            .{item.className}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#858585] font-mono shrink-0">
                        :{item.line}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. SEARCH & REPLACE */}
        {activeSidebarTab === "search" && (
          <div className="p-3 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#858585]">
                Search in {activeTab.toUpperCase()}
              </label>
              <div className="flex items-center bg-[#3c3c3c] rounded border border-[#444444] px-2 py-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search text..."
                  className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#888888] w-full font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#858585]">
                Replace with
              </label>
              <div className="flex items-center bg-[#3c3c3c] rounded border border-[#444444] px-2 py-1">
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replacement text..."
                  className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#888888] w-full font-mono"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!searchQuery) return;
                onReplaceAllText(searchQuery, replaceQuery);
              }}
              disabled={!searchQuery || !currentCode.includes(searchQuery)}
              className="w-full h-8 text-xs bg-[#007acc] border-[#007acc] hover:bg-[#0062a3] text-white disabled:opacity-40"
            >
              Replace All in Document
            </Button>
          </div>
        )}

        {/* 3. MEDIA & CDN ASSETS */}
        {activeSidebarTab === "media" && (
          <div className="p-3 space-y-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUploadImageFile(file);
                  if (imageInputRef.current) imageInputRef.current.value = "";
                }
              }}
            />
            <Button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploadingImage}
              className="w-full h-8 text-xs bg-[#007acc] hover:bg-[#0062a3] text-white gap-2 font-medium"
            >
              {isUploadingImage ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              <span>{isUploadingImage ? "Uploading to CDN..." : "Upload Image"}</span>
            </Button>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-[#858585] uppercase tracking-wider block">
                Uploaded Assets ({uploadedImages.length})
              </span>

              {uploadedImages.length === 0 ? (
                <div className="p-4 rounded border border-dashed border-[#444444] text-center text-[#858585] text-xs space-y-1">
                  <ImageIcon className="h-6 w-6 mx-auto opacity-50" />
                  <p>No images uploaded yet.</p>
                  <p className="text-[10px]">
                    Upload images to get instant CDN links.
                  </p>
                </div>
              ) : (
                uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e1e1e] border border-[#333333] rounded-md p-2 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.name}
                        className="h-10 w-12 rounded object-cover bg-[#2d2d2d] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white font-medium truncate">
                          {img.name}
                        </p>
                        <p className="text-[10px] text-[#858585] truncate font-mono">
                          {img.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#2b2b2b]">
                      <button
                        type="button"
                        onClick={() => onCopyImageUrl(img.url)}
                        className="px-2 py-1 rounded bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[10px] text-[#cccccc] hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedUrl === img.url ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Link2 className="h-3 w-3" />
                        )}
                        <span>Copy URL</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCodeTab("html");
                            onInsertImageTag(img.url);
                          }}
                          className="px-2 py-1 rounded bg-[#007acc] hover:bg-[#0062a3] text-[10px] text-white flex items-center gap-1 transition-colors font-medium"
                        >
                          <Code2 className="h-3 w-3" />
                          <span>Insert</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveUploadedImage(idx)}
                          className="p-1 rounded text-[#858585] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          title="Remove from list"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. CODE SNIPPETS */}
        {activeSidebarTab === "snippets" && (
          <div className="p-3 space-y-2">
            <p className="text-[11px] text-[#858585]">
              Click any snippet to insert at current Monaco cursor.
            </p>
            <div className="space-y-2">
              {HTML_SNIPPETS.map((snippet) => (
                <div
                  key={snippet.label}
                  className="p-2.5 rounded bg-[#1e1e1e] border border-[#333333] hover:border-[#007acc]/60 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {snippet.label}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#333333] text-[#aaaaaa]">
                      {snippet.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#858585] line-clamp-2">
                    {snippet.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCodeTab("html");
                      onInsertSnippet(snippet);
                    }}
                    className="w-full py-1 rounded bg-[#2a2d2e] hover:bg-[#007acc] text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <CornerDownLeft className="h-3 w-3" />
                    <span>Insert Snippet</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SETTINGS */}
        {activeSidebarTab === "settings" && (
          <div className="p-3 space-y-4">
            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#858585] block">
                Monaco Font Size ({fontSize}px)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeFontSize(Math.max(11, fontSize - 1))}
                  className="px-2 py-1 rounded bg-[#333333] hover:bg-[#444444] text-white text-xs"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="11"
                  max="22"
                  value={fontSize}
                  onChange={(e) => onChangeFontSize(Number(e.target.value))}
                  className="flex-1 accent-[#007acc]"
                />
                <button
                  type="button"
                  onClick={() => onChangeFontSize(Math.min(22, fontSize + 1))}
                  className="px-2 py-1 rounded bg-[#333333] hover:bg-[#444444] text-white text-xs"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Word Wrap */}
            <div className="flex items-center justify-between py-1 border-t border-[#2b2b2b]">
              <span className="text-xs text-[#cccccc]">Word Wrap</span>
              <button
                type="button"
                onClick={onToggleWordWrap}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-colors",
                  wordWrap
                    ? "bg-[#007acc] text-white"
                    : "bg-[#333333] text-[#888888]"
                )}
              >
                {wordWrap ? "On" : "Off"}
              </button>
            </div>

            {/* Minimap */}
            <div className="flex items-center justify-between py-1 border-t border-[#2b2b2b]">
              <span className="text-xs text-[#cccccc]">Monaco Minimap</span>
              <button
                type="button"
                onClick={onToggleMinimap}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-colors",
                  showMinimap
                    ? "bg-[#007acc] text-white"
                    : "bg-[#333333] text-[#888888]"
                )}
              >
                {showMinimap ? "Visible" : "Hidden"}
              </button>
            </div>

            {/* Render Engine Mode */}
            <div className="space-y-2 border-t border-[#2b2b2b] pt-3">
              <label className="text-[11px] font-semibold text-[#858585] block">
                Preview Render Engine
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => onChangeRenderMode("direct")}
                  className={cn(
                    "w-full p-2 rounded text-left border transition-all text-xs",
                    renderMode === "direct"
                      ? "bg-[#007acc]/15 border-[#007acc] text-white"
                      : "bg-[#1e1e1e] border-[#333333] text-[#aaaaaa] hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>Direct HTML (Shadow DOM)</span>
                    {renderMode === "direct" && (
                      <Check className="h-3 w-3 text-[#007acc]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#858585] mt-0.5">
                    Seamless native flow, zero iframe scrollbar glitches.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeRenderMode("iframe")}
                  className={cn(
                    "w-full p-2 rounded text-left border transition-all text-xs",
                    renderMode === "iframe"
                      ? "bg-[#007acc]/15 border-[#007acc] text-white"
                      : "bg-[#1e1e1e] border-[#333333] text-[#aaaaaa] hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>Sandboxed IFrame</span>
                    {renderMode === "iframe" && (
                      <Check className="h-3 w-3 text-[#007acc]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#858585] mt-0.5">
                    Full isolated sandbox for standalone HTML pages.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
