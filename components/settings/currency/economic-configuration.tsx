"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, Zap, ArrowRight, Calculator, Coins } from "lucide-react";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useUpdateEntityCurrencyConfig } from "@/graphql/actions";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  loading: boolean;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-900 dark:text-zinc-100" />
      </div>
    );
  }

  const factor = Number(formik.values.normalizationFactor) || 1;
  const currentCurrency = formik.values.currencyName || "Points";
  const simulatedOutcome = (simulatedPoints / factor).toFixed(2);

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-6">
            {/* Live Interactive Conversion Simulator */}
            <PolarisSidebarCard
              title="Economy Simulator"
              badge="Live Calculator"
              icon={Calculator}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    Test Activity Points Earned
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      value={simulatedPoints}
                      onChange={(e) =>
                        setSimulatedPoints(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-bold text-xs shadow-none pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-bold uppercase">
                      PTS
                    </span>
                  </div>
                </div>

                {/* Conversion Result Card */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Simulated Member Payout
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                      {simulatedOutcome}
                    </span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                      {currentCurrency}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {simulatedPoints} raw points ÷ {factor} factor ={" "}
                    <strong>
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
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
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
              <div className="space-y-2">
                <Label
                  htmlFor="currencyName"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Display Name
                </Label>
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Palette className="h-4 w-4" />
                  </div>
                  <Input
                    id="currencyName"
                    name="currencyName"
                    placeholder="e.g. Points, Credits, Gems, Coins"
                    className="h-11 pl-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-semibold shadow-none"
                    value={formik.values.currencyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.currencyName && formik.errors.currencyName && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1">
                    {formik.errors.currencyName as string}
                  </p>
                )}
              </div>

              {/* Quick Preset Name Chips */}
              <div className="space-y-1.5 pt-2">
                <Label className="text-[11px] font-semibold text-zinc-500">
                  Quick Suggestions
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {NAME_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => formik.setFieldValue("currencyName", preset)}
                      className="h-8 px-3 rounded-lg text-xs font-medium border bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
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
              <div className="space-y-2">
                <Label
                  htmlFor="normalizationFactor"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Normalization Factor (Divider)
                </Label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <Input
                      id="normalizationFactor"
                      name="normalizationFactor"
                      type="number"
                      min={1}
                      className="h-11 pl-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 shadow-none"
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
                    <p className="text-[11px] font-medium text-rose-500 mt-1">
                      {formik.errors.normalizationFactor as string}
                    </p>
                  )}
              </div>

              {/* Formula Visual Box */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md font-mono font-bold">
                    100 Activity Pts
                  </span>
                  <span className="text-zinc-400 font-bold">÷</span>
                  <span className="px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md font-mono font-bold">
                    {factor}
                  </span>
                  <span className="text-zinc-400 font-bold">=</span>
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-md font-mono font-bold">
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
