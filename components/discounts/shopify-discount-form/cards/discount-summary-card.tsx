"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { Tag, Sparkles, CheckCircle, Clock } from "lucide-react";
import { ShopifyDiscountFormValues } from "../types";

export interface DiscountSummaryCardProps {
  values: ShopifyDiscountFormValues;
}

export function DiscountSummaryCard({ values }: DiscountSummaryCardProps) {
  const {
    discountMethod,
    code,
    title,
    discountType,
    value,
    appliesTo,
    selectedCollections,
    selectedProducts,
    purchaseType,
    eligibility,
    selectedCustomerSegments,
    selectedCustomers,
    minRequirementType,
    minAmount,
    minQuantity,
    limitTotalUses,
    totalUsesLimit,
    limitOncePerCustomer,
    combinesWithProductDiscounts,
    combinesWithOrderDiscounts,
    combinesWithShippingDiscounts,
    startDate,
    hasEndDate,
    endDate,
    channels,
  } = values;

  // Header Title or Code
  const displayHeadline =
    discountMethod === "CODE"
      ? code.trim() || "No discount code yet"
      : title.trim() || "No title yet";

  // Discount value formatted string
  const formattedDiscountValue =
    discountType === "PERCENTAGE" ? `${value || 0}% off` : `$${value || 0} off`;

  // Builds details bullets list
  const details: string[] = [];

  // 1. Eligibility
  if (eligibility === "ALL") {
    details.push("All customers");
  } else if (eligibility === "SPECIFIC_SEGMENTS") {
    const count = selectedCustomerSegments.length;
    details.push(
      count === 1
        ? `For segment: ${selectedCustomerSegments[0].title}`
        : count > 1
        ? `For ${count} customer segments`
        : "For specific customer segments"
    );
  } else {
    const count = selectedCustomers.length;
    details.push(
      count === 1
        ? `For customer: ${selectedCustomers[0].title}`
        : count > 1
        ? `For ${count} customers`
        : "For specific customers"
    );
  }

  // 2. Channels
  const activeChannels: string[] = [];
  if (channels.onlineStore) activeChannels.push("Online Store");
  if (channels.pos) activeChannels.push("Point of Sale");
  if (channels.mobileApp) activeChannels.push("Mobile App");
  if (channels.buyButton) activeChannels.push("Buy Button");

  if (activeChannels.length > 0) {
    details.push(`For ${activeChannels.join(", ")}`);
  }

  // 3. Applies to Scope
  if (appliesTo === "ALL") {
    details.push(`${formattedDiscountValue} all products`);
  } else if (appliesTo === "SPECIFIC_COLLECTIONS") {
    const count = selectedCollections.length;
    details.push(
      count === 1
        ? `${formattedDiscountValue} on ${selectedCollections[0].title}`
        : count > 1
        ? `${formattedDiscountValue} on ${count} collections`
        : `${formattedDiscountValue} on specific collections`
    );
  } else {
    const count = selectedProducts.length;
    details.push(
      count === 1
        ? `${formattedDiscountValue} on ${selectedProducts[0].title}`
        : count > 1
        ? `${formattedDiscountValue} on ${count} products`
        : `${formattedDiscountValue} on specific products`
    );
  }

  // 4. Purchase Type
  if (purchaseType === "ONE_TIME") {
    details.push("Applies to one-time purchases");
  } else if (purchaseType === "SUBSCRIPTION") {
    details.push("Applies to subscription orders");
  } else {
    details.push("Applies to one-time and subscription purchases");
  }

  // 5. Minimum Purchase Requirement
  if (minRequirementType === "NONE") {
    details.push("No minimum purchase requirement");
  } else if (minRequirementType === "AMOUNT") {
    details.push(`Minimum purchase of $${minAmount || 0}`);
  } else {
    details.push(`Minimum quantity of ${minQuantity || 1} items`);
  }

  // 6. Usage limits
  if (!limitTotalUses && !limitOncePerCustomer) {
    details.push("No usage limits");
  } else {
    if (limitTotalUses) {
      details.push(`Limit of ${totalUsesLimit || 0} total uses`);
    }
    if (limitOncePerCustomer) {
      details.push("Limit to one use per customer");
    }
  }

  // 7. Combinations
  const combos: string[] = [];
  if (combinesWithProductDiscounts) combos.push("product");
  if (combinesWithOrderDiscounts) combos.push("order");
  if (combinesWithShippingDiscounts) combos.push("shipping");

  if (combos.length === 0) {
    details.push("Can't combine with other discounts");
  } else {
    details.push(`Combines with ${combos.join(", ")} discounts`);
  }

  // 8. Active Dates
  const isToday =
    startDate === new Date().toISOString().split("T")[0];
  const dateFormatted = isToday ? "today" : startDate;

  if (hasEndDate && endDate) {
    details.push(`Active from ${dateFormatted} until ${endDate}`);
  } else {
    details.push(`Active from ${dateFormatted}`);
  }

  return (
    <PolarisCard
      className="border-[#d2d5d9] dark:border-zinc-800"
      bodyClassName="space-y-4"
    >
      {/* ── 1. Headline (Code / Title) ────────────────────────────────────── */}
      <div className="space-y-1 pb-3 border-b border-[#f1f2f3] dark:border-zinc-800">
        <h4 className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100 break-all leading-[22px]">
          {displayHeadline}
        </h4>
        <div className="flex items-center gap-1.5 text-[12px] text-[#616161] dark:text-zinc-400">
          <span className="font-medium">
            {discountMethod === "CODE" ? "Code" : "Automatic"}
          </span>
          <span>·</span>
          <span className="text-[#008060] font-semibold">Active</span>
        </div>
      </div>

      {/* ── 2. Type ───────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <span className="text-[12px] font-medium text-[#616161] dark:text-zinc-400 uppercase tracking-wider block">
          Type
        </span>
        <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#303030] dark:text-zinc-200">
          <Tag className="h-3.5 w-3.5 text-[#005bd3] dark:text-blue-400 shrink-0" />
          <span>Amount off products</span>
        </div>
        <p className="text-[12px] text-[#616161] dark:text-zinc-400">
          Product discount
        </p>
      </div>

      {/* ── 3. Details Bullet Points ──────────────────────────────────────── */}
      <div className="space-y-2 pt-2 border-t border-[#f1f2f3] dark:border-zinc-800">
        <span className="text-[12px] font-medium text-[#616161] dark:text-zinc-400 uppercase tracking-wider block">
          Details
        </span>
        <ul className="space-y-1.5 text-[13px] text-[#303030] dark:text-zinc-300 leading-[19px]">
          {details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#8c9196] select-none text-[14px] leading-[19px]">
                •
              </span>
              <span className="flex-1">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 4. Live Merchant Summary Badge ─────────────────────────────────── */}
      <div className="p-2.5 rounded-[8px] bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11.5px] font-semibold text-emerald-950 dark:text-emerald-300 truncate">
            Ready to deploy
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/40">
          {formattedDiscountValue}
        </span>
      </div>
    </PolarisCard>
  );
}
