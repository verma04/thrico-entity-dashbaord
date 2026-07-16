"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const ShopFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="shop"
      title="Shop FAQs"
      description="Manage frequently asked questions for the shop module"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(ShopFaqPage, "SHOP", "canEdit"),
  "shop"
);
