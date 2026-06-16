"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function OfferReportsPage() {
  return <Reports preselectedModule={ReportModule.OFFER} />;
}

export default withSubscriptionCheck(
  withModulePermission(OfferReportsPage, "OFFERS", "canRead"),
  "offers"
);
