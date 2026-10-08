"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { CheckCircle2, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroProductShowcaseProps {
  content: Record<string, unknown>;
}

const HeroProductShowcase: React.FC<HeroProductShowcaseProps> = ({ content }) => {
  const badge = (content.badge as string) || "Flagship Masterclass & Resource Kit";
  const title = (content.title as string) || "Master Modern Full-Stack Engineering";
  const description =
    (content.description as string) ||
    "The complete step-by-step curriculum with real-world enterprise architectures, production source code, and lifetime community access.";
  const productImage =
    (content.image as string) ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop";

  const takeaways = Array.isArray(content.features) && content.features.length > 0
    ? (content.features as Array<{ title?: string } | string>).map((f) =>
        typeof f === "string" ? f : f.title || ""
      )
    : [
        "120+ High-definition video modules & interactive labs",
        "Full enterprise-grade production source repository",
        "Direct access to private mentor office hours & discord",
        "Verified credential certificate recognized by top tech firms",
      ];

  const buttons = Array.isArray(content.buttons)
    ? (content.buttons as Array<{ text?: string; link?: string; variant?: string }>)
    : [
        { text: "Enroll Now - $199", link: "/checkout", variant: "primary" },
        { text: "Preview Syllabus", link: "#curriculum", variant: "outline" },
      ];

  return (
    <div className="w-full bg-slate-50 py-16 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy & Checklist */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9/5 Rating (2,800+ Students)</span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                {badge}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {description}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              {takeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-4 justify-center lg:justify-start">
              {buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href={btn.link || "#"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-md",
                    btn.variant === "outline"
                      ? "border border-slate-300 bg-white hover:bg-slate-50 text-slate-800"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:scale-105"
                  )}
                >
                  <span>{btn.text || "Get Access"}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Perspective Floating Book / Course Cover */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative group max-w-md w-full">
              {/* Soft Ambient Backlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-3 -z-10" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white transform group-hover:rotate-0 transition-transform duration-500 rotate-1">
                <img
                  src={productImage}
                  alt={title}
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">
                    Special Edition
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">{title}</h3>
                  <p className="text-xs text-white/80 mt-1">Includes all downloadable assets & templates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProductShowcase;
