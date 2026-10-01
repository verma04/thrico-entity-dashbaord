"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useToast } from "@/hooks/use-toast";
import { useUploadImage } from "@/graphql/actions";
import {
  formatHtml,
  downloadHtmlFile,
  HtmlSnippet,
} from "./html-editor-utils";
import {
  validateHtmlMarkup,
  extractDomOutline,
  calculateDocStats,
  HtmlProblem,
  DomOutlineItem,
} from "./vscode-editor-utils";
import {
  VscodeTitlebar,
  VscodeActivityBar,
  VscodeSidebar,
  VscodeEditorPane,
  VscodePreviewPane,
  VscodeDevtoolsDrawer,
  VscodeStatusBar,
  VscodeCommandPalette,
  VscodeShortcutsModal,
  VscodeDraggableSplitter,
  SidebarTab,
  DevToolsTab,
  ViewMode,
  ActiveCodeTab,
  ConsoleLog,
  StarterTemplate,
  UploadedImage,
  PreviewDevice,
  PreviewBg,
} from "./vscode-studio";

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

  // Monaco Editor Ref
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layout & Workspace States
  const [activeTab, setActiveTab] = useState<ActiveCodeTab>("html");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>("explorer");
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage for code pane in split mode
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);

  // Live Preview States
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [previewBg, setPreviewBg] = useState<PreviewBg>("light");
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Bottom DevTools Drawer States
  const [showDevTools, setShowDevTools] = useState<boolean>(false);
  const [activeDevTab, setActiveDevTab] = useState<DevToolsTab>("problems");
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    {
      id: "log-1",
      time: new Date().toLocaleTimeString(),
      level: "info",
      text: "Monaco Editor engine loaded in VS Code Dark+ theme.",
    },
    {
      id: "log-2",
      time: new Date().toLocaleTimeString(),
      level: "success",
      text: "Live preview synchronized on port 5500.",
    },
  ]);

  // Editor Preferences
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(13);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({
    line: 1,
    col: 1,
  });

  // Modal Popups
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Images & Assets
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Upload Image Action
  const [uploadImage, { loading: isUploading }] = useUploadImage({
    onCompleted: (data: { uploadImage?: string }) => {
      if (data?.uploadImage) {
        const cdnUrl = `https://cdn.thrico.network/${data.uploadImage}`;
        setUploadedImages((prev) => [
          { url: cdnUrl, name: "cdn-image", uploadedAt: new Date() },
          ...prev,
        ]);
        setActiveSidebarTab("media");
        setConsoleLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            level: "success",
            text: `Image uploaded to CDN: ${cdnUrl}`,
          },
          ...prev,
        ]);
        toast({
          title: "Image uploaded to CDN",
          description: "Click \"Insert\" to add the <img> tag at cursor.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload image.",
        variant: "destructive",
      });
    },
  });

  const handleUploadImageFile = (file: File) => {
    uploadImage({ variables: { file } });
  };

  const currentCode = activeTab === "html" ? htmlCode : customCss;
  const currentSetCode = activeTab === "html" ? onChangeHtml : onChangeCss;

  // Real-time analysis for DevTools & Explorer
  const problems = useMemo<HtmlProblem[]>(() => {
    return validateHtmlMarkup(htmlCode);
  }, [htmlCode]);

  const domOutline = useMemo<DomOutlineItem[]>(() => {
    return extractDomOutline(htmlCode);
  }, [htmlCode]);

  const docStats = useMemo(() => {
    return calculateDocStats(htmlCode, customCss);
  }, [htmlCode, customCss]);

  // Jump to line in Monaco
  const jumpToLine = useCallback((targetLine: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.revealLineInCenter(targetLine);
    editor.setPosition({ lineNumber: targetLine, column: 1 });
    editor.focus();
    setCursorPos({ line: targetLine, col: 1 });
  }, []);

  // Insert text at cursor in Monaco
  const insertTextAtCursor = useCallback((text: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    if (selection) {
      editor.executeEdits("insert", [
        {
          range: selection,
          text: text,
          forceMoveMarkers: true,
        },
      ]);
      editor.focus();
    }
  }, []);

  // Format Code via Monaco or util
  const handleFormatCode = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.getAction("editor.action.formatDocument")?.run();
      setConsoleLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          level: "info",
          text: `Formatted ${activeTab.toUpperCase()} document via Monaco.`,
        },
        ...prev,
      ]);
      toast({
        title: "Code Formatted",
        description: "Formatted document cleanly with Monaco Prettier rules.",
      });
    } else {
      if (activeTab === "html") {
        if (!htmlCode.trim()) return;
        const formatted = formatHtml(htmlCode);
        onChangeHtml(formatted);
      }
    }
  }, [activeTab, htmlCode, onChangeHtml, toast]);

  // Copy Code
  const handleCopy = useCallback(() => {
    const textToCopy = activeTab === "html" ? htmlCode : customCss;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: `${activeTab.toUpperCase()} code copied to clipboard.`,
    });
    setTimeout(() => setIsCopied(false), 2000);
  }, [activeTab, htmlCode, customCss, toast]);

  // Download File
  const handleDownload = useCallback(() => {
    if (activeTab === "html") {
      downloadHtmlFile(htmlCode, fileName || "index.html");
      toast({
        title: "Download started",
        description: "HTML file downloaded to your system.",
      });
    } else {
      const blob = new Blob([customCss], { type: "text/css;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "styles.css";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [activeTab, htmlCode, customCss, fileName, toast]);

  // Insert Snippet
  const handleInsertSnippet = useCallback(
    (snippet: HtmlSnippet) => {
      insertTextAtCursor(`\n${snippet.code}\n`);
      setConsoleLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          level: "info",
          text: `Inserted snippet: ${snippet.label}`,
        },
        ...prev,
      ]);
      toast({
        title: `Inserted ${snippet.label}`,
        description: snippet.description,
      });
    },
    [insertTextAtCursor, toast]
  );

  // Insert Image Tag
  const handleInsertImageTag = useCallback(
    (imageUrl: string) => {
      const altText = imageUrl.split("/").pop()?.split(".")[0] || "image";
      const imgTag = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 8px;" />`;
      insertTextAtCursor(`\n${imgTag}\n`);
      toast({
        title: "Image inserted",
        description: "<img> tag added with CDN source.",
      });
    },
    [insertTextAtCursor, toast]
  );

  // Copy Image URL
  const handleCopyImageUrl = useCallback(
    (url: string) => {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast({ title: "URL copied", description: "CDN link copied to clipboard." });
      setTimeout(() => setCopiedUrl(null), 2000);
    },
    [toast]
  );

  // Monaco onMount callback
  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Update cursor position
      editor.onDidChangeCursorPosition((e) => {
        setCursorPos({
          line: e.position.lineNumber,
          col: e.position.column,
        });
      });

      // Bind Cmd+S / Ctrl+S to save and reload
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        setRefreshKey((k) => k + 1);
        toast({
          title: "HTML Studio Saved",
          description: "Your changes are active and synchronized with the website preview.",
        });
      });

      // Bind Cmd+P / Ctrl+P to Command Palette
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
        setShowCommandPalette(true);
      });

      // Bind Cmd+B / Ctrl+B to toggle sidebar
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
        setActiveSidebarTab((prev) => (prev ? null : "explorer"));
      });

      // Bind Cmd+J / Ctrl+J to toggle devtools drawer
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
        setShowDevTools((v) => !v);
      });

      // Bind Alt+Z to toggle word wrap
      editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, () => {
        setWordWrap((v) => !v);
      });
    },
    [toast]
  );

  // Splitter Dragging Logic
  const handleMouseDownSplitter = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);
  };

  useEffect(() => {
    if (!isDraggingSplitter) return;
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sidebarWidth = activeSidebarTab ? 256 : 0;
      const activityBarWidth = 48;
      const totalOffset = rect.left + activityBarWidth + sidebarWidth;
      const availableWidth = rect.width - activityBarWidth - sidebarWidth;
      const currentX = e.clientX - totalOffset;
      const newPercentage = Math.min(
        80,
        Math.max(20, (currentX / availableWidth) * 100)
      );
      setSplitRatio(newPercentage);
    };

    const onMouseUp = () => {
      setIsDraggingSplitter(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingSplitter, activeSidebarTab]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      // Escape
      if (e.key === "Escape") {
        if (showCommandPalette) {
          setShowCommandPalette(false);
          return;
        }
        if (showShortcutsModal) {
          setShowShortcutsModal(false);
          return;
        }
        if (isOpen) {
          onClose();
        }
      }

      // Cmd+P or Ctrl+P -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setShowCommandPalette((v) => !v);
        return;
      }

      // Cmd+B or Ctrl+B -> Toggle Side Bar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setActiveSidebarTab((prev) => (prev ? null : "explorer"));
        return;
      }

      // Cmd+J or Ctrl+J -> Toggle DevTools Drawer
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setShowDevTools((v) => !v);
        return;
      }

      // Alt+Z -> Toggle Word Wrap
      if (e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        setWordWrap((v) => !v);
        return;
      }

      // Shift+Alt+F -> Format Code
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleFormatCode();
        return;
      }
    };

    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [isOpen, onClose, showCommandPalette, showShortcutsModal, handleFormatCode]);

  // Execute Command from Palette
  const handleExecuteCommand = (cmdId: string) => {
    switch (cmdId) {
      case "tab-html":
        setActiveTab("html");
        break;
      case "tab-css":
        setActiveTab("css");
        break;
      case "view-split":
        setViewMode("split");
        break;
      case "view-code":
        setViewMode("code");
        break;
      case "view-preview":
        setViewMode("preview");
        break;
      case "format-doc":
        handleFormatCode();
        break;
      case "toggle-wrap":
        setWordWrap((v) => !v);
        break;
      case "toggle-minimap":
        setShowMinimap((v) => !v);
        break;
      case "toggle-sidebar":
        setActiveSidebarTab((prev) => (prev ? null : "explorer"));
        break;
      case "toggle-devtools":
        setShowDevTools((v) => !v);
        break;
      case "device-desktop":
        setPreviewDevice("desktop");
        break;
      case "device-tablet":
        setPreviewDevice("tablet");
        break;
      case "device-mobile":
        setPreviewDevice("mobile");
        break;
      case "reload-preview":
        setRefreshKey((k) => k + 1);
        break;
      case "export-html":
        handleDownload();
        break;
      case "copy-code":
        handleCopy();
        break;
      case "mode-direct":
        onChangeRenderMode("direct");
        break;
      case "mode-iframe":
        onChangeRenderMode("iframe");
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2000] bg-[#1e1e1e] text-[#cccccc] flex flex-col overflow-hidden font-sans select-none animate-in fade-in duration-150"
    >
      {/* 1. VS Code Window Titlebar */}
      <VscodeTitlebar
        fileName={fileName}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        activeSidebarTab={activeSidebarTab}
        onToggleSidebar={() =>
          setActiveSidebarTab((prev) => (prev ? null : "explorer"))
        }
        showDevTools={showDevTools}
        onToggleDevTools={() => setShowDevTools((v) => !v)}
        hasProblems={problems.length > 0}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onClose={onClose}
      />

      {/* 2. Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 2A. 48px Activity Bar */}
        <VscodeActivityBar
          activeSidebarTab={activeSidebarTab}
          onSelectTab={setActiveSidebarTab}
          uploadedCount={uploadedImages.length}
          onOpenShortcuts={() => setShowShortcutsModal(true)}
        />

        {/* 2B. 256px Collapsible Side Bar */}
        <VscodeSidebar
          activeSidebarTab={activeSidebarTab}
          onCloseSidebar={() => setActiveSidebarTab(null)}
          fileName={fileName}
          activeTab={activeTab}
          onSelectCodeTab={setActiveTab}
          customCss={customCss}
          starterTemplates={starterTemplates}
          onApplyTemplate={(t) => {
            onChangeHtml(t.code);
            toast({
              title: `Loaded: ${t.name}`,
              description: "Starter template applied to index.html.",
            });
          }}
          domOutline={domOutline}
          onJumpToLine={(line) => {
            setActiveTab("html");
            jumpToLine(line);
          }}
          currentCode={currentCode}
          onReplaceAllText={(search, replace) => {
            const nextVal = currentCode.replaceAll(search, replace);
            currentSetCode(nextVal);
            toast({
              title: "Replaced occurrences",
              description: `Replaced all "${search}" with "${replace}".`,
            });
          }}
          uploadedImages={uploadedImages}
          isUploadingImage={isUploading}
          onUploadImageFile={handleUploadImageFile}
          onInsertImageTag={(url) => {
            setActiveTab("html");
            handleInsertImageTag(url);
          }}
          onCopyImageUrl={handleCopyImageUrl}
          onRemoveUploadedImage={(idx) =>
            setUploadedImages((prev) => prev.filter((_, i) => i !== idx))
          }
          copiedUrl={copiedUrl}
          onInsertSnippet={(snippet) => {
            setActiveTab("html");
            handleInsertSnippet(snippet);
          }}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          wordWrap={wordWrap}
          onToggleWordWrap={() => setWordWrap(!wordWrap)}
          showMinimap={showMinimap}
          onToggleMinimap={() => setShowMinimap(!showMinimap)}
          renderMode={renderMode}
          onChangeRenderMode={onChangeRenderMode}
        />

        {/* 2C. Monaco Code Editor Pane */}
        <VscodeEditorPane
          fileName={fileName}
          activeTab={activeTab}
          onSelectCodeTab={setActiveTab}
          customCss={customCss}
          htmlCode={htmlCode}
          onChangeHtml={onChangeHtml}
          onChangeCss={onChangeCss}
          onFormatCode={handleFormatCode}
          showMinimap={showMinimap}
          onToggleMinimap={() => setShowMinimap(!showMinimap)}
          wordWrap={wordWrap}
          onToggleWordWrap={() => setWordWrap(!wordWrap)}
          isCopied={isCopied}
          onCopyCode={handleCopy}
          onDownloadFile={handleDownload}
          domOutline={domOutline}
          fontSize={fontSize}
          onMountEditor={handleEditorDidMount}
          splitRatio={splitRatio}
          viewMode={viewMode}
        />

        {/* 2D. Draggable Splitter Divider */}
        {viewMode === "split" && (
          <VscodeDraggableSplitter
            onMouseDown={handleMouseDownSplitter}
            onResetSplit={() => setSplitRatio(50)}
            isDragging={isDraggingSplitter}
          />
        )}

        {/* 2E. Live Preview Browser Pane */}
        <VscodePreviewPane
          fileName={fileName}
          htmlCode={htmlCode}
          customCss={customCss}
          renderMode={renderMode}
          previewDevice={previewDevice}
          onSetPreviewDevice={setPreviewDevice}
          previewBg={previewBg}
          onSetPreviewBg={setPreviewBg}
          refreshKey={refreshKey}
          onReloadPreview={() => {
            setRefreshKey((k) => k + 1);
            setConsoleLogs((prev) => [
              {
                id: `log-${Date.now()}`,
                time: new Date().toLocaleTimeString(),
                level: "info",
                text: "Live preview reloaded.",
              },
              ...prev,
            ]);
            toast({ title: "Preview reloaded" });
          }}
          showDevTools={showDevTools}
          onToggleDevTools={() => setShowDevTools(!showDevTools)}
          viewMode={viewMode}
          splitRatio={splitRatio}
        />

        {/* 2F. Collapsible Bottom DevTools Drawer */}
        <VscodeDevtoolsDrawer
          showDevTools={showDevTools}
          onClose={() => setShowDevTools(false)}
          activeDevTab={activeDevTab}
          onSelectTab={setActiveDevTab}
          problems={problems}
          onJumpToLine={(line) => {
            setActiveTab("html");
            jumpToLine(line);
          }}
          consoleLogs={consoleLogs}
          onClearConsole={() => setConsoleLogs([])}
          domOutline={domOutline}
          docStats={docStats}
        />
      </div>

      {/* 3. VS Code Electric Blue Status Bar */}
      <VscodeStatusBar
        onSyncServer={() => {
          setRefreshKey((k) => k + 1);
          toast({ title: "Live Server synchronized" });
        }}
        problemsCount={problems.length}
        onOpenProblems={() => {
          setShowDevTools(true);
          setActiveDevTab("problems");
        }}
        cursorPos={cursorPos}
        activeTab={activeTab}
        onToggleActiveTab={() =>
          setActiveTab(activeTab === "html" ? "css" : "html")
        }
        onFormatCode={handleFormatCode}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
      />

      {/* 4. Command Palette Modal (Cmd+P) */}
      <VscodeCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onExecuteCommand={handleExecuteCommand}
      />

      {/* 5. Shortcuts Cheat Sheet Modal */}
      <VscodeShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
};
