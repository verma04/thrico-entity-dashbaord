"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

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
  if (layout === "link-columns") {
    return (
      <section className="py-16 bg-background border-y">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Sitemap"}
            </h2>
            <p className="text-muted-foreground">
              {content.description || "Navigate through our website"}
            </p>
          </div>

          {sections.length === 0 && (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No sitemap sections added yet. Add sections in the settings
                panel.
              </p>
            </div>
          )}

          {sections.length > 0 && (
            <div
              className={cn(
                "grid gap-8",
                isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
              )}
            >
              {sections.map((section: any, idx: number) => (
                <div key={idx}>
                  <h3 className="font-semibold text-lg mb-4 text-foreground">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <ul className="space-y-2.5">
                    {(section.links || []).map((link: any, linkIdx: number) => (
                      <li key={linkIdx}>
                        <a
                          href={link.url || "#"}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                        >
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
      </section>
    );
  }

  // Grouped Sections Layout
  if (layout === "grouped-sections") {
    return (
      <section className="py-16 bg-slate-50">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Sitemap"}
            </h2>
            <p className="text-muted-foreground">
              {content.description || "Navigate through our website"}
            </p>
          </div>

          {sections.length > 0 && (
            <div className="space-y-8">
              {sections.map((section: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border p-6 md:p-8 shadow-sm"
                >
                  <h3 className="font-bold text-xl mb-6 text-foreground border-b pb-3">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <div
                    className={cn(
                      "grid gap-4",
                      isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
                    )}
                  >
                    {(section.links || []).map((link: any, linkIdx: number) => (
                      <a
                        key={linkIdx}
                        href={link.url || "#"}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-primary/5"
                      >
                        {link.label || `Link ${linkIdx + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Footer Style Layout
  if (layout === "footer-style") {
    return (
      <section className="py-12 bg-slate-900 text-white">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {content.title || "Sitemap"}
            </h2>
            <p className="text-slate-400 text-sm">
              {content.description || "Navigate through our website"}
            </p>
          </div>

          {sections.length > 0 && (
            <div
              className={cn(
                "grid gap-8",
                isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
              )}
            >
              {sections.map((section: any, idx: number) => (
                <div key={idx}>
                  <h3 className="font-semibold mb-4 text-white">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <ul className="space-y-2">
                    {(section.links || []).map((link: any, linkIdx: number) => (
                      <li key={linkIdx}>
                        <a
                          href={link.url || "#"}
                          className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
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
      </section>
    );
  }

  // Accordion Sections Layout
  if (layout === "accordion-sections") {
    return (
      <section className="py-16 bg-background">
        <div className={cn("container mx-auto max-w-4xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Sitemap"}
            </h2>
            <p className="text-muted-foreground">
              {content.description || "Navigate through our website"}
            </p>
          </div>

          {sections.length > 0 && (
            <div className="space-y-3">
              {sections.map((section: any, idx: number) => {
                const isExpanded = expandedSections.includes(idx);
                return (
                  <div
                    key={idx}
                    className="border rounded-lg overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="font-semibold text-lg text-left">
                        {section.title || `Section ${idx + 1}`}
                      </h3>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t bg-slate-50/50">
                        <div
                          className={cn(
                            "grid gap-3 pt-4",
                            isMobile ? "grid-cols-1" : "grid-cols-2"
                          )}
                        >
                          {(section.links || []).map(
                            (link: any, linkIdx: number) => (
                              <a
                                key={linkIdx}
                                href={link.url || "#"}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-white"
                              >
                                {link.label || `Link ${linkIdx + 1}`}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Tree View Layout
  if (layout === "tree-view") {
    return (
      <section className="py-16 bg-background">
        <div className={cn("container mx-auto max-w-5xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || "Sitemap"}
            </h2>
            <p className="text-muted-foreground">
              {content.description || "Navigate through our website"}
            </p>
          </div>

          {sections.length > 0 && (
            <div className="space-y-6">
              {sections.map((section: any, idx: number) => (
                <div key={idx} className="border-l-2 border-primary pl-6">
                  <h3 className="font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary -ml-[1.6rem]" />
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <div className="space-y-2 ml-4">
                    {(section.links || []).map((link: any, linkIdx: number) => (
                      <div key={linkIdx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        <a
                          href={link.url || "#"}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label || `Link ${linkIdx + 1}`}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Minimal List Layout
  if (layout === "minimal-list") {
    return (
      <section className="py-16 bg-white">
        <div className={cn("container mx-auto max-w-3xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">
              {content.title || "Sitemap"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {content.description || "Navigate through our website"}
            </p>
          </div>

          {sections.length > 0 && (
            <div className="space-y-8">
              {sections.map((section: any, idx: number) => (
                <div key={idx} className="border-b pb-6 last:border-b-0">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    {section.title || `Section ${idx + 1}`}
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {(section.links || []).map((link: any, linkIdx: number) => (
                      <a
                        key={linkIdx}
                        href={link.url || "#"}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {link.label || `Link ${linkIdx + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default fallback
  return null;
};
