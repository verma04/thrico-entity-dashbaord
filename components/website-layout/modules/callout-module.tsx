import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleContainer } from "./module-container";

interface CalloutModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function CalloutModule({ module, previewDevice }: CalloutModuleProps) {
  const { layout, content } = module;

  return (
    <ModuleContainer 
      containerSettings={content.containerSettings}
      className={layout === "urgent-notice" ? "bg-red-50 border-red-200 border-y" : "bg-blue-50 border-blue-200 border-y"}
    >
        {/* Announcement Banner Layout */}
        {layout === "announcement-banner" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
              💡
            </div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">
              {content.title || "Important Notice"}
            </h2>
            <p className="text-blue-800 mb-6">
              {content.message ||
                "This is an important message or announcement for the community."}
            </p>
            {content.link && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            )}
          </div>
        )}

        {/* Highlight Box Layout */}
        {layout === "highlight-box" && (
          <div className="flex items-center gap-6 p-6 bg-white rounded-xl border border-blue-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
              ⭐
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2 text-blue-900">
                {content.title || "Featured Highlight"}
              </h2>
              <p className="text-blue-800 mb-4">
                {content.message ||
                  "This is a special announcement that deserves your attention."}
              </p>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                  Take Action
                </button>
                <button className="text-blue-600 px-4 py-2 rounded-lg font-medium text-sm border border-blue-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Urgent Notice Layout */}
        {layout === "urgent-notice" && (
          <div className="bg-white rounded-xl border-2 border-red-300 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    URGENT
                  </span>
                  <span className="text-red-600 text-sm font-medium">
                    Immediate Attention Required
                  </span>
                </div>
                <h2 className="text-lg font-bold text-red-800 mb-2">
                  {content.title || "Critical Update"}
                </h2>
                <p className="text-red-700 mb-4">
                  {content.message ||
                    "This requires immediate action from all members."}
                </p>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Take Action Now
                </button>
              </div>
            </div>
          </div>
        )}
    </ModuleContainer>
  );
}
