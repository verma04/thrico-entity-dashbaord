"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Monitor,
  Smartphone,
  Undo2,
  Redo2,
  Mail,
  RefreshCw,
  Sparkles,
  EyeOff,
  Code2,
} from "lucide-react";
import {
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
} from "@/graphql/actions/email";
import { useGetEntity, useUploadImage } from "@/graphql/actions";
import { useEmailStore, type EmailTemplate } from "@/store/useEmailStore";
import { CtaButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  UNLAYER_MERGE_TAGS,
  convertBlocksToUnlayerDesign,
} from "./unlayer-utils";
import type { EditorRef, EmailEditorProps } from "react-email-editor";

// Dynamically import EmailEditor without SSR to prevent window/document undefined issues
const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 gap-3">
      <RefreshCw className="h-7 w-7 text-indigo-500 animate-spin" strokeWidth={1.75} />
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Loading Email Editor…
      </p>
    </div>
  ),
});

interface UnlayerEmailEditorProps {
  id?: string;
  initialData?: EmailTemplate;
}

export default function UnlayerEmailEditor({ id, initialData }: UnlayerEmailEditorProps) {
  const router = useRouter();
  const { addTemplate, updateTemplate: updateLocalTemplate } = useEmailStore();

  const [createTemplate, { loading: isCreating }] = useCreateEmailTemplate();
  const [updateTemplate, { loading: isUpdating }] = useUpdateEmailTemplate();
  const [uploadImageMutation] = useUploadImage();

  const isSaving = isCreating || isUpdating;

  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [activePreviewDevice, setActivePreviewDevice] = useState<"desktop" | "mobile" | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Entity details for branding
  const { data: entityData } = useGetEntity();
  const entityLogoUrl = entityData?.getEntity?.logo
    ? `https://cdn.thrico.network/${entityData.getEntity.logo}`
    : undefined;

  const emailEditorRef = useRef<EditorRef>(null);
  const unlayerInstanceRef = useRef<any>(null);
  const designLoadedRef = useRef(false);

  // Memoized options for Unlayer to prevent unnecessary iframe teardowns
  const unlayerOptions: EmailEditorProps["options"] = useMemo(
    () => ({
      displayMode: "email",
      appearance: {
        theme: "light",
        panels: {
          tools: {
            dock: "right",
          },
        },
      },
      features: {
        preview: true,
        undoRedo: true,
        stockImages: true,
      },
      mergeTags: UNLAYER_MERGE_TAGS,
    }),
    []
  );

  // Register image upload callback directly to Thrico CDN
  const registerImageUploadCallback = useCallback(
    (editor: any) => {
      try {
        editor.registerCallback("image", async (fileData: any, done: (result: { progress: number; url?: string }) => void) => {
          try {
            const rawFile = fileData.attachments?.[0] || fileData;
            if (!rawFile) {
              done({ progress: 0 });
              return;
            }

            toast.info("Uploading image to CDN…");
            const res = await uploadImageMutation({ variables: { file: rawFile } });

            if (res.data?.uploadImage) {
              const url = res.data.uploadImage.startsWith("http")
                ? res.data.uploadImage
                : `https://cdn.thrico.network/${res.data.uploadImage}`;

              done({ progress: 100, url });
              toast.success("Image uploaded!");
            } else {
              done({ progress: 0 });
              toast.error("Failed to upload image.");
            }
          } catch (err: any) {
            console.error("Image upload failed:", err);
            done({ progress: 0 });
            toast.error(err.message || "Failed to upload image");
          }
        });
      } catch (err) {
        console.warn("Could not register custom image callback:", err);
      }
    },
    [uploadImageMutation]
  );

  // Called when Unlayer editor is fully mounted and ready
  const onReady = useCallback(
    (editor: any) => {
      unlayerInstanceRef.current = editor;
      setIsEditorReady(true);
      registerImageUploadCallback(editor);

      if (!designLoadedRef.current) {
        designLoadedRef.current = true;
        try {
          const rawJson = initialData?.json;
          const design = convertBlocksToUnlayerDesign(rawJson, {
            entityLogoUrl,
          });
          editor.loadDesign(design);
        } catch (err) {
          console.error("Error loading design into Unlayer:", err);
          editor.loadBlank();
        }
      }
    },
    [initialData?.json, entityLogoUrl, registerImageUploadCallback]
  );

  // Handle Undo / Redo
  const handleUndo = () => {
    unlayerInstanceRef.current?.undo?.();
  };

  const handleRedo = () => {
    unlayerInstanceRef.current?.redo?.();
  };

  // Handle Preview Toggle
  const handleDevicePreview = (device: "desktop" | "mobile") => {
    const editor = unlayerInstanceRef.current;
    if (!editor) return;

    if (activePreviewDevice === device) {
      editor.hidePreview?.();
      setActivePreviewDevice(null);
    } else {
      editor.showPreview?.({ device });
      setActivePreviewDevice(device);
    }
  };

  const handleExitPreview = () => {
    unlayerInstanceRef.current?.hidePreview?.();
    setActivePreviewDevice(null);
  };

  // Handle Save
  const handleSave = async () => {
    const editor = unlayerInstanceRef.current;
    if (!editor) {
      toast.error("Editor is not ready yet.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please provide a template name (alias).");
      return;
    }

    // Exit preview mode if currently active before exporting
    if (activePreviewDevice) {
      handleExitPreview();
    }

    editor.exportHtml(async (data: { design: any; html: string }) => {
      const { design, html } = data;
      const json = JSON.stringify(design);

      try {
        if (id) {
          // --- Edit Mode ---
          const { data: updateRes } = await updateTemplate({
            variables: {
              input: { id, name: name.trim(), subject: subject.trim(), html, json },
            },
          });

          if (updateRes?.updateEmailTemplate?.id) {
            updateLocalTemplate(id, { name: name.trim(), subject: subject.trim(), html, json });
            toast.success("Template updated ✓");
            router.push("/email/templates");
          } else {
            toast.error("Failed to update template");
          }
        } else {
          // --- Create Mode ---
          const { data: createRes } = await createTemplate({
            variables: {
              input: { name: name.trim(), subject: subject.trim(), html, json },
            },
          });

          if (createRes?.createEmailTemplate?.id) {
            const newTemplate: EmailTemplate = {
              id: createRes.createEmailTemplate.id,
              name: name.trim(),
              subject: subject.trim(),
              html,
              json,
              updatedAt: new Date().toISOString(),
            };
            addTemplate(newTemplate);
            toast.success("Template saved ✓");
            router.push("/email/templates");
          } else {
            toast.error("Failed to save template");
          }
        }
      } catch (e: any) {
        console.error("Save Error:", e);
        toast.error(e.message || "Failed to finalize template");
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-[#FBFBFC]">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
          <button
            onClick={() => router.push("/email/templates")}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 shrink-0"
            title="Back to templates"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-6 min-w-0 flex-1">
            {/* Alias / Template Name Input */}
            <div className="flex flex-col min-w-[180px] max-w-[280px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                Template Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Community Welcome…"
                className="text-[14px] font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-slate-300 w-full"
              />
            </div>

            <div className="h-8 w-px bg-slate-200 shrink-0" />

            {/* Default Subject Input */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-1">
                <Mail className="h-2.5 w-2.5" />
                Default Subject
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Add an outbound email subject line…"
                className="text-[13px] font-medium text-slate-600 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-slate-300 w-full truncate"
              />
            </div>
          </div>
        </div>

        {/* ── Action Toolbar ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Undo / Redo controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
            <button
              onClick={handleUndo}
              disabled={!isEditorReady}
              className="h-7 w-7 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 transition-all"
              title="Undo"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!isEditorReady}
              className="h-7 w-7 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 transition-all"
              title="Redo"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          {/* Device Preview Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => handleDevicePreview("desktop")}
              disabled={!isEditorReady}
              className={cn(
                "h-7 px-3 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold transition-all disabled:opacity-40",
                activePreviewDevice === "desktop"
                  ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              )}
              title="Desktop Preview"
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              onClick={() => handleDevicePreview("mobile")}
              disabled={!isEditorReady}
              className={cn(
                "h-7 px-3 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold transition-all disabled:opacity-40",
                activePreviewDevice === "mobile"
                  ? "bg-white text-slate-900 border border-slate-200 shadow-xs"
                  : "text-slate-500 hover:text-slate-700"
              )}
              title="Mobile Preview"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>

          {activePreviewDevice && (
            <button
              onClick={handleExitPreview}
              className="h-7 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center gap-1 text-[11px] font-semibold transition-all"
            >
              <EyeOff className="h-3 w-3" />
              Exit Preview
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Save Button */}
          <CtaButton
            onClick={handleSave}
            disabled={isSaving || !isEditorReady}
            className="h-9 px-5 text-[12px] rounded-xl font-medium shadow-xs"
          >
            {isSaving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isSaving ? "Saving…" : "Save Template"}
          </CtaButton>
        </div>
      </header>

      {/* ── Unlayer Editor Canvas ─────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative flex flex-col bg-white">
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          options={unlayerOptions}
          minHeight="100%"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
