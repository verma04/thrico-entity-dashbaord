"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { PolarisCheckbox } from "../primitives/polaris-checkbox";
import { PolarisInput } from "../primitives/polaris-input";

export interface MaximumUsesCardProps {
  limitTotalUses: boolean;
  onLimitTotalUsesChange: (val: boolean) => void;
  totalUsesLimit: number | string;
  onTotalUsesLimitChange: (val: string) => void;
  totalUsesLimitError?: string | null;

  limitOncePerCustomer: boolean;
  onLimitOncePerCustomerChange: (val: boolean) => void;
}

export function MaximumUsesCard({
  limitTotalUses,
  onLimitTotalUsesChange,
  totalUsesLimit,
  onTotalUsesLimitChange,
  totalUsesLimitError,
  limitOncePerCustomer,
  onLimitOncePerCustomerChange,
}: MaximumUsesCardProps) {
  return (
    <PolarisCard title="Maximum discount uses">
      <div className="space-y-2">
        {/* Checkbox 1: Limit total uses */}
        <PolarisCheckbox
          id="limit-total-uses"
          checked={limitTotalUses}
          onChange={onLimitTotalUsesChange}
          label="Limit number of times this discount can be used in total"
        >
          <div className="max-w-[280px]">
            <PolarisInput
              id="total-uses-input"
              label="Number of uses"
              type="number"
              min="1"
              step="1"
              value={totalUsesLimit}
              onChange={(e) => onTotalUsesLimitChange(e.target.value)}
              error={totalUsesLimitError}
              placeholder="100"
            />
          </div>
        </PolarisCheckbox>

        {/* Checkbox 2: Limit to one use per customer */}
        <PolarisCheckbox
          id="limit-once-per-customer"
          checked={limitOncePerCustomer}
          onChange={onLimitOncePerCustomerChange}
          label="Limit to one use per customer"
        />
      </div>
    </PolarisCard>
  );
}
