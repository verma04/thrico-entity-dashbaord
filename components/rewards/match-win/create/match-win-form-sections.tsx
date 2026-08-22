"use client";

import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input as UiInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PolarisFormCard,
  PolarisPresetChips,
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
        <p className="text-[11px] text-destructive font-medium mt-1 animate-in fade-in-50">
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
    <div className="space-y-6">
      {/* ── Step 1: 3-Reel Pattern & Trigger ─────────────────────────────── */}
      <PolarisFormCard
        step={1}
        title="3-Reel Slot Matching Pattern"
        description="Choose the 3 symbols that trigger this winning combination rule when the reels stop."
        badge="Reel Pattern"
      >
        <div className="space-y-5">
          {/* Quick Triple Match Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Quick Triple Match Presets
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableSymbols.map((sym) => (
                <button
                  key={sym.key}
                  type="button"
                  onClick={() => handleSelectSymbolPattern(sym)}
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <span className="text-base">{sym.icon}</span>
                  <span>Triple {sym.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Reel Slots Selector */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <Label className="text-xs font-semibold">3-Reel Symbol Slots *</Label>
            <div className="grid grid-cols-3 gap-3">
              {/* Reel 1 */}
              <div className="space-y-2 p-3 rounded-xl border border-border bg-muted/20 text-center flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Reel 1
                </span>
                {(() => {
                  const s1 = availableSymbols.find(
                    (s: any) => (s.id || s.key) === values.symbol1Id,
                  ) || availableSymbols[0];
                  return (
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl border shadow-sm transition-all"
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
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-center cursor-pointer"
                >
                  {availableSymbols.map((sym: any) => (
                    <option key={sym.key} value={sym.id || sym.key}>
                      {sym.icon} {sym.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reel 2 */}
              <div className="space-y-2 p-3 rounded-xl border border-border bg-muted/20 text-center flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Reel 2
                </span>
                {(() => {
                  const s2 = availableSymbols.find(
                    (s: any) => (s.id || s.key) === values.symbol2Id,
                  ) || availableSymbols[0];
                  return (
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl border shadow-sm transition-all"
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
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-center cursor-pointer"
                >
                  {availableSymbols.map((sym: any) => (
                    <option key={sym.key} value={sym.id || sym.key}>
                      {sym.icon} {sym.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reel 3 */}
              <div className="space-y-2 p-3 rounded-xl border border-border bg-muted/20 text-center flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Reel 3
                </span>
                {(() => {
                  const s3 = availableSymbols.find(
                    (s: any) => (s.id || s.key) === values.symbol3Id,
                  ) || availableSymbols[0];
                  return (
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl border shadow-sm transition-all"
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
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-center cursor-pointer"
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
            <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in-50">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
              <div className="space-y-0.5">
                <p className="font-bold text-destructive">
                  3-Symbol Pattern Already Exists
                </p>
                <p className="text-[11px] opacity-90 text-destructive/90 leading-relaxed">
                  A combination with this 3-symbol pattern already exists (Rule Key:{" "}
                  <strong className="underline">{duplicateMatch.key}</strong>).
                  Please choose a different sequence or edit the existing rule.
                </p>
              </div>
            </div>
          )}

          {/* Rule Identifier Key */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold">Rule Key *</Label>
            <UiInput
              name="key"
              value={values.key}
              onChange={(e) =>
                setFieldValue(
                  "key",
                  e.target.value.toLowerCase().replace(/\s+/g, "_"),
                )
              }
              placeholder="e.g. triple_cherry, jackpot_777, bar_triple"
              className="h-9 text-xs font-mono"
            />
            {err("key")}
            <p className="text-[11px] text-muted-foreground">
              Unique programmatic identifier for this combination rule.
            </p>
          </div>
        </div>
      </PolarisFormCard>

      {/* ── Step 2: Multi-Pillar Reward Fulfillment ──────────────────────── */}
      <DeliveryFulfillmentSection
        formik={formik}
        currencyName={currencyName}
        contextTitle="Match & Win Game"
        supportTryAgain={true}
      />

      {/* ── Step 3: Probability & Win Constraints ────────────────────────── */}
      <PolarisFormCard
        step={3}
        title="Hit Probability & Win Limits"
        description="Configure winning odds and lifetime caps for this combination."
        badge="Economics"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-primary" />
                Win Probability (%) *
              </Label>
              <span className="text-xs font-mono font-bold text-primary">
                {values.probability}%
              </span>
            </div>

            <PolarisPresetChips
              presets={PROBABILITY_PRESETS}
              value={Number(values.probability)}
              onChange={(val) => setFieldValue("probability", val)}
              unit="%"
            />

            <UiInput
              type="number"
              name="probability"
              step="0.01"
              min="0.01"
              max="100"
              value={values.probability}
              onChange={formik.handleChange}
              placeholder="Custom probability %"
              className="h-9 text-xs font-mono"
            />
            {err("probability")}
            <p className="text-[11px] text-muted-foreground">
              Probability percentage when a user plays a round.
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <InfinityIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Lifetime Maximum Wins (Optional)
            </Label>
            <UiInput
              type="number"
              name="maxWins"
              min="0"
              value={values.maxWins || ""}
              onChange={formik.handleChange}
              placeholder="0 or empty for unlimited wins"
              className="h-9 text-xs font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              Total number of times this combination can be won before it stops triggering. Set 0 for unlimited.
            </p>
          </div>
        </div>
      </PolarisFormCard>
    </div>
  );
}

export default MatchWinFormSections;
