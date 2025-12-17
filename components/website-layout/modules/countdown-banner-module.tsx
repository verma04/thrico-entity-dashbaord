"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface CountdownBannerModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const CountdownBannerModule = ({
  module,
  previewDevice,
}: CountdownBannerModuleProps) => {
  const { content, layout } = module;

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-y">
      <div className="text-center">
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          titleClassName="text-white"
          descriptionClassName="opacity-90"
        />
        <div className="flex justify-center gap-4 mb-6">
          {["Days", "Hours", "Minutes", "Seconds"].map((unit, idx) => (
            <div key={unit} className="text-center">
              <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-xl font-bold">
                  {["15", "08", "42", "30"][idx]}
                </div>
              </div>
              <div className="text-xs mt-1 opacity-75">{unit}</div>
            </div>
          ))}
        </div>
        <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Claim Now
        </button>
      </div>
    </ModuleContainer>
  );
};
