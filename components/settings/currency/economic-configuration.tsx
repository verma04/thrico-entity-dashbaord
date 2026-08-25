"use client";

import React, { useState } from "react";
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
  PolarisInput,
  PolarisLabel,
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
              <div className="space-y-3.5">
                <PolarisInput
                  id="simulatedPoints"
                  type="number"
                  min={0}
                  label="Test Activity Points Earned"
                  suffix="PTS"
                  value={simulatedPoints}
                  onChange={(e) =>
                    setSimulatedPoints(Math.max(0, Number(e.target.value) || 0))
                  }
                />

                {/* Conversion Result Card */}
                <div className="p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/40 space-y-1">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#616161]">
                    Simulated Member Payout
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold font-mono text-[#303030] dark:text-zinc-100">
                      {simulatedOutcome}
                    </span>
                    <span className="text-[11.5px] font-bold text-[#303030] dark:text-zinc-100 uppercase tracking-wider">
                      {currentCurrency}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    {simulatedPoints} raw points ÷ {factor} factor ={" "}
                    <strong className="text-[#303030] dark:text-zinc-200">
                      {simulatedOutcome} {currentCurrency}
                    </strong>
                  </p>
                </div>

                {/* Summary Rows */}
                <div className="space-y-0.5 pt-1">
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
        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
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
            <div className="space-y-3.5">
              <div className="max-w-md">
                <PolarisInput
                  id="currencyName"
                  name="currencyName"
                  label="Display Name"
                  required
                  placeholder="e.g. Points, Credits, Gems, Coins"
                  prefix={<Palette className="h-3.5 w-3.5" />}
                  value={formik.values.currencyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.currencyName && formik.errors.currencyName ? (formik.errors.currencyName as string) : undefined}
                />
              </div>

              {/* Quick Preset Name Chips */}
              <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <span className="text-[11.5px] font-medium text-[#616161] dark:text-zinc-400">
                  Quick Suggestions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {NAME_PRESETS.map((preset) => {
                    const isSelected = formik.values.currencyName === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => formik.setFieldValue("currencyName", preset)}
                        className={cn(
                          "h-[28px] px-2.5 rounded-[5px] text-[11.5px] font-medium border transition-all cursor-pointer",
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
            <div className="space-y-3.5">
              <div className="space-y-2">
                <PolarisLabel required>Normalization Factor (Divider)</PolarisLabel>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1 max-w-sm">
                    <PolarisInput
                      id="normalizationFactor"
                      name="normalizationFactor"
                      type="number"
                      min={1}
                      prefix={<Zap className="h-3.5 w-3.5" />}
                      value={formik.values.normalizationFactor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.normalizationFactor && formik.errors.normalizationFactor ? (formik.errors.normalizationFactor as string) : undefined}
                    />
                  </div>

                  <PolarisPresetChips
                    presets={FACTOR_PRESETS}
                    currentValue={Number(formik.values.normalizationFactor)}
                    onSelect={(v) => formik.setFieldValue("normalizationFactor", v)}
                    prefix="÷"
                  />
                </div>
              </div>

              {/* Formula Visual Box */}
              <div className="p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#303030] dark:text-zinc-200">
                  <span className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 rounded-[5px] font-mono font-semibold">
                    100 Activity Pts
                  </span>
                  <span className="text-[#616161] font-bold">÷</span>
                  <span className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 rounded-[5px] font-mono font-semibold">
                    {factor}
                  </span>
                  <span className="text-[#616161] font-bold">=</span>
                  <span className="px-2 py-0.5 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-[5px] font-mono font-semibold">
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
