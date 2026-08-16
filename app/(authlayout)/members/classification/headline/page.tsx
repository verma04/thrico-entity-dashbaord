"use client";

import React, { useState } from "react";
import { LayoutGrid, Network, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserHeadlineGraph } from "@/graphql/quries/headline/headline-queries";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";

import { HeadlineListView } from "../../../../../components/classfications/headline/headline-list-view";
import { HeadlineGraphView } from "../../../../../components/classfications/headline/headline-graph-view";

export default function HeadlinePage() {
  const [activeTab, setActiveTab] = useState("list");
  const [showExportModal, setShowExportModal] = useState(false);

  const { data } = useGetUserHeadlineGraph({
    variables: { limit: 100 },
  });
  const edges = data?.getUserHeadlineGraph || [];

  return (
    <>
      <ClassificationActionBar
        title="Headline Dashboard"
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
          <HeadlineListView />
        ) : (
          <HeadlineGraphView />
        )}
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="headlines"
        description="Export community member headline classifications as CSV."
        totalCount={edges.length}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (edges.length === 0) {
            toast.error("Nothing to export", { description: "No headline records found." });
            return;
          }
          const csv = buildCsv(edges, [
            { header: "Headline", getValue: (e: any) => e.headline?.title || "" },
            { header: "First Name", getValue: (e: any) => e.user?.firstName || "" },
            { header: "Last Name", getValue: (e: any) => e.user?.lastName || "" },
          ]);
          downloadCsv(csv, `headlines-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${edges.length} record${edges.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </>
  );
}
