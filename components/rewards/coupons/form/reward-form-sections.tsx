"use client";

import React from "react";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { Label } from "@/components/ui/label";
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
        <p className="text-[11px] text-destructive font-medium mt-1 animate-in fade-in-50">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
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
        tierIds={formik.values.membershipTierId || formik.values.eligibleTierIds || []}
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
            ? (err("membershipTierId") || err("eligibleTierIds"))
            : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
              ? err("eligibleUserIds")
              : null
        }
      >
        {/* Embedded Anti-Abuse Guardrails */}
        <div className="pt-3 border-t border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground block">
              Anti-Abuse & Gating Guardrails
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Optional fraud protection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="minAccountAge"
                  className="text-xs font-semibold text-foreground"
                >
                  Min Account Age (Days)
                </Label>
                <span className="text-[10px] text-muted-foreground">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="minAccountAge"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formik.values.minAccountAge || ""}
                  onChange={(e) =>
                    formik.setFieldValue("minAccountAge", parseInt(e.target.value) || 0)
                  }
                  className="h-9 bg-background border-border text-xs shadow-none font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  Days
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Blocks newly registered accounts from claiming immediately.
              </p>
              {err("minAccountAge")}
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="cooldownPeriod"
                  className="text-xs font-semibold text-foreground"
                >
                  Claim Cooldown Period
                </Label>
                <span className="text-[10px] text-muted-foreground">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="cooldownPeriod"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formik.values.cooldownPeriod || ""}
                  onChange={(e) =>
                    formik.setFieldValue("cooldownPeriod", parseInt(e.target.value) || 0)
                  }
                  className="h-9 bg-background border-border text-xs shadow-none font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  Hours
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Wait time before a member can claim this reward again.
              </p>
              {err("cooldownPeriod")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="minActivityRequired"
                  className="text-xs font-semibold text-foreground"
                >
                  Min Lifetime Points Required
                </Label>
                <span className="text-[10px] text-muted-foreground">0 = Off</span>
              </div>
              <div className="relative">
                <UiInput
                  id="minActivityRequired"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={formik.values.minActivityRequired || formik.values.minActivity || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    formik.setFieldValue("minActivityRequired", val);
                    formik.setFieldValue("minActivity", val);
                  }}
                  className="h-9 bg-background border-border text-xs shadow-none font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  PTS
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Minimum activity points required to unlock this reward.
              </p>
              {err("minActivityRequired")}
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="blockWarnedUsers"
                  className="text-xs font-semibold text-foreground cursor-pointer"
                >
                  Block Warned Members
                </Label>
                <p className="text-[10px] text-muted-foreground">
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

          <div className="space-y-1.5 pt-0.5">
            <Label
              htmlFor="eligibilityDescription"
              className="text-xs font-semibold text-foreground"
            >
              Eligibility & Gating Note
            </Label>
            <UiInput
              id="eligibilityDescription"
              value={formik.values.eligibilityDescription || ""}
              onChange={(e) =>
                formik.setFieldValue("eligibilityDescription", e.target.value)
              }
              placeholder="e.g. Available only for verified VIP tier members"
              className="h-9 text-xs bg-background"
            />
            <p className="text-[10px] text-muted-foreground">
              Optional note displayed to members when explaining reward requirements.
            </p>
            {err("eligibilityDescription")}
          </div>
        </div>
      </PolarisEligibilityCard>
    </div>
  );
}
