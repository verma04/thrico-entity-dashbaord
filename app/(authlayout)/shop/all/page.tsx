"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import ShopManage from "@/components/shop/manage/shop-manage";

function ShopPage() {
  return <ShopManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(ShopPage, "SHOP", "canRead"),
  "shop",
);
