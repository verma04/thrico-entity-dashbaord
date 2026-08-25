"use client";

import React from "react";
import { Label } from "@/components/ui/label";
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
        <p className="text-[11px] text-destructive font-medium mt-1 animate-in fade-in-50">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
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
            <Label className="text-xs font-semibold">Tier Display Label *</Label>
            <UiInput
              value={values.label || values.title || ""}
              onChange={(e) => {
                setFieldValue("label", e.target.value);
                setFieldValue("title", e.target.value);
              }}
              placeholder="e.g. 50 Points Scratch Card"
              className="h-10 text-sm"
            />
            {err("label")}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Card Accent Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={values.cardColor || "#4F46E5"}
                onChange={(e) => setFieldValue("cardColor", e.target.value)}
                className="h-9 w-12 rounded-lg border border-border cursor-pointer bg-transparent"
              />
              <span className="font-mono text-xs text-muted-foreground uppercase">
                {values.cardColor || "#4F46E5"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tierActiveSwitch" className="text-xs font-semibold cursor-pointer">
                Enable Tier in Scratch Engine
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Active tiers can be immediately won by eligible members
              </p>
            </div>
            <Switch
              id="tierActiveSwitch"
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
            ? (err("membershipTierId") || err("eligibleTierIds"))
            : values.memberEligibility === "SPECIFIC_CUSTOMERS"
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
                  value={values.minAccountAge || ""}
                  onChange={(e) =>
                    setFieldValue("minAccountAge", parseInt(e.target.value) || 0)
                  }
                  className="h-9 bg-background border-border text-xs shadow-none font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  Days
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Blocks newly registered accounts from winning immediately.
              </p>
              {err("minAccountAge")}
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="minActivity"
                  className="text-xs font-semibold text-foreground"
                >
                  Min Lifetime Points Required
                </Label>
                <span className="text-[10px] text-muted-foreground">0 = Off</span>
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
                  className="h-9 bg-background border-border text-xs shadow-none font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  PTS
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Minimum activity points required to unlock this tier.
              </p>
              {err("minActivity")}
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
              value={values.eligibilityDescription || ""}
              onChange={(e) =>
                setFieldValue("eligibilityDescription", e.target.value)
              }
              placeholder="e.g. Available only for verified VIP tier members"
              className="h-9 text-xs bg-background"
            />
            <p className="text-[10px] text-muted-foreground">
              Optional note displayed to members when explaining tier requirements.
            </p>
            {err("eligibilityDescription")}
          </div>
        </div>
      </PolarisEligibilityCard>
    </div>
  );
}
