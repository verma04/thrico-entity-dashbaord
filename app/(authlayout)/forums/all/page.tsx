"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import ForumsManage from "@/components/forums/manage/forums-manage";

function ForumsAllPage() {
  return <ForumsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(ForumsAllPage, "FORUMS", "canRead"),
  "forums",
);
