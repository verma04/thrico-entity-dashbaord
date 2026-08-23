"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { PolarisRadioGroup } from "../primitives/polaris-radio-group";
import { PolarisInput } from "../primitives/polaris-input";
import { MinRequirementType } from "../types";

export interface MinimumPurchaseCardProps {
  minType: MinRequirementType;
  onMinTypeChange: (type: MinRequirementType) => void;
  minAmount: number | string;
  onMinAmountChange: (val: string) => void;
  minAmountError?: string | null;
  minQuantity: number | string;
  onMinQuantityChange: (val: string) => void;
  minQuantityError?: string | null;
}

export function MinimumPurchaseCard({
  minType,
  onMinTypeChange,
  minAmount,
  onMinAmountChange,
  minAmountError,
  minQuantity,
  onMinQuantityChange,
  minQuantityError,
}: MinimumPurchaseCardProps) {
  return (
    <PolarisCard title="Minimum purchase requirements">
      <PolarisRadioGroup<MinRequirementType>
        name="min-purchase-requirements"
        value={minType}
        onChange={onMinTypeChange}
        options={[
          {
            value: "NONE",
            label: "No minimum requirements",
          },
          {
            value: "AMOUNT",
            label: "Minimum purchase amount ($)",
            children: (
              <div className="max-w-[280px] pt-1">
                <PolarisInput
                  id="min-purchase-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  prefix="$"
                  value={minAmount}
                  onChange={(e) => onMinAmountChange(e.target.value)}
                  error={minAmountError}
                  placeholder="50.00"
                  helperText="Applies to all eligible items in order"
                />
              </div>
            ),
          },
          {
            value: "QUANTITY",
            label: "Minimum quantity of items",
            children: (
              <div className="max-w-[280px] pt-1">
                <PolarisInput
                  id="min-quantity-items"
                  type="number"
                  min="1"
                  step="1"
                  value={minQuantity}
                  onChange={(e) => onMinQuantityChange(e.target.value)}
                  error={minQuantityError}
                  placeholder="2"
                  suffix="items"
                  helperText="Applies to all eligible items in order"
                />
              </div>
            ),
          },
        ]}
      />
    </PolarisCard>
  );
}
