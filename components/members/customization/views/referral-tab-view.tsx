"use client";

import React from "react";
import { PolarisFormLayout, PolarisTipCard } from "@/components/gamification/shared/polaris-form-ui";
import { ReferralConfigCard } from "../referral-config-card";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";

export function ReferralTabView() {
  const { formik, entityName, handleReferralUpdate } = useMemberCustomization();

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <LiveSignupPreview config={formik.values} entityName={entityName} />
          <PolarisTipCard title="Viral Growth Strategy">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                • <strong>Optional Referrals:</strong> Leaving referral codes optional maximizes top-of-funnel conversion while still rewarding organic word-of-mouth invites.
              </p>
              <p>
                • <strong>Mandatory Referrals:</strong> Use mandatory mode for invite-only alpha communities or exclusive cohort access.
              </p>
            </div>
          </PolarisTipCard>
        </div>
      }
    >
      <div className="space-y-4">
        <ReferralConfigCard
          enabled={formik.values.referral.enabled}
          required={formik.values.referral.required}
          helperText={formik.values.referral.helperText}
          onUpdate={handleReferralUpdate}
        />
      </div>
    </PolarisFormLayout>
  );
}
