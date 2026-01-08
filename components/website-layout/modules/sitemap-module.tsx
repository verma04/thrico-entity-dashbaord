"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Folder,
  Link as LinkIcon,
  FileText,
  CornerDownRight,
} from "lucide-react";
import { useState } from "react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface SitemapModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const SitemapModule = ({
  module,
  previewDevice,
}: SitemapModuleProps) => {
  const { content, layout } = module;
  const sections = content.sections || [];
  const isMobile = previewDevice === "mobile";
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Link Columns Layout (Default)
  if (layout === "link-columns" || !layout) {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-background border-y"
      >
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />

        <div className="mt-16 max-w-7xl mx-auto">
          {sections.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-4xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                No sitemap sections added yet.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-12 lg:gap-8",
                isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
              )}
            >
              {sections.map((section: any, idx: number) => (
                <div key={idx} className="flex flex-col">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <ul className="space-y-4">
                    {(section.links || []).map((link: any, linkIdx: number) => (
                      <li key={linkIdx}>
                        <a
                          href={link.url || "#"}
                          className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold flex items-center group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200 mr-3 group-hover:bg-blue-600 group-hover:scale-125 transition-all" />
                          {link.label || `Link ${linkIdx + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModuleContainer>
    );
  }

  // Grouped Sections Layout
  if (layout === "grouped-sections") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-slate-50 border-y"
      >
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />

        <div className="mt-16 max-w-7xl mx-auto space-y-8">
          {sections.map((section: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg">
                  #
                </div>
                {section.title || `Section ${idx + 1}`}
              </h3>
              <div
                className={cn(
                  "grid gap-6",
                  isMobile
                    ? "grid-cols-1"
                    : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                )}
              >
                {(section.links || []).map((link: any, linkIdx: number) => (
                  <a
                    key={linkIdx}
                    href={link.url || "#"}
                    className="group p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors">
                      {link.label || `Link ${linkIdx + 1}`}
                    </div>
                    <div className="mt-1 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ModuleContainer>
    );
  }

  // Footer Style Layout
  if (layout === "footer-style") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-slate-900 text-white border-y"
      >
        <ModuleHeader
          title={content.title || "Sitemap"}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="left"
          titleClassName="text-white"
          descriptionClassName="text-slate-400"
        />

        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              "grid gap-12 border-t border-white/10 pt-16",
              isMobile
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {sections.map((section: any, idx: number) => (
              <div key={idx}>
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-8">
                  {section.title || `Section ${idx + 1}`}
                </h3>
                <ul className="space-y-4">
                  {(section.links || []).map((link: any, linkIdx: number) => (
                    <li key={linkIdx}>
                      <a
                        href={link.url || "#"}
                        className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center group"
                      >
                        <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2">
                          /
                        </span>
                        {link.label || `Link ${linkIdx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="text-4xl font-black tracking-tighter text-white/10 select-none">
              SITESTRUCTURE_V2
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
              © {new Date().getFullYear()} THRICOSYSTEMS
            </div>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Accordion Sections Layout
  if (layout === "accordion-sections") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-background border-y"
      >
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />

        <div className="mt-16 max-w-3xl mx-auto space-y-4">
          {sections.map((section: any, idx: number) => {
            const isExpanded = expandedSections.includes(idx);
            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-4xl overflow-hidden transition-all duration-500",
                  isExpanded
                    ? "border-slate-900 bg-slate-50 shadow-xl"
                    : "border-slate-100 bg-white"
                )}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50/50 transition-colors group"
                >
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                      isExpanded
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}
                  >
                    {isExpanded ? (
                      <Minus size={18} strokeWidth={3} />
                    ) : (
                      <Plus size={18} strokeWidth={3} />
                    )}
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "p-8 pt-0 grid gap-4",
                        isMobile ? "grid-cols-1" : "sm:grid-cols-2"
                      )}
                    >
                      {(section.links || []).map(
                        (link: any, linkIdx: number) => (
                          <a
                            key={linkIdx}
                            href={link.url || "#"}
                            className="p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all text-sm font-bold text-slate-600 hover:text-slate-900"
                          >
                            {link.label || `Link ${linkIdx + 1}`}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ModuleContainer>
    );
  }

  // Tree View Layout
  if (layout === "tree-view") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-background border-y"
      >
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />

        <div className="max-w-5xl mx-auto">
          <div
            className={cn(
              "grid gap-x-16 gap-y-12",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {sections.map((section: any, idx: number) => (
              <div key={idx} className="relative group">
                {/* Main Vertical Line for the Section */}
                <div className="absolute left-3.5 top-10 bottom-0 w-px bg-slate-200 group-hover:bg-blue-200 transition-colors duration-300" />

                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110 duration-300">
                    <Folder size={16} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                </div>

                {/* Links List */}
                <ul className="space-y-3 relative">
                  {(section.links || []).map((link: any, linkIdx: number) => (
                    <li key={linkIdx} className="relative pl-12 group/item">
                      {/* Branch Line */}
                      <div className="absolute left-[14px] top-[-14px] bottom-1/2 w-px bg-slate-200 group-hover:bg-blue-200 transition-colors duration-300" />
                      <div className="absolute left-[14px] top-1/2 w-6 h-px bg-slate-200 group-hover:bg-blue-200 transition-colors duration-300" />

                      {/* Connector Dot */}
                      <div className="absolute left-[36px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-blue-500 transition-all duration-300 scale-75 group-hover/item:scale-100" />

                      <a
                        href={link.url || "#"}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-slate-50/50 transition-all duration-300"
                      >
                        <span className="text-sm font-medium text-slate-600 group-hover/item:text-slate-900 transition-colors">
                          {link.label || `Link ${linkIdx + 1}`}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-slate-300 group-hover/item:text-blue-500 opacity-50 group-hover/item:opacity-100 transform group-hover/item:translate-x-1 transition-all duration-300"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Minimal List Layout
  if (layout === "minimal-list") {
    return (
      <ModuleContainer
        containerSettings={content.containerSettings}
        className="bg-white border-y"
      >
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />

        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {sections.map((section: any, idx: number) => (
              <div key={idx} className="group">
                <div
                  className={cn(
                    "flex flex-col gap-8 md:gap-20",
                    isMobile ? "" : "md:flex-row md:items-start"
                  )}
                >
                  <div className="md:w-64 shrink-0">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">
                      Directory Section {idx + 1}
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                      {section.title}
                    </h3>
                    <div className="mt-4 h-1 w-12 bg-slate-900 group-hover:w-full transition-all duration-700 rounded-full" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-x-12 gap-y-6">
                      {(section.links || []).map(
                        (link: any, linkIdx: number) => (
                          <a
                            key={linkIdx}
                            href={link.url || "#"}
                            className="text-lg font-black text-slate-400 hover:text-slate-900 transition-all relative inline-block group/link"
                          >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/link:w-full transition-all duration-300" />
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Default fallback
  return null;
};
