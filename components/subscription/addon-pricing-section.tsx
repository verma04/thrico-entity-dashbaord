"use client"

import React, { useState } from "react";
import { useAddonPricing, usePlanOverview } from "@/graphql/actions/plan";
import { Plus, Check, Zap, Info, ArrowRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AddonPurchaseModal from "./addon-purchase-modal";
import { AddonPricing } from "./ts-types";

const AddonPricingSection = () => {
  const { data, loading: loadingPricing } = useAddonPricing();
  const { data: planData } = usePlanOverview();
  const [selectedAddon, setSelectedAddon] = useState<AddonPricing | null>(null);

  if (loadingPricing) return null;

  const billingCycle = planData?.getPlanOverview?.billingCycle || "monthly";
  const allAddons = data?.getAddonPricing?.addons || [];
  const addons = allAddons.slice(0, 3);
  const currency = data?.getAddonPricing?.currency || "INR";

  if (addons.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Add-ons
          </p>
          <h2 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight mt-1">
            Enhance your plan
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
          <Info className="h-3 w-3" />
          Adapts to your <strong className="text-slate-600 font-semibold">{billingCycle}</strong> cycle
        </div>
      </div>

      {/* Addon cards */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {addons.map((addon, index) => (
            <div
              key={addon.addonPricingId}
              onClick={() => setSelectedAddon(addon)}
              className={cn(
                "relative flex flex-col rounded-xl border bg-white cursor-pointer transition-all duration-150 hover:shadow-md overflow-hidden",
                index === 1
                  ? "border-slate-900 ring-1 ring-slate-900/10"
                  : "border-slate-200/80"
              )}
            >
              {index === 1 && (
                <div className="bg-slate-900 px-4 py-1">
                  <span className="text-[10px] font-semibold text-white uppercase tracking-widest">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                  <Plus className="h-4 w-4 text-slate-600" />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
                  {addon.name}
                </h3>
                <p className="text-[12px] text-slate-400 mt-1.5 line-clamp-2 leading-snug">
                  {addon.description}
                </p>
              </div>

              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] font-bold text-slate-900 leading-none tabular-nums tracking-tight">
                    {currency}{" "}
                    {billingCycle === "monthly" ? addon.monthlyUnitPrice : addon.yearlyUnitPrice}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    / {addon.unitLabel || "unit"} / {billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
                {billingCycle === "monthly" && addon.yearlyUnitPrice > 0 && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Save with annual — {currency} {addon.yearlyUnitPrice}/yr
                  </p>
                )}
              </div>

              <div className="px-4 py-3 flex-1 space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Full feature access
                </div>
                <div className="flex items-center gap-2 text-[12px] text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Seamless integration
                </div>
              </div>

              <div className="px-4 pb-4 pt-2">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-9 text-[12px] font-semibold gap-2",
                    index === 1
                      ? "bg-slate-900 hover:bg-black text-white"
                      : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm"
                  )}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Buy Add-on
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <p className="text-[10px] text-center text-slate-400 uppercase font-semibold tracking-widest mt-2">
                  Billed {billingCycle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <div className="mt-4 px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <Info className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-slate-700">Billed separately</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add-ons are not included in your main subscription. Manage them in billing settings.
              </p>
            </div>
          </div>
          <Button variant="link" className="text-[12px] font-semibold text-slate-500 hover:text-slate-900 gap-1 shrink-0 h-auto px-0 py-0">
            Contact Support
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {selectedAddon && (
        <AddonPurchaseModal
          addon={selectedAddon}
          currency={currency}
          billingCycle={billingCycle}
          onClose={() => setSelectedAddon(null)}
        />
      )}
    </div>
  );
};

export default AddonPricingSection;
