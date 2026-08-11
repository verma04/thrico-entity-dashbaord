"use client";

import React, { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EducationListView } from "../../../../../components/classfications/education/education-list-view";
import { EducationGraphView } from "../../../../../components/classfications/education/education-graph-view";

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  return (
    <>
      <ClassificationActionBar
        title="Education Dashboard"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search schools..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <EducationListView search={debouncedSearch} />
        ) : (
          <EducationGraphView />
        )}
      </EcosystemContainer>
    </>
  );
}
