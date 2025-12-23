"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye } from "lucide-react";
import { useFormStore } from "@/store/useFormStore";
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
  const {
    formSettings,
    formTitle,
    setFormTitle,
    formDescription,
    updateFormSetting,
    questions,
  } = useFormStore();
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="h-[calc(100vh)] bg-gray-50 flex flex-col">
      {/* Top Bar for Tabs */}
      <div className="bg-white border-b px-4 h-16 flex items-center justify-between shrink-0 z-10 sticky top-0 relative shadow-sm">
        <div className="flex items-center gap-4 w-1/3">
          {/* Left: Back & Title */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </Button>
          <div className="flex flex-col flex-1">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="font-semibold text-sm text-gray-900 leading-none border-none hover:bg-gray-100 p-1 rounded focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none w-full max-w-[200px]"
              placeholder="Untitled Form"
            />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1 px-1">
              Draft
            </span>
          </div>
        </div>

        <div className="flex justify-center w-1/3">
          {/* Center: Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="bg-transparent p-0 gap-6">
              {["edit", "preview", "settings"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black text-gray-500 border-b-2 border-transparent data-[state=active]:border-black rounded-none px-2 py-2 transition-all font-medium capitalize"
                >
                  {tab === "edit"
                    ? "Create"
                    : tab === "preview"
                    ? "Connect"
                    : "Share"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/3">
          {/* Right: Actions */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hidden md:flex"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            className="bg-black hover:bg-gray-800 text-white px-6 rounded-md font-medium"
            onClick={onPublish}
          >
            Publish
          </Button>
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
          <div className="h-full overflow-y-auto p-8">
            <Preview
              formTitle={formTitle}
              formDescription={formDescription}
              questions={questions}
              formSettings={formSettings}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-8 max-w-4xl mx-auto">
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
