"use client";

import React from "react";
import { Network } from "lucide-react";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CommunitiesGraphView } from "@/components/communities/communities-graph-view";
import { withModulePermission } from "@/components/hoc/with-module-permission";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { useModuleStore } from "@/store/useModuleStore";

function CommunitiesGraphPage() {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${moduleName} Graph`}
        badgeText="Visualization"
        description={`Interactive graph visualization of your ${moduleName.toLowerCase()}.`}
        icon={Network}
        breadcrumbs={[
          { label: moduleName, href: "/communities" },
          { label: "Graph" },
        ]}
      />

      <EcosystemActionBar shadow="none" className="">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <h2 className="text-sm font-semibold text-foreground px-2">
              Communities Graph
            </h2>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <div className="h-9 p-0.5 bg-muted/60 rounded-lg flex items-center px-3 text-xs font-semibold gap-1.5 bg-background shadow-sm border border-border">
            <Network className="h-3.5 w-3.5" />
            Graph View
          </div>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <CommunitiesGraphView />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(
  CommunitiesGraphPage,
  "COMMUNITIES",
  "canRead",
);
