"use client";

import React, { useState } from "react";
import { LayoutGrid, Network, Upload } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { useGetUserEducationGraph } from "@/graphql/quries/education/education-queries";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

import { EducationListView } from "../../../../../components/classfications/education/education-list-view";
import { EducationGraphView } from "../../../../../components/classfications/education/education-graph-view";

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data } = useGetUserEducationGraph({
    variables: { limit: 100, search: debouncedSearch || undefined },
  });
  const edges = data?.getUserEducationGraph || [];

  return (
    <>
      <ClassificationActionBar
        title="Education Dashboard"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search schools..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <EducationListView search={debouncedSearch} />
        ) : (
          <EducationGraphView />
        )}
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="schools"
        description="Export community member school/education classifications as CSV."
        totalCount={edges.length}
        matchingCount={debouncedSearch.trim() ? edges.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (edges.length === 0) {
            toast.error("Nothing to export", { description: "No education records found." });
            return;
          }
          const csv = buildCsv(edges, [
            { header: "School", getValue: (e: any) => e.school?.title || "" },
            { header: "First Name", getValue: (e: any) => e.user?.firstName || "" },
            { header: "Last Name", getValue: (e: any) => e.user?.lastName || "" },
            { header: "Headline", getValue: (e: any) => e.user?.headline || "" },
          ]);
          downloadCsv(csv, `education-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${edges.length} record${edges.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </>
  );
}
