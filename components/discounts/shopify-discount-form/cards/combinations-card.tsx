"use client";

import React from "react";
import { PolarisCollapsible } from "../primitives/polaris-collapsible";
import { PolarisCheckbox } from "../primitives/polaris-checkbox";
import { Info } from "lucide-react";

export interface CombinationsCardProps {
  combinesWithProductDiscounts: boolean;
  onCombinesWithProductChange: (val: boolean) => void;
  combinesWithOrderDiscounts: boolean;
  onCombinesWithOrderChange: (val: boolean) => void;
  combinesWithShippingDiscounts: boolean;
  onCombinesWithShippingChange: (val: boolean) => void;
}

export function CombinationsCard({
  combinesWithProductDiscounts,
  onCombinesWithProductChange,
  combinesWithOrderDiscounts,
  onCombinesWithOrderChange,
  combinesWithShippingDiscounts,
  onCombinesWithShippingChange,
}: CombinationsCardProps) {
  const hasAnyCombination =
    combinesWithProductDiscounts ||
    combinesWithOrderDiscounts ||
    combinesWithShippingDiscounts;

  return (
    <PolarisCollapsible
      title="Combinations"
      subtitle={
        hasAnyCombination
          ? "Combines with selected discount categories"
          : "This discount won't combine with other product, order, or shipping discounts in the customer's cart."
      }
      defaultOpen={false}
      iconType="plus"
    >
      <div className="space-y-3">
        <p className="text-[13px] font-medium text-[#303030] dark:text-zinc-200">
          This discount can be combined with:
        </p>

        <div className="space-y-1">
          <PolarisCheckbox
            id="combine-products"
            checked={combinesWithProductDiscounts}
            onChange={onCombinesWithProductChange}
            label="Product discounts"
            description="Allow customer to use other product discounts on the same order"
          />

          <PolarisCheckbox
            id="combine-orders"
            checked={combinesWithOrderDiscounts}
            onChange={onCombinesWithOrderChange}
            label="Order discounts"
            description="Allow customer to apply whole-cart order discounts alongside this discount"
          />

          <PolarisCheckbox
            id="combine-shipping"
            checked={combinesWithShippingDiscounts}
            onChange={onCombinesWithShippingChange}
            label="Shipping discounts"
            description="Allow customer to combine with free or discounted shipping offers"
          />
        </div>

        <div className="p-3 rounded-[8px] bg-zinc-50 dark:bg-zinc-800/60 border border-[#d2d5d9] dark:border-zinc-700/80 flex items-start gap-2 text-[12px] text-[#616161] dark:text-zinc-400">
          <Info className="h-3.5 w-3.5 text-[#005bd3] dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            If multiple discounts are applied, Shopify will automatically calculate the best rate for the customer based on your combination rules.
          </span>
        </div>
      </div>
    </PolarisCollapsible>
  );
}
