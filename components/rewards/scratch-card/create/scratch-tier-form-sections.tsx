"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import {
  PolarisFormCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
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
        <p className="text-[12px] text-[#d72c0d] font-normal mt-0.5 leading-[16px]">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3.5">
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
        <div className="space-y-3.5">
          <PolarisInput
            id="label"
            label="Tier Display Label"
            required
            value={values.label || values.title || ""}
            onChange={(e) => {
              setFieldValue("label", e.target.value);
              setFieldValue("title", e.target.value);
            }}
            placeholder="e.g. 50 Points Scratch Card"
            error={touched.label && errors.label ? String(errors.label) : undefined}
          />

          <div className="space-y-1.5 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisLabel>Card Accent Color</PolarisLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={values.cardColor || "#4F46E5"}
                onChange={(e) => setFieldValue("cardColor", e.target.value)}
                className="h-6 w-8 rounded-[4px] border border-[#aeb4b9] cursor-pointer bg-transparent"
              />
              <span className="font-mono text-[11px] text-[#616161] uppercase">
                {values.cardColor || "#4F46E5"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                Enable Tier in Scratch Engine
              </span>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
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
              helperText="Blocks newly registered accounts from winning immediately."
              value={values.minAccountAge || ""}
              onChange={(e) =>
                setFieldValue(
                  "minAccountAge",
                  parseInt(e.target.value) || 0,
                )
              }
              error={touched.minAccountAge && errors.minAccountAge ? String(errors.minAccountAge) : undefined}
            />

            <PolarisInput
              id="minActivity"
              type="number"
              min={0}
              label="Min Lifetime Points Required"
              placeholder="0 (Off)"
              suffix="PTS"
              helperText="Minimum activity points required to unlock this tier."
              value={values.minActivity || ""}
              onChange={(e) =>
                setFieldValue("minActivity", parseInt(e.target.value) || 0)
              }
              error={touched.minActivity && errors.minActivity ? String(errors.minActivity) : undefined}
            />
          </div>

          <PolarisInput
            id="eligibilityDescription"
            label="Eligibility & Gating Note"
            placeholder="e.g. Available only for verified VIP tier members"
            helperText="Optional note displayed to members when explaining tier requirements."
            value={values.eligibilityDescription || ""}
            onChange={(e) =>
              setFieldValue("eligibilityDescription", e.target.value)
            }
            error={touched.eligibilityDescription && errors.eligibilityDescription ? String(errors.eligibilityDescription) : undefined}
          />
        </div>
      </PolarisEligibilityCard>
    </div>
  );
}
