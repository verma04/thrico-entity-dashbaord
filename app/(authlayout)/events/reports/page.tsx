"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";

import { useModuleStore } from "@/store/useModuleStore";

function CommunityReportsPage() {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  return (
    <Reports 
      preselectedModule={ReportModule.EVENT} 
      breadcrumbs={[
        { label: moduleName, href: "/events" },
        { label: "Reports" }
      ]}
    />
  );
}

export default withSubscriptionCheck(
  withModulePermission(CommunityReportsPage, "EVENTS", "canRead"),
  "events"
);
