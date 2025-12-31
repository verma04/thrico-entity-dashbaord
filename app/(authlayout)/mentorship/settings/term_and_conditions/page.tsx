"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const MentorshipTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="mentorship"
      title="Mentorship Terms & Conditions"
      description="Define the terms and conditions for your mentorship module"
      placeholder="Enter terms and conditions for mentorship. You can use rich text formatting to organize your terms..."
    />
  );
};

export default MentorshipTermsPage;
