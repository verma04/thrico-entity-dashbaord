"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import OpportunitiesManage from "@/components/opportunities/manage/opportunities-manage";

function OpportunitiesAllPage() {
  return <OpportunitiesManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(OpportunitiesAllPage, "OPPORTUNITIES", "canRead"),
  "opportunities",
);
