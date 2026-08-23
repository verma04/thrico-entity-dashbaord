"use client";

import React, { useState } from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { PolarisSelect } from "../primitives/polaris-select";
import { PolarisInput } from "../primitives/polaris-input";
import { BrowseModal } from "../primitives/browse-modal";
import { Button } from "@/components/ui/button";
import { Search, Folder, Package, X } from "lucide-react";
import {
  DiscountType,
  AppliesToType,
  PurchaseType,
  SelectedItem,
} from "../types";

export interface DiscountValueCardProps {
  discountType: DiscountType;
  onDiscountTypeChange: (type: DiscountType) => void;
  value: number | string;
  onValueChange: (val: string) => void;
  valueError?: string | null;

  appliesTo: AppliesToType;
  onAppliesToChange: (appliesTo: AppliesToType) => void;

  selectedCollections: SelectedItem[];
  onCollectionsChange: (items: SelectedItem[]) => void;

  selectedProducts: SelectedItem[];
  onProductsChange: (items: SelectedItem[]) => void;

  purchaseType: PurchaseType;
  onPurchaseTypeChange: (purchaseType: PurchaseType) => void;
}

export function DiscountValueCard({
  discountType,
  onDiscountTypeChange,
  value,
  onValueChange,
  valueError,
  appliesTo,
  onAppliesToChange,
  selectedCollections,
  onCollectionsChange,
  selectedProducts,
  onProductsChange,
  purchaseType,
  onPurchaseTypeChange,
}: DiscountValueCardProps) {
  const [browseModalOpen, setBrowseModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const isSpecificCollections = appliesTo === "SPECIFIC_COLLECTIONS";
  const isSpecificProducts = appliesTo === "SPECIFIC_PRODUCTS";
  const showSearchBrowse = isSpecificCollections || isSpecificProducts;

  const currentSelectedItems = isSpecificCollections
    ? selectedCollections
    : selectedProducts;

  const handleRemoveItem = (id: string) => {
    if (isSpecificCollections) {
      onCollectionsChange(selectedCollections.filter((c) => c.id !== id));
    } else {
      onProductsChange(selectedProducts.filter((p) => p.id !== id));
    }
  };

  const handleModalConfirm = (items: SelectedItem[]) => {
    if (isSpecificCollections) {
      onCollectionsChange(items);
    } else {
      onProductsChange(items);
    }
  };

  return (
    <PolarisCard title="Value">
      {/* ── 1. Value Section (Two-Column: Type + Amount) ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <PolarisSelect
            id="discount-type-select"
            label="Discount value"
            value={discountType}
            onChange={(val) => onDiscountTypeChange(val as DiscountType)}
            options={[
              { value: "PERCENTAGE", label: "Percentage" },
              { value: "FIXED_AMOUNT", label: "Fixed amount" },
            ]}
          />
        </div>
        <div className="sm:col-span-1">
          <PolarisInput
            id="discount-value-amount"
            label={discountType === "PERCENTAGE" ? "Percentage" : "Amount"}
            type="number"
            min="0"
            step={discountType === "PERCENTAGE" ? "1" : "0.01"}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            suffix={discountType === "PERCENTAGE" ? "%" : undefined}
            prefix={discountType === "FIXED_AMOUNT" ? "$" : undefined}
            error={valueError}
            placeholder={discountType === "PERCENTAGE" ? "20" : "10.00"}
          />
        </div>
      </div>

      {/* ── 2. Secondary Two-Column Row (Applies to + Purchase type) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <PolarisSelect
          id="applies-to-select"
          label="Applies to"
          value={appliesTo}
          onChange={(val) => onAppliesToChange(val as AppliesToType)}
          options={[
            { value: "ALL", label: "All products" },
            { value: "SPECIFIC_COLLECTIONS", label: "Specific collections" },
            { value: "SPECIFIC_PRODUCTS", label: "Specific products" },
          ]}
        />

        <PolarisSelect
          id="purchase-type-select"
          label="Purchase type"
          value={purchaseType}
          onChange={(val) => onPurchaseTypeChange(val as PurchaseType)}
          options={[
            { value: "ONE_TIME", label: "One-time purchase" },
            { value: "SUBSCRIPTION", label: "Subscription" },
            { value: "BOTH", label: "Both" },
          ]}
        />
      </div>

      {/* ── 3. Dependent Search + Browse Row ───────────────────────────────── */}
      {showSearchBrowse && (
        <div className="space-y-2 pt-2 border-t border-[#f1f2f3] dark:border-zinc-800 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161]" />
              <input
                type="text"
                placeholder={
                  isSpecificCollections
                    ? "Search collections"
                    : "Search products"
                }
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-[40px] pl-9 pr-3 text-[14px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] rounded-[8px] outline-none transition-all placeholder:text-[#8c9196]"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBrowseModalOpen(true)}
              className="h-[40px] w-[80px] rounded-[8px] border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 shrink-0"
            >
              Browse
            </Button>
          </div>

          {/* Selected Item Chips List */}
          {currentSelectedItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentSelectedItems.map((item) => (
                <div
                  key={item.id}
                  className="inline-flex items-center gap-2 py-1.5 px-2.5 rounded-[8px] bg-zinc-50 dark:bg-zinc-800/80 border border-[#d2d5d9] dark:border-zinc-700 text-[13px] text-[#303030] dark:text-zinc-200"
                >
                  {isSpecificCollections ? (
                    <Folder className="h-3.5 w-3.5 text-[#005bd3] shrink-0" />
                  ) : (
                    <Package className="h-3.5 w-3.5 text-[#005bd3] shrink-0" />
                  )}
                  <span className="font-medium max-w-[220px] truncate">
                    {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-4 w-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-[#616161] hover:text-[#303030] dark:hover:text-white transition-colors cursor-pointer"
                    aria-label={`Remove ${item.title}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Browse Modal */}
      <BrowseModal
        open={browseModalOpen}
        onOpenChange={setBrowseModalOpen}
        type={isSpecificCollections ? "collection" : "product"}
        selectedItems={currentSelectedItems}
        onConfirm={handleModalConfirm}
      />
    </PolarisCard>
  );
}
