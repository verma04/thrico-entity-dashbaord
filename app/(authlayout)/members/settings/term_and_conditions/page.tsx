"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const MembersTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="members"
      title="Members Terms & Conditions"
      description="Define the terms and conditions for your members module"
      placeholder="Enter terms and conditions for members. You can use rich text formatting to organize your terms..."
    />
  );
};

export default MembersTermsPage;
