"use client";

import React from "react";
import Link from "next/link";
import { Coins, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <Label
            htmlFor="tcCost"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
          >
            Point Cost ({currencyName})
            <Link
              href="/currency/economics"
              target="_blank"
              title={`Manage ${currencyName} Economics`}
            >
              <Info className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
          </Label>
          <span className="text-[11px] text-zinc-400 font-medium">
            Min. 1 {currencyName}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-900 dark:text-zinc-100">
              <Coins className="h-4 w-4" />
            </div>
            <Input
              id="tcCost"
              type="number"
              min={1}
              className="h-11 pl-10 pr-16 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-bold text-zinc-900 dark:text-zinc-100 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
              {...formik.getFieldProps("tcCost")}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-zinc-400 uppercase tracking-wider">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="space-y-2">
          <Label
            htmlFor="validityDays"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Validity (Days)
          </Label>
          <Input
            id="validityDays"
            type="number"
            className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-medium"
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
              } else {
                formik.setFieldValue("expiryDate", "");
              }
            }}
            onBlur={formik.handleBlur}
          />
          {err("validityDays")}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="expiryDate"
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Expiry Date
          </Label>
          <Input
            id="expiryDate"
            type="datetime-local"
            className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-medium"
            name="expiryDate"
            value={formik.values.expiryDate}
            onClick={(e) => {
              try {
                (e.target as any).showPicker();
              } catch {
                // Ignore if unsupported
              }
            }}
            onChange={(e) => {
              formik.handleChange(e);
              if (e.target.value) {
                const date = new Date(e.target.value);
                if (!isNaN(date.getTime())) {
                  const now = new Date();
                  const diffTime = date.getTime() - now.getTime();
                  const diffDays = Math.ceil(
                    diffTime / (1000 * 60 * 60 * 24),
                  );
                  formik.setFieldValue(
                    "validityDays",
                    diffDays > 0 ? diffDays : 0,
                  );
                }
              } else {
                formik.setFieldValue("validityDays", "");
              }
            }}
            onBlur={formik.handleBlur}
          />
          {err("expiryDate")}
        </div>
      </div>
    </PolarisFormCard>
  );
}
