"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingPlanItem {
  name: string;
  price: string;
  yearlyPrice?: string;
  period?: string;
  description?: string;
  features?: string[];
  popular?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

interface CardsPricingProps {
  content: Record<string, unknown>;
}

export const CardsPricing: React.FC<CardsPricingProps> = ({ content }) => {
  const title = (content.title as string) || "Choose Your Plan";
  const description =
    (content.description as string) || "Select the perfect plan for your needs";
  const plans = (content.plans as PricingPlanItem[]) || [
    {
      name: "Starter",
      price: "$29",
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
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan: PricingPlanItem, idx: number) => (
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
                    {plan.price}
                  </span>
                  <span className="text-slate-500 text-sm font-medium">
                    /{plan.period || "month"}
                  </span>
                </div>
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
        ))}
      </div>
    </div>
  );
};

export default CardsPricing;
