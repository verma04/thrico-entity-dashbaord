"use client";

import React from "react";
import Link from "next/link";
import { Coins, Info } from "lucide-react";
import {
  PolarisFormCard,
  PolarisPresetChips,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

const COST_PRESETS = [10, 50, 100, 250, 500];

interface RewardEconomicsSectionProps {
  formik: any;
  currencyName: string;
  err: (field: string) => React.ReactNode;
}

export function RewardEconomicsSection({
  formik,
  currencyName,
  err,
}: RewardEconomicsSectionProps) {
  return (
    <PolarisFormCard
      step={2}
      title="Reward Economics"
      description="Adjust point pricing, discount format, and reward expiration rules."
      badge="Pricing Engine"
    >
      {/* Point Cost Field with Quick Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PolarisLabel required>
              Point Cost ({currencyName})
            </PolarisLabel>
            <Link
              href="/gamification/currency/economics"
              target="_blank"
              title={`Manage ${currencyName} Economics`}
            >
              <Info className="h-3 w-3 text-[#616161] hover:text-[#303030] transition-colors cursor-pointer" />
            </Link>
          </div>
          <span className="text-[11.5px] text-[#616161] font-medium">
            Min. 1 {currencyName}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1">
            <PolarisInput
              id="tcCost"
              type="number"
              min={1}
              prefix={<Coins className="h-3.5 w-3.5" />}
              suffix={currencyName.substring(0, 3).toUpperCase()}
              value={formik.values.tcCost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tcCost && formik.errors.tcCost ? String(formik.errors.tcCost) : undefined}
            />
          </div>

          <PolarisPresetChips
            presets={COST_PRESETS}
            currentValue={Number(formik.values.tcCost)}
            onSelect={(v) => formik.setFieldValue("tcCost", v)}
            prefix=""
          />
        </div>
      </div>

      {/* Expiration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3.5 border-t border-[#e1e3e5] dark:border-zinc-800">
        <PolarisInput
          id="validityDays"
          name="validityDays"
          type="number"
          label="Validity (Days)"
          required
          value={formik.values.validityDays}
          onChange={(e) => {
            formik.handleChange(e);
            const days = parseInt(e.target.value, 10);
            if (!isNaN(days)) {
              const date = new Date();
              date.setDate(date.getDate() + days);
              const offset = date.getTimezoneOffset() * 60000;
              const localISOTime = new Date(date.getTime() - offset)
                .toISOString()
                .slice(0, 16);
              formik.setFieldValue("expiryDate", localISOTime);
            }
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.validityDays && formik.errors.validityDays ? String(formik.errors.validityDays) : undefined}
        />

        <PolarisInput
          id="expiryDate"
          name="expiryDate"
          type="datetime-local"
          label="Calculated Expiration Date"
          value={formik.values.expiryDate}
          onChange={(e) => {
            formik.handleChange(e);
            const selectedDate = new Date(e.target.value);
            const now = new Date();
            const diffTime = selectedDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              formik.setFieldValue("validityDays", diffDays);
            }
          }}
          onBlur={formik.handleBlur}
        />
      </div>
    </PolarisFormCard>
  );
}
