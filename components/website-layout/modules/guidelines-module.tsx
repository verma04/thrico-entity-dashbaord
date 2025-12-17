"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface GuidelinesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const GuidelinesModule = ({
  module,
  previewDevice,
}: GuidelinesModuleProps) => {
  const { content, layout } = module;
  const guidelines = content.guidelines || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {guidelines.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-muted-foreground">
              No guidelines added yet. Add guidelines in the settings panel.
            </p>
          </div>
        )}

        {/* Simple List Layout */}
        {layout === "simple-list" && guidelines.length > 0 && (
          <div className="space-y-6">
            {guidelines.map((guideline: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    {guideline.title || `Guideline ${idx + 1}`}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {guideline.description ||
                      "Description of this community rule and expected behavior."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Numbered Rules Layout */}
        {layout === "numbered-rules" && guidelines.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {guidelines.map((guideline: any, idx: number) => (
              <div
                key={idx}
                className="bg-blue-50 p-6 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-blue-900">
                    {guideline.title || `Rule ${idx + 1}`}
                  </h3>
                </div>
                <p className="text-blue-800 text-sm">
                  {guideline.description ||
                    "Detailed explanation of this community rule and what members should follow."}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Accordion Rules Layout */}
        {layout === "accordion-rules" && guidelines.length > 0 && (
          <div className="space-y-4">
            {guidelines.map((guideline: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100">
                  <h3 className="font-semibold">
                    {guideline.title || `Community Rule ${idx + 1}`}
                  </h3>
                  <span className="text-gray-400">▼</span>
                </div>
                <div className="p-4 border-t">
                  <p className="text-muted-foreground text-sm">
                    {guideline.description ||
                      "Detailed explanation of this rule, including examples and consequences for violations."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Guidelines Layout */}
        {layout === "card-guidelines" && guidelines.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {guidelines.map((guideline: any, idx: number) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-semibold mb-3">
                  {guideline.title || `Guideline ${idx + 1}`}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {guideline.description ||
                    "Clear and concise rule for community members to follow."}
                </p>
              </div>
            ))}
          </div>
        )}
    </ModuleContainer>
  );
};
