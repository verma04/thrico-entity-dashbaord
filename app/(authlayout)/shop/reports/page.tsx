"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";

function CommunityReportsPage() {
  return <Reports preselectedModule={ReportModule.SHOP} />;
}

export default withSubscriptionCheck(
  withModulePermission(CommunityReportsPage, "SHOP", "canRead"),
  "shop"
);
