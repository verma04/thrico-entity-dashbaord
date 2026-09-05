"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Code, AlertTriangle } from "lucide-react";
import { ModuleHeader } from "./module-header";

interface EmbedBlockModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const EmbedBlockModule = ({
  module,
  previewDevice,
}: EmbedBlockModuleProps) => {
  const { content, layout } = module;
  const embedCode = content.embedCode || "";

  // Check if embed code exists
  const hasEmbedCode = embedCode.trim().length > 0;

  return (
    <div className="p-4 sm:p-8 md:p-12 bg-gray-50 border-y">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ModuleHeader
          title={content.title}
          description={content.description}
          alignment="center"
          titleClassName="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
          descriptionClassName="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto"
          titleColor={content.titleColor}
          descriptionColor={content.descriptionColor}
          hideTitle={content.hideTitle}
          hideDescription={content.hideDescription}
        />

        {/* Embed Content */}
        {hasEmbedCode ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Safety Warning for Preview */}
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <strong>Preview Mode:</strong> Embedded content from external
                sources
              </p>
            </div>

            {/* Embedded Content Container */}
            <div
              className="w-full overflow-visible"
              dangerouslySetInnerHTML={{ __html: embedCode }}
            />
          </div>
        ) : (
          // Empty State
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Code className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base mb-2">
              No embedded content yet
            </p>
            <p className="text-xs text-muted-foreground">
              Add embed code in the settings panel to display content here
            </p>
          </div>
        )}

        {/* Info Footer */}
        {hasEmbedCode && (
          <div className="mt-4 px-4">
            <p className="text-xs text-center text-muted-foreground">
              Embedded content may not display correctly in preview mode. View
              on live site for best results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
