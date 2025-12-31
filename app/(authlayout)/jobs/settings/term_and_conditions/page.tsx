"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const JobsTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="jobs"
      title="Jobs Terms & Conditions"
      description="Define the terms and conditions for your jobs module"
      placeholder="Enter terms and conditions for jobs. You can use rich text formatting to organize your terms..."
    />
  );
};

export default JobsTermsPage;
