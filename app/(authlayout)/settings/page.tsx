"use client";
import Identity from "@/components/settings/general/identity";
import { GeneralSettingsLayout } from "@/components/settings/general/general-settings-layout";
import React from "react";
import { GeneralSettingsAccess } from "./access";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Settings } from "lucide-react";

const page = () => {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="General Settings"
        description="Manage your account settings, preferences, and entity configuration."
        icon={Settings}
        badgeText="Settings"
        showLiveIndicator={false}
        breadcrumbs={[{ label: "Settings" }]}
      />
      <GeneralSettingsAccess>
        <GeneralSettingsLayout>
          <Identity />
        </GeneralSettingsLayout>
      </GeneralSettingsAccess>
    </EcosystemWrapper>
  );
};

export default page;
