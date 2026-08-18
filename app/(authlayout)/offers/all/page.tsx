"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import OffersManage from "@/components/offers/manage/offers-manage";

function AllOffersPage() {
  return <OffersManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(AllOffersPage, "OFFERS", "canRead"),
  "offers",
);
