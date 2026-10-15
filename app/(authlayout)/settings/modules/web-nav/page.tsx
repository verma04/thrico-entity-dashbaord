import React from "react";
import WebNavTab from "@/components/settings/modules/web-nav-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Navigation - Modules - Settings",
  description: "Configure and sequence items shown in your web navigation header and sidebar.",
};

const WebNavPage = () => {
  return <WebNavTab />;
};

export default WebNavPage;
