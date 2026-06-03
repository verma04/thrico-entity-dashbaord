"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const PollsFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="polls"
      title="Polls FAQs"
      description="Manage frequently asked questions for the polls module"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(PollsFaqPage, "POLLS", "canEdit"),
  "polls"
);
