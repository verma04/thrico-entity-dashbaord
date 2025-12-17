"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleContainer } from "./module-container";

interface AnnouncementModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const AnnouncementModule = ({
  module,
  previewDevice,
}: AnnouncementModuleProps) => {
  const { content, layout } = module;

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-blue-600 text-white border-y">
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="font-semibold">📢</span>
          <span>
            {content.message ||
              "Important announcement: New features available now!"}
          </span>
          {content.link && (
            <button className="underline hover:no-underline">
              Learn more →
            </button>
          )}
        </div>
    </ModuleContainer>
  );
};
