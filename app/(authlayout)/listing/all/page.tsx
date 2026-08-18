"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import ListingsManage from "@/components/listings/manage/listings-manage";

function ListingsAllPage() {
  return <ListingsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(ListingsAllPage, "LISTING", "canRead"),
  "listing",
);
