"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlanItem } from "./cards-pricing";

interface MinimalEditorialPlansProps {
  content: Record<string, unknown>;
}

export const MinimalEditorialPlans: React.FC<MinimalEditorialPlansProps> = ({ content }) => {
  const badge = (content.badge as string) || "Simple & Predictable Membership";
  const title = (content.title as string) || "Transparent Investment In Your Growth.";
  const description =
    (content.description as string) ||
    "Every plan includes full access to our community core, private updates, and direct office hours. No contracts, cancel anytime.";

  const plans = (content.plans as PricingPlanItem[]) || [
    {
      name: "Standard",
      price: "$29",
      period: "mo",
      description: "For independent thinkers and practitioners establishing their foundations.",
      features: ["Curated weekly intelligence briefs", "Access to community discussion channels", "Monthly live mastermind session"],
      popular: false,
      buttonText: "Join Standard",
      buttonLink: "#",
    },
    {
      name: "Fellowship",
      price: "$69",
      period: "mo",
      description: "For leaders and operators scaling high-trust private initiatives.",
      features: [
        "Everything in Standard membership",
        "Direct peer matching & 1-on-1 mentorship",
        "Exclusive invite to private quarterly retreats",
        "Priority publishing privileges in our publication",
      ],
      popular: true,
      buttonText: "Join Fellowship",
      buttonLink: "#",
    },
    {
      name: "Partner",
      price: "$149",
      period: "mo",
      description: "For institutions and organizations building category-defining ventures.",
      features: [
        "Up to 5 team member accounts included",
        "Dedicated advisory sessions each quarter",
        "Custom research requests and data benchmarks",
        "Direct hotline to leadership team",
      ],
      popular: false,
      buttonText: "Inquire Partner",
      buttonLink: "#",
    },
  ];

  return (
    <div className="w-full bg-[#fdfdfd] text-slate-900 py-20 md:py-32 px-6 border-b border-slate-100">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 border-b border-slate-200 pb-1">
            {badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch border-t border-slate-200 pt-8">
          {plans.map((plan: PricingPlanItem, idx: number) => {
            const isPopular = plan.popular;

            return (
              <div
                key={idx}
                className={cn(
                  "p-8 rounded-2xl flex flex-col justify-between transition-all duration-200",
                  isPopular
                    ? "bg-slate-900 text-white shadow-xl scale-102"
                    : "bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-lg font-serif font-semibold", isPopular ? "text-white" : "text-slate-900")}>
                      {plan.name}
                    </h3>
                    {isPopular && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={cn("text-4xl font-serif font-normal", isPopular ? "text-white" : "text-slate-900")}>
                      {plan.price}
                    </span>
                    <span className={cn("text-xs font-mono", isPopular ? "text-slate-400" : "text-slate-500")}>
                      /{plan.period || "mo"}
                    </span>
                  </div>

                  {plan.description && (
                    <p className={cn("mt-3 text-xs leading-relaxed", isPopular ? "text-slate-300" : "text-slate-600")}>
                      {plan.description}
                    </p>
                  )}

                  <div className={cn("border-t my-6", isPopular ? "border-slate-800" : "border-slate-100")} />

                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((feat: string, fIdx: number) => (
                      <li key={fIdx} className={cn("text-xs leading-relaxed flex items-start gap-2", isPopular ? "text-slate-300" : "text-slate-700")}>
                        <span className="opacity-50">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={plan.buttonLink || "#"}
                  className={cn(
                    "w-full py-3 px-4 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer",
                    isPopular
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  )}
                >
                  <span>{plan.buttonText || "Choose Plan"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinimalEditorialPlans;
