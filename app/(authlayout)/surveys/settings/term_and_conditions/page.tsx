"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const SurveysTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="surveys"
      title="Surveys Terms & Conditions"
      description="Define the terms and conditions for your surveys module"
      placeholder="Enter terms and conditions for surveys. You can use rich text formatting to organize your terms..."
    />
  );
};

export default SurveysTermsPage;
