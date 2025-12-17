"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface ResourcesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const ResourcesModule = ({
  module,
  previewDevice,
}: ResourcesModuleProps) => {
  const { content, layout } = module;
  const resources = content.resources || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {resources.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground">
              No resources added yet. Add resources in the settings panel.
            </p>
          </div>
        )}

        {resources.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {resource.icon ? (
                    <img
                      src={resource.icon}
                      alt={resource.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    "📄"
                  )}
                </div>
                <h3 className="font-semibold mb-2">
                  {resource.title || `Resource ${idx + 1}`}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description || "Download our comprehensive guide"}
                </p>
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium"
                  >
                    Download →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
    </ModuleContainer>
  );
};
