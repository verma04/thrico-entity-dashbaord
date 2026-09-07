"use client";

import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  X,
  Mail,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Tag,
  Code2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Official GrapesJS Studio SDK Styles
import "@grapesjs/studio-sdk/style";
import type { Editor } from "grapesjs";

// Dynamically import StudioEditor from @grapesjs/studio-sdk/react with ssr: false
const StudioEditor = dynamic(
  () => import("@grapesjs/studio-sdk/react").then((mod) => mod.StudioEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-zinc-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
          Initializing GrapesJS Studio SDK…
        </p>
      </div>
    ),
  }
);

export interface ActionEmailTemplateData {
  id?: string;
  name: string;
  subject: string;
  html: string;
  json?: string;
  type: "welcome" | "approval" | "custom";
}

interface GrapesJsEmailEditorProps {
  initialData?: ActionEmailTemplateData;
  onSave: (data: { html: string; json: string; subject: string }) => void | Promise<void>;
  onClose?: () => void;
  title?: string;
  isSaving?: boolean;
}

import {
  TEMPLATE_VARIABLES,
  getDefaultStarter,
} from "../email-starters";

export {
  TEMPLATE_VARIABLES,
  getDefaultStarter,
};

export function GrapesJsEmailEditor({
  initialData,
  onSave,
  onClose,
  title = "Customize Email",
  isSaving = false,
}: GrapesJsEmailEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  const [subject, setSubject] = useState(
    initialData?.subject ||
      (initialData?.type === "approval"
        ? "🎉 Your membership for {{entity_name}} has been approved!"
        : "Welcome to {{entity_name}}! 🚀")
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const startingHtml =
    initialData?.html && initialData.html.trim().length > 0
      ? initialData.html
      : getDefaultStarter(initialData?.type || "welcome");

  const handleEditorReady = useCallback((editor: Editor) => {
    editorRef.current = editor;
  }, []);

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    toast.success(`Copied variable ${tag} to clipboard!`);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleInsertTag = (tag: string) => {
    if (!editorRef.current) return;
    editorRef.current.addComponents(
      `<span style="color: #4f46e5; font-weight: 600;">${tag}</span>`
    );
    toast.success(`Inserted ${tag} into template.`);
  };

  const handleResetToStarter = () => {
    if (!editorRef.current) return;
    editorRef.current.setComponents(
      getDefaultStarter(initialData?.type || "welcome")
    );
    toast.success("Template reset to starter layout.");
  };

  const handleViewCode = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    setHtmlCode(html);
    setIsCodeModalOpen(true);
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    try {
      const html = editorRef.current.getHtml();
      const projectData = editorRef.current.getProjectData();
      const json = JSON.stringify(projectData);

      await onSave({
        html,
        json,
        subject,
      });
      toast.success("Action email template saved successfully!");
      if (onClose) onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save email template.";
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white text-zinc-900 border border-zinc-200 rounded-xl overflow-hidden shadow-2xl transition-all font-sans",
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none h-screen w-screen"
          : "relative h-[840px] w-full"
      )}
    >
      {/* ── Top Header Toolbar (Light Theme) ──────────────────────── */}
      <header className="h-14 border-b border-zinc-200 bg-white px-4 flex items-center justify-between shrink-0 gap-4">
        {/* Left: Title & Subject Input */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-800 truncate hidden sm:inline">
              {title}
            </span>
            <span className="text-zinc-300 hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1 w-64 md:w-80 shadow-2xs">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">
                Subject:
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email Subject line..."
                className="bg-transparent border-none text-xs font-semibold text-zinc-800 focus:outline-none w-full placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs text-zinc-700 hover:text-zinc-900 border-zinc-200 hover:bg-zinc-100 flex items-center gap-1.5"
            onClick={handleResetToStarter}
            title="Reset to default starter template"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden lg:inline">Reset</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs text-zinc-700 hover:text-zinc-900 border-zinc-200 hover:bg-zinc-100 flex items-center gap-1.5"
            onClick={handleViewCode}
          >
            <Code2 className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">HTML</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Template"}</span>
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 ml-1"
              onClick={onClose}
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      {/* ── Variables Quick Bar (Light Theme) ────────────────────── */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0 scrollbar-thin">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3 text-indigo-500" />
            Tags:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {TEMPLATE_VARIABLES.map((v) => (
              <div key={v.tag} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => handleCopyTag(v.tag)}
                  className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-l-md bg-white border border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-700 hover:text-indigo-700 text-[11px] font-mono transition-colors shadow-2xs"
                  title={`Copy ${v.label} (${v.desc})`}
                >
                  <span>{v.tag}</span>
                  {copiedTag === v.tag ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag(v.tag)}
                  className="px-1.5 py-0.5 rounded-r-md bg-zinc-100 border border-l-0 border-zinc-200 hover:bg-indigo-100 hover:text-indigo-700 text-zinc-500 text-[10px] font-bold"
                  title="Insert into canvas"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
        <span className="text-[11px] text-zinc-400 hidden xl:inline">
          Official @grapesjs/studio-sdk Email Studio
        </span>
      </div>

      {/* ── Main Studio SDK Editor Canvas ─────────────────────────── */}
      <div className="flex-1 w-full h-full overflow-hidden relative bg-zinc-100">
        <StudioEditor
          options={
            {
              licenseKey: "DEV_LICENSE_KEY",
              theme: "light",
              autoHeight: true,
              project: {
                type: "email",
                default: {
                  pages: [
                    {
                      name: "Email Template",
                      component: startingHtml,
                    },
                  ],
                },
              },
              onReady: handleEditorReady,
            } as any
          }
        />
      </div>

      {/* ── HTML Code Viewer Modal ─────────────────────────────────── */}
      <Dialog open={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
        <DialogContent className="max-w-3xl bg-white border-zinc-200 text-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Generated Inlined Email HTML</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                onClick={() => {
                  navigator.clipboard.writeText(htmlCode);
                  toast.success("HTML copied to clipboard!");
                }}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy HTML
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="relative mt-2">
            <pre className="h-96 w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 overflow-auto whitespace-pre-wrap leading-relaxed select-all">
              {htmlCode}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
