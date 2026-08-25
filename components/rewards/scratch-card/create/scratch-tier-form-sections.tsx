"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input as UiInput } from "@/components/ui/input";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";
import { DeliveryFulfillmentSection } from "@/components/rewards/shared/delivery-fulfillment-section";

interface ScratchTierFormSectionsProps {
  formik: any;
  currencyName?: string;
}

export function ScratchTierFormSections({
  formik,
  currencyName = "Points",
}: ScratchTierFormSectionsProps) {
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

      {/* ── Step 2: Tier Display & Presentation ────────────────────────── */}
      <PolarisFormCard
        step={2}
        title="Tier Presentation & Appearance"
        description="Configure how this prize is visually displayed on the scratch card and toggle its availability."
        badge="Appearance"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="label"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              Tier Display Label <span className="text-[#d72c0d] ml-0.5">*</span>
            </label>
            <UiInput
              id="label"
              value={values.label || values.title || ""}
              onChange={(e) => {
                setFieldValue("label", e.target.value);
                setFieldValue("title", e.target.value);
              }}
              placeholder="e.g. 50 Points Scratch Card"
              className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
            />
            {err("label")}
          </div>

          <div className="space-y-1.5 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
            <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
              Card Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardColor || "#4F46E5"}
                onChange={(e) => setFieldValue("cardColor", e.target.value)}
                className="h-8 w-10 rounded-[6px] border border-[#aeb4b9] cursor-pointer bg-transparent"
              />
              <span className="font-mono text-[12px] text-[#616161] uppercase">
                {values.cardColor || "#4F46E5"}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                Enable Tier in Scratch Engine
              </span>
              <p className="text-[12px] text-[#616161] dark:text-zinc-400">
                Active tiers can be immediately won by eligible members
              </p>
            </div>
            <Switch
              checked={values.isActive}
              onCheckedChange={(checked) => setFieldValue("isActive", checked)}
            />
          </div>
        </div>
      </PolarisFormCard>

      {/* ── Step 3: Member Eligibility & Guardrails (Merged) ───────────── */}
      <PolarisEligibilityCard
        key={`eligibility-${values.memberEligibility || "ALL"}`}
        step={3}
        title="Member Eligibility & Guardrails"
        description="Specify which members can win this prize tier and configure anti-abuse fraud restrictions."
        badge="Access & Security"
        eligibility={values.memberEligibility || "ALL"}
        onEligibilityChange={(val) => setFieldValue("memberEligibility", val)}
        tierIds={values.membershipTierId || values.eligibleTierIds || []}
        onTierIdsChange={(tiers) => {
          setFieldValue("membershipTierId", tiers);
          setFieldValue("eligibleTierIds", tiers);
        }}
        userIds={values.eligibleUserIds || []}
        onUserIdsChange={(users) => {
          setFieldValue("eligibleUserIds", users);
        }}
        showToAllMembers={values.showToAllMembers ?? true}
        onShowToAllMembersChange={(val) =>
          setFieldValue("showToAllMembers", val)
        }
        errorMessage={
          values.memberEligibility === "TIERS"
            ? err("membershipTierId") || err("eligibleTierIds")
            : values.memberEligibility === "SPECIFIC_CUSTOMERS"
              ? err("eligibleUserIds")
              : null
        }
      >
        {/* Embedded Anti-Abuse Guardrails */}
        <div className="pt-3 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
              Anti-Abuse & Gating Guardrails
            </span>
            <span className="text-[11.5px] text-[#616161]">
              Optional fraud protection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="minAccountAge"
                  className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                >
                  Min Account Age (Days)
                </label>
                <span className="text-[11px] text-[#616161]">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="minAccountAge"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={values.minAccountAge || ""}
                  onChange={(e) =>
                    setFieldValue(
                      "minAccountAge",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] text-[13px] rounded-[6px] font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  Days
                </span>
              </div>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                Blocks newly registered accounts from winning immediately.
              </p>
              {err("minAccountAge")}
            </div>

            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="minActivity"
                  className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                >
                  Min Lifetime Points Required
                </label>
                <span className="text-[11px] text-[#616161]">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="minActivity"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={values.minActivity || ""}
                  onChange={(e) =>
                    setFieldValue("minActivity", parseInt(e.target.value) || 0)
                  }
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] text-[13px] rounded-[6px] font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  PTS
                </span>
              </div>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                Minimum activity points required to unlock this tier.
              </p>
              {err("minActivity")}
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label
              htmlFor="eligibilityDescription"
              className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
            >
              Eligibility & Gating Note
            </label>
            <UiInput
              id="eligibilityDescription"
              value={values.eligibilityDescription || ""}
              onChange={(e) =>
                setFieldValue("eligibilityDescription", e.target.value)
              }
              placeholder="e.g. Available only for verified VIP tier members"
              className="h-[36px] text-[13px] bg-white dark:bg-zinc-900 border-[#aeb4b9] rounded-[6px]"
            />
            <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
              Optional note displayed to members when explaining tier
              requirements.
            </p>
            {err("eligibilityDescription")}
          </div>
        </div>
      </PolarisEligibilityCard>
    </div>
  );
}
