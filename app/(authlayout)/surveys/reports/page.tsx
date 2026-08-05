"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { BarChart3 } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

function CommunityReportsPage() {
  const singularName = useModuleStore((state) => state.surveySingularName);

  return (
    <EcosystemWrapper anonymized-1="survey-reports">
      <EcosystemHeader
        title="Survey Reports"
        badgeText="Analytics"
        description={`View analytics, engagement data, and comprehensive reports for your ${singularName.toLowerCase()}s.`}
        icon={BarChart3}
        breadcrumbs={[
          { label: "Surveys", href: "/surveys/all" },
          { label: "Reports" },
        ]}
      />
      <EcosystemContainer className="p-0 border-none shadow-none bg-transparent ring-0">
        <Reports preselectedModule={ReportModule.SURVEY} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CommunityReportsPage, "SURVEYS", "canRead"),
  "surveys"
);
