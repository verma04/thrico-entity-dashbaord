"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const MentorshipFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="mentorship"
      title="Mentorship FAQs"
      description="Manage frequently asked questions for the mentorship module"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(MentorshipFaqPage, "MENTORSHIP", "canEdit"),
  "mentorship"
);
