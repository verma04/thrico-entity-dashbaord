import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleContainer } from "./module-container";
import * as LucideIcons from "lucide-react";
import { Info } from "lucide-react";

interface CalloutModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function CalloutModule({ module, previewDevice }: CalloutModuleProps) {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  // Helper to render Lucide icon
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  // Get color scheme based on type
  const getColorScheme = (type: string) => {
    const schemes: Record<
      string,
      { bg: string; border: string; icon: string; text: string; button: string }
    > = {
      info: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "bg-blue-500",
        text: "text-blue-800",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      warning: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: "bg-yellow-500",
        text: "text-yellow-800",
        button: "bg-yellow-600 hover:bg-yellow-700",
      },
      success: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "bg-green-500",
        text: "text-green-800",
        button: "bg-green-600 hover:bg-green-700",
      },
      error: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "bg-red-500",
        text: "text-red-800",
        button: "bg-red-600 hover:bg-red-700",
      },
      tip: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "bg-purple-500",
        text: "text-purple-800",
        button: "bg-purple-600 hover:bg-purple-700",
      },
      announcement: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        icon: "bg-indigo-500",
        text: "text-indigo-800",
        button: "bg-indigo-600 hover:bg-indigo-700",
      },
    };
    return schemes[type] || schemes.info;
  };

  const colors = getColorScheme(content.type || "info");

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className={`${colors.bg} ${colors.border} border-y`}
    >
      {/* Info Box Layout */}
      {layout === "info-box" && (
        <div
          className={`flex items-start gap-4 p-4 bg-white rounded-lg border ${colors.border}`}
        >
          <div
            className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center text-white flex-shrink-0`}
          >
            {renderIcon(content.icon, "w-5 h-5") || (
              <Info className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${colors.text}`}>
              {content.heading || "Information"}
            </h3>
            <p className={`text-sm ${colors.text} opacity-90`}>
              {content.message || "Important information for users."}
            </p>
            {content.showButton && content.buttonUrl && (
              <a
                href={content.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block mt-3 ${colors.button} text-white px-4 py-1.5 rounded text-xs font-medium transition-colors`}
              >
                {content.buttonText || "Learn More"}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Banner Style Layout */}
      {layout === "banner-style" && (
        <div className={`${colors.bg} border-y ${colors.border}`}>
          <div
            className={`flex ${
              isMobile
                ? "flex-col items-start gap-4"
                : "flex-row items-center justify-between gap-4"
            } p-4`}
          >
            <div
              className={`flex items-center gap-4 ${isMobile ? "w-full" : ""}`}
            >
              <div
                className={`w-12 h-12 ${colors.icon} rounded-full flex items-center justify-center text-white flex-shrink-0`}
              >
                {renderIcon(content.icon, "w-6 h-6") || (
                  <Info className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>
                  {content.heading || "Banner Notice"}
                </h3>
                <p className={`text-sm ${colors.text} opacity-90`}>
                  {content.message || "Important announcement or notice."}
                </p>
              </div>
            </div>
            {content.showButton && content.buttonUrl && (
              <a
                href={content.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  colors.button
                } text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMobile
                    ? "w-full text-center"
                    : "flex-shrink-0 whitespace-nowrap"
                }`}
              >
                {content.buttonText || "Learn More"}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Card Callout Layout */}
      {layout === "card-callout" && (
        <div className="max-w-2xl mx-auto">
          <div
            className={`bg-white rounded-xl shadow-lg border ${colors.border} overflow-hidden`}
          >
            <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center text-white`}
                >
                  {renderIcon(content.icon, "w-5 h-5") || (
                    <Info className="w-5 h-5" />
                  )}
                </div>
                <h3 className={`font-bold text-lg ${colors.text}`}>
                  {content.heading || "Important Card"}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className={`${colors.text} mb-4`}>
                {content.message ||
                  "This is an important message in card format with clear visual hierarchy."}
              </p>
              {content.showButton && content.buttonUrl && (
                <a
                  href={content.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block ${
                    colors.button
                  } text-white px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    isMobile ? "w-full text-center" : ""
                  }`}
                >
                  {content.buttonText || "Take Action"}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Note Layout */}
      {layout === "sidebar-note" && (
        <div
          className={`border-l-4 ${colors.border} ${colors.bg} bg-opacity-50 p-4`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`${colors.icon} rounded p-1.5 flex items-center justify-center text-white mt-0.5`}
            >
              {renderIcon(content.icon, "w-4 h-4") || (
                <Info className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold text-sm mb-1 ${colors.text}`}>
                {content.heading || "Note"}
              </h4>
              <p
                className={`text-xs ${colors.text} opacity-90 leading-relaxed`}
              >
                {content.message || "A helpful note or tip for users."}
              </p>
              {content.showButton && content.buttonUrl && (
                <a
                  href={content.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block mt-2 text-xs font-medium ${colors.text} underline hover:no-underline`}
                >
                  {content.buttonText || "Learn More"} →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
}
