"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface MilestonesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const MilestonesModule = ({
  module,
  previewDevice,
}: MilestonesModuleProps) => {
  const { content, layout } = module;
  const milestones = content.milestones || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {milestones.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-muted-foreground">
              No milestones added yet. Add milestones in the settings panel.
            </p>
          </div>
        )}

        {milestones.length > 0 && (
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200" />
            {milestones.map((milestone: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center mb-8 ${
                  idx % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`w-1/2 ${
                    idx % 2 === 0 ? "pr-8 text-right" : "pl-8"
                  }`}
                >
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">
                      {milestone.title || `Milestone ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description ||
                        "Achievement description goes here"}
                    </p>
                    {milestone.date && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {milestone.date}
                      </p>
                    )}
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white" />
              </div>
            ))}
          </div>
        )}
    </ModuleContainer>
  );
};
