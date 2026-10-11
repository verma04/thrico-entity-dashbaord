"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Rocket,
  Smartphone,
  Code2,
  Undo2,
  Redo2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { PromptGenerationPanel } from "../panels/prompt-generation-panel";
import { GeneratedGalleryPanel } from "../panels/generated-gallery-panel";
import { ARLivePreviewCanvas } from "../preview/ar-live-preview-canvas";
import { PropertiesInspectorPanel } from "../panels/properties-inspector-panel";
import { PublishVersionModal } from "../modals/publish-version-modal";
import { TestDeviceModal } from "../modals/test-device-modal";
import { ManifestViewerModal } from "../modals/manifest-viewer-modal";
import { toast } from "sonner";

export function AIFilterStudioWorkspace() {
  const {
    manifest,
    isDirty,
    setManifestName,
    undo,
    redo,
    historyIndex,
    history,
  } = useFilterStudioStore();

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [manifestModalOpen, setManifestModalOpen] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] min-h-[700px] w-full select-none">
      {/* Studio Top Control Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border/70 shrink-0">
        {/* Left: Filter Title & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <Input
              value={manifest.name}
              onChange={(e) => setManifestName(e.target.value)}
              className="h-7 text-xs font-bold border-transparent hover:border-border focus:border-border bg-transparent w-[220px] transition-all px-1.5"
              title="Click to rename filter"
            />
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-indigo-500/30 text-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20"
          >
            v{manifest.version}
          </Badge>
          {isDirty ? (
            <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Changes
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Published
            </span>
          )}
        </div>

        {/* Center: History Undo/Redo */}
        <div className="flex items-center gap-1 bg-muted/30 p-0.5 rounded-lg border border-border/60">
          <Button
            size="icon"
            variant="ghost"
            disabled={!canUndo}
            onClick={undo}
            className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={!canRedo}
            onClick={redo}
            className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setManifestModalOpen(true)}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Manifest</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeviceModalOpen(true)}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Test on Device</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveDraft}
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setPublishModalOpen(true)}
            className="h-8 text-xs gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer font-medium"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>Publish Version</span>
          </Button>
        </div>
      </div>

      {/* Main 4-Area Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden bg-background">
        {/* Left Column (Cols 1-4): Panel 1 (Prompt) & Panel 2 (Gallery) */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">
          <PromptGenerationPanel />
          <GeneratedGalleryPanel />
        </div>

        {/* Middle Column (Cols 5-8): Panel 3 (Live AR Canvas Preview) */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[460px]">
          <ARLivePreviewCanvas />
        </div>

        {/* Right Column (Cols 9-12): Panel 4 (Properties Inspector & Layer Stack) */}
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pl-1">
          <PropertiesInspectorPanel />
        </div>
      </div>

      {/* Modals */}
      <PublishVersionModal
        open={publishModalOpen}
        onOpenChange={setPublishModalOpen}
      />
      <TestDeviceModal
        open={deviceModalOpen}
        onOpenChange={setDeviceModalOpen}
      />
      <ManifestViewerModal
        open={manifestModalOpen}
        onOpenChange={setManifestModalOpen}
      />
    </div>
  );
}
