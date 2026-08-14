"use client";

import React from "react";
import { ModuleFaqListManager } from "@/components/common/module-faq-manager";
import { useModuleStore } from "@/store/useModuleStore";

const CommunityFaqPage = () => {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  return (
    <ModuleFaqListManager
      moduleName="communities"
      title={`${moduleName} Knowledge Base`}
      description={`Manage frequently asked questions and user documentation for your ${moduleName.toLowerCase()} ecosystem.`}
    />
  );
};

export default CommunityFaqPage;
