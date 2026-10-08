"use client";

import React from "react";
import { Sparkles, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroGradientMeshProps {
  content: Record<string, unknown>;
}

const HeroGradientMesh: React.FC<HeroGradientMeshProps> = ({ content }) => {
  const badge = (content.badge as string) || "Next-Gen Infrastructure";
  const title = (content.title as string) || "Engineered for Extreme Velocity";
  const description =
    (content.description as string) ||
    "Power your digital enterprise with ultra-low latency services, global edge delivery, and intelligent automated workflows.";

  const buttons = Array.isArray(content.buttons)
    ? (content.buttons as Array<{ text?: string; link?: string; variant?: string }>)
    : [
        { text: "Start Building Free", link: "/signup", variant: "primary" },
        { text: "Schedule Architecture Call", link: "/contact", variant: "outline" },
      ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white py-24 md:py-36">
      {/* Dynamic Radial Gradient Mesh Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
        {/* Glowing Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
            {title}
          </span>
        </h1>

        {/* Narrative Copy */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          {buttons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link || "#"}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer",
                btn.variant === "outline"
                  ? "border border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105"
              )}
            >
              <span>{btn.text || "Get Started"}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* Floating Glassmorphism Metric Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Response Speed</div>
              <div className="text-base font-bold text-white">&lt; 15ms Edge</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Service Guarantee</div>
              <div className="text-base font-bold text-white">99.99% Uptime</div>
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-1 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Total Community</div>
              <div className="text-base font-bold text-white">500K+ Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroGradientMesh;
