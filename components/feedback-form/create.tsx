"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Eye,
  Layers,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { AutosaveIndicator } from "./autosave-indicator";
import { useFormStore } from "@/store/useFormStore";
import { useSurveyEditor } from "./hooks/use-survey-editor";
import Settings from "./settings";
import Preview from "./preview/preview";
import { QuestionListSidebar } from "./editor/question-list-sidebar";
import { Canvas } from "./editor/canvas";
import { PropertiesPanel } from "./editor/properties-panel";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface NewFormPageProps {
  onPublish: () => void;
  onClose?: () => void;
  showBack?: boolean;
}

export default function NewFormPage({
  onPublish,
  onClose,
  showBack = false,
}: NewFormPageProps) {
  const {
    formSettings,
    formTitle,
    setFormTitle,
    formDescription,
    questions,
    loadForm,
  } = useFormStore();
  const { updateFormSetting } = useSurveyEditor();
  const [activeTab, setActiveTab] = useState("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Snapshot tracking for dirty state
  const initialSnapshotRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current && questions.length > 0) {
      initialSnapshotRef.current = JSON.stringify({
        questions,
        formSettings,
        formTitle,
        formDescription,
      });
      isInitializedRef.current = true;
    }
  }, [questions, formSettings, formTitle, formDescription]);

  const currentSnapshot = JSON.stringify({
    questions,
    formSettings,
    formTitle,
    formDescription,
  });

  const hasChanged = Boolean(
    isInitializedRef.current &&
      initialSnapshotRef.current &&
      currentSnapshot !== initialSnapshotRef.current,
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onPublish();
      initialSnapshotRef.current = currentSnapshot;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save questions");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (initialSnapshotRef.current) {
      try {
        const initialData = JSON.parse(initialSnapshotRef.current);
        loadForm(initialData);
        toast.info("Changes discarded");
      } catch (e) {
        console.error("Failed to discard changes", e);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-125px)] bg-background flex flex-col overflow-hidden border-t border-border/60">
      {/* Studio Sub-Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border px-3.5 h-10 flex items-center justify-between shrink-0 z-10 sticky top-0 shadow-2xs">
        {/* Left: Optional Back + Question Stats */}
        <div className="flex items-center gap-2.5">
          {showBack && onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md shrink-0 hover:bg-muted cursor-pointer"
              onClick={onClose}
            >
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="h-5 px-1.5 text-[10px] font-medium gap-1 border-border bg-muted/40 text-foreground"
            >
              <Layers className="h-2.5 w-2.5 text-primary" />
              <span>{questions.length} Questions</span>
            </Badge>
            <div className="hidden sm:flex items-center gap-1.5 text-[10.5px] text-muted-foreground pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autosave active</span>
            </div>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex justify-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="h-7 bg-muted/60 p-0.5 rounded-md border border-border/60">
              <TabsTrigger
                value="edit"
                className="h-6 px-2.5 text-[11px] font-semibold rounded-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs transition-all cursor-pointer"
              >
                Edit
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-6 px-2.5 text-[11px] font-semibold rounded-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs transition-all cursor-pointer"
              >
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right: Quick Preview Toggle */}
        <div className="flex items-center justify-end gap-1.5">
          {activeTab === "edit" ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px] font-medium gap-1.5 border-border shadow-2xs hover:bg-accent rounded-md cursor-pointer"
              onClick={() => setActiveTab("preview")}
            >
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span>Live Preview</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px] font-medium gap-1.5 border-border shadow-2xs hover:bg-accent rounded-md cursor-pointer"
              onClick={() => setActiveTab("edit")}
            >
              <span>Back to Editor</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Canvas / Preview Pane */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "edit" ? (
          <div className="flex h-full w-full">
            {/* Left Sidebar - Question List */}
            <QuestionListSidebar />

            {/* Center - Canvas */}
            <Canvas />

            {/* Right Sidebar - Properties */}
            <PropertiesPanel />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-8 bg-muted/20">
            <Preview
              formTitle={formTitle}
              formDescription={formDescription}
              questions={questions}
              formSettings={formSettings}
            />
          </div>
        )}
      </div>

      {/* Non-blocking Floating Save Panel */}
      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={isSaving}
        title="Unsaved Question Changes"
        saveButtonText="Save Questions"
        discardButtonText="Discard"
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  );
}
