"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";

interface EventCountdownModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const EventCountdownModule = ({
  module,
  previewDevice,
}: EventCountdownModuleProps) => {
  const { content, layout } = module;

  return (
    <div className="p-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-y">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {content.title || "Next Event"}
        </h2>
        <p className="mb-6 opacity-90">
          {content.description || "Don't miss our upcoming event"}
        </p>
        <div className="flex justify-center gap-6 mb-6">
          {["Days", "Hours", "Minutes", "Seconds"].map((unit, idx) => (
            <div key={unit} className="text-center">
              <div className="bg-white/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-2xl font-bold">
                  {["07", "14", "23", "45"][idx]}
                </div>
              </div>
              <div className="text-sm mt-2 opacity-75">{unit}</div>
            </div>
          ))}
        </div>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Register Now
        </button>
      </div>
    </div>
  );
};
