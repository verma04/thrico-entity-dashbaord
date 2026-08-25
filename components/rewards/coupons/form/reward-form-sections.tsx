"use client";

import React from "react";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { Input as UiInput } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";
import { RewardInfoSection } from "./sections/reward-info-section";
import { RewardEconomicsSection } from "./sections/reward-economics-section";
import { DeliveryFulfillmentSection } from "@/components/rewards/shared/delivery-fulfillment-section";

interface RewardFormSectionsProps {
  formik: any;
  rewardId?: string;
}

export function RewardFormSections({
  formik,
  rewardId,
}: RewardFormSectionsProps) {
  const { data: currencyConfig } = useGetEntityCurrencyConfig();

  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const err = (field: string) => {
    const isTouched = Boolean(formik.touched[field]);
    const errorMsg = formik.errors[field];
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
      {/* 1. Core Reward Details & Rich Identity */}
      <RewardInfoSection formik={formik} err={err} />

      {/* 2. Economics & Pricing Engine */}
      <RewardEconomicsSection
        formik={formik}
        currencyName={currencyName}
        err={err}
      />

      {/* 3. Delivery & Fulfillment (Shared Multi-Pillar Architecture) */}
      <DeliveryFulfillmentSection
        formik={formik}
        rewardId={rewardId}
        step={3}
        showSupplyLimits={true}
        pillarField="mechanism"
        err={err}
      />

      {/* ── Step 4: Member Eligibility & Guardrails (Merged) ───────────── */}
      <PolarisEligibilityCard
        key={`eligibility-${formik.values.memberEligibility || "ALL"}`}
        step={4}
        title="Member Eligibility & Guardrails"
        description="Specify which members can claim this reward and configure anti-abuse fraud restrictions."
        badge="Access & Security"
        eligibility={formik.values.memberEligibility || "ALL"}
        onEligibilityChange={(val) =>
          formik.setFieldValue("memberEligibility", val)
        }
        tierIds={
          formik.values.membershipTierId ||
          formik.values.eligibleTierIds ||
          []
        }
        onTierIdsChange={(tiers) => {
          formik.setFieldValue("membershipTierId", tiers);
          formik.setFieldValue("eligibleTierIds", tiers);
        }}
        userIds={formik.values.eligibleUserIds || []}
        onUserIdsChange={(users) => {
          formik.setFieldValue("eligibleUserIds", users);
        }}
        showToAllMembers={formik.values.showToAllMembers ?? true}
        onShowToAllMembersChange={(val) =>
          formik.setFieldValue("showToAllMembers", val)
        }
        errorMessage={
          formik.values.memberEligibility === "TIERS"
            ? err("membershipTierId") || err("eligibleTierIds")
            : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
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
                  value={formik.values.minAccountAge || ""}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "minAccountAge",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[13px] rounded-[6px] font-semibold text-[#303030] dark:text-zinc-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  Days
                </span>
              </div>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                Blocks newly registered accounts from claiming immediately.
              </p>
              {err("minAccountAge")}
            </div>

            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cooldownPeriod"
                  className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                >
                  Claim Cooldown Period
                </label>
                <span className="text-[11px] text-[#616161]">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="cooldownPeriod"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formik.values.cooldownPeriod || ""}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "cooldownPeriod",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[13px] rounded-[6px] font-semibold text-[#303030] dark:text-zinc-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  Hours
                </span>
              </div>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                Wait time before a member can claim this reward again.
              </p>
              {err("cooldownPeriod")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="minActivityRequired"
                  className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                >
                  Min Lifetime Points Required
                </label>
                <span className="text-[11px] text-[#616161]">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="minActivityRequired"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={
                    formik.values.minActivityRequired ||
                    formik.values.minActivity ||
                    ""
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    formik.setFieldValue("minActivityRequired", val);
                    formik.setFieldValue("minActivity", val);
                  }}
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[13px] rounded-[6px] font-semibold text-[#303030] dark:text-zinc-100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  PTS
                </span>
              </div>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                Minimum activity points required to unlock this reward.
              </p>
              {err("minActivityRequired")}
            </div>

            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label
                  htmlFor="blockWarnedUsers"
                  className="text-[13px] font-semibold text-[#303030] dark:text-zinc-200 cursor-pointer"
                >
                  Block Warned Members
                </label>
                <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                  Disallow members with active moderation warnings from
                  redeeming.
                </p>
              </div>
              <Switch
                id="blockWarnedUsers"
                checked={Boolean(formik.values.blockWarnedUsers)}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("blockWarnedUsers", checked)
                }
              />
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
              value={formik.values.eligibilityDescription || ""}
              onChange={(e) =>
                formik.setFieldValue("eligibilityDescription", e.target.value)
              }
              placeholder="e.g. Available only for verified VIP tier members"
              className="h-[36px] text-[13px] bg-white dark:bg-zinc-900 border-[#aeb4b9] rounded-[6px]"
            />
            <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
              Optional note displayed to members when explaining reward
              requirements.
            </p>
            {err("eligibilityDescription")}
          </div>
        </div>
      </PolarisEligibilityCard>
    </div>
  );
}
