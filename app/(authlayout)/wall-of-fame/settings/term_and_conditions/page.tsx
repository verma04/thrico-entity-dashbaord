"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const WallOfFameTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="wall-of-fame"
      title="Wall of Fame Terms & Conditions"
      description="Define the terms and conditions for your wall of fame"
      placeholder="Enter terms and conditions for wall of fame..."
    />
  );
};

export default WallOfFameTermsPage;
