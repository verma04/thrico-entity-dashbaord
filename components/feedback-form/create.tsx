"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye } from "lucide-react";
import { AutosaveIndicator } from "./autosave-indicator";
import { useFormStore } from "@/store/useFormStore";
import { useSurveyEditor } from "./hooks/use-survey-editor";
import Settings from "./settings";
import Preview from "./preview/preview";
import { QuestionListSidebar } from "./editor/question-list-sidebar";
import { Canvas } from "./editor/canvas";
import { PropertiesPanel } from "./editor/properties-panel";

interface NewFormPageProps {
  onPublish: () => void;
  onClose: () => void;
}

export default function NewFormPage({ onPublish, onClose }: NewFormPageProps) {
  const { formSettings, formTitle, setFormTitle, formDescription, questions } =
    useFormStore();
  const { updateFormSetting } = useSurveyEditor();
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Bar for Tabs */}
      <div className="bg-white dark:bg-zinc-900 border-b border-[#e1e3e5] dark:border-zinc-800 px-4 h-14 flex items-center justify-between shrink-0 z-10 sticky top-0 shadow-2xs">
        <div className="flex items-center gap-3 w-1/3">
          {/* Left: Back & Title */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-[4px] shrink-0 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 cursor-pointer"
            onClick={onClose}
          >
            <ChevronLeft className="h-4 w-4 text-[#616161]" />
          </Button>
          <div className="flex flex-col flex-1">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="font-semibold text-[13px] text-[#303030] dark:text-zinc-100 leading-none border-none hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 px-1.5 py-1 rounded-[4px] focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-[#005bd3] transition-all outline-none w-full max-w-[220px]"
              placeholder="Untitled Form"
            />
          </div>
        </div>

        <div className="flex justify-center w-1/3">
          {/* Center: Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="bg-transparent p-0 gap-5">
              {["edit", "preview", "settings"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#303030] dark:data-[state=active]:text-zinc-100 text-[#616161] border-b-2 border-transparent data-[state=active]:border-[#303030] dark:data-[state=active]:border-zinc-100 rounded-none px-1.5 py-1 text-[12.5px] transition-all font-semibold capitalize"
                >
                  {tab === "edit"
                    ? "Edit"
                    : tab === "preview"
                      ? "Preview"
                      : "Settings"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-end gap-2.5 w-1/3">
          {/* Right: Actions */}
          <Button
            variant="ghost"
            size="sm"
            className="text-[#616161] text-[12px] h-[30px] hidden md:flex rounded-[4px] cursor-pointer"
            onClick={() => setActiveTab("preview")}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Preview
          </Button>
          <Button
            size="sm"
            className="h-[34px] rounded-[6px] px-4 font-semibold text-[12.5px] bg-[#303030] hover:bg-[#202020] text-white cursor-pointer shadow-2xs"
            onClick={onPublish}
          >
            Publish Form
          </Button>
          <AutosaveIndicator isSaving={false} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === "edit" ? (
          <div className="flex h-full">
            {/* Left Sidebar - Question List */}
            <QuestionListSidebar />

            {/* Center - Canvas */}
            <Canvas />

            {/* Right Sidebar - Properties */}
            <PropertiesPanel />
          </div>
        ) : activeTab === "preview" ? (
          <div className="h-full overflow-y-auto p-6">
            <Preview
              formTitle={formTitle}
              formDescription={formDescription}
              questions={questions}
              formSettings={formSettings}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6 max-w-4xl mx-auto">
            <Settings
              formSettings={formSettings}
              updateFormSetting={updateFormSetting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
