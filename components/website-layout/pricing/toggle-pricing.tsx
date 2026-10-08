"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlanItem } from "./cards-pricing";

interface TogglePricingProps {
  content: Record<string, unknown>;
}

export const TogglePricing: React.FC<TogglePricingProps> = ({ content }) => {
  const [isYearly, setIsYearly] = useState(false);

  const title = (content.title as string) || "Flexible Pricing For Every Scale";
  const description =
    (content.description as string) ||
    "Switch between monthly and annual billing to save up to 20%.";
  const discountBadge = (content.discountBadge as string) || "Save 20%";

  const plans = (content.plans as PricingPlanItem[]) || [
    {
      name: "Starter",
      price: "$29",
      yearlyPrice: "$23",
      period: "month",
      description: "Essential tools for small teams looking to scale workflows.",
      features: ["Up to 5 Projects", "10GB Storage", "Community Support", "Email Integration"],
      popular: false,
      buttonText: "Start Free Trial",
      buttonLink: "#",
    },
    {
      name: "Professional",
      price: "$79",
      yearlyPrice: "$63",
      period: "month",
      description: "Advanced features and priority support for growing teams.",
      features: ["Unlimited Projects", "100GB Storage", "Priority 24/7 Support", "Custom Integrations"],
      popular: true,
      buttonText: "Get Started Now",
      buttonLink: "#",
    },
    {
      name: "Enterprise",
      price: "$199",
      yearlyPrice: "$159",
      period: "month",
      description: "Full-scale security, compliance, and dedicated engineering.",
      features: ["Custom Infrastructure", "Unlimited Storage", "SLA Guarantee", "Dedicated Manager"],
      popular: false,
      buttonText: "Contact Sales",
      buttonLink: "#",
    },
  ];

  return (
    <div className="w-full py-12 md:py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 space-y-3">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        {/* Interactive Toggle Switch */}
        <div className="pt-4 inline-flex items-center gap-3">
          <div className="flex items-center p-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                !isYearly
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer",
                isYearly
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase">
                {discountBadge}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan: PricingPlanItem, idx: number) => {
          const displayPrice = isYearly
            ? plan.yearlyPrice || plan.price
            : plan.price;

          return (
            <div
              key={idx}
              className={cn(
                "relative p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between",
                plan.popular
                  ? "bg-white border-slate-900 shadow-2xl scale-105 z-10"
                  : "bg-slate-50/70 border-slate-200/80 hover:border-slate-300 shadow-xs"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-black text-slate-900 font-mono tracking-tight">
                      {displayPrice}
                    </span>
                    <span className="text-slate-500 text-sm font-medium">
                      /{plan.period || "month"}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="text-[11px] font-semibold text-emerald-600 mt-1">
                      Billed annually ({discountBadge})
                    </div>
                  )}
                  {plan.description && (
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-200/60 pt-6 mb-8">
                  <ul className="space-y-3">
                    {(plan.features || []).map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={plan.buttonLink || "#"}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm",
                  plan.popular
                    ? "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]"
                    : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
                )}
              >
                <span>{plan.buttonText || "Get Started"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TogglePricing;
