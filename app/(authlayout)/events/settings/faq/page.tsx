"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const EventsFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="events"
      title="Events FAQs"
      description="Manage frequently asked questions for the events module"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(EventsFaqPage, "EVENTS", "canEdit"),
  "events"
);
