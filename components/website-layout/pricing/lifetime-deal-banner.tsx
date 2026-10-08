"use client";

import React from "react";
import { CheckCircle2, Flame, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LifetimeDealBannerProps {
  content: Record<string, unknown>;
}

export const LifetimeDealBanner: React.FC<LifetimeDealBannerProps> = ({ content }) => {
  const badge = (content.badge as string) || "⚡ Strictly Limited Release • Founder Pass";
  const title = (content.title as string) || "One Single Payment. Lifetime Unlimited Access.";
  const description =
    (content.description as string) ||
    "Skip recurring monthly subscriptions forever. Secure complete access to the full ecosystem, all current and future updates, and private founder channels.";
  const strikePrice = (content.strikePrice as string) || "$799";
  const price = (content.price as string) || "$249";
  const period = (content.period as string) || "lifetime";
  const buttonText = (content.buttonText as string) || "Claim Lifetime Pass Now";
  const buttonLink = (content.buttonLink as string) || "#checkout";
  const guaranteeText =
    (content.guaranteeText as string) || "30-Day Full Refund Guarantee • Zero Risk";

  const features = (content.features as string[]) || [
    "Lifetime access to all current & future product updates",
    "Unlimited member workspaces and automated pipelines",
    "Private Founders Council and VIP Discord channels",
    "Priority tier-1 support with dedicated response SLAs",
    "Commercial licensing rights and white-labeling included",
    "Instant activation — no recurring renewals or surprise charges",
  ];

  return (
    <div className="w-full py-16 md:py-24 px-6 max-w-6xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 md:p-16 border border-indigo-500/30 shadow-2xl overflow-hidden">
        {/* Soft Ambient Radial Flares */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Offer Details & Checklist */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Ticket Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 text-center space-y-6 shadow-2xl">
              <div>
                <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold block mb-1">
                  Lifetime Deal
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl text-slate-400 line-through font-mono">
                    {strikePrice}
                  </span>
                  <span className="text-5xl font-black text-white font-mono tracking-tight">
                    {price}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium block mt-1">
                  Pay once • Free updates for {period}
                </span>
              </div>

              <a
                href={buttonLink}
                className={cn(
                  "inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 cursor-pointer",
                  "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105"
                )}
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{guaranteeText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifetimeDealBanner;
