"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  Sparkles,
  ArrowRight,
  Download,
  Binary,
  Share2,
  FileText,
  ExternalLink,
  BookOpen,
  Quote,
  Search,
  Filter,
  GraduationCap,
  Laptop,
  Files,
  Database,
  Zap,
  Microscope,
  Award,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

// --- Interfaces ---

interface ResearchModuleProps {
  module: ModuleData;
  previewDevice: string;
}

interface Paper {
  title?: string;
  abstract?: string;
  year?: number;
  authors?: string[];
  publication?: string;
  link?: string;
  downloadUrl?: string;
  tags?: string[];
  image?: string;
  citationCount?: number;
  status?: string;
  impactMetrics?: {
    label: string;
    value: string;
  }[];
}

interface CommonProps {
  papers: Paper[];
  isMobile?: boolean;
}

// --- Featured Research Layout ---

export const FeaturedResearch: React.FC<CommonProps> = ({
  papers,
  isMobile,
}) => {
  const featured = papers[0] || {};
  const related = papers.slice(1, 4);

  return (
    <div className="space-y-12">
      {/* Featured Flagship Item */}
      <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/40 to-transparent" />

        <div
          className={cn(
            "relative p-10 lg:p-16 flex gap-12 items-center",
            isMobile
              ? "flex-col text-center"
              : "flex-col lg:flex-row text-center lg:text-left"
          )}
        >
          <div className="flex-1">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md",
                isMobile && "mx-auto"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Flagship Publication {featured.year || 2024}
            </div>

            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
              {featured.title ||
                "The Convergence of AI and Modular Architectures"}
            </h2>

            <p className="text-blue-100/70 text-lg mb-10 leading-relaxed italic max-w-2xl mx-auto lg:mx-0">
              {featured.abstract ||
                "A foundational exploration into how autonomy and modularity are reshaping the landscape of modern systems engineering."}
            </p>

            <div
              className={cn(
                "flex flex-wrap items-center gap-4",
                isMobile ? "justify-center" : "justify-center lg:justify-start"
              )}
            >
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3">
                Download Full Paper
                <Download className="w-4 h-4" />
              </button>
              <button className="bg-white/10 backdrop-blur-xl text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center gap-3">
                Executive Abstract
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Impact Metrics Dashboard */}
          <div
            className={cn(
              "w-full grid gap-4",
              isMobile ? "grid-cols-2" : "lg:w-80 grid-cols-2"
            )}
          >
            {(
              featured.impactMetrics || [
                { label: "Cit. Score", value: "9.8" },
                { label: "Global Reach", value: "140+" },
                { label: "Peer Review", value: "Triple" },
                { label: "Impact", value: "Top 1%" },
              ]
            ).map((metric, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center hover:bg-white/10 transition-colors"
              >
                <span className="block text-2xl font-black text-white mb-1">
                  {metric.value}
                </span>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Side Stream */}
      <div
        className={cn(
          "grid gap-8",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
        )}
      >
        {related.map((paper, idx) => (
          <div
            key={idx}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Binary className="w-6 h-6" />
              </div>
              <Share2 className="w-4 h-4 text-slate-200 hover:text-blue-500 cursor-pointer transition-colors" />
            </div>

            <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
              {paper.title || "Auxiliary Research Topic"}
            </h3>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-[10px] font-black pointer-events-none text-slate-400 uppercase tracking-widest">
                {paper.year || 2024}
              </span>
              <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Read Abstract <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Publication List Layout ---

export const PublicationList: React.FC<CommonProps> = ({
  papers,
  isMobile,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {papers.map((paper, idx) => (
        <div
          key={idx}
          className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
        >
          <div
            className={cn(
              "flex gap-8",
              isMobile ? "flex-col" : "flex-col md:flex-row"
            )}
          >
            {/* Year & Icon */}
            <div
              className={cn(
                "flex gap-4 shrink-0",
                isMobile
                  ? "flex-row items-center"
                  : "flex-row md:flex-col items-center md:items-start"
              )}
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 leading-tight">
                  {paper.year || 2024}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Published
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {(paper.tags || ["Research", "Innovation"]).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                {paper.title}
              </h3>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500">
                  {paper.authors?.join(", ") || "Lead Researchers"}
                </p>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                {paper.abstract ||
                  "A comprehensive study into the emerging patterns of decentralized innovation within global technology ecosystems."}
              </p>

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <BookOpen className="w-3.5 h-3.5" />
                    {paper.publication || "Journal of Systems"}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    <Quote className="w-3.5 h-3.5" />
                    {paper.citationCount || 0} Citations
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">
                    <ExternalLink className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Research Grid Layout ---

export const ResearchGrid: React.FC<CommonProps> = ({ papers, isMobile }) => {
  return (
    <div
      className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {papers.map((paper, idx) => (
        <div
          key={idx}
          className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500"
        >
          {/* Visual Header */}
          <div className="h-56 relative overflow-hidden bg-slate-100">
            {paper.image ? (
              <img
                src={paper.image}
                alt={paper.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 text-white">
                <Database className="w-16 h-16 opacity-20" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                {paper.year || 2024}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {(paper.tags || ["System Design", "Scalability"])
                .slice(0, 2)
                .map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 line-clamp-2 min-h-14 leading-snug">
              {paper.title}
            </h3>

            <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">
              {paper.abstract ||
                "Detailed analysis of implementation and the architectural shifts observed during the study period."}
            </p>

            {/* Meta */}
            <div className="mt-auto space-y-6 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {paper.authors?.[0] || "Researcher"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Files className="w-3.5 h-3.5" />
                  {paper.publication || "Open Access"}
                </div>
              </div>

              <button className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                Unlock Insights
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Timeline Research Layout ---

export const TimelineResearch: React.FC<CommonProps> = ({
  papers,
  isMobile,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="relative">
        {/* Timeline Line (Hidden on Mobile) */}
        {!isMobile && (
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2 hidden sm:block" />
        )}

        <div className="space-y-32">
          {papers.map((paper, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={idx}
                className="relative flex flex-col sm:flex-row items-center group"
              >
                {/* Node Milestone (Hidden on Mobile) */}
                {!isMobile && (
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 hidden sm:block">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border-8 border-white shadow-2xl flex items-center justify-center text-white rotate-12 group-hover:rotate-0 group-hover:bg-blue-600 transition-all duration-500">
                      <Microscope className="w-7 h-7" />
                    </div>
                  </div>
                )}

                {/* Content Card */}
                <div
                  className={cn(
                    "w-full transition-all duration-700",
                    isMobile
                      ? "text-center"
                      : isLeft
                      ? "sm:w-[45%] sm:mr-auto sm:text-right"
                      : "sm:w-[45%] sm:ml-auto sm:text-left"
                  )}
                >
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-blue-500/20 group-hover:-translate-y-1">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                        "bg-blue-50 border-blue-100 text-blue-600"
                      )}
                    >
                      {paper.year || 2024} Breakthrough
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                      {paper.title}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed italic">
                      {paper.abstract ||
                        "Comprehensive analysis of technological shifts in modular architectures."}
                    </p>

                    <div
                      className={cn(
                        "flex flex-wrap items-center gap-4 pt-6 border-t border-slate-50",
                        isMobile
                          ? "justify-center"
                          : isLeft
                          ? "sm:justify-end"
                          : "justify-center sm:justify-start"
                      )}
                    >
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {paper.status || "Peer Reviewed"}
                      </span>
                      <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">
                        Full Text
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date Label for mobile */}
                {isMobile && <div className="w-1 h-12 bg-slate-100 my-4" />}
                {!isMobile && (
                  <div className="sm:hidden w-1 h-12 bg-slate-100 my-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Start Milestone */}
        {!isMobile && (
          <div className="absolute top-0 left-6 md:left-1/2 -translate-x-1/2 -translate-y-full mb-12 hidden sm:block">
            <div className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
              Research Genesis
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Module Component ---

export const ResearchModule = ({
  module,
  previewDevice,
}: ResearchModuleProps) => {
  const { content, layout } = module;
  const papers = content.papers || [];
  const isMobile = previewDevice === "mobile";

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

      {papers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No research papers added yet. Add papers in the settings panel.
          </p>
        </div>
      )}

      {layout === "publication-list" && papers.length > 0 && (
        <PublicationList papers={papers} isMobile={isMobile} />
      )}

      {/* Mapped 'research-list' to TimelineResearch as per likely intent based on user request */}
      {(layout === "timeline-research" || layout === "research-list") &&
        papers.length > 0 && (
          <TimelineResearch papers={papers} isMobile={isMobile} />
        )}

      {/* Mapped 'paper-grid' to ResearchGrid */}
      {(layout === "research-grid" || layout === "paper-grid") &&
        papers.length > 0 && (
          <ResearchGrid papers={papers} isMobile={isMobile} />
        )}

      {layout === "featured-research" && papers.length > 0 && (
        <FeaturedResearch papers={papers} isMobile={isMobile} />
      )}
    </ModuleContainer>
  );
};
