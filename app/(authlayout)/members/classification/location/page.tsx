"use client";

import React, { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LocationListView } from "../../../../../components/classfications/location/location-list-view";
import { LocationGraphView } from "../../../../../components/classfications/location/location-graph-view";

export default function LocationPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  return (
    <>
      <ClassificationActionBar
        title="Location Dashboard"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search locations..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <LocationListView search={debouncedSearch} />
        ) : (
          <LocationGraphView />
        )}
      </EcosystemContainer>
    </>
  );
}
