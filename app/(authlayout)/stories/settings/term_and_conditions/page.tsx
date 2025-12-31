"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const StoriesTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="stories"
      title="Stories Terms & Conditions"
      description="Define the terms and conditions for your stories module"
      placeholder="Enter terms and conditions for stories. You can use rich text formatting to organize your terms..."
    />
  );
};

export default StoriesTermsPage;
