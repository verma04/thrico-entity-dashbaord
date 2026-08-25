"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Zap, Calculator, Coins } from "lucide-react";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useUpdateEntityCurrencyConfig } from "@/graphql/actions";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisInfoBanner,
  PolarisPresetChips,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

interface EconomicConfigProps {
  data: any;
  loading?: boolean;
}

const validationSchema = Yup.object().shape({
  currencyName: Yup.string().required("Currency Name is required"),
  normalizationFactor: Yup.number()
    .positive("Must be positive")
    .integer("Must be an integer")
    .required("Required"),
  tcCoinsAllowed: Yup.boolean(),
});

const FACTOR_PRESETS = [1, 10, 50, 100, 500];
const NAME_PRESETS = ["Points", "Credits", "Coins", "Gems", "Tokens", "Stars"];

export function EconomicConfiguration({ data, loading }: EconomicConfigProps) {
  const [saved, setSaved] = useState(false);
  const [simulatedPoints, setSimulatedPoints] = useState<number>(500);

  const [updateConfig, { loading: updating }] = useUpdateEntityCurrencyConfig({
    onCompleted: () => {
      toast.success("Economic configuration updated");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      formik.resetForm({ values: formik.values });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currencyName: data?.getEntityCurrencyConfig?.currencyName || "Points",
      normalizationFactor:
        data?.getEntityCurrencyConfig?.normalizationFactor || 100,
      tcCoinsAllowed: data?.getEntityCurrencyConfig?.tcCoinsAllowed ?? true,
    },
    validationSchema,
    onSubmit: (values) => {
      updateConfig({
        variables: {
          input: {
            currencyName: values.currencyName,
            normalizationFactor: Number(values.normalizationFactor),
            tcCoinsAllowed: values.tcCoinsAllowed,
          },
        },
      });
    },
  });

  const factor = Number(formik.values.normalizationFactor) || 1;
  const currentCurrency = formik.values.currencyName || "Points";
  const simulatedOutcome = (simulatedPoints / factor).toFixed(2);

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <>
            {/* Live Interactive Conversion Simulator */}
            <PolarisSidebarCard
              title="Economy Simulator"
              badge="Live Calculator"
              icon={Calculator}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#303030] dark:text-zinc-200">
                    Test Activity Points Earned
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      value={simulatedPoints}
                      onChange={(e) =>
                        setSimulatedPoints(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 font-semibold text-[14px] shadow-none pr-14 rounded-[8px]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161] font-bold uppercase tracking-wider">
                      PTS
                    </span>
                  </div>
                </div>

                {/* Conversion Result Card */}
                <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/40 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                    Simulated Member Payout
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-bold font-mono text-[#303030] dark:text-zinc-100">
                      {simulatedOutcome}
                    </span>
                    <span className="text-[12.5px] font-bold text-[#303030] dark:text-zinc-100 uppercase tracking-wider">
                      {currentCurrency}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                    {simulatedPoints} raw points ÷ {factor} factor ={" "}
                    <strong className="text-[#303030] dark:text-zinc-200">
                      {simulatedOutcome} {currentCurrency}
                    </strong>
                  </p>
                </div>

                {/* Summary Rows */}
                <div className="space-y-1 pt-1">
                  <PolarisSummaryRow
                    label="Exchange Rate"
                    value={`1 ${currentCurrency} = ${factor} Pts`}
                  />
                  <PolarisSummaryRow
                    label="Base Ratio"
                    value={`1 : ${factor}`}
                    isLast
                  />
                </div>
              </div>
            </PolarisSidebarCard>

            {/* Strategic Advice Card */}
            <PolarisTipCard title="Tokenomics Best Practice">
              Using a normalization factor of <strong>100</strong> or <strong>50</strong> leverages reward psychology: members feel highly rewarded earning large point batches (+500 pts for placing an order), while maintaining a sane and predictable store economy.
            </PolarisTipCard>
          </>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Info Banner */}
          <PolarisInfoBanner
            title="How Normalization Works"
            description={`Member actions generate raw Activity Points (e.g. post in feed = 10 pts, make purchase = 500 pts). The system divides raw points by your Normalization Factor to credit the member's wallet with ${currentCurrency}.`}
          />

          {/* Step 1: Currency Identity & Naming */}
          <PolarisFormCard
            step={1}
            title="Currency Identity & Display"
            description="Set the visual name and label for your organization's reward token."
            badge="Branding"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="currencyName"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
                >
                  Display Name <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616161]">
                    <Palette className="h-4 w-4" />
                  </div>
                  <Input
                    id="currencyName"
                    name="currencyName"
                    placeholder="e.g. Points, Credits, Gems, Coins"
                    className="h-[40px] pl-9 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] font-medium text-[#303030] dark:text-zinc-100 rounded-[8px] shadow-none"
                    value={formik.values.currencyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.currencyName && formik.errors.currencyName && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.currencyName as string}
                  </p>
                )}
              </div>

              {/* Quick Preset Name Chips */}
              <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <label className="text-[12px] font-medium text-[#616161] dark:text-zinc-400">
                  Quick Suggestions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NAME_PRESETS.map((preset) => {
                    const isSelected = formik.values.currencyName === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => formik.setFieldValue("currencyName", preset)}
                        className={cn(
                          "h-[32px] px-3 rounded-[6px] text-[13px] font-medium border transition-all cursor-pointer",
                          isSelected
                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-semibold"
                            : "bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-300 hover:border-[#8c9196]",
                        )}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Step 2: Points Normalization Factor */}
          <PolarisFormCard
            step={2}
            title="Points Normalization Factor"
            description="The mathematical divider applied when converting raw activity points into wallet currency."
            badge="Conversion Rate"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="normalizationFactor"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
                >
                  Normalization Factor (Divider) <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616161]">
                      <Zap className="h-4 w-4" />
                    </div>
                    <Input
                      id="normalizationFactor"
                      name="normalizationFactor"
                      type="number"
                      min={1}
                      className="h-[40px] pl-9 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] font-semibold font-mono text-[#303030] dark:text-zinc-100 rounded-[8px] shadow-none"
                      value={formik.values.normalizationFactor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <PolarisPresetChips
                    presets={FACTOR_PRESETS}
                    currentValue={Number(formik.values.normalizationFactor)}
                    onSelect={(v) => formik.setFieldValue("normalizationFactor", v)}
                    prefix="÷"
                  />
                </div>
                {formik.touched.normalizationFactor &&
                  formik.errors.normalizationFactor && (
                    <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                      {formik.errors.normalizationFactor as string}
                    </p>
                  )}
              </div>

              {/* Formula Visual Box */}
              <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#303030] dark:text-zinc-200">
                  <span className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 rounded-[6px] font-mono font-semibold">
                    100 Activity Pts
                  </span>
                  <span className="text-[#616161] font-bold">÷</span>
                  <span className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 rounded-[6px] font-mono font-semibold">
                    {factor}
                  </span>
                  <span className="text-[#616161] font-bold">=</span>
                  <span className="px-2.5 py-1 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-[6px] font-mono font-semibold">
                    {(100 / factor).toFixed(2)} {currentCurrency}
                  </span>
                </div>
              </div>
            </div>
          </PolarisFormCard>
        </form>
      </PolarisFormLayout>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={updating}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Economics"
        description="You have modified the currency normalization settings."
        buttonText="Save Economics"
      />
    </div>
  );
}
