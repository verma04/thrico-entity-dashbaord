"use client";

import React from "react";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";
import { RewardInfoSection } from "./sections/reward-info-section";
import { RewardEconomicsSection } from "./sections/reward-economics-section";
import { DeliveryFulfillmentSection } from "@/components/rewards/shared/delivery-fulfillment-section";
import { RewardGuardrailsSection } from "./sections/reward-guardrails-section";

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

      {/* 4. Member Eligibility & Access Controls */}
      <PolarisEligibilityCard
        step={4}
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
      />

      {/* 5. Anti-Abuse & Guardrails */}
      <RewardGuardrailsSection formik={formik} err={err} />
    </div>
  );
}

