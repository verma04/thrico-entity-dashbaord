"use client";

import React from "react";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { Switch } from "@/components/ui/switch";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";
import { PolarisInput, PolarisLabel } from "@/components/gamification/shared/polaris-form-ui";
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
        <p className="text-[12px] text-[#d72c0d] font-normal mt-0.5 leading-[16px]">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3.5">
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
        <div className="pt-2.5 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
              Anti-Abuse & Gating Guardrails
            </span>
            <span className="text-[11px] text-[#616161]">
              Optional fraud protection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <PolarisInput
              id="minAccountAge"
              type="number"
              min={0}
              label="Min Account Age (Days)"
              placeholder="0 (Off)"
              suffix="DAYS"
              helperText="Blocks newly registered accounts from claiming immediately."
              value={formik.values.minAccountAge || ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "minAccountAge",
                  parseInt(e.target.value) || 0,
                )
              }
              onBlur={formik.handleBlur}
              error={formik.touched.minAccountAge && formik.errors.minAccountAge ? String(formik.errors.minAccountAge) : undefined}
            />

            <PolarisInput
              id="cooldownPeriod"
              type="number"
              min={0}
              label="Claim Cooldown Period"
              placeholder="0 (Off)"
              suffix="HRS"
              helperText="Wait time before a member can claim this reward again."
              value={formik.values.cooldownPeriod || ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "cooldownPeriod",
                  parseInt(e.target.value) || 0,
                )
              }
              onBlur={formik.handleBlur}
              error={formik.touched.cooldownPeriod && formik.errors.cooldownPeriod ? String(formik.errors.cooldownPeriod) : undefined}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <PolarisInput
              id="minActivityRequired"
              type="number"
              min={0}
              label="Min Lifetime Points Required"
              placeholder="0 (Off)"
              suffix="PTS"
              helperText="Minimum activity points required to unlock this reward."
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
              onBlur={formik.handleBlur}
              error={formik.touched.minActivityRequired && formik.errors.minActivityRequired ? String(formik.errors.minActivityRequired) : undefined}
            />

            <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <PolarisLabel htmlFor="blockWarnedUsers">
                  Block Warned Members
                </PolarisLabel>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Disallow members with active moderation warnings from redeeming.
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

          <PolarisInput
            id="eligibilityDescription"
            label="Eligibility & Gating Note"
            placeholder="e.g. Available only for verified VIP tier members"
            helperText="Optional note displayed to members when explaining reward requirements."
            value={formik.values.eligibilityDescription || ""}
            onChange={(e) =>
              formik.setFieldValue("eligibilityDescription", e.target.value)
            }
            onBlur={formik.handleBlur}
            error={formik.touched.eligibilityDescription && formik.errors.eligibilityDescription ? String(formik.errors.eligibilityDescription) : undefined}
          />
        </div>
      </PolarisEligibilityCard>
    </div>
  );
}
