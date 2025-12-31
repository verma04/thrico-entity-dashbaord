"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const ForumsTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="forums"
      title="Discussion Forum Terms & Conditions"
      description="Define the terms and conditions for your discussion forum"
      placeholder="Enter terms and conditions for the discussion forum. You can use rich text formatting to organize your terms..."
    />
  );
};

export default ForumsTermsPage;
