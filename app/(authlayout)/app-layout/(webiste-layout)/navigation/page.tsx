import NavigationManager from "@/components/settings/website-admin/navigation-manager";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Navigation Settings",
  description: "Configure your website navigation menu, links, and structure.",
};

const page = () => {
  return <NavigationManager />;
};

export default page;
