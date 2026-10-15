import React from "react";
import RegistryTab from "@/components/settings/modules/registry-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modules - Settings",
  description: "Activate, configure and sequence modular capabilities across your entity.",
};

const ModulesRegistryPage = () => {
  return <RegistryTab />;
};

export default ModulesRegistryPage;
