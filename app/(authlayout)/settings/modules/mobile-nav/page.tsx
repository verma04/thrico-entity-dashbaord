import React from "react";
import MobileNavTab from "@/components/settings/modules/mobile-nav-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Navigation - Modules - Settings",
  description: "Configure and sequence items shown in your mobile navigation bar.",
};

const MobileNavPage = () => {
  return <MobileNavTab />;
};

export default MobileNavPage;
