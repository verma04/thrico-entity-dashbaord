"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const CommunityTermsAndConditionsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="communities"
      title="Community Terms & Conditions"
      description="Define the terms and conditions for your community module"
      placeholder="Enter terms and conditions for communities. You can use rich text formatting to organize your terms..."
    />
  );
};

export default CommunityTermsAndConditionsPage;
