"use client";

import React from "react";
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlanItem } from "./cards-pricing";

interface GradientTierMatrixProps {
  content: Record<string, unknown>;
}

export const GradientTierMatrix: React.FC<GradientTierMatrixProps> = ({ content }) => {
  const badge = (content.badge as string) || "Predictable Transparent Pricing";
  const title = (content.title as string) || "Engineered for Exponential Scale";
  const description =
    (content.description as string) ||
    "Everything you need to launch, scale, and monetize your digital ecosystem with zero surprise fees.";

  const plans = (content.plans as PricingPlanItem[]) || [
    {
      name: "Developer Starter",
      price: "$29",
      period: "month",
      description: "For solopreneurs and rapid prototypes needing production velocity.",
      features: ["5 Live Environments", "25GB Global Edge Storage", "Community Discord Access", "Standard Analytics"],
      popular: false,
      buttonText: "Deploy Free Trial",
      buttonLink: "#",
    },
    {
      name: "Scale Venture",
      price: "$89",
      period: "month",
      description: "Our flagship bundle for fast-scaling startups and active communities.",
      features: [
        "Unlimited Production Workspaces",
        "500GB High-Performance Edge",
        "Priority 24/7 Slack Connect",
        "Advanced Behavioral Analytics",
        "Custom SSL & White-Label Domains",
      ],
      popular: true,
      buttonText: "Claim Scale License",
      buttonLink: "#",
    },
    {
      name: "Hypergrowth Core",
      price: "$249",
      period: "month",
      description: "Enterprise reliability, multi-region failover, and compliance SLAs.",
      features: [
        "Dedicated Multi-Region Sharding",
        "Unlimited High-Speed Bandwidth",
        "Dedicated Solutions Architect",
        "Custom Webhooks & SAML SSO",
        "99.99% Uptime SLA Agreement",
      ],
      popular: false,
      buttonText: "Talk to Architect",
      buttonLink: "#",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white py-20 md:py-32 px-6">
      {/* Dynamic Radial Mesh Backlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{badge}</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">
              {title}
            </span>
          </h2>

          <p className="text-base md:text-lg text-slate-400 font-light leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan: PricingPlanItem, idx: number) => {
            const isPopular = plan.popular;

            return (
              <div
                key={idx}
                className={cn(
                  "relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300",
                  isPopular
                    ? "bg-gradient-to-b from-indigo-900/40 via-slate-900/90 to-slate-950 border-2 border-indigo-500/80 shadow-[0_0_40px_rgba(99,102,241,0.3)] scale-105 z-20"
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20 backdrop-blur-md"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                    <Zap className="h-3 w-3 fill-white" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="mb-6 space-y-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        /{plan.period || "month"}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-2">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-8 space-y-3">
                    {(plan.features || []).map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          isPopular
                            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                            : "bg-white/10 text-emerald-400"
                        )}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={plan.buttonLink || "#"}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg",
                    isPopular
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  )}
                >
                  <span>{plan.buttonText || "Choose Plan"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientTierMatrix;
