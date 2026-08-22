"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input as UiInput } from "@/components/ui/input";
import {
  PolarisFormCard,
  PolarisPresetChips,
} from "@/components/gamification/shared/polaris-form-ui";
import { DeliveryFulfillmentSection } from "@/components/rewards/shared/delivery-fulfillment-section";
import { SEGMENT_COLORS } from "../constants";
import { Percent } from "lucide-react";

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
        <p className="text-[11px] text-destructive font-medium mt-1 animate-in fade-in-50">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
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
            <Label className="text-xs font-semibold">Slice Display Label *</Label>
            <UiInput
              value={values.label}
              onChange={(e) => setFieldValue("label", e.target.value)}
              placeholder="e.g. 50 Points"
              className="h-10 text-sm"
            />
            {err("label")}
          </div>

          {/* Probability Weight */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-primary" />
                Win Probability (%) *
              </Label>
              <span className="text-[11px] font-mono font-bold text-foreground">
                {values.probability || 10}%
              </span>
            </div>

            <UiInput
              type="number"
              min={1}
              max={100}
              step={0.5}
              value={values.probability || 10}
              onChange={(e) =>
                setFieldValue("probability", parseFloat(e.target.value) || 10)
              }
              className="h-9 font-mono text-xs"
            />

            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium">
                Quick Probability Presets:
              </span>
              <PolarisPresetChips
                presets={PROBABILITY_PRESETS}
                currentValue={values.probability || 10}
                onSelect={(val) => setFieldValue("probability", val)}
                suffix="%"
              />
            </div>
            {err("probability")}
          </div>

          {/* Slice Color Picker */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold">Slice Color</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {SEGMENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFieldValue("color", c)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 shadow-2xs ${
                    values.color === c
                      ? "border-foreground scale-110 ring-2 ring-primary/40"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="color"
                  value={values.color || "#4F46E5"}
                  onChange={(e) => setFieldValue("color", e.target.value)}
                  className="h-8 w-10 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  {values.color || "#4F46E5"}
                </span>
              </div>
            </div>
          </div>

          {/* Sort Order & Active Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Wheel Slice Order</Label>
              <UiInput
                type="number"
                min={1}
                value={values.sortOrder || 1}
                onChange={(e) =>
                  setFieldValue("sortOrder", parseInt(e.target.value) || 1)
                }
                className="h-9 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                Determines sequence position along the wheel perimeter.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="segmentActiveSwitch" className="text-xs font-semibold cursor-pointer">
                  Slice Active
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Include in live wheel rotation
                </p>
              </div>
              <Switch
                id="segmentActiveSwitch"
                checked={values.isActive}
                onCheckedChange={(checked) => setFieldValue("isActive", checked)}
              />
            </div>
          </div>
        </div>
      </PolarisFormCard>
    </div>
  );
}
