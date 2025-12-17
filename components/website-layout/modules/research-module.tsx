"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface ResearchModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const ResearchModule = ({
  module,
  previewDevice,
}: ResearchModuleProps) => {
  const { content, layout } = module;
  const papers = content.papers || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {papers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground">
              No research papers added yet. Add papers in the settings panel.
            </p>
          </div>
        )}

        {/* Publication List Layout */}
        {layout === "publication-list" && papers.length > 0 && (
          <div className="space-y-6">
            {papers.map((paper: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border flex items-start gap-6"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {paper.icon || "📊"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    {paper.title || `Research Paper ${idx + 1}`}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {paper.abstract ||
                      "Abstract or summary of the research findings and methodology."}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Published {paper.year || 2024 - idx}
                    </span>
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium"
                      >
                        Read Paper →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Research Layout */}
        {layout === "timeline-research" && papers.length > 0 && (
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-blue-200"></div>
            {papers.map((paper: any, idx: number) => (
              <div key={idx} className="relative flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  {paper.year || 2024 - idx}
                </div>
                <div className="bg-white rounded-lg border p-6 flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {paper.title || `Breakthrough Study ${idx + 1}`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {paper.description ||
                      "Comprehensive analysis revealing significant insights into the field. This research has implications for future developments and applications."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {paper.status || "Peer Reviewed"}
                    </span>
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium"
                      >
                        View Details →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Research Grid Layout */}
        {layout === "research-grid" && papers.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-lg border overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {paper.image ? (
                    <img
                      src={paper.image}
                      alt={paper.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-3xl">📊</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">
                    {paper.title || `Study ${idx + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {paper.summary ||
                      "Key findings from our latest research initiative."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {paper.year || 2024 - idx}
                    </span>
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium"
                      >
                        Read →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Research Layout */}
        {layout === "featured-research" && papers.length > 0 && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">
                    Featured Research: Innovation Study 2024
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Groundbreaking research revealing new insights into
                    community-driven innovation and collaboration patterns.
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      Download Paper
                    </button>
                    <button className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                      View Abstract
                    </button>
                  </div>
                </div>
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-lg flex items-center justify-center ml-6">
                  <div className="text-3xl">🔬</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {papers.slice(0, 4).map((paper: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">
                    {paper.title || `Research Project ${idx + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {paper.description ||
                      "Ongoing research initiative exploring various aspects of our field."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      {paper.status || "In Progress"}
                    </span>
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </ModuleContainer>
  );
};
