"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const ForumsFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="forums"
      title="Discussion Forum FAQs"
      description="Manage frequently asked questions for the discussion forum"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(ForumsFaqPage, "FORUMS", "canEdit"),
  "forums"
);
