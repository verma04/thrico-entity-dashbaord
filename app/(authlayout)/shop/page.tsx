"use client";

import { Suspense } from "react";
import ShopDashboard from "@/components/shop/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

/**
 * Commerce & Shop Dashboard Page
 * Route: /shop
 */
function ShopDashboardPage() {
  return (
    <Suspense fallback={null}>
      <ShopDashboard />
    </Suspense>
  );
}

export default withSubscriptionCheck(
  withModulePermission(ShopDashboardPage, "SHOP", "canRead"),
  "shop"
);
