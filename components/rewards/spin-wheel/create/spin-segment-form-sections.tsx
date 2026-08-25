"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input as UiInput } from "@/components/ui/input";
import {
  PolarisFormCard,
  PolarisPresetChips,
} from "@/components/gamification/shared/polaris-form-ui";
import { DeliveryFulfillmentSection } from "@/components/rewards/shared/delivery-fulfillment-section";
import { SEGMENT_COLORS } from "../constants";
import { Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinSegmentFormSectionsProps {
  formik: any;
  currencyName?: string;
}

const PROBABILITY_PRESETS = [5, 10, 15, 20, 25, 50];

export function SpinSegmentFormSections({
  formik,
  currencyName = "Points",
}: SpinSegmentFormSectionsProps) {
  const { values, setFieldValue, touched, errors } = formik;

  const err = (field: string) => {
    const isTouched = Boolean(touched[field]);
    const errorMsg = errors[field];
    if (isTouched && errorMsg) {
      return (
        <p className="text-[12.5px] text-[#d72c0d] font-normal mt-1 leading-[18px]">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* ── Step 1: Reward Mechanism & Fulfillment (Shared Multi-Pillar Component) ── */}
      <DeliveryFulfillmentSection
        formik={formik}
        step={1}
        allowPoints={true}
        allowTryAgain={true}
        currencyName={currencyName}
        showSupplyLimits={false}
        pillarField="mechanism"
        err={err}
      />

      {/* ── Step 2: Segment Appearance & Probability ─────────────────────── */}
      <PolarisFormCard
        step={2}
        title="Segment Appearance & Probability"
        description="Configure slice display label, slice color, and relative win probability on the wheel."
        badge="Wheel Geometry"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="label"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              Slice Display Label <span className="text-[#d72c0d] ml-0.5">*</span>
            </label>
            <UiInput
              id="label"
              value={values.label}
              onChange={(e) => setFieldValue("label", e.target.value)}
              placeholder="e.g. 50 Points"
              className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
            />
            {err("label")}
          </div>

          {/* Probability Weight */}
          <div className="space-y-2 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <label
                htmlFor="probability"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none flex items-center gap-1.5"
              >
                <Percent className="h-3.5 w-3.5 text-[#616161]" />
                Win Probability (%) <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <span className="text-[12px] font-mono font-semibold text-[#303030] dark:text-zinc-100">
                {values.probability || 10}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <UiInput
                id="probability"
                type="number"
                min={1}
                max={100}
                step={0.5}
                value={values.probability || 10}
                onChange={(e) =>
                  setFieldValue("probability", parseFloat(e.target.value) || 10)
                }
                className="h-[40px] font-mono text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] sm:max-w-xs"
              />

              <PolarisPresetChips
                presets={PROBABILITY_PRESETS}
                currentValue={Number(values.probability)}
                onSelect={(v) => setFieldValue("probability", v)}
                prefix=""
                suffix="%"
              />
            </div>
            {err("probability")}
          </div>

          {/* Segment Color Palette */}
          <div className="space-y-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
              Wheel Slice Theme Color
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {SEGMENT_COLORS.map((c) => {
                const isSelected =
                  values.color?.toLowerCase() === c.hex.toLowerCase();

                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFieldValue("color", c.hex)}
                    title={c.name}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all cursor-pointer relative flex items-center justify-center shadow-2xs",
                      isSelected
                        ? "ring-2 ring-[#303030] ring-offset-2 scale-110"
                        : "hover:scale-105 opacity-85 hover:opacity-100",
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                );
              })}

              <div className="flex items-center gap-1.5 pl-2">
                <input
                  type="color"
                  value={values.color || "#4F46E5"}
                  onChange={(e) => setFieldValue("color", e.target.value)}
                  className="h-8 w-8 rounded-[6px] border border-[#aeb4b9] cursor-pointer bg-transparent"
                />
                <span className="text-[12px] font-mono text-[#616161] uppercase">
                  {values.color || "#4F46E5"}
                </span>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between mt-2">
            <div className="space-y-0.5">
              <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                Active Slice on Wheel
              </span>
              <p className="text-[12px] text-[#616161] dark:text-zinc-400">
                Determines whether this segment can be landed on by players.
              </p>
            </div>
            <Switch
              checked={values.isActive}
              onCheckedChange={(c) => setFieldValue("isActive", c)}
            />
          </div>
        </div>
      </PolarisFormCard>
    </div>
  );
}
