"use client";

import React, { useState } from "react";
import { LayoutGrid, Network } from "lucide-react";
import { useDebounce } from "use-debounce";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
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
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-border"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <h2 className="text-sm font-semibold text-foreground px-2 whitespace-nowrap">
              Location Dashboard
            </h2>
          </EcosystemActionBar.Item>
          
          <EcosystemActionBar.Item grow className="max-w-[360px] pl-4">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search locations..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          {/* View toggle */}
          <EcosystemActionBar.ViewToggle
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { id: "list", label: "List", icon: LayoutGrid },
              { id: "graph", label: "Graph", icon: Network },
            ]}
          />

        </EcosystemActionBar.Group>
      </EcosystemActionBar>

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
