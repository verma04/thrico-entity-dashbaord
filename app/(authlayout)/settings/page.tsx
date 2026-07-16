import Identity from "@/components/settings/general/identity";
import { GeneralSettingsLayout } from "@/components/settings/general/general-settings-layout";
import React from "react";
import type { Metadata } from "next";
import { GeneralSettingsAccess } from "./access";

export const metadata: Metadata = {
  title: "General Settings",
  description:
    "Manage your account settings, preferences, and entity configuration.",
};

const page = () => {
  return (
    <GeneralSettingsAccess>
      <GeneralSettingsLayout>
        <Identity />
      </GeneralSettingsLayout>
    </GeneralSettingsAccess>
  );
};

export default page;
