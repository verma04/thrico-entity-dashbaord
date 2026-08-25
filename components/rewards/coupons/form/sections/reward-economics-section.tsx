"use client";

import React from "react";
import Link from "next/link";
import { Coins, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  PolarisFormCard,
  PolarisPresetChips,
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="tcCost"
            className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none flex items-center gap-1.5"
          >
            Point Cost ({currencyName}) <span className="text-[#d72c0d] ml-0.5">*</span>
            <Link
              href="/gamification/currency/economics"
              target="_blank"
              title={`Manage ${currencyName} Economics`}
            >
              <Info className="h-3.5 w-3.5 text-[#616161] hover:text-[#303030] transition-colors cursor-pointer" />
            </Link>
          </label>
          <span className="text-[12px] text-[#616161] font-medium">
            Min. 1 {currencyName}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#616161]">
              <Coins className="h-4 w-4" />
            </div>
            <Input
              id="tcCost"
              type="number"
              min={1}
              className="h-[40px] pl-10 pr-16 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] font-semibold text-[#303030] dark:text-zinc-100 rounded-[8px]"
              {...formik.getFieldProps("tcCost")}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[11.5px] font-semibold text-[#616161] uppercase tracking-wider">
              {currencyName.substring(0, 3).toUpperCase()}
            </div>
          </div>

          <PolarisPresetChips
            presets={COST_PRESETS}
            currentValue={Number(formik.values.tcCost)}
            onSelect={(v) => formik.setFieldValue("tcCost", v)}
            prefix=""
          />
        </div>
        {err("tcCost")}
      </div>

      {/* Expiration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#e1e3e5] dark:border-zinc-800">
        <div className="space-y-1.5">
          <label
            htmlFor="validityDays"
            className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
          >
            Validity (Days) <span className="text-[#d72c0d] ml-0.5">*</span>
          </label>
          <Input
            id="validityDays"
            type="number"
            className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] font-medium text-[#303030] dark:text-zinc-100 rounded-[8px]"
            name="validityDays"
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
          />
          {err("validityDays")}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="expiryDate"
            className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
          >
            Calculated Expiration Date
          </label>
          <Input
            id="expiryDate"
            type="datetime-local"
            className="h-[40px] bg-[#f6f6f7] dark:bg-zinc-800/60 border-[#d2d5d9] dark:border-zinc-700 text-[13.5px] font-mono text-[#303030] dark:text-zinc-100 rounded-[8px]"
            name="expiryDate"
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
      </div>
    </PolarisFormCard>
  );
}
