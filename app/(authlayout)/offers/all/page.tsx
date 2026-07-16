"use client";

import React from "react";
import { OffersManager } from "@/components/offers/offers-manager";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function AllOffersPage() {
  return <OffersManager />;
}

export default withSubscriptionCheck(
  withModulePermission(AllOffersPage, "OFFERS", "canRead"),
  "offers"
);
