"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function CommunityReportsPage() {
  return (
    <Reports
      preselectedModule={ReportModule.USER}
      breadcrumbs={[{ label: "Members", href: "/members" }, { label: "Reports" }]}
    />
  );
}

export default withModulePermission(
  CommunityReportsPage,
  "MEMBERS_REPORTS",
  "canRead",
);
