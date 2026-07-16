import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Play, Quote, Code, ArrowRight, CheckCircle2 } from "lucide-react";
import { ModuleContainer } from "../modules/module-container";
import { ModuleHeader } from "../modules/module-header";

interface ContentSectionRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const ContentSectionRenderer = ({
  module,
  previewDevice = "desktop",
}: ContentSectionRendererProps) => {
  const { content, layout } = module;
  const blocks = content.blocks || [];
  const alignment = (content.alignment || "left") as
    | "left"
    | "center"
    | "right";
  const textColor = content.textColor || "";
  const isMobile = previewDevice === "mobile";

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const renderBlock = (block: any, idx: number, isCard: boolean = false) => {
    return (
      <div
        key={idx}
        className={cn(
          "w-full transition-all duration-700",
          !isCard && "animate-in fade-in slide-in-from-bottom-4"
        )}
      >
        {/* Text Block */}
        {block.type === "text" && (
          <div className="space-y-4">
            {block.title && (
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {block.title}
              </h3>
            )}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed whitespace-pre-wrap">
              {block.content}
            </p>
          </div>
        )}

        {/* Image Block */}
        {block.type === "image" && block.content && (
          <div
            className={cn(
              "rounded-4xl overflow-hidden shadow-xl border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1",
              isCard ? "h-full flex flex-col" : ""
            )}
          >
            <img
              src={block.content}
              alt={block.title || `Content Image ${idx + 1}`}
              className={cn(
                "w-full h-auto object-cover",
                isCard && "flex-1 min-h-[200px]"
              )}
            />
            {block.title && (
              <div className="p-4 bg-slate-50 text-center text-sm font-bold text-slate-900 italic">
                {block.title}
              </div>
            )}
          </div>
        )}

        {/* Video Block */}
        {block.type === "video" && block.content && (
          <div className="relative rounded-4xl overflow-hidden shadow-xl bg-slate-900 aspect-video group border border-slate-100 italic transition-all hover:shadow-2xl">
            {block.content.includes("youtube.com") ||
            block.content.includes("youtu.be") ? (
              <iframe
                src={block.content.replace("watch?v=", "embed/")}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={block.content}
                controls
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        )}

        {/* Quote Block */}
        {block.type === "quote" && (
          <div className="relative py-8 px-10 sm:px-12 rounded-4xl bg-slate-50 border-l-8 border-primary italic">
            <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/10 -scale-x-100" />
            {block.title && (
              <p className="text-xl sm:text-2xl font-black text-slate-900 mb-4 not-italic tracking-tight">
                {block.title}
              </p>
            )}
            <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed relative z-10 font-medium">
              "{block.content}"
            </p>
            {block.author && (
              <footer className="mt-6 flex items-center gap-3 not-italic">
                <div className="w-10 h-1px bg-slate-300" />
                <span className="text-base font-bold text-primary italic uppercase tracking-widest">
                  {block.author}
                </span>
              </footer>
            )}
          </div>
        )}

        {/* Code Block */}
        {block.type === "code" && (
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {block.title && (
                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {block.title}
                </span>
              )}
            </div>
            <div className="bg-slate-900 p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-blue-100 selection:bg-blue-500/30">
                <code>{block.content}</code>
              </pre>
            </div>
            <div className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Code className="w-5 h-5 text-slate-700" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (layout) {
      case "details-list":
        return (
          <div className="space-y-16 w-full">
            {blocks.map((block: any, idx: number) => (
              <div key={idx} className="flex gap-8 group">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg group-hover:bg-primary transition-colors">
                    {idx + 1}
                  </div>
                  {idx < blocks.length - 1 && (
                    <div className="w-px h-full bg-slate-100 mx-auto mt-4" />
                  )}
                </div>
                <div className="flex-1 pb-16 border-b border-slate-50 group-last:border-0 group-last:pb-0">
                  {renderBlock(block, idx)}
                </div>
              </div>
            ))}
          </div>
        );

      case "alternating-grid":
        return (
          <div className="space-y-24 w-full">
            {blocks.map((block: any, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col gap-12 lg:items-center",
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  )}
                >
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Step {idx + 1}
                    </div>
                    {renderBlock(
                      { ...block, type: block.type === "text" ? "text" : null },
                      idx
                    )}
                  </div>
                  <div className="w-full lg:w-1/2">
                    {block.type !== "text" ? (
                      renderBlock(block, idx)
                    ) : (
                      <div className="aspect-4/3 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <span className="text-slate-300 font-black text-6xl select-none group-hover:scale-110 transition-transform duration-700">
                          0{idx + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "cards-grid":
        return (
          <div
            className={cn(
              "grid gap-8 w-full",
              isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {blocks.map((block: any, idx: number) => (
              <div
                key={idx}
                className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                {renderBlock(block, idx, true)}
              </div>
            ))}
          </div>
        );

      case "text-focused":
        return (
          <div className="max-w-3xl mx-auto space-y-16 w-full">
            {blocks.map((block: any, idx: number) => (
              <div key={idx} className="space-y-6 text-center">
                {renderBlock(block, idx)}
                {idx < blocks.length - 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div
            className={cn(
              "w-full space-y-12 mt-12",
              alignmentClasses[alignment]
            )}
          >
            {blocks.map((block: any, idx: number) => renderBlock(block, idx))}
          </div>
        );
    }
  };

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white"
    >
      <div
        className={cn(
          "max-w-6xl mx-auto flex flex-col",
          alignmentClasses[alignment]
        )}
        style={{
          color: textColor || undefined,
        }}
      >
        {/* Standardized Module Header */}
        <ModuleHeader
          title={content.title}
          description={content.description}
          label={content.heading}
          alignment={alignment}
          containerClassName="mb-16 w-full"
        />

        {/* Top-level Media (Image/Video) */}
        <div className="w-full space-y-12 mb-16">
          {content.image && (
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              <img
                src={content.image}
                alt="Featured"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {content.videoUrl && (
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 aspect-video group">
              {content.videoUrl.includes("youtube.com") ||
              content.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={content.videoUrl.replace("watch?v=", "embed/")}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-20 w-20 text-white opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Layout-specific Content Rendering */}
        {renderContent()}

        {/* Premium Call-to-Action */}
        {content.buttonText && content.buttonLink && (
          <div className={cn("pt-20 w-full", alignmentClasses[alignment])}>
            <a
              href={content.buttonLink}
              className={cn(
                "inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg transition-all duration-300 hover:gap-5 group",
                content.buttonStyle === "primary" &&
                  "bg-slate-900 text-white hover:bg-primary shadow-xl hover:shadow-primary/20",
                content.buttonStyle === "secondary" &&
                  "bg-blue-50 text-blue-600 hover:bg-blue-100",
                content.buttonStyle === "outline" &&
                  "border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
                content.buttonStyle === "ghost" &&
                  "hover:bg-slate-100 text-slate-600",
                !content.buttonStyle &&
                  "bg-slate-900 text-white hover:bg-primary shadow-xl hover:shadow-primary/20"
              )}
            >
              <span>{content.buttonText}</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        )}
      </div>
    </ModuleContainer>
  );
};
