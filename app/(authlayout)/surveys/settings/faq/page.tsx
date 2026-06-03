"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const SurveysFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="surveys"
      title="Surveys FAQs"
      description="Manage frequently asked questions for the surveys module"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(SurveysFaqPage, "SURVEYS", "canEdit"),
  "surveys"
);
