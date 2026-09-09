"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Eye,
  Columns2,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  Download,
  X,
  RotateCcw,
  WrapText,
  FileCode,
  Layers,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HtmlPreviewRenderer,
  PreviewDevice,
  PreviewBg,
} from "./html-preview-renderer";
import {
  formatHtml,
  downloadHtmlFile,
  HTML_SNIPPETS,
  HtmlSnippet,
} from "./html-editor-utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface StarterTemplate {
  name: string;
  category: string;
  code: string;
}

interface HtmlFullViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlCode: string;
  onChangeHtml: (newCode: string) => void;
  customCss: string;
  onChangeCss: (newCss: string) => void;
  renderMode: "direct" | "iframe";
  onChangeRenderMode: (mode: "direct" | "iframe") => void;
  fileName?: string;
  starterTemplates?: StarterTemplate[];
}

export const HtmlFullViewerModal: React.FC<HtmlFullViewerModalProps> = ({
  isOpen,
  onClose,
  htmlCode,
  onChangeHtml,
  customCss,
  onChangeCss,
  renderMode,
  onChangeRenderMode,
  fileName,
  starterTemplates = [],
}) => {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const cssTextareaRef = useRef<HTMLTextAreaElement>(null);
  const cssLineNumbersRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [previewBg, setPreviewBg] = useState<PreviewBg>("light");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(13);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({
    line: 1,
    col: 1,
  });

  // Keep line numbers scroll synced with textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>, gutterRef: React.RefObject<HTMLDivElement | null>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Track cursor position for status bar
  const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const textBefore = target.value.substring(0, target.selectionStart);
    const lines = textBefore.split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  // Intercept Tab key in textarea for code indent
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    value: string,
    setValue: (v: string) => void
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Unindent
        const beforeCursor = value.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf("\n") + 1;
        if (value.substring(lineStart, lineStart + 2) === "  ") {
          const nextVal =
            value.substring(0, lineStart) + value.substring(lineStart + 2);
          setValue(nextVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(lineStart, start - 2);
            textarea.selectionEnd = Math.max(lineStart, end - 2);
          });
        }
      } else {
        // Insert 2 spaces
        const nextVal = value.substring(0, start) + "  " + value.substring(end);
        setValue(nextVal);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      toast({
        title: "HTML Saved",
        description: "Your changes are actively applied to the website builder.",
      });
    }
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Format Code
  const handleFormatCode = () => {
    if (activeTab === "html") {
      if (!htmlCode.trim()) return;
      const formatted = formatHtml(htmlCode);
      onChangeHtml(formatted);
      toast({
        title: "HTML formatted",
        description: "Markup has been cleanly indented.",
      });
    } else {
      toast({
        title: "CSS Active",
        description: "Custom CSS is active.",
      });
    }
  };

  // Copy Code
  const handleCopy = () => {
    const textToCopy = activeTab === "html" ? htmlCode : customCss;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: `${activeTab.toUpperCase()} code copied to clipboard.`,
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download File
  const handleDownload = () => {
    if (activeTab === "html") {
      downloadHtmlFile(htmlCode, fileName || "custom-section.html");
      toast({
        title: "Download started",
        description: "HTML file downloaded to your system.",
      });
    } else {
      const blob = new Blob([customCss], { type: "text/css;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "custom-styles.css";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Insert snippet at cursor or append
  const handleInsertSnippet = (snippet: HtmlSnippet) => {
    const textarea = activeTab === "html" ? textareaRef.current : cssTextareaRef.current;
    if (activeTab === "html") {
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const current = htmlCode;
        const newText =
          current.substring(0, start) +
          (start > 0 && !current.substring(0, start).endsWith("\n") ? "\n" : "") +
          snippet.code +
          "\n" +
          current.substring(end);
        onChangeHtml(newText);
        setTimeout(() => {
          textarea.focus();
          const newPos = start + snippet.code.length + 1;
          textarea.setSelectionRange(newPos, newPos);
        }, 50);
      } else {
        onChangeHtml(htmlCode + (htmlCode ? "\n\n" : "") + snippet.code);
      }
      toast({
        title: `Inserted ${snippet.label}`,
        description: snippet.description,
      });
    }
  };

  if (!isOpen) return null;

  // Compute line counts
  const currentCode = activeTab === "html" ? htmlCode : customCss;
  const lineCount = currentCode ? currentCode.split("\n").length : 1;
  const charCount = currentCode.length;

  return (
    <div className="fixed inset-0 z-[2000] bg-background text-foreground flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* ─── Top Header Bar ─── */}
      <header className="h-14 border-b border-border bg-card/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 gap-3 select-none">
        {/* Left: Brand & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-foreground truncate">
                HTML &amp; CSS Studio
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 shrink-0">
                Full Viewer
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
              <span>{fileName || "Inline Section HTML"}</span>
              <span>&bull;</span>
              <span className="text-foreground/80 font-medium">
                {renderMode === "direct" ? "Direct (Shadow DOM)" : "Sandboxed IFrame"}
              </span>
            </p>
          </div>
        </div>

        {/* Center: View Mode & Responsive Device Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-muted/60 rounded-lg border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-xs",
                viewMode === "split"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-xs",
                viewMode === "code"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Code</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 text-xs",
                viewMode === "preview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Device Viewport Selector (visible when preview is active) */}
          {viewMode !== "code" && (
            <div className="flex items-center p-1 bg-muted/60 rounded-lg border border-border/50 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  previewDevice === "desktop"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Desktop View (100%)"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  previewDevice === "tablet"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Tablet View (768px)"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  previewDevice === "mobile"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Mobile View (375px)"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2">
          {/* Starter Templates Dropdown */}
          {starterTemplates.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-background font-medium"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Templates</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[2500]">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground">
                  Insert Starter Template
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {starterTemplates.map((t) => (
                  <DropdownMenuItem
                    key={t.name}
                    className="text-xs cursor-pointer flex flex-col items-start gap-0.5"
                    onClick={() => {
                      onChangeHtml(t.code);
                      toast({
                        title: `Applied ${t.name}`,
                        description: "Starter template loaded into HTML editor.",
                      });
                    }}
                  >
                    <span className="font-semibold text-foreground">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground">{t.category}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Render Mode Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1 bg-background font-medium"
              >
                <span className="text-[11px] text-muted-foreground">Mode:</span>
                <span className="font-semibold">
                  {renderMode === "direct" ? "Direct" : "IFrame"}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 z-[2500]">
              <DropdownMenuItem
                className="text-xs cursor-pointer flex flex-col items-start"
                onClick={() => onChangeRenderMode("direct")}
              >
                <div className="flex items-center justify-between w-full font-semibold">
                  <span>Direct HTML (Shadow DOM)</span>
                  {renderMode === "direct" && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Natural page flow. 100% style isolation, no scrollbars.
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer flex flex-col items-start"
                onClick={() => onChangeRenderMode("iframe")}
              >
                <div className="flex items-center justify-between w-full font-semibold">
                  <span>Sandboxed IFrame</span>
                  {renderMode === "iframe" && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Full standalone frame for complete HTML pages &amp; complex widgets.
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Format HTML */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFormatCode}
            className="h-8 text-xs gap-1 bg-background hover:bg-muted font-medium"
            title="Format and auto-indent HTML markup"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="hidden md:inline">Format</span>
          </Button>

          {/* Copy */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs gap-1 bg-background font-medium"
            title="Copy code to clipboard"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">{isCopied ? "Copied" : "Copy"}</span>
          </Button>

          {/* Download */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-8 text-xs gap-1 bg-background font-medium"
            title="Download .html file"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </Button>

          {/* Close Studio */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
            title="Close Full Viewer (Esc)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* ─── Main Content Workspace ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ─── Left: Code Editor Pane ─── */}
        {(viewMode === "split" || viewMode === "code") && (
          <div
            className={cn(
              "flex flex-col border-r border-border bg-zinc-950 text-zinc-100 overflow-hidden relative transition-all duration-200",
              viewMode === "split" ? "w-1/2" : "w-full"
            )}
          >
            {/* Editor Sub-Header: Tabs & Snippets */}
            <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-3 flex items-center justify-between shrink-0 gap-2 select-none">
              {/* Tabs: HTML vs CSS */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("html")}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5",
                    activeTab === "html"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <FileCode className="h-3.5 w-3.5 text-amber-400" />
                  <span>HTML Markup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("css")}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5",
                    activeTab === "css"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <Layers className="h-3.5 w-3.5 text-sky-400" />
                  <span>Custom CSS</span>
                  {customCss.trim() && (
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  )}
                </button>
              </div>

              {/* Quick Snippets Bar (when HTML tab is active) */}
              {activeTab === "html" && (
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mr-1 shrink-0">
                    Snippets:
                  </span>
                  {HTML_SNIPPETS.slice(0, 5).map((snippet) => (
                    <button
                      key={snippet.label}
                      type="button"
                      onClick={() => handleInsertSnippet(snippet)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium transition-colors shrink-0"
                      title={snippet.description}
                    >
                      +{snippet.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Word wrap and Font Size */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setWordWrap(!wordWrap)}
                  className={cn(
                    "p-1 rounded text-xs transition-colors",
                    wordWrap
                      ? "text-primary bg-primary/20"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                  title={wordWrap ? "Word Wrap: On" : "Word Wrap: Off"}
                >
                  <WrapText className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center text-[10px] text-zinc-400 gap-1 ml-1 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60">
                  <button
                    type="button"
                    onClick={() => setFontSize(Math.max(11, fontSize - 1))}
                    className="hover:text-white"
                  >
                    A-
                  </button>
                  <span>{fontSize}px</span>
                  <button
                    type="button"
                    onClick={() => setFontSize(Math.min(18, fontSize + 1))}
                    className="hover:text-white"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Code Textarea with Line Numbers Gutter */}
            <div className="flex-1 flex overflow-hidden relative font-mono">
              {/* HTML Editor */}
              {activeTab === "html" && (
                <div className="flex-1 flex overflow-hidden relative">
                  {/* Line numbers gutter */}
                  <div
                    ref={lineNumbersRef}
                    className="w-12 bg-zinc-950/80 border-r border-zinc-900 py-3 text-right pr-3 select-none text-zinc-600 overflow-hidden shrink-0"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                  >
                    {Array.from({ length: lineCount }).map((_, i) => (
                      <div
                        key={i + 1}
                        className={cn(
                          "transition-colors",
                          cursorPos.line === i + 1 && "text-zinc-300 font-semibold"
                        )}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={htmlCode}
                    onChange={(e) => onChangeHtml(e.target.value)}
                    onScroll={(e) => handleScroll(e, lineNumbersRef)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, htmlCode, (v) => onChangeHtml(v))
                    }
                    onKeyUp={handleCursorMove}
                    onClick={handleCursorMove}
                    placeholder="<!-- Write or paste HTML markup here -->&#10;<div style=&quot;padding: 24px;&quot;>&#10;  <h1>Welcome</h1>&#10;</div>"
                    spellCheck={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    className={cn(
                      "flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 p-3 outline-none resize-none border-0 focus:ring-0 leading-relaxed",
                      wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
                    )}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                  />
                </div>
              )}

              {/* CSS Editor */}
              {activeTab === "css" && (
                <div className="flex-1 flex overflow-hidden relative">
                  {/* Line numbers gutter */}
                  <div
                    ref={cssLineNumbersRef}
                    className="w-12 bg-zinc-950/80 border-r border-zinc-900 py-3 text-right pr-3 select-none text-zinc-600 overflow-hidden shrink-0"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                  >
                    {Array.from({
                      length: customCss ? customCss.split("\n").length : 1,
                    }).map((_, i) => (
                      <div key={i + 1}>{i + 1}</div>
                    ))}
                  </div>

                  {/* CSS Textarea */}
                  <textarea
                    ref={cssTextareaRef}
                    value={customCss}
                    onChange={(e) => onChangeCss(e.target.value)}
                    onScroll={(e) => handleScroll(e, cssLineNumbersRef)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, customCss, (v) => onChangeCss(v))
                    }
                    onKeyUp={handleCursorMove}
                    onClick={handleCursorMove}
                    placeholder="/* Write custom CSS styles here */&#10;.custom-card {&#10;  transition: transform 0.2s ease;&#10;}&#10;.custom-card:hover {&#10;  transform: translateY(-4px);&#10;}"
                    spellCheck={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    className={cn(
                      "flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 p-3 outline-none resize-none border-0 focus:ring-0 leading-relaxed",
                      wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
                    )}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                  />
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="h-7 bg-zinc-900/90 border-t border-zinc-800 px-3 flex items-center justify-between text-[11px] text-zinc-400 select-none shrink-0 font-mono">
              <div className="flex items-center gap-3">
                <span>
                  Ln {cursorPos.line}, Col {cursorPos.col}
                </span>
                <span>&bull;</span>
                <span>
                  {lineCount} {lineCount === 1 ? "line" : "lines"}
                </span>
                <span>&bull;</span>
                <span>{charCount} chars</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <span>Spaces: 2</span>
                <span>&bull;</span>
                <span>{activeTab === "html" ? "HTML5" : "CSS3"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Right: Live Preview Pane ─── */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div
            className={cn(
              "flex flex-col bg-muted/20 overflow-hidden relative transition-all duration-200",
              viewMode === "split" ? "w-1/2" : "w-full"
            )}
          >
            {/* Preview Toolbar */}
            <div className="h-10 bg-card/80 border-b border-border px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>Live Preview</span>
                </span>
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted border">
                  {previewDevice === "desktop"
                    ? "Desktop (100%)"
                    : previewDevice === "tablet"
                    ? "Tablet (768px)"
                    : "Mobile (375px)"}
                </span>
              </div>

              {/* Preview Background Switcher & Reload */}
              <div className="flex items-center gap-2">
                {/* Background selector */}
                <div className="flex items-center p-0.5 bg-muted/60 rounded-md border border-border/50 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPreviewBg("light")}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                      previewBg === "light"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg("dark")}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                      previewBg === "dark"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg("checker")}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                      previewBg === "checker"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Grid
                  </button>
                </div>

                {/* Reload Preview Button */}
                <button
                  type="button"
                  onClick={() => {
                    setRefreshKey((k) => k + 1);
                    toast({
                      title: "Preview refreshed",
                      description: "Re-rendered live preview canvas.",
                    });
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Reload live preview"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Rendering Canvas */}
            <div className="flex-1 overflow-auto p-4 flex flex-col justify-start items-center">
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
        )}
      </div>
    </div>
  );
};
