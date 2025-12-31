"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const GamificationTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="gamification"
      title="Gamification Terms & Conditions"
      description="Define the terms and conditions for your gamification module"
      placeholder="Enter terms and conditions for gamification..."
    />
  );
};

export default GamificationTermsPage;
