"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import MomentsManage from "@/components/moments/manage/moments-manage";

function MomentsListPage() {
  return <MomentsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(MomentsListPage, "MOMENTS", "canRead"),
  "moments",
);
