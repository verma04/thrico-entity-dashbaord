"use client";

import React, { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { HeadlineListView } from "../../../../../components/classfications/headline/headline-list-view";
import { HeadlineGraphView } from "../../../../../components/classfications/headline/headline-graph-view";

export default function HeadlinePage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-border"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <h2 className="text-sm font-semibold text-foreground px-2">
              Headline Dashboard
            </h2>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          {/* View toggle */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-9 p-0.5 bg-muted/60 rounded-lg">
              <TabsTrigger
                value="list"
                className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                List
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Network className="h-3.5 w-3.5" />
                Graph
              </TabsTrigger>
            </TabsList>
          </Tabs>

        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <HeadlineListView />
        ) : (
          <HeadlineGraphView />
        )}
      </EcosystemContainer>
    </>
  );
}
