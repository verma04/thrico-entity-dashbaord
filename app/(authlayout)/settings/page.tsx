import GeneralSettings from "@/components/settings/general/general-setting";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings, preferences, and entity configuration.",
};

const page = () => {
  return <GeneralSettings />;
};

export default page;
