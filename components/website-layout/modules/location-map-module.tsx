"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";

interface LocationMapModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const LocationMapModule = ({
  module,
  previewDevice,
}: LocationMapModuleProps) => {
  const { content, layout } = module;

  return (
    <div className="border-y">
      <div className="h-96 bg-gray-200 relative flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
            📍
          </div>
          <h3 className="font-semibold mb-2">
            {content.title || "Our Location"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {content.address || "123 Business St, City, State 12345"}
          </p>
        </div>
      </div>
    </div>
  );
};
