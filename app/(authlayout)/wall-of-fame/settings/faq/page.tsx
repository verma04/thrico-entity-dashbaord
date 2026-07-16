"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const WallOfFameFaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="wall-of-fame"
      title="Wall of Fame FAQs"
      description="Manage frequently asked questions for wall of fame"
    />
  );
};



export default withSubscriptionCheck(
  withModulePermission(WallOfFameFaqPage, "WALL_OF_FAME", "canEdit"),
  "wall-of-fame"
);
