"use client";

import React from "react";
import { PolarisFormLayout, PolarisTipCard } from "@/components/gamification/shared/polaris-form-ui";
import { AuthTextCard } from "../auth-text-card";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";

export function AuthTextTabView() {
  const { formik, entityName } = useMemberCustomization();

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <LiveSignupPreview config={formik.values} entityName={entityName} />
          <PolarisTipCard title="Copywriting & Brand Voice">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                • <strong>Distinct Identity:</strong> Customize your login and signup headers to match your community tone and brand.
              </p>
              <p>
                • <strong>Clear Value Proposition:</strong> Keep descriptions concise so new visitors immediately understand the community value.
              </p>
            </div>
          </PolarisTipCard>
        </div>
      }
    >
      <div className="space-y-4">
        <AuthTextCard
          authTexts={formik.values.authTexts}
          onChange={(updates) =>
            formik.setFieldValue("authTexts", {
              ...formik.values.authTexts,
              ...updates,
            })
          }
        />
      </div>
    </PolarisFormLayout>
  );
}
