"use client";

import React from "react";
import { Network } from "lucide-react";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { JobsGraphView } from "@/components/jobs/jobs-graph-view";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function JobsGraphPage() {
  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-border"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <h2 className="text-sm font-semibold text-foreground px-2">
              Jobs Graph
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
        <JobsGraphView />
      </EcosystemContainer>
    </>
  );
}

export default withModulePermission(
  JobsGraphPage,
  "JOBS",
  "canRead"
);
