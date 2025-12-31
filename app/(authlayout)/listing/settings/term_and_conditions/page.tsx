"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const ListingTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="listing"
      title="Listing Terms & Conditions"
      description="Define the terms and conditions for your listing module"
      placeholder="Enter terms and conditions for listings. You can use rich text formatting to organize your terms..."
    />
  );
};

export default ListingTermsPage;
