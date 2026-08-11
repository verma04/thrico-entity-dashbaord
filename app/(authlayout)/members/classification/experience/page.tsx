"use client";

import React, { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ExperienceListView } from "../../../../../components/classfications/experience/experience-list-view";
import { ExperienceGraphView } from "../../../../../components/classfications/experience/experience-graph-view";

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  return (
    <>
      <ClassificationActionBar
        title="Experience Dashboard"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search companies..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <ExperienceListView search={debouncedSearch} />
        ) : (
          <ExperienceGraphView />
        )}
      </EcosystemContainer>
    </>
  );
}
