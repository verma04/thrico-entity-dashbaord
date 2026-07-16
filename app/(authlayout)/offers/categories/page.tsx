"use client";

import React from "react";
import { CategoriesManager } from "@/components/offers/categories-manager";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function CategoriesPage() {
  return <CategoriesManager />;
}

export default withSubscriptionCheck(
  withModulePermission(CategoriesPage, "OFFERS", "canRead"),
  "offers"
);
