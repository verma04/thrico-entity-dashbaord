"use client";

import React, { useState } from "react";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { AuthTextCard } from "../auth-text-card";
import { AuthLogoCard } from "../auth-logo-card";
import { LiveSignupPreview } from "../live-signup-preview";
import { useMemberCustomization } from "../member-customization-context";

export function AuthTextTabView() {
  const {
    formik,
    entityName,
    entityLogo,
    handleLogoChange,
    handleLogoAlignmentChange,
    handleLogoSizeChange,
  } = useMemberCustomization();

  const [activeScreen, setActiveScreen] = useState<"login" | "signup">("login");

  return (
    <PolarisFormLayout
      sidebar={
        <div className="sticky top-6">
          <LiveSignupPreview
            config={formik.values}
            entityName={entityName}
            activeTab={activeScreen}
            onTabChange={setActiveScreen}
            variant="branding"
          />
        </div>
      }
    >
      <div className="space-y-4">
        {/* Brand Logo Upload & Alignment Card */}
        <AuthLogoCard
          logo={formik.values.logo || formik.values.authTexts?.logo || ""}
          logoAlignment={
            formik.values.logoAlignment ||
            formik.values.authTexts?.logoAlignment ||
            "center"
          }
          logoSize={
            formik.values.logoSize ||
            formik.values.authTexts?.logoSize ||
            40
          }
          entityName={entityName}
          entityLogo={entityLogo}
          onChange={handleLogoChange}
          onAlignmentChange={handleLogoAlignmentChange}
          onSizeChange={handleLogoSizeChange}
        />

        {/* Auth Text & Voice Customization Card */}
        <AuthTextCard
          authTexts={formik.values.authTexts}
          entityName={entityName}
          activeSection={activeScreen}
          onSectionChange={setActiveScreen}
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
