"use client";

import React from "react";
import { Check, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPlanItem } from "./cards-pricing";

interface TablePricingProps {
  content: Record<string, unknown>;
}

export const TablePricing: React.FC<TablePricingProps> = ({ content }) => {
  const title = (content.title as string) || "Compare Plans & Features";
  const description =
    (content.description as string) || "Detailed comparison of everything included in each tier.";
  const plans = (content.plans as PricingPlanItem[]) || [
    {
      name: "Starter",
      price: "$29",
      period: "month",
      features: ["5 Projects", "10GB Storage", "Community Support"],
      popular: false,
      buttonText: "Start Starter",
      buttonLink: "#",
    },
    {
      name: "Professional",
      price: "$79",
      period: "month",
      features: ["Unlimited Projects", "100GB Storage", "Priority Support", "Custom Integrations"],
      popular: true,
      buttonText: "Go Professional",
      buttonLink: "#",
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "month",
      features: ["Custom Infrastructure", "Unlimited Storage", "SLA Guarantee", "Dedicated Manager"],
      popular: false,
      buttonText: "Contact Sales",
      buttonLink: "#",
    },
  ];

  // Aggregate all unique features
  const allFeatures: string[] = Array.from(
    new Set(plans.flatMap((p: PricingPlanItem) => p.features || []))
  );

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

      <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              <th className="p-6 md:p-8 min-w-[240px]">
                <div className="text-lg font-bold text-slate-900">Feature Matrix</div>
                <div className="text-xs text-slate-500 font-normal mt-1">
                  Full capability breakdown
                </div>
              </th>
              {plans.map((plan: PricingPlanItem, idx: number) => (
                <th
                  key={idx}
                  className={cn(
                    "p-6 md:p-8 text-center min-w-[200px]",
                    plan.popular && "bg-indigo-50/40 border-x border-indigo-200"
                  )}
                >
                  {plan.popular && (
                    <span className="inline-block px-3 py-0.5 mb-2 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  <div className="text-base font-bold text-slate-900">{plan.name}</div>
                  <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono mt-1">
                    {plan.price}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    /{plan.period || "month"}
                  </div>
                  <a
                    href={plan.buttonLink || "#"}
                    className={cn(
                      "mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs",
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50"
                    )}
                  >
                    <span>{plan.buttonText || "Select"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allFeatures.map((feat: string, fIdx: number) => (
              <tr key={fIdx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 md:p-6 text-sm font-medium text-slate-800">
                  {feat}
                </td>
                {plans.map((plan: PricingPlanItem, pIdx: number) => {
                  const hasFeature = (plan.features || []).includes(feat);
                  return (
                    <td
                      key={pIdx}
                      className={cn(
                        "p-4 md:p-6 text-center",
                        plan.popular && "bg-indigo-50/20 border-x border-indigo-100"
                      )}
                    >
                      {hasFeature ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center">
                          <Minus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePricing;
