"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const PollsTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="polls"
      title="Polls Terms & Conditions"
      description="Define the terms and conditions for your polls module"
      placeholder="Enter terms and conditions for polls. You can use rich text formatting to organize your terms..."
    />
  );
};

export default PollsTermsPage;
