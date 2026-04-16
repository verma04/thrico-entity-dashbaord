import Identity from "@/components/settings/general/identity";
import { GeneralSettingsLayout } from "@/components/settings/general/general-settings-layout";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Settings",
  description:
    "Manage your account settings, preferences, and entity configuration.",
};

const page = () => {
  return (
    <GeneralSettingsLayout>
      <Identity />
    </GeneralSettingsLayout>
  );
};

export default page;
