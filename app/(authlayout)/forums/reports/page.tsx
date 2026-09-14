"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function CommunityReportsPage() {
  const forumModuleName = useModuleStore((state) => state.forumModuleName);

  return (
    <Reports
      preselectedModule={ReportModule.DISCUSSION_FORUM}
      breadcrumbs={[
        { label: forumModuleName, href: "/forums/all" },
        { label: "Reported Items" },
      ]}
      description={`View and manage reported ${forumModuleName.toLowerCase()} and flagged community content.`}
    />
  );
}

export default withSubscriptionCheck(
  withModulePermission(CommunityReportsPage, "FORUMS", "canRead"),
  "forums"
);
