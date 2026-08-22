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

export const TEMPLATE_VARIABLES = [
  { tag: "{{member_name}}", label: "Member Name", desc: "e.g. John Doe" },
  { tag: "{{member_email}}", label: "Member Email", desc: "e.g. user@example.com" },
  { tag: "{{entity_name}}", label: "Community / Org Name", desc: "e.g. Acme Network" },
  { tag: "{{login_url}}", label: "Login / Action URL", desc: "e.g. https://thrico.network/login" },
  { tag: "{{approval_status}}", label: "Approval Status", desc: "e.g. Approved / Active" },
  { tag: "{{dashboard_url}}", label: "Dashboard Link", desc: "e.g. https://thrico.network/dashboard" },
];

export function getDefaultStarter(type: "welcome" | "approval" | "custom"): string {
  if (type === "approval") {
    return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 36px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                    🎉 You're Approved!
                  </h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">
                    Welcome to {{entity_name}}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 36px 32px;">
                  <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                    Hi <strong>{{member_name}}</strong>,
                  </p>
                  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                    Great news! Your membership application for <strong>{{entity_name}}</strong> has been reviewed and officially approved. Your account status is now <span style="background-color: #d1fae5; color: #065f46; font-weight: 600; padding: 2px 8px; border-radius: 4px;">{{approval_status}}</span>.
                  </p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; padding: 20px;">
                    <tr>
                      <td>
                        <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                          What you can do now:
                        </h3>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                          ✓ Connect and network with active members
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                          ✓ Participate in exclusive community discussions and events
                        </p>
                        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">
                          ✓ Access resources, mentorship programs, and rewards
                        </p>
                      </td>
                    </tr>
                  </table>
                  <div style="text-align: center; margin: 32px 0 24px;">
                    <a href="{{login_url}}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">
                      Access Your Account →
                    </a>
                  </div>
                  <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; text-align: center; margin: 0;">
                    If you have any questions, simply reply to this email or reach out to our administration team.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 12px; margin: 0;">
                    © {{entity_name}} · All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  // Default: Registration / Welcome Email
  return `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            <tr>
              <td style="background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                  Welcome to {{entity_name}}! 🚀
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">
                  Your registration is complete. Let's get started.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 36px 32px;">
                <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                  Hi <strong>{{member_name}}</strong>,
                </p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                  Thank you for creating an account with <strong>{{entity_name}}</strong>! We are thrilled to welcome you into our community.
                </p>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; padding: 20px;">
                  <tr>
                    <td>
                      <h3 style="color: #1e293b; margin: 0 0 12px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Getting Started Checklist:
                      </h3>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                        1. Complete your member profile & skills
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 8px; line-height: 1.5;">
                        2. Discover and join active channels & groups
                      </p>
                      <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">
                        3. Introduce yourself to the community feed
                      </p>
                    </td>
                  </tr>
                </table>
                <div style="text-align: center; margin: 32px 0 24px;">
                  <a href="{{login_url}}" style="background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);">
                    Go to Your Dashboard →
                  </a>
                </div>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; text-align: center; margin: 0;">
                  Registered with: <span style="color: #64748b;">{{member_email}}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">
                  © {{entity_name}} · Powered by Thrico Network
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

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
          options={{
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
          }}
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
