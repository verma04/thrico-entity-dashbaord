"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";

interface RoadmapModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const RoadmapModule = ({
  module,
  previewDevice,
}: RoadmapModuleProps) => {
  const { content, layout } = module;
  const items = content.items || [];

  // Empty state
  if (items.length === 0) {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-slate-50 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              {content.title || "Our Roadmap"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {content.description || "Upcoming features and goals"}
            </p>
          </div>
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground text-sm sm:text-base">
              No roadmap items added yet. Add items in the settings panel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === "completed")
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === "in-progress")
      return <Clock className="h-5 w-5 text-blue-500" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "completed")
      return "bg-green-50 border-green-200 text-green-700";
    if (status === "in-progress")
      return "bg-blue-50 border-blue-200 text-blue-700";
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  // Layout 1: Horizontal Roadmap
  if (layout === "horizontal-roadmap") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-slate-50 to-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Our Roadmap"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Upcoming features and goals"}
            </p>
          </div>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-gray-200" />

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-primary z-10" />

                  {/* Card */}
                  <div
                    className={cn(
                      "mt-16 md:mt-20 bg-white rounded-xl border-2 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow",
                      getStatusColor(item.status)
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(item.status)}
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {item.quarter || `Phase ${idx + 1}`}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {item.title || `Milestone ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.description || "Feature description"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout 2: Vertical Timeline
  if (layout === "vertical-timeline") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-white border-y">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Our Roadmap"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Upcoming features and goals"}
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-gray-200" />

            {/* Items */}
            <div className="space-y-8 sm:space-y-12">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-12 sm:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-2.5 sm:left-6 top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary border-4 border-white shadow-lg z-10" />

                  {/* Card */}
                  <div className="bg-slate-50 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      {getStatusIcon(item.status)}
                      <span className="text-xs sm:text-sm font-semibold text-primary">
                        {item.quarter || `Q${idx + 1} 2024`}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          item.status === "completed" &&
                            "bg-green-100 text-green-700",
                          item.status === "in-progress" &&
                            "bg-blue-100 text-blue-700",
                          item.status === "planned" &&
                            "bg-gray-100 text-gray-700"
                        )}
                      >
                        {item.status === "completed"
                          ? "Completed"
                          : item.status === "in-progress"
                          ? "In Progress"
                          : "Planned"}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      {item.title || `Milestone ${idx + 1}`}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {item.description || "Feature description"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout 3: Milestone Grid
  if (layout === "milestone-grid") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Our Roadmap"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Upcoming features and goals"}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "bg-white rounded-xl p-5 sm:p-6 border-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-1",
                  item.status === "completed" && "border-green-300",
                  item.status === "in-progress" && "border-blue-300",
                  item.status === "planned" && "border-gray-300"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {item.quarter || `Q${idx + 1}`}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-semibold",
                      item.status === "completed" &&
                        "bg-green-100 text-green-700",
                      item.status === "in-progress" &&
                        "bg-blue-100 text-blue-700",
                      item.status === "planned" && "bg-gray-100 text-gray-700"
                    )}
                  >
                    {item.status === "completed"
                      ? "✓ Done"
                      : item.status === "in-progress"
                      ? "⟳ Active"
                      : "○ Planned"}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-3 line-clamp-2">
                  {item.title || `Milestone ${idx + 1}`}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-4">
                  {item.description || "Feature description"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout 4: Progress Steps
  if (layout === "progress-steps") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-white to-slate-50 border-y">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Our Roadmap"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Upcoming features and goals"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-6 sm:space-y-8">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="relative">
                {/* Connector Line */}
                {idx < items.length - 1 && (
                  <div className="hidden sm:block absolute left-8 top-20 bottom-0 w-0.5 bg-gray-200 -mb-8" />
                )}

                <div className="flex gap-4 sm:gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg",
                        item.status === "completed" &&
                          "bg-green-500 text-white",
                        item.status === "in-progress" &&
                          "bg-blue-500 text-white",
                        item.status === "planned" && "bg-gray-200 text-gray-600"
                      )}
                    >
                      {item.status === "completed" ? "✓" : idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-gray-100 hover:border-primary/30 transition-colors">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-primary">
                        {item.quarter || `Phase ${idx + 1}`}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-semibold",
                          item.status === "completed" &&
                            "bg-green-100 text-green-700",
                          item.status === "in-progress" &&
                            "bg-blue-100 text-blue-700",
                          item.status === "planned" &&
                            "bg-gray-100 text-gray-700"
                        )}
                      >
                        {item.status === "completed"
                          ? "Completed"
                          : item.status === "in-progress"
                          ? "In Progress"
                          : "Upcoming"}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">
                      {item.title || `Step ${idx + 1}`}
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground">
                      {item.description || "Feature description"}
                    </p>

                    {/* Progress Indicator */}
                    {item.status === "in-progress" && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-semibold text-blue-700">
                            In Development
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full animate-pulse"
                            style={{ width: "60%" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="p-12 bg-slate-50 border-y">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {content.title || "Our Roadmap"}
          </h2>
          <p className="text-muted-foreground">
            {content.description || "Upcoming features and goals"}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-lg border">
              <h3 className="font-bold mb-2">
                {item.title || `Item ${idx + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
