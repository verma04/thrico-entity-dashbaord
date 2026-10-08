"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroMinimalEditorialProps {
  content: Record<string, unknown>;
}

const HeroMinimalEditorial: React.FC<HeroMinimalEditorialProps> = ({ content }) => {
  const badge = (content.badge as string) || "Design & Strategic Collective";
  const title = (content.title as string) || "Clarity. Precision. Timeless Digital Craft.";
  const description =
    (content.description as string) ||
    "We partner with ambitious founders and forward-thinking enterprises to design distinct digital identities, thoughtful user experiences, and resilient platforms.";

  const buttons = Array.isArray(content.buttons)
    ? (content.buttons as Array<{ text?: string; link?: string; variant?: string }>)
    : [
        { text: "View Selected Work", link: "/work", variant: "primary" },
        { text: "Read Manifesto", link: "/about", variant: "outline" },
      ];

  return (
    <div className="w-full bg-[#fdfdfd] text-slate-900 py-24 md:py-36 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
        {/* Eyebrow */}
        <div className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 border-b border-slate-200 pb-1">
          {badge}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight leading-[1.12] text-slate-900 max-w-4xl mx-auto">
          {title}
        </h1>

        {/* Narrative Copy */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          {description}
        </p>

        {/* Minimal Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          {buttons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link || "#"}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer",
                btn.variant === "outline"
                  ? "border border-slate-300 text-slate-800 hover:border-slate-900 hover:bg-slate-50"
                  : "bg-slate-950 text-white hover:bg-slate-800 shadow-md"
              )}
            >
              <span>{btn.text || "Learn More"}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>

        {/* Editorial Trust Statement */}
        <div className="pt-16 border-t border-slate-100 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-6">
            Trusted by creators and global organizations across 32 countries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50 grayscale">
            <span className="font-serif text-lg tracking-wider font-semibold">VERCEL</span>
            <span className="font-mono text-base tracking-widest font-bold">LINEAR</span>
            <span className="font-sans text-base tracking-tight font-extrabold">STRIPE</span>
            <span className="font-serif text-lg italic">MONOCLE</span>
            <span className="font-mono text-base font-semibold">ACME CO.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMinimalEditorial;
