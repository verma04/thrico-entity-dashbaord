"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const OffersTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="offers"
      title="Offers Terms & Conditions"
      description="Define the terms and conditions for your offers module"
      placeholder="Enter terms and conditions for offers. You can use rich text formatting to organize your terms..."
    />
  );
};

export default OffersTermsPage;
