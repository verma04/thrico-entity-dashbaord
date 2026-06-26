"use client";

import React from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Network } from "lucide-react";
import { OpportunitiesGraphView } from "@/components/opportunities/opportunities-graph-view";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const OpportunitiesGraphsPage = () => {
  return (
    <EcosystemWrapper anonymized-1="opportunities-graph">
      <EcosystemHeader
        title="Opportunities Graph"
        description="Visualize the connections between opportunities, creators, and required skills."
        badgeText="Graph View"
        icon={Network}
      />
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <OpportunitiesGraphView />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(OpportunitiesGraphsPage, "OPPORTUNITIES", "canRead");
