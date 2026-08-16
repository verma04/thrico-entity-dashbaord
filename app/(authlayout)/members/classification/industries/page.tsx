"use client";

import React, { useState } from "react";
import {
  useGetIndustries,
  useAddIndustry,
  useUpdateIndustry,
  useDeleteIndustry,
  Industry,
  useBulkAddIndustries,
} from "@/graphql/quries/industries/industry-queries";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, LayoutGrid, Network, Upload } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CtaButton } from "@/components/ui/cta-button";

import { IndustryDialog } from "../../../../../components/classfications/industries/industry-dialog";
import { IndustriesListView } from "../../../../../components/classfications/industries/industries-list-view";
import { IndustriesGraphView } from "../../../../../components/classfications/industries/industries-graph-view";
import { RECOMMENDED_INDUSTRIES } from "../../../../../components/classfications/industries/recommended-industries";

export default function IndustriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, loading, refetch } = useGetIndustries({
    variables: { search: debouncedSearch, limit: 100 },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("list");
  const [showExportModal, setShowExportModal] = useState(false);

  const [addIndustry, { loading: creating }] = useAddIndustry({
    onCompleted: () => {
      notify.success("Industry created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to create industry"),
  });

  const [updateIndustry, { loading: updating }] = useUpdateIndustry({
    onCompleted: () => {
      notify.success("Industry updated successfully");
      setIsDialogOpen(false);
      setEditingIndustry(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to update industry"),
  });

  const [deleteIndustry, { loading: deleting }] = useDeleteIndustry({
    onCompleted: () => {
      notify.success("Industry deleted successfully");
      setIndustryToDelete(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to delete industry"),
  });

  const [bulkAddIndustries, { loading: bulkAdding }] = useBulkAddIndustries({
    onCompleted: (res) => {
      const addedCount = res.bulkAddIndustries?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} industries`);
      } else {
        notify.info("All recommended industries already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add industries"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingIndustry) {
      await updateIndustry({
        variables: { input: { id: editingIndustry.id, title: values.title } },
      });
    } else {
      await addIndustry({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!industryToDelete) return;
    await deleteIndustry({
      variables: { input: { id: industryToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddIndustries({
      variables: { input: { titles: RECOMMENDED_INDUSTRIES } },
    });
  };

  const industries = data?.getIndustries || [];

  return (
    <>
      <ClassificationActionBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search industries..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <>
            <CtaButton
              variant="outline"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Add Recommended
            </CtaButton>
            <CtaButton
              onClick={() => {
                setEditingIndustry(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Industry
            </CtaButton>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </>
        }
        statusText={`${industries.length} Industries`}
        statusActive={industries.length > 0}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <IndustriesListView
            industries={industries}
            isLoading={loading}
            onEdit={(industry) => {
              setEditingIndustry(industry);
              setIsDialogOpen(true);
            }}
            onDelete={(industry) => setIndustryToDelete(industry)}
          />
        ) : (
          <IndustriesGraphView />
        )}
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <IndustryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingIndustry={editingIndustry}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!industryToDelete}
        onOpenChange={(open) => !open && setIndustryToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the industry{" "}
              <span className="font-bold text-foreground">
                "{industryToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-border"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Industry"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="industries"
        description="Export community member industry classifications as CSV."
        totalCount={industries.length}
        matchingCount={debouncedSearch.trim() ? industries.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (industries.length === 0) {
            toast.error("Nothing to export", { description: "No industries found." });
            return;
          }
          const csv = buildCsv(industries, [
            { header: "Industry Title", getValue: (ind) => ind.title || "" },
            { header: "Created At", getValue: (ind) => ind.createdAt ? new Date(ind.createdAt).toISOString().slice(0, 10) : "" },
            { header: "Updated At", getValue: (ind) => ind.updatedAt ? new Date(ind.updatedAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `industries-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${industries.length} industr${industries.length !== 1 ? "ies" : "y"} exported.` });
        }}
      />
    </>
  );
}
