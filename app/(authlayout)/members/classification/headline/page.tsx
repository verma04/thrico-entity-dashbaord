"use client";

import React, { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { HeadlineListView } from "../../../../../components/classfications/headline/headline-list-view";
import { HeadlineGraphView } from "../../../../../components/classfications/headline/headline-graph-view";

export default function HeadlinePage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <>
      <ClassificationActionBar
        title="Headline Dashboard"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
