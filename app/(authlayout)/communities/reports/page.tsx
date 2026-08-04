"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function CommunityReportsPage() {
  const canEdit = useModulePermission("COMMUNITIES", "canEdit");
  const moduleName = useModuleStore((state) => state.communityModuleName);
  return (
    <Reports 
      preselectedModule={ReportModule.COMMUNITY} 
      canEdit={canEdit}
      breadcrumbs={[
        { label: moduleName, href: "/communities" },
        { label: "Reports" }
      ]}
    />
  );
}

export default withModulePermission(
  CommunityReportsPage,
  "COMMUNITIES",
  "canRead"
);

