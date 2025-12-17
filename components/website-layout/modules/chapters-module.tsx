"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface ChaptersModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const ChaptersModule = ({
  module,
  previewDevice,
}: ChaptersModuleProps) => {
  const { content, layout } = module;
  const chapters = content.chapters || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {chapters.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground">
              No chapters added yet. Add chapters in the settings panel.
            </p>
          </div>
        )}

        {/* Location Grid Layout */}
        {layout === "location-grid" && chapters.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {chapters.map((chapter: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  📍
                </div>
                <h3 className="font-semibold mb-2">
                  {chapter.name || `Chapter ${idx + 1}`}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {chapter.location || "Location"}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {chapter.memberCount || 0} members
                </p>
                <button className="text-blue-600 text-sm font-medium">
                  Join Chapter →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Map View Layout */}
        {layout === "map-view" && chapters.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  🗺️
                </div>
                <p className="text-gray-600">Interactive Map View</p>
              </div>
            </div>
            <div className="space-y-4">
              {chapters.map((chapter: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg border flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    📍
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {chapter.name || `Chapter ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chapter.location || "Location"} •{" "}
                      {chapter.memberCount || 0} members
                    </p>
                  </div>
                  <button className="text-blue-600 text-sm font-medium">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List Chapters Layout */}
        {layout === "list-chapters" && chapters.length > 0 && (
          <div className="space-y-4">
            {chapters.map((chapter: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    📍
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {chapter.name || `Chapter ${idx + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chapter.location || "Location"} •{" "}
                      {chapter.memberCount || 0} members
                      {chapter.region && ` • ${chapter.region}`}
                    </p>
                    {chapter.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Join Chapter
                  </button>
                  {chapter.contact && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {chapter.contact}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Region Cards Layout */}
        {layout === "region-cards" && chapters.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {(() => {
              // Group chapters by region
              const groupedByRegion = chapters.reduce(
                (acc: any, chapter: any) => {
                  const region = chapter.region || "Other Regions";
                  if (!acc[region]) acc[region] = [];
                  acc[region].push(chapter);
                  return acc;
                },
                {}
              );

              return Object.entries(groupedByRegion).map(
                ([region, regionChapters]: [string, any]) => (
                  <div key={region} className="bg-white p-6 rounded-xl border">
                    <h3 className="text-lg font-bold mb-4 text-blue-600">
                      {region}
                    </h3>
                    <div className="space-y-3">
                      {regionChapters.map((chapter: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              📍
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {chapter.name || `Chapter ${idx + 1}`}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {chapter.memberCount || 0} members
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 text-xs font-medium">
                            Join
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              );
            })()}
          </div>
        )}
    </ModuleContainer>
  );
};
