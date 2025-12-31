"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const ShopTermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="shop"
      title="Shop Terms & Conditions"
      description="Define the terms and conditions for your shop module"
      placeholder="Enter terms and conditions for shop. You can use rich text formatting to organize your terms..."
    />
  );
};

export default ShopTermsPage;
