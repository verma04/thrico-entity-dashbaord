"use client";

import React, { useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import {
  PolarisFormCard,
  PolarisPresetChips,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { DeliveryFulfillmentSection } from "@/components/rewards/shared/delivery-fulfillment-section";
import { DEFAULT_SLOT_SYMBOLS, MatchWinSymbol } from "../types";
import {
  Percent,
  Sparkles,
  Layers,
  Infinity as InfinityIcon,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchWinFormSectionsProps {
  formik: any;
  currencyName?: string;
  symbols?: MatchWinSymbol[];
  existingCombinations?: any[];
  currentCombinationId?: string;
}

const PROBABILITY_PRESETS = [0.5, 1, 2.5, 5, 10, 20];

export function MatchWinFormSections({
  formik,
  currencyName = "Points",
  symbols = DEFAULT_SLOT_SYMBOLS,
  existingCombinations = [],
  currentCombinationId,
}: MatchWinFormSectionsProps) {
  const { values, setFieldValue, touched, errors } = formik;
  const availableSymbols = symbols.length > 0 ? symbols : DEFAULT_SLOT_SYMBOLS;

  const err = (field: string) => {
    const isTouched = Boolean(touched[field]);
    const errorMsg = errors[field];
    if (isTouched && errorMsg) {
      return (
        <p className="text-[12px] text-[#d72c0d] font-normal mt-0.5 leading-[16px]">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  const handleSelectSymbolPattern = (sym: MatchWinSymbol) => {
    setFieldValue("symbol1Id", sym.id || sym.key);
    setFieldValue("symbol2Id", sym.id || sym.key);
    setFieldValue("symbol3Id", sym.id || sym.key);
    if (!values.key || values.key.startsWith("triple_") || values.key === "new_rule") {
      setFieldValue("key", `triple_${sym.key}`);
    }
  };

  const isLoss =
    values.rewardType === "NO_REWARDS" || values.rewardType === "NOTHING";

  // Check for duplicate pattern conflict
  const duplicateMatch = useMemo(() => {
    if (isLoss || !existingCombinations || existingCombinations.length === 0)
      return null;
    return existingCombinations.find((c) => {
      if (
        currentCombinationId &&
        (c.id === currentCombinationId || c.key === currentCombinationId)
      ) {
        return false;
      }
      const s1 = c.symbol1?.id || c.symbol1?.key;
      const s2 = c.symbol2?.id || c.symbol2?.key;
      const s3 = c.symbol3?.id || c.symbol3?.key;
      return (
        s1 &&
        s2 &&
        s3 &&
        s1 === values.symbol1Id &&
        s2 === values.symbol2Id &&
        s3 === values.symbol3Id
      );
    });
  }, [
    isLoss,
    existingCombinations,
    currentCombinationId,
    values.symbol1Id,
    values.symbol2Id,
    values.symbol3Id,
  ]);

  return (
    <div className="space-y-3.5">
      {/* ── Step 1: 3-Reel Pattern & Trigger ─────────────────────────────── */}
      <PolarisFormCard
        step={1}
        title="3-Reel Slot Matching Pattern"
        description="Choose the 3 symbols that trigger this winning combination rule when the reels stop."
        badge="Reel Pattern"
      >
        <div className="space-y-3.5">
          {/* Quick Triple Match Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#303030] dark:text-zinc-300" />
              <PolarisLabel>Quick Triple Match Presets</PolarisLabel>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableSymbols.map((sym) => (
                <button
                  key={sym.key}
                  type="button"
                  onClick={() => handleSelectSymbolPattern(sym)}
                  className="px-2 py-1 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9] text-[11.5px] font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer text-[#303030] dark:text-zinc-100"
                >
                  <span className="text-[13px]">{sym.icon}</span>
                  <span>Triple {sym.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Reel Slots Selector */}
          <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisLabel required>3-Reel Symbol Slots</PolarisLabel>
            <div className="grid grid-cols-3 gap-2">
              {/* Reel 1 */}
              <div className="space-y-1.5 p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 text-center flex flex-col items-center">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#616161]">
                  Reel 1
                </span>
                {(() => {
                  const s1 = availableSymbols.find(
                    (s: any) => (s.id || s.key) === values.symbol1Id,
                  ) || availableSymbols[0];
                  return (
                    <div
                      className="h-10 w-10 rounded-[6px] flex items-center justify-center text-[20px] border shadow-2xs transition-all"
                      style={{
                        borderColor: s1?.color ? `${s1.color}80` : undefined,
                        backgroundColor: s1?.color ? `${s1.color}15` : undefined,
                      }}
                    >
                      <span>{s1?.icon || "🍒"}</span>
                    </div>
                  );
                })()}
                <select
                  value={values.symbol1Id || ""}
                  onChange={(e) => setFieldValue("symbol1Id", e.target.value)}
                  className="w-full h-[28px] rounded-[4px] border border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1 text-[11px] font-semibold text-center cursor-pointer text-[#303030] dark:text-zinc-100"
                >
                  {availableSymbols.map((sym: any) => (
                    <option key={sym.key} value={sym.id || sym.key}>
                      {sym.icon} {sym.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reel 2 */}
              <div className="space-y-1.5 p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 text-center flex flex-col items-center">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#616161]">
                  Reel 2
                </span>
                {(() => {
                  const s2 = availableSymbols.find(
                    (s: any) => (s.id || s.key) === values.symbol2Id,
                  ) || availableSymbols[0];
                  return (
                    <div
                      className="h-10 w-10 rounded-[6px] flex items-center justify-center text-[20px] border shadow-2xs transition-all"
                      style={{
                        borderColor: s2?.color ? `${s2.color}80` : undefined,
                        backgroundColor: s2?.color ? `${s2.color}15` : undefined,
                      }}
                    >
                      <span>{s2?.icon || "🍒"}</span>
                    </div>
                  );
                })()}
                <select
                  value={values.symbol2Id || ""}
                  onChange={(e) => setFieldValue("symbol2Id", e.target.value)}
                  className="w-full h-[28px] rounded-[4px] border border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1 text-[11px] font-semibold text-center cursor-pointer text-[#303030] dark:text-zinc-100"
                >
                  {availableSymbols.map((sym: any) => (
                    <option key={sym.key} value={sym.id || sym.key}>
                      {sym.icon} {sym.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reel 3 */}
              <div className="space-y-1.5 p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 text-center flex flex-col items-center">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#616161]">
                  Reel 3
                </span>
                {(() => {
                  const s3 = availableSymbols.find(
                    (s: any) => (s.id || s.key) === values.symbol3Id,
                  ) || availableSymbols[0];
                  return (
                    <div
                      className="h-10 w-10 rounded-[6px] flex items-center justify-center text-[20px] border shadow-2xs transition-all"
                      style={{
                        borderColor: s3?.color ? `${s3.color}80` : undefined,
                        backgroundColor: s3?.color ? `${s3.color}15` : undefined,
                      }}
                    >
                      <span>{s3?.icon || "🍒"}</span>
                    </div>
                  );
                })()}
                <select
                  value={values.symbol3Id || ""}
                  onChange={(e) => setFieldValue("symbol3Id", e.target.value)}
                  className="w-full h-[28px] rounded-[4px] border border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1 text-[11px] font-semibold text-center cursor-pointer text-[#303030] dark:text-zinc-100"
                >
                  {availableSymbols.map((sym: any) => (
                    <option key={sym.key} value={sym.id || sym.key}>
                      {sym.icon} {sym.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Duplicate Pattern Alert Banner */}
          {duplicateMatch && (
            <div className="p-3 rounded-[6px] border border-[#d72c0d]/30 bg-[#d72c0d]/10 text-[#d72c0d] text-[11.5px] flex items-start gap-2 animate-in fade-in-50">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#d72c0d]" />
              <div className="space-y-0.5">
                <p className="font-bold text-[#d72c0d]">
                  3-Symbol Pattern Already Exists
                </p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  A combination with this 3-symbol pattern already exists (Rule Key:{" "}
                  <strong className="underline">{duplicateMatch.key}</strong>).
                  Please choose a different sequence or edit the existing rule.
                </p>
              </div>
            </div>
          )}

          {/* Rule Identifier Key */}
          <PolarisInput
            id="key"
            name="key"
            label="Rule Key"
            required
            value={values.key}
            onChange={(e) =>
              setFieldValue(
                "key",
                e.target.value.toLowerCase().replace(/\s+/g, "_"),
              )
            }
            onBlur={formik.handleBlur}
            placeholder="e.g. triple_cherry, jackpot_777, bar_triple"
            helperText="Unique programmatic identifier for this combination rule."
            error={touched.key && errors.key ? String(errors.key) : undefined}
          />
        </div>
      </PolarisFormCard>

      {/* ── Step 2: Multi-Pillar Reward Fulfillment ──────────────────────── */}
      <DeliveryFulfillmentSection
        formik={formik}
        step={2}
        allowPoints={true}
        allowTryAgain={true}
        currencyName={currencyName}
        showSupplyLimits={false}
        pillarField="mechanism"
        err={err}
      />

      {/* ── Step 3: Probability & Win Constraints ────────────────────────── */}
      <PolarisFormCard
        step={3}
        title="Hit Probability & Win Limits"
        description="Configure winning odds and lifetime caps for this combination."
        badge="Economics"
      >
        <div className="space-y-3.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <PolarisLabel required>
                Win Probability (%)
              </PolarisLabel>
              <span className="text-[11.5px] font-mono font-bold text-[#303030] dark:text-zinc-100">
                {values.probability}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex-1 sm:max-w-xs">
                <PolarisInput
                  id="probability"
                  type="number"
                  name="probability"
                  step="0.01"
                  min="0.01"
                  max="100"
                  suffix="%"
                  value={values.probability}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Custom probability %"
                  error={touched.probability && errors.probability ? String(errors.probability) : undefined}
                />
              </div>

              <PolarisPresetChips
                presets={PROBABILITY_PRESETS}
                currentValue={Number(values.probability)}
                onSelect={(val) => setFieldValue("probability", val)}
                prefix=""
                suffix="%"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisInput
              id="maxWins"
              type="number"
              name="maxWins"
              min="0"
              label="Lifetime Maximum Wins (Optional)"
              value={values.maxWins || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0 (Unlimited)"
              suffix="WINS"
              helperText="Total number of times this combination can be won before it stops triggering. Set 0 for unlimited."
            />
          </div>
        </div>
      </PolarisFormCard>
    </div>
  );
}

export default MatchWinFormSections;
