"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

const OffersFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="offers"
      title="Offers FAQs"
      description="Manage frequently asked questions for the offers module"
    />
  );
};

export default withSubscriptionCheck(
  withModulePermission(OffersFaqPage, "OFFERS", "canEdit"),
  "offers"
);
