"use client";

import React from "react";
import { PolarisFormLayout, PolarisTipCard } from "@/components/gamification/shared/polaris-form-ui";
import { AuthProtocolCard } from "../auth-protocol-card";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";

export function AuthProtocolTabView() {
  const { formik, entityName, handleAuthMethodChange } = useMemberCustomization();

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <LiveSignupPreview config={formik.values} entityName={entityName} />
          <PolarisTipCard title="Authentication Best Practice">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                • <strong>Dual Auth (Email + Google):</strong> Offering both Google SSO and Email OTP typically yields up to <strong>35% higher signup completion rates</strong>.
              </p>
              <p>
                • <strong>Workspace Gating:</strong> Organizations targeting corporate teams can restrict authentication to Google SSO with domain-matched accounts.
              </p>
            </div>
          </PolarisTipCard>
        </div>
      }
    >
      <div className="space-y-4">
        <AuthProtocolCard
          authMethod={formik.values.authMethod}
          onChange={handleAuthMethodChange}
        />
      </div>
    </PolarisFormLayout>
  );
}
